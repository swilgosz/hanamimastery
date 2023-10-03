---
id: 49
aliases:
  - "HMEP049"
author: "fiachetti"
topics:
  - hanami
  - patterns
  - dependency-injection
title: "Registry Pattern in Hanami apps"
excerpt: "Registry pattern is one of many programming best practices, applied by default in Hanami projects. In this episode, we deep dive into how the registry pattern is used in Hanami apps and explain how it works."
videoId: "gbK_VjPwhfU"
published: true
publishedAt: "2023-10-03"
modifiedAt: "2023-10-03"
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
Hi there!

We have done a cross-over episode with NB Casts, and this is a second part of it. You can find the [first part of the episode about registry pattern](https://nbcasts.com/episodes/registry-pattern) on the NB Casts, and here we'll focus on how Hanami leverages this pattern and what benefits it gives us.

Also, if you want to know more about *dependency injection* and the registry pattern, we [have a few episodes around this topic](https://hanamimastery.com/t/dependency-injection) already, make sure to check them out by clicking on the tag button!

Let's start then!

## Non-Standard Hanami application

I ported a tiny Todo app using to Hanami.

It has been written as a plain ruby application *and it's not written using the Hanami way*. Hanami is a very skinny framework, and while you usually will leverage the advantage of a default file structure, writing a simple Hanami app is very straightforward and you can fit it all in a single file if you wish.

One challenge is the complex web of dependency management, where certain objects are frequently passed around to multiple components.

Let's take, for example, the database. We have our main object, the `TodoApp`. It has an instance creation method that returns a new instance of the application it receives the database as an argument.

Then, on the initializer, it assigns this database instance. Subsequently, methods like `todo_tasks` and `done_tasks` create a new `TaskList` object, which also receives the database instance on its `load` method.

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

We've passed the database to two classes so far. As I said before, this is a tiny app, and by that, I mean that it's an application that implements, at its core, only four classes.
At this rate, if we keep growing it, we'll end up passing the database to dozens of objects.

```bash
tree lib
lib
├── database.rb
├── task_list.rb
├── task.rb
└── todo_app.rb
```

# Dry-system

This dependency management problem can get very complex very quickly.

But Hanami provides us with a solution: dependency injection using [dry-system](https://dry-rb.org/gems/dry-system/1.0/).
To use the `dry-system` integration, we first need to create a `provider` under the `config/providers` directory.
```bash
$ mkdir config/providers
```

Since on the `TodoApp` class, we access the database through the `db` attribute reader,we'll call our provider with the same name. Let's create the `db.rb` file

```bash
$ touch config/providers/db.rb
```

Inside this file, we register a new providercalled `:db` and we pass it a block.
Then we call the start methodand on it's block,we create the database instance.
Finally, we registerthe `db` provider, passing in our `mongo_db` object.

``` ruby
Hanami.app.register_provider(:db) do
  start do
    mongo_db = MyTaskList::Database.load

    register "db", mongo_db
  end
end
```

And that's it, we've created our first provider. There is a bit more to say about providers, but we'll leave it for a later example.

What we've done here is create a long-lived object that we will be able to recall across our application.

Let's use our new provider object in our `TodoApp`.
The first thing we need to do is to include the `Deps` modulepassing to the bracketsthe dependencies we want to inject as strings.
We can now remove the initializerand the `db` attribute readersince they will be automatically written for us.

We also need to remove the arguments and parameters in our instance creation method.
And, on our `todo_tasks` and `done_tasks` methods,we can keep using the `db` method to retrieve the database connection. This is due to the attribute reader that `dry-system` wrote for us.

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

Lastly, we'll remove the `db` arguments to all the calls to `TodoApp.load` in our actions
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

and our specs.
``` ruby
Given(:todo_app) { MyTaskList::TodoApp.load }
```

We can now check if our application still works, which it does.
Lets now do the same thing with the `TaskList` class.
In this class, we receive the `db` argument on the `load` class method.
``` ruby

def self.load(db:, collection_name:)
  new(db: db, collection_name: collection_name)
end
```

So we'll remove it and also take out the `db` parameter on the call to `new`.
While we're near the top of the file, we'll include the `Deps` modulewith the `db` dependency.
``` ruby
include Deps["db"]

def self.load(collection_name:)
  new(collection_name: collection_name)
end
```

This means that we have to remove the argument on the initializeralong with the instance variable assignment.
``` ruby
def initialize(db:, collection_name:)
  @db = db
  @collection = db.client[collection_name]
end
```

And remove the `db` argument from the `todo_tasks` and `done_tasks` methods on our `TodoApp`.

``` ruby
def todo_tasks
  @todo_tasks ||= TaskList.load(collection_name: :todo_tasks)
end

def done_tasks
  @done_tasks ||= TaskList.load(collection_name: :done_tasks)
end
```

Since the `TodoApp` class is the entrypoint to our system, we don't need to change anything else to try out our application.

Lets do it by running the specs.There's an `ArgumentError` in the initializer.

```bash
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

What's this about? Well, as I mentioned before, when we include the `Deps` module,it creates an initializer for us, which means that our constructor has been overridden with a new one. In this case, it now has only one parameter: the database. something like this:
``` ruby
def initialize(db:)
  @db = db
end
```

So, if we have a class that already has a constructor, we need to remove it and find a workaround for it's functionality.

How can we do it? Lets start by analyzing the `initialize` method.It receives a `collection_name` and then it constructs a collection, which gets assigned to the `@collection` instance variable.
``` ruby
def initialize(collection_name:)
  @collection = db.client[collection_name]
end
```

We can move this functionality into it's own method, lets call it `collection_name=`.
``` ruby
def collection_name=(collection_name)
  @collection = db.client[collection_name]
end
```

And we can now remove the initializer.
This fixes part of the problem.

Now, the load method can't send the collection name to the `new` method,so we'll need to work around this.

We'll start by removing the arguments to `new` and save this new instance in a local variable.Then we set the collection name using the method we just created and finally we return the new instance.
``` ruby
def self.load(collection_name:)
  instance = new
  instance.collection_name = collection_name
  instance
end
```

And now all of our specs pass again.
``` ruby
docker-compose run --rm web sh -c "bundle exec rspec --format progress /app/spec"
[+] Creating 1/0
✔ Container hanami-app-mongodb-1  Running                          0.0s
The Gemfile's dependencies are satisfied

Randomized with seed 31609
.............
```

And the application works as expected.
# Adding a logger

We've used the database to show how to replace a dependency. Since we're working on an application that uses initializers and instance creation methods not just to assign instance variables directly from the constructor arguments, but also has \"complex\" logic in them (a.k.a. constructing a collection from it's name),injecting dependencies results in a complicated process.

But what if we want to inject a new dependency, something that we're not using yet, say, a logger?

The first step as before is to create the provider,we'll name it `my_logger`,because Hanami already ships with one and we don't want any colisions.

``` ruby
Hanami.app.register_provider(:my_logger) do

end
```

The previous provider came from inside our `lib` directory,so there was no need to require it.

``` ruby
$ tree lib/
lib/
├── my_task_list
│   ├── ...
│   └── todo_app.rb
└── ...
```

But, since we're using an object that's not automatically loaded, we need to require it.
Then we instantiate a new `Logger` objectwhich will log to a file,we configure its log leveland finally we register our new provider,just as we did before.

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

Before going on, remember I've said that there was more to talk about providers.

The provider API Hanami provides is designed to separate the preparation steps from the actual implementation of the provider; so lets honor this.

We'll create a `prepare` blockwhere we'll move all the `require` statementsand any other preparation steps we need to perform before we can start writing actual implementation code.

And we'll leave this later concern to the `start` block, the same way as before.
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

Couldn't you write everything inside the second block?... Of course you can! But this way I show you that we get more control over the component registration lifecycle. We can do the most crucial stuff in the prepare block while doing the time-consuming part of registration only when the component actually starts.

Now we can inject our logger, for example, into the `TodoApp` classand add an `INFO` message to any method that performs an action.
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

While you weren't watching I added a route action and view to read the log messages from the log file,so let's add some tasks,and play around with them.
If we navigate to the log reader path,we can see that the logger has been properly injected into this class with very little extra code. And yes, while I've configured a separate provider for my logger for educational purposes, remember that Hanami has a logger already in place.

# Conclusion

In a pure Ruby application, dependency management can grow in complexity very quickly as our project gets bigger. But Hanami helps us by incorporating a `dry-system` into its arsenal.

By doing so, it provides us with several benefits to simplify our lives.

What are those benefits?
- We can access all our configured components in a ready-to-use state out of the registry.
- We don't have the need to carry around our setup logic, since it's now encapsulated in the component.
- On our tests, we can now replace our component in the registry without any need to mock constants, which, in my opinion, makes tests simpler and more reliable.
- The number of objects created by our application goes down since we now have a centralized location to grab long-running objects from without the need to create new ones. This has the advantage of reducing the memory used by our app.
- Finally, a hidden benefit that `dry-system` provides is *thread-safety*, which is great for working with multi-threaded application servers, such as `puma`.

In short, with one gem addition, Hanami manages to give us ease of configuration and a lot of benefits, leveraging the registry pattern implemented on the extreme level.
## Thanks
I would love to thank our episode partner and would love to hear if you like this sort of things as I'd love to collaborate with more people in the future!

For that, you can like, share, and comment on my episode discussion threads! We can do more if we do it together!

Love you to death, and see you in the next episode!
