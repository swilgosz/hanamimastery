---
id: 30
aliases: ["HMEP030"]
author: "swilgosz"
topics: ["rom-rb", "persistence", "hanami"]
title: "ROM - Mapping is everything"
excerpt: "Understand data mapping in ROM, on all levels! In this episode we go through examples of simple to complex data mapping with ROM, with real usecases for each one."
videoId: Veqh0g8sNj4
premium: true
published: true
publishedAt: "2022-09-30"
modifiedAt: "2022-09-30"
thumbnail:
  full: /images/episodes/30/cover-full.jpeg
  big: /images/episodes/30/cover-big.jpeg
  small: /images/episodes/30/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1575807037660798977
source: https://github.com/hanamimastery/episodes/tree/main/030
---
I've told you about the importance of [mapping things to each other](/episodes/8-rails-vs-hanami-mapping-frameworks) **several times already**.

Linking unknown concepts to something we know and can work with, not only speeds up the learning process but **is a source of creativity**.

In the digital world, where no idea is original, creative people link existing ideas to form *completely new concepts.*

But how could we make use of this thought in development?

Well, if you have data, where it is problematic to work with, an easy way to map your incoming data structure to something we could easily work with, is a tremendous time saver, and a window to more efficiently **bring innovations to your projects**.

## Mapping data in ROM

In ROM, If you use relations, the result is returned in a form of plain hashes by default.

```ruby
authors = container['persistence.rom'].relations[:authors]
authors.to_a
=> [{:id=>1, :first_name=>"Seb", :last_name=>"Wilgosz", :nickname=>"swilgosz"}]
```

It is not very convenient to work with such objects, however simple they are. If you've watched [my previous episode](29-leverage-rom-repositories), you already know, that *Repositories simplify this,* by automatically mapping your data to struct objects, with all attributes accessible as getters which is easier to play with.

```ruby
repo = container['repositories.authors']
repo.all.first
=> #<ROM::Struct::Author id=1 first_name="Seb", last_name="Wilgosz", nickname="swilgosz">
repo.all.first.first_name
=> "Seb"
```

However, this is just a *default behavior*, that you can disable, or tweak further.

In this episode, I'll dig a bit into the **automatic mapping** of your objects into **different data structures**, and hopefully give you some ideas about when they may be useful.

We'll cover the examples for:

- default mapping
- custom entities
- and custom mappers, writing a small Event Store adapter.

Let's start then.

### Automatic structs in relations

If you want to use relations directly in your gem or app, you can still enable auto-struct, by setting the `auto_struct` option to `true`.

```ruby
module Sandbox
  module Persistence
    module Relations
      class Authors < ROM::Relation[:sql]
        schema(:authors, infer: true)

        # maps the data to ROM::Struct::Author object
        auto_struct :true
      end
    end
  end
end

```

Now when I'll read my author from the database, it'll be automatically instantiated into an object, of which I can easily access all the attributes!

```ruby
authors.first
# => #<ROM::Struct::Author id=1 first_name="Seb" last_name="Wilgosz" nickname="swilgosz">
authors.first.first_name
=> "Seb"

```

In this case, the *first name* is automatically read from the corresponding column, as I use an SQL data store.

It's cool, however, what if I'd like to add custom methods to my struct classes?

### Custom Entities

For this, we can set our custom struct objects which we will have full control over.

In my relation, I can set the `struct_namespace` to  `Entities`

Then in my application, I'm going to create a base entity object, that inherits from `ROM::Struct`.

```ruby
# frozen_string_literal: true

module Sandbox
  class Entity < ROM::Struct
  end
end

```

This is not obligatory, but I find it a good practice to rely on objects *I control* instead of objects *controlled by a library*, and it's easier to update the code later.

Having that I can now add my author's entity.

```ruby
# app/entities/author.rb

module Sandbox
  module Entities
    class Author < Entity
      def full_name
        first_name << " " << last_name
      end
    end
  end
end

```

Inside I can define a method named:`full_name`, and with this, I get my author objects instantiated automatically to the Author entity. Immediately I can access my newly defined `full_name` method from the console.

```ruby
authors.first
# => #<ROM::Struct::Author id=1 first_name="Seb" last_name="Wilgosz" nickname="swilgosz">
authors.first.full_name
=> "Seb Wilgosz"

```

### Repositories make it easier.

In my application, I'll rarely call relations directly though, if ever. Usually, I'll work with repositories instead, and those do the struct mapping by default.

Let me move the config to the base repository of my application.

Because repositories do the `auto_struct` by default, I can remove this line, and just specify the namespace for my Entities.

```ruby
# app/repository.rb

module Sandbox
  class Repository < ROM::Repository::Root
    include Deps[container: 'persistence.rom']

    struct_namespace Entities

    # ...
  end
end

```

Now I can have the mapping configuration set in a single place while keeping the behavior untouched.

```ruby
authors_repo.authors.first
# => #<Sandbox::Entities::Author::Author id=1 first_name="Seb" last_name="Wilgosz" nickname="swilgosz">
=> "Seb Wilgosz"

```

That’s it, for the very basic usage of the automating [mapping functionality](https://rom-rb.org/learn/core/5.2/mappers/). If you are interested only in that, you may finish the episode here.

However, in some scenarios, you’ll need *a custom mapping ability*. One example would be to **read a stream of events from the event store**.

Let me show you how to do this.

:::tip[Subscribe to Hanami Mastery PRO]
This is only a preview of the episode. [Subscribe to Hanami Mastery PRO](https://pro.hanamimastery.com/hanami-mastery-pro) to see the full video, and access several other premium resources. Thanks for watching, and see you in the next one!
:::

## Thanks

That's all for today, you're awesome, and see you in the next episode!
