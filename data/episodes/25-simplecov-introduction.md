---
id: 25
aliases: ["HMEP025"]
author: "swilgosz"
topics: ["tests", "simplecov"]
title: "Branch for a next Launch - Simplecov!"
excerpt: "Enchance your test coverage reports by mastering the Simplecov gem!"
videoId: "84J-_DlvoQE"
published: true
publishedAt: "2022-07-25"
modifiedAt: "2022-07-25"
thumbnail:
  full: /images/episodes/25/cover-full.jpg
  big: /images/episodes/25/cover-big.jpg
  small: /images/episodes/25/cover-small.jpg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1551862278705876992
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/w8fbli/branch_for_a_next_launch_simplecov/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/w8fbzm/branch_for_a_next_launch_simplecov/
source: https://github.com/hanamimastery/episodes/tree/main/025
---

In the last episode, I talked about [7 levels of test coverage](/episodes/24-different-levels-of-test-coverage) I identify in my projects, and I hope that gave you some ideas on what to avoid and what to aim for in your applications.

 Let me know in the comments if testing in ruby is an interesting topic you'd like to hear more about and I'll continue with covering more tools helping to test applications efficiently.

Today I'll deep dive into one of the tools that can help you figure out where your application is currently.

There are several code metric tools, and quality checkers for Ruby available out there, and I hope I'll cover all of them at some point.

:::important 4 ways to remove your frustration
So far I covered the `Rubocop` in [episode 23](/episodes/23-rubocop-most-frustrating-to-most-loved) which appears to be one of the most popular I published so far. Check it out if you're interested in how to ensure your code remains consistent within the project.
:::

Today, however, I'll focus on test coverage.

In my applications, it's a constant theme, that I want **and need** to be aware of how good our test coverage is. Whether to identify potential bug-prone places or to ensure the safe evolution of software, including refactoring, high-level test coverage is a must.

Since I remember, I've used the Simplecov gem for that. It's a test-coverage checker, created by [Christoph Olszowka](https://github.com/colszowka) Back in 2011, and It's definitely one of the favorite tools I integrate with any ruby project I work with.

Christoph is also an author of the [ruby toolbox](https://www.ruby-toolbox.com/) project, so make sure you follow his work - this is another tool I use frequently.

Let's check what it allows us to do.

I've here a simple calculator inside of the Hanami application, for dividing numbers by each other. In case of the latter value is a `0`, it returns the message that argument is not allowed.

```ruby
# /app/lib/calculators/divider.rb

module Sandbox
  module Calculators
    class Divider
      def call(a, b)
        b.zero? ? "Can't divide by 0" : a / b
      end
    end
  end
end
```

I'd love to check if this class is well tested in my project, to be sure I can refactor it freely without being afraid to introduce bugs in production.

To do so, I'll leverage the power of the simplecov gem.

First, let me install it in my project.

```ruby
# Gemfile

group :test do
  gem 'simplecov', require: false
end
```

```shell
bundle install
```

Now having that I can open the `spec_helper.rb` file and ensure that `Simplecov` will start every time I run my tests. It's important to place this code at the top of the file, before all files are loaded, to be sure, that `Simplecov` properly tracks our loaded files.

```ruby
# spec/spec_helper.rb

require 'simplecov'

SimpleCov.start
```

Now let's start our tests.

```shell
bundle exec rspec
```

![[coverage-results-console.png]]

At the very bottom of the output, you can see that the coverage report is now generated, under the `coverage` folder. Let's take a look at it.

```shell
open coverage/index.html
```

![All files coverage report](/images/episodes/25/coverage-all.png)

I can clearly see, that my `divider` is not fully covered by tests, but surprisingly, 80% seems to be covered!

After clicking on it, though, I get a detailed view, of which lines were called of the class were called during my test run, and which weren't.

![Single file coverage report](/images/episodes/25/coverage-divider-single-1.png)

It clearly says, that the only line that matters, is missed, and the rest is called by the autoloading engine during the app boot time.

This shows, why having less than 80% line coverage in your application means nothing, and makes it extremely bug-prone. You may have most of your lines called by the application loading engine, and still, have nothing tested.

Let me fix it then.

## Testing the code.

Let me add a nice test example then. I just add one test for a `call` method, that checks if calling the instance of my class with arguments `4` and `2`, will result in a number of exactly `2`.

```ruby
# spec/app/lib/calculators/divider_spec.rb

RSpec.describe Sandbox::Calculators::Divider do
  describe '#call' do
    it 'works' do
      expect(subject.call(4, 2)).to eq(2)
    end
  end
end

```

Now let me check the code generation again.

![Wrongly reported uncovered line](/images/episodes/25/coverage-divider-single-fake-cover.png)

It seems, that my file is fully covered now! Isn't that great?

But wait, have you spotted the problem?

## Branch vs Line test coverage.

I have a one-line conditional here, but I only test one path of the condition. My code returns a message in case of passing a `0` as a divisor, and even though I don't have the test for that, I still get a full test coverage report!

### Line Coverage

It happens because *simplecov* by default is configured in a way to work with Line test coverage. This means, that if a line of code is called during our test run, it's considered to be tested.

It makes sense, but as you can see in this example, often it's not enough. This is where *branch coverage* comes in.

### Branch Coverage

Branch coverage is the type of check, which covers all branches of my conditionals, no matter if they are inline or not. In case of any branch of the condition is not tested, the line is considered uncovered.

To set this, in my `spec_helper` file, I need to enable the branch coverage using the configuration option.

We can also set *branch* coverage, to be the **primary** check for the test run.

```ruby
# spec/spec_helper.rb

SimpleCov.start do
  enable_coverage :branch
  primary_coverage :branch
end
```

Now our report looks way more realistic.

![Branch coverage enabled](/images/episodes/25/coverage-branch.png)

I get 50% of test coverage, saying, that my file has two different paths that my code can take, and only one is tested. The rest is irrelevant, all lines being called by the loading engine do not affect the final result.

Let me add the missing test then:

```ruby
# spec/spec_helper

it 'returns info when dividing by 0' do
  expect(subject.call(4, 0)).to eq("Can't divide by 0")
end
```

Now my file is finally reported correctly.

![Line covered correctly](/images/episodes/25/coverage-divider-single-2.png)

However, it's not all we can improve.

## Basic filters

*Simplecov* has no knowledge about our application. Therefore, by default, it just reports all files we have in the system, including all *test* files.

![All files coverage report with spec marked](/images/episodes/25/coverage-including-spec.png)

There is no need to have that in the report - at least I am not interested to check, that all my tests had been run when I run them all.

To clean the report a bit, I'm going to add a simple filter, to exclude all the files placed in the `spec` folder.

```ruby
SimpleCov.start do
  # ...
  add_filter %r{^/test/}
end
```

Now finally, after running my tests the end result looks as expected, including only files that matter to me.

![All files coverage report with filters applied](/images/episodes/25/coverage-all-cleaned-up.png)

## Grouping

Things are looking way better now, and I love this simple look at the start, but when I'm working on bigger applications, split into different teams/departments, I like to have a way of grouping the report by files relevant to my part of the project.

![All files coverage report with grouping enabled](/images/episodes/25/coverage-groups.png)

To achieve this, I need to add my group definitions to the `simplecov` configuration, passing a name as a first argument, while the file path definition as a second one.

```ruby
# spec/spec_helper.rb

SimpleCov.start do
  # ...
  add_group "Admin", "slices/admin"
  add_group "Reporting", "slices/reporting"
  add_group "Monitoring", "slices/monitoring"
  add_group "Core", "app"
end
```

Feel free to group by whatever works for you, in Hanami, grouping by slices makes the most sense.

## Conditional *simplecov* runs

Then finally, during my regular workflow, I rarely run all tests in my project. Usually, I'm only interested in running the tests I'm writing for the current file, leaving the rest to the CI checks after pushing my changes to the server.

Therefore, I like to only load and run `simplecov` if there is an environment variable named `COVERAGE` set.

```ruby
if ENV['COVERAGE']
  require 'simplecov'
  SimpleCov.start do
    # configuration here
  end
end
```

This allows me to only call coverage when needed, as well as set the CI checks to call it by default. My daily workflow is not slowed down by unnecessary redundant checks, and everyone is happy.

## Controling the quality of test coverage

To ensure test coverage in projects I'm working on does not drop over time, I'm usually setting a few additional rules in the config.

The first is to set the minimum acceptable test coverage.

```ruby
SimpleCov.start do
  # ...
  minimum_coverage line: 90, branch: 80
end
```

Having that, if test coverage in my project drops below the accepted level, the test run returns an error. Usually, it means that the CI build fails to prevent PR to be merged until missing tests are added.

Additionally, a good way to force a slow increment of tests coverage is to add `refuse_coverage_drop` option to the config.

```ruby
SimpleCov.start do
  # ...
  refuse_coverage_drop :line, :branch
end
```

Having this, the build will always fail, if the coverage is lower than before.

I tend to have a badge in the project `Readme` file, with the current test coverage percentage and refresh it after each merge to the main branch. This prevents any developer to open a PR that doesn't have enough tests and slowly forces the quality of the code to be increased.

## Summary

Simplecov is a nice guide to have an overview of how well-tested our application is. As often happens in such great gems, I only scratched the surface of possibilities it allows though.

There is a ton of documentation about how to speed up your checks when running tests in different processes - so potentially, we can run tests for each slice separately, and `simplecov` can easily merge the final result to present the report correctly.

Unfortunately, it's all I have for you today.

:::important[Become an awesome subscriber!]

If you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/HanamiMastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!
:::

## Thanks

I want to especially thank my recent sponsors,

- **[Akilas Yemane](https://twitter.com/akilasy)**
- **[Bill Tihen](https://github.com/btihen)**
- **[Benjamin Klotz](https://github.com/tak1n)**

for supporting this project, I really appreciate it!


By helping me with a few dollars per month creating this content, you are helping the open-source developers and maintainers to create amazing software for you!

And remember, if you want to support my work even without money involved, the best you can do is to like, share and comment on my episodes and discussion threads. Help me add value to the Open-Source community!

Also big Kudos to [Spencer Davis](https://unsplash.com/@spencerdavis) for an amazing cover photo!
