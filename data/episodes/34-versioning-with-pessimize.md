---
id: 34
aliases: ["HMEP034"]
author: "fiachetti"
topics: ['gems']
title: "Safe gem upgrades with pessimize gem"
excerpt: "Upgrading gems in the bigger project can become a hustle if you don't use tools like pessimize to help you deal with them safely."
videoId: vGWrAE6WgXQ
publishedAt: "2022-11-29"
modifiedAt: "2022-12-24"
thumbnail:
  full: /images/episodes/34/cover-full.jpeg
  big: /images/episodes/34/cover-big.jpeg
  small: /images/episodes/34/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1597520265394548738
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/z7owow/safe_gem_upgrades_with_pessimize_gem/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/z7oxlf/safe_gem_upgrades_with_pessimize_gem_hanami/
source: https://github.com/hanamimastery/episodes/tree/main/034
---
Working on a Ruby application implies, sooner or later, dealing with a `Gemfile`, gem versions and gem dependencies. This usually isn't a problem when we first create our project but, as time progresses and gems get mantained, working with multiple libraries becomes a hustle.

Most gems out there are versioned using **Semantic versioning**, which helps us know when they're safe to be upgraded. But that's just one part of the equation. We also need to deal with actually deciding _what_ to update, _when_ and _how_. Lets see what I mean by this with an example.

Say we have a project that uses the **[money](https://github.com/RubyMoney/money)** gem, as specified in the `Gemfile`.

```ruby
source "<https://rubygems.org>"

gem "money"

```

If we look at the `Gemfile.lock` file, we can assert that the version that's currently being used in the project is 3.0.1.

```ruby
GEM
  remote: <https://rubygems.org/>
  specs:
    money (3.0.1)

```

This doesn't mean that `3.0.1` is the newest available version though. If we run `bundle update`, we can see that the version for the `money` gem gets updated to `6.16.0`, which actually is the latest one when recording this episode.

```shell
$ bundle update
Fetching gem metadata from <http://localhost:9898/>....
Resolving dependencies...
Using bundler 2.3.19
Using concurrent-ruby 1.1.10
Using i18n 1.12.0
Fetching money 6.16.0 (was 3.0.1)
Installing money 6.16.0 (was 3.0.1)
Bundle updated!
```

This update has now been reflected in the `Gemfile.lock` file, along with the inclusion of some external dependencies, which won't affect the flow of this episode, but it's worth noting.

```ruby
GEM
  remote: <https://rubygems.org/>
  specs:
    concurrent-ruby (1.1.10)
    i18n (1.12.0)
      concurrent-ruby (~> 1.0)
    money (6.16.0)
      i18n (>= 0.6.4, <= 2)

```

This gem update is an unwanted effect. As we saw in [episode 033](/episodes/33-semantic-versioning), a change in the **MAJOR** version of a file signifies that there are breaking changes on that gem. This means that we might have potentially introduced bugs in our system. This is not necessarily true though; it'll depend on the features that changed and the ones that are in use in our code. With that caveat, we should still be very careful when changing a **MAJOR** version.

## Versioning on the Gemfile instead of relying on the Gemfile.lock

The best way to avoid this side effect, is to add the version we desire directly on the `Gemfile`. We can do this by adding the version as the second string argument to the dependencies `gem` method call.

```ruby
source "<https://rubygems.org>"

gem "money", "3.0.1"
```

By doing this, we make sure to use the exact version we told Bundler to use, in our case, 3.0.1. And it won't change either using `bundle install` or `bundle update`, which makes it a safer option.

```shell
$ bundle update
```

## Exact versus pessimistic versioning

But there's another option that's still safe: using **Pessimistic Versioning**. This means allowing the gem to be updated using `bundle update` but just up to some extent.

For example, we can set our `Gemfile` to update the `money` gem without updating the major version, just minor and patch.

We do this using the **pessimistic operator** and introducing just the major and minor versions.

```ruby
source "<https://rubygems.org>"

gem "money", "~> 3.0"
```

And now if we run `bundle update`, it updates to version 3.7.1

```shell
$ bundle update
Fetching gem metadata from <http://localhost:9898/>....
Resolving dependencies...
Using bundler 2.3.19
Using concurrent-ruby 1.1.10
Fetching i18n 0.9.5
Installing i18n 0.9.5
Fetching money 3.7.1 (was 3.0.1)
Installing money 3.7.1 (was 3.0.1)
Bundle updated!
```

If instead of just **MAJOR** and **MINOR** we add the **PATCH** version as well, the **pessimistic operator** will allow the gem to be updated without changing the minor or major versions.

```ruby
source "<https://rubygems.org>"

gem "money", "~> 3.0.1"
```

As we can see, if we run `bundle update`, the new version installed is `3.0.5`.

```shell
$ bundle update
Fetching gem metadata from <http://localhost:9898/>....
Resolving dependencies...
Using bundler 2.3.19
Fetching money 3.0.5 (was 3.0.1)
Installing money 3.0.5 (was 3.0.1)
Bundle updated!
```

Which is greater than `3.0.1`, but the **MINOR** and **MAJOR** versions are kept at their current value. It's also worth noting that `3.0.5` is the greatest found version that has the same **MAJOR** and **MINOR** versions. Or, saying this a different way, 3.0.5 was the greatest possible **PATCH** version.

## Pessimize to patch and not to minor or major

How pessimistic we are in our `Gemfile` is a decision that's up to each one of us.

According to **[Semantic versioning](https://semver.org/)**, allowing the **MINOR** version to change shouldn't be a problem for us, since it means that features have been added to the dependency, but no breaking changes.

```ruby
source "<https://rubygems.org>"

gem "money", "~> 3.0"
```

I usually pessimize up to the **PATCH** version, meaning that I'll allow the **PATCH** version to be updated by `bundle update`, but anything above that, I update manually. This is not absolutely necessary, but it brings me peace of mind.

```ruby
source "<https://rubygems.org>"

gem "money", "~> 3.0.1"
```

## Using pessimize

So far we've been dealing with a project that has one gem dependency ... a very rare occurrence if you ask me.

```ruby
source "<https://rubygems.org>"

gem "money", "~> 3.0.1"
```

But what happens when we have a `Gemfile` with several gems, like this one? Do we have to set the pessimistic version of choice for each individual gem? This seams like a nightmare to deal with.

```ruby
source "<https://rubygems.org>"

gem "puma"
gem "roda"
gem "awesome_print"
gem "pg"
gem "redis"
gem "money"
gem "shrine"
gem "cloudinary"
gem "shrine-cloudinary"
gem "faker"
gem "dry-struct"
gem "dry-validation"
gem "dry-schema"
```

For these kind of situations was created the [Pessimize](https://github.com/joonty/pessimize) gem.

**Pessimize** allows us to automatically add version numbers to all the gems in our `Gemfile` using the _Pessimistic Version Operator_.

Let's start by installing the gem.

```ruby
$ gem install pessimize
Fetching pessimize-0.4.0.gem
Successfully installed pessimize-0.4.0
1 gem installed
```

Now that we have it in our system, we can run the `pessimize` command.

We can ignore the _trollop_ deprecation warning that's shown on the terminal.

```shell
$ pessimize
[DEPRECATION] The trollop gem has been renamed to optimist and will no longer be supported. Please switch to optimist as soon as possible.
Backing up Gemfile and Gemfile.lock
 + cp Gemfile Gemfile.backup
 + cp Gemfile.lock Gemfile.lock.backup

~> written 20 gems to Gemfile, constrained to minor version updates
```

This command will pick up the version numbers from the `Gemfile.lock`file and add them as the second argument to the `gem`method of each line in the `Gemfile` using the pessimistic operator (hence it's name).

```ruby
source "<https://rubygems.org>"

gem "puma", "~> 5.6"
gem "roda", "~> 3.61"
gem "awesome_print", "~> 1.9"
gem "pg", "~> 1.4"
gem "redis", "~> 5.0"
gem "money", "~> 3.0"
gem "shrine", "~> 3.4"
gem "cloudinary", "~> 1.23"
gem "shrine-cloudinary", "~> 1.1"
gem "faker", "~> 2.23"
gem "dry-struct", "~> 1.4"
gem "dry-validation", "~> 1.8"
gem "dry-schema", "~> 1.10"
```

By default, it'll pessimize up to the **MINOR** version, but this can be configured when running the command.

If we pass it the `-c` flag, we can specify which segment to pessimize to.

For example, if we want to pessimize up to the **PATCH** version, which is my preferred option, we can run `pessimize -c patch`

```shell
$ pessimize -c patch
```

Now we have the patch versions pessimized in our `Gemfile`.

```ruby
source "<https://rubygems.org>"

gem "puma", "~> 5.6.5"
gem "roda", "~> 3.61.0"
gem "awesome_print", "~> 1.9.2"
gem "pg", "~> 1.4.4"
gem "redis", "~> 5.0.5"
gem "money", "~> 3.0.5"
gem "shrine", "~> 3.4.0"
gem "cloudinary", "~> 1.23.0"
gem "shrine-cloudinary", "~> 1.1.1"
gem "faker", "~> 2.23.0"
gem "dry-struct", "~> 1.4.0"
gem "dry-validation", "~> 1.8.1"
gem "dry-schema", "~> 1.10.6"
```

## Backup files

One ugly side effect of using **pessimize** like this is that it leaves behind some waste. Specifically two backup files. One for the `Gemfile` and one for the `Gemfile.lock`.

```shell
$ ls
Gemfile  Gemfile.backup  Gemfile.lock  Gemfile.lock.backup
```

But since we use version control, these files are not needed.

We can remove them by hand after each use call to the `pessimize` command.

```shell
$ rm Gemfile.backup Gemfile.lock.backup
```

Or use pass the `--no-backup` flag to **pessimize** in order to not create them from the get go.

```shell
$ pessimize -c patch --no-backup
```

And now, there're just not there anymore.

```shell
$ ls
Gemfile  Gemfile.lock
```

## What happens with groups and other attributes?

**Pessimize** also respects groups and other attributes passed to the `gem` method.

For example, if we have this `Gemfile`

```ruby
source "<https://rubygems.org>"

gem "puma", "~> 5.6.5"
gem "roda", "~> 3.61.0"
gem "awesome_print", "~> 1.9.2"
gem "pg", "~> 1.4.4"
gem "redis", "~> 5.0.5"
gem "money", "~> 3.0.5"
gem "shrine", "~> 3.4.0"
gem "cloudinary", "~> 1.23.0"
gem "shrine-cloudinary", "~> 1.1.1"
gem "faker", "~> 2.23.0"
gem "dry-struct", "~> 1.4.0"
gem "dry-validation", "~> 1.8.1"
gem "dry-schema", "~> 1.10.6"

group :test do
  gem "rspec"
  gem "simplecov", require: false
  gem "vcr"
  gem "webmock"
end
```

And we run **pessimize**

```shell
$ pessimize -c patch --no-backup
```

It will leave the groupand the `require` attribute unaffected, so we don't need to take care of anything `Gemfile`-related by hand. Very convenient!

```ruby
source "<https://rubygems.org>"

gem "puma", "~> 5.6.5"
gem "roda", "~> 3.61.0"
gem "awesome_print", "~> 1.9.2"
gem "pg", "~> 1.4.4"
gem "redis", "~> 5.0.5"
gem "money", "~> 3.0.5"
gem "shrine", "~> 3.4.0"
gem "cloudinary", "~> 1.23.0"
gem "shrine-cloudinary", "~> 1.1.1"
gem "faker", "~> 2.23.0"
gem "dry-struct", "~> 1.4.0"
gem "dry-validation", "~> 1.8.1"
gem "dry-schema", "~> 1.10.6"

group :test do
  gem "rspec", "~> 3.11.0"
  gem "simplecov", "~> 0.21.2", require: false
  gem "vcr", "~> 6.1.0"
  gem "webmock", "~> 3.18.1"
end
```

## Alias on .zshrc

I use `pessimize` in every project I work on. In fact, `pessimize` is on the list of the 3 or 4 gems I install right away when setting up a new Ruby environment.

Since I use it so much and I always use it the same way, I've created two aliases for updating gems.

The first one uses `bundle install`and the second `bundle update`.

In both cases, I run `pessimize -c patch --no-backup`right after installing or updating gems.

```shell
alias bp='bundle install && pessimize -c patch --no-backup'
alias bup='bundle update && pessimize -c patch --no-backup'
```

I run these aliases all the time.They are engraved in my mind.

```shell
$ bp
```

## Summary

Semantic versioning is a great tool for managing dependencies in our projects. In this episode we learned how to take advantage of Semantic versioning and to use the **pessimize** gem to completely automate the process, making our future lives easier and happier.

I invite you to try out pessimize in your next (or even better, your current) project and let me know in the comments if you liked using it.

## Thanks

I want to especially thank my recent sponsors,

-   [Akilas Yemane](https://twitter.com/akilasy)
-   [Bill Tihen](https://github.com/btihen)
-   [Benjamin Klotz](https://github.com/tak1n)

for supporting this project, I really apreciate it!
