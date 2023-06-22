---
id: 17
aliases: ["HMEP017"]
author: "swilgosz"
topics: ['documentation']
title: "Inline documentation - the secret habit of successful devs."
excerpt: "Everyone would love to have a secret power. A skill that makes you a hero. There is no one such skill, but in this episode, I'll talk about inline documentation - a great skill that can make you a better developer."
videoId: -h52cUY4obo
published: true
publishedAt: "2022-03-08"
modifiedAt: "2022-12-21"
thumbnail:
  full: /images/episodes/17/cover-full.jpeg
  big: /images/episodes/17/cover-big.jpeg
  small: /images/episodes/17/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1501151576332906499
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/t9efpn/inline_documentation_the_secret_habit_of/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/t9efva/inline_documentation_the_secret_habit_of/
source: https://github.com/hanamimastery/episodes/tree/main/017
---

Everyone would love to have a secret power. A skill that makes you a hero. If you just said: *"everyone but me"* - **don't lie, I know you would**.

The thing is, that **there is no single skill that makes you such**. If you aspire to join the top 10, 5, or top 3% of the best developers in the world, you will quickly realize that **what those people have in common, is a particular mindset.**

I'm nowhere close to the top 3% of Ruby developers, but I found that constant thinking about how to improve, how to deliver high-quality code with less and less effort, **made me a way better programmer in a very short time.**

There are several Habits I developed over the years of programming in various projects, that had a great impact on how relaxed I am and how efficient in terms of delivery, especially, thinking long-term.

**One is definitely - TDD**, which I'll cover at some point, but today I want to tell you about the other important skill I found not so popular, but extremely beneficial. **It's inline documentation**.

## What is inline documentation?

Let's talk about what inline documentation actually is.

The common understanding of inline documentation refers to **comments placed within the code files**, but that's a very big simplification.

**Comments in the code are just additional things to maintain**, and there is a big chance, they'll get out of date very quickly.

The difference between Inline documentation and just random comments is that documentation
- is structured,
- follows common conventions,
- is kept at a minimal level.

This all put together allows for a bunch of great benefits to be added on top of it.

## Benefits of practicing inline documentation

Before I'll jump into the particular solutions, I'd love to show you a few advantages that adding inline documentation brings to your projects.

### 1. Docs generators

First of all, if I'm building a project or library, a component, or whatever else, **I can leverage ready-to-use documentation generators**. Those parse my code and comments attached to it and generate neat, complete websites, where the whole team or whole community can easily track what's going on within my classes.

One example of such generator for Ruby projects is [rubydoc.info](https://rubydoc.info/gems/dry-system). **It automatically detects public ruby gems and generates documentation pages based on the inline comments in the code itself**.

You can for example, browse the [dry-system documentation website](https://rubydoc.info/gems/dry-system), where you can easily go through each method and class and check out what it does, what arguments it accepts, and what type of value it returns!

While this is neat, often you just have private repositories you work with so you may wonder if this kind of thing is available for private projects?

I have good news for you! **You can generate such documentation for any repository, private, public, or local**, with no effort whatsoever, having full control over sharing files with anybody in your team.

I'll talk about it a bit more below but for now, let's move to the other nice benefit I want to cover.

### 2. Code editor interpreters

One of the more useful things that inline documentation allows you to do, is **showing the documentation snippets of the documented class or method directly in the code editor**, when you hover over its execution!

![Inline documentation code interpreter popup](/images/episodes/17/code-editor-inline-doc-interpreter.png)

You may think:

> "Ok, but the code should be self-explanatory shouldn't it?".

And I kind of agree.

You may sometimes figure things out just based on the method or class name.

However, **in a lot of cases, you would need to visit the implementation and figure out how the code works**, which adds additional effort and may cost you a bit of time depending on how often you use it, and how well you know the project.

If you do have your code documented, at least a little bit, then you may save some time and brainpower, by letting your editor figure that out for you!

Let's say, I have two subscription mechanisms in the system. One that [subscribes via email](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter), and other, that [subscribes to the Youtube Channel.](https://www.youtube.com/c/HanamiMastery)

```ruby
# Subscribes to the Newsletter
#
class SubscribeToHanamiMasteryNewsletter
  # Subscribes the current reader to the newsletter
  #
  def call()
  end
end

# Subscribes to the Youtube Channel
#
class SubscribeToHanamiMasteryYoutubeChannel
  # Subscribes the current viewer to the Youtube Channel
  #
  def call()
  end
end
```

And a class, using one of them.

```ruby
class Action
  attr_reader :command

  def initialize
    @service = SubscribeToHanamiMasteryYoutubeChannel.new
  end

  def call
    service.call
  end
end
```

You can't figure out what the `service.call` does just by visiting the `Action#call` definition, can you?

But this is when code editor's doc resolvers start being very useful.

This is, what happens when I'll hover over the `service.call` method execution line.

![Automatic context recognition based on inline documentation](/images/episodes/17/automatic-context-recognition.png)

**I immediately get the information about what type of class is assigned to the service reader**, and what the method does! In this case, it subscribes the current video viewer to the youtube channel.

:::important[Disclaimer]
As you can see here, automatic subscriptions are not fully implemented yet, so **please use the [manual way of subscribing to a channel](https://www.youtube.com/c/HanamiMastery)**, for a while yet.
:::

Even though I don't have the information what is hidden under the variable value just based on a variable name, it's still immediately accessible and it proved to be useful quite often in my case.

I don't need to visit the actual definition of the class and read through the code or tests, to figure out what it does exactly.

I like when this stuff saves me some context switching when I feel a breath of deadline on my back.

### 3. Easier code reviews

Finally, **inline documentation makes the code review easier**. A lot easier. If you like those of your teammates, who review your code, which is true in my case, it makes sense, to help them to go through your changes as quickly and effortless, as possible, as there will be a greater chance you'll get more, high-quality feedback sooner.

As a bonus, you'll keep good relationships with you mates!

**But how does inline documentation help with code reviews?**

Well, while it can be acceptable for me to go through the different parts of the code, grasp the implementation of the dependencies, as long a all that is relevant for the context of the task I am working on, **people who review my code have their own tasks, often unrelated**.

To properly review my code, they need to go through the task definition, specs, and chances are, they'll forget about something as all that code can be new for them.

Having then a few guides on top of class or methods can make a difference for them.

![Github Review example with inline documentation](/images/episodes/17/github-review-with-inline-doc-example.png)

If you are reviewing the code daily, I am wondering, what are your thoughts on this particular point.

## How to do inline documentation in Ruby?

Now having covered why it can be beneficial to add some of the inline docs to your code, I'd love to tell you about the possible concrete solution.

There are several common formats of inline documentation to be applied to your code, but what I've found resonating with me the most, is [YARD doc](https://rubydoc.info/gems/yard/file/docs/GettingStarted.md), which is a great tool designed for Ruby.

![YARD home page](/images/episodes/17/yard-homepage.png)

In a very clear format, I can describe what the class or method does, why it exists, which arguments it accepts and what value it returns.

```ruby
  # Processes the event
  # @param [Hash] - event to process
  # @return [Boolean]
  #
  def call
  end
```

There are also conventions to document custom DSL methods, private API, **and a lot more if you wish**.

It would be tedious to go all of this in this article, so guess what? I recommend you to check out the [great documentation of this documentation tool](https://rubydoc.info/gems/yard/file/docs/GettingStarted.md)!

But don't be worried! If you'll just get familiar with a few most basic features I presented already, it already makes a huge difference in your projects and teams!

### Generating documentation using YARD

Now If I do have my code documented, I can generate the neat, complete documentation files, by using the `yard doc` command.

Just to show you how it works, I'm going to generate local docs for the *[dry-transformer](https://dry-rb.org/gems/dry-transformer)* gem.

:::tip
By the way, [check out episode 6](/episodes/6-complex-ruby-data-transformations-made-simple), where I covered the basics of complex ruby transformations using dry-transformer!
:::

If you want to operate on the same files, just clone the *dry-transformer* repository.

```ruby
git clone https://github.com/dry-rb/dry-transformer
cd dry-transformer
```

Having that I just need to install the *yard* gem, and then I can generate docs using a single *shell* command.

```shell
gem install yard
yard doc
```

This generates a set of files, where I can easily navigate through and browse them without an effort.

The generator also gives me a **bunch of useful stats**, telling me which files in my project are not documented and how much of the total codebase is covered with docs.

As I mentioned before, If you create a public library, there are several engines automatically picking up your gem and generating docs for you!

However, the nice thing is, that even if you want to keep your code private, you can still generate up-to-date documentation files during CI builds, and upload them to private servers if you wish, so everyone in your company can easily access necessary documentation!

## Myths about inline documentation

Ok, so if the inline docs are so awesome, **why does not everyone use them?**

### 1. An additional thing to maintain.

The first thing that comes to my mind is probably the most valuable point. **Inline documentation, like any documentation, is one more thing to maintain**. You may minimize the number of changes required on every update, as well as the risk of going out of sync with actual code, if you'll **keep things simple and only document the key points**, but still - it is a bit more work to be done.

### 2. Short-term thinking

I do like to make things simple and keep things simple. The only trick is, **I prefer thinking long-term, instead of short-term.**

It's a big simplification in itself, but in general, **I don't have the time and money to make the same thing twice** so I am trying to reduce such situations as much as possible.

**This is why I write tests when I am coding**.

And **this is why I write inline docs, while I'm coding**. Not always, not 100% but whenever I can.

### 3. Code should explain itself.

Old school programmers can tell you that **the code should explain itself**. [Here is why this can be just a hilarious joke](https://hackaday.com/2019/03/05/good-code-documents-itself-and-other-hilarious-jokes-you-shouldnt-tell-yourself/).

**I actually think it's true but only to some extent.** In academic examples it's realistic. But in reality, code can't explain itself.

Code just shows a narrow context, not explaining the why.

What if, for example, you'll have **a code snippet written in two different languages at once?**

Not possible? Here are a few random snippets to prove you wrong.

#### 1. Install gpg in the setup script in your project.

You may often see such code in setup scripts of various ruby projects. Inside, you may find *ruby* code, that calls *shell* commands to set up dev environment without effort.

```ruby
  if system("gpg --version")
    puts "gnupg already installed"
  else
    puts "Installing gpg via brew ..."
    system("brew install gnupg")
  end
```

I know shell *and* ruby - and you probably know shell basics too, so no problem here. We all got used to stuff like that, so maybe let's go to the next snippet.

#### 2. Call LUA script in ruby Redis, to make the method ththread-safe.

Here is the other example.

```ruby
key_id = "my_sample_key"
version = 1

redis.eval(
  %(
    if redis.call("get",KEYS[1]) == ARGV[1]
    then
        return redis.call("del",KEYS[1])
    else
        return 0
    end
  ), keys: [key_id], argv: [version]
)
```

This is a snippet taken from [official Redis documentation](https://redis.io/topics/distlock), to ensure **thread-safe lock mechanism key removal**. A bit more advanced scenario, and **here ruby code of the Redis Client calls the LUA script** to make things work well!!!

But it's readable. Simple code, no logic, **you may say: self-explanatory** - but I can't already. I'd think quite a bit while staring at this snippet to figure out what it does if I'd see it without any kind of context provided.

#### 3. Call a custom SQL in Ruby

**The next snippet is so popular in ruby applications, that I often forget that it touches the same problem,** of mixing two languages together.

```ruby
User.
  joins('left outer join tasks on tasks.user_id = users.user_id').
  where(tasks: { id: nil })
```

Here, the ruby script generates raw SQL and passes it to the Postgres adapter, to perform left outer join instead of inner join. I borrowed this one from the Talk about [Convenience vs Simplicity Peter Solnica gave in 2014 at RedDotRuby conf](https://youtu.be/cCD7QJB4HHs) which I recommend checking out.

Are you convinced already? If not, let's check one more example!

#### 4. Generate Javascript Code for EventStore Projections in Ruby Client

The last snippet of this mix I want to show now, I [implemented in ruby event store client](https://github.com/yousty/event_store_client/blob/1d1b1e6f92ed66ad7777dc96c1d3c86575caba2f/lib/event_store_client/adapters/http/commands/projections/create.rb) not so long ago, to allow for **generating server-side projections, that are written in Javascript**!

```ruby
# frozen_string_literal: true

module EventStoreClient
  module HTTP
    module Commands
      module Projections
        class Create < Command
          def call(name, streams, options: {})
            data =
              <<~STRING
                fromStreams(#{streams})
                .when({
                  $any: function(s,e) {
                    linkTo("#{name}", e)
                  }
                })
              STRING


            res = connection.call(
              :post,
              "/projections/continuous?name=#{name}&type=js&enabled=yes&emit=true&trackemittedstreams=true", # rubocop:disable Metrics/LineLength
              body: data,
              headers: {}
            )

            (200...300).cover?(res.status) ? Success() : Failure(res)
          end
        end
      end
    end
  end
end
```

*Here I dynamically generate javascript code using ruby class* and send this snippet to the server.

What is unclear here?

- Class is very well named.
- It's a command that creates projection.
- There is only one method, that obviously performs the command.

But when you looks at it, you probably are like: "What the hell is happening here?"

And I totally agree.

Keep in mind though, that **all those examples above, are very simple.** Extremely simple, if you wish, and you can still understand what is happening, even if you only work with ruby.

But it's totally possible, you'll encounter more complicated examples in your projects that mix several languages together.

### But diffs... blames...

Ok, you may say then that **the git history is enough**. Code editors give you a live browsing ability of who changed what and when, so it is easy to get a context, no?

![Git lens popup in visual studio code](/images/episodes/17/git-commit-details-editor-popup.png)

Is it? In my opinion, often it is, but often it's also not enough.

In real life, you may have a file added in one pr, **but then you just run a linter on it after a few months, and each line changes**! You had lost your context.

Again, having comments here and there that are more static, can really improve the overall clarity of your codebase.

## Tips for keeping inline docs efficient and useful

So what can we do to make inline documentation useful, not another piece of garbage we add to our code?

### 1. Keep it slim and skinny.

Remember, that **inline docs are an additional thing to maintain**. If you can keep things simple, do it! Document only what is necessary, and when you see it necessary.

For example, do not document syntax norms, [leverage rubocop for checking and autocorrecting this for you](/episodes/23-rubocop-most-frustrating-to-most-loved)!

### 2. Use existing conventions and frameworks.

Make use of existing tools, like YARD, to get a bunch of additional benefits.

### 3. Finally, Don't make it religion.

Do I always add it? The answer is simple: NO. I add it when I have a time, and mood for it, and when there is a reason to do so. **I developed a habit of adding such docs, but I find there is a lot in common to tests I write**.

There is a great resource from Jason Swett about [when not to write tests](https://www.codewithjason.com/not-write-tests/), and I can suggest being pragmatic about inline docs too.

When I would write sth like: `UUIDV4Generator.call`, then I'd definitely not be stressed out about adding an inline doc to anything in it.

## Summary

Inline documentation is a great tool that can bring awesome long-term benefits to your team, and I find it very useful if we keep sanity about it.

:::note Become an awesome subscriber!
If you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/HanamiMastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!
:::

## Thanks

I want to especially thank my recent sponsors,

- **MVP match**
- **Junyang Ng** - for supporting me in a highest personal tier
- **[DNSimple](https://dnsimple.com/opensource)**.

for supporting this project, I really appreciate it!

By helping me with a few dollars per month creating this content, you are helping the open-source developers and maintainers to create amazing software for you!

And remember, if you want to support my work even without money involved, the best you can do is to like, share and comment on my episodes and discussion threads. Help me add value to the Open-Source community!
