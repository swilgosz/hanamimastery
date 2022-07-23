---
id: 24
aliases: ["HMEP024"]
author: "swilgosz"
topics: ["tests"]
title: "7 Levels of test coverage"
excerpt: "Do you measure your test coverage? Do you know that everything below 80% is irrelevant? Here I list 7 levels of test coverage, check out where you are!"
videoId: _6drOV_-k-4
publishedAt: "2022-07-19"
modifiedAt: "2022-07-19"
thumbnail:
  full: /images/episodes/24/cover-full.jpeg
  big: /images/episodes/24/cover-big.jpeg
  small: /images/episodes/24/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/XXX
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/XXX
    rails: https://www.reddit.com/r/rails/comments/pjuqct/XXX
    hanamirb: https://www.reddit.com/r/hanamirb/comments/XXX
source: https://github.com/hanamimastery/episodes/tree/main/024
---

For a decade of working on multiple projects, I've experienced a few approaches to testing web applications and I want to share with you a summary of my findings, split into **7 levels of Test Coverage** you may implement in your projects.

Let's start.

## Level 1: Noob
![Photo by Minnie Zhou](/images/episodes/24/noob.jpeg)

For a noob level, I'm referring to when I can see 0-20% LTC (Line Test-Coverage) in a project.

It simply means no tests at all, and depending on the reasons, you may name this approach:
 - *narcissistic development*
 - or *poor man mental's development*.

Why such names? Well, *narcissistic development* is a situation, where a developer thinks, his code is so well written, that it doesn't need tests, and testing the code is a waste of time.

Poor man's mental I refer to, where a client forces developers cheap on tests, to deliver features. You gain speed in a short time, in exchange for long-term credibility.

### Is it always bad?
Despite referring to it in a negative manner**, I do understand situations where this approach gives more benefits than generates issues**. In the real world, nothing is just black or white.

So when does it make sense? Well, in three cases.

1. In a very early stage of a project, where we only want to deliver MVP as soon as possible, to confront our idea.
2. When a project is so extremely simple that nothing changes often, and potential issues that can emerge because of that are nowhere close to main business priorities.
3. When a developer working on a project would spend way more time learning how to write tests in a certain technology than it's worthy.

All the above points refer to the extraordinary small and simple projects with extremely small teams, where the project's lack of bugs is not a priority. 

An example could be, a static blog, like my [Hanami Mastery project](https://hanamimastery.com)!

1. I prioritize *regular content publication first*. Until I figure out the process for that, the rest is irrelevant.
2. I don't change a lot, and when I do, I don't care if something displays incorrectly on production. I can always fix it by pushing a commit.
3. I have no skills to write tests in [Jest](https://jestjs.io/) and learning that would drove my focus away from content creation which is priority number one.
4. I have no dev team that I need to coordinate.
5. The whole project is open-sourced and if anyone would like to write tests... you're welcome! :D

As you can see, even though [I am a fan of Test-Driven development](https://www.udemy.com/course/ruby-on-rails-api-the-complete-guide/), and **I am completely against the no-test policy**, I am able to accept that some projects can make it work in certain scenarios. **And even I practice it sometimes myself.**

## Level 2: Apprentice.
![Photo by: Vitolda Klein](/images/episodes/24/apprentice.jpeg)
The *apprentice* test-coverage level in My opinion refers to projects having **20-60% LTC**.

**Here is what it often means:**
1. There is no clear policy to write or not write tests, so some developers do it while others don't
2. The project described in point 1 grew enough to make the lack of tests a problem.

Line test coverage below 60% can also be noticed in projects, where a *Post-feature tests policy* is practiced. 

In that scenario, **the policy of the project stays that we write tests**, but according to [Parkinson's law](https://en.wikipedia.org/wiki/Parkinson%27s_law) the work takes the whole time scheduled for it.

In the end, we are able to deliver a feature to meet the deadline, but *tests are written in a hurry, or there is no time to have tests at all* for a certain feature. We end up with holes in our system and sometimes even bugs related to core features get unnoticed!

I guess, that having this level of test coverage in your system does only makes sense if it's an in-between state, on the way to the higher test-coverage levels.

## Level 3: Padawan
![Photo by: Siora Photography](/images/episodes/24/student.jpeg)

This third level refers to **60-80% of LTC**.

It can be achieved in projects where planning is done well, and there is a dedicated time scheduled for writing tests for a feature.

However, in a lot of cases, you will find successful scenarios covered, while failures skipped - usually overlooked. 

I believe that this is where most of the misunderstandings and bad opinions related to writing tests in our projects come from.

At this point, we invest quite a bit of our time to write tests, but in the end, we still get a relatively high number of production issues reported by our monitoring systems!

In such a scenario, the sense of spending time on tests is often challenged.

I would say, let's avoid this one. 

:::tip
When you have such a test-coverage level in your project, **link to this article in the readme** or [inline code documentation comment](/episodes/17-inline-documentation-with-yard), so other peeps will remember to improve as quickly as possible!
:::

## Level 4: Advanced
![Austin Distel](/images/episodes/24/expert.jpeg)
This level of test coverage is what most developers target and end on.

You may say, that your application is well-tested if you achieve **80-100% LTC**.

You could stop here, and most people do! Here is the level of coverage we used to have in [Ascenda](https://www.ascendaloyalty.com/careers), despite targetting higher levels of advancement.

### How to achieve it?
A "full" Line Test Coverage you may see in projects, where TDD is practiced daily.

Developers write tests as the feature implementation progresses, often covering all of most of failure scenarios as well as successful paths.

As a trade-off, you tend to get some overlaps, where multiple tests check the same thing, while still some scenarios can be missed out. 

### What is the downside?
You may think, that it's all, but you'll be surprised.

TDD tends to have great unit test coverage but because of a tendency to mock the code, there may be holes in some end-to-end data processing.

It's useful to remember about adding some integration tests on top, to make sure our main features fulfill the current specification of the project.

## Level 5: Jedi
![Photo by: Mathew Ball](/images/episodes/24/jedi.jpeg)
Here we start reaching the next level of self-awareness. The Jedi level refers to keeping the *full* Line Test coverage, but at the same time applying also the full *branch test coverage*.

By enabling [Branch Coverage checks](https://github.com/simplecov-ruby/simplecov#branch-coverage-ruby--25) and keeping it at the level of *80-100%*, **you're becoming a Jedi**.

Enabling branch test coverage means, you are aware that line coverage is not the only truth, and 100% test coverage is just a guide, not the end goal.

You realise, that there are other ways of testing code quality and reliability, and **only by combining multiple metrics together you can reach truly reliable systems**.

## Level 6: Master

![Photo by
Leslie Jones](/images/episodes/24/master.jpeg)
Now, it becomes easier. 

Once you get to know that there is a lot you don't know yet, it's easier to achieve true mastery.

This level refers to a full Mutation Test Coverage (MTC) in your project - at the level of 80-100%. Even acronym letters match "Mutant Test Coverage"!

I have seen it more in the case of gems and specific shared components than whole web applications, mainly because running mutation tests on a large code base can take some time.

A nice example is the [RailsEventStore gem](https://railseventstore.org/) where any contribution requires a new code to be fully tested using the mutant gem.

If you have been introduced to your checks mutation testing, there is a chance your app is among 5% of the most reliable apps available out there!

But... It doesn't mean, your app is 100% reliable...

## Level 7: Yoda
![Photo by: Riku Lu](/images/episodes/24/yoda.jpeg)
...which brings us to the last part of this episode.

The final level of test coverage is when you get it all:
- Mutation testing integration
- Integration tests for core features (real flow), across services.
- Data anomalies analysis and detection.
- Backup servers to take on the work in case of random crashes (i.e Amazon is down)
- ... And so on

Decide for yourself how realistic it is.

The key here is to have the wisdom to decide what is needed and why as well as which points should be skipped for now, or forever.

To be a true Yoda in your project, you should never use the power that is not necessary just to show-off.

## Summary

Seven levels of test coverage can overlap and mix with each other of course, but I hope I managed to help you understand different approaches to it and that there is no end goal ever.

In my opinion, tests should only help your app to do what it does without unexpected crashing.

Defining your business goals and understanding what is needed to achieve them is what matters.

I hope you have learned sth useful today, but unfortunately, it's all I have for you this time.

:::note Become an awesome subscriber!

If you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/HanamiMastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!
:::

### Thanks

I want to especially thank my recent sponsors, 

- **[Akilas Yemane](https://twitter.com/akilasy)**
- **[Benjamin Klotz](https://github.com/tak1n)**
- **[Saeloun](https://github.com/saeloun)**

By helping me with a few dollars per month creating this content, you are helping the open-source developers and maintainers to create amazing software for you!

And remember, if you want to support my work even without money involved, the best you can do is to like, share and comment on my episodes and discussion threads. Help me add value to the Open-Source community!