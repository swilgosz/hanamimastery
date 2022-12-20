---
id: 32
aliases: ["HMEP032"]
author: "swilgosz"
topics: ["hanami", "rom-rb", "pagination", "persistence"]
title: "Pagination in Hanami apps with ROM"
excerpt: "There are plenty of popular ways to handle pagination in Ruby apps. But did you know, that ROM supports Pagination out of the box? And so Hanami does? In this episode, I'll show you how to quickly implement pagination from scratch for your Hanami projects."
videoId: 5p9dEv7ENbA
publishedAt: "2022-10-17"
modifiedAt: "2022-12-21"
thumbnail:
  full: /images/episodes/32/cover-full.jpeg
  big: /images/episodes/32/cover-big.jpeg
  small: /images/episodes/32/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1582352255247753217
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/y766gk/pagination_in_hanami_apps_with_rom_hanami_mastery/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/y766u2/pagination_in_hanami_apps_with_rom_hanami_mastery/
source: https://github.com/hanamimastery/episodes/tree/main/032
---
Hi there!

There are [plenty of ways to handle pagination](https://www.ruby-toolbox.com/search?display=compact&order=rubygem_downloads&q=pagination&show_forks=false) in Ruby apps and some of them are very popular. There is a chance you've heard about the `pagy` gem, `kaminari`, `jsom-pagination` or other gems allowing you to easily work with paginated resources in web applications.

All that is great, but I'm not sure if you know, that [ROM supports Pagination out of the box](https://rom-rb.org/learn/). **And so Hanami does.**

In this episode, I'll show you how to quickly implement pagination from scratch for your Hanami projects.

Let's begin.

## Starting point.

I have this little application here allowing me to list articles in my browser.

```ruby
# /app/actions/articles/index.rb
module Sandbox
  module Actions
    module Articles
      class Index < Get
        include Deps[repo: 'repositories.articles']

        def handle(req, res)
          collection = repo.articles_with_authors
          res.body = serialize(collection.to_a)
        end
      end
    end
  end
end
```

It just fetches the articles from the repositories and applies the serialization to the resulting collection.

The serialization logic is extracted into the `GET` action class which my article's index inherits from.

```ruby
# frozen_string_literal: true
require 'byebug'

module Sandbox
  module Actions
    # Action aggregating common logic for serving
    #  GET HTTP requests
    #
    class Get < Action
      after :success

      private

      def serialize(model)
        # ...serialization logic
      end

      def success(req, res)
        res.status = 200
      end
    end
  end
end

```

I use the `after` callback to set my HTTP response status to`:ok` after the action successfully processes the request.

:::note
If you want to know more about setting this persistence layer up, check out my [episodes related to ROM](/t/rom-rb), I’ve already covered several of them. Or, check out the [Hanami Mastery PRO](https://pro.hanamimastery.com), where I’m trying to share more advanced tutorials in a regular manner.
:::

All seems to be fine, however, in the case of hundreds of articles in my database, I definitely would not like to fetch all of them and render a return to the response at once.

Instead, I'd like to paginate the result, to always fetch a little subset of data, allowing my client to control how many items they want to process.

## Setting up ROM pagination plugin in Hanami

ROM has built-in support for the pagination via the plugin system, and we'll going to leverage this to speed things up.

In the persistence provider, I'm going to enable the `pagination` plugin for `sql` component, for `relations`.

```ruby
# config/providers/persistence.rb

config.plugin(:sql, relations: :pagination)
```

Now, when I fetch any relation from the database, I can suddenly access the `page` and `per_page` methods, allowing me to control how many records are fetched from the db.

```ruby
repo = container['repositories.articles']
repo.articles.count
# => 2
repo.articles.per_page(1).page(2).to_a
# => []
```

With this, I can quickly create my pagination feature.

## Implement Pagination module for action.

I'm going to create a utility folder with a `paginable` module in it, that I'll include in my action later.

it will have a single method named `paginate`, that accepts the relation and the _params_ hash. Inside I'm going to paginate the relation exactly as I've just shown you in the terminal.

```ruby
# frozen_string_literal: true

module Sandbox
  module Utils
    module Paginable
      def paginate(relation, params)
        relation.
          per_page(params[:per_page]).
          page(params[:page])
      end
    end
  end
end
```

:::caution Working with relations
For the sake of this example, my repository return relation object, that I can call pagination methods on. However, it's not the encouraged practice.

[Repositories should return already finalized collection](/episodes/29-leverage-rom-repositories) - an array and should be used for simple queries. For any more advanced usage, like complicated queries, dynamic filters, or pagination, I encourage using Query Objects.
:::

Now, in the articles index action, I just need to include the newly created module, and add the pagination step to the `handle` method.

```ruby
# app/actions/articles/index.rb

include Utils::Paginable

def handle(req, res)
  collection = repo.articles_with_authors
  paginated = paginate(collection, req.params)
  res.body = serialize(paginated)
end

```

With this, I can already paginate my resources by visiting the browser.

With this, I can already paginate my resources by visiting the `localhost:2300/articles?page=2&per_page=1`

![Paginated resources response](/images/episodes/32/paginated-response.png)

## Validating pagination parameters.

This basic setup is working, however, it's not error-prone.

I don't setup the default values for my pagination parameters, which will break my fetching method. Also, I do not validate the input parameters, so I don't secure my app from unpredictable input, like extremely large, or negative numbers.

This is why I recommend validating your GET requests, similar to what you do for creating or updating resources.

Here I'm going to set the default constants and define the validation schema. I'm going to set the `page` parameter to optional, but in case it's passed in, it needs to be filled in.

The expected type would be the Integer, defaulting to 1. I'll also make sure, that the page is always greater than 1. I guess it should be a constant too, but... whatever :).

Then I'm going to repeat that for `per_page` parameter, with the difference, that this will need to be also smaller than 50

```ruby
# lib/sandbox/utils/paginable.rb

module Sandbox
  module Utils
    module Paginable
      DEFAULT_PAGE = 1
      DEFAULT_SIZE = 10

      PaginationSchema = Dry::Schema.Params do
        optional(:page).filled(Types::Coercible::Integer.default(DEFAULT_PAGE), gteq?: 1)
        optional(:per_page).filled(Types::Coercible::Integer.default(DEFAULT_SIZE), gteq?: 1, lteq?: 50)
      end
      # ...
    end
  end
end

```

Now let me use it. I'll extract the validation to a seaparate method and call it using the params hash as an input.

If the validation succeeds, I’ll just return from the method, but otherwise, I’m going to halt the processing and immediately return the error information to the browser, setting up the HTTP code to 400.

```ruby
def paginate(relation, params)
  validate_pagination(params.to_h)
  relation.
    per_page(result[:per_page]).
    page(result[:page])
end

def validate_pagination(params)
  result = PaginationSchema.call(params)
  return if result.success?

  halt 400, result.errors.to_h.to_json
end
```

Now when I call my browser with invalid pagination parameters, I'll end up with the more meaningful error message.

![Paginated resources response](/images/episodes/32/validate-pagination.png)

Awesome!

## Summary

Pagination is a simple feature, but even such a little thing has its caveats.  I hope that with this short episode I've shown you why it's useful to validate all input incoming to your system and how to paginate resources using Hanami and ROM in your web applications.

## Thanks

I want to especially thank my recent sponsors,

-   [Akilas Yemane](https://twitter.com/akilasy)
-   [Bill Tihen](https://github.com/btihen)
-   [Benjamin Klotz](https://github.com/tak1n)

for supporting this project, I really appreciate it!
