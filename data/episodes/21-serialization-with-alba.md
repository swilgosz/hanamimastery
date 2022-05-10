---
id: 21
aliases: ["HMEP021"]
author: "swilgosz"
topics: ["hanami", "api", "rom-rb"]
title: "JSON Serialization with Alba in Hanami"
excerpt: "Serialize your API responses in Hanami applications with alba - the fastest ruby serialization gem"
videoId: SHxV_pxh6m4
publishedAt: "2022-05-10"
modifiedAt: "2022-05-10"
thumbnail:
  full: /images/episodes/21/cover-full.jpeg
  big: /images/episodes/21/cover-big.jpeg
  small: /images/episodes/21/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1524108530751610883
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/umqmj7/json_serialization_with_alba_in_hanami_hanami/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/umqmru/json_serialization_with_alba_in_hanami_hanami/
source: https://github.com/hanamimastery/episodes/tree/main/021
---

If you are working with API, data serialization is definitely a feature you would love to be done well.

Data serialization refers to transforming your data objects, into a representable JSON output. A similar thing happens when you work with regular server-side rendered views. In that case, however, data is transformed into an HTML output, instead of JSON.

![Data Serialization](/images/episodes/21/serialization.png)

In Ruby, there are several gems that take care of that task, one of which 

- [ActiveModelSerializers](https://github.com/rails-api/active_model_serializers) or AMS, the most famous implementation of the JSON serializer for Ruby - it's a very old library and possibly the most known one.
- [JSONAPI-Serializer](https://github.com/jsonapi-serializer/jsonapi-serializer) - a community - managed descendant of `fast_jsonapi` gem, to keep that great project alive.
-  next you have [Blueprinter](https://github.com/procore/blueprinter) 
- [Panko serializer](https://github.com/panko-serializer/panko_serializer)

And several other gems you could use to achieve this task.

However, if speed is like air for your application, then you'd be only interested in **the fastest solutions available on the web**.

The fastest serializer for ruby apps I am aware of is *Panko serializer*, however, as it is a C-extension gem, chances are you'd look for an alternative pure ruby solution.

This is why in this episode, I'll go through the fastest Ruby serializer available currently.

## Meet Alba.

Alba is a well-maintained JSON serialization engine, for Ruby, JRuby, and TruffleRuby implementations, and what I like in this gem - except of its speed, is the easiness of use, no dependencies and the fact it plays well with any Ruby application!

![Alba stats](/images/episodes/21/alba-stats.png)

It had been created by [Okura Masafumi](https://github.com/okuramasafumi), a pretty active Ruby developer, organizer of [Kaigi on Rails](https://kaigionrails.org/) and several other ruby initiatives.

By the way,

:::important
Alba uses **Github discussion threads** for collecting [feedback](https://github.com/okuramasafumi/alba/discussions/categories/feedback), ideas, and discussions about the development - which I was inspired on. If you tried it out, feel free to share your thoughts with the gem's author to make this library even better than it is right now.
:::

### Installation

I have the scaffolded Hanami application here, with *rom-rb* Users repository pre-setup, so it's extremely easy to add or list records in the system. As always, you have the complete source code linked in the episode so feel free to check it out if you need a more detailed look at it.

:::info
Additionally, I have already talked about basic persistence in Hanami applications in [HME009](/episodes/9-guide-to-models-in-hanami-and-rom) and [HME018](/episodes/18-hanami-actions-basics), so I'll not go through the details this time, feel free to check them out!
:::

To start using *alba*, I'll first add it to my `Gemfile` together with the [oj](https://github.com/ohler55/oj) gem.

```ruby
gem 'alba'
gem 'oj'
```

And install them via the `bundle install` command.

### Configuration

The *Oj* gem is not required if you use the default configuration. In that case, alba works out of the box. However, it truly shines when it's optimized for speed. To to that, I'll create the serialization provider, where I'll require alba and configure the `:oj` as a backend.

I'm going to create a new provider named serializers, and inside of it, configure alba when the application starts.

```ruby
# config/providers/serializers.rb

Hanami.application.register_provider :serializers do
  start do
    require "alba"

    Alba.backend = :oj
  end
end
```

This way, `Alba` will be required and configured only after calling boot on my application, and **it won't slow down the console, nor unit tests, or all sorts of rake tasks!**

## Using Alba in Hanami

Now let's try it out!

### Setting up Hanami endpoints

Let me create a new `GET` endpoint fetching the current user information.

In the router, I'm adding the proper route handler, for `/users` index and show actions, and then creating a simple action to play with them.

```ruby
# config/routes.rb

slice :main, at: "/" do
  # ...
  get '/users/:id', to: 'users.show'
  get '/users', to: 'users.index'
end
```

Next, to inform my browser that all my responses are in JSON format, I'm going to add a before hook in the base action of the main slice, that will set the expected format before each call.

```ruby
# slices/main/lib/action/base.rb

module Main
  module Action
    class Base < Interlinker::Action::Base
      before :set_headers

      private

      def set_headers(req, res)
        res.headers['Content-Type'] = 'application/json'
      end
    end
  end
end
```

### Serializing single object

Having that I can create a new file, for the user show action.
It uses the user repository to fetch the requested object, and validates the *URL* parameter, ensuring the safe coercion to an integer.

This way I'll always work with Integers in my system, and stringified number will never leak into my application code!

```ruby
# slices/main/actions/users/show.rb

module Main
  module Actions
    module Users
      class Show < Action::Base
        include Deps[
          repo: 'repositories.users',
        ]

        params do
          required(:id).value(:integer)
        end

        def handle(req, res)
          user = repo.find(req.params[:id])
          res.body =
            Serializers::User.new(user).serialize
        end
      end
    end
  end
end
```

Finally, below I'll customize my `handle` method, to find the user based on the ID read from the URL, and setting the body to the Alba serialized response.

### Serializing Collection

Similarly, I'll add an action to list all my users in the system. The same thing, but no validation for now. We could add some filter checks, pagination parameters coercion, and so on, but I'll keep things simple for now.

```ruby
# slices/main/actions/users/index.rb

module Main
  module Actions
    module Users
      class Index < Action::Base
        include Deps[
          repo: 'repositories.users',
        ]

        def handle(req, res)
          res.body =
            Serializers::User.new(repo.all).serialize
        end
      end
    end
  end
end
```

Then let me create the new user serializer that we will use in our user model. I'm going to create a new folder in my main slice, named serializers, and define my alba resources there.

I want to wrap my resources under the `user` wrapper. We can do so by using the `root_key` macro with the expected key inside.

To define attributes I'll use the `attributes` macro passing names as parameters. If your attribute needs some basic transformations, you can use an `attribute` with a block.

Here I'll add a full_name to be listed instead of first and last name as separate fields.

```ruby
# /slices/main/lib/serializers/user.rb

module Main
  module Serializers
    class User
      include Alba::Resource

      root_key :user

      attributes :id, :nickname

      attribute :full_name do |resource|
        "#{resource.first_name}: #{resource.last_name}"
      end
    end
  end
end
```

Now let me add a few records to the database using `hanami console`:

```ruby
repo = Main::Container['repositories.users']

repo.create(
  nickname: 'awesomesubscriber', 
  first_name: 'Jack', 
  last_name: 'Sparrow'
)
repo.create(
  nickname: 'moreawesomesubscriber', 
  first_name: 'Elisabeth', 
  last_name: 'Swan'
)
repo.create(nickname: 'guest')
```

Now when I'll run the server and vist my user path, I'll get the information  about the given user in the system.

![Single response](/images/episodes/21/single-response.png)

It's awesome, so let's check what's under the `/users` endpoint.

![Collection response](/images/episodes/21/collection-response.png)

Alba serialization works out of the box for collections, which is great, however there is no root key visible here which is a bit inconsistent.

To fix it, in the serializer, let's add the `root_key_for_collection`. This nests our whole collection under the `:users` root key as one could expect.

![Nested collection](/images/episodes/21/nested-collection-response.png)

You may also specify this key inline, by passing the collection root key as a second argument to the general root key, depending on your preference.

That's already awesome! However, as it often is the case when it comes to great gems, we've just scratched the surface of possibilities.

### Nil handling

Alba comes with a rich set of features. For example, it allows transforming `nil` values easily to deliver readable defaults.

I'll now set my serializer, to fill all nullified keys with the `guest` string, using the `on_nil` method.

Then I'm going to update my `full_name` method to return `nil` in case both first and last_name attributes are absent.

```ruby
# /slices/main/lib/serializers/user.rb

module Main
  module Serializers
    class User
      include Alba::Resource

      on_nil { 'guest' }

      root_key :user
      root_key_for_collection :users

      attributes :id, :nickname, :nickname

      attribute :full_name do |resource|
        if resource.last_name && resource.first_name
          "#{resource.first_name} #{resource.last_name}"
        else
          nil
        end
      end
    end
  end
end
```

Now, when I'll visit the user endpoint to check the third user, I'll get prefilled values in the response body.

![Default values response](/images/episodes/21/default-values-response.png)

### Key transformation

Alba allows you to transform keys using the injected inflector! It works by default with active_support inflector, but it also supports the `dry-inflector`, which is default in Hanami.

The only thing I need to add to the serializer is 

```ruby
# slices/main/lib/serializers/user.rb

transform_keys :camel
```

And enable this feature in the provider file.

```ruby
# config/providers/serializers.rb

Alba.enable_inference!(with: :dry)
```

With this, our JSON response will look a little bit differently.

![Transformed keys](/images/episodes/21/transformed-keys-response.png)
There are several options you may use to transform your keys, and even write your own inflectors if you wish, which is not super hard to do.


### Inline definition with `Alba.serialize`

The final thing I want to show today, is the inline serialization.

Alba comes with the `serialize` class method, that allows you to define serializer inline, if you don't want to create a separate class for any reason.

In my Hanami action, I'll now use the inline definition of the serialization method, by changing the attributes a little bit to show the difference.

```ruby
# slices/main/actions/users/show.rb

def handle(req, res)
  user = repo.find(req.params[:id])
  res.body = Alba.serialize(user) do
    attributes :id, :first_name, :last_name
    root_key :user, :users
  end
end
```

Now in the browser you may see the new attributes listed.

![Inline serialization result](/images/episodes/21/inline-serialization-response.png)

## Summary

As I've said, I barely started covering the features alba provides. It supports 
- resource relationships, 
- attributes filtering, 
- errors handling and circular relationships control
- extendability
- conditional attributes

and more.

Aside of that alba is the fastest, ruby serialization gem out there, with some caveats.

- For sure, `panko` gem is faster, but it's partially written in `C`.
- Secondly, at the moment *alba* does not support the `JSON:API` standard, which I am keen to see, and I am curious how it'll perform in comparison with `jsonapi-serializer`, which is optimized exactly for that api standard.

I love this gem, however. It's extremely well maintained, extendible, rich in features, and very, fast.

Not sure what else one could expect from the serialization engine and if you hadn't used it yet, make sure you give it a chance!

Let me know what you think!

:::note Become an awesome subscriber!

If you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/channel/UC4Z5nwSfZrUO4NI_n9SY3uQ)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!
:::

### Thanks

I want to especially thank my recent sponsors, 

- **[Benjamin Klotz](https://github.com/tak1n)**
- **[Saeloun](https://github.com/saeloun)**
- **[Brandon Weaver](https://github.com/baweaver)**

for supporting this project, I really apreciate it!

By helping me with [monthly github sponsorship](https://github.com/sponsors/swilgosz) to create this content, together we really start making a difference in the Open-Source world! Thank you all for your support!

And remember, if you want to support my work even without money involved, the best you can do is to like, share and comment on my episodes and discussion threads. Help me add value to the Open-Source community!

Also big thanks to [Phil Botha](https://unsplash.com/@philbotha) for the great cover image!
