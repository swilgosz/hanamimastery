---
id: 42
aliases: ["HMEP042"]
author: "swilgosz"
topics: ['front-matter', 'transformations']
title: "Best way to work with Front Matter in Ruby!"
excerpt: "If you want to work with front_matter in Ruby, you need to know the front_matter_parser gem. Here is everything you need."
videoId: dR08d5buJtQ
published: true
publishedAt: "2023-03-07"
modifiedAt: "2023-03-23"
thumbnail:
  full: /images/episodes/42/cover-full.jpeg
  big: /images/episodes/42/cover-big.jpeg
  small: /images/episodes/42/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1633088821477687297
  mastodon: https://ruby.social/@hanamimastery/109982101779105164
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/11kyq7m/best_way_to_work_with_front_matter_in_ruby_hanam/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/11kyr6i/best_way_to_work_with_front_matter_in_ruby_hanam/
source: https://github.com/hanamimastery/episodes/tree/main/042
---
Hi there!

I have here my Hanami application, which pulls and saves my episodes from the GitHub repository for easy processing and some process automation.

By having a small GitHub integration written, I can fetch any of my episodes, and download its content for easy processing.

If you’re new to this, it’s done during my Hanami Mastery PRO series, so consider joining if you are interested in more advanced Ruby and Hanami topics.

The issue here is, that the content is returned in a raw markdown, and I would love to parse all my front_matter attributes to save in database while treating content separately for further processing.

As I’ve shown for example in [episode #39](https://hanamimastery.com/episodes/39-markdown-to-html), I've prepared several micro content transformations that I would love to automate and send back to the repository by making a new commit automatically.

Parsing this on my own is not a super big deal, but I’m not a fan of reinventing the wheel if somebody already did it before.

Frontmatter

If you're new to web development, the term front matter may be not obvious to you. It’s metadata that's added at the beginning of a file, often a markdown file, to provide information about the content.

Usually, it contains attributes like title, author, publication date, and tags. In Hanami Mastery episodes I leverage this to store a lot of different information about each episode, such as video identifier, episode number, and so on.

As you may see, there is a lot to extract, so let’s check what the Ruby ecosystem can bring us for this.

## Meet front_matter_parser

I found the [front_matter_parser](https://github.com/waiting-for-dev/front_matter_parser) gem as a very neat option to work with Front Matter in Ruby because of a few reasons.


1.  It’s simple and delivers only functionality I need.
2.  It supports multiple input sources, like _markdown_ but also _slim_, _haml_, _liquid_ and more.
3.  It’s written by Hanami contributor, [Marc Busqué](https://waiting-for-dev.github.io/), who proved his reliability as an OSS maintainer on multiple occasions.****

With this gem, you can easily parse front matter from files and use the extracted data in your Ruby applications. Let me show you how I use it.

## How to use front_matter_parser

You’ll need to install gem first or place the installation rule in the `Gemfile`. For this showcase, I’m going to just install it manually.

```ruby
gem install front_matter_parser
```

Please notice, that this gem is self-contained, meaning it has no other dependencies to run. Having that done, let’s check my script.

### Basic parsing

To extract front matter from a file, you'll need to create an instance of the `FrontMatterParser::Parser` class, choose the input format, and then pass in the contents of the file as a string.

```ruby
require 'front_matter_parser'

file_contents = File.read('./sample.md')
parsed = FrontMatterParser::Parser.new(:md).call(file_contents)

parsed.front_matter['title']
parsed.front_matter['excerpt']
parsed.content
```

I can also use the `parse_file` method as a shortcut, and only pass in the file name.

```ruby
parsed = FrontMatterParser::Parser.parse_file('sample.md')
```

The cool thing is, that based on the input file type, it automatically recognizes the proper source syntax, so for the *haml* example, it’ll work out of the box without any additional config required!

```ruby
parsed = FrontMatterParser::Parser.parse_file('sample.haml')
parsed.front_matter['title']
parsed.front_matter['excerpt']
parsed.content
```

### Transformations

However powerful this is, it’s not yet all. You can write your own parsers, to understand the front matter syntax for your input or you can create your own loaders.

Loaders are functions that you can use to customize how the string you read is interpreted by writing your own loaders.

The simple loader would look like this:

```ruby
symbolized = ->(string) { YAML.load(string).transform_keys(&:to_sym) }
```

Then I can pass the loader into my parser, and suddenly all my keys get symbolized.

```ruby
# For a file
FrontMatterParser::Parser.parse_file('sample.md', loader: symbolized)
```

You may think it’s not much, but it plays super nicely with the whole [DRY](https://dry-rb.org) and [Hanami](hanamirb.org) ecosystem, where we can leverage libraries like: *[dry-transformer](https://dry-rb.org/gems/dry-transformer)*, to write really complex transformations. 

You may see more about complex transformations in Ruby in the [Episode 6](/episodes/6-complex-ruby-data-transformations-made-simple), which is one of the more popular I’ve recorded so far.

Summary

_front_matter_parser_ is a lightweight and easy-to-use Ruby gem that makes it trivial to extract front matter from files in your Ruby projects. 

With just a few lines of code, you can extract metadata from your files and use it in your applications. However, following the DRY philosophy of providing simple functionality in a very extendable way, it’s just the go-to if you want to work with markdown or any other type of *front matter* input.

:::note Become an awesome subscriber!
If you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/HanamiMastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!
:::

### Thanks

I want to especially thank my recent sponsors,

- [Maxim Gurin](https://github.com/maximgurin)
- [prowly.com](http://prowly.com/)
- [Akilas Yemane](https://twitter.com/akilasy)

and [all the Hanami Mastery PRO subscribers, for supporting this project, I really appreciate it!

:::important Consider sponsoring?
If you want to support us, check out our [Github sponsors page](https://github.com/sponsors/swilgosz) or join [Hanami Mastery PRO](https://pro.hanamimastery.com/) to gain the access to more learning resources and our private discord server!
:::
