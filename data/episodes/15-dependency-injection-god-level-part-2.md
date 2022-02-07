---
id: 15
aliases: ["HMEP015"]
author: "swilgosz"
topics: ["dry-rb", "dry-system", "dependency injection", "hanami", 'dry-inflector']
title: "Dependency Injection in Ruby - GOD Level! Meet dry-system! (Part 2)"
excerpt: "Dependency injection brings you great power, but comes with its own headaches. If you can get rid of them, You're left with the power only. In Ruby, with dry-system, it's possible. Here is how!"
videoId: hT0NcYiTsQY
publishedAt: "2022-02-07"
modifiedAt: "2022-02-07"
thumbnail:
  full: /images/episodes/15/cover-full.jpg
  big: /images/episodes/15/cover-big.jpg
  small: /images/episodes/15/cover-small.jpg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1490583121422651395
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/smk05m/dependency_injection_in_ruby_god_level_meet/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/smk0cq/dependency_injection_in_ruby_god_level_meet/
source: https://github.com/hanamimastery/episodes/tree/main/015
---

In the last episode, I've covered deeply the reasons behind the existence of `dry-container` gem and shown how to implement dependency injection in Ruby from scratch.

This pattern, however powerful, can easily get annoying due to a lot of additional code one needs to write - and in most cases, it's repeatable code, nothing challenging, so boring.

This episode is a direct follow-up on that topic and today I'll focus exactly on problems related to: more overhead, and more code to be written, showcasing two great additions to dry-container, which are

- [dry-auto_inject](https://dry-rb.org/gems/dry-auto_inject)
- [dry-system](https://dry-rb.org/gems/dry-system)

By the end of this episode, you'll be able to make use of all the power dependency injection offers to you, without ANY excuses, as this DRY combo just solves everything.

Let me now then go through those remaining issues that can stop you from leveraging DI in your ruby applications.

## Remaining problems with dependency injection in ruby.

While dry-container is awesome, there is still a lot of manual work to be done to actually register all dependencies for the first time.

You still need to know the exact way to register all components, even if you need to do it only once.

Then our initialize methods may become quite extensive, as I have shown in [HME007](/episodes/7-untangle-your-app-with-dry-monads).

Those methods have no logic at all. It's just defining some readers and assigning dependencies to them, so maybe we could automate this?

```ruby
# lib/my_app/utils/loggers/io_logger.rb

module MyApp
  module Utils
    module Loggers
      class IOLogger
        def call(msg)
          puts msg
        end
      end
    end
  end
end
```

```ruby
# lib/my_app/utils/services/subscriptions/email_subscription.rb

module MyApp
  module Utils
    module Services
      module Subscriptions
        class EmailSubscription
          attr_reader :logger
          def initialize(logger:)
            @logger = logger
          end
        
          def call(email)
            logger.call("@-_-@")
          end
        end
      end
    end
  end
end
```

```ruby
# slices/blog/commands/become_awesome_subscriber

module Blog
  module Commands
    class BecomeAwesomeSubscriber
      attr_reader :logger, :service
      def initialize(logger:, service:)
        @logger = logger
        @service = service
      end
    
      def call(**args)
        logger.call("starting subscription...")
        service.call(args[:email])
        logger.call("subscribed to newsletter!")
      end
    end
  end
end
```

Good News! 

### Dry-rb team have you covered!

## Slim down your classes with dry-auto_inject!

There is a gem that allows exactly for that. It's *dry-auto_inject*, one of the first DRY libraries written by [[Peter Solnica]]. What it does, is allowing you to automatically create attr_readers in your classes and override initialize methods, removing tons of code you'd need to write without it.

With this little gem we can now simplify our registration file by automatically resolving all dependencies!

First of all, in my container file, I just create `Deps` constant which will be the only thing I'll use across my classes. 

```ruby
require 'dry-container'
# define the container
class Container
  extend Dry::Container::Mixin
  import Repositories

  register('my_app.utils.loggers.io_logger') do
    MyApp::Utils::Loggers::IOLogger.new
  end
  
  register('my_app.utils.services.subscriptions.email_subscription') do
    MyApp::Utils::Services::Subscriptions::EmailSubscription.new
  end
  
  register('blog.commands.become_awesome_subscriber') do
    Blog::Commands::BecomeAwesomeSubscriber.new
  end
end

Deps = Dry::AutoInject(MyContainer)
```

And the cool thing that I cannot stop highlighting, is that this gem does not work exclusively with dry-container! It works with ANY container, as long, as it responds to the `[]`  method!

It's just awesome!

Now in all our files, we can replace all `initialize` methods together with `attr_reader` definitions by including our `Deps` module.

```ruby
module MyApp
  module Utils
    module Services
      module Subscriptions
        class EmailSubscription
          include Deps[logger: 'my_app.utils.loggers.io_logger']
        
          def call(email)
            logger.call("@-_-@")
          end
        end
      end
    end
  end
end

module Blog
  module Commands
    class BecomeAwesomeSubscriber
      include Deps[
        logger: 'my_app.utils.loggers.io_logger',
        service: 'my_app.utils.services.subscriptions.email_subscription'
      ]
    
      def call(**args)
        logger.call("starting subscription...")
        service.call(args[:email])
        logger.call("subscribed to newsletter!")
      end
    end
  end
end
```

This extremely simplifies the whole process of defining and injecting dependencies across the whole system.

:::notice
As I mentioned at the beginning of this short series, keep in mind that systems actually grow!

I worked with projects where I had hundreds of files with 5-7 dependencies each, and in such scenarios you'll quickly appreciate this optimization.
:::

Plese notice, that the rest of the classes did not change at all, as dry-auto_inject allows us to freely name any dependency we load from the container, so long names or paths are issues neither.

Using this code also didn't change at all.

```ruby
cmd = Container['blog.commands.become_awesome_subscriber']
cmd.call(email: 'awesomesubscriber@hanami.mastery')
```

You still can just access the container, but now all our dependencies are automatically resolved based on the container definition!

However, **can you spot further possible improvements on this**?

## Dry-System for what?

Having that covered, what's the point of dry-system?
  
In my article about [dry-rb dependency graph](dry-rb-dependency-graph), I've highlighted, that based on the gem relationships you can conclude **which gems are supposed to be used directly**, and **which are designed as a low-level building blocks for other libraries**.

dry-system is a high-level gem designed specifically for a direct use.

While dry-auto_inject and dry-container are extremely powerful, you'll still have a lot of manual work required to register all components and across large systems you probably would like to avoid that.

If I would have more than  50 files to be manually registered by the container, I'd think 10 times. before I'll actually do it and more likely would end up with a conclusion, that it's not worthy.

Imagine a boot file manually registering **hundreds of services** and utility classes and you'll quickly feel the pain.

But then imagine if all of those files in your projects, would be registered automatically, and all dependencies would be automatically resolved, without you being stressed about a typo.

Imagine whole trees of dependencies loaded by thread-safe environment, without a need to write a single initialization method!

Guest what!

### Dry-RB team has you covered!

***dry-system*** composes *dry-container* and *dry-auto_inject* together, adding powerful autoloading capabilities and configuration options to your application.

So Let's look at the example.

### Creating container in dry-system

First let me visit my container file.

```ruby
# system/container.rb

require 'dry/system/container'

class Container < Dry::System::Container
  configure do |config|
    config.root = Pathname('.')
  end
end
```

This little snippet uses dry-container under the hood, but it also leverages the power of [dry-configurable](https://dry-rb.org/gems/dry-configurable) to allow easy-to-use, thread-safe configuration for the gem. 

:::info
Check out [how to configure anything in Ruby using dry-configurable](/episodes/5-configure-anything-with-dry-configurable) I've talked about in episode 5.
:::

So what's the point of it?

Well. So far, we needed to manually register all our files, didn't we?

However, now If we'll add a new directory to components files, we can now auto-register all our dependencies!

```ruby
require 'dry/system/container'

class Container < Dry::System::Container
  configure do |config|
    config.root = Pathname('.')
    config.component_dirs.add 'lib'
    config.component_dirs.add 'slices'
  end
end
```

We completely don't need all the container registration code anymore, as everything is just automatically resolved based on our file structure!

### This is the real game-changer!

With automatic registrations, and automatic injection we now can write our apps with 0 overhead whatsoever!

Nothing changes in our classes, nothing changes in the usage, but just every little piece of repeatable work is get off of our hands.

As I myself am productivity madman, I just cannot appreciate this enough.

Even though dry-validation is the actual, most popular gem from the dry family, for me it's dry-system, or rather dependency combo, **that is my favorite trio**.

### Configurable file name resolver!

:::Warning Configurable Acronyms!

The `IOLogger` class defined above will raise an error when you try to load it **with default configuration**, because it interprets the file_name as `IoLogger`. Fortunately *dry-system* uses dry-inflector to transform strings, which I covered in [episode #4](/episodes/4-string-transformations-with-dry-inflector)!

To configure the acronyms, you just need to pass a custom inflector!

```ruby
class Container < Dry::System::Container
  configure do |config|
    #...

    config.inflector = Dry::Inflector.new do |inflections|
      inflections.acronym('IO')
    end
  end
end
```

This will allow you to define `IOLogger` without a need to save it in the `i_o_logger.rb` file.
Sorry for cutting it out from the video, editing error :(.

## Hanami and dry-system

It's worth to mention, that Hanami 2 uses dry-system to manage all dependencies across the project. **This is why it allows you to create truly majestic monoliths**, with reduced technical debts when your project succeeds.

As `dry-system` is already configured, and container is not used directly, as a developer I am only interacting with the `Deps` module I had above! The rest is just a useful thing for me to understand, but it's completely irrelevant to start with Hanami!

If I'll create a file in the slice, it's automatically picked up by the `dry-system`, registered in the container, and ready to be used.

### Multiple containers per slice.

In Hanami, each slice has dedicated container, which can be resolved independently. This allows to load a whole tree of dependencies for a single slice, or set of slices in a single pod, without loading anything from other parts of the system.

The only two things you really need to care about in Hanami, is that you can access the slice container - and this is an object using `dry-container`  under the hood, which allows 
you to quickly browse and access registered dependencies.

```ruby
main_container = Main::Container
main_container.keys
# => []
sandbox[development]> main_container['repositories.articles']
=> #<Main::Repositories::Articles struct_namespace=Main::Entities auto_struct=true>
sandbox[development]> main_container.keys
# => ["repositories.articles"]
sandbox[development]> main_container.finalize!
# => Main::Container
sandbox[development]> main_container.keys
# => ["repositories.articles",
#  "application.notifications",
# ...
#  "application.rack_logger",
#  "view.parts.article",
#  "actions.articles.drafts",
#  "actions.articles.published",
#  "actions.home.show",
#  "repositories.authors",
#  "views.articles.drafts",
#  "views.articles.published",
#  "views.home.show"]
```

Then inside your objects, you will have `Deps` module that you can use to streamline the process of composing objects together and allowing you to forget about implementing `initialize` methods over and over again.

```ruby
# /slices/main/actions/articles/index.rb

module Main
  module Actions
    module Articles
      class Index < Main::Action
        include Deps[
          repo: 'repositories.articles'
        ]

        def handle(req, res)
          res.render view, articles: repo.all
        end
      end
    end
  end
end
```

Everything else is just tackled by dry-system and you can forget about it.

## Summary

Managing dependencies in the growing systems is a complicated problem to tackle, and *dry-system* with configuring three big features together, solves all the possible issues one could have when starts to work with dependency injection in Ruby.

[People can say that DI in Ruby is sometimes weird](https://therealadam.com/2013/01/03/design-for-test-vs-design-for-api/) and I can agree with that. DI like any pattern solves some problems, but introduces different overhead. *dry-system*, however, is a tool suited specifically to address and solve those issues.

As each of great gems from dry family, `dry-system` does one thing and does it great. So great, that projects like Hanami can use it by default, integrate it Zeitwerk or other great tools, ensuring developers will have great time not only when they start the application, but especially when the apps become Majestic Monoliths or Multi-Repo, mircro-service based projects.

That's all for today, I hope you enjoyed this episode and you'll find it useful. I use dependency injection in all my ruby apps - previously rails, now more Hanami, for years already, and I love it particularly because of existence of dry-system.

Encourage you to give it a try in your projects too!

If you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/channel/UC4Z5nwSfZrUO4NI_n9SY3uQ)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!

### Thanks

I want to especially thank my recent sponsors, 

- **DNSimple** - which kindly joined to my platinum sponsorship tier allowing me to delegate a bit of work related to editing videos for my tutorials.
 - **Andrzej Krzywda**, 
 - **Sebastjan Hribar**, 

for supporting this project, I really apreciate it!

By helping me with a few dollars per month creating this content, you are helping the open-source developers and maintainers to create amazing software for you!

And remember, if you want to support my work even without money involved, the best you can do is to like, share and comment on my episodes and discussions threads. Help me add value to the Open-Source community!

Additionally thanks [La-Rel Easter](https://unsplash.com/@lastnameeaster) for the great cover image!

If you know other great gems you wish me to talk about, leave a comment with `#suggestion`, and I'll gladly cover them in the future episodes!

As usual, here you can find two of my previous videos! Thank you all for supporting my channel, you are awesome, and have a nice rest of your day!

