---
id: 11
aliases: ["HMEP011"]
author: "swilgosz"
topics: ["dry-rb", "dry-effects", "hanami"]
title: "#11 Effective programming in ruby"
excerpt: "2 real-world examples of using algebraic effects in Hanami ruby applications with dry-effects."
videoId: "Ik_81cHFAqg"
publishedAt: "2021-11-29"
thumbnail:
  full: /images/episodes/11/cover-full.jpeg
  big: /images/episodes/11/cover-big.jpeg
  small: /images/episodes/12/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1465212762888486913
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/r4pw59/11_effective_programming_in_ruby_wit_dryeffects/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/r4pwd8/11_effective_programming_in_ruby_wit_dryeffects/
source: https://github.com/hanamimastery/episodes/tree/main/011
---
Algebraic effects are a concept from functional programming that allows working with a shared, non-locale state.

You can achieve a lot of amazing things with them, like

- continuable error handling,
- promises and parallel execution,
- caching
- timeouts
- feature toggles,
- dependency injection
- ...and many, many more. 

All that can be done in a unified, testable way, which could bring more cohesion to your projects.

For me, coming from an object-oriented world, however, It was not something I could easily grasp just by looking at the definition. Fortunately, [similar to monads](/episodes/7-untangle-your-app-with-dry-monads), **one doesn't need to fully understand algebraic effects or category theory to figure out why and when they may be useful.**

In this episode of Hanami mastery I will show you **two simple but real-world examples of using effects to extend your Hanami or any other ruby application**. I will use Hanami hello, World application for showcasing those scenarios, but you can apply the concept to whatever you wish.

For that, I will make use of [[dry-effects]] which is a neat little library that implements the most useful algebraic effects in Ruby. Created by Nikita Shilonicov and Piotr Solnica and managed by the dry team it follows the simple rule of doing just one thing but doing it in the best possible way.

## The reader effect

Let's tackle the first example.

I have my "hello world" application here and I would like to add a localization feature to support multiple languages.

![[/images/episodes/11/hello-world.png]]

In my view, I have the message method exposed, which is then rendered in the template. 

```ruby
# /slices/main/views/home/show.slim

module Main
  module Views
    module Home
      class Show < View::Base
        expose: message
      end
    end
  end
end
```

```ruby
# /slices/main/templates/home/show.slim

h1 = message
```

### Basic localization implementation

To add a very simple locale check, I will update the exposure to accept the locale argument, and based on its value I'm going to render the localized string.

For the sake of this example, I will hardcode the support of two languages, so for English, I will render "Welcome to Hanami Mastery!", and for Swahili, "Karigo Hanami Mastery!"

Otherwise, I'm going to render the information about string not being localized properly.

```ruby
module Main
  module Views
    module Home
      class Show < View::Base
        private_expose :locale
        expose: message

        private

        def message(locale:)
          case locale
          when 'en' then "Welcome to Hanami Mastery!"
          when 'sw' then "Karibu Hanami Mastery"
          else 'We can\'t translate but welcome you anyway!'
          end
        end
      end
    end
  end
end
```

Then I need to pass the locale from the action into my view, which will read the locale from parameters.

```ruby
module Main
  module Actions
    module Home
      class Show < Main::Action
        def handle(req, res)
          res.render view, locale: req.params[:locale]
        end
      end
    end
  end
end
```

Voila! It works!

![[/images/episodes/11/karibu-world.png]]

However, how much overhead it is?

#### Downsides of this approach

Imagine you need to add localization in all your views. Updating all the actions just to pass the locale doesn't seem to be the best approach.

Also, for the need of testing my views, I now need to be sure how exactly they should be initialized and that's not something I want to do.

What I would love to do is to keep the number of changes required to be made in my application to add the locale support at the minimum level.

### Localization in Hanami with dry-efects

It would be super convenient to just use the locale helper whenever I need it, without carrying where and how the localization is resolved in my application.

Therefore, to show the localized string, I will include the reader effect in my view, setting the reader name to `:locale`, and based on this I will show the correct translation in the browser.

```ruby
require 'dry/effects'

module Main
  module Views
    module Home
      class Show < View::Base
        include Dry::Effects::Reader(:locale)

        expose :message do
          case locale
          when 'en' then "Welcome to Hanami Mastery!"
          when 'sw' then "Karibu Hanami Mastery"
          else 'We can\'t translate but welcome you anyway!'
          end
        end
      end
    end
  end
end
```

The custom rendering can be removed from my action now.

```ruby
# frozen_string_literal: true

module Main
  module Actions
    module Home
      class Show < Main::Action
      end
    end
  end
end
```

The reader effect is the simplest effect available, it just reads the state and throws an error in case the state is used but not set just yet.

In my case, this is exactly what will happen. Because I had not set my initial value for the locale reader, trying to read it in the browser will raise an error saying that the state cannot be read.

![[/images/episodes/11/state-not-set.png]]

It's expected, and to solve it, I will write a little localization middleware that will be used by my whole application. 

#### Localization middleware

In the `confug.ru` file I will add the localization middleware to the stack and then I will define it in a proper file.

```ruby
# config.ru
require_relative "./lib/rack/locale"

use Rack::Locale
```

The simplest possible rack middleware just takes the application and calls it without changing anything.

```ruby
module Rack
  class Locale
    def initialize(app)
      @app = app
    end

    def call(env)
      @app.(env)
    end
  end
end
```

[Marc Busque](https://github.com/waiting-for-dev) explains it very well in his talk about Harnessing the power of functions he presented at RubyConf in 2021. Check it out, as it covers a few very interesting details about functional programming.

Here, to properly set the locale, I will include the reader effect handler, setting the reader name to locale, and within a `call` method I will wrap my app call by a `with_locale` block.

As a value, I will pass the initial locale value resolved by the method I will write in a moment.

Just for simplicity, I will extract the locale from request parameters and check if it's in the list of locales supported by my application. Then I will fall back to the English language.

```ruby
require "dry/effects"

module Rack
  class Locale
    SUPPORTED = %w[en sw].freeze
    DEFAULT = 'en'.freeze

    include Dry::Effects::Handler.Reader(:locale)

    def initialize(app)
      @app = app
    end

    def call(env)
      with_locale(detect_locale(env)) do
        @app.(env)
      end
    end

    def detect_locale(env)
      given_locale = Rack::Request.new(env).params['locale']
      SUPPORTED.detect { |l| l == given_locale } || DEFAULT
    end
  end
end
```

Having that, let's try it out.

#### Testing out dry-effects localization

When I restart the server and open the browser now, you will see an English version of my welcome page, but as soon as I will add the locale parameter, the translation will change to the chosen language.

No changes then in the behavior, **but the implementation is completely different.**

This is awesome because now my app can access the locale helper whenever needed, **without taking care of how to resolve its value!**

The responsibility of setting that up is extracted into a single place.

**It's also super convenient in testing**, but having that covered, let's go to another example.

### Current Time

I would love my welcome message to show the current time in the browser too. 

I want you to think **How would you do it?**

The easiest way to do so is to just assign a `Time.now` to a variable in the view and format it in a neat way. 

```ruby
expose :message do
  current_time = Time.now
  formatted_time = current_time.strftime("%Y-%m-%d %h:%M:%s")
  case locale
  when 'en' then "Welcome to Hanami Mastery at #{formatted_time}!"
  when 'sw' then "Karibu Hanami Master at #{formatted_time}!"
  else "We can\'t translate but welcome you anyway at #{formatted_time}!"
  end
end
```

Is it your chosen approach? Don't lie, I know it is.

It's fine. Straightforward, and at the first glance, it works.

However, using `Time.now` in the class directly is a classic example of a side effect. When I will want to test my view behavior, I will immediately detect some problems, as **each test run will give me different results!** For me, a code hard to test is a code badly written.

To test my view I would need to stub the `Time.now`, which means, **I would need to know how exactly my class fetches the current time and could not threaten it as a black box anymore.**

Whenever I would need to change it, my test would fail even though the class behavior doesn't change at all.

> I am going to deep dive into the best Hanami testing practices in Hanami Premium! Join now if you want to get to another level of Hanami's expertise!

But let's go back to the topic. To solve the problem with tests, I could inject the current time from the outside as a dependency, or use an effect. 

Both approaches are fine, but you probably know how to pass the dependency into an object, and effects can be somewhat new for you.

So here in my view, I will use the `CurrentTime` effect!

```ruby
require 'dry/effects'

module Main
  module Views
    module Home
      class Show < View::Base
        include Dry::Effects::Reader(:locale)
        include Dry::Effects::CurrentTime

        expose :message do
          formatted_time = current_time.strftime("%Y-%m-%d")
          case locale
          when 'en' then "Welcome to Hanami Mastery at #{formatted_time}!"
          when 'sw' then "Karibu Hanami Master at #{formatted_time}!"
          else "We can\'t translate but welcome you anyway at #{formatted_time}!"
          end
        end
      end
    end
  end
end
```

I can remove the `Time.now` call as I won't need it anymore.

#### CurrentTime middleware for handling algebraic effect

Then I will write the CurrentTime middleware to resolve the current time state. 

```ruby
# config.ru

require_relative "./lib/rack/with_time"
use Rack::WithTime
```


In the `config.ru` file I'm going to add the new middleware to the stack and then define the actual class.

The base for the `WithTime` middleware is the same as in the previous example, so I'll just paste the prepared code here.

```ruby
module Rack
  class WithTime
    def initialize(app)
      @app = app
    end

    def call(env)
      @app.(env)
    end
  end
end
```

The only thing that changed here is that I need to include the current time effect handler, and then wrap my `@app` call with the `with_current_time` block.

```ruby
require "dry/effects"

module Rack
  class WithTime
    include Dry::Effects::Handler.CurrentTime

    # ...

    def call(env)
      with_current_time do
        @app.(env)
      end
    end
  end
end
```

Within this block, the `current_time` variable can be used, and the amazing thing is, **that it's frozen**, so it'll return the same value during the whole request processing.

From the behavior point of view, my app works exactly the same but my view object now can be tested with convenience, without stubbing `Time.now` or using solutions like
[Timecop](https://github.com/travisjeffery/timecop)!

My view doesn't care about setting the state anymore so in tests I can set it up in any way and it will work exactly as I would expect.

### Summary

**Algebraic effects are just a new tool to solve common programming problems** in a unified, coherent way, ensuring our code is easy to test and easy to maintain and dry-effects

If you will write about other examples of using effects in ruby, let me know, I will gladly include your articles in this post as references, and If you wish to contribute to Hanami Mastery content, feel free to do so as well!.

If you are interested to see other examples of using effects in ruby, let me know, I am keen to come with other use cases for this topic in the upcoming episodes.

It can become a while until effects will be widely adopted across ruby applications but you may be one of the early adopters!

For more advanced examples join Hanami Mastery PRO or my GitHub Sponsors, to get access to weekly premium episodes!

I hope you've enjoyed this episode, and if you want to see more content in this fashion, **subscribe to [my YT channel](https://www.youtube.com/channel/UC4Z5nwSfZrUO4NI_n9SY3uQ)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!

### Special Thanks!

I'd like to especially thank 

- [Andrzej Krzywda](https://github.com/andrzejkrzywda)
- Sebastjan Hribar
- and [Useo](https://github.com/useo-pl)

Together with all my other GitHub sponsors for supporting this project and the whole Hanami Mastery initiative. Highly appreciated! You make this project possible!

Also thanks to [Nicolas Picard](https://unsplash.com/@artnok) - for a great cover image!

Thanks to all of you for being a part of the great Ruby community and for all the positive reactions you give. You're awesome! 

Feel free to checkout **my other episodes**, and if you have any suggestions of amazing ruby gems You'd like me to cover, or ideas on how to improve, please mention them in the comments!

Have a nice day and see you in the next Hanami Mastery episode.
