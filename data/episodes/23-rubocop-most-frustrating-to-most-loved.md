---
id: 23
aliases: ["HMEP023"]
author: "swilgosz"
topics: ["linters", "quality", "rubocop"]
title: "Rubocop - 4 ways to reduce your frustration!"
excerpt: "Rubocop recently managed to be listed as one of the most loved and most frustrating ruby gems which is quite an achievement. In this episode, I'll show you how to keep it only in the loved section."
videoId: HmIgiulHplc
publishedAt: "2022-06-27"
modifiedAt: "2022-06-27"
thumbnail:
  full: /images/episodes/23/cover-full.jpeg
  big: /images/episodes/23/cover-big.jpeg
  small: /images/episodes/23/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/XXX
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/XXX
    rails: https://www.reddit.com/r/rails/comments/pjuqct/XXX
    hanamirb: https://www.reddit.com/r/hanamirb/comments/XXX
source: https://github.com/hanamimastery/episodes/tree/main/023
---
I tend to work with multiple ruby applications at the same time. Whether it is my open-source activity, or projects for my client, in either case, **I do not always have an impact on what coding styles I am supposed to use.**

One team prefers the double quotes, while other teams - a single. It's a never-ending war of people screaming about syntax, while honestly, I don't care, as long as it's consistent within a project.

I want to focus on problem-solving, and while in the ideal world everyone would place dots at the end of the line, at the end of the day it's not what I'm paid for.

### PR reviews.
Let's take a look at PR reviews.

Reviewing PRs take time, and when code is consistent within a project, it makes it easier to spot any real problems and this is why I care about code style in general. 

PR reviews should be as easy as possible, and when I do it, I want to be focused on logical issues, not pointing out suggestions, that there is an empty line missing at the end of the file.

Fortunately, there are some tools that can help us automate the tedious work of tracking the linter changes and today I want to say a few bits about one particular solution.

### Meet RuboCop
Probably every Ruby developer had heard about the [Rubocop gem](https://www.ruby-toolbox.com/projects/rubocop). It's an amazing linter library, that helps us analyse and format our code to follow the defined guidelines. Started by [Bozhidar Batsov](https://github.com/bbatsov) around 2012 it's also the one of the oldest popular ruby gems still in use.
Aside of the code formatting issues, it can actually help you discover a few more meaningful problems, like.

- unused variables which may be caused by typos
- too complex classes and methods
- unreachable conditionals
- performance issues
- security overlooks
- and many more.

Rubocop is so popular, that recently it managed to be on the list of [Top-Loved](https://rails-hosting.com/2022/#which-ruby-gems-frustrate-you-the-most) and [Top-Frustrating](https://rails-hosting.com/2022/#which-ruby-gems-frustrate-you-the-most) ruby gems on [Ruby on Rails 2022 Community Survey](https://rails-hosting.com/2022/)! This is quite an achievement, but I've wondered, why it's not only loved?

Mostly loved gems

![Most loved gems 2022](/images/episodes/23/mostly-loved-gems-2022.png)

![Most frustrating gems 2022](/images/episodes/23/mostly-frustrating-gems-2022.png)

Why people are frustrated because of Rubocop?

I have a theory, that one of the reasons is that some people just don't use it properly!

In this episode then I've decided to list 4 of the rubocop-related frustrations I could think about and come up with a few tips for you to remove each of the frustration from your head.

I encourage you to list your other issues you have experienced with this gem in the discussions threads, so we can find solutions together!

Now let's begin.

## Issue 1: Inappropriate default rules.

First thing that come to my mind when I'm forcing my brain to figure out possible Rubocop's downside is the defaults.

If you want to integrate RuboCop with an old project, defaults can really bite you.

I can imagine you get frowned after seeing sth like this:

![Too many violations](/images/episodes/23/too-many-rubocop-violations.png)

It could take AGES to fix all of those issues! And let's be honest, there is no client that can't wait for paying you to break all the too long lines in the codebase!

Even though rubocop has the `-a` option, which automatically fixes the detected issues, it still needs to be reviewed, as it's only a tool.

However, there are several ways to overcome this problem.

### 1. Use Todo List.

Rubocop Allows you to automatically generate a file containing ALL the detected issues.

By calling in your terminal

```shell
rubocop --auto-gen-config
```

you'll end up with a `YML` file, where a list of possible changes in the code will be placed, and saved for later. Once you Have it, you don't need to worry anymore about existing linter issues, and only tackle them piece by piece when you actually have a time for this.

### 2. Use Rubocop.yml file

The default configuration may be somewhat against your or your team's habits. 

You may change that by reading the [great Rubocop's documentation](https://docs.rubocop.org/rubocop/configuration), finding the incorrect rule and adjust to your preferences, I like to just download setups that resonate with me.

For example
- here is the [collection of all default rules](https://github.com/rubocop/rubocop/blob/master/config/default.yml) for Rubocop
- and here is the [Air BNB](https://github.com/airbnb/ruby/blob/master/rubocop-airbnb/config/rubocop-airbnb.yml) rubocop's setup which I've used for a while.

Just download the file and save it as a `.rubocop.yml` and you can now way easier adjust any rules that drive you crazy. 

However, if you don't really want to care about the configuration defaults, maybe it may be interesting to you to take a look at the [StandardRB gem](https://github.com/testdouble/standard) which is built on top of Rubocop, but with simplified rules setup, to make it easier for people to manage their configs in the easiest possible way.

## Issue 2: Peeps don't follow the guides.

I can imagine that people could get some level of frustration if after spending a few hours discussing code-style rules, you find yourself the only one actually following them.

The thing is, that any kind of code-style agreement is hard for developers. We all have our muscle memory evolved over years of working in a specific setup and preferences. You can't just come to me and say: "Since tomorrow we will all use `.call()` method, instead of just `.()`" and expect me to follow it without an error. Even if I agree.

I just can't adapt to such a change immediately. Imagine I'd reorder your keyboard keys, swapping an "a" with the "b" letter. I would love to see if you can avoid any errors in a single article blog without thinking to much.

This is what muscle memory means. And for this, RuboCop also comes with help.

### Use Auto Correctness
In the majority of cases, Rubocop allows you to run your code and don't care too much about style violations as it has a built-in auto-fixing mechanism.

if you'll run `rubocop -a`, it'll try to automatically correct all the issues, leaving you only those that are unable to be fixed using automatic tooling. This significantly reduces the time needed to change our habits and we can avoid frustration caused by that.

How cool is that?

However, I bet people will forget to run it. Before requesting the PR review. So here are the other improvements of this part.

### Use CI check

You may configure the GitHub actions or any other CI tool, to run Rubocop on the latest changes or on the whole repository each time your teammates push new commits.

In the case of violations detected, your build may fail, forcing people to fix it immediately. This is awesome because it prevents people to waste time during code reviews completely, as you just don't review failed builds.

And, it prevents people from feeling guilty about forgetting the styling rules, because they get feedback from the machine, not other peeps.

### Use local Git hooks.

People can still get a bit frustrated though after they build failing though all tests are passing.

Have you ever had this situation, where you publish a genius bug fix, feeling satisfied and proud, but a moment later you get a red-build notification on slack?

These sort of things can be avoided if we'd use the pre-commit or pre-push `git` hooks.

For those who don't know, Git hooks are shell commands that are run before or after certain git command. I'll not get into details this time, but you may add a pre-commit hook, to always run the rubocop before you commit a change.

For this, I totally recommend using the [overcommit gem](https://github.com/sds/overcommit), which allows you to easily manage multiple git hooks from a readable YAML files.

Having that covered, let's have a look at what else in Rubocop usage could bring us some frustration?

## Issue 3: Slow?
For big projects, I can imagine, that Rubocop checks can be slow. If I practice creating a lot of small, encapsulated commits, I definitely won't be interested in waiting for Rubocop Checks for going through a large codebase every single time.

Fortunately, there are ways to speed it up by a WHOLE LOT.

### Run Rubocop only about changed files.

First, you may run rubocop ONLY for changed files.

If you want to use pre-push git hook, it's useful to run rubocop against a diff with master.

```shell
git diff-tree -r --no-commit-id --name-only head origin/master | xargs rubocop
```

For pre-commit hook, however, you may only run it against currently changed files.

```ruby
git ls-files -m | xargs ls -1 2>/dev/null | grep '\.rb$' | xargs rubocop
```

This will save tons of time and will reduce the waiting time, making you a happier person and a more efficient developer.

A big shot out to [Anita Sharma](https://medium.com/@anaida07) for coming up with these filtered git commands in the article she wrote about [running rubocop only on changed files](https://medium.com/devnetwork/running-rubocop-only-on-modified-files-a21aed86e06d).

### Use custom format
Finally, to speed things up, even more, you may use the [non-default formatter](https://docs.rubocop.org/rubocop/formatters.html), which outputs fewer things on the screen, speeding the check a little bit too.

```shell
rubocop --format offenses
```

The above code will output only the detected rules violations which I've found way faster than putting every single processed file name on the screen.

Now let me go to the final source of frustration with Rubocop that comes to my head.

## Issue 4: Outdated rules after update

When a new RuboCop version comes out, occasionally there is a change, when a rule name had been changed, a new default rule had been added or some removed.

Then it requires manual updates of rules in the Yaml configuration file and I can imagine people could get frustrated a bit because of that.

This one I don't know how to hack. I just update the YAML files if needed. 

After all, robocop is stable across minor versions - major gem updates in general usually require some manual work to do, so I don't understand how this could bring frustration.

## Summary
Those four points are what I can imagine people could be frustrated about when dealing with Rubocop and I hope that the tips I've shared with you can deal with most of it.

If there are other points that drive you crazy though, please leave a comment in the discussion threads for this episode, and we could together find some ways around that.

## Thanks

I want to especially thank my recent sponsors, 

- **[Akilas Yemane](https://twitter.com/akilasy)**
- **[Benjamin Klotz](https://github.com/tak1n)**
- **[Saeloun](https://github.com/saeloun)**

for supporting this project, I really appreciate it!

By helping me with a few dollars per month creating this content, you are helping the open-source developers and maintainers to create amazing software for you!

And remember, if you want to support my work even without money involved, the best you can do is to like, share and comment on my episodes and discussion threads. Help me add value to the Open-Source community!

Also big thanks to [Fred Moon](https://unsplash.com/@fwed) for an awesome cover image!
