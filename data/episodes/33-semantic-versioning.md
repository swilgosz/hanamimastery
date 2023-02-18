---
id: 33
aliases: ["HMEP033"]
author: "fiachetti"
topics: ['gems']
title: "Deep dive into semantic versioning in Ruby"
excerpt: "Semantic versioning is a useful approach to version your projects or gems - and that will be necessary at some point if you seriously think about ruby career."
videoId: txa616T0VGQ
published: true
publishedAt: "2022-11-15"
modifiedAt: "2022-11-15"
thumbnail:
  full: /images/episodes/33/cover-full.jpeg
  big: /images/episodes/33/cover-big.jpeg
  small: /images/episodes/33/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1592480321324584960
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/yvun6y/deep_dive_into_semantic_versioning_in_ruby/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/yvunis/deep_dive_into_semantic_versioning_in_ruby/
source: https://github.com/hanamimastery/episodes/tree/main/033
---
If you seriously think about Ruby career, at [some point you’ll need to maintain a gem](/episodes/12-authorization-with-jwt). And I don’t even talk about open source contributions, which I totally recommend. But to maintain a gem, or a project, there is a chance you’ll want to easily decide, what version of software people would like to use.

In this episode, I’m going to show you a few tips by examples.

## Writing the gem

We want to write a very cool gem: a "geek detector"

We start by running the gem generator that `bundler` gives us.

```bash
$ bundler gem geek_detector
```

Then we fill in our gem's gemspec.

```ruby
require_relative "lib/geek_detector/version"

Gem::Specification.new do |spec|
  spec.name = "geek_detector"
  spec.version = GeekDetector::VERSION
  spec.authors = ["Federico Iachetti"]
  spec.email = ["iachetti.federico@gmail.com"]

  spec.summary = "Find geeks easily."
  spec.description = "Find all the geeks. This gem is for HanamiMastery usage"
  spec.homepage = "<https://geek-detector.example.com>"
  spec.license = "MIT"
  spec.required_ruby_version = ">= 2.6.0"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "<http://github.com/404>"
  spec.metadata["changelog_uri"] = "<http://github.com/404>"

  spec.bindir = "exe"
  spec.executables = spec.files.grep(%r{\\\\\\\\Aexe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]
end
```

And we write the main functionality of our gem.

We'll create a `module_function`,which will allow to call methods on our `GeekDetector` module either directly on it or by including it into a class.

Finally, we write the `geek?` methodthat will match our input to a regular expressionand return a boolean depending on the result of that operation.

```ruby
require_relative "geek_detector/version"

module GeekDetector
  module_function

  def geek?(input)
    !!(input =~ /geek/)
  end
end
```

It can detect a geek inside either a string or a symbol.

And can detect that there's no geek in sight.

```ruby
GeekDetector.geek?("I'm a geek")     # => true
GeekDetector.geek?(:i_am_a_geek)     # => true
GeekDetector.geek?("I'm not")        # => false
```

You tried it a bunch and you think it might be ready to see the light of day and be used by everyone in the world, YAY!

## Versioning the Gem

Now is the time to put a version number to it. What should we write? 1.0? 0.1? 0.0.1? what does that even mean?

When I need to version my gems, I like to use **[Semantic versioning](https://semver.org/)**.

**Semantic versioning** is a set of rules and requirements that dictate how version numbers should be constructed.

Lets open the `version.rb` file.

Using _Semantic versioning_, a _version_ is made out of three main parts separated by dots: the **MAJOR**,**MINOR**and **PATCH** numbers

```ruby
module GeekDetector
  VERSION = "MAJOR.MINOR.PATCH"
end
```

Each of this parts have a purpose and a reason to change.

Let's start by talking about the first version we'll add to your gem. You always need to have all three parts of the version (**MAJOR**, **MINOR** and **PATCH**), and It's not a good practice to start everything with zero. So our options are limited to either **0.0.1**and **1.0.0**.

```ruby
module GeekDetector
  VERSION = "0.0.1"
  VERSION = "1.0.0"
end
```

Which one would I choose? I'm a developer, so my response to this is obviously _it depends_.

By convention, anything previous to **1.0.0** is considered not yet stable so, if you're just putting this out for the world to try it out, I'd advise to use **0.0.1**. But if you're confident it's ready for production, **1.0.0** will be a better choice.

The definition of **stable** is up to each developer. In my case, I consider something is **stable** when I've tried it enough that I like how it's used. In other words, when I expect there will be no significant changes to it's API.

For this example we'll go with **0.0.1**,because we just tried it in isolation and we want to make sure it's stable.

```ruby
module GeekDetector
  VERSION = "0.0.1"
end
```

### First feedback, fix a bug

After a few days, we get feedback of people that say that our geek detector is not working properly. They say it can't find a geek in the "I'm a GEEK" string.

```ruby
GeekDetector.geek?("I'm A GEEK")     # => false
```

And here's our problem,the regular expression is case-sensitive, which we don't want.

```ruby
def geek?(input)
  !!(input =~ /geek/)
end
```

But we can fix it with a small tweak.

```ruby
def geek?(input)
  !!(input =~ /geek/i)
end
```

And when we try it again, it now works

```ruby
GeekDetector.geek?("I'M A GEEK")     # => true
```

Now that we made a change, we need to update the version number.Since all we did was fix a bug, keeping the code backwards-compatible, we need to update the **PATCH** number.

Or, in other words, the **PATCH** number only changes when we fix bugs in a backwards-compatible way. We just increase it by one.

```ruby
module GeekDetector
  VERSION = "0.0.2"
end
```

Something to note is that once we reach the number 9(in any of the parts), we don't carry over to the next one, but just increase it to 10.

```ruby
module GeekDetector
  - VERSION = "0.0.9"
  + VERSION = "0.0.10"
end
```



### Second feedback, implementing a feature

Having fixed this bug, we catch another piece of feedback.

Our geek detector was so useful that more and more people are using it, but they're asking for our library to also detect nerds.

```ruby
GeekDetector.geek?("I'M A nerd")     # => false
```

Again, this is easy enough.

```ruby
def geek?(input)
  !!(input =~ /(geek)|(nerd)/i)
end
```

Which gives us the expected result.

```ruby
GeekDetector.geek?("I'M A nerd")     # => true
```

Our code is still backwards compatible, but we didn't fix a bug. This time we added a new feature. So in this case, the part to increment is the middle one, the **MINOR** version,resetting the **PATCH** version to zero.

```ruby
module GeekDetector
  VERSION = "0.1.0"
end
```

### Going Live!

Now, say our library has been out for quite some time and we haven't had any more bugs nor features reported. So we can decide to bump our major version to **1.0.0**,since we consider our gem is now stable and ready for production.

So this is one reason the major version might change: being ready!

```ruby
module GeekDetector
  VERSION = "1.0.0"
end
```

So far, while on version previous to **1.0.0** we didn't care about our major version, it was always kept at zero. Even though it didn't happen, if we'd broken backwards compatibility, we wouldn't change the major version, because, we considered the project in a non-stable state.

But for now on, we'll need to keep an eye on our compatibility, since it can break other people's code (previous to 1 this was not as bad a concern because having the major version at 0, unstability is implied).

### Breaking backwards compatibility

But say we decide that we don't want to maintain symbols anymore, it doesn't make sense to allow the user to receive anything other than strings in our method. Maybe they cause problems down the line.

So we solve this by raising an error if our parameter is not a string.

```ruby
def geek?(input)
  raise unless input.is_a?(String)
  !!(input =~ /(geek)|(nerd)/i)
end
```

And we can see it in action.

```ruby
GeekDetector.geek?("I'm a geek")     # => true
GeekDetector.geek?("I'm not")        # => false
GeekDetector.geek?("I'm A GEEK")     # => true
GeekDetector.geek?("I'm A nerd")     # => true

GeekDetector.geek?(:i_am_a_geek)     # => RuntimeError:

# ~> RuntimeError
# ~>
# ~> /sandbox/geek_detector/lib/geek_detector.rb:9:in `geek?'
# ~> xmptmp-inhcmbgO.rb:8:in `<main>'
```

Now we've broken our backwards-compatibility. Now is the time for **2.0.0**.

We only change major versions if we've broken our backwards compatibility.

```ruby
module GeekDetector
  VERSION = "2.0.0"
end
```

## Using bump to update the version

If you don't like updating versions by hand, here's an option for you. The [bump](https://github.com/gregorym/bump)gem can help us update either part of our gem's version automatically, without any fuzz.

Let's start by installing it

```bash
$ gem install bump
Fetching bump-0.10.0.gem
Successfully installed bump-0.10.0
1 gem installed
```

If we run `bump current`,we're shown the current gem version.This doesn't produce any change, it just displays the version.

```bash
$ bump current
2.0.0
```

We can also find in which file the version is being set by running `bump file`.

```bash
$ bump file
lib/geek_detector/version.rb
```

And we can display what'd be the next versions, either for the **PATCH**,**MINOR**or **MAJOR**versions.

```bash
$ bump show-next patch
Resolving dependencies...
2.0.1
$ bump show-next minor
Resolving dependencies...
2.1.0
$ bump show-next major
Resolving dependencies...
3.0.0
```

Now, lets do something more interesting.

Lets upgrade to the the next patch version

```bash
$ bump patch
Resolving dependencies...
Fetching gem metadata from <http://localhost:9898/>.
Resolving dependencies...
Using rake 13.0.6
Using bundler 2.3.19
Using diff-lcs 1.5.0
Using rspec-support 3.11.1
Using geek_detector 2.0.1 (was 0.1.0) from source at `.`
Using rspec-core 3.11.0
Using rspec-expectations 3.11.1
Using rspec-mocks 3.11.1
Using rspec 3.11.0
Bundle complete! 3 Gemfile dependencies, 9 gems now installed.
Use `bundle info [gemname]` to see where a bundled gem is installed.
[main c53f142] v2.0.1
 2 files changed, 2 insertions(+), 2 deletions(-)
2.0.1
```

We can now see that the current version is 2.0.1

```bash
$ bump current
2.0.1
```

And that a commit was made. This was all done automatically, without any "direct" intervension from us.

```bash
$ git log

* c53f142 - (HEAD -> main) v2.0.1 (45 seconds ago) <Federico Iachetti>
* 4dc1187 - Version 2.0.0 (3 minutes ago) <Federico Iachetti>
* 16fa068 - Version 1.0.0 (5 minutes ago) <Federico Iachetti>
* 19dc1df - Version 0.1.0 (5 minutes ago) <Federico Iachetti>
* f01a6d9 - Version 0.0.2 (6 minutes ago) <Federico Iachetti>
* 5fa02c9 - Added example for upper case (6 minutes ago) <Federico Iachetti>
* 645c3a3 - Version 0.0.1 (7 minutes ago) <Federico Iachetti>
* ccca2ef - Initial commit (7 minutes ago) <Federico Iachetti
```

We can do the same for **MINOR** and **MAJOR** versions.

But lets say we want to bump the **MINOR** versionwithout actually making a commit. We can do it using the `--no-commit` flag.

```bash
$ bump minor --no-commit
Fetching gem metadata from <http://localhost:9898/>.
Resolving dependencies...
Using rake 13.0.6
Using bundler 2.3.19
Using diff-lcs 1.5.0
Using rspec-support 3.11.1
Using geek_detector 2.1.0 (was 2.0.1) from source at `.`
Using rspec-core 3.11.0
Using rspec-expectations 3.11.1
Using rspec-mocks 3.11.1
Using rspec 3.11.0
Bundle complete! 3 Gemfile dependencies, 9 gems now installed.
Use `bundle info [gemname]` to see where a bundled gem is installed.
2.1.0

```

If we show the git status,we can see that the `version.rb` and `Gemfile.lock`files have been changed, but not commited.

```bash
$ git status
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   Gemfile.lock
        modified:   lib/geek_detector/version.rb

no changes added to commit (use "git add" and/or "git commit -a")
```

Lets take a peek at the `version` file

```ruby
module GeekDetector
  VERSION = "2.1.0"
end
```

Now we can rework our code and commit by hand when we're ready.

```bash
$ git add -A
$ git commit -m "Releasing version 2.1.0"
[main 33f1fc3] Releasing version 2.1.0
 2 files changed, 2 insertions(+), 2 deletions(-)
```

We can also add a tag along with the commit

```bash
$ bump major --tag
Fetching gem metadata from <http://localhost:9898/>.
Resolving dependencies...
Using rake 13.0.6
Using bundler 2.3.19
Using diff-lcs 1.5.0
Using geek_detector 3.0.0 (was 2.1.0) from source at `.`
Using rspec-support 3.11.1
Using rspec-core 3.11.0
Using rspec-expectations 3.11.1
Using rspec-mocks 3.11.1
Using rspec 3.11.0
Bundle complete! 3 Gemfile dependencies, 9 gems now installed.
Use `bundle info [gemname]` to see where a bundled gem is installed.
[main 3571c3e] v3.0.0
 2 files changed, 2 insertions(+), 2 deletions(-)
3.0.0
```

Which we can corroborate by running `git log`

```bash
$ git log

* 3571c3e - (HEAD -> main, tag: v3.0.0) v3.0.0 (54 seconds ago) <Federico Iachetti>
* 33f1fc3 - Releasing version 2.1.0 (2 minutes ago) <Federico Iachetti>
* c53f142 - v2.0.1 (9 minutes ago) <Federico Iachetti>
* 4dc1187 - Version 2.0.0 (11 minutes ago) <Federico Iachetti>
* 16fa068 - Version 1.0.0 (13 minutes ago) <Federico Iachetti>
* 19dc1df - Version 0.1.0 (13 minutes ago) <Federico Iachetti>
* f01a6d9 - Version 0.0.2 (14 minutes ago) <Federico Iachetti>
* 5fa02c9 - Added example for upper case (14 minutes ago) <Federico Iachetti>
* 645c3a3 - Version 0.0.1 (15 minutes ago) <Federico Iachetti>
* ccca2ef - Initial commit (15 minutes ago) <Federico Iachetti>
```

Lastly, say we wrote the version somewhere on the repository, the `README` for example.

```markdown
# Version

We're currently on version 3.0.0
```

We can update this number every time we bump,by using the `--replace-in` flagand telling `bump` the file where it has to look for it.

```bash
$ bump patch --replace-in README.md
Fetching gem metadata from <http://localhost:9898/>.
Resolving dependencies...
Using rake 13.0.6
Using bundler 2.3.19
Using diff-lcs 1.5.0
Using geek_detector 3.0.1 (was 3.0.0) from source at `.`
Using rspec-support 3.11.1
Using rspec-expectations 3.11.1
Using rspec-mocks 3.11.1
Using rspec-core 3.11.0
Using rspec 3.11.0
Bundle complete! 3 Gemfile dependencies, 9 gems now installed.
Use `bundle info [gemname]` to see where a bundled gem is installed.
[main e2be473] v3.0.1
 3 files changed, 4 insertions(+), 6 deletions(-)
3.0.1
```

Now, if we look at the README, it was properly updated

```markdown
# Version

We're currently on version 3.0.1
```

## Summary

Following the semantic versioning in a gem or project is a nice skill to have. It’s helpful not only to track the progress of the project, identify bugs or manage versions, but also it’s a clean message to our users. They feel more safe during upgrades, and by knowing what they could expect, the can plan upgrading their systems accordingly.

Let me know in the comments if you follow the semantic versioning in your projects, or if you have other versioning system worth of mentioning!

## Thanks

I want to especially thank my recent sponsors,

-   [Akilas Yemane](https://twitter.com/akilasy)
-   [Bill Tihen](https://github.com/btihen)
-   [Benjamin Klotz](https://github.com/tak1n)

for supporting this project, I really appreciate it!

Also shot-out for [Roman Synkevych](https://unsplash.com/@synkevych) for the great cover image!

If you want to support us, check out our [Github sponsors page](https://github.com/sponsors/swilgosz) or join [Hanami Mastery PRO](https://pro.hanamimastery.com)!
