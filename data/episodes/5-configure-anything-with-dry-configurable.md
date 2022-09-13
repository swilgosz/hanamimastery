---
id: 5
author: "swilgosz"
topics: ["dry-rb", "dry-configurable"]
title: "Configure anything with dry-configurable"
excerpt: "Configuring projects and components is one of the most common features in programming in general. dry-configurable is a standalone gem providing you exactly this in Ruby! Read about how to use it."
publishedAt: "2021-06-19"
modifiedAt: "2022-09-13"
aliases: ['HMEP005']
videoId: J_352sH25oc
thumbnail:
  full: /images/episodes/5/cover-full.jpeg
  big: /images/episodes/5/cover-big.jpeg
  small: /images/episodes/5/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1406023638554447874
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/o9ha9h/5_configure_anything_with_dryconfigurable/
    rails: https://www.reddit.com/r/rails/comments/o9hbe8/5_configure_anything_with_dryconfigurable/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/o9hbrs/5_configure_anything_with_dryconfigurable/
source: https://github.com/hanamimastery/episodes/tree/main/001
---
When you write ruby gems or even reusable components, there is often a need for configuring your projects to behave differently in different contexts.

For example, in our [EventStoreClient](https://github.com/yousty/event_store_client) gem, we've used to connect our apps to the [external event store](https://eventstore.com). We needed to pass the authorization data, as well as the URL of the store where it was hosted upon.

```ruby
EventStoreClient.configure do |config|
  config.eventstore_url = ENV['EVENTSTORE_URL']
  config.eventstore_user = ENV['EVENTSTORE_USER']
  config.eventstore_password = ENV['EVENTSTORE_PASSWORD']
  config.verify_ssl = false # remove this line if your server does have the host verified
end
```

In the [aws-sdk](https://github.com/aws/aws-sdk-ruby) gem from another hand, you need to pass similar configuration options:

```ruby
require 'aws-sdk'
require 'json'

creds = JSON.load(File.read('secrets.json'))
Aws.config[:credentials] = Aws::Credentials.new(
  creds['AccessKeyId'],
  creds['SecretAccessKey']
)
```

And, if you use [Rails](https://github.com/rails/rails), this kind of configuration may be super familiar to you.

```ruby
module Api
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0
    config.api_only = true
  end
end
```

In fact, it's so common behavior, **where a gem or component needs to be configured somehow**, that it's surprising most of the projects come with the custom configuration implementations, not always thinking about being Thread-Safe, Type-safe, or even test the configuration engine properly!

I guess you can imagine what your project may do in such situation, can't you?

![[caitlin-wynne-4D953R0aRUo-unsplash(1)(1).jpg]]

But let's stay positive. You can avoid certain doom and I want to tell you how.

You can configure anyting, from initial [stylings for your application](/episodes/3-style-your-app-with-bulma), database connections, whatever you want.

In today's episode of Hanami Mastery, I want to show you the [Dry-Configurable gem](https://dry-rb.org/gems/dry-configurable), which may be an amazing improvement in tn allowing you to add thread-safe configuration behavior to your classesita Shilnikov and Piotr Solnica, is one of such micro-libraries, that are close to perfection and can be injected almost everywhere*.

## Usage

*dry-configurable* is super simple to use, but because of its narrowed responsibility, at the same time it's extremely stable and flexible to be applied in different contexts.

Just extend the mixin and use the `setting` macro to add configuration options:

You can use it either on ruby `module` on a `class` or an `instance`.

### Using *dry-configurable* on module

On the module level, you need to extend the `Dry::Configurable` module and you can safely use all features it provides. Here I set the `api_url` to `https://hanamimastery.com`

```ruby
require 'dry-configurable'

module App
  extend Dry::Configurable

  setting :api_url
end

App.config.api_url = 'https://hanamimastery.com'
App.config.api_url # => 'https://hanamimastery.com'
```

### Using *dry-configurable* on class

On the class level, nothing changes, **you can use it exactly in the same way**.

```ruby
require 'dry-configurable'

class App
  extend Dry::Configurable

  setting :api_url
end

App.config.api_url = 'https://example2.com'
App.config.api_url
```

### Using *dry-configurable* on object

If you want to use it on the instance of the class, however, the only difference is that you need to include the `Dry::Configurable` module instead of extending it.

```ruby
class App
  include Dry::Configurable

  setting :api_url
end

app1 = App.new
app1.config.api_url = 'https://example3.com'
app1.config.api_url
# => 'https://example3.com'
app2 = App.new
app2.config.api_url
# => nil
```

Simple? Simple.

Keep in mind, that this way you may have, for example, 

- **multiple clients connecting to an external** `API`, each client being **completely independent!**
- **multiple database connections**

It's super useful, and I include `Dry::Configurable` in almost every gem or service I create, because of its flexibility and small size.

## Features

Now let's go through some of the features *dry_configurable* allows you to use.

### Basic setting

First of all, you can do a basic setting, which by default is set to `nil`. Then after setting the attribute to a specific value, this value will be returned.

```ruby
require 'dry-configurable'

class App
  extend Dry::Configurable

  # Defaults to nil if no default value is given
  setting :adapter

  # Defaults to false
  setting :enabled
end

App.config.adapter # => nil
App.config.adapter = :http
App.config.adapter # => :http
```

You can set the default values for your settings, passing the default value as a second argument.

#### Quick note about the deprecation warning

> NOTE: The syntax of configuring classes changed a little bit. If you see the deprecation warning;
>   [dry-configurable] passing a constructor as a block is deprecated and will be removed in the next major version
>      Provide a `constructor:` keyword argument instead
> You can switch to the new syntax


```ruby
require 'dry-configurable'

class App
  extend Dry::Configurable

  # Defaults to nil if no default value is given
  setting :adapter

  # Defaults to false

  # Old, deprecated way to set defaults
  setting :enabled, false

  # Current approach
  setting :enabled, default: false
end

App.config.enabled # => false
App.config.enabled = true
App.config.enabled # => true
```

If you'd like to access the setting directly on the class or instance the attribute is defined on, set the `reader` option to `true`. Then you'll be able to access that setting directly, while it'll also be available via the configuration object.

```ruby
require 'dry-configurable'

class App
  extend Dry::Configurable

  # Defaults to nil if no default value is given
  setting :adapter

  # Defaults to false
  setting :enabled, default: false, reader: true
end

App.enabled # => false
App.config.enabled # => false

App.config.enabled = true
App.config.enabled # => true
App.enabled # => true
```

### Nested settings

With *dry-configurable* you can add nested settings, with all features supported in every deep level. You can nest as many levels as you want, it'll all work the same!

```ruby
require 'dry-configurable'

class App
  extend Dry::Configurable

  # Pass a block for nested configuration (works to any depth)
  # Passing the reader option as true will create attr_reader method for the class
  # Passing the reader attributes works with nested configuration
  setting :repository, reader: true do
    # Can pass a default value
    setting :type, default: :local
    setting :encryption do
      setting :cipher, default: 'aes-256-cbc'
    end
  end
end
```

You can then use those settings by chaining the methods on the config object. And yes, the chaining works the same, if I'll set a `reader` option to `true`.

```ruby
App.config.repository.type # => ":local"

App.config.repository.type = :remote
App.config.repository.type # => ":remote"

App.config.repository.enryption.cipher # =>  "aes-256-cbc"

App.repository.type # => :remote
```

### Pre-Processed values

Finally, you can easily do the `pre-processing` of default, and passed setting values. I find it useful for example when I need to work with URLs. It's [generally bad practice to work with plain ruby strings](https://solnic.codes/2012/06/25/get-rid-of-that-code-smell-primitive-obsession/) when it comes to URL definitions, so I often wrap such in a `URI` object.

```ruby
require 'dry-configurable'

class App
  extend Dry::Configurable

  # Pre-process values
  setting(:url, default: 'https://hanamimastery.com') { |value| URI(value) }
end

App.config.url # => #<URI::HTTPS https://hanamimastery.com>

App.config.url = "https://subscribe.me"

App.config.url # => #<URI::HTTPS https://subscribe.me>
```

This makes sure I'll never have an invalid URL in my application. You can also do advanced Type checking, schema definitions, and so on, to be sure your app will never allow invalid configuration to be set.

### The *configure* block

So far, in the examples above, I mostly set the values to our settings using the inline attribute assignment.

However, if your component has a lot of settings, or maybe the name is too long, you can save some of the keystrokes by using the `configure` method. It sends the `config` instance to the block you pass as an argument and then yields whatever is inside.

I find it very useful as it's convenient for me to configure my ruby classes this way. I've shown how it looks at the very beginning of the article, but here is another example, with some comments.

```ruby
client = Client.configure do |config|
  config.adapter = :http
  config.url = 'https://hanamimastery.com'
end

client.config.adapter # => ":http"
client.config.repository.type # => :local
```

As you can see, the `configure` method returns the object it's called upon, so we can assign instances of the classes to variables for later usage and configure in the same operation.

While this is useful, it's only a useful syntax. I am surprised, however, that the official docs don't cover it! **It's an opportunity to write a little contribution**!

### Using dry-configurable in the gem

Finally, I'll quickly show the complete use case and explain what problem *dry-configurable* actually solves.

It's basically an extra layer on your `ENV` variables, but it gives you much more power than relying on the `ENV` variables, because:
 you don't risk `ENV` var naming clash,
you can do type validation for your setting,
you can do values preprocessing.

```ruby
#your gem source code
class MyGem
  extend Dry::Configurable
  setting :api_url do |value|
    URI(value)
  end
end

# in your for example rails app
# config/initializers/my_gem.rb

require 'my_gem'

MyGem.config.api_url = ENV['VAR_NOT_TIED_TO_GEM_IMPLEMENTATION']
```

This code already will fail in case of invalid configuration, like passing `nil` or invalid URL, which is a much more error-prone implementation.

## Summary

`dry-configurable` is so simple, but at the same so useful, it's hard to believe it's not included in all ruby applications. Similar concepts are applied to [dry-inflector gem](/episodes/4-string-transformations-with-dry-inflector) - skinny, simple, resuable and this is why I love *dry-rb* for.

It's worth mentioning, that **Hanami-RB 2.0 uses the dry-configurable** for the framework, view, and controller settings. Give it a try in your projects and you'll not regret it.

I hope you've enjoyed this episode, and if you want to see more content in this fashion, **subscribe to my Newsletter** and [follow me on twitter](https://twitter.com/hanamimastery)!

## Special Thanks

I'd like to thank Bohdan V. for supporting this channel, and all other people encouraging me to continue with Hanami Mastery project - It really matters a lot!

Any support allows me to spend more time on creating this content, promoting great open source projects, so Thank you!.


- [Bohdan V.](https://g3d.dev/) - For joining my [Mate supporters tier](https://github.com/sponsors/swilgosz)!
- [Paul Hanaoka](https://unsplash.com/@plhnk) - For an amazing Cover Photo
- [Andy Holland](https://github.com/AMHOL) - for coming with *dry-configurable* idea.
- [Nikita Shilnikov](https://github.com/flash-gordon) - For amazing upgrades.
- [Piotr Solnica](https://solnic.codes/) - for maintaining the *dry-configurable* gem and the tremendous work he does to keep *dry-rb* libraries alive!
