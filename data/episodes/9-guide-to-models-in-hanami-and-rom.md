---
id: 9
author: "swilgosz"
tags: ['hanami', 'rom-rb', 'persistence', 'sequel', 'faker']
title: "#9 Integrate Hanami 2.0 with your Database using ROM"
excerpt: "Every application needs persistence. Saving records in a database is just a must. Here is how you can do it in Hanami applications!"
videoId: "GAmHmj0XK5U"
publishedAt: "2021-10-02"
thumbnail:
  full: /images/episodes/9/cover-full.jpeg
  big: /images/episodes/9/cover-big.jpeg
  small: /images/episodes/9/cover-small.jpeg
source: https://github.com/hanamimastery/episodes/tree/main/009
---


In the [Hanami Mastery #002](/episodes/2-listing-articles-with-hanami-view) I've shown you how to list articles in Hanami 2.0 application and in the third episode, [how to prettify them using bulma CSS framework](/episodes/3-style-your-app-with-bulma). However, there is an issue with this.

## Importance of persistence

I have this application running at the moment, so we can easily see the problem I'm talking about. Basically, whenever you refresh the page, the article details are changed.

![Blog listing](/images/episodes/9/blog-listing.png)

It happens, because **I've cheated a bit in the previous episodes**, first to keep the videos short and focused on the rendering part of the framework - but secondly because it was beforHe the release of Hanami 2.0 alpha versions so it was unclear how ROM updates will affect the implementation.

Now, with [ROM 6.0 ready](https://rom-rb.org) and amazing Hanami 2.0 integrations in place, it's finally a time to finish it off, and showcase you **the complete integration of ROM with the SQL database within a Hanami 2.0 application**.

#### Marc Busqué & Todos app

I was able to pull this episode together, thanks to the awesome work of Hanami Core Team Member, [Marc Busqué](https://github.com/waiting-for-dev). He created a complete todos application, with ROM integration and all CRUD actions in place, showcasing how to replace the Hanami Actions with [WebPipe](https://github.com/waiting-for-dev/web_pipe). This is an amazing example of elastic nature of Hanami components, which can be easily repleceable by whatever you wish.

He [opensourced it on Github](https://github.com/waiting-for-dev/hanami-2-application-template/tree/waiting-for-dev/todo_app) so I strongly encourage you to check it out. As always you can easily access it using resources links in this episode.

#### Faker & Vitor Oliviera

When I was focused just to show the rendering part of the Hanami application, I came with a quick solution to define a dummy entity in the main slice, with the default parameters in place. Those entities can be easily created in any place of the application and I bravely created them inside of view objects.

To quickly generate random entity to be displayed in the page, I used a [faker gem](https://github.com/faker-ruby/faker).

If you don't know faker, it allows to fill your objects with random data taken from different sets without an effort. I heavily use it for seeding data in my projects, and I appreciate the effort of the main author, [Vitor Oliviera](https://github.com/vbrazo).

This guy has** 5 times more contributions in the last year than me**, which I see as pretty impressive. Feel free to check out his other projects he manages a few popular repositories.

However, let's go back to the topic.

### Current buggy implementation

```ruby
# slices/main/lib/main/entities/article.rb

require 'faker'

module Main
  module Entities
    class Article
      attr_accessor(
        :title,
        :excerpt,
        :author,
        :content,
        :thumbnail,
        :id,
        :published_on
       )

      def initialize(args = {})
        self.id = args[:id] || 1
        self.title = Faker::Hacker.say_something_smart
        self.excerpt = Faker::Lorem.paragraph(
          random_sentences_to_add: 4
        )
        self.content = Faker::Lorem.sentences(number: 50).join(' ')
        self.thumbnail = "https://loremflickr.com/800/460/cat?lock=#{id}"
        self.author = Author.new
        self.published_on = "1 Jan 2016"
      end
    end
  end
end
```

For each created article we also create a random author, and assign it to the author reader. When I Open the author entity, you'll see a very similar data structure, where everything is just randomly filled in using faker helpers.

```ruby
# slices/main/lib/main/entities/article.rb

require 'faker'

module Main
  module Entities
    class Author
      attr_accessor :first_name, :last_name

      def initialize(args = {})
        self.first_name = Faker::Name.first_name
        self.last_name = Faker::Name.last_name
      end
    end
  end
end

```

Initially I just grabbed those entities in the view, and created a collection of randomly filled objects, and then exposed the result to the template.

```ruby
# slices/main/lib/main/views/blog/articles/index.rb

module Main
  module Views
    module Blog
      module Articles
        class Index < View::Base
          expose :articles do
            (1..20).map do |i|
              ::Main::Entities::Article.new(id: i)
            end
          end
        end
      end
    end
  end
end
```

![Seriously?](/images/episodes/9/seriously.gif)

Yes, seriously.

But now let's implement it using actual records fetched from the database, as one should expect.

## The correct approach - ROM.rb in action.

Hanami has built-in integration with [ROM](https://rom-rb.org). This is the default ORM of choice, and even if it can be replaced by anything, I don't see a reason to do so. It's powerful, fast and easy to use.

### Create migrations

First we need to create the necessary database tables, for articles and authors and for that I'll use the hanami migration generator.

```shell
hanami db create_migration create_authors
hanami db create_migration create_articles
```

This will create an empty migration file but with the correct timestamp automatically added to the file name.

```ruby
ROM::SQL.migration do
  change do
  end
end

```

Now let's fill this migration in, and create an `:authors` table with the id as a primary key, first name and the last name to be listed in articles later on.

```ruby
# db/migrate/xxxx_create_authors.rb

ROM::SQL.migration do
  change do
    create_table(:authors) do
      primary_key :id
      column :first_name, String
      column :last_name, String
    end
  end
end
```

Now for articles database, I'll need a bit more fields, basically the same as I had in the dummy entity before.

Therefore I need a tittle, excerpt, content and the thumbnail URL, all type of string. Then I need the author reference, and the publication date information.

```ruby
# db/migrate/xxxx_create_articles.rb

ROM::SQL.migration do
  change do
    create_table(:articles) do
      primary_key :id
      column :title, String
      column :excerpt, String
      column :content, String
      column :thumbnail, String
      foreign_key :author_id, :authors
      column :published_on, Date
    end
  end
end

```

Now I can RUN the migrations... and my tables are created.

```shell
hanami db migrate
```

> NOTE: If you want to know more about migration DSL in Hanami, ROM migrations are based on [Sequel](https://github.com/jeremyevans/sequel), created by Jeremy Evans, one of Ruby Legends I would say. You can check the [detailed Sequel migrations documentation here](https://github.com/jeremyevans/sequel/blob/master/doc/migration.rdoc) if you're interested more about this topic.

### Relations

Now having that database tables in place, I'll create the [Relations](https://rom-rb.org/learn/core/5.2/relations/) and [Repositories](https://rom-rb.org/learn/repository/5.2/quick-start/) for both resources.

Hanami allows you to have separate sets of persistence-related resources for each application slice, but because my application is so small, I'll create them in the global namespace.

#### Articles relation

First I will create the article relation, which inherits from ROM sql relation, and define the schema based on `:articles` table, setting a flag: `infer` to true. This will automatically set my attribute readers on the entity, based on the table definition!

```ruby
# lib/sandbox/persistance/relations/articles.rb

module Persistence
  module Relations
    class Articles < ROM::Relation[:sql]
      schema(:articles, infer: true) do
        associations do
          belongs_to :authors, as: :author
        end
      end
    end
  end
end
```

> NOTE: Keep in mind, that `sandbox` is my application name.


Then within the schema I'll define the belongs_to association for article's author.

#### Authors relation

Let's repeat the same thing for authors, with the difference, that author has many articles.

```ruby
# lib/sandbox/persistance/relations/authors.rb

module Persistence
  module Relations
    class Authors < ROM::Relation[:sql]
      schema(:authors, infer: true) do
        associations do
          has_many :articles
        end
      end
    end
  end
end
```

> WARNING: Please notice, that there is no `module Sandbox` in either of the relation files. It's because there is a known namespacing bug in the pre-2.0.0-alpha2 Hanami releases that should be fixed very soon.

Because we do entity definition based on the tables definitions, there is no need to manually define entities at the moment and those can be removed comletely!

### Repositories

Now, let's add an article repository.

In `ROM` relations are responsible for communicating with database, to fetch the data. There you define queries specific for the DB you use, or if you wish - scopes definitions.

Repositories are database-agnostic, and can use multuple relations to update and fetch resources from many databases, if needed. This is why it's extremely easy to replace database adapters in Hanami, while keeping the same interface and minimizing the required changes to be done across application.

#### Articles repository

Let me define the article repository now, so we can fetch and create resources in the database.

By adding the `commands :create`, we extend the default repository by the ability to create resources, which we can use to seed the data to our system.

```ruby
# lib/sandbox/persistance/repositories/articles.rb

module Sandbox
  module Persistence
    module Repositories
      class Articles < Repository[:articles]
        commands :create

        def all
          articles.combine(:author).to_a
        end
      end
    end
  end
end
```

then I just need to define the `all method`, and inside I combine articles with their authors, returning the array of results at the end.

#### Authors repository

Now I'll also add the authors repository. I don't need it for listing my articles, but It will be useful for seeding data into our database.

```ruby
# lib/sandbox/persistance/repositories/articles.rb

module Sandbox
  module Persistence
    module Repositories
      class Authors < Repository[:authors]
        commands :create

        def all
          authors.to_a
        end
      end
    end
  end
end
```

We have almost everything done now. Now let's tweak our actions and views.

### Rendering the model

Previously I've instantiated the article collection inside of the view directly, but that's not the correct way to go. View object should only contain view-related logic, but all data should be passed into it from actions.

Therefore, let's remove the block from the expose method, and open the corresponding action.

```ruby
# slices/main/lib/main/views/blog/articles/index.rb

module Main
  module Views
    module Blog
      module Articles
        class Index < View::Base
          expose :articles
        end
      end
    end
  end
end
```

Here I will inject the articles repository as a dependency, and add a name `repo` to the newly created reader.

> Notice: Have you spotted, that the root key is prefixed with an application string? We can have several containers defined in the system, and the persistence dependencies are managed by the application container, and this is where this prefix come from.

```ruby
# slices/main/lib/main/actions/blog/articles/index.rb

module Main
  module Actions
    module Blog
      module Articles
        class Index < Main::Action
          include Deps[
            repo: 'application.persistence.repositories.articles'
          ]

          def handle(req, res)
            res.render view, articles: repo.all
          end
        end
      end
    end
  end
end
```

Now I need to handle the incoming request, by rendering the corresponding view with the articles variable passed in. As a value, I'll call my repository, fetching all articles into it.

Because we have the `articles` variable exposed, there is nothing we need to do in templates.

### Seeding data

This is all that's required to make our articles listing working!

However, visiting the articles page in the browser now will show you an empty list of articles, becasue there are none saved in our database yet.

In the terminal I can open `hanami console` to manually create records, but we already know `faker` and we know that we can do better. I'll use `db/seeds.rb` file to create all necessary resources in the automatic way.

To do so, I'll open the seeds file, and add the necessary insertion rules.

First I require the faker, and then load the authors repository from the Main slice container.

```ruby
# db/seeds.rb
require 'faker'

authors = Main::Container['application.persistence.repositories.authors']
```

Then let me create a few **completely random** records.

```ruby
authors.create(first_name: 'Seb', last_name: 'Wilgosz')
authors.create(first_name: 'Hanami', last_name: 'Mastery')
authors.create(first_name: 'Awesome', last_name: 'Subscriber')
```

First will be me, as an author, then the Hanami Mastery project, in case the author of the article would like to remain anonymous, and finally, You, my awesome subscriber, in case you'll ever subscribe me and want to write a Hanami article on your own.

Now I need to fetch the IDS of all my authors, to randomly generate one for each newly created article.

```ruby
author_ids = authors.all.to_a.map &:id
articles = Main::Container['application.persistence.repositories.articles']

20.times do |i|
  articles.create(
    **title: Faker::Hacker.say_something_smart,
    excerpt: Faker::Lorem.paragraph(random_sentences_to_add: 4),
    content: Faker::Lorem.sentences(number: 50).join(' '),
    thumbnail: "https://loremflickr.com/800/460/cat?lock=#{i}",
    author_id: author_ids.sample,
    published_on: "1 Apr 2021"**
  )
end

```

Now I need to get the articles repository in the same way, and create a loop of maybe twenty random records in it.

Here is where I'll use `faker`, similar to what I did before in the entity model. I already saved this script aside, so let me paste it here.

Then let's run our seeds and run the server

```shell
hanami db seed
docker-compose up
```

We can now run the server and visit `localhost:2300` to check out the result in the browser.

![[Pasted image 20210930191747.png]]

It looks pretty similar to what we had before, however, after refreshing the page, everything will stay the same.

### Articles preview action

Now, when our list works well, let's quickly apply the same changes to the single article view.

```ruby
# slices/main/lib/main/views/blog/articles/show.rb

module Main
  module Views
    module Blog
      module Articles
        class Show < View::Base
          expose :article
        end
      end
    end
  end
end
```

I remove the dummy article fetching logic from here and move it to the action

```ruby
# slices/main/lib/main/actions/blog/articles/show.rb

module Main
  module Actions
    module Blog
      module Articles
        class Show < Main::Action
          include Deps[
            repo: 'application.persistence.repositories.articles'
          ]

          def handle(req, res)
            article = repo.find(req.params[:id])
            res.render view, article: article
          end
        end
      end
    end
  end
end
```

Again, I inject the repository dependency, and handle the response, this time setting the article variable to be exposed. To fetch the article, I'll call the find method with the request parameters.

Then, in the repository, I'll define the find method, to behave exactly as we would expect:

```ruby
# frozen_string_literal: true

module Sandbox
  module Persistence
    module Repositories
      class Articles < Repository[:articles]
        commands :create

        def all
          articles.combine(:author).to_a
        end

        def find(id)
          articles.combine(:author).by_pk(id).one!
        end
      end
    end
  end
end

```

I will combine the articles with the author, and find it by primary key, passing the given id as an argument. Then I'll ensure that only one record is returned.

Now after restarting the server page should work well. Oh, it seems I made a little mistake in the show action, so let me visit it very quickly. Yes, I used the render method on the action object, instead of the response. Now should be fine.

Hurray!

The article is persistent and does not change even after the page refresh, I can safely browse my publications and manage resources exactly as one would expect from a blog application.

### Summary

That's all for today!

I hope you've enjoyed this episode, and if you want to see more content in this fashion,** Subscribe to [this YT channel](https://www.youtube.com/channel/UC4Z5nwSfZrUO4NI_n9SY3uQ)**, **newsletter**  and **follow me [on twitter](https://twitter.com/hanamimastery)**!  As always, all links you can find the description of the video or in the https://hanamimastery.com.

Also, If you have any suggestions of amazing ruby gems You'd like me to cover, or ideas on how to improve, please mention them in the comments!

### Special Thanks!

I'd like to thank **Sebastjan Hribar**, Thomas Carr, and Useo. for supporting this project! Really appreciated! Also thanks for all my existing sponsors for the continuous support.

Any financial support allows me to spend more time on creating this content, promoting great open source projects, open source heroes, and Hanami in General.

Thank you for reading, you're awesome! - and see you in the next Hanami Mastery episode, covering interesting topics related to Hanami and anything else happening in the Ruby world!

Also thanks to:

- [Jan Antonin Kolar](https://unsplash.com/@jankolar)- for a great cover image
- [Marc Busqué](https://github.com/waiting-for-dev) - for creating his sample todos application.

...and to the whole Hanami team for being nice and supportive at any stage of my activity.

Have a great day and happy coding!
