---
id: 26
aliases: ["HMEP026"]
author: "swilgosz"
topics: ["sitemap", "seo"]
title: "Generate Sitemaps for Hanami applications!"
excerpt: "Sitemap is one of the core features for any web application, to make sure your site is indexed properly. Here is how to generate sitemaps in Hanami applications using sitemap_generator gem!"
videoId: 5F_Ty2-ha-Y
published: true
publishedAt: "2022-08-08"
modifiedAt: "2022-08-08"
thumbnail:
  full: /images/episodes/26/cover-full.jpeg
  big: /images/episodes/26/cover-big.jpeg
  small: /images/episodes/26/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1556748822298099714
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/wjk8jp/generate_sitemaps_for_hanami_applications/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/wjk9fc/generate_sitemaps_for_hanami_applications/
source: https://github.com/hanamimastery/episodes/tree/main/026
---

I have a sample Hanami application here which allows me to show the content of messages in the browser, by switching the dynamic segment in the URL - an ID of the message. I can also list them together under the `/messages` path if I remove the ID completely.

![Listing messages](/images/episodes/26/app-presentation.png)

I would love to automatically generate a sitemap for my project, **to list all supported URLs, so my website can easily rank in search engines**.

There are a few caveats to consider though. **I have dynamic routes for each message and I also have static routes for some pages and the root URL**.

```ruby
# config/routes.rb

require 'hanami/routes'

module Sandbox
  class Routes < Hanami::Routes
    define do
      root { 'Hello from Hanami' }

      get 'pages', to: 'pages.index'
      get 'pages/:id', to: 'pages.show'

      get 'sitemap', to: 'sitemaps.show'
    end
  end
end

```

However, in neither of those cases do I want to update the code manually whenever I add a new message or static route!

In this episode I'll let address those requirements, showing you how to write a neat sitemap generation for Hanami apps.

Let's do some coding then!

### Sitemap generation

I will use the [sitemap_generator](https://github.com/kjvarga/sitemap_generator) gem to do the actual sitemap file generation.

It's a widely used gem to create and update sitemaps in your projects, and while it's partially done to work with Rails-specific projects you can use them in your Hanami applications too!

Let me add the gem to the Gemfile and run the bundle to install it on my system.

Then I'll register a new provider named `sitemap` to run the necessary configuration code and register new dependencies in my container. I'll use the namespace option, to make sure all dependencies relevant for the sitemap generation will be grouped under the top-level `sitemap` keyword.

Then In the `prepare` keyword, I'll require my newly installed gem, and apply some configuration options. For now I only need to set default host, that I'll be read from the application settings.

As the setting is not defined yet, I'll open the config settings.rb file to add it to the app settings list. I expect this to always be present, and to be type of string - this means, we cannot boot our application this environment being defined.

```ruby
# config/settings

setting :default_host, constructor: Types::String
```

At the end, I'll register the generator in the container.

```ruby
# config/providers/sitemap.rb

Hanami.app.register_provider :sitemap, namespace: true do |container|
  prepare do
    require 'sitemap_generator'

    SitemapGenerator::Sitemap.default_host =
      container['settings'].default_host

    register 'generator', SitemapGenerator::Sitemap
  end
end

```

Now let me quickly add the `DEFAULT_HOST` environment variable, and we're ready to write the actual generation task.

### Writing the sitemap generator

Now Let me create the interactor, named *generate sitemap*.

:::tip
I like to compose my apps using the **interactor pattern**.

In the [episode 7](/episodes/7-untangle-your-app-with-dry-monads) - I talked a bit more about interactors, service objects or operations. You may find it interesting as **you can find there a bit more fancy implementation of the service object** than I do here.
:::

For now it only needs my sitemap generator to be injected as a dependency, a call method without any arguments.

:::important
If you're new to *dependency injection*, or container registration in Hanami, Check out my [related episodes](/t/dependency-injection), as this knowledge will be very useful for you in the future content I publish.
:::

Within the call will create an empty sitemap and add the `messages` URL to it.

```ruby

require 'hanami/router/formatter/csv'
require 'hanami/router/inspector'

module Sandbox
  module Interactors
    class GenerateSitemap
      include Deps[
        'sitemap.generator'
      ]

      def call
        generator.create do
          add '/messages', changefreq: 'daily', priority: 0.9
        end

        generator.ping_search_engines
      end
    end
  end
end

```

Now I can check if it saves the file in my public directory.

In the ruby console I can access the interactor class if I want, but because I defined it within the app folder, I have accessible in the container, already initialized and with all dependencies resolved.

This is a small boost to the development workflow so let me use this approach.

Now I call it, and as a result I have the sitemap file availble in the public directory right away! Awesome.

#### Sitemap preview

Let me now add a simple action to browse this file in the browser.

In my routes I will add the get route pointing to my sitemap.show action.

```ruby
get 'sitemap', to: 'sitemaps.show'
```

Then I create the action file. Inside my `handle` method I'll update the response body, to a content of my newly generated sitemap file.

```ruby
def handle(req, res)
  res.body = File.read('public/sitemap.xml.gz')
end
```

The content is compressed though, so when I'll visit my browser, I won't be able to preview my URLs!

![Zipped file response content](/images/episodes/26/zipped-file-content.png)

To fix it, I need to set up the response headers so the browser will know how to interpret the data.

First will be the content encoding for the information about zipped file, and the other pointing to the fact that encoded file is actually xml under the hood.

```ruby
# frozen_string_literal: true

module Sandbox
  module Actions
    module Sitemaps
      class Show < Action
        before :set_format

        def handle(req, res)
          res.body = File.read('public/sitemap.xml.gz')
        end

        private

        def set_format(req, res)
          res.headers.merge!(
            'Content-Encoding' => 'gzip',
            'Content-Type' => 'application/xml'
          )
        end
      end
    end
  end
end

```

Now the browser is presenting my sitemap without further issues and from now on I can share my sitemap URL with search crawlers, RSS feeds or any other platform that can make use of it.

### List static routes

However, even though my sitemap is working, it's empty. I want to put inside all my static and dynamic URLs supported by the application, but I don't want to maintain them manually.

Therefore I need to use the route inspector to list all my static paths.

I will show you how it works in the hanami console.

I need a route inspector object, and then call my sandbox application router passing this inspector to it.

```ruby

inspector = Hanami::Router::Inspector.new(formatter: formatter)
Sandbox::App.router(inspector: inspector)
```

Now when I call my inspector, as an output I get all my routes.

```ruby
puts inspector.call
# => GET     /                    (block)           as :root
# => GET     /pages               pages.index
# => GET     /pages/:id           pages.show
# => GET     /sitemap             sitemaps.show
```

By default, a human-readable output is present, but I can change the formatter to use the CSV format instead.

```ruby
formatter = Hanami::Router::Formatter::HumanFriendly.new

require 'hanami/router/formatter/csv'
formatter = Hanami::Router::Formatter::CSV.new
inspector = Hanami::Router::Inspector.new(formatter: formatter)
Sandbox::App.router(inspector: inspector)
puts inspector.call
# => METHOD,PATH,TO,AS,CONSTRAINTS
# => GET,/,(block),:root,""
# => GET,/pages,pages.index,"",""
# => GET,/pages/:id,pages.show,"",""
# => GET,/sitemap,sitemaps.show,"",""

```

With this, I can have an access to all my routes in the system.

Let me switch to the interactor and add this inside. I'm going to just paste the code from the console and move the requires to the top of the file.

```ruby
require 'hanami/router/formatter/csv'
require 'hanami/router/inspector'

module Sandbox
  module Interactors
    class GenerateSitemap
      include Deps[
        'sitemap.generator'
      ]

      def call
        formatter = Hanami::Router::Formatter::CSV.new
        route_inspector =
          Hanami::Router::Inspector.new(formatter: formatter)

        Sandbox::App.router(inspector: inspector)

        route_inspector.call

        generator.create do

        end

        generator.ping_search_engines
      end
    end
  end
end

```

The only change is that I want the output of the inspector, to be assigned to a csv object, so I can easily iterate through rows.

To do so I'll use the standard CSV library to create a new object from the output. First row is header, with columns info, so I need to add the `headers: true` option, so the CSV knows to skip it.

```ruby
# ...
        csv = CSV.new(route_inspector.call, headers: true)

        generator.create do
          # Add static paths
          #
          csv.read.each do |row|
            next if row[0] != "GET" || row[1].include?(':')

            add row[1], changefreq: 'daily', priority: 0.9
          end
        end

# ...
```

Then within the `create` block, I'll iterate through my rows, and add the path to my sitemap.

Finally, this way I only want to include my static routes, and skip the dynamic ones. For that I'll go to the next loop iteration in case the route method is other than `GET`, or the path contains the colon.

Now If I'll run my interactor in the console, and then visit my browser, you'll see that my routes had been added to the sitemap automatically.

![Static routes sitemap](/images/episodes/26/static-routes-sitemap.png)

From now on, whenver I'll add a static route, It'll be automatically added here. In case of adding private routes to the application, I can just add the filter in the sitemap, to skip unwanted URL collections, but still it'll be a lot less maintanance than managing each of that manually.


### Extracting dependencies.

You may see here, that formatter and route_inspector, are the dependencies though, and we only need the formatter inspector in the class.

That's not perfect, because the more dependencies hardcoded in the class, the harder it is to test it properly.

Let me refactor this, to simplify the logic and to make the code more testable.

I want to extract my formatter, route inspector, and the `router` method call to a provider.

Now let me just copy the missing required files, and at the end I can register my inspector in my container under the sitemap wrapper.

```ruby
Hanami.app.register_provider :sitemap, namespace: true do |container|
  prepare do
    require 'sitemap_generator'
    require 'hanami/router/formatter/csv'
    require 'hanami/router/inspector'

    SitemapGenerator::Sitemap.default_host = container['settings'].default_host
    formatter = Hanami::Router::Formatter::CSV.new
    inspector = Hanami::Router::Inspector.new(formatter: formatter)
    Sandbox::App.router(inspector: inspector)

    register 'route_inspector', inspector
    register 'generator', SitemapGenerator::Sitemap
  end
end

```

This code will simplify my interactor by a whole lot!

```ruby
module Sandbox
  module Interactors
    class GenerateSitemap
      include Deps[
        'sitemap.route_inspector',
        'sitemap.generator'
      ]

      def call
        csv = CSV.new(route_inspector.call, headers: true)
        pages = pages_repo.all
        generator.create do
          # Add static paths
          #
          csv.read.each do |row|
            next if row[0] != "GET" || row[1].include?(':')

            add row[1], changefreq: 'daily', priority: 0.9
          end
        end

        generator.ping_search_engines
      end
    end
  end
end

```

I removed quite a piece of code from here, and the only thing I should add is the dependency that I inject from the container!

Still, the sitemap generation works perfectly.

#### Dynamic routes.

Our sitemap generator is complete - at least if we talk about static routes.
Now, though, is a time to add all my article pages to it.

First of all, I'll add the pages repository to the available dependency list.

```ruby
include Deps[
  'sitemap.route_inspector',
  'sitemap.generator',
  messages_repo: 'repositories.messages'
]
```

With this, I can now iterate through messages, and for each of them add the sitemap row similarly to what we did before.

```ruby
# Add all single page paths
#
messages.each do |page|
  add "/messages/#{page.id}", changefreq: 'daily', priority: 0.9
end
```

Let me regenerate this sitemap now and make sure everything works as expected.

Voila!

![Dynamic routes sitemap](/images/episodes/26/dynamic-routes-sitemap.png)

As you can see, all my routes are added. As you may notice, there is a duplicate of the root URL here, that I could get rid of, but I'll leave this for you as a little coding challenge!

Write in the comments if you succeeded with this.

## Summary

This is all I have for you today. We successfully generated a dynamic sitemap for our Hanami application that we can trigger whenever we want. Regenerating the sitemap can take a while though, so In the next episode, I'll show you how to leverage background jobs, to make it more production-ready.

**:::note Become an awesome subscriber!

If you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/HanamiMastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!
:::**

## Thanks

:::important [Recent sponsors](https://github.com/sponsors/swilgosz)
- [Benjamin Klotz](https://github.com/tak1n)
- [Saeloun](https://github.com/saeloun)
- [Brandon Weaver](https://github.com/baweaver)
:::

:::important Other thanks
- [Nick Seagrave](https://unsplash.com/@seagrave) - for the great Cover Image!
:::

If you have found this content useful, I'll appreciate it if you consider supporting this initiative.

See you soon!
