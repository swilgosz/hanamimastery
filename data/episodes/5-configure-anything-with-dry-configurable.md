---
id: 5
author: "swilgosz"
tags: ["backend", "dry-rb", "dry-configurable"]
title: "#5 Configure anything with Dry::Configurable"
excerpt: "Configuring projects and components is one of the most common features in programming in general. dry-configurable is a standalone gem providing you exactly this in Ruby! Read about how to use it."
videoId: J_352sH25oc
thumbnail:
  full: /images/episodes/5/cover-full.jpeg
  big: /images/episodes/5/cover-big.jpeg
  small: /images/episodes/5/cover-small.jpeg
source: https://github.com/hanamimastery/episodes/tree/main/001
---
When you write ruby gems or even reusable components, there is often a need for configuring your projects to behave differently in different contexts.

For example, in our [EventStoreClient](https://github.com/yousty/event_store_client) gem, we've used to connect to the [external event store](https://eventstore.com). We needed to pass the authorization data, as well as the URL of the store where it was hosted upon.

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

In fact, it's so common behavior, **where a gem or component needs to be configured somehow**, that it's surprising most of the projects come with the custom configuration implementations, not always thinking about being Thread-Safe, Type-safe, or even test the configuration engine properly.

You can configure anyting, from initial [stylings for your applicaiton](/episodes/3-style-your-app-with-bulma), database connections, whatever you want.

In today's episode of Hanami Mastery, I want to show you the [Dry-Configurable gem](https://dry-rb.org/gems/dry-configurable), which may be an amazing improvement in this field.

### Dry::Configurable

`dry-configurable` is a simple mixin allowing you to add thread-safe configuration behavior to your classes.

Initially written by [Andy Holland](https://github.com/AMHOL), then basically rewritten by [Nikita Shilnikov](https://github.com/flash-gordon) and [Piotr Solnica](https://github.com/solnic), is one of such micro-libraries, that are close to perfection and **can be injected almost everywhere*8.

### Usage

> **Note:** Because of intense work on [Hanami 2.0](https://hanamirb.org) and its dependencies at the moment, the interface of the `dry-configurable` may soon change a little bit, but that's a minor thing and you can always refer to the [gem's documentation](https://dry-rb.org/gems/dry-configurable) for the most up-to-date version of the usage. I'll also keep this article up-to-date.

`dry-configurable` is super simple to use, but because of its narrowed responsibility, at the same time it's extremely flexible to be used in different contexts.

Just extend the mixin and use the `setting` macro to add configuration options:

You can use it either on ruby `module` on a `class` or an `instance`.

On the module level, you need to extend the *Dry::Configurable* module and you can safely use all features it provides. Here I set the `api_url to hanamimastery.com`

```ruby
require 'dry-configurable'

module App
  extend Dry::Configurable

  setting :api_url
end

App.config.api_url = 'https://hanamimastery.com'
App.config.api_url # => 'https://hanamimastery.com'
```

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

If you want to use it on the instance of the class, however, the only difference is that you need to include the `Dry::Configurable` module instead of extending it.

```ruby
class App
  include Dry::Configurable

  setting :api_url
end

app1 = App.new.config.api_url = 'https://example3.com'
app1.config.api_url

app2 = App.new.config.api_url
app2.config.api_url
```

Simple? Simple.

Keep in mind, that this way you may have, for example, **multiple clients connecting to an external** `API`, each client being **completely independent!**

It's super useful, and I include `Dry::Configurable` in almost every gem or service I create, because of its flexibility.

### Features

Now let's go through some of the features *dry_configurable* allows you to use.

#### Basic setting

First of all, you can do a basic setting, which by default is set to `nil`. Then after setting the attribute to a specific value, this value is returned.

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

> Note: This syntax will change in the next release. Instead of second unnamed argument, the default value will be passed into the named parameter `default: YOURDEFAULT`

```ruby
require 'dry-configurable'

class App
  extend Dry::Configurable

  # Defaults to nil if no default value is given
  setting :adapter

  # Defaults to false
  setting :enabled, false
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
  setting :enabled, false, reader: true
end

App.enabled # => false
App.config.enabled # => false

App.config.enabled = true
App.config.enabled # => true
App.enabled # => true
```

#### Nested settings

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
    setting :type, :local
    setting :encryption do
      setting :cipher, 'aes-256-cbc'
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

#### Pre-Processed values

Finally, you can easily do the `pre-processing` of default, and passed setting values. I find it useful for example when I need to work with URLs. It's [generally bad practice to work with plain ruby strings](https://solnic.codes/2012/06/25/get-rid-of-that-code-smell-primitive-obsession/) when it comes to URL definitions, so I often wrap such in a `URI` object.

```ruby
require 'dry-configurable'

class App
  extend Dry::Configurable

  # Pre-process values
  setting(:url, 'https://hanamimastery.com') { |value| URI(value) }
end

App.config.url # => #<URI::HTTPS https://hanamimastery.com>

App.config.url = "https://subscribe.me"

App.config.url # => #<URI::HTTPS https://subscribe.me>
```

This makes sure I'll never have an invalid URL in my application. You can also do advanced Type checking, schema definitions, and so on, to be sure your app will never allow invalid configuration to be set.

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

This code already will fail in case of invalid configuration, like passing nil or invalid URL, which is a much more error-prone implementation.

### Summary

`dry-configurable` is so simple, but at the same so useful, it's hard to believe it's not included in all ruby applications. Similar concepts are applied to [dry-inflector gem](/episodes/4-string-transformations-with-dry-inflector) - skinny, simple, resuable and this is why I love *dry-rb* for.

It's worth mentioning, that **Hanami-RB 2.0 uses the Dry::Configurable** for the framework, view, and controller settings. Give it a try in your projects and you'll not regret it.

I hope you've enjoyed this episode, and if you want to see more content in this fashion, **subscribe to my Newsletter** and [follow me on twitter](https://twitter.com/hanamimastery)!

Also, **If you have any suggestions of amazing ruby gems You'd like me to cover, or ideas on how to improve, please mention it in the comments!**

### Special Thanks

I'd like to thank Bohdan V. for supporting this channel, and all other people encouraging me to continue with Hanami Mastery project - It really matters a lot!

Any support allows me to spend more time on creating this content, promoting great open source projects, so Thank you!.

- [Bohdan V.](https://g3d.dev/) - For joining my [mate supporters tier](https://github.com/sponsors/swilgosz)!
- [Paul Hanaoka](https://unsplash.com/@plhnk) - For an amazing Cover Photo
- [Andy Holland](https://github.com/AMHOL) - for coming with *dry-configurable* idea.
- [Nikita Shilnikov](https://github.com/flash-gordon) - For amazing upgrades.
- [Piotr Solnica](https://solnic.codes/) - for maintaining the *dry-configurable* gem and the tremendous work he does to keep *dry-rb* libraries alive!
