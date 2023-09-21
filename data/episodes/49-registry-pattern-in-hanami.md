---
id: 44
aliases: []
author: "fiachetti"
topics: []
title: "How the Registry Pattern is applied in Hanami"
excerpt: "Understanding how the Registry Pattern is used in Hanami by porting and configuring a Ruby application"
videoId: --
published: false
publishedAt: "2023-05-09"
modifiedAt: "2023-05-09"
thumbnail:
  full: /images/episodes/44/cover-full.jpeg
  big: /images/episodes/44/cover-big.jpeg
  small: /images/episodes/44/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1656013134035918877
  mastodon: https://ruby.social/@hanamimastery/110340379572394441
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/13d34bu/lets_make_a_blog_with_bridgetown_hanami_mastery/
source: https://github.com/hanamimastery/episodes/tree/main/044
---

# Introduction

I ported a tiny Todo app using to Hanami.\[shot 1\]

It has been written as a plain ruby application and it\'s not written using the Hanami way.\[shot 2\]

One challenge it faces is the complex web of dependency management, where certain objects are frequently that get passed around to multiple components.

Lets take for example, the database. We have our main object, the `TodoApp`{.verbatim}.\[shot 3\] It has an instance creation method\[shot 4\] which returns a new instance of the application\[shot 5\] and it receives the database as an argument.\[shot 6\]

Then, on the initializer,\[shot 7\] it assigns this database instance.\[shot 8\] Subsequently, methods like `todo_tasks`{.verbatim} \[shot 9\]and `done_tasks`{.verbatim} create a new `TaskList`{.verbatim} object,\[shot 10\] which also receives the database instance on it\'s `load`{.verbatim} method.\[shot 11\]

``` ruby
module MyTaskList
  class TodoApp
    def self.load(db:)
      new(db: db)
    end

    # ...

    private

    attr_reader :db

    def initialize(db:)
      @db = db
    end

    # ...
  end
end
```

We\'ve passed the database to two classes so far. As I said before, this is a tiny app, and by that, I mean that it\'s an application that implements, at it\'s core, only four classes.\[shot 12\]

At this rate, if we keep growing it, we\'ll end up passing the database to several objects.

``` {.bash org-language="sh"}
tree lib
lib
├── database.rb
├── task_list.rb
├── task.rb
└── todo_app.rb
```

# Dry-system

This dependency management problem can get very complex very quickly.

But Hanami provides us with a solution: dependency injection using [dry-system](https://dry-rb.org/gems/dry-system/1.0/).\[shot 13\]

To use the `dry-system`{.verbatim} integration, we first need to create a `provider`{.verbatim} under the `config/providers`{.verbatim} directory.\[shot 14\]

``` {.bash org-language="sh"}
$ mkdir config/providers
```

Since on the `TodoApp`{.verbatim} class we access the database through the `db`{.verbatim} attribute reader,\[shot 15\] we\'ll call our provider with the same name. Let\'s create de `db.rb`{.verbatim} file\[shot 16\]

``` {.bash org-language="sh"}
$ touch config/providers/db.rb
```

Inside this file, we register a new provider\[shot 17\] called `:db`{.verbatim} \[shot 18\] and we pass it a block.\[shot 19\]

Then we call the start method\[shot 20\] and on it\'s block,\[shot 21\] we create the database instance.\[shot 22\]

Finally, we register\[shot 23\] the `db`{.verbatim} \[shot 24\] provider, passing in our `mongo_db`{.verbatim} object.\[shot 25\]

``` ruby
Hanami.app.register_provider(:db) do
  start do
    mongo_db = MyTaskList::Database.load

    register "db", mongo_db
  end
end
```

And that\'s it, we\'ve created our first provider. There is a bit more to say about providers, but we\'ll leave it for a later example.

What we\'ve done here is create a long lived object that we will be able to recall across our application.

Lets use our new provider object in our `TodoApp`{.verbatim}.\[shot 26\]

The first thin we need to do is to include the `Deps`{.verbatim} module\[shot 27\] passing to the brackets\[shot 28\] the dependencies we want to inject as strings.\[shot 29\]

We can now remove the initializer\[shot 30\] and the `db`{.verbatim} attribute reader\[shot 31\] since they will be automatically written for us.

We also need to remove the arguments and parameters in our instance creation method.\[shot 32\]

And, on our `todo_tasks`{.verbatim} \[shot 33\] and `done_tasks`{.verbatim} methods,\[shot 34\] we can keep using the `db`{.verbatim} method to retrieve the database connection. This is due to the attribute reader that `dry-system`{.verbatim} wrote for us.

``` ruby
module MyTaskList
  class TodoApp
    include Deps["db"]

    # ...

    def todo_tasks
      @todo_tasks ||= TaskList.load(db: db, collection_name: :todo_tasks)
    end

    def done_tasks
      @done_tasks ||= TaskList.load(db: db, collection_name: :done_tasks)
    end
  end
end
```

Lastly, we\'ll remove the `db`{.verbatim} arguments to all the calls to `TodoApp.load`{.verbatim} in our actions\[shot 35\]

``` ruby
module MyTaskList
  module Actions
    module Home
      class Show < MyTaskList::Action
        def handle(*, response)
          todo_app = TodoApp.load

          # ...
        end
      end
    end
  end
end
```

and our specs.\[shot 36\]

``` ruby
Given(:todo_app) { MyTaskList::TodoApp.load }
```

We can now check if our application still works, which it does.\[shot 37\]

Lets now do the same thing with the `TaskList`{.verbatim} class.\[shot 38\]

In this class, we receive the `db`{.verbatim} argument on the `load`{.verbatim} class method.\[shot 39\]

``` ruby

def self.load(db:, collection_name:)
  new(db: db, collection_name: collection_name)
end
```

So we\'ll remove it \[shot 40\] and also take out the `db`{.verbatim} parameter on the call to `new`{.verbatim}.\[shot 41\]

While we\'re near the top of the file, we\'ll include the `Deps`{.verbatim} module\[shot 42\] with the `db`{.verbatim} dependency.\[shot 43\]

``` ruby
include Deps["db"]

def self.load(collection_name:)
  new(collection_name: collection_name)
end
```

This means that we have to remove the argument on the initializer\[shot 44\] along with the instance variable assignment.\[shot 45\]

``` ruby
def initialize(db:, collection_name:)
  @db = db
  @collection = db.client[collection_name]
end
```

And remove the `db`{.verbatim} argument from the `todo_tasks`{.verbatim} \[shot 46\] and `done_tasks`{.verbatim} \[shot 47\] methods on our `TodoApp`{.verbatim}.

``` ruby
def todo_tasks
  @todo_tasks ||= TaskList.load(collection_name: :todo_tasks)
end

def done_tasks
  @done_tasks ||= TaskList.load(collection_name: :done_tasks)
end
```

Since the `TodoApp`{.verbatim} class is the entrypoint to our system, we don\'t need to change anything else to try out our application.

Lets do it by running the specs.\[shot 48\] There\'s an `ArgumentError`{.verbatim} in the initializer.\[shot 49\]

``` {.bash org-language="sh"}
docker-compose run --rm web sh -c "bundle exec rspec --options /app/.rspec /app/spec"
[+] Running 1/0
⠿ Container hanami-app-mongodb-1  Running                       0.0s
The Gemfile's dependencies are satisfied

Randomized with seed 16710
FF..FFFFFFFFF

Failures:

  1) My spec todo tasks when description is duplicated       Then { add_task == Failure(MyTaskList::TodoApp::DuplicatedDescription, "Description can't be duplicated") }

     Failure/Error:
       def initialize(collection_name:)
         @collection = db.client[collection_name]
       end

     ArgumentError:
       unknown keyword: :db
```

What\'s this about? Well, as I mentioned before, when we include the `Deps`{.verbatim} module,\[shot 50\] it creates an initializer for us, which means that our constructor has been overriden with a new one that, on this case, has only one parameter: the database, something like this:\[shot 51\]

``` ruby
def initialize(db:)
  @db = db
end
```

So, if we have a class that already has a constructor, we need to remove it and find a workaround for it\'s functionality.

How can we do it? Lets start by analyzing the `initialize`{.verbatim} method.\[shot 52\] It receives a `collection_name`{.verbatim} \[shot 53\] and then it constructs a collection, which gets assigned to the `@collection`{.verbatim} instance variable.\[shot 54\]

``` ruby
def initialize(collection_name:)
  @collection = db.client[collection_name]
end
```

We can move this functionality into it\'s own method, lets call it `collection_name=`{.verbatim}.\[shot 55\]

``` ruby
def collection_name=(collection_name)
  @collection = db.client[collection_name]
end
```

And we can now remove the initializer.\[shot 56\]

This fixes part of the problem.

Now, the load method can\'t send the collection name to the `new`{.verbatim} method,\[shot 57\] so we\'ll need to work around this.

We\'ll start by removing the arguments to `new`{.verbatim} \[shot 58\] and save this new instance in a local variable.\[shot 59\] Then we set the collection name using the method we just created \[shot 60\] and finally we return the new instance.\[shot 61\]

``` ruby
def self.load(collection_name:)
  instance = new
  instance.collection_name = collection_name
  instance
end
```

And now all of our specs pass again.\[shot 62\]

``` ruby
docker-compose run --rm web sh -c "bundle exec rspec --format progress /app/spec"
[+] Creating 1/0
✔ Container hanami-app-mongodb-1  Running                          0.0s
The Gemfile's dependencies are satisfied

Randomized with seed 31609
.............
```

And the application works as expected.\[shot 63\]

# Adding a logger

We\'ve used the database to show how to replace a dependency. Since we\'re working on an application that uses initializers and instance creation methods not just to assign instance variables directly from the constructor arguments, but also has \"complex\" logic in them (a.k.a. constructing a collection from it\'s name),\[shot 64\] injecting dependencies results in a complicated process.

But what if we want to inject a new dependency, something that we\'re not using yet, say, a logger?

The first step as before is to create the provider,\[shot 65\] we\'ll name it `my_logger`{.verbatim},\[shot 66\] because Hanami already ships with one and we don\'t want any colisions.

``` ruby
Hanami.app.register_provider(:my_logger) do

end
```

The previous provider came from inside our `lib`{.verbatim} directory,\[shot 67\] so there was no need to require it.

``` ruby
$ tree lib/
lib/
├── my_task_list
│   ├── ...
│   └── todo_app.rb
└── ...
```

But, since we\'re using an objec that\'s not automatically loaded, we need to require it.\[shot 68\]

Then we instantiate a new `Logger`{.verbatim} object\[shot 69\] which will log to a file,\[shot 70\] we configure it\'s log level\[shot 71\] and finally we register our new provider,\[shot 72\] just as we did before.

``` ruby
Hanami.app.register_provider(:my_logger) do
  start do
    require "logger"

    my_logger = Logger.new("./my_task_list.log")
    my_logger.add(Logger::INFO)

    register(:my_logger, my_logger)
  end
end
```

Before going on, remember I\'ve said that there was more to talk about providers.

The provider API Hanami provides is designed to separate the preparation steps from the actual implementation of the provider; so lets honor this.

We\'ll create a `prepare`{.verbatim} block\[shot 73\] where we\'ll move all the require statements\[shot 74\] and any other preparation steps we need to perform before we can start writing actual implementation code.

And we\'ll leave this later concern to the `start`{.verbatim} block, the same way as before.\[shot 75\]

``` ruby
Hanami.app.register_provider(:my_logger) do
  prepare do
    require "logger"
  end

  start do
    my_logger = Logger.new("./my_task_list.log")
    my_logger.add(Logger::INFO)

    register(:my_logger, my_logger)
  end
end
```

Couldn\'t you write everything inside the second block?... Of course you can! But the Hanami team has decided to create this *semantic* separation in order to help us, the developers, organize our code in a meaningful way.

Now we can inject our logger, for example, into the `TodoApp`{.verbatim} class\[shot 76\] and add an `INFO`{.verbatim} message to any method that performs an action.\[shot 77\]\[shot 78\]\[shot 79\]

``` ruby
module MyTaskList
  class TodoApp
    include Deps["db", "my_logger"]

    def add_task(description:)
      my_logger.info("Creating task: '#{description}'")
      # ...
    end

    def mark_done(description:)
      my_logger.info("Marking DONE: '#{description}'")
      # ...
    end

    def mark_todo(description:)
      my_logger.info("Marking TODO: '#{description}'")
      # ...
    end

    # ...
  end
end
```

While you weren\'t watching I added a route action and view to read the log messages from the log file,\[shot 80\] so lets add some tasks,\[shot 81\] and play around with them.\[shot 82\]

If we navigate to the log reader path,\[shot 83\] we can see that the logger has been properly injected into this class with very little extra code.

# Conclusion

In a pure Ruby application, dependency management can grow in complexity very quickly as our project gets bigger. But Hanami helps us by incorporating `dry-system`{.verbatim} into it\'s arsenal.

By doing so, it provides us with several benefits to simplify our life.

What are those benefits?

We can access all our configured components in a ready to use state.

We also don\'t haev the need to carry arround our setup logic, since it\'s now encapsulated in the component.

On our tests, we can now replace our configuration without any need to mock constants, which, in my opinion, makes for more reliable tests.

The number of objects created by our application goes down, since we now have a centralized location to grab long running objects from without the need of creating new ones. This has the advantage of reducing the memory used by our app.

Finally, a hidden benefit that `dry-system`{.verbatim} provides is *thread-safety*, which is great for working with multi-threaded application servers, such as `puma`{.verbatim}.

In short, with one gem addition, Hanami manages to give us ease of configuration and a lot of benefits.

\[Seb: close the episode as you like\]
