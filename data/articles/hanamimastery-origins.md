---
id: 1
author: "swilgosz"
topics: ["open-source", "thoughts"]
title: "My attempt to change the world of Open-Source financing."
excerpt: "Open-Source development is hard nowadays. Here I explain how I want to make it easier."
publishedAt: "2021-06-07"
modifiedAt: "2021-10-03"
aliases: ['HMAP001']
thumbnail:
  full: /images/articles/hanamimastery-origins/cover-full.jpeg
  big: /images/articles/hanamimastery-origins/cover-big.jpeg
  small: /images/articles/hanamimastery-origins/cover-small.jpeg
discussions:
  twitter: https://twitter.com/sebwilgosz/status/1401982721388392458
  reddit: []
source: null
category: stray
---

I came through an article by Piotr Solnica, covering his [thoughts about open-source financement](https://solnic.codes/2021/06/04/10-years-of-open-source/), and I've got inspired to write this response for him.

> DISCLAIMER: Please do not read this article in the mindset that I'm complaining. I'm pointing here my mistakes, the reality I've faced, but not to complain, but to improve! :)

### My open-source reality.

I've first met Piotr around 2015 at one conference in Wrocław, where he presented the [ROM.rb](rom-rb.org) updates, and I was still kind of a junior-level ruby developer up then. I saw what he did in this library and I was amazed. Shocked, and amazed.

The skills that were required to pull this thing together were on a completely different level than anything I experienced so far, and this was when I started being interesting in Open-Source contributions.

At that point, I didn't look for ways to develop my personal, unique being as a Ruby developer. I rather looked for several people I admired and thought: "I want to be like these guys!". This obviously was not a way to go, but I needed some time to realize, that everybody is different - even if some thoughts, skills, or opinions are common - and this is what makes all of us great!

### Initial troubles with a contribution.

I really wanted to contribute somewhere, but I was afraid. Afraid as I am not good enough. Piotr said in his article, that

> People think that Open Source is just this one big, global family.

And I completely agree with that. I thought that to be a part of it, you need **something like a wildcard**, or be famous already. Sounds crazy? Yeah, but it was like that for me. I really wondered how I can do my first contribution.

And then I've found it. During the work on my first big commercial project, I've discovered a **bug in Doorkeeper**. As one of my team members was one of the initial core authors of the library, it was much easier to verify that this is a bug, and he encouraged me to publish a fix, by adding a Pull Request directly to the library.

Unfortunately, my PR was rejected, as after the current maintainers told me it's a feature, not a bug, and there is a better way to do so.

There was no "thank you", though, not even an explanation of where to go, or how to solve my problem. That was much more disappointing, and it took me a while before I tried again.

### My difficulties with sustainable Open-Source work

The issue number one I had since the beginning was that I needed to work full-time to support my family. When you work 8 hours, you sleep 8 hours, You have 2 hours for all the meals, there are 6 hours left in the day....

I wanted to share as much time as possible between my kids, lovely wife, and not forgetting about the time for myself. **And at the same time, I wanted to work on online contributions**, like blogging, open-source activity, online teaching...

That was not realistic for me.

So I reduced the full-time engagement as a developer to 75%. And things become a bit better, but I quickly realized the same things that Piotr mentioned in his article.

1. I've thrown away 25% of my income just to make work for free for others to profit from it. Wish you all the best trying to explain that to your wife! :D
2. Companies (mostly) were not interested in supporting anything until they could get profits from my traffic, network, or influence I made.
3. It was much easier to get appreciation and support from personal passionates that I am really, really grateful and always will be.

Then [Github sponsors came alive](https://github.com/sponsors/swilgosz), and I quickly checked, if is it only me, or are other people also struggle with financing their Open-Source work too?

**Here is how things look in the mid of June 2021:**

![Sponsors status: solnic](/images/articles/hanamimastery-origins/solnic-sponsors-2021.png)

![Sponsors status: timriley](/images/articles/hanamimastery-origins/timriley-sponsors-2021.png)

![Sponsors status: jodosha](/images/articles/hanamimastery-origins/jodosha-sponsors-2021.png)

![Sponsors status: bbatsov](/images/articles/hanamimastery-origins/bbatsov-sponsors-2021.png)

I was surprised. And shocked again.

### Developers ARE NOT marketers.

Of course, there are people, that do better in self-promotion, or can [create profitable, sustainable businesses](https://courses.arkademy.dev/) around their open source work as Andrzej Krzywda did with Arkency and [Rails Event Store](https://railseventstore.org/) - this is admirable.

BUT, the majority of developers are not good marketers. **They are good developers**. And it gets harder, where they are doing low-level, or backend stuff, that is not even seen by the 99% of the population.

I saw it as not fair, and not as I would like it to keep, and as I am really a 0-1 person, for whom either something works, or can be fixed, I started thinking about the solution.

### First attempt - The Rails API course.

I've created and published [Rails API Udemy course](https://www.udemy.com/course/ruby-on-rails-api-the-complete-guide/), which goal was to help people start writing the good API, and then build a community around it, to support them more.

I thought about writing some open-source projects around the course, where I can help my students with the initial contributions. I successfully put that together, by publishing [jsonapi_-_errors_handler](https://github.com/driggl/jsonapi_errors_handler) and [jsom-pagination](https://github.com/useo-pl/jsom-pagination) gems.

Also, I've published dozens of articles around building Good API, that were really appreciated by students. At the same time, I was kind-off able to finance it from the Udemy course I've been selling.

BUT, the amount of work it'd cost me was crazy. As I keep track of my work, I've spent over 1800 hours only on course creation and maintenance.

This is ten months of full-time employment!

How crazy it is? And I have only two open-source gems, used by dozens of people.

How does it compare to Dry-rb, ROM-rb, or Hanami?

I still see potential in publishing more online courses in the near future, but due to my family situation I needed to hold off with new big projects.

### My second attempt - HanamiMastery

When I've worked on the Rails API course creation I needed to learn a lot. This actually forced my skills into the next level of API development and software architecture.

I quickly realized that Rails architecture is not enough even for API-Only scalable systems, and I've [designed my own custom solution for this](https://driggl.com/blog/a/cars-api-endpoints-in-rails-applications) for my client, inspired by [Dry-RB](https://dry-rb.org/gems) and [Trailblazer](https://trailblazer.to/2.1/docs/trailblazer.html) solutions - Actually, using Dry-RB libraries under the hood.


But then [Hanami 2.0-alpha2](https://hanamirb.org/blog/2021/05/04/announcing-hanami-200alpha2/) had been announced and It appeared to be a solution for all architectural issues I've faced in all my teams so far.

#### The risk to switch

My client supported me fully, in test-out New Hanami for one of our microservices which I highly appreciate. In the end, however, we've decided to not switch (at least) just yet, due to 2 main factors:

1. Small core team - this is risky
2. Not many resources to learn, transfer knowledge, educate the team.
3. There would be too much slowdown - due to the fact, it's yet alpha.

I could not argue - and actually, I was one of the people advocating sticking with Rails for yet some time to minimalize the risk.

However, I really believe the Hanami is so greatly designed, it can become a new "go-to" web framework for ruby apps and I really wanted it to succeed.

Here is where [HanamiMastery](https://hanamimastery.com)'d been born.

#### HanamiMastery is born

I've gone through the main issues we've faced, and realized, that this is not only a Hanami problem. This is an Open-Source problem in general.

1. The core team usually is too small, due to the lack of financial support.
2. There are not too many resources to learn, because developers are busy developing applications, not writing articles or video guides.
3. It's yet alpha - because the team is too small, because there is not enough support, because there is not enough interest yet, because it's easier to go with already well-worn trails.

I'm not a person, who likes to wait on anything. When something does not work, I want to find a solution to fix it.

This is where I've got an idea to start solving all those issues.

The idea is simple. There are much better developers out there, working on Hanami every day to make it great - how can I help them in the most meaningful way? Start with guides.

1. **There are not too many resources and docs to learn new Hanami** - so I'm [creating a vlog](https://www.youtube.com/channel/UC4Z5nwSfZrUO4NI_n9SY3uQ), where I'm publishing Hanami related courses, guides, videos, articles, tutorials, and whatever you can think about.
2. **The core team is too small** - **SO I joined the team**, to help with preparing the guides and improving documentation. It's small because people need to earn money for their lives. They usually cannot afford to work for free too much. SO I'm giving off at least 10% of ALL income I'll make in any way, related to HanamiMastery, directly to support maintainers of libraries Hanami relies on, directly or indirectly.

Still, I put a tremendous amount of effort to create content, publish it, maintain it, update it. I do it for free because I like it. And I will do it more, the more time I'll be able to put into it.

So This is a start.

### Summary

**This is my attempt to change the world.** For Hanami and Open-Source in General. I don't expect to be ever able to finance a majority of great projects that should be supported, but If I'll inspire one person in any way, I'll be fulfilled.

Nowadays, working open-source is definitely a hard thing to do. But I see a bright future ahead, and I'll do my best to bring it closer to all of us!


### Special thanks

I'd like to explicitly thank

- [Katt Yukawa](https://unsplash.com/@kattyukawa) for a great cover photo!
