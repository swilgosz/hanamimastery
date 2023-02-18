---
id: 2
author: "swilgosz"
topics: ["hanami", "hanami-view"]
title: "Listing articles in Hanami and Dry-View"
excerpt: "In this episode I explain the Hanami architecture related to views rendering, by using Hanami View, Hanami Actions and templates, to list articles for a blog applicaton."
published: true
publishedAt: "2021-05-15"
modifiedAt: "2021-10-03"
aliases: ['HMEP002']
videoId: "79_1lHX_uEA"
thumbnail:
  full: /images/episodes/2/cover-full.jpeg
  big: /images/episodes/2/cover-big.jpeg
  small: /images/episodes/2/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1393999827546038279
  reddit: []
source: https://github.com/hanamimastery/episodes/tree/main/002
---

In the previous episode, I've created a new Hanami application, using the [Template repository](/episodes/1-creating-hanami-application).

At the moment, It only has the home page implemented, but I'd love to transfer it into a blog application. In this episode, I'll show you how to list the objects in the Hanami template. We will focus on understanding the [Hanami::View](https://github.com/hanami/view) part of the architecture.

To start, let's start by adding a new route, under the `/articles` URL.

### Adding static HTML rendering endpoint

First, let's visit the `routes.rb` file stored in the `config` directory. The router distributes the incoming requests and decides which action should handle that.

So let's add a route to handle get requests to `/articles` URL and write the handler to it. The handler in Hanami can be literally anything that responds to a `call` method, accepting the rack env as an argument, and returning the serialized rack response, so for a very minimal example, we can even use a raw `proc`.

```ruby
# /config/routes.rb

Hanami.application.routes do
  slice :main, at: "/" do
    root to: "home.show"

    get '/articles', to: ->(env) { [200, {}, ['<h1>Articles</articles>']] }
  end
end
```

This will render the level one header HTML tag with the _Articles_ string in the browser.

![Static Page rendering](/images/episodes/2/static-browser.png)

### Rendering

This is super simple and elastic in use because as those are the only requirements, we can replace this `proc` with any object that meets the router's expectations!

If we'd have to render more complicated templates, however, it'd be nice to have a class that takes care of preparing the `HTML` to keep our routes clean and simple.

This is when Hanami/Action comes in. I can replace the `proc` written directly in the routes with a path pointing into the action I want to call instead.

```ruby
# /config/routes.rb

Hanami.application.routes do
  slice :main, at: "/" do
    root to: "home.show"

    # get '/articles', to: ->(env) { [200, {}, ['<h1>Articles</articles>']] }
    get '/articles', to: "blog.articles"
  end
end
```

By default, Hanami assumes that actions for a given slice are placed in the `actions` folder inside this slice, and the rest of the path matches what we've written in the route.

Let me then create a new action named articles, in the blog folder.

Remember: It can be any ruby object, that responds to a `call`, accepting rack `env` as an argument and returning the rack response.

So let's define the call method, and return the standard rack response, but with a different string in the `h1` tag, just to be sure it works.

```ruby
# /slices/main/lib/main/actions/blog/articles.rb

module Main
  module Actions
    module Blog
      class Articles
        def call(env)
          [200, {}, ['<h1>Articles rendered by class</h1>']]
        end
      end
    end
  end
end
```

Now when I'll visit the browser, You should see the updated text. Awesome!

> **Note**: If you're trying it out before the Hanami 2.0 is officially released, you may need to restart the server!

![Static Page rendering](/images/episodes/2/static-browser-from-action.png)

### Using views and templates

While this works fine, usually we'd like to write our templates in the `html` or `slim` files or serialize our `JSON` responses using serializers instead of using raw strings everywhere.

This is why in Hanami, except [actions](https://github.com/hanami/controller#actions), we have also [views](https://github.com/hanami/view) and templates.

![Static Page rendering](/images/episodes/2/request-flow.png)

The whole request flow starts from the router, then it's distributed into proper action.

- **Action** parses the request to extract the `params` and `headers`. The action then calls the proper view object with prepared arguments.
- **The view**, based on the given arguments, prepares data for `template` to render, and then renders the proper `template` with certain local variables exposed.
- **The template**, however, only specifies, how the structure of the rendered document looks like. Then it's rendered by a `view`.

Having this in mind, let's leverage this architecture, starting by using the `Hanami::Action`.

When I'll remove the custom call method and inherit from the `Main::Action`, it'll look for a specific `view` and try to call it with the prepared parameters.

```ruby

# /slices/main/lib/main/actions/blog/articles.rb

module Main
  module Actions
    module Blog
      class Articles < Main::Action
      end
    end
  end
end
```

Please notice that we inherit here for action specific for the given `slice` - as there may be a situation, where each `slice` will have a different authorization strategy or other request transformations.

Now let's create a template for the article listing of our blog. I create the `articles.html.slim`  template file in the templates directory and inside let's list some articles' titles.

```ruby
# /slices/main/web/templates/blog/articles.html.slim

h1 Blog articles

ul
  - articles.each do |article|
    li = article.title
```

Then I need a view that will render this template, which will be stored under the same path in the _views_ directory of the `main` slice.

```ruby
# /slices/main/lib/main/views/blog/articles.rb

Article = Struct.new(:title)

module Main
  module Views
    module Blog
      class Articles < View::Base
        expose :articles do
          %w[article1 article2 article3].map do |title|
            Article.new(title)
          end
        end
      end
    end
  end
end
```

Within the view lays the logic of preparing the data for a template. My template need `articles` collection that it can iterate by, so let's quickly expose `articles` method, and generate a simple array of structs to be returned.

I need the `article` definition yet, and we're ready to go! A quick look at the browser, and Voila! Here are our articles listed!

![Static Page rendering](/images/episodes/2/articles.png)

This is still just a rendering - to style it up you'll need to make use of Hanami::Assets which [I cover in the next episode](/episodes/3-style-your-app-with-bulma)

### Summary

In this episode, we've gone through the basic rendering flow in Hanami applications and understood the view-related part of Hanami Architecture.

It may be a lot compared to the simplified, [MVC](https://www.tutorialspoint.com/mvc_framework/mvc_framework_introduction.htm) approach, where there are only three parts of the system - **Model, View, and Controller**, but history proved that `MVC` just does not scale well.

The extended Hanami architecture, where each class has its dedicated purpose definitely allows to reduce coupling in bigger systems and helps to better manage complexity.

### Special Thanks

- [Paul Skorupskas](https://unsplash.com/@pawelskor) for a great cover photo
- [Tim Riley](https://timriley.info/) - for the great help in understanding Hanami's views architecture.
