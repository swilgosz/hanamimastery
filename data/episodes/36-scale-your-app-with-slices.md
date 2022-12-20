---
id: 36
aliases: ["HMEP036"]
author: "swilgosz"
topics: ['hanami', 'architecture']
title: "Scale your app with slices!"
excerpt: "In Hanami, you can reduce technical debt and keep fast development when the application grows. For that, slices is the key feature to revolutionize the way you think about web applications in Ruby."
videoId: 0FNyymwYGwM
publishedAt: "2022-12-20"
modifiedAt: "2022-12-20"
thumbnail:
  full: /images/episodes/36/cover-full.jpeg
  big: /images/episodes/36/cover-big.jpeg
  small: /images/episodes/36/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/XXX
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/XXX
    rails: https://www.reddit.com/r/rails/comments/pjuqct/XXX
    hanamirb: https://www.reddit.com/r/hanamirb/comments/XXX
source: https://github.com/hanamimastery/episodes/tree/main/036
---
With [Hanami 2.0 being released](https://hanamirb.org/blog/2022/11/22/announcing-hanami-200/), there is now a lot of cool, stable stuff we can cover in our screencasts, and one of them is something I was planned to tell about for a while already.

**Slices.**

A brand new Hanami application comes with the app folder, from which all components are automatically registered in the container.

For small applications this works very well, however, you can organize your app in different ways, which Hanami encourages by design, and **that can be very useful** in working with bigger codebases.

You can do so by extracting parts of your code into slices.

## Meet slices

[Slices](https://guides.hanamirb.org/v2.0/app/slices/) are very much independent parts of your application. They import a few general components from the main app, but other than that, they can be prepared and booted **independently** from other slices.

![Hanami slies hierarchy](/images/episodes/36/hanami-slices-hierarchy.png)]

This opens nice opportunities for deploying different parts of your app without loading any unnecessary gems and components!

![Loading code from selected slices](/images/episodes/36/loading-only-selected-slices.png)

You also can **import and export components from other slices if you want!**

But [how to organize such modules in my applications](/episodes/7-untangle-your-app-with-dry-monads)? Well, there are a few ways, from which I like two the most and this is what I’ll cover in this video.

## Organize slices by the interface type.

If I have an application, that consist of the

- Client-Facing module, mostly optimized for reading
- [API module](/articles/why-all-apis-are-inconsistent)
- and the Admin Module, where most of the app updates happen,

I can use a separate slice for each of them, and when working with API, don’t even load view-specific code or gems. The same can apply to configuring different CI paths, and running specs for different parts of my systems.

### Add API slice in Hanami 2

Adding a new slice in Hanami 2.0 is extremely easy thanks to the generators Hanami 2.0 came with. I have it the scaffold application already created, and to add an API slice, I just need to run `hanami generate slice api`

```bash
hanami g slice api
# Updated config/routes.rb
# Created slices/api/
# Created slices/api/action.rb
# Created slices/api/actions/.keep
```

It created a new slice for me by creating a few files under the `slices/api` folder. It also updated the router to properly handle requests under a specific namespace. Let’s check it out.

First of all, in the router's config file, there is a `slice` method call now, with a block added. Inside I can place all my routes that should be served by my slice. They all will be namespaced under the `/api` URL.

```ruby
# config/routes.rb

# ...
slice :api, at: "/api" do
end
```

Then in the `slices` folder, you can see an `API` directory. Inside, I can define all my API-related actions, [serialization logic](/episodes/21-serialization-with-alba) and so on.

You can see here, that the structure is almost identical to the main app folder, and therefore it’s quite intuitive to work with slices from the start.

Had you noticed the capitalized `API` module name here? The word API is automatically recognized as an acronym by the [preconfigured inflector](https://dry-rb.org/gems/dry-inflector), which I had talked about in the [Episode 4](/episodes/4-string-transformations-with-dry-inflector). Make sure you check it out if you want to know more!

With this inflector preconfigured, you can define modules with more intuitive syntax, even though the file names can remain unchanged.

I love this attention to details Hanami team shows by giving us these small touches here and there.

### Add Admin Slice

However, my application will also have the Admin Panel, where I’m going to place all the views related to administrating with my list of books. Let me create the admin slice then.

```bash
hanami g slice admin
# Updated config/routes.rb
# Created slices/admin/
# Created slices/admin/action.rb
# Created slices/admin/actions/.keep
```

The admin folder had been created, and you can see, that also some sample test examples had been added to the spec folder.

Finally, I can also provide the very narrow functionality, of presenting books to the community. I’m going to add one more slice, named `main`

However this time, I’m going to explicitly override the URL my slice is mounted upon.

```shell
hanami g slice main --url=/
# Updated config/routes.rb
# Created slices/main/
# Created slices/main/action.rb
# Created slices/main/actions/.keep
```

…and done! Great!

Disclaimer:

Let me put a disclaimer here. For such a small application, you may think that it’s overengineering, and I won’t argue too much. This episode is mostly to show you how you can organize your code in a way your applications will scale well without problems in the future.

### Adding some actions

Let me generate a few actions now, so we can present our concepts better. First I’m going to add an endpoint to my admin panel, where I’ll be able to unsubscribe people from new book reviews I’m publishing.

```shell
hanami g action books.unsubscribe --slice=admin --http=delete
```

When I browse my files, you’ll see that the action had been added to the _admin_ slice, and in the routes, an HTTP method had been set to `DELETE`.

Then, having hat, I’ll need a few endpoints to interact from the API. I’ll allow people to subscribe and unusbscribe freely, as well as listing some books.

```shell
hanami g action books.subscribe --slice=api -http=post
hanami g action books.unsubscribe --slice=api -http=delete
hanami g action books.index --slice=api
```

Finally, I’ll have a dashboard, when I only show list of reviewed books.

```ruby
hanami g action books.index --slice=main --url=/
```

Now let me open the `routes.rb` file to check how it all looks now. I can have multiple routes generated in different slices, but as I’ve setup my books list to be loaded under the root URL, I’ll remove the duplicated definition from the top of the file.

When I’ll run a server, and send a `DELETE` request to the `/api/books/unsubscribe` URL now, As a response, I’ll get the action class name. This is what each action come with, when generated automatically. Similar thing will be done for the `admin` namespace.

![Response for API slice action][/images/episodes/36/response-api-slice-action.png]

This shows us that our application recognizes this URL, and serves it properly.

To preview the code, let me open the action file.

```ruby
# frozen_string_literal: true

module API
  module Actions
    module Books
      class Subscribe < API::Action
        def handle(*, response)
          response.body = unsubscribe.class.name
        end
      end
    end
  end
end
```

You can extend this if you wish, but In this episode I want to only focus on slices feature.

### Separate the App and per-Slice containers

At this point you probably think: ok, but why? It’s just namespacing, isn’t it? Well, there is more. Let me show you now what all that does for our component registration by opening the hanami console.

```ruby
hanami console
Hanami.app.boot
```

I can list my main app registered components by accessing the `keys` method on it.

```ruby
Hanamimastery::App.keys
# => ["settings", "notifications", "routes", "inflector", "logger", "rack.monitor"]
```

For slices, we have similar access point, but we need to call the `Slice` constant on the slice name module, instead of `App`.

```ruby
Main::Slice.keys
# => ["actions.dashboard.index", "inflector", "logger", "notifications", "rack.monitor", "routes", "settings"]
Admin::Slice.keys
# => ["actions.books.unsubscribe", "actions.books.index", "inflector", "logger", "notifications", "rack.monitor", "routes", "settings"]
API::Slice.keys
# => ["actions.books.unsubscribe", "actions.books.subscribe", "actions.books.index", "inflector", "logger", "notifications", "rack.monitor", "routes", "settings"]
```

Each slice has separate set of components registered in the container, so if we’ll use separate docker containers for different modules, we can for example, load API without the whole view-related code even being loaded. This can significantly reduce the boot time, deployment, resources usage, CI build time, and so on.

However, can you spot some issues here?

## Organize slices based on Business Vs Application logic

Splitting slices by the type of interface can be useful, but even in this little example, you can already see, that a lot of logic here will be duplicated and could be shared between Admin and API. Modules.

This brings us to the other way of splitting our application, [based on the business domain](https://martinfowler.com/bliki/BoundedContext.html).

### Create business domain slice

Let’s assume, I have the part of the system, that allows us to allow people to subscribe to my book reviews. This part of my business domain would be named: `Subscribing`.

```ruby
hanami g slice subscribing
```

This slice, would not be created based on the access points from the system, but based on the business logic it contains. Inside, there would not be stored any rendering logic, nor HTTP serving. All that is either `API` or web-specific.

This `subscribing` slice, would contain list of _service objects_, or _interactors_, that would update my internal application state, send emails, trigger callbacks, and so on.

### Adding interactors to my slice

Let me add just two of them.

```ruby
# slices/subscribing/interactors/subscribe.rb

module Subscribing
  module Interactors
    class Subscribe
      def call(email)
				# create a subscription
        # send notification email
      end
    end
  end
end
```

```ruby
# slices/subscribing/interactors/unsubscribe.rb

module Subscribing
  module Interactors
    class Unsubscribe
      def call(subscriber_id)
				# find subscirption
        # remove it
        # send notification email
      end
    end
  end
end
```

I don’t want to go into the logic here, sorry, because I only want to focus on the code organization part in this episode. So how this new slice could be useful for us?

## Sharing components across slices

Well, one benefit from doing this, could be that we can import all the components into any slice we want. We can use our interactors in both `API` and `Admin` panel, while maintain the HTTP handling separately.

![Diagram: Sharing components across slices](images/episodes/36/diagram-sharing-components.png)]

To do this, I just need to add the slice-specific configuration files.

### Configure Hanami slices to import components

I’m going to allow people to subscribe themselves for book reviews and unsubscribe from them freely.

```ruby
# config/slices/api.rb

module API
  class Slice < Hanami::Slice
    import from: :subscribing
  end
end
```

However, for my Admin panel, I don’t want any of my employees to accidentially subscribe anyone against their will, so I only allow to unsubscribe people who already subscribed.

```ruby
# config/slices/admin.rb

module Admin
  class Slice < Hanami::Slice
    import keys: ['interactors.unsubscribe'], from: :subscribing, as: :subscriptions
  end
end
```

I’ll rename the subscribing slice in the Admin context to `subscriptions`, just to show this functionality.

### Use imported external components in actons

With this, I can open my actions, and access my imported interactors freely from there! Let me open the API subscribe action and add the new interactor.

```ruby
# slices/api/actions/books/unsubscribe.rb

module API
  module Actions
    module Books
      class Subscribe < API::Action
        include Deps[
          'subscribing.interactors.subscribe'
        ]

        def handle(*, response)
          response.body = subscribe.class.name
        end
      end
    end
  end
end
```

```ruby
# slices/admin/actions/books/unsubscribe.rb

module Admin
  module Actions
    module Books
      class Unsubscribe < Admin::Action
        include Deps[
          'subscriptions.interactors.unsubscribe'
        ]

        def handle(*, response)
          response.body = unsubscribe.class.name
        end
      end
    end
  end
end
```

Now sending the request to each of the URLs, will return the name of the included component to prove, it’s loaded properly.

![Response from API slice with impoted component](/images/episodes/36/api-unsubscribe-imported-component.png)
## Resolving parts of the app.

Importing components across slices is just one thing, but you can do even more with them. You can list slices, that can should be loaded in your cluster, and all the rest will be ignored.

```ruby
module Hanamimastery
	class App < Hanami::App
		config.slices = ["api", "subscribing"]
	end
end
```

This way, I can configure my list of slices using environment variables, and only parts of my application will be loaded dependeing on my configuration!

Let me show you very quickly. Now, if I’ll open my hanami console, I will not have `Main` nor `Admin` slices available anymore.

![Not loaded slices in the console](/images/episodes/36/console-slices-not-loaded.png)

This brings a whole new set of opportunities to developing scalable applications in Ruby, without the need to slow down development when the codebase grow.

## Summary

Slices in Hanami are insanely powerful, allowing us to completely control

-   how and when our application is loaded,
-   which dependencies are resolved and setup
-   reduce duplication and coupling.

There are multiple ways you can organize your slices, but I hope the two ideas I’ve shown you above will give you some portion of inspiration.

:::note Become an awesome subscriber!
If you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/HanamiMastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!
:::

## Thanks

I want to especially thank my recent sponsors,

-   [prowly.com](http://prowly.com)
-   [Akilas Yemane](https://twitter.com/akilasy)
-   [Bill Tihen](https://github.com/btihen)

for supporting this project, I really appreciate it!

- [Nikolai Chernichenko](https://unsplash.com/@perfectcoding) - for the great cover image

:::important Consider sponsoring?
If you want to support us, check out our [Github sponsors page](https://github.com/sponsors/swilgosz) or join [Hanami Mastery PRO](https://pro.hanamimastery.com/) to gain the access to more learning resources and our private discord server!
:::
