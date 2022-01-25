---
id: 13
aliases: ["HMEP013"]
author: "swilgosz"
topics: ['dry-rb', 'dry-container', 'dry-system', 'hanami']
title: "#13 Sneak-peak into dependency loading with Hanami and dry-container"
excerpt: "dry-system and dry-container are extremely powerful tools and if you understand how to work with them, you'll never look back. It's amazing that Hanami uses them by default! Check out some useful debugging tips!"
videoId: mMyqUaPBLWI
publishedAt: "2022-01-25"
modifiedAt: "2021-01-25"
thumbnail:
  full: /images/episodes/13/cover-full.jpeg
  big: /images/episodes/13/cover-big.jpeg
  small: /images/episodes/13/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1485884896094703616
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/sc8nlj/13_sneakpeak_into_dependency_loading_deps_with/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/sc8wei/a_sneakpeak_into_dependency_loading_debugging/
source: https://github.com/hanamimastery/episodes/tree/main/013
---

In this episode I'll show you a few ways to debug dependency loading via [dry-container](https://dry-rb.org/gems/dry-container) in Hanami applications, by using one of my recent setbacks.

# Repository pattern 
In episode 9, I showcased [a complete integration of persistence layer in Hanami 2.0 applications](https://hanamimastery.com/episodes/9-guide-to-models-in-hanami-and-rom), to deliver blog articles data read from my DB straight into the browser.

However, **there was a mistake hidden in this tutorial** that started to haunt me right after the release of the next [Hanami Alpha version](https://hanamirb.org/blog/2021/11/09/announcing-hanami-200alpha3/), as it caused incompatibility issues with what I've shown in the video.

There is a risk that some of my content becomes outdated quickly until official Hanami 2 is released but **it's a risk I had consciously taken** to help existing Hanami developers start playing with this project earlier.

:::info
However, to minimize such situations, I am currently releasing more videos about [DRY libraries](/t/dry-rb)/, which are a bit more safe for me to cover.
:::

While this is a normal risk when releasing tutorials about alpha versions, **or rather about anything what happens in web development**, this particular bug was caused because of my incomplete understanding of the *Repository Pattern* in ruby! 

So, right after realizing that I did some research and to my surprise, **I was [not the only one](https://discourse.rom-rb.org/t/difference-between-repositories-and-relations/317) who didn't get the concept in full shape**.

In this article I'll explain where the problem came from and we will dig a little bit into **loading dependencies using application containers**.

### Repository vs Relations

I will make a detailed explanation of a repository pattern and how it's done in Hanami **as part of my Hanami Mastery PRO very soon**, but for now, let's focus on the dependency injection part.

As Hanami uses [ROM](http://rom-rb.org) as the ORM of choice, all patterns and the conceptions of the persistence in Hanami are [directly related to ROM concepts](/articles/sequel-over-activerecord). This is cool, as it reduces the overhead of learning the intermediate DSL, and we can just rely directly on amazing ROM documentation to do anything it provides.

Therefore in Hanami, we have [Relations](https://rom-rb.org/5.0/learn/core/relations/) and [Repositories](https://rom-rb.org/5.0/learn/repositories/).

What I did in the initial integration of ROM was **placing repositories next to relations** in the general lib folder (`lib/sandbox/peristence/repositories`) and this was the core problem.

#### Repository

A repository is **a bridge between the persistence layer and application logic** in your application.

For example, you can **have multiple slices** in your application **accessing the same database table**!

![Multi-Slice DB connection](/images/episodes/13/multi-slice-db-connection.png)

In this case, **each of our slices would have a separate repository**, providing a clean interface to fetch only data the specific context is interested in.

Therefore **repositories belong to the business part of your application** and it is recommended that you define multiple repositories in different slices, which use the same relations to receive some data.

#### Relations

Relations, on the other hand, are definitely a part of the persistence logic.

In short, those are more or less, definitions of your table schemas and possible associations, to reflect what you have in your database.

```ruby
# /lib/sandbox/persistence/relations/articles.rb

module Persistence
  module Relations
    class Articles < ROM::Relation[:sql]
      schema(:articles, infer: true) do
        associations do
          belongs_to :authors, as: :author
        end
      end
    end
  end
end
```

**You may define very common queries there** but queries specific for the given use case will definitely be placed within repositories.

### The improved Hanami file structure

In occasion of a work on Hanami 2 Alpha3 release [Tim Riley](https://github.com/github/timriley) did an [extraordinary contribution to dry-system](https://github.com/dry-rb/dry-system/pull/181) improving it in a way that made possible flattened directory structure. You may read more about this amazing feature he added in his [OSS Update article for September 2021](https://timriley.info/writing/2021/10/11/open-source-status-update-september-2021/).

Then several improvements had been applied, and as a result, **repository loading started to be more strict** and dumb resilient, ensuring that people will place them in a proper place by default.

Having that said, let's fix my implementation!

### Moving repository to a slice 

I have here my repository placed in a general lib folder, inside of my app's and persistence namespaces.

```ruby
# /lib/sandbox/persistence/repositories/articles.rb

module Sandbox
  module Persistence
    module Repositories
      class Articles < Repository[:articles]
        commands :create

        def all
          articles.combine(:author).to_a
        end

        def find(id)
          articles.combine(:author).by_pk(id).one!
        end
      end
    end
  end
end
```

```ruby
# /lib/sandbox/persistence/repositories/authors.rb

module Sandbox
  module Persistence
    module Repositories
      class Authors < Repository[:authors]
        commands :create

        def all
          authors.to_a
        end
      end
    end
  end
end
```

I will now move those into the main slice, simplifying the namespaces a bit by making use of the flattened file structure provided by [dry-system](https://dry-rb.org/gems/dry-system) now.

```ruby
# /slices/main/repositories/articles.rb

module Main
  module Repositories
    class Articles < Repository[:articles]
      commands :create

      def all
        articles.combine(:author).to_a
      end

      def find(id)
        articles.combine(:author).by_pk(id).one!
      end
    end
  end
end
```

```ruby
# /slices/main/repositories/authors.rb

module Main
  module Repositories
    class Authors < Repository[:authors]
      commands :create

      def all
        authors.to_a
      end
    end
  end
end

```

Notice that now my repositories **don't have the persistence module anymore** and **my app namespace had been replaced by the name of slice**.

Finally let me visit my actions and fix the repository loading.

```ruby
# frozen_string_literal: true

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

As I skipped the persistence folder, I can now remove it also from here.

Then as I moved it to the **current slice**, I don't need the application namespace anymore neither.

Now my code is much cleaner and makes much more sense.

**And more importantly, it works without issues!**

![List of articles loaded from DB](/images/episodes/13/articles-list.png)

### Container debugging tips.

It all seems very nice and easy, but it's because **I exactly knew how my repositories are loaded**, and under what keys they'll appear after the update.

**But what if you actually want to figure that out?**

Loading dependencies by using a container is an extremely powerful thing.

It can speed up tests suits like crazy, and allow for dependency injection without a hassle.

However, if you don't know the exact key your dependency is accessible by, it may be a bit confusing at the beginning to use it, so it is useful to know how to find loadable components.

#### Lazy loading dependencies

In the hanami console, I have the access to the `container` variable right away and it returns the general application container where all our configuration stuff lays in.

```ruby
hanami console
container
# => Sandbox::Container
```

To preview all the dependencies loaded by the container, I can use the `#keys` method on it.

```ruby
container.keys
# => ["notifications"]
```

However, it returns only one key for now - `"notifications"`!

In the development environment, all files are by default lazy-loaded by the container, which means, **they are only loaded when they're needed**.

This is why, if I'll ask the container what is loaded, it returns a minimal number of dependencies used when starting the console.

As soon as I will try to access for the first time the dependency not loaded yet, the container will load it and instantiate properly, **automatically resolving all objects required by it**!

```ruby
container.keys
# => ["notifications"]
container['settings']
# => #<Sandbox::Settings:0x00007ff87a380318 @config=#<Dry::Configurable::Config values={:database_url=>"sqlite://./db/sandbox.sqlite", :session_secret=>"change-me", :precompiled_assets=>false}>>
container.keys
# => ["notifications", "settings"]
```

This feature **allows the hanami console to be always extremely quick** and **the same applies to different test runs**, no matter how much your app grows.

However, it's often useful to preview all loadable deps to quickly find what we need.

#### Load all dependencies on-demand using `#finalize!`

I can force the container to load everything at once by calling `#finalize!` method ending it with a bang.

```ruby
container.finalize!
# => Sandbox::Container
```

Now checking the loaded dependencies again will result in all settings properly loaded.

```ruby
container.keys
# => [
# "notifications", 
# "settings", 
# "assets", 
# "persistence.config", 
# "persistence.db", 
# "persistence.rom", 
# "rack_monitor", 
# "routes_helper", 
# "view.context", 
# "inflector", 
# "logger", 
# "rack_logger"
# ]
```

With this **you receive a complete control over loading dependencies,** however here you still can't see your repositories, can you?

### Slice-specific containers

It happens because **each slice has their own container**, independent of each other.

With this you may have different processes on separate pods running different parts of your system **without loading all your codebase to the memory** which is another huge benefit.

To access the main slice container, I just need to call it.

```ruby
main_container = Main::Container
# => Main::Container
````

To launch the Hanami console, nothing from the *Main slice* is needed, so the container returns empty dependencies loaded.

```ruby
main_container.keys
# => []
```

I can load necessary objects on-demand, or force all dependencies to be loaded at once, exactly like with the general application container.

```ruby
sandbox[development]> main_container['repositories.articles']
=> #<Main::Repositories::Articles struct_namespace=Main::Entities auto_struct=true>
sandbox[development]> main_container.keys
# => ["repositories.articles"]
sandbox[development]> main_container.finalize!
# => Main::Container
sandbox[development]> main_container.keys
# => ["repositories.articles",
#  "application.notifications",
#  "application.settings",
#  "application.assets",
#  "application.persistence.config",
#  "application.persistence.db",
#  "application.persistence.rom",
#  "application.rack_monitor",
#  "application.routes_helper",
#  "application.view.context",
#  "application.inflector",
#  "application.logger",
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

As you can see, slice's container has access to everything from the application container, and to access it you just need to prefix the required dependency with `application` prefix.

For example, if I want to use logger in my action all I need to do in my file would be:

```ruby
include Deps['application.logger']]
```

#### Finalizing All container at once with

There may be a situation, where you want to just load everything from all slices and just don't care. You can easily do it by manually booting your application. As my application is named `Sandbox`, my code would look like this:

```ruby
Main::Container.keys
# => []
Sandbox::Application.boot
# => Sandbox::Application.boot
Main::Container.keys
# => ["repositories.articles",
#  "application.notifications",
#  "application.settings",
#  "application.assets",
#  "application.persistence.config",
#  "application.persistence.db",
#  "application.persistence.rom",
#  "application.rack_monitor",
#  "application.routes_helper",
#  "application.view.context",
#  "application.inflector",
#  "application.logger",
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

### Summary

[dry-system](https://dry-rb.org/gems/dry-system) and [dry-container](https://dry-rb.org/gems/dry-container) are extremely powerful tools and if you understand how to work with them, you'll never look back.

Because of the amazing control they provide and loading always a minimal set of files to perform a single task, **test-driven development becomes enjoyable again**! You may have always fast test suits during the development, extremely performant rake tasks, and optimized pods for the production environment.

That's all for today, I hope you enjoyed this episode and that as always, you'll get learnings from my mistakes.

If you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/channel/UC4Z5nwSfZrUO4NI_n9SY3uQ)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!

### Thanks

I want to especially thank my recent sponsors, **Andrzej Krzywda, Sebastjan Hribar**, and [Useo](https://useo.pl) for supporting this project, really apreciate it!

By helping me with a few dollars per month creating this content, you are helping the open-source developers and maintainers to create amazing software for you!

And remember, if you want to support my work even without money involved, the best you can do is to like, share and comment on my episodes and discussions threads. Help me add value to the Open-Source community!

As usual, here you can find two of my previous episodes! thank you all for supporting my channel, you are awesome, and have a nice rest of your day!

Additionally,

- [Ante Hamersmit](https://unsplash.com/@ante_kante) for a great cover image!

:::note Do you know other great gems?

Leave a comment with `#suggestion`, I'll gladly cover them in the future episodes!
:::
