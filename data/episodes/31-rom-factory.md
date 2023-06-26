---
id: 31
aliases: ["HMEP031"]
author: "swilgosz"
topics: ['rom-rb', 'tests', 'rom-factory']
title: "ROM-Factory - Your testing buddy for Hanami apps"
excerpt: "If you have experience testing ruby applications, I'm sure you've heard about FactoryBot. Here I show you the alternative, suited for ROM-based applications, including Hanami 2."
videoId: ZTgZTEQB1iM
published: true
publishedAt: "2022-10-11"
modifiedAt: "2022-10-11"
thumbnail:
  full: /images/episodes/31/cover-full.jpeg
  big: /images/episodes/31/cover-big.jpeg
  small: /images/episodes/31/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1579759167979794432
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/y14onb/romfactory_your_testing_buddy_for_hanami_apps/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/y14out/romfactory_your_testing_buddy_for_hanami_apps/
source: https://github.com/hanamimastery/episodes/tree/main/031
---

I've recorded several episodes about [ROM, Hanami, and ruby](/t/persistence), but none of them touched the testing part from the practical point of view.

In this episode, I'll talk exactly about that. Or, to be more precise, how to quickly instantiate and persist objects for testing purposes, using *ROM-factory*.

## The problem in testing

I have [this little project](https://github.com/hanamimastery/episodes/tree/main/031/before), where I can publish my articles using my interactor class. I have three tests written for it, and to test the interactor well, I need to have some [articles persisted in the database](28-configure-rom-from-scratch).

I have two different articles, one published, and in the other example, unpublished.

```ruby
let(:article) { repo.create(published_on: Date.parse('2022-09-09')) }

let(:article) { repo.create(published_on: nil) }
```

The problem with this is, that I have a foreign key set on *author's id*, and a *not null* constraint, which in this case, will be violated.

```ruby
     Failure/Error: let(:article) { repo.create(published_on: Date.parse('2022-09-09')) }

     ROM::SQL::NotNullConstraintError:
       PG::NotNullViolation: ERROR:  null value in column "author_id" violates not-null constraint
       DETAIL:  Failing row contains (1, null, null, null, null, 2022-09-09, 2022-10-01 00:26:42.124334, 2022-10-01 00:26:42.124334).
```

Creating objects directly in test examples is problematic because I need to know exactly, which attributes are required, and what relations need to be created.

More importantly, whenever some of it changes, I'd need to run through all my tests and update all the object definitions accordingly.

Wouldn't it be cool, if I'd have this logic extracted to a single place, and never worry if I create a valid object or not?

```ruby
let(:article) { Factory[:published_article] }

let(:article) { Factory[:draft_article] }
```

This is where the concept of *factories* had been born.

## FactoryBot for rails applications

If you have a Rails background, I'm sure you've heard about [FactoryBot](https://github.com/thoughtbot/factory_bot), the popular gem used to quickly build instances of your models, so testing can be fun.

I totally recommend it for rails projects, as I used it a lot and like it very much. However, while they claim to not be rails-specific, I find it very troublesome to use it with *non-ActiveRecord* projects.

> [!QUESTION] Do you know such?
> If you've met projects using FactoryBot out of the Rails-specific gems or apps, please let me know, **I'll gladly take a closer look at this**.

The idea behind factories is super cool, and I guess anyone who had a chance to work with FactoryBot or a similar library, would like to see something like this in Hanami or ROM too.

Good news! ROM has a dedicated gem that **we can use exactly for this purpose**.

## ROM-Factory for Hanami apps

In Hanami applications, we use [ROM-RB](https://rom-rb.org/) for the persistence layer, and ROM comes with a small neat gem to support those of us who test their code on a daily basis.

It's a *ROM-Factory* gem, and despite some minor syntax differences, I'm sure you'll find it very similar to whatever you got used so far.

The difference is that ROM-Factory works with [ROM relations](/episodes/28-configure-rom-from-scratch) out of the box, and there is **minimal to no configuration** required.

### Installation

To install the gem, you'll need a `rom-factory` gem added to the *Gemfile* and run bundle to install it.

```ruby
# Gemfile

group :development, :test do
  # ..
  gem "rom-factory"
end
```

It has a `faker` gem listed as a dependency, so you can use it out of the box to generate the random data for your fields.

### Configuration

To configure the `ROM-Factory` in your project - which in my case will be a Hanami application - you just need to add the `factory` configuration file to your spec support folder and point to the `rom` container instance.

I'm going to require the *faker* here, so I don't need to care if it's loaded in the specific factories who use it.

Finally, I need to load the factory definition files, which I'll store in the `spec/support/factories` folder.

```ruby
# spec/support/factory.rb

require_relative "rom-factory"
require "faker"

Factory = ROM::Factory.configure do |config|
  config.rom =
    Sandbox::App.container['persistence.rom']
end

Dir[File.dirname(__FILE__) + '/factories/*.rb'].each { |file| require file }
```

Then load this configuration in the `spec_helper` file:

```ruby
# spec/spec_helper.rb

require_relative "support/factory"
```

Our gem is fully configured now to be used within our test suit! Now we can define some factories for our tests.

### Defining factories

First, let me create an article factory. For my test, I won't care about any of the attributes I don't check at the given moment. For now, I'm only interested in creating a draft article, and a published one.

To solve the problem with not-null constraint violation, I'm going to add the association pointing to the `author`. With this, whenever I create an article using this factory, the author will also be instantiated with the use of the *author* factory which I'll define right now.

```ruby
# spec/support/factories/article.rb

Factory.define(:article) do |f|
  f.association(:author)
end

Factory.define(published_article: :article) do |f|
  f.published_on Date.today
end
```

In a new factory file, I'm adding a simple object, filling-in `first_name`, `last_name`, and a `nickname`. The *nickname* is a unique field, so I'll use the sequence feature to set different values each time the factory is used.

```ruby
Factory.define(:author) do |f|
  f.first_name Faker::Name.first_name
  f.last_name Faker::Name.last_name
  f.nickname { Faker::Internet.unique.username }
end
```

With this, I can now don't care about the exact object initialization logic in my tests, but just use my factory, and *hide all that inside*!

```ruby
context 'when given article is already published' do
  let(:article) { Factory[:published_article] }
  # ...
end

context 'when given article is not published' do
  let(:article) { Factory[:article] }
end
```

I know it's not much for this little example, but for more complex applications persisting objects in tests can be extremely annoying.

Why to bother if you don't need to?

## Summary

ROM-Factory is a nice gem created to make ROM-based applications more testable, and I need to admit, they succeeded with it.

I am a [huge fan of testing my code](/episodes/25-simplecov-introduction), so I love having this in place.
as I got used to the *factory_bot* before. I hope you'll enjoy it too!

:::important[Become an awesome subscriber!]

If you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/HanamiMastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!
:::

### Thanks

:::important[Recent sponsors]
-   [Akilas Yemane](https://twitter.com/akilasy)
-   [Bill Tihen](https://github.com/btihen)
-   [Benjamin Klotz](https://github.com/tak1n)
:::

:::important[Other thanks]
- [Nikhil Mitra](https://unsplash.com/@nikhilmitra) - for the great Cover image!
:::

If you have found this content useful, I'll appreciate it if you consider supporting this initiative.

See you soon!
