---
id: 7
aliases: ["HMAP007"]
author: "swilgosz"
topics: ["hanami", "rails", "persistence", "rom-rb", "activerecord", "sequel"]
title: "ROM and Sequel over ActiveRecord?"
excerpt: "I've wondered why Hanami uses sequel under the hood. There are some problems with ActiveRecord, but I've wanted to know exactly, what it is about. Here is the summary of my foundings."
published: true
publishedAt: "2021-11-19"
modifiedAt: "2022-04-29"
thumbnail:
  full: /images/articles/sequel-over-activerecord/cover-full.jpeg
  big: /images/articles/sequel-over-activerecord/cover-big.jpeg
  small: /images/articles/sequel-over-activerecord/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1461829159173472265
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/qxrnvl/rom_and_sequel_over_activerecord/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/qxro4b/rom_and_sequel_over_activerecord/
source: null
category: stray
---
Hanami uses [ROM-RB](https://rom-rb.org) to implement the persistence layer, and if it comes to SQL databases, ROM uses Sequel to manage SQL connections.

### But WHY? Why not ActiveRecord?

I wondered about the reasons behind that. I knew there are issues with ActiveRecord and I did face some of them in my career, but I wanted to know the exact pain points and **why Sequel is better than ActiveRecord in enough different areas** to be chosen by the Hanami team.

Recently I've seen this great [Youtube V1ideo summary, comparing ActiveRecord With Sequel](https://www.youtube.com/watch?v=ftJrBpiYQXM) by [Janko Marohnić](https://janko.io/about). I've been amazed and immediately took a lot of notes.

> Big Kudos to Janko for his work! My article is mostly the summary of his presentation, his articles, and collected findings from my own experience and other resources related to this topic.

This article is a result of what I got from this video and further exploring of the topic. Because **Hanami uses Sequel under the hood**, I've found it interesting to compose this short article from the findings.

Hope you'll find it useful too!

**You can check out the video here!**

<YoutubeEmbed embedId={'ftJrBpiYQXM'} />

:::important
It's important to mention that Sequel is an implementation detail in rom-sql and eventually Sequel will be replaced in ROM with a custom SQL builder (see [https://github.com/sql-rb/sql-composer](https://github.com/sql-rb/sql-composer)).
:::

## What is Sequel?

For those who don't know, [Sequel](https://github.com/jeremyevans/sequel) is a ruby ORM, an ActiveRecord's alternative, developed to communicate with databases easily. It can be used in any ruby application and indirectly (through ROM dependency) is an ORM of choice for [Hanami framework](https://hanamirb.org).

There are already a lot of comparisons out there, and I'll link to those in the resources of this article, but I could not hesitate to write my own, focusing on Hanami usage.

Here are the main points that Janko covered, which actually make `Sequel` better choice than `ActiveRecord` for any sql-based ruby application.

1. Confident Design
2. Explicitness
3. No global State
4. Complexity management
5. Performance
6. Features

Below I will describe some of them, adding my own, in a more detailed manner but first, for people who don't like reading, is my summary.

## Why Hanami uses ROM (and Sequel) over ActiveRecord?

When you will go through the video above or the details below, the answer should become obvious.

![Sequel vs Active Record](/images/articles/sequel-over-activerecord/sequel-vs-activerecord.png)

> Disclaimer: Plus means advantage over the other option.

Sequel wins in almost all meaningful categories, and the only thing that speaks for ActiveRecord seems to be the fact that there is a greater community around it so it's richer in terms of available learning resources or compatible gems built by developers all around the world.

I do understand the reasons behind choosing Sequel and [ROM](https://rom-rb.org) as a default ORM for the Hanami application framework.

The core Hanami team just chooses the best available tool for the job, not the most popular one.

**And I think it's great!**

With this, **if we could improve the community around ROM and Sequel, we would improve on available resources and integrations**! I totally support this philosophy, as [this is why I started Hanami Mastery in the first place.](/articles/hanamimastery-origins)

Now let's talk about the main points above in depth.

## Confident design

Confident design in programming means basically that your program behaves as it's expected to.

Confident desing touches different levels of creating applications, from designing website UI, to designing libraries, classes, or single functions.

Obviously on different levels, it'll matter for different users. Let's start from something obvious.

### Confident design in web UI design

In UI, confident design is all about components that people can use confidentially, **knowing what the app will do before they do the interaction**. A very simple example of that is my Hamburger menu on HanamiMastery mobile view.

![Confident design in UI](/images/articles/sequel-over-activerecord/confident-design.png)

You can guess what will happen if you'll click it, no?

Confident design covers all kinds of components behavior, looks, etc. **When a user sees something and can use it without thinking, it's a good confident design**.

### Confident design in programming

However, it comes down to the lower levels too. **For programming libraries, developers are users.**

If I design a library that can be used by developers confidentially, it's a sign of a well-designed library. You can apply this thought to classes and methods too, or even the API endpoints!

So how does this all apply to `activerecord` and `sequel`?

### Active Record WAT's

#### 1. Gem's name

Ruby's convention method for naming gems comes down to this.

- "MyGem" => "my_gem"
- "My::Gem" => "my-gem"

Therefore, If I know the `ActiveRecord` class name, I'd expect the gem to be named: `active_record`.

![ActiveRecord naming issue](/images/articles/sequel-over-activerecord/activerecord-naming-wats.png)

But it's not as I would expect.

Fortunately, when it comes to `require`, the name follows the convention.

```ruby
require 'active_record'
```

This one is not a big deal, especially as most people using `ActiveRecord` do it because of Rails, and Rails has it listed as a dependency. No need to be strict about dependencies names I guess.

It annoyed me personally several times though, as I am a person who plays around with gems in a raw ruby environment to contribute, benchmark, and build non-standard solutions.

#### 2. Establish Connection

The first real example of NOT confident design though is when we use `establish_connection` method.

When you'll `establish_connection`, to set up the connection with the database, then, in the console, calling an Article class, ruby will ask you to establish a connection again.

![Reaction on connection not established after calling establish_connection in ActiveRecord](/images/articles/sequel-over-activerecord/wat-1.gif)

It appears that Rails calls this establish_connection on the Article object under the hood, so we don't need to, but the funny thing is that calling `establish_connection` on `ActiveRecord::Base` does not establish anything.

##### Establishing connection - ActiveRecord example

Here is a simple example to showcase this behavior.

```ruby
require 'irb'

require 'pg'
require 'active_record'

ActiveRecord::Base.establish_connection(
  adapter: 'postgresql',
  database: 'mydb'
)

class Article < ActiveRecord::Base
end

IRB.start
```

The code above will be executed without returning any issues, even though my Postgres server is not even running!

![Establish Connection issue](/images/articles/sequel-over-activerecord/establish-connection.png)

This is certainly not something I would expect.

##### Establishing connection - Sequel example

Sequel does not have such an issue. When I call the `connect` method, it actually tries to establish a db connection, and the analogous code in case of `sequel` will fail immediately.

```ruby
require 'irb'

require 'pg'
require 'sequel'

DB = Sequel.connect(
  adapter: 'postgresql',
  database: 'mydb'
)

class Article < Sequel::Model
end

IRB.start
```

![Expected connection establishing error](/images/articles/sequel-over-activerecord/conenction-established.png)

**This is what I call confident design for libraries**.

If the library behaves as we would expect to, it's less likely we'll encounter random bugs due to the inappropriate usage of the library, especially if we're creating complicated, advanced systems, like the Hanami framework.

But Wait, There is More!

#### 3. Defining methods on Runtime.

We all know that `ActiveRecord` does define model methods based on table schema definition. It's super convenient and speeds up the development in the early days of the application like crazy.

I love this feature, but it's a bit less known, that `ActiveRecord` actually defines those methods dynamically **in runtime**.

So, until the first instance of my model is created, the method on the class is not defined...

![Methods defined on runtime](/images/articles/sequel-over-activerecord/methods-defined-on-runtime.png)

Sequel Parses the schema immediately, so you'll know immediately that the article has the `title` method defined, as you probably expected.

![Methods defined on build time](/images/articles/sequel-over-activerecord/methods-defined-immediately.png)

### Complexity

I am often annoyed by the fact the `type` method in Rails is reserved for STI, even though STI is something I rarely use.

After watching Janko's video, I know I'm not the only one.

Unfortunately, one of the biggest issues with `activerecord` is its size. Active Record is a monster, rich in features, most of which you'll probably not use, especially if you only want to develop a simple, task-focused library.

It's fine, that `activerecord` is rich in features, however not being able to disable them is in my opinion a very bad thing.

The `Sequel`, in contrast, loads by default only an essential feature set, allowing a user to have control over what should be included. All non-standard features are loadable by the plugin system, which makes Sequel more lightweight, faster, and easier to work with.

```ruby
ActiveRecord::Base.ancestors # loads all the features

Sequel::Model.ancestors # loads only essentials - everything accessible by plugins.
```

This Really speeds up the app, improves memory management, and so on.

![ActiveRecord and Sequel weight comparison (SRC: https://youtu.be/ftJrBpiYQXM)](/images/articles/sequel-over-activerecord/ar-sequel-weight-comparison.png)

## Summary

Sequel is really a much better library than ActiveRecord objectively. I strongly believe ActiveRecord is popular because of Rails.

Now, when I work more with Hanami, I really enjoy being exposed on Sequel too!

Keep in mind, that this article covers only a fraction of the differences. I'll extend it but in the meantime, I strongly encourage you to [watch the video](https://www.youtube.com/watch?v=ftJrBpiYQXM) and read the resources linked below!

### Consider support!

I hope you've enjoyed this article, and if you want to see more content in this fashion,** Subscribe to [this YT channel](https://www.youtube.com/c/HanamiMastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)**, and **follow me [on Twitter](https://twitter.com/hanamimastery)**!  As always, all links you can find the description of the video or in the https://hanamimastery.com.

### References
- [Sequel CheatSheet](http://sequel.jeremyevans.net/rdoc/files/doc/cheat_sheet_rdoc.html)
- [Ode to sequel by Janko Marohnić](https://janko.io/ode-to-sequel/)
- https://mrbrdo.wordpress.com/2013/10/15/why-you-should-stop-using-activerecord-and-start-using-sequel/

### Thanks!
- [Jon Tyson](https://unsplash.com/@jontyson) - For a great cover photo
- [Janko Marohnić](https://github.com/janko) - for the astonishing groundwork to make this article possible.
