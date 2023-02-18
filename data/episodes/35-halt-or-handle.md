---
id: 35
aliases: ["HMEP035"]
author: "swilgosz"
topics: ['hanami', 'dry-monads']
title: "Halt or Handle? Dealing with exceptions in Hanami apps!"
excerpt: "Handling exceptions is one of the most needed features for any applications that can scale. If you are wondering, how to handle errors in Hanami 2 applications, don't look for more."
videoId: DKvzkUXV1kU
published: true
publishedAt: "2022-12-13"
modifiedAt: "2022-12-13"
thumbnail:
  full: /images/episodes/35/cover-full.jpeg
  big: /images/episodes/35/cover-big.jpeg
  small: /images/episodes/35/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1602640382533181440
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/zkujxt/halt_or_handle_dealing_with_exceptions_in_hanami/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/zkuk4c/halt_or_handle_dealing_with_exceptions_in_hanami/
source: https://github.com/hanamimastery/episodes/tree/main/035
---
Handling exceptions in a graceful way is a useful feature. In fact, my article about [handling exceptions in Rails applications](https://driggl.com/blog/a/handling-exceptions-in-rails-applications) is one of the most popular I've ever written - and that was done **even before** I realized, that Ruby community is active on Twitter and Reddit, so **there was no promotion whatsoever**.

Based on that I've decided then to play with error handling in Hanami applications too, even though [hanami has built-in mechanism to deal with them](https://guides.hanamirb.org/v2.0/actions/exception-handling/).

## Two ways of dealing with exceptions in Hanami apps

In Hanami applications, there are two main ways to deal with exceptions.

### The _handle_exception_ method

First is the built-in solution for automatically rescuing from the errors risen by the code inside of action.

Let's take a look at the code below.

```ruby
# app/actions/books/show.rb

module Bookshelf
  module Actions
    module Books
      class Show < Bookshelf::Action
        include Deps['repositories.books']

        def handle(req, res)
          book = books.find(req.params[:id])
          res.body = serialize(book)
        end

        private

        def serialize(entity)
          entity.to_h.to_json
        end
      end
    end
  end
end
```

How many things can go wrong here?

For me, three (but **let me know if you can find more!**)

1.  The ID can be not acceptable. For example, not being a number (or being a negative number), which could crash our fetching mechanism.
2.  The book with the given Id can be missing.
3.  DB connection can crash.

You may deal with those, by calling the `handle exception` method at the top of your action. To make things more DRY, I'll place this code in the main `Action` file for my app.

```ruby
# app/action.rb

require "hanami/action"

module Bookshelf
  class Action < Hanami::Action
    handle_exception StandardError => 500
  end
end
```

This code will now handle any `StandardError`, and map it to the `500` http error code, returning predefined message to the browser. You can also set the _custom_ handler method to render own messages, and add advanced error processing.

```ruby
# app/action.rb

require "hanami/action"

module Bookshelf
  class Action < Hanami::Action
    handle_exception StandardError => :error_handler

    def error_handler(req, res, exception)
      res.status = 500
      res.body = {
        title: "Server Error",
        details: exception.message
      }.to_json
    end
  end
end
```

The code here will render the detailed message in the browser, serializing the error to the predefined format.

![Server error browser response](/images/episodes/35/browser-server-error-response.png)

This, of course, does not cover everything, but I'll get into the remaining parts in a moment.

For now, let me tell you the other way to deal with errors in Hanami.

### The Halt method

Sometimes you don't want your code to raise an error, but still, you want to return the non-successful error message to the browser.

For example, when you pass the unacceptable ID, you would like to return the `400` error to the browser. From another hand, when the record is not found, you may want to return `404`.

![Diagram: expected error responses](/images/episodes/35/expected-error-responses.png)

Let's deal with the first example.

### Validating URL dynamic parameters

As you’ve seen just a second ago, **my repository crashes when we pass string values to it**. By default my ID is treated as string, and passed this way to the repo.

We could update our repository code, to work with string values, but I don't want to do it, as the repository is expected to work with Integers - **it is documented that way, and the whole application relies on that**.

The better approach would be, **to update my action**, validate and coerce the input parameters to ensure, we always call the repository with the acceptable input. Let me do it very quickly.

```ruby
module Bookshelf
  module Actions
    module Books
      class Show < Bookshelf::Action
        handle_exception StandardError => :error_handler

        include Deps['repositories.books']

        params do
          required(:id).filled(:integer, gteq?: 0)
        end

        # ...
      end
    end
  end
end

```

I have added a `params` method with a block defining my parameters schema. It checks the types and does basic coercion of string values into an Integer.

This basic validation is checked automatically and based on the result I can raise an error or just work with the result.

![Success response in the browser](/images/episodes/35/browser-success-response.png)

However, I don't do anything with the validation result just yet, so when I'll call `books/invalid` URL, I'll again get the `Server Error`, as my repository will crash.

To solve this, in the `handle` method, I can take care of the validate params I could raise an error here and deal with it as in the example above, or handle it using the `halt` method.

```ruby
# app/actions/books/show.rb

def handle(req, res)
  params = req.params
  halt 400, params.errors.to_h unless params.valid?

  book = books.find(params[:id])
  res.body = serialize(book)
end

```

When I use `halt`, it stops the code processing and immediately returns the response to the browser, which may be quite a useful feature.

### Handling Not found

Now, as I ensured I'll only work with valid parameters, there still is a case, that my repository won't find the object. Depending on how I implement my repository, it could raise `NotFoundError`, or just return `nil` (or `NullObject`) for the records that do not exist in our data store.

Despite being a fan of a [Null object pattern](https://medium.com/@kelseydh/using-the-null-object-pattern-with-ruby-on-rails-b645ebf79785), to keep things simple, let's stick with the `nil` approach.

With this, I can just halt with the _"Not found"_ error, .error message being returned to the browser

```ruby
# app/actions/books/show.rb

# ...

def handle(req, res)
  params = req.params

  halt 422, params.errors.to_h, unless params.valid?

  book = repository.find(params[:id])
  halt 404 unless book

  res.body = serialize(book)
end

# ...

```

## But what is the best way to handle exceptions in Hanami apps?

I won't answer that. This would require a lot of benchmarking, collecting data from developers, and confronting different ways of dealing with the problem. What I can do, is tell you my approach to this topic.

Subjective, and imperfect, I hope you guys will build upon it and improve.

For me, an exception in the application happens, when there is _unexpected behavior_. This, by definition, results in the unhandled error, which in the web app will result in **500 server error**.

If something else happens, **it's expected**, and my code should take care of it, either by returning proper message, or behiving properly.

![Diagram: Expeced vs unexpected errors](/images/episodes/35/expected-vs-unexpected-exceptions.png)

To easily handle failure scenarios, I'm leveraging [dry-monads](/episodes/7-untangle-your-app-with-dry-monads), and the [Success/Failure approach using _do notation_](https://www.morozov.is/2018/05/27/do-notation-ruby.html). This gem is built-in into the hanami applications, so it’s easy to use it right-away.

### Action responsibility

Within an action, which belongs to the application layer, I only perform basic HTTP request processing, which includes:

1.  Authentication & [authorization](/episodes/12-authorization-with-jwt)
2.  [Params format validation](/episodes/18-hanami-actions-basics)
3.  [Data deserialisation](/episodes/7-untangle-your-app-with-dry-monads)
4.  Calling proper interactor
5.  [Serializing result (success or failure)](/episodes/21-serialization-with-alba)

I don't plan to go through each of those steps in detail here, but fee free to visit linked episodes for more information.

The key her e, is the **interactor**. This is an entry point to your business logic, and in My case, it should return single type of result. This result, can be an indicator of successful processing, or failed scenario.

If something unexpected happens, the error falls back to `StandardError`, is being handled by general handler (notifying developers), while the serialized response is returned to the client.

However, for the remaining scenarios, we just return `Success` or `Failure`, which makes it easy to handle responses.

```ruby
# app/actions/books/show.rb

before :deserialize
before :authorize
before :validate

# ...

def handle(req, res)
  result = interactor.call(req.params, auth)
  halt_with_error(result.failure) unless result.success?

  res.body = serialize(book)
end

# ...
```

I also like to leverage the `before` callbacks, to setup some request processing and halt with errors depending on the fact which step fails. Then in the main action, I'd define those steps.

```ruby
# app/action.rb

def deserialize(req, res)
  return if params[:data].present?

  halt 400, "Unprocessable Entity"
end

def authorize(req, res)
  return if authorizer.call(req.params, auth).success?

  halt 403, "Unauthorized"
end

def validate(req, res)
  return if req.params.valid?

  halt 422, req.params.errors.to_h
end

```

This way I keep my interactors unaware of the HTTP layer of my application, and I can use them in different parts of the system, not only in actions, and they'll still work exactly the same.

### What is your approach to errors?

While I like this, I'm extremely interesting, what would be your preferences to handle errors in Hanami apps?

Do you like to define mappers in the action configuration block? Do you prefer to raise errors?

Or do you maybe have your own way to deal with this topic? Let me know in the comments!

### Thanks

I want to especially thank my recent sponsors,

-   [Akilas Yemane](https://twitter.com/akilasy)
-   [Bill Tihen](https://github.com/btihen)
-   [Benjamin Klotz](https://github.com/tak1n)

for supporting this project, I really appreciate it!

And, if you want to support us, check out our [Github sponsors page](https://github.com/sponsors/swilgosz) or join [Hanami Mastery PRO](https://pro.hanamimastery.com/) to gain the access to more learning resources and our private discord server!
