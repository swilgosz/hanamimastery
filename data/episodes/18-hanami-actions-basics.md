---
id: 18
aliases: ["HMEP018"]
author: "swilgosz"
topics: ["hanami", "hanami-actions"]
title: "Fun with Hanami Actions"
excerpt: "Hanami actions are one of the richest building blocks in terms of available features and in this episode I want to go over them, showing how to validate params, handle errors and and use before or after hooks."
videoId: o9F3RC424GI
publishedAt: "2022-04-12"
modifiedAt: "2022-04-29"
thumbnail:
  full: /images/episodes/18/cover-full.jpeg
  big: /images/episodes/18/cover-big.jpeg
  small: /images/episodes/18/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1513810275715399688
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/u1y02d/fun_with_hanami_actions_hanami_mastery_a/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/u1y0j7/fun_with_hanami_actions/
source: https://github.com/hanamimastery/episodes/tree/main/018
---

Action in Hanami is probably the biggest and the most feature-rich building block. In this episode, I want to have some fun with them by trying out different parts and show you some features you'll need to build complete web applications.

Let's start with a basic action.

### Overriding the body

By default, actions use corresponding defined views and HTML template, but for this example for simplicity, I'll skip views by defining the `handle` method and overriding the status and the body.

```ruby
module Main
  module Actions
    module Home
      class Show < Action::Base
        def handle(req, res)
          res.status = 200
          res.body = "<h3>Hello, awesome subscriber!</h3>"
        end
      end
    end
  end
end

```

When I'll open the root URL, you should see the updated welcome message in the browser now.

![Inline Action Body](/images/episodes/18/inline-action-body.png)

This is pretty neat, but to show more interesting stuff, I need a PATCH action.

I'll copy it over to another action file, named subscribe. Then I'm going to register my new action in the router as an endpoint responding to a PATCH HTTP method.

```ruby
patch 'subscribe/:email', to: "home.subscribe"
```

```ruby
module Main
  module Actions
    module Home
      class Subscribe < Action::Base
        def handle(req, res)
          res.status = 200
          res.body = "<h3>Hello, awesome subscriber!</h3>"
        end
      end
    end
  end
end
```

 Now let's extend this beauty.

### Custom Response headers

The first thing I want to show is how we can modify response headers in Hanami Actions.

Similar to the body, I can update response headers easily because headers are stored as the plain hash in the request object. I'll add a custom header to the existing headers list, and then show it in the response.

```ruby
res.headers.merge!("X-Custom" => "OK")
```

When I visit the URL subscribe me at hanamimastery.com, you will see a new header being returned.

![Custom header set](/images/episodes/18/custom-header-set.png)

### Params

That's cool!

Now, when headers are covered, let's have some fun with parameters.

In my action, I can easily access all parameters passed to it too! Let me quickly add params to the response body for an easier overview. I'll change the body string to [HEREDOC syntax](https://www.rubyguides.com/2018/11/ruby-heredoc/) to easier maintain multiline string definition and add the params hash at the bottom.

```ruby
module Main
  module Actions
    module Home
      class Subscribe < Action::Base
        def handle(req, res)
          res.status = 200
          res.body = <<-HTML
            <h3>Hello, awesome subscriber!</h3>
            <p>#{req.params.to_h}</p>
          HTML
        end
      end
    end
  end
end
```

I can see here the email read from an URL parameter, and if I will add something to the query, it will be visible here too!

![Params in Response 1](/images/episodes/18/params-in-response-body-1.png)

That's awesome, so let's try to add the JSON body parameters to the request and see what happens.

![JSON request example](/images/episodes/18/json-request-example.png)

**Surprisingly, nothing.**

There are no additional parameters parsed from the request body! The reason is that by default, all the input coming to the action is just text.

To inform your application on how to tackle JSON input, you need to set up a JSON body-parser.

I'll do it in the `config.ru` file.

```ruby
#config.ru
require "hanami/middleware/body_parser"
use Hanami::Middleware::BodyParser, :json
```

After restarting the server, your extra parameter should be visible now.

![Params in response body 2](/images/episodes/18/params-in-response-body-2.png)

#### Validating params

Having access to the parameters is great, but there may be a chance you'd like to validate the input parameters incoming to your enpoints.

Applications may be much more complicated than CRUD-based resource updating projects, and therefore, Hanami allows to validate parameters without coupling validations to persistence layer of your app.

To Validate params, use the `params` method, defining the expected parameters schema inside.

```ruby
  class Subscribe < Action::Base
    params do
      required(:name).filled
    end
    # ...
  end
```

Having that, we can *halt* the request processing, in case the parameters are not valid and return the errors instead.

```ruby
module Main
  module Actions
    module Home
      class Subscribe < Action::Base
        params do
          required(:name).filled
        end

        def handle(req, res)
          halt 422, req.params.errors unless req.params.valid?

          res.status = 200
          res.body = <<-HTML
            <h3>Hello, awesome subscriber!</h3>
            <p>#{req.params.to_h}</p>
          HTML
        end
      end
    end
  end
end
```


:::note
Hanami uses [Dry Validations](https://dry-rb.orgs/dry-validation) and [Dry-Schema](https://dry-rb.orgs/dry-schema) under the hood as a validation engine, and **I'll do a separate video about the details of how powerful those gems are**, but for now let's just check what happens when I call this code.
:::

Now, when I'll send the request with the empty *name*, I'll get the *422* error response and none of the code after the validation call will be performed.

![Validation Error example](/images/episodes/18/validation-error.png)

### Before and After Hooks!

It's cool to have this in place, however with this line our `handle` method starts to be a bit fat, doing too much. Validating parameters is something that can happen before every action in my system.

Even without validations, there is often a need to do something before or after your action is called. For example, you may want to authenticate a user before each of your endpoints or add some headers to the response.

Such common scenarios can be achieved via *before* and *after* hooks.

Let me extract my validation check to the *before* hook then.

At the top of the action I'm defining the hook, and the method it should call, and then extract my validation check to the separate private method of the action.

```ruby
module Main
  module Actions
    module Home
      class Subscribe < Action::Base
        before :validate

        def handle(req, res)
          res.status = 200
          res.body = <<-HTML
            <h3>Hello, awesome subscriber!</h3>
            <p>#{req.params.to_h}</p>
          HTML
        end

        private

        def validate(req, res)
          halt 422, req.params.errors unless req.params.valid?
        end
      end
    end
  end
end
```

#### Chaining before and after hooks

I can also chain the hooks together and **prepend or append hooks to the existing list.**

Let me add a few methods, just to show you the mechanism, that will extend the body of my response by my name.

Before my action call I'll introduce myself. I add my first and last name to the body, then I want to prepend the title to it, and finally append the company information.

I already prepared those methods so let me paste them in.

```ruby
module Main
  module Actions
    module Home
      class Subscribe < Action::Base
        before :add_first_name, :add_last_name
        prepend_before :add_title
        append_before :add_company

        # ...

        def handle(req, res)
          res.status = 200
          res.body = <<-HTML
            <p>#{res.body}<p>
            <h3>Hello, awesome subscriber!</h3>
            <p>#{req.params.to_h}</p>
          HTML
        end

        private

        # ...

        def add_first_name(*, res)
          res.body = [res.body, "Seb"].join(" ")
        end

        def add_last_name(*, res)
          res.body = [res.body, "Wilgosz"].join(" ")
        end

        def add_title(*, res)
          res.body = [res.body, "Mr"].join(" ")
        end

        def add_company(*, res)
          res.body = [res.body, "from Hanami Mastery"].join(" ")
        end
      end
    end
  end
end
```

When I'll run this, It'll arrange my string components in the expected order!

![Before action hook example](/images/episodes/18/before-hooks-example-response.png)

If you want some methods to be run after the given action, use the `after` hooks in the same way.

### Error Handling

Finally, let's take a short look at the error handling. Hanami provides a neat way to handle exceptions in actions by using `handle_exception` method called on the action config object.

Let's say, I want to *authorize* my user before anything else happens.

```ruby
module Main
  module Actions
    module Home
      class Subscribe < Action::Base
        AuthorizationError = Class.new(StandardError)

        before :authorize
        # ...

        def handle(req, res)
          res.status = 200
          res.body = <<-HTML
            <p>#{res.body}<p>
            <h3>Hello, awesome subscriber!</h3>
            <p>#{req.params.to_h}</p>
          HTML
        end

        private

        # ...

        def authorize(*, res)
          raise AuthorizationError
        end
      end
    end
  end
end
```

This will raise the `AuthorizationError`,  and return to the browser as a *500 server error* which is not the best experience to the user.

![Unhandled error response](/images/episodes/18/unhandled-error-response.png)

Instead, we would like to handle this and return the readable error message to the user, ideally also with the correct HTTP status set.

To do this, I'll add the error handling configuration to the action

```ruby
module Main
  module Actions
    module Home
      class Subscribe < Action::Base
        AuthorizationError = Class.new(StandardError)

        config.handle_exception StandardError => :handle_authorize

        before :authorize

        # ...

        private

        # ...

        def handle_authorize(*, res, *)
          res.status = 401
          res.body = "Unauthorized."
        end
      end
    end
  end
end
```

This will properly handle my error and return the formatted message to the user exactly as you could expect.

![Handled error response](/images/episodes/18/handled-error-response.png)

### Summary

Hanami Actions are rich in features, that are extremely useful in building scalable web applications. I only covered a few main functions, but if you want to know more, I strongly recommend to visit the documentation for easier overview.

Working with actions is surprisingly easy, and I had a lot of fun trying them out. I especially enjoyed the fact, how separated different concerns are, such as validations or error handling.

However, that's all for today. I hope you've enjoyed this episode, and

:::note Become an awesome subscriber!

If you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/channel/UC4Z5nwSfZrUO4NI_n9SY3uQ)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!
:::

### Thanks

I want to especially thank my recent sponsors,

- **MVP match**
- **[AscendaLoyalty](https://ascendaloyalty.com)**
- **[DNSimple](https://dnsimple.com/opensource)**.

for supporting this project, I really apreciate it!

By helping me with a few dollars per month creating this content, you are helping the open-source developers and maintainers to create amazing software for you!

And remember, if you want to support my work even without money involved, the best you can do is to like, share and comment on my episodes and discussions threads. Help me add value to the Open-Source community!

Also big thanks to [Jakob Owens](https://unsplash.com/@jakobowens1) for a great cover image.
