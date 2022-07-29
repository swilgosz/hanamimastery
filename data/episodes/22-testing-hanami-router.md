---
id: 22
aliases: ["HMEP022"]
author: "swilgosz"
topics: ["hanami", "hanami-router"]
title: "Hanami Router with TDD"
excerpt: "Routing is one of the basic components of any web application. In this episode I'll dig a bit into the Hanami router from the usage point of view, covering why it's great and how to work with it."
videoId: YI9YUYIROAw
publishedAt: "2022-06-13"
modifiedAt: "2022-06-13"
thumbnail:
  full: /images/episodes/22/cover-full.jpeg
  big: /images/episodes/22/cover-big.jpeg
  small: /images/episodes/22/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1536317415428182022
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/vbajuf/hanami_router_with_tdd_hanami_mastery_episode_22/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/vbak2g/hanami_router_with_tdd_hanami_mastery_episode_22/
source: https://github.com/hanamimastery/episodes/tree/main/022
---

Recently, I’ve had some [fun with Hanami Actions](/episodes/18-hanami-actions-basics), and this time I’ll dig a little bit into **the routing part**.

### Routing

Routing is one of the basic components of any web application. This is the interface between your application and the clients using it. In this episode I'll dig a bit into the Hanami router from the usage point of view, covering why it's great and how to work with it.

### Hanami-Router Path recognition tests
I'm going to start by writing a test file for my routes. Usually, I don't show this on the screencasts, but [I'm a big fan of test-driven development](https://www.udemy.com/course/ruby-on-rails-api-the-complete-guide/), and whenever possible I'm trying to practice TDD during actual development. To write routing tests, I'll create a new routes spec file, under the `spec/main` folder. One of the best things about Hanami is that most parts of the application can be unit-tested, and the Routing part is not an exception.

Actually The fact that Hanami is so easily testable is one of the reasons why I like this framework so much. I'll use [rspec](https://github.com/rspec/rspec/) as a testing framework because it's the **default in all Hanami projects** and I love it a lot.

First of all, I'll get the application router object and assign this to a variable. Note that the name of my app is "Sandbox."

```ruby
# spec/main/routes_spec.rb

require "spec_helper"

RSpec.describe "Routes" do
  let(:router) { Sandbox::Application.router }
end
```

Having that, I can write a few tests for my routes. Let's say I want to have an application that has a landing page and allows me to list people subscribed to my channel or create new subscriptions.

There are two ways to test if the endpoint for a given URL exists.

To check if those routes are present, I'll verify the path generation of my named routes.

I want to expect if the router's path named root serves the expected `/` URL.

```ruby
# spec/main/routes_spec.rb

require "spec_helper"

RSpec.describe "Main slice router" do
  let(:router) { Sandbox::Application.router }

  it 'routes to root URL' do
    expect(router.path(:root)).to eq('/')
  end

  it 'routes to /subscriptions URL' do
  end

  it 'routes to /subscribe URL' do
  end
end
```

When I run the first test, it'll pass out of the box, because the Hanami application comes with the root URL being served by default.

![Passing root path generation test](/images/episodes/22/first-test-passed.png)

Analogously, I'm going to check the remaining paths by adding check comparisons to the other two routes.

```ruby
# spec/main/routes_spec.rb

# ...
it 'routes to /subscriptions URL' do
  expect(router.path(:subscriptions)).to eq('/subscriptions')
end

it 'routes to /subscribe URL' do
  expect(router.path(:subscribe)).to eq('/subscribe')
end
# ...
```

The remaining two tests, however, of course won't work, as I don't have any custom routes defined yet. All tests except the `root` check fail saying, there is no named route defined.

![Failing tests example](/images/episodes/22/failing-tests.png)

Let me create them now.

### Creating basic routes

In the routes configuration file, I'm going to add a new `GET` route, recognizing the `/subscriptions` URL. I'll name it `:subscriptions`, and serve it by using a custom inline _rack_ response.

Below I'll add the `POST` route, named `:subscribe` and returning a `201` status code as a response with the *"Thank you!"* message.

```ruby
# config/routes.rb

module Web
  class Routes < Hanami::Application::Routes
    define do
      slice :main, at: "/" do
        root to: "home.show"

        get "/subscriptions",
          as: :subscriptions,
          to: ->(env) { [200, {}, [["Awesome Subscriber 1"]]] }
        post "/subscribe",
          as: :subscribe,
          to: ->(env) { [201, {}, ["Thank you!!!"]] }
      end
    end
  end
end
```

If you have any experience with Rack applications, this may be familiar to you. [hanami-router](https://github.com/hanami/router) is fully `rack`-compatible, and can be used to write any web server in Ruby, not only for Hanami applications!

It's extremely fast, and stable thanks to the great work of [Luca Guidi](https://github.com/jodosha), and if you're curious how it works, please check out [his talk about Hanami API](https://www.youtube.com/watch?v=tfvoNBU9-Zo), when he explains in details the mechanism he used to optimise it for any possible use case.

With this all my tests pass without any issues.

![Passing tests](/images/episodes/22/passing-tests.png)

But that's not all we can do to test our application routing properly!

### URL structure explanation
A single application endpoint stores much more information than just a path.

![URL structure](/images/episodes/22/url-structure.png)

The first part of a route is an HTML method, which tells if it's a `GET`, `POST`, `PATCH`, `PUT` or `DELETE`.

Then you have the _path_ information, which consists of static and dynamic segments. Those are identified as URL parameters and merged with the query parameters attached after the question mark character.

This is quite a bit of information, and in Hanami you may get access to all that information by writing a reverse test scenario.

### Route recognition tests
In the test file, instead of taking the route name as an argument and checking the generated path, I can instead pass the generated path to the `recognize method`, and verify if all the information from this route is properly served by our application.

Therefore, I can check the `path`, HTML method, and all the params recognized by my router correctly.

I'll aggregate the expectations to achieve nicer output and run the test to show you the error messages.

```ruby
# spec/web/routes_spec.rb

it 'recognizes "GET /subscriptions/:id"' do
  route = router.recognize('/subscriptions/1')
  aggregate_failures do
    expect(route).to be_routable
    expect(route.path).to eq('/subscriptions/1')
    expect(route.verb).to eq('GET')
    expect(route.params).to eq({ id: "1" })
  end
end
```

As you would expect, this test fails, and to fix it I'll add the missing route to the app. Let me add it to the `config/routes.rb` file then, this time with the name `:subscription`.

```ruby
# config/routes.rb

# ...
get "/subscriptions/:id",
  as: :subscription,
  to: ->(env) { [200, {}, ["Awesome Subscriber!"]] }
```

This fixes our test examples, allowing us to verify if the whole router's behavior is correct and all information from the URL is recognized properly.

### Redirection

Router in Hanami is a full-featured rack routing engine. I only covered the basics in this episode to show how to test the routing part in Hanami and any other Ruby application that uses the Hanami router.

There are many other features you may be interested in.

For example, you can check if the route redirects you to another URL.

The test for that would be pretty similar to what we've seen before, but now we can make sure that the `redirect` method returns `true` and the redirection path is as expected.

```ruby
# spec/web/routes_spec.rb

# ...
it 'redirects /home to /' do
  route = router.recognize('/home')

  aggregate_failures do
    expect(route.routable?).to be(true)
    expect(route.redirect?).to be(true)
    expect(route.endpoint).to be(nil)
    expect(route.redirection_path).to eq("/")
  end
end
```

Then I would just need to add the redirection route to my app.

```ruby
# config/routes.rb

# ...
redirect "/home", to: "/"
```

I recommend checking out the gem's documentation, where you may learn about other cool features, like

- mounting whole rack applications inside your Hanami app,
- using `scopes`, to group multiple routes together,
- leveraging `resources` helper to create multiple CRUD-like routes at once

And many more.

### Summary

*hanami-router* is a great, standalone routing engine you may include in any ruby web server. It's extremely fast, fully-features, and well tested.

I hope this episode helped you understand how to work with it and test it in Hanami applications.

Unfortunately, it's all I have for you today. I hope you've enjoyed this episode and learned sth new!

:::note Become an awesome subscriber!

If you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/HanamiMastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!
:::

### Thanks

I want to especially thank my recent sponsors,

- **[Benjamin Klotz](https://github.com/tak1n)**
- **[Saeloun](https://github.com/saeloun)**
- **[Brandon Weaver](https://github.com/baweaver)**

for supporting this project, I really apreciate it!

By helping me with [monthly github sponsorship](https://github.com/sponsors/swilgosz) to create this content this content, you are helping the open-source developers and maintainers to create amazing software for you!

And remember, if you want to support my work even without money involved, the best you can do is to like, share and comment on my episodes and discussions threads. Help me add value to the Open-Source community!

See you soon!
