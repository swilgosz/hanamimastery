---
id: 50
aliases:
  - HMEP050
author: swilgosz
topics: ["hanami", "dry-rb", "rom-rb"]
title: "Special: Hanami Core Team Interview"
excerpt: "This episode is a special release, when Seb interviews Tim Riley and Luca Guidi from the Hanami Core Team, asking them questions collected from the community! This way we enjoy reaching our important milestone of releasing 50th Hanami Mastery episode!"
videoId: "U3e3LhgW1mM"
publishedAt: "2023-10-11"
modifiedAt: "2023-10-11"
thumbnail:
  full: /images/episodes/50/cover-full.png
  big: /images/episodes/50/cover-big.png
  small: /images/episodes/50/cover-small.png
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1712113932113179070
  mastodon: https://ruby.social/@hanamimastery/111216941834797108
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/175foiz/special_hanami_core_team_interview_hanami_mastery/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/175fpb4/special_hanami_core_team_interview_hanami_mastery/
source: null
published: true
---
Hi everyone! 

Welcome to the special, 50th episode of Hanami Master, where we are going to interview the Hanami core team members, Tim and Luca in Particular.

In this episode, you won't find a usual tutorial; rather, we try to answer some questions collected from the community. Some are technical, some more general, but we'll try to address them all.

## Participants of the show

**Seb:** Guys, would you like to introduce yourselves?
### Tim Riley
Tim is a key person taking the effort to rewrite Hanami 1 into the next-generation framework

**Tim:** Well, I'm a Rubyist. I live in Australia. I've enjoyed contributing to the Ruby open source world for some number of years. For the last little while, I've found a new home in working with Luca and others to help build the future of [Hanami](https://hanamirb.org) and I've really been enjoying it. Before working with Luca, I worked on the [dry-rb](dry-rb.org) and [rom-rb](https://rom-rb.org) projects. And what we have with Hanami 2 is the combination of all of those efforts to bring them under bring them into a single framework that combines them and makes them easier than ever to use. 
### Luca Guidi
Luca is the original author of the first versions of Hanami and works closely with Tim (and Peter), on the new versions of Hanami, providing historical contexts and guides.

**Luca:** Hello everybody, I'm Luca from Rome, Italy. I'm a Rubyist as well, no surprises here. I've been working with Ruby and open source for... quite a significant portion of my, of my career. And then during this journey, I met Tim and **we decided to join forces together to deliver Hanami 2 to the community**.

## How the interview will go
I've collected some questions from the community, there are some more general questions and some more technical ones. I've grouped them, joined if there were similar ones and will paraphrase to bring a bit more clarity.

Let's start then!
### Question 1:  What problem Hanami solves?
:::quote from Janko & Jack M. 
What are the issues that are easily solvable by Hanami, while are not as easily solvable in Rails applications?
:::

#### The structure
**Luca:** In general, it's the structure. 

I mean, I felt Rails is a good base for vanilla applications. But other than that, beyond *MVC*, I always found myself lost. One of the reasons why I started Hanami as a project is to go beyond MVC.

**We see and guide developers**. And so that's why you see more components, more abstractions than rails. Imagine the validation is an object and has more details. That is one example. 

So a short answer for that is the guidance that I believe that Hanami offers.
#### N+1 Queries issues
**Luca:** However, about the problems that are solved out of the box, on top of my mind is the *N+1 queries*, for instance, that are impossible to get in a Hanami and the ROM under the hood by design.

**Seb:** Actually, I did experience the N+1 query issue in the Hanami application, but you really need to try to implement it. And in our case, that was because of a very specific business problem that we needed to solve and we consciously took that trade-off.

I wanted to mention it here, to show that even though by design you don't have those, ROM does not restrict your freedom if you need or explicitly want to do it.

But yes it's, it's extremely clear where such multiple queries would appear and yeah, you cannot just do it by accident - which for me was surprising and quite exciting, as I've come from the Rails ecosystem.

Tim, what about you?

**Tim:** Starting from N+1 is a nice idea. I mean, that is solved in Hanami because it encourages a **layered architecture**. You can achieve that in any framework, but Hanami makes it the default way to structure your app.

I think that's a really powerful posture and one of the best things that we can bring to people who are looking **to build applications that they feel like they can maintain**. And I do think that solves problems. 
#### Different way of making applications
**Tim:** Another problem that it solves is that I, a hypothetical Rubyist, have never found a way of building apps that just suit my brain.

And when I started meeting people like Luca and Peter, I found a range of tools that helped me build things that I suddenly felt clicked. Here is an app that we sort of split up into a lot of fine-grained pieces. 

But that gives me the confidence to go and make changes because I know how they connect.

And this is the arrangement that Hanami encourages by default. Small components, small applications working together, instead of big interconnected models.

#### Learning good design practices
**Tim:** And the last thing is that the framework itself embodies good design principles in how you use the framework and in how it's implemented, so you can, **you actually learn good app design practices by working with Hanami** because [Hanami Views](https://github.com/hanami/view), [Hanami Actions](https://github.com/hanami/controller), these are all things that you can interact with directly.

The way they express their API is something that **you can take and do in your own application components as well**. 

And I think that's really powerful because we don't have many examples of frameworks whose design patterns you might want to lift and put straight into your app. They're often quite complicated or they do things that are for [the sake of convenience](https://www.youtube.com/watch?v=cCD7QJB4HHs), but compromise their own internal design.

With Hanami I think we've struck a nice line there where the **framework itself is educational and it teaches you a good app design** and I'm really excited about it. 

It's a subtle point, but I think it'll play out over the years as people come to Hanami and give it a go.

**Seb:** That is great. Thank you very much. And I use this chance to share one example of my favorites if you don't mind!
#### Types app settings

**Seb:** My favorite features that I have found in starting with Hanami were the settings.

The [typed settings as a built-in possibility](https://guides.hanamirb.org/v2.0/app/settings/). And the fact that Hanami even encourages that to define settings and environment variables that are accessible in the system. You don't use environment variables using the ENV constant.

And that is. 

It's extremely powerful and for me, it's, it's amazing. It eliminates completely the `undefined method for Nil` because someone forgot to set up the environment variable in staging or production environments!

And that is, that is something I like very much as well.  It was, it was super nice to discover all of that.

So let's check next questions.
### Question 2: Fullstack framework or API focused?
:::quote from Edouard
Is Hanami  2 ready to render HTML templates? What will be the default template engine?
:::

:::quote from Hieu
What will be the primary focus of Hanami over the next few minor/major versions? Will Hanami continue to be a full stack framework, or will it focus mostly on API side?
:::

#### About rendering HTML templates with hanami-view

**Tim:** **Hanami 2 is ready to render HTML templates**. This is our main focus right now (August, 2023), as a development team. The view layer is effectively complete, and we're just working on rounding out the support for front-end assets to go along with it, because we think these two make sense to deliver together. 

And I think anyone who's played with Hanami 2 so far will find views a good fit alongside everything they've learned so far. They're standalone components just like Actions. You have one class per view. 

Views can bring in other parts of the app via the `Deps` mixin. Views have explicitness.

They prepare the values that they want to pass to their templates. And those templates for rendering HTML, it's all the usual suspects. **ERB will be our default**. We prepared a brand new ERB engine to ship with Hanami View 2. 0. But we also support HAML and SLIM as first-party engines. 

##### Tilt under the hood.
And an interesting thing about the way we've built Hanami View - and I think this reflects well with how we fit in the broader Ruby ecosystem - we didn't just invent everything from scratch, we actually used a library called [Tilt](https://github.com/rtomayko/tilt) which is a longtime Ruby gem which provides an abstraction for rendering templates with a range of different template engines.

And so anything that Tilt supports, Hanami View supports. So, for instance, I've used YAJL for using Hanami View to render API responses. And that's a novel way of using views, but it felt very natural and it was unlocked because of the way we've adopted you know, longstanding Ruby libraries like Tilt.

##### Using hanami-view in standalone applications
I think with the view system, people will find other interesting ways to use them. 

For instance, because they're standalone objects, they're not just tied to being used inside rendering HTML responses for HTTP requests. You can use them on their own! 

So I've used Hanami Views for part of an email delivery system where the view provides the templates for both the text and HTML versions of an email.

And because views are just components in a Hanami app that you can call directly from wherever, you can use them, in lots of interesting ways. 

And I think yeah, I'm really excited for how people can work with them. 

**Seb:** Thank you very much. Recently, I've played with the newest beta version of Hanami 2 [with Bulma integration](3-style-your-app-with-bulma)  and [I've built some applications using Hanami View](/episodes/46-contact-form). Also, I experimented with removing *hanami-view* to [replacing it with Phlex](/episodes/48-phlex-in-hanami). 

The cool thing about Hanami that I really find refreshing and I cannot over-appreciate is that even though you guys create amazing components, **you don't force using them**! 

You aren't forcing to use Hanami view, even though this will be definitely my favorite approach to building views. And I find this, this philosophy just hitting my heart.

So it was extremely easy to completely replace the view layer to experiment with other solutions and just wanted to say thanks for that. 

Luca, maybe you would like to continue with the second part of the question related to long term the long-term plans of the full stack support?

**Luca:** Yes, of course!
#### About long-term plans - The everything framework
**Luca:** So **full stack is the current focus and it will be the final shape of Hanami**. API is just a subset of it. 

And starting from what you just described, Seb, about the ability to remove core components - that was intentional. That was a way to offer *The everything framework* for, Ruby, meaning that the default flavor, the default experience is a full stack web framework, but by removing one component at a time, you can have just a core of it.

That is a way to organize your code base with a container and the CLI capabilities. You can just have an application that is consuming, I don't know, Kafka streams and doing some business logic out of it. So just to summarize what I'm trying to say is that **full stack is the default way that we are thinking about Hanami.**

We are developing full Hanami, but by removing components from that, you can get an API-only experience. You can get just Ruby experience in a way that imagine this as a set of circles. 

You have the core of it and we are building around the core things that give developers the web experience. 

**Seb:** Thank you! And after the view layer is released, what would be the next big feature? The next big focus on your site?

#### About next step: Persistence

**Luca:** Next is persistence. That is the 2.2 in our roadmap, meaning that we will integrate Hanami again with ROM, providing all the facilities that we deliver for other components which are:
- code generators, 
- CLI commands, 
- all the abstractions that we believe are good for persistence in Hanami apps.

as the next questions actually touches ROM and the persistence layer, but because we already know that it will not be introducing the 2.

### Question 3: What's the ROM Progress, status, and integration?
:::quote from Choallin
Will Hanami 2.1 include a ROM integration out of the box? How is the progress on ROM integration going in general?
:::

**Seb:** Following up on that, what is the progress on the ROM in the general? 

Because Hanami is split into dry ROM and Hanami gems and its own gems ecosystem, It's hard for the person from the outside to figure out the actual progress or roadmap.

We cannot just, you know, go to GitHub, check the mono repo and check, the commits from the last month, nor the projects there and so on. 

So my question would be like: could you add some light on the current progress on the ROM integration? And if we can use the ROM in the meantime while waiting for the full integration are there sample applications that are using ROM that people can refer to?

In Hanami 2, will you provide some kind of like support to migrate it later to the full-fledged integration if you will?

##### Using ROM at the moment, and how the integration will look like.

**Tim:** We're a small team. Our focus has been on views and assets and that's where it will remain until we can deliver them.

One thing we've learned from the experience of building Hanami 2 is that things take longer than you expect or hope, and it's better to bite off slightly less and deliver.

Only once it's formally released that people feel like they're able to engage with it. So. **Views and assets are our focus right now.**

The ROM repos people will probably find being a bit quiet, and that's purely because we haven't been putting a lot of attention on it. **We do have a plan for how we'll integrate it, though**. It will be unlike Hanami 1, which sort of owned more of the persistence experience via its own classes.

By doing that, we sort of constrained ROM.  With Hanami 2 we plan for a much lighter touch, which is to **let the complete power of ROM be available to the users** and focus more on providing streamlined defaults for how it can work so that there's very little setup boilerplate. **The CLI integrates with it right out of the box.**

You know, you can put ROM components into your app or into your slices and they all just work based on wherever you locate them and so on. So it's not going to be a heavy-handed approach. **It'll just be getting ROM nicely integrated**. 

For anyone who's interested in Hanami 2 and persistence, the way to get started with that is to look at our getting started guide, **which already provides a somewhat manual ROM setup**, and you can just start going, playing, go play with those two things together. 

**Seb:** There are already [multiple Hanami Mastery episodes touching persistence](/t/rom-rb) in Hanami apps, and I do have [manual ROM configuration explained for anyone interested](/episodes/28-configure-rom-from-scratch).

**Tim:** They already fit great together. And you can be confident that whatever you build with Hanami plus ROM now you won't get burnt when the Hanami official 2.2 persistence release happens. 

Because if anything, it might be a little bit of a mechanical translation where you might need to change a few class names or something, you know, just from what ROM provides to, how we choose to offer them inside an integrated Hanami app, but you won't have to redo anything from scratch.

**Seb:**  Cool. Thanks very much!
##### Example of ROM feature restricted in an older version of Hanami.
**Seb:** You've mentioned that Hanami 1 is actually a little bit restricted, and this is new to me. Are you able to provide an example of such a feature? Or you, Luca?

**Luca:** Yes. So how to put this at the time of Hanami 1.

There was contact between me and Peter who is the main author of ROM, but I was a consumer and he was a provider. So there was no alignment between what I believed should have been the Hanami experience and what ROM was providing at the time.

This mismatch resulted in Me hiding some of the ROM power. I believe ROM is very powerful, but it can be intimidating for newcomers. And it was less known at that time. 

And so I just wanted to give a brainless, frictionless user experience to Hanami users. And that came with a compromise of **hiding some of the ROM features that I believe are powerful, such as the relations**.

##### Active Record background
Because in my thinking, coming from ActiveRecord, people will have objects that contain business logic (like models in Rails), and we call **entities and repositories**. Because of the active record pattern having all that in one abstraction, there was a radio separation of data persistence versus business logic, and I felt like that was enough cognitive load for the users.

So I hid relations, prefered to hide everything else. That is where this thinking starts to crack for advanced ROM users who need more of the ROM power.

So, Lesson Learned, I mean, in Hanami 2. 0 we still plan to offer a basic frictionless ROM experience, but it will not try to hide behind a curtain anything for advanced users.

##### Difference between now and then in relation to ROM.
**Tim:** Just to add, I think two things have happened since that era with Hanami 1. 

**Firstly, ROM has come a long way.**

Now, just as a vanilla ROM user, the easy things are easy, and the hard things are possible, which is what's so amazing about it as a persistence framework. 

**The second thing is, is that our philosophy for the Hanami framework design has evolved from the lessons we learned in Hanami 1**. 

I wasn't in the team doing that, but I've seen how it was built, and obviously, I've worked a lot with Luca on this new iteration.

And **I want to just underscore how important that is.** 

Our goal with Hanami 2 is to give you access to the power of all the things we're bringing together, **make it easy to get started, but also make it easy for you to drop beneath the surface**. 

Do crazy things when you realize your needs have advanced beyond what the framework gives you without having to eject yourself fully from the framework ecosystem.

So that's, that's the two things that came together to help inform our ROM integration and persistence layer for Hanami 2.
### Question 4: After persistence, next plans?
:::quote from Lucian
After Hanami 2.2 with ROM integration is released, what are your next plans? Education, maintanance, further development, marketing? Retirement? 😀 What are your long-term plans for Hanami 2?
:::

**Seb:** Thank you very much! And before we get down to the ground and touch again the present stuff.

I know that your focus is around views and you barely focus on persistence, but I'll dig further - as nobody said this interview will be an easy one.

What are your rough Next plans AFTER completing the full fledged framework? What does it mean to you? Will you focus on maintenance or education? Do you have some crazy big features in mind to be added or maybe just retirement and taking care of kids?

#### Education, growing community, maintanance.

**Luca:** Finishing it, meaning providing, the set of features that we want to provide that we are already covering. But for us after 2.2, we consider Hanami as done, in the sense that we will work on maintenance, we will work on compatibility between the dry ROM and Hanami ecosystem, compatibility with third-party gems, with the Ruby itself, but don't expect any big-bang rewrites anymore.

**Don't expect any groundbreaking work because the focus will be on education**, will be on growing the community, will be on adoption. We are making huge investments, technological investments, and we are deliberately focusing on code, ignoring maybe too much of what is beyond code. 

For me though, open source is a constant exercise of prioritization because we are working with a resource that's called time.

**So The next steps will be education**, getting in touch with people, and growing the community. 

**Seb:** Thanks!

I can agree with this because I'm from the other side. 

**I decided to help with community education and support the documentation** first. And even contributing to the guides was so much work aside from my daily job!

It's a big challenge for me because of how much time is needed to prepare weekly videos. So I definitely hear you that spreading the focus would mean probably that we would not see Hanami 2. 0 in the next few years.

Thanks for those choices as we can already use the stable framework and I hope that in the longer term, more people will just jump in and educate others which could speed up things around this.

### Question 5: Biggest challanges of the Hanami Team.
:::quote from Hieu
What are the main concerns of the team about the development of Hanami?
:::

**Seb:** I have now maybe a bit more problematic questions about the current situation. Hieu also asked about the main concerns you guys have or the main struggles that you have around the development of Hanami.

This is a pretty general question but I thinki it's important and I believe that people do not ask about it enough.

**Do you struggle with anything at the moment and how people could help you on that?**

#### Maintaining time

**Tim:** At least for me it comes down to what Luca just said before, which is we're playing with this resource called time. 

Time is very precious. We have people with young families and jobs and all these sorts of things, and at the same time, this big fat vision for what an advanced Ruby framework might look like.

And putting those two things together is hard. Anyone who's followed Hanami and our work will know that it's taken a long time to get where we've got to and it's still taking some time to get where we're going. 

**So just maintaining that momentum is, is the biggest challenge.** I think, however, that **we've been able to show the community that we're serious about delivering on this.**

I think the community understands that we're a small team. They're behind us, willing to be patient and the things that we do release people are excited about. You asked before about what we plan to do once we sort of rounded out the vision. 

**I'll, I'll try and get some more sleep!**

You know, because it's, it's been a bit of a hard slog. But that's it. That's been the hardest part. **We know the steps we need to take to get where we want to go**. It's just a matter of finding the time to execute them. And, and we're doing it. 

One of the things I've had to learn personally and learn working with the others in the team is that It's important to not burn ourselves out because we are part of, like, the future of Hanami as well as its present, and we need to be patient with each other because this is open source.

We're just giving this up ourselves and that's all we can ask and just be kind to ourselves as we go.

#### Extending the team

**Seb:** Mm hmm. But what if, as the time is the biggest problem and you're a small team... So what do you think about increasing the number of people in the team like helping the community to find out how they can help you with the development and maybe rise-up the next generation of developers?

**Tim:** Yeah. I mean, I see this mostly as a bootstrapping problem. We just have to get over the hump to 2.2 because then the vision is complete and everything from there will be refinements, iteration, and small bug fixes. And that's the perfect foundation from which people can begin to contribute more to Hanami if that's their interest.

It doesn't stop someone from doing it now. 

It's just that you sort of have to understand a lot of pieces that are still in flight, and you know, we have had some people make themselves known to us, and we've had a few good contributors, even as the whole work has been in flux over the last couple of years.

But that is understandably a much taller, a much bigger ask, a much bigger challenge for potential contributors. So this is the other side of the challenge too, if we stepped back and then decided to prescriptively write down every step that we need to take with the hope that someone out there might claim a ticket and do it for us, or how much time might that take?

And will that push forward the eventual completion of all these things by another year or something like that? So I think at least from my perspective, I'll let Luca weigh in in a second if he feels like it. 

We've decided to just try to get things done and recognize that, yes, this is a transitional period.

It's the last such period that we're going to put the community through, and we appreciate everyone's patience, but once we get out the other side, and we're already seeing what that begins to look like.

We've delivered 2.0 and a bunch of gems, we'll be in a much better place for 2.0 folks to contribute, fix bugs, and so on.

**Seb:** Thank you very much!
### Question 6: Do you provide a support for a migration path?
:::quote from Hieu
The migration path from Hanami 1.3 to Hanami 2 is steep. What is the plan of the core team to address this problem?
:::

:::quote from Lucian
Is there anyone using Hanami 2 already in production? Or parts of it? What advantages do they see running on Hanami 2?
:::

**Seb:** So the next somewhat related question. 

There are companies that do use older versions of Hanami and I'm responsible in Ascenda for upgrading Hanami from 1.3 to 2.2 and I cannot lie - It's steep. It's definitely a challenging task. 

What are the plans of the core team to address this problem? Like, is there anything, anybody, any company, that upgraded Hanami already? Do you have maybe a list or a group of companies that use Hanami 2 in production?

Maybe there are companies that already updated the Hanami applications that we could reach out to in case of problems and like compose this group experience to define the guidelines of the, of upgrading process?

:::tip The Unofficial guide to upgrade Hanami applications
I've put together the [partial log of our team discovery to upgrade Hanami apps](/articles/unofficial-hanami-upgrade-guides), but this Is WIP. Check it out though, if you do struggle with Hanami upgrades, maybe it'll be helpful to you!

**Luca:** I asked you to give hard questions to Tim, but here we are! Joking!
So here's the thing that I see at the moment. 

I consider this as a personal thing we never discussed with Tim, but I consider Hanami 2 as a moving target, meaning that we know that 

- 2.0 was the core Hanami 2.
- 2.1 includes views and assets
- 2.2 persistence. 

And that's it. But the migration. T**o do an upgrade, upgrade guidance, and upgrade guide documentation, you will need a stable target.** 

This means that, Once you know exactly the API that we will release in terms of software design, then you have the target.

Hanami 1.3 is the starting point, and 2.2 which is the end point of the journey.Then with all the details that are precisely set in stone, you can do the migration path. 

This is why we haven't explicitly focused yet on the migration path, because we are still moving with with with the evolution of anatomy 2.x series, and that is my personal take on it regarding real-world experience. 

I know, Seb, what your company is doing.

You're working on the migration, even though it's painful. Sorry about that. 

We would like to leverage that experience and I know other companies that are working with Hanami, but they are still on version 1.3 so I can't provide you a list of people that are embarking on the same upgrade journey, but it will happen in the future. 

Meaning that I don't have concrete answers for you today. Sorry, but better to be honest, I believe. The upgrade path was not yet in our roadmap, however we'll never allow such upgrade troubles in the future.

**Seb:** Having in mind that there are like. 8 billion of people in the world **it's a super awesome feeling to be the first one in something**. So yeah, I don't mind. I will continue with the upgrade and forcing the truck. 

**Tim:** I was about to say the same thing. We are hugely appreciative of what you and your team at Ascenda are doing. And we're looking forward to it. Like taking what you learn and incorporating it into a first-party upgrade guide. It's going to be a huge boost for everybody.

**Seb:** Cool. Thanks. 
#### Contributing, and tracking the roadmap.
:::quote from Gustavo Q
How someone can start contributing to Hanami, all open issues looks like are related to Hanami 1.x

:::quote from Hieu
What could people outside of the core team help with the development of Hanami? And how?
:::

**Seb:** There is, there's one more, one more question related just to the contribution.

A lot of issues on the GitHub are related to Hanami 1. If people want to contribute, if they want to help you, while taking care of the responsibility of finding out how to solve and understand the context, where they should find actual tasks?

#### Trello board and the Github Projects.

**Tim:** We have a **Trello board** that we've been using just informally because, especially for this phase of the work, a lot of the work has been sort of discovery in nature and exploratory. 

For instance, Luca was breaking a lot of brand-new ground as we were figuring out how to incorporate a front-end asset system to fit into Hanami.

So we couldn't specify it in, you know, a single GitHub ticket-sized unit. But we did have a Trello board that we use or that I use at least to sort of note down things that I feel need to be done as part of a release.

Recently, however, we've started [maintaining Github Projects](https://github.com/orgs/hanami/projects) for each upcoming versions where tasks listed are more fine-grained and it's easier to collaborate this way.

:::tip Hanami GitHub Projects
Check out the [Hanami Github Projects](https://github.com/orgs/hanami/projects) for contributing to upcoming Hanami versions!
:::

So if people want to go see it, it's a public GitHub Project. You can go check it out. And then I think if there's something in there that someone wants to do you can reach out to us in the forum or something like that. 

Just make yourself known and we can work with you.

**Seb:** Thanks! So let's jump into the next section. We actually finished up with the Hanami-related questions or Hanami-focused questions. Now I will jump to the dry-oriented one. There are just a few more questions to be asked of you.

### Question 7: Hanami and business logic, relation to Trailblazer?
:::quote[Drowze]
How would you compare the DRY ecosystem compares itself to Trailblazer?
:::

How would you compare the dry-ecosystem that compares itself to [Trailblazer](https://trailblazer.to)? What would be your recommendation for the business layer in Hanami applications?

I refer here to the *hanami-interactor* gem that we had in the Hanami 1. There is nothing like this in Hanami 2. So even if there will be no official gem for the Hanami 2 to support the business layer what would be your recommendation?

The interactor pattern? *dry-transaction*?

Maybe even not an official one, just share your personal opinions for people to implement business logic, especially advanced business logic in Hanami applications in the near future.

#### About Trailblazer

**Luca:** Okay, let me start with the DRY versus Trailblazer. I would say T for simplicity. So I believe that both are great ecosystems and I can think on top of my mind about three main differences. 

##### The first one is about a philosophy. 

I mean, *dry-rb* is a set of small libraries, whereas Trailblazer is a high-level architecture framework that sits on top of Hanami, or on top of Rails.

So the level of abstraction here is different
##### The second one is about a learning curve.
With the *dry-rb* you can cherry-pick single-purpose gems, and you can learn just validation, just CLI, just... Whatever you need in your, in your Ruby app.

With the Trailblazer, however, you have to learn a framework on top of the existing frameworks that you use as a base.

Again, you can use it on top of a Hanami, you can use it on top of Rails. So you need to learn either one of those anyway. So I imagine the learning curve to be maybe not more steep, but bigger than just picking one of those *dry-rb* libraries you need. 

##### And the third one is about the flexibility.

Again, because you can have single-purpose gems with *dry* out there, you can have your own architecture.

Utilities that you embed, you use to enhance the possibilities of your code base. 

Whereas Trailblazer is more prescriptive. Prescriptive of how you need to structure your business logic. 

So again, it's the philosophy of learning curve and flexibility as differences between these two ecosystems.

**Seb:** Nick Sutterer, the author of Trailblazer reached out to me in the past and his addition to what you just said was, that those are not competitive solutions. *dry-rb* gems are not competing with Trailblazer on the same users and the same use cases. 

And that was the eye-opening for me.

He also mentioned that some of the Trailblazer libraries actually use dry libraries under the hood. That was an example of what you just said, that dry libs are just utilities that you can use to produce any kind other solutions. 

According to Nick, Trailblazer addresses the business layer itself.

It's not related to any kind of framework like Hanami nor Rails. Or anything particular the, the web or, or, or anything like that. Thanks!

#### Hanami vision on business logic. TODO

**Tim:** Now about what our vision might be for and helping people model their business logic in Hanami. 

This is something that I think we want to include in the full-stack Hanami app. And honestly, I expect this might come more from the *dry-rb* layer, because that layer of gems already provides a lot of valuable tools for modeling your business logic.

When you combine the *Deps* mix in what you get with Hanami - which in itself is implemented as using a *dry-system* gem - along with gems like:

- [dry-monads](/episodes/7-untangle-your-app-with-dry-monads) for structuring your success or failure return values and letting them be composable in interesting ways.
- [dry-validation](/episodes/20-dry-validation) - for checking your business logics input, 
- [dry-structs](/episodes/10-dry-structs-in-action) - for sort of modeling the things you pass through your business layer in a type-safe way

Isn't it already a really incredible combination for modeling, decomposing, reusing all your units of business logic? With Hanami 2, I think we'll want to maybe provide a few of those things.

So they're ready for you to use out of the box as an opinionated first step, but of course, do so in a way that lets you remove them if you'd rather not use them. 

The one thing that I do think we could explore is providing a successor or next evolution for something like `dry-transaction`, which is a gem that I wrote quite a long time ago to help people dip their toes into the monadic composition of, you know, business logic and business transactions.

I think that as a team, we want to get behind one solution there. I personally think *dry-rb* is the right layer for that because this is something that can be useful for all frameworks. And we can just provide an easy-to-use, ready-to-go integration for new Hanami apps from there.

But in the meantime if anyone's interested in thinking or exploring the space, if you haven't looked at it yet, go check out [dry-monads](https://dry-rb.org/gems/dry-monads). Don't be scared by that term. Go check out the *do notation* page because this right now is my happy place in terms of how you can put together your business layer.

It's just a really expressive, simple Ruby approach for combining multiple steps of a sequence of business flows in a safe way, such that any failure along the path immediately short circuits. The rest of the activities and returns back to the caller and using success and failure objects as a consistent way for wrapping up the results of your business operations is a powerful approach.

It helps you consider failure as a first-class concern. It helps you tie together things in a safe way. And so I think we have all the ingredients already there and people can go to work really productively with those tools that already exist. With Hanami 2, we'll probably just try and find a way to just tie a bow on top, just to make it a little bit nicer, a little bit smoother, and so on.

But I don't think we have much to do.

**Seb:** Yeah. And I want to mention that *dry-monads* was one of the key libraries that drove me to Hanami. I have at least two videos published about, it, like [handling errors in actions](/episodes/35-halt-or-handle)  and one of the most popular videos I have ever released is about [how to leverage this business logic using dry-monads inside of the Rails applications](/episodes/7-untangle-your-app-with-dry-monads).

So yeah, there are plenty of possibilities, and thanks for providing this. This is indeed amazing!

### Question 8: Recommended learning resources and learning paths
:::quote from Kristina
Hanami/dry-rb takes a very different, foundational approach than a lot of "how to program in Ruby" books or tutorials. Any recommendations of good resources for Rubyists to build the understanding of this more functional approach to Ruby?
:::

So I have one more question from Kristina about the learning resources and book recommendations. Hanami and *dry-rb* take a very different approach from the majority of the Ruby community - at least form those with a rails background, and Rails is a prime.

So the question is if you have any recommendations of good resources for Rubies to build an understanding of this more functional approach to Ruby?

**Luca:** I would start with a simple and easy one - [Hanami Mastery](https://hanamimastery.com), and thanks, Seb, for that. What else? I believe that there are a couple of Talks that Peter, Tim and I gave the different times where we tried to explain this blending of OO together with FP. Blending in a way that feels natural because we believe that Ruby is a multi-paradigm language. 

And when you look from another perspective the things that we are asking in reality look very natural to Ruby, if you think about the concept of callable objects, single-purpose objects, it's a very old concept that exposes A method.

You can combine, and chain functions together. That is very inspirational when you look at these basic building blocks and you start to get a sense of them. You understand that Ruby is the perfect language to blend those two paradigms.

**Seb:** Thanks. Tim, any thoughts?

**Tim:** I, also have done some talks, like Luca said, [I have an easy list of them](https://timriley.info/speaking) from all over the years. They're all variations on the same theme because what I've learned is that **it takes many years of repetition to help land an idea in a large community**.

But one of them might resonate with you.

It's important to realize that this is actually a journey. And there'll be you need to try and put yourself into a place of discomfort in order to learn new things. So I think it means trying some of these tools and actually thinking, how might you use these in your day-to-day?

Now, you might not go and add it to your production code base at work, but you might try and implement a similar thing you know, in a toy app or something like that, and see how they look and see how these things tie together. 

What does it mean to model your business logic using *dry-rb*?

Certainly, It's my journey to eventually find myself on the *dry-rb* and the *Hanami* teams. **It came from watching a talk from Peter** and seeing him talk about that functional OO blend and thinking, wow, that's the way I want to build Ruby! 

And then I just started stalking him on GitHub and tried some of his gems and tried to build an app using a collection of them.

The first app that I tried this with, I tell you, it was pretty crappy. And I felt pretty uncomfortable. It's like, *"wow, this feels different!* You don't know how to do this next thing but you just try it and you try it again and you try it again and suddenly at some point something unlocks in your brain and you know, some neurons connect or you realize: *"ah, this is why it can be done this way"*.

And here's a benefit that you get from this kind of structure. Ah, this tool works best if I yield it in this particular spot, and then things start to feel a bit more natural. So I think. And I think, yes, it's true that this is a style of Ruby development that's not well represented by a lot of information out there.

Aside from Hanami Mastery and our collection of conference talks and a few blog posts, there's probably not all that much else. But I think the right thing to do is just to try it and then to ask questions.

What we have now that I didn't have when I started, are the [Hanami](http://discourse.hanamirb.org/) and [dry-rb](https://discourse.hanamirb.org/) forums! They are great places to go and talk about the things that worked well for you, or that didn't work well for you. 

There are enough people in those forums to get some responses. You'll find some like-minded people to bounce ideas off in the future. So I think that's what I would recommend. 

**Seb:** And also what I have found, the worst, or the most challenging in terms of regular content creation is regularly coming up with the ideas that are needed by the community that people need to watch and learn.

So if any of you ever have any idea, any concern, or question that I could address, prepare and explain a Hanami mastery article or a video - please share! This way we can help to understand and build awareness of the functional approach to Ruby in the long term.

#### The butterfly effect story.

**Seb:** Thank you very much, guys. I will share just a side note about **Peter**, from when I was a junior back then. Around 10 years ago Peter visited Wrocław at a local conference. 

And his talk about ROM was one of the first I ever heard. I understood nothing but the seed he put in my heart and in my brain actually grew up over time.

When I was working in Rails over the next years, I always felt something was wrong with the approach people and companies had when they built applications in Rails and the result is that I'm here, and I'm doing what I'm doing. 

So yeah, sometimes you don't expect results. You don't know which of your actions will actually result in something unexpected.

So thanks. And thanks to Peter who sadly could not be here today.
### Question 9: How to Increase credibility of companies?
**Seb:** We are heading into the end of this interview and there is one question left. 

It is from me, actually. I want to challenge you to figure out this. 

:::quote from Seb
How to build better credibility for the Hanami core team, to its development, as a stable long-term project? what could we do, or what could you do to increase the credibility of companies so they will start using Hanami 2 at scale? 
:::

By increasing credibility, companies may support the development of Hanami and related libraries. What are your thoughts about that?

**Luca:** A phase after, the code completion, but the first thing that we are already working on, is the documentation because that is crucial for anybody to even try it. 

From there, I believe the **key elements here are showcases of success stories of brave companies like Ascenda**. To showcase that they can build a business on top of it.

That can start a good cycle of reinforcement. [First people that are brave enough to try it will set an example for others to follow](https://www.indeed.com/career-advice/career-development/first-follower-principle) showing that it's possible to use Hanami successfully.

The other element is about educational resources - again, thanks to you with the Hanami Mastery, because that can solve the problem of a developer in a day-to-day job saying, "how do I do this with Hanami"?

Where there is a problem at hand, then those kinds of resources of content comes handy to unblock people and to unblock in terms of productivity, alongside, with documentation of the framework. 

If you put those two elements together it is to build a strong community where there is our hope that companies and agencies will start to provide training and professional support. 

And so that is. With a cycle that positively reinforces itself.

## Wrapping Up and "Thank you!" section

**Seb:** Thank you very much for the answers and all the time! That's all I have prepared for today. 

Now this is "the thank you" block. I have prepared a little special block for you guys, because I feel like nowadays on the Internet and in the World in general, there's too little appreciation and gratefulness everywhere.

I wanted to provide some chance for you to practice and maybe there is a person or multiple that you are explicitly grateful for the fact that you are where you are at the moment in your career, in your life. 

And yeah, would you like to share some in public?

**Tim:** Sure. I'll, I'll keep this a Hanami themed though.

I think I have two groups to acknowledge here. The first is my family. I have a wife and two children -nine and seven this year is their ages. And... Honestly, they've supported me across many years in sacrificing time away from them to contribute to this weird internet software thing that is a foreign concept to them all.

And without their support, I wouldn't be here doing this. So they deserve a big **thank you!**. 

Then Luca is the primary author of a framework called Hanami that existed way before I sort of came in with all my own ideas about stuff.

And what I've really appreciated about our collaboration is the meeting of the minds and learning on both sides. Learning what inspires each other about software and fusing that into what I think is something that is greater than the sum of its parts. 

So I want to thank Luca for welcoming others into his vision and for in particular listening to my ideas and helping us find places for those in the framework.

We're delivering. It's been a really enjoyable collaboration and I'm looking forward to doing it long into the future. 

Thanks Luca! Your turn. Look, you don't need to take me back, by the way. I just want to say that no pressure, no pressure!

**Luca:** No, no, no, no. I have to. I have to. Not because of what you just said, but because it's true, I started Hanami and I believe that Hanami one is my creature. 

However, I believe that when it goes to Hanami 2, all the credit goes to Tim because he made himself accountable. He poured into the vision, evolved what Hanami was in the past, and actually coded, embarking on this journey of rebuilding the core of it. 

That is an immense "**Thank you**" from my side.

For other people let's not forget about [Matz](https://twitter.com/yukihiro_matz?lang=en) who invented the language that literally changed my life.

Finally, one credit goes to my best friend.

His name is David and he knew about my interest in Ruby more than I did. I was 2005 and he sent me a link to a job opening here in Italy, and that was the first one and that gave me the ability to start very early in the community working professionally with the ruby.

Those are the coincidences, that sliding doors moments where they change your life.

That's my list. 

And again, Seb, thank you for having us. Thank you for spreading the Hanami word. 

**Seb:** Thanks again for coming! It was amazing to talk to you. It was a blast and thanks for all of your work because without your dedication and sacrifices, I would have nothing to write about.

So yeah, pretty much appreciated. And I hope we have a chance to repeat that on the 100th episode or something like that. 

At the time when Hanami will have the 5.0 version or something. So see you then!

## Summary

I hope you've enjoyed this episode, despite being not something we had in this channel before. 50 episodes is an important milestone for me, and therefore I wanted to make this one special.

If you don't want to miss future episodes, **Subscribe to [my YT channel](https://www.youtube.com/c/hanamimastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!

See you soon!