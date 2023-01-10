---
id: 37
aliases: ["HMEP037"]
author: "swilgosz"
topics: ['cli', 'dry-rb']
title: "Advanced CLI tools with Ruby and dry-cli!"
excerpt: "Utility scripts in Ruby can be very powerful, but also very messy. In this episode I showcase dry-cli, to help you maintain advanced ruby CLI progarms."
videoId: IXgdRbBRPDk
publishedAt: "2023-01-10"
modifiedAt: "2023-01-10"
thumbnail:
  full: /images/episodes/37/cover-full.jpeg
  big: /images/episodes/37/cover-big.jpeg
  small: /images/episodes/37/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/XXX
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/XXX
    rails: https://www.reddit.com/r/rails/comments/pjuqct/XXX
    hanamirb: https://www.reddit.com/r/hanamirb/comments/XXX
source: https://github.com/hanamimastery/episodes/tree/main/037
---

Recently I watched an amazing tutorial from *GoRails*, made by *Collin Jilbert*, about [writing simple ruby scripts for console tools](https://gorails.com/episodes/building-utilities-with-ruby-scripts).

It was a great introduction to CLI in Ruby, and it inspired me to write a follow-up on this topic because I also use ruby scripts in my terminal heavily.

In this episode of Hanami Mastery I will go through how to write more advanced scripts to put your workflows to the next level.

## Problem to solve.

In Hanami Mastery, I am writing scripts for my videos using **markdown files**, that are committed to the [GitHub repository](https://github.com/swilgosz/hanamimastery). They are then picked up by the static content generator and parsed to the final version you can see on the web.

However, there are some caveats on the way, that are very tedious to solve manually and a few ruby scripts organized well could help a lot with them.

**I need to do several transformations on markdown files content** in order to work efficiently, and this requires me to work with many commands, passing arguments, and options.

Some of the transformations I need to do in a regular manner are:

1. Touching the episode
2. Removing shot marks
3. Removing images and code blocks
4. HTML generation
5. Changing wiki links to normal links with absolute paths.

Those functions can accept options and arguments, and you can imagine, how quickly it could get very messy in my program's source code to work with many of those.

Moreover, think about how much repeatable code I would need to write every time l come up with a new micro-project!

This is why, for advanced projects, just raw ruby scripts are not enough, and using some smart tools could speed-up your work with command-line scripts by a whole lot.

## The raw Ruby CLI script example.

Let's take a look at a very basic example, starting directly in place when Collin finished, that solves my problem.

At the top of the program, I have 3 reusable files imported.

```ruby
#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative './repositories/episodes.rb'
require_relative './transformations/touch.rb'
require_relative './transformations/unshot.rb'

repository = HanamiMastery::Repositories::Episodes.new
```

First is a repository, that can read and replace the content of the single repository file. The implementation is a detail, but I'll show you it quickly just for reference. You can see here, that it allows you to read, replace, and check if an episode file exists.

Then I have two transformation functions, that accept the file content as an argument and return transformed text as a result.

Each of them does a single, little task on the input. For example, the `Touch` transformation modifies the `modifiedAt` attribute in the episode frontmatter.

It's important to mention, that by default, it sets the current time, but also allows you to pass the timestamp as an option, and override this way the default behavior.

```ruby
module HanamiMastery
  module Transformations
    class Touch
      PATTERN = /^modifiedAt\:[[:space:]]"\d{4}-\d{2}-\d{2}"$/

      # Updates the modifiedAt with the passed date
      #
      def call(content, timestamp: nil)
        timestamp ||= Time.now
        content.gsub(
          PATTERN,
          %(modifiedAt: "#{timestamp.strftime("%Y-%M-%d")}")
        )
      end
    end
  end
end
```

Then the `Unshot` transformation removes the shot marks (i. e.[\🎬 14]) from the whole text.

```ruby
module HanamiMastery
  module Transformations
    class Unshot
      PATTERN = /\[🎬[[:space:]]\d{1,3}\][[:space:]]/

      # removes shot marks from the given string
      #
      def call(content)
        content.gsub(PATTERN, '')
      end
    end
  end
end
```

To work with them in my script, I need to extract the command from the `ARGV` constant, which stores arguments passed from the terminal.

```ruby
command = ARGV.shift
```

Then I can add a little case statement, and write the logic inside.

For each command, I extract the episode ID and read the content using the repository. Then I call the proper transformation and update the given episode with the new content.

```ruby
case command
when 'unshot'
  id = ARGV.shift
  content = repository.read(id)
  cmd = HanamiMastery::Transformations::Unshot.new
  processed = cmd.call(content)
  repository.replace(id, processed)
when 'touch'
  id = ARGV.shift
  content = repository.read(id)
  cmd = HanamiMastery::Transformations::Touch.new
  processed = cmd.call(content, timestamp: Time.now)
  repository.replace(id, processed)
else
  puts 'Unsupported command.'
end

```

There is a code duplication here, but I want to have the logic separated for each command, as I'll have also some commands that are applied to all episodes and don't require this `id` argument.

This is a minimal, working ruby CLI script that supports my workflow. But there are some problems with it.

### Problems with raw ruby scripts

You can see, that the only lines that are different here, are those calling the transformation. But it's worth mentioning, that one transformation accepts an argument and an option, while the other, doesn't.

I'll add a debugger here to check the content of the `ARGV`, and call my script with the options passed, to show you what we get as input.

```ruby
irb(main):001:0> ARGV
=> ["37", "--timestamp=2022-12-10"]
irb(main):002:0> command
=> "touch"
irb(main):003:0>
```

The `timestamp` option needs to be parsed and extracted **before we can work with it**. Also, for the `unshot` command, we don't even need this, so it would be nice to add some helpful information, to quickly list what options and arguments are accepted by each command!

How could we improve on this?

### Meet the OptionParser

Ruby has a built-in solution for parsing options passed to your script, named `optionparser`. Let me show you how it works.

First let me require the library, and define a hash of options that my program accepts.
```ruby
require 'optionparser'

options = {
  timestamp: Time.now
}
```

Then I can initialize the options parser that will recognize all the supported options and update my options hash values accordingly.

Here I can also easily add some `help` information, for general usage, so it'll be clear how to use my script.

```ruby
opt_parser = OptionParser.new do |opts|
  opts.on('--timestamp=TIMESTAMP') do |timestamp|
    options[:timestamp] = timestamp
  end

  opts.on('-h', '--help', 'Prints this help') do
    puts <<~STRING
      Usage: #{__FILE__} command [options]
      Available commands: #{SUPPORTED_COMMANDS}
      STRING
    exit
  end
end
```

Then I need to call the `parse!` method on my parser, which will do the processing.
```ruby
opt_parser.parse! # cleans ARGV from options args
```

This little trick allows me to call my script with things like `-h`, or aliased with `--help` to list program instructions.

```ruby
./hanami_mastery_optparse.rb -h
#=> Usage: ./hanami_mastery_optparse.rb command [options]
#=> Available commands: ["touch,", "unshot"]
```

I can also call my script with a `timestamp`, passing the value to it, and it'll be taken into consideration during processing.

### Managing a lot of commands.

The *optionparser* library is a great improvement already, allowing me to define options for each supported command, but still, If I would want to provide a different set of help for each supported command, different options to be supported, and so on, my program could easily get messy very quickly.

We can do even better though.

## DRY-CLI for help

Whenever I work with a ruby command line, I do it using dry-cli. It's a neat small library that helps us to write advanced utility scripts quickly and with minimal effort.

Let's solve our problem with dry-cli.

First I'll remove all my `optparser` code, and add the command registry.

```ruby
require "bundler/setup"
require "dry/cli"

module HanamiMastery
  module CLI
    extend Dry::CLI::Registry

    register 'unshot', Unshot
    register 'touch', Touch
  end
end

Dry::CLI.new(HanamiMastery::CLI).call
```

This will register my commands that I'm going to define in a moment and then call the `dry-cli` engine, providing the general functionality.

At this form, my script will crash, because I don't have my commands defined yet. Let me fix it quickly.

### Touching the file

First I need to define the `Touch` command, which will call my content transformation and update the file using the repository. It contains more or less the code I had in my case statement but was tweaked to be more elegant.

```ruby
module HanamiMastery
  module CLI
    class Touch < Dry::CLI::Command
      attr_reader :transformation, :repository
      def initialize
        @repository = Repositories::Episodes.new
        @transformation = Transformations::Touch.new
      end

      def call(episode:, timestamp:, **)
        timestamp = Time.parse(timestamp)
        content = repository.read(episode)
        processed = transformation.call(content, timestamp: timestamp)
        repository.replace(episode, processed)
      end
    end
  end
end
```

When I have it, I can leverage the `dry-cli` DSL to add some command-specific information at the top, like what this command does, or which arguments and options it accepts.

```ruby
module HanamiMastery
  module CLI
    class Touch < Dry::CLI::Command
      desc 'Updates the modifiedAt with the current date'
      argument :episode, type: :integer, required: true, desc: "Episodes ID to touch"
      option :timestamp, type: :string, desc: "Graceful stop"

      # ...
    end
  end
end
```

### Removing shot marks

Now let me do the same for the `unshot` command.
To save some time, I'll just copy the prepared scaffold code

```ruby
module HanamiMastery
  module CLI
    class Unshot < Dry::CLI::Command
      desc 'Removes shot marks from a given article (i.e. """)'

      argument :episode, type: :integer, required: true, desc: "Episodes ID to unshot"

      def initialize
        @repository = HanamiMastery::Repositories::Episodes.new
        @transformation = Transformations::Unshot.new
      end

      attr_reader :transformation, :repository

      def call(episode:, **)
        content = repository.read(episode)
        processed = transformation.call(content, one: false)
        repository.replace(episode, processed)
      end
    end
  end
end
```

Let's try to run this script now to check what happens!

```shell
➜  038 git:(main) ✗ ./hanami_mastery.rb
Commands:
  hanami_mastery.rb touch EPISODE                   # Updates the modifiedAt with the current date
  hanami_mastery.rb unshot EPISODE                  # Removes shot marks from a given article ```

We can list all registered commands, with corresponding descriptions right away, without any additional configuration needed.

But also, we can list a detailed help for any particular command too!

```shell
➜  038 git:(main) ✗ ./hanami_mastery.rb touch -h
Command:
  hanami_mastery.rb touch

Usage:
  hanami_mastery.rb touch EPISODE

Description:
  Updates the modifiedAt with the current date

Arguments:
  EPISODE                           # REQUIRED Episodes ID to touch

Options:
  --timestamp=VALUE                 # Graceful stop, default: 2023-01-02 19:10:53.65874 +0100
  --help, -h                        # Print this help
```

Look how little I did to make this working! It's just defining a command class, and then registering it in the registry, and all the tedious work to list information or manage input arguments is done for me!

### Aliases & Nested commands

*dry-cli* makes utility script creation a very enjoyable process. As you may expect, I've only shown you the very basic application for this, but you can maintain very complicated scripts without an effort.

For example, let's say, I want my commands related to episode modification become subcommands of the wider set of actions.

The only thing I need to do for this, would be wrapping them with a parent during registration. Here I'm going to change my commands call to

```ruby
register "modify", aliases: ["m"] do |prefix|
  prefix.register "unshot", Unshot
  prefix.register "touch", Touch
end
```

Now this is what I'll see in my terminal:

```shell
➜  038 git:(main) ✗ ./hanami_mastery.rb -h
Commands:
  hanami_mastery.rb modify [SUBCOMMAND]
➜  038 git:(main) ✗ ./hanami_mastery.rb m -h
Commands:
  hanami_mastery.rb m touch EPISODE                    # Updates the modifiedAt with the current date
  hanami_mastery.rb m unshot EPISODE                   # Removes shot marks from a given article 
```

If this is not cool, I don't know what is.

## Summary

*dry-cli* is one more great ruby gem from the DRY ecosystem that makes my life way easier, and I am very grateful for that.

It recalls me about [dry-inflector](/episodes/4-string-transformations-with-dry-inflector) and [dry-configurable](/episodes/5-configure-anything-with-dry-configurable) because each of those gems positively affects single area of my coding activity while not doing anything else.

I love how *dry-cli* allows me to manage scripts that grow over time and despite not using it as much, it is definitely on my list of favourite ruby tools.

### Other Hanami Mastery commands

If you are curious how I have solved other commands, you can check the HanamiMastery CLI repository, where I store them all.

However, instead of this, **maybe you could think about something useful for your workflows?**

### Try dry-cli

I encourage you to think about one task you need to manually do every single day or week that could be resolved with ruby scripts  And then, let me know what you have improved!

I seek for more inspiration!

However, that's all I have for you today.

I hope you've enjoyed this episode, and if you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/hanamimastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!

### Thanks

I want to especially thank my recent sponsors,

-   [prowly.com](http://prowly.com)
-   [Akilas Yemane](https://twitter.com/akilasy)
-   [Bill Tihen](https://github.com/btihen)

and [all the Hanami Mastery PRO subscirbers](https://pro.hanamimastery.com), for supporting this project, I really appreciate it!

:::important Consider sponsoring?
If you want to support us, check out our [Github sponsors page](https://github.com/sponsors/swilgosz) or join [Hanami Mastery PRO](https://pro.hanamimastery.com/) to gain the access to more learning resources and our private discord server!
:::
