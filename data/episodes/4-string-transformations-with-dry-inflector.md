---
id: 4
author: "swilgosz"
tags: ["dry-rb", "dry-inflector"]
title: "#4 An easy string manipulations in Ruby with DRY-INFLECTOR!"
excerpt: "Use constantize, classify, underscore and MORE on Strings in Pure ruby! Use dry-inflector to quickly apply non-standard string transformations!"
publishedAt: "2021-06-14"
modifiedAt: "2021-10-03"
aliases: ['HMEP004']
videoId: "iCplLYsvGuI"
thumbnail:
  full: /images/episodes/4/cover-full.jpeg
  big: /images/episodes/4/cover-big.jpeg
  small: /images/episodes/4/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1404386496656904200
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/o28dun/4_an_easy_string_manipulations_in_ruby_with/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/o28c02/easy_string_manipulation_in_ruby_with/
source: https://github.com/hanamimastery/episodes/tree/main/004
---

In this episode of Hanami Mastery screencast I want to showcase a super useful little Ruby Gem, that helped me a lot in writing my own Ruby packages. It implements **ruby classify**, *underscore*, **constantize**, all within pure ruby, without rails dependencies.

It's a [dry-inflector](https://github.com/dry-rb/dry-inflector0) gem written by [Luca Guidi](https://lucaguidi.com/), an amazing developer, co-author of Hanami Web framework and I definitely recommend following him up. I discovered this gem by [watching one of his Youtube videos](https://www.youtube.com/watch?v=xexeoulYPTM) - and I am super glad that I've made a habit of watching other developers' videos and presentations!

> While this episode covers **string transformations only**, if you are interested in more advanced stuff, **covering hash and object transformations**, check out [episode #6](/episodes/6-complex-ruby-data-transformations-made-simple)

### The problem we've faced

Recently we needed to improve in our projects the way we distribute the commands that had been triggered in the system. Whenever the command is called, it should be properly handled and the appropriate event should be published to our event store.

I don't want to talk too much about [how we approached the CQRS](https://driggl.com/blog/a/cars-api-endpoints-in-rails-applications) implementation in our systems, but I'll show a little diagram here just to visualize what I'm talking about.

In the usual web application, when you send a request, [it's received by a router](2-listing-articles-with-hanami-view), which recognizes the URL of the request and passes the attached parameters and headers into the proper controller action to be handled.

![Route visualization in web aps](/images/episodes/4/router.png)

In other words, if you write: `articles#new` in Rails, or `articles.new` in Hanami, the passed string will be interpreted by the router, and the controller named `articles` will be called with an action `new`.

Based on the convention of naming and the file structure, the correct constant will be instantiated and a proper method called.

We needed similar functionality for our business logic.

We had a set of commands that can happen in the system, and each of them should be handled by a proper handler, that at the end of command execution should publish an event.

![Command bus visualization in ruby apps](/images/episodes/4/command-bus.png)

We wanted a `CommandBus` class, that registers proper handler automatically based on the given command name, following the naming convention we created.

I know it sounds pretty complex, but it all comes down to this:

```ruby
class CommandBus
  def register(command_klass, handler: nil)
    handler ||= init_handler(command_klass)
    handlers[command_klass] = handler
  end

  def call(cmd)
    handlers[cmd.klass.to_s].call(cmd)
  end

  private

  attr_reader :handlers

  def initialize
    @handlers = {}
  end

  # Initializes the handler based on command class
  # @param "String" i.e "App::Commands::CancelPayment
  # @return Instance of handler class, i.e: "App::"CommandHanlders::OnCancelPayment
  #
  def init_handler(command_klass)
    handler_klass_str = command_klass.split("::").tap do |items|
      items[items.index('Commands')] = "CommandHandlers"
      items[-1] = "On#{items[-1]}"
    end.join("::")

    handler_klass = handler_klass_str.constantize
    handler_klass.new
  end
end
```

This is quite a simplified version of the command bus, but it's already pretty useful. It allows us to register a command, and then just call a command bus with this command. There is only one place, where the logic of figuring out what should handle my command is - and it's a command bus.

For `Commands::Create` it's supposed to call `CommandHanndlers::OnCreate`. However, this crashes, due to the usage of `constantize` method.

This method is not implemented in ruby, so we would either need to write it ourselves or rely on [ActiveSupport's inflector](https://api.rubyonrails.org/v6.1.3.2/classes/ActiveSupport/Inflector.html) class.

We didn't want that, because ActiveSupport is a set of a WHOLE LOT of features that we did not want to use in our simple gem and we didn't want to make it Rails-Specific.

We thought about implementing it on our own, but then we've found the `dry-inflector` - which is exactly what we needed.

### DRY-INFLECTOR

*dry-inflector* is a simple gem that wraps several useful string transformations into a small `inflector` object. Because it is so small, we gladly injected that into our internal ecosystem.

Here is a short presentation of why it's so great:

1. **It's extremely small** - and therefore, it's focused on one single purpose. This allows us to integrate it with any ruby app without a problem.
2. **It's [configurable](/episodes/5-configure-anything-with-dry-configurable)** - as it's a standalone object, we can configure it by adding our own rules, without affecting the global String behavior, which is great, as we have full control where we want those transformations to be applied.
3. **It's thread-safe**

To use it, we only need to instantiate the inflector object, and from that, we can make use of the full set of all features it provides.

For example, we can pluralize or singularize nouns, camelize strings, demodulize, and perform several other string transformations.

Here is a little snippet I've copied from the documentation, to present the basic feature of `dry-inflector`.

```ruby
require "dry/inflector"

inflector = Dry::Inflector.new

inflector.pluralize("book")    # => "books"
inflector.singularize("books") # => "book"

inflector.camelize("dry/inflector") # => "Dry::Inflector"
inflector.classify("books")         # => "Book"
inflector.tableize("Book")          # => "books"

inflector.dasherize("dry_inflector")  # => "dry-inflector"
inflector.underscore("dry-inflector") # => "dry_inflector"

inflector.demodulize("Dry::Inflector") # => "Inflector"

inflector.humanize("dry_inflector")    # => "Dry inflector"
inflector.humanize("author_id")        # => "Author"

inflector.ordinalize(1)  # => "1st"
inflector.ordinalize(2)  # => "2nd"
inflector.ordinalize(3)  # => "3rd"
inflector.ordinalize(10) # => "10th"
inflector.ordinalize(23) # => "23rd"
```

There is also the one we've looked for, `constantize`!

### Using constantize with dry-inflector

Let's check how `constantize` method behaves. I'll create a minimal set, just a plain ruby script requiring a `dry-inflector` and creating the `inflector` instance.

```ruby
#!/usr/bin/env ruby

require 'dry-inflector'

inflector = Dry::Inflector.new
```

Then Let's create the sample class, Let's call it HanamiMastery, and put some string. Maybe Subscribe!, as [I actually want to ask you for that](https://www.youtube.com/channel/UC4Z5nwSfZrUO4NI_n9SY3uQ) ;).

```ruby
class HanamiMastery
  def call
    p 'Subscribe!'
  end
end
```

Then let's call the constantize, passed in the `"HanamiMastery"` sting as a parameter.

```ruby
inflector.constantize("HanamiMastery").new.()
```

That is amazing! Out of the box implementation of most useful string transformations, but extracted as a single feature, ready to be used!

### Solving our problem

With `dry-inflector` gem discovered, it was almost a no-brainer to update our `CommandBus` to make use of it!

```ruby
require 'dry-inflector'

class CommandBus
  ...
  def initialize
    @handlers = {}
    @inflector = Dry::Inflector.new
  end

  attr_reader :inflector

  def init_handler(command_klass)
    ...
    handler_klass = inflector.constantize(handler_klass_str)
    handler.new
  end
end
```

This way, we avoided implementing the method in dozens of gems supporting our microservices ecosystem, and we've quickly realized, that other inflection transformations were also very useful in our case.

That's just great! **Thanks, Open-Source geeks**!

### Configuring the Dry::Inflector object

I'd want to yet quickly mention the configuration feature, as this is one more super-useful functionalities that `dry-inflector` provides. For example, I always hate, when I want to have `API` namespace, and I need to name classes, like: `Api`, or `Http` instead of `HTTP` and `API` for Rails to properly transform those strings. This is easily solved by `Dry::Inflector` by allowing to mark certain words as acronyms.

```ruby
require "dry/inflector"

inflector = Dry::Inflector.new do |inflections|
  inflections.acronym "API", "JSON"
end

inflector.underscore("JSONAPIresponse") # => "json_api_response"
inflector.camelize("json_api_request") # => "JSONAPIResponse"
```

The other nice thing is that you can add your own inflections, mark certain words as uncountable, or deliver additional rules to the pluralization of certain words.

```ruby
require "dry/inflector"

inflector = Dry::Inflector.new do |inflections|
  inflections.plural      "HTTP",   "Hypertext Transfer Protocols" # specify a rule for #pluralize
  inflections.uncountable "HanamiMastery"      # add an exception for an uncountable word
end

inflector.pluralize("HTTP")     # => "Hypertext Transfer Protocols"
inflector.pluralize("dry-inflector") # => "dry-inflector"
```

That's all I have for today, [check out the gem's documentation](https://dry-rb.org/gems/dry-inflector/) if you seek more examples of usage.

### Do you like this episode? Consider sponsoring the project!

I hope you've enjoyed this episode, and if you want to see more content in this fashion, [Subscribe to my channel](https://www.youtube.com/channel/UC4Z5nwSfZrUO4NI_n9SY3uQ) and [follow me on twitter](https://twitter.com/sebwilgosz)!  As always, all links you can find the description of the video or in the [Hanami Mastery about page](https://hanamimastery.com/about)


Also, **If you have any suggestions of amazing ruby gems You'd like me to cover**, or ideas on how to improve, please mention it in the comments!

See you!

### Special Thanks!

I'd like to thank All the amazing people who decided to sponsor me so far. I appreciate your trust, as I understand that too many blogs do not even hit the barrier of 10 articles!

Any support allows me to spend more time on creating content that promotes great open source projects. I hope to do more of this stuff in the future!

- [Bohdan V.](https://g3d.dev/) - For joining to my [regular supporters](https://github.com/sponsors/swilgosz)!
- [Jonathan Kemper](https://unsplash.com/@jupp) - for a great cover photo
- [Luca Guidi](https://lucaguidi.com/) - for creating `dry-inflector` gem.
