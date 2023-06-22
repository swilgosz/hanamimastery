---
id: 28
aliases: ["HMEP028"]
author: "swilgosz"
topics: ['rom-rb', 'hanami', 'relations', 'sequel', 'persistence']
title: "Configure ROM from scratch"
excerpt: "Hanami 2.0 comes without the persistence layer nor views preconfigured. It is useful then to know how to set up the best ORM available in the Ruby ecosystem."
videoId: qbhCJ6jO0oE
published: true
publishedAt: "2022-09-20"
modifiedAt: "2022-12-21"
thumbnail:
  full: /images/episodes/28/cover-full.jpeg
  big: /images/episodes/28/cover-big.jpeg
  small: /images/episodes/28/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1572120700303069184
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/xj201m/configure_rom_from_scratch_in_ruby_apps/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/xj209l/configure_rom_from_scratch_in_ruby_apps/
source: https://github.com/hanamimastery/episodes/tree/main/028
---
ROM is the most powerful ORM in Ruby. There is no doubt. If you'll compare it to *active_record*, *sequel*, or whatever you choose, there is just no competition in terms of features it delivers. It's not a surprise then, that Hanami made it an ORM of choice for its persistence layer.

However, as Hanami 2.0 will be released without the persistence layer pre-configured, there may be a lot of people wanting to know HOW to configure it from scratch to already play with Hanami 2 in their projects.

In this episode, I'll go with you through the basic integration of ROM in Hanami, but You can take these steps and apply them in ANY Ruby application, and it'll still work the same.

:::info[Disclaimer]
In this episode, I'll showcase the basics of ROM, but this is just a part of the **deep dive course** about [understanding ROM and mastering it](https://hanamimastery.teachable.com/p/hanami-mastery-premium) we're making for you.

This course we already started to record and it is available as a part of [Hanami Mastery PRO](https://hanamimastery.teachable.com/p/hanami-mastery-premium). Feel free to join to get early access and have an impact on shaping it with us!

Access starts from **10$ per month for now**, and the price will stay the same for all early birds!

If you find my content useful, check it out, **this is a great way to support my channel and Hanami Mastery initiative** while getting back actual benefits for the sponsorship!
:::

## The app.

Now let me go back to the topic. You can create a new Hanami application using the `hanami new` command followed by the application name.

```shell
gem install hanami -v 2.0.0.beta2
hanami new sandbox
cd sandbox
```

This gives me an empty scaffold application but I already created one before and added a single action to list my articles. As usual, you can see the source code in the repository attached to the episode.

```ruby
# app/actions/articles/index.rb

module Sandbox
  module Actions
    module Articles
      class Index < Action
        def handle(req, res)
          res.status = 200
          articles = []
          res.body = articles.to_json
        end
      end
    end
  end
end
```

You may refer to [HMEP21](/episodes/21-serialization-with-alba) to see how I’ve set the JSON response header to my actions. I talked there about **serialization using Alba**, and covered several API-related configuration stuff.

Of course, the route is also set up, so when I'll visit the `/articles` URL in the browser, you'll see the empty JSON response and the goal is to fill it with the content loaded from the database.

:::tip[Test your router] 
In my episodes, I mostly show only working code, however the process of creating it is a bit different. If you're interested in how to test Hanami apps, check out [HME022 - Testing the router](22-testing-hanami-router) to get some idea about testing phase.
:::

Hanami 2.0 **will not have persistence nor view** layer pre-configured.

I'm not a person who likes to wait, but rather one who takes things in hand, so I'll just add ROM manually into my app.

## Installing ROM with SQL

:::warning[Disclaimer]
This episode is **NOT targeted at beginners** expecting everything working out-of-the-box.

It's for people wanting to know **how the persistence layer works under the hood** and how to master the great ORM which the ROM definitely is.
:::

> Everything I'm doing in this episode **you'll have integrated in Hanami 2.1** and you won't need to configure any of this, but I think it's useful to understand how ROM works under the hood anyway - especially in case you will want to use it in other frameworks, or gems.
>

To add the DB connection, I'm going to add `rom`, `rom sql` and `pg` gems to my project.

ROM comes with different adapters and the *rom sql* is responsible for working with SQL databases but. The database server I'll use is Postgres.

```ruby
# Gemfile
gem "rom"
gem "rom-sql"
gem "pg"
```

Then I run `bundle` again to add missing libraries on my system and after that I can move to the next step.

Now let's configure this beauty.

## Migrations

 The first thing I want to have is an easy way to generate migrations for my project. ROM comes with ready-to-use rake tasks for DB structure management and migrations generator; For that, we need just a minimal setup of DB connection.

 First I'm going to create a new provider, named *persistence*. I'll also include a namespace here, to group all my database-related dependencies within the same group.

```ruby
# config/providers/persistence.rb

Hanami.app.register_provider :persistence, namespace: true do
 # ...
end
```

 If providers are something you're not familiar with, refer to the [dry-container episode](notion://www.notion.so/episodes/13-dry-container-tips) I've published for you. I've explained there a lot about setting up dependencies for the container.

 Providers are something specific for the Hanami projects, but if you work with plain Ruby script, a Gem or Roda application, you can even create a simple class that returns the `config` and the DB setup properly.

 Inside the provider, I'm going to place the `prepare` blog, which is launched whenever I set up my application. Providers allow us to require ROM files only when we need them, and if no DB is used by some parts of your system, we won't slow down these components.

```ruby
# config/providers/persistence.rb

Hanami.app.register_provider :persistence, namespace: true do
 prepare do
 end
end
```

 Then I'm going to create a new instance of the ROM configuration for `sql` adapter, and pass into it the database URL read from the application settings.

Then I want to add it to my container by registering it under the `persistence.config` key.

 Aside from this, I'll also extract the actual DB connection and register it under the `persistence.db` key of my container. It'll be useful later.

```ruby
# config/providers/persistence.rb

Hanami.app.register_provider :persistence, namespace: true do
 prepare do
    require 'rom-changeset'
    require 'rom/core'
    require 'rom/sql'

    config =
      ROM::Configuration.new(
        :sql, target['settings'].database_url
      )

    register 'config', config
    register 'db', config.gateways[:default].connection
  end
end
```

### Adding the database URL setting

 I'm using the `database URL` setting here, so let me define this in the application settings file. It will be a required setting, type of string.

```ruby
# /config/settings.rb

require "sandbox/types"

module Sandbox
  class Settings < Hanami::Settings
    # Define your app settings here, for example:
    #
    # setting :my_flag, default: false, constructor: Types::Params::Bool
    setting :database_url, constructor: Types::String
  end
end
```

Then in the `.env` file I'll add this to the environment.

```shell
DATABASE_URL=postgresql://localhost:5432/sandbox_dev

```

Now my application will read this environment and add it to the settings automatically without leaking unexpected environment values to my project.

### Rake tasks

Now let's visit the Rake task definition file.

Here I want to add the predefined rake tasks loaded from ROM but to make all of them work, I need to set up my database connection first.

 For that, I need a  `db setup` task, and inside I'll set the ROM rake support environment to a new `ROM Container`, passing the config as an argument. I can easily extract the config variable from the container key I registered a moment ago.

```ruby
# Rakefile

require 'rom/sql/rake_task'
require "hanami/prepare"

namespace :db do
  task :setup do
    Sandbox::App.prepare :persistence
    config = Sandbox::Container['persistence.config']
    ROM::SQL::RakeSupport.env = ROM.container(config)
  end
end
```

Now we have the working setup to generate new migration files, run migrations, roll them back, and clear the database.

Let's check if it actually works fine.  I just need an empty database to be created first.

```ruby
createdb sandbox_dev
rake db:setup
```

It works! Now let me create the actual migration

### Creating migration

 With a database connection in place, I just need the migration folder so let me create one.

```shell
mkdir db/migrate
```

 Now we can simply run the `CLI` command to create a new migration file, however, because I use `zsh` as my main shell, by typing this I'll end up with an error. For bash shell it should work fine, however, to fix it in `zsh`, you'll need to escape the square brackets, or, what I like more, wrap the argument of the `rake` command with a single quotes.

```shell
rake db:create_migration[create_authors]
# => Error
rake db:create_migration\\[create_authors\\] # works in zsh shell
rake 'db:create_migration[create_authors]' # also works in zsh shell
```

With this, it all works well, and now I have the empty migrations file to create some authors.

 Let me do the same for articles yet and visit the actual migration files.

```ruby
rake 'db:create_migration[create_articles]'
```

 Within the main migration blockI add the `change` method that will accordingly apply the block's content during the migration and will try to roll back the change when we want to revert the step.

 Then I create a table named authors, with some sequential primary key set to `id`, first and last name columns being type of string, and the nickname, also type of string, however with additional constraints to not accept `null` values and be unique across all records.

```ruby
# db/migrate/20220825114915_create_authors.rb

ROM::SQL.migration do
  change do
    create_table(:authors) do
      primary_key :id
      column :first_name, String
      column :last_name, String
      column :nickname, String, null: false, unique: true
    end
  end
end
```

 Next, I'm going to fill in the *create articles* migration. It's more code but nothing fancy, so let me paste it here.

```ruby
# frozen_string_literal: true

ROM::SQL.migration do
  change do
    create_table(:articles) do
      primary_key :id
      column :title, String
      column :content, String
      column :status, Integer
      foreign_key :author_id, :authors
      column :published_on, Date
      column :created_at, Time, default: 'now()', null: false
      column :updated_at, Time, default: 'now()', null: false
    end
  end
end
```

 You may notice that I've added the `foreign key` for author id, pointing to *authors* table, so and also the timestamp columns using postgres' built-in `now` function to set the default values.

 Then I can run all migrations and check the current schema of the system.

```shell
rake db:migrate
```

Now when I'll check the structure of my application, you'll see that my tables had been successfully created!

Awesome, isn't it?

## Adding relations

 I already have the connection so technically I can already read data from the server.

```ruby
# hanami console
db = container['persistence.db']
articles = db[:articles]
articles.all
=> []
```

However, this is just communicating with database adapter.

DB connection here is purely an instance of database connection comming from the  `sequel` gem made by *Jeremy Evans*, who is also the author and maintainer of Roda, Rodauth, and related libraries.

It's an awesome gem, but there is no type mapping for attributes, no classes for the table representations, and no associations defined.

Also, if we'd add another data source, like CSV, HTTP or events, we would end up with a lot of mess with data management.

 ROM allows us to automate all of that and improve developers experience by building the infrastructure around adapters and adding tons of functionality that benefits growing applications.

It is just a persistence engine built for scale - and so the Hanami is an application framework built for that.

 Let me go back to the implementation. To add relations to the system, I’ll start from a persistence provider.

### Autoload ROM relations in Hanami

 Here I'll add the autoloading for relation files defined in the system and add the rom container into my application container.

This will ONLY be done on the application boot, so for example, in my `rake tasks` - where I don't need relations - I won't slow down my migrations executions by unnecessary loading of relations! I also won't risk that my application will crash if the relation file is missing.

```shell
  # config/providers/persistence.rb
  prepare do
    # ...
  end

  start do
    config = target['persistence.config']
    config.auto_registration(
      target.root.join('lib/sandbox/persistence'),
      namespace: 'Sandbox::Persistence'
    )

    register 'rom', ROM.container(config)
  end
  # ...
```

### Add ROM relations definitions.

 Relations are reflections of our DB structure. Because I've set the autoloading path to `lib/sandbox/persistence`, I'm going to create the *articles* relation within that folder.

Here I define the relation schema, by setting the table to `articles`, and infering all the attributes based on the types defined int postgres table.  Inside I only want to set the association, to: *belongs to* author.

```ruby
# lib/sandbox/persistence

module Sandbox
  module Persistence
    module Relations
      class Articles < ROM::Relation[:sql]
        schema(:articles, infer: true) do
          associations do
            belongs_to :author
          end
        end
      end
    end
  end
end
```

 Authors relation will look similar, with the difference, that I'l use the `has_many` instead of `belongs_to`.

```ruby
# frozen_string_literal: true

module Sandbox
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
end
```

Let me show you now How we could use it.

 In the Hanami console, I'm going to assign authors relation to a variable. I can extract it from the container, because of the autoloading setup we added to the provider.

```ruby
bundle exec hanami console
authors = container['persistence.rom'].relations[:authors]
```

 Then I need a data hash, filling some attributes with the corresponding values and with this, we can create a new author in the table.

```ruby
data = { first_name: 'Sebastian', last_name:
'Wilgosz', nickname:'swilgosz', status: 1 }

authors.changeset(:create, data).commit
```

 If I filter the authors in my table by a nickname, I'll get my newly created object as a hash.

```ruby
authors.where(nickname: 'swilgosz').to_a
=> [{:id=>1, :first_name=>"Sebastian", :last_name=>"Wilgosz", :nickname=>"swilgosz"}]
```

### Rendering Results.

 If I have this in place, now I can update my action to list the articles and their users.

 First I include `rom` as a dependency, and then assign the articles' relation to a variable. I want to include the authors of the articles in the response, so I combine two tables together.

```ruby
module Sandbox
  module Actions
    module Articles
      class Index < Action
        include Deps['persistence.rom']

        def handle(req, res)
          res.status = 200
          relation = rom.relations[:articles].combine(:author)
          res.body = relation.to_a.to_json
        end
      end
    end
  end
end

```

 Now when I render this, I'll get the expected response, with all data filled in. However, by default I don’t have any data in the system yet. I’ve created a seed file, which fills my data with random records using the `Faker` gem. Feel free to copy this script from the source code if you wish. Then let me seed the data using the seed rake task.

```ruby
require 'faker'

container = Sandbox::Container
rom = container['persistence.rom']
# repo = container['repositories.authors']

authors = rom.relations[:authors]
authors.changeset(:create, { first_name: 'Seb', last_name: 'Wilgosz', nickname: 'swilgosz' }).commit
authors.changeset(:create, { first_name: 'Hanami', last_name: 'Master', nickname: 'hm' }).commit
authors.changeset(:create, { first_name: 'Awesome', last_name: 'Subscriber', nickname: 'awesomesub' }).commit

author_ids = authors.pluck(:id)

puts author_ids

articles = rom.relations[:articles]
20.times do |i|
  articles.changeset(
    :create,
    {
      title: Faker::Hacker.say_something_smart,
      content: Faker::Lorem.sentences(number: 50).join(' '),
      status: 0,
      author_id: author_ids.sample,
      published_on: Time.now
    }
  ).commit
end

```

 When I have the data loaded to the database, we can visit the browser, and we’ll see all our articles and their users listed here.

![[/images/episodes/28/browser-list-articles.png]]

## Summary

Ok, it's fine, it's working. But how I could improve on that? If you ask me, it isn't too pretty, is it?

I serialize responses using the `to_a` and `to_json` method chain. I could use some fancy serializer here instead and if you want to choose one, I highly recommend [my episode about *alba*](notion://www.notion.so/hanamimastery/episodes/21-serialization-with-alba), which will get you to know probably the best serializer for ruby.

 The other next step would be to add repositories and entities to the system and this is where the fun starts!

Join to our Hanami Mastery PRO for the follow-ups on this topic and deep dives into each of the ROM components!

I hope you've enjoyed this episode, and if you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/hanamimastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!

## Thanks

 I want to especially thank my recent sponsors,

- [Akilas Yemane](https://twitter.com/akilasy)
- [Bill Tihen](https://github.com/btihen)
- [Benjamin Klotz](https://github.com/tak1n)

for supporting this project, I really apreciate it!

By helping me with a few dollars per month creating this content, you are helping the open-source developers and maintainers to create amazing software for you!

And remember, if you want to support my work even without money involved, the best you can do is to like, share and comment on my episodes and discussion threads. Help me add value to the Open-Source community!

If you know other great gems you wish me to talk about, leave a comment with `#suggestion`, and I'll gladly cover them in future episodes!

As usual, here you can find two of my previous videos! Thank you all for supporting my channel, you are awesome, see you soon and have a nice rest of your day!
