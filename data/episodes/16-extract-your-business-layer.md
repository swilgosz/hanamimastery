---
id: 16
aliases: ["HMEP016"]
author: "swilgosz"
topics: ['hanami', 'rails', 'architecture']
title: "Your app is not your business!"
excerpt: "Check out these 4 ways to separate your business logic aside of your application layer in Ruby applications."
videoId: intcf3jzzn8
publishedAt: "2022-03-01"
modifiedAt: "2022-03-01"
thumbnail:
  full: /images/episodes/16/cover-full.jpeg
  big: /images/episodes/16/cover-big.jpeg
  small: /images/episodes/16/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1498508207928586243
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/t3yqyl/your_app_is_not_your_business_4_ways_to_separate/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/t3yrgp/your_app_is_not_your_business_4_ways_to_separate/
source: https://github.com/hanamimastery/episodes/tree/main/016
---

### My story - designing your domain

In this episode of Hanami Mastery I want to talk about something different than usual, touching topic that was on back of my head for a while already. Today I won't cover a particular gem nor tool but rather the approach to tackle the **difficulty of solving business problems using software**.

Below I describe **4 ways of implementing business logic in your Ruby apps** to simplify your architecture and untangle your application code.

1. Arkency and their DDD
2. Trailblazer
3. Hanami Slices
4. Rails Engines

### App framework is just a tool

In my career I experienced a lot of suffering while translating the business expectations to technical requirements and solutioning the detailed approaches using our CRUD-based web applications.

While it worked pretty well at the beginning, over time it appeared not being enough. The problems we were solving and processes our apps helped to manage became much more complex and the simple Create, Update and Destroy actions were not only not enough, but they became hard to understand by non-technical people, who actually used this tooling. It can be acceptable if only people using the software are your internal employees, but the bigger the company grows, the bigger issue it becomes.

And what if your clients are using your software too? And they try to communicate a problem, but the words chosen there are nowhere near something reflecting the implementation?

One very simple example could be, when company manager forwards the job application comming to our system to someone else to tackle.

![Forwarding job application](/images/episodes/16/forwarding-app.png)

It can be mapped to something very crud-ish, like: Update the Job Application by setting different person responsible, but people can get confused by this.

Or let's assume I get a request from person not getting the refund for the product they submitted for a complaint. Can you spot how much translation it requires to explain that to technical engineers?

![Complain request](/images/episodes/16/complain-request.png)

And the similar translation is required back for the end-user to understand what is happening.

![Complain response](/images/episodes/16/complain-response.png)

There is an extremely well done video by Mayer Zombade that illustrates this problem better than I could ever imagine, so feel free to check it out in the text version of this episode. It will be also the first link you'll see in the description.

<YoutubeEmbed embedId={'tUOiO4dN65Y'} />

In all those cases there is a big need to translate the business requirements or expectations to technical language, which often generates confusion and it's easy to miss important concepts.

### Limiting your thinking by framework

This happens, because we developers tend to think about solving problems by applying solutions that suit to the tooling we use, **often being limited by that**.

Complex processes, however, may be very hard to be mapped to a few standard API endpoints.

Imagine, if you have internal currency in your system, where your 1 e-coin equals to $1 (USD).

![](/images/episodes/16/coin-usd.png)

Then you may expand your area to other country, let's say: Canada, where 1 e-coin equals to $1 too.

![](/images/episodes/16/coin-cad.png)

Next, one of our US users would love to transfer owned points from his account to their friend in Canada. You'll immediately see the problem, that canadian dollar is not equal to US dollar, and every day, the relative value of different currencies can change in multiple ways.

Then the transaction_amount can mean completely different thing in different contexts.

![Bad transaction](/images/episodes/16/bad-transaction.png)

I send different coin amount that the receiver got at the end of the transaction as the single e-coin in US can not match single e-coin in canada anymore.

This is only one trivial issue to solve, but I just want to tell you, that business processes may become quite complex very quickly due to the fact that most of easy problems are already solved.

A while ago our development started to slow down significantly due to circular requirement clarifications and infinite loops between business and engineering teams unable to communicate clearly what is happening on neither of sides.

![Development speed over time](/images/episodes/16/development-speed-over-time.png)

So we started looking for solutions in the field of better mapping of our system to what business wants and does.

### Discovery of DDD

One nice way to tackle that problem is the [Domain-Driven Development](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215) - an approach described by Eric Evans in his Book published in 2003.

He described it by a series of different patterns, that were further evolved by others who adapted his ideas.

I totally recommend this book for anyone interested in working on non-trivial, real-world business problems and scalable applications.

#### Separating App from business.

The key part covered here, is that with a proper design, we could very deeply understand the business domain and processes on the engineer part, we can use the same language while talking to each other, and we can build highly reliable software, building exactly what is needed, and skipping everything else.

[As Martin Fowler says](https://martinfowler.com/bliki/DomainDrivenDesign.html), Domain Driven Design centers programming the domain model with high understanding of business rules and processes. With this approach, you start seeing benefits of designing your apps in the way they are independent on the frameworks they use, as it becomes very much clear, that Business Layer is the most important, and unique part that gives your company the advantage, while everything else is just a tooling, providing interface to interact with this unique part.

This is where I started putting to my projects a clear separation between the business model and rules, and the application.

![Separation of business and application layer](/images/episodes/16/separation-of-business-and-application.png)

Instead of mixing it all together, I use application layer as an intermediate adapter, communicating with business only via the unified interface.

### Existing solutions

In Ruby ecosystem, this idea is more and more popular, and I am happy that there are already several very nice approaches implementing it quite well.

#### 1. Arkency with their DDD

The first way I want to mention is the [Arkency](https://arkency.com) company, which designed and introduced to the Ruby ecosystem DDD with event-sourcing, having a lot of success with refactoring huge unmaintainable rails monoliths into more robust structures, where multiple contexts are split apart.

I'll simplify it quite a lot here, but to dive into more details of their architectural concepts, I totally recommend to check large number of learning resources they publish, together with plenty of commercial online courses they created.

Arkency evangelises integrating Event Store in most of the complex applications, to streamline the data flow and untangle coupled codebases by adapting CQRS patterns in rails applications.

They are authors of *RailsEventStore* and *RubyEventStore* gems, and tons of learning materials oriented around working with events in web applications.

##### Approach

Applications made by Arkency are mostly written in pure Ruby, giving the Rails framework very limited responsibility over the majority of the code. You may find there controllers, grouped, within folders, or even Rails engines, but they're only serving as an entry point to the Business Layer, oriented around different contexts.

Within contexts, You will find among the others.
- **commands** - a small, read only objects showing intention of the user,
- **command handlers** - objects asking aggregate if command is allowed, and publishing relevant events
- **aggregates** - the decision-making objects whose the whole purpose is to decide whether we can or cannot perform given command in the actual state of the application.
- **Events** - immutable facts that happened in our system
- and **Event Handlers** - objects updating the application state when relevant events are published.

##### Pros of Arkency style

What I like in this approach is that they are unafraid of additional abstractions, and add to the system always what makes sense for the business they work with, not limiting themselves to have only Models, Controllers, and additional Service Objects.

Their business layer is the biggest, and most important part of the system, while kept pretty much independent of the framework it's injected into.

What I value a lot in their way of coding, is that they keep using terms common to the whole Domain Driven Development ecosystem, which makes it easy to understand their implementation as soon as the general DDD theory is adopted.

Under the hood they heavily use DRY libraries, which allows them to keep great flexibility and keep the code well organized, and simple.

##### Cons of Arkency style

There is only one piece of Arkency apps (at least in those I saw from courses, consults and their OSS acitvity), where I could see some more love to be put. I found there is a bit lack of convention with their approach, which may or may not be a good thing.

Personally it got me confused a few times, when In one app I saw Bounded Context put within `contexts` folder, sometimes in lib, and in other apps, just scattered in top-level of the application, without any wrapper.

##### Summary of Arkency style

Most of Arkency's work is a double-edged sword. They experiment a lot, developing astonishing architecture, delivering to each of their new clients constantly better results by learning on their past experience. However, this means, in multiple applications you can get slightly different implementations of the same thing, and that is harder to follow and map to each other or decide, which is the better one.

I got very much inspired by their way of thinking and tackling problems, and worked on top of their ideas for a few years and they had great impact on my way of thinking about web applications.

I totally recommend to check some of their books or courses, to help our minds open at least little bit.

#### 2. Trailblazer

Aside of Arkency, there is another, quite a bit movement in Ruby ecosystem, initiated by [Nick Suterer](https://github.com/apotonick) - a great Ruby Developer, heavily engaged into Open Source community, **giving numerous talks and publishing a lot of learning content** on his own. He created a standalone framework, within pure Ruby, which solely focuses on business layer of your apps.

The framework is named: [Trailblazer](https://trailblazer.to), and thank to its narrowed focus, is a powerful tool allowing even very complex business domains to be clearly implemented, using common wording and a deep understanding of processes that are solved by the tools we create.

##### Approach

The central part of the framework is the Operation, which serves as a service object of some sort, but designed in a way it's always easy to test, modify, extend, and handle failures. It allows to validate input, authorize activities, perform actual steps, and many, many more that I cannot cover just yet, but strongly recommend to check [Nick's Trailblazer tales Youtube channel](https://www.youtube.com/channel/UCi2P0tFMtjMUsWLYAD1Ezsw) when he started publishing neat tutorials for beginners.

I have way less experience with Trailblazer (yet). I did check it out in the past when I evaluated Trailblazer and the Arkency approach for my previous clients.

It was quite an early stage of Trailblazer when I evaluated that for the first time - funny thing, the same applies to evaluating Hanami 2.0. It's just not easy to be an early adopter of innovative solutions (heh!)

Since then, however, Trailblazer has evolved a lot.

##### Pros of using Trailblazer

The nicest thing about Trailblazer is what I often say about DRY Libraries.  **It does the one thing - mapping business to the system - and does it great.**

With awesome documentation and a growing number of learning resources around the topic, it's easier and easier to adopt it.

They Implement dedicated abstractions for actions that can happen in the system - named `operations`, and for processeses - these are named `workflows`. Aside of that, they provide solutions for fine-grained authorizers, logic-free application views, and many other parts of your systems.

I like this because it's a framework, with documented conventions, concepts, names of different components, great active community, a lot of thought put into it, and numerous grateful clients proved how beneficial it can be

Oh, and it's worth to mention, that Trailblazer also sees the value of using DRY libraries as a building blocks for their components, to not reinvent the wheel again.

##### Cons of using Trailblazer

About the cons

While I do understand the benefits of trying Trailblazer, it was somewhat problematic for me to learn that at the beginning, mostly due to the fact that Trailblazer uses its own naming for most of the components. For example, View object is named Cell. Decorator is a Twin.

Even though I was already familiar with DDD at that point, I felt a bit overhelmed, and I am keen to check how this part improved at this point.

Also, aside of Trailblazer core, there are some gems solving most iconic Rails problems, like form objects, view objects and so on. It was not clear to me, where are the boundaries of which components take application and which business responsibility.

I guess that part could be better highlighted but it's all very easily fixable.

##### Summary of using Trailblazer

I checked trailblazer in details around 5 years ago though, and I was extremely positively surprised how much better it become since then.

This is definitely a big topic I'm going to take a closer look into, and prepare at least a few episodes about possible integrations of Trailblazer with Hanami Applications in the near future.

#### 3. Hanami Slices

The next approach to easier map the business domain in your applications Is [Hanami framework](https://hanamirb.org), with built-in slices. While Hanami is an Application framework, thanks to slices, it can play very well with both business domain approaches described above.

However, nobody stops us from implementing business logic in our own way just by leveraging rich slices features, for example, by adding [dry-transaction](https://dry-rb.org/gems/dry-transaction) to the gem stack.

##### Pros of separating business layer with just Hanami slices

Hanami is a complete ruby application framework, and we can minimize the number of dependencies if we leverage the power of the framework itself to implement our business. Slices by default are encapsulated and independent of each other, but because of [dry-system dependency management](/episodes/15-dependency-injection-god-level-part-2), we have a full control over making some pieces public and exporting some dependencies to other slices.

Hanami does not limit abstractions, and by its design, it encourages to create multiple slices for multiple parts of your system, similar to DDD Bounded Contexts.

Finally, just by using Hanami, most of the dry-gems are already in your stack, ready to be used.

##### Cons  of separating business layer with just Hanami slices

However, there are also some down sides of this approach.

While slices are great and extremely powerful, Hanami is designed to provide robust, general environment which we can use to build anything within, but easy mapping of complex business domains was not a focus, rather a nice side-effect of well-thought framework architecture.

Therefore, there are not too many developed patterns how to build business domains with slices yet and I am sure, in following months and years, multiple ideas will be shown on various blogs and ruby conferences, and we'll see, which appears to be most successful.

##### Summary of separating business with Hanami Slices

Using just Hanami Slices for mapping business domains in an understandable and clean way can be a very powerful and fast approach of prototyping applications, and I am eager to get more into researching this topic.

If you'll want me to share your ideas, reach out to me with your articles, talks or tutorials, and I'll do my best to mention them.

#### 4. Rails Engines

Lastly, It would not be fair to not mention Rails feature helping to split our applications to multiple pieces. It's powerful feature, easy-to-use, but definitely underrated and not popular enough, often also not used correctly.

[Rails provides *engines*](https://guides.rubyonrails.org/engines.html), that allow keeping code responsible for different contexts in separate places.

Those are **miniature rails applications** that can be injected into their hosts to quickly provide common functionalities. One of the most common Rails engine is the Active Admin gem.

##### Pros of using rails engines

In Rails applications, it makes a lot of sense to use engines to easier maintain different responsibilities, as it's built-in and easy to use.

##### Cons of using rails engines for business domain separation

Because of how Rails works, with always accessible dependencies, even if we'll use engines, **it's very easy to have our code coupled between multiple parts of the system**. Moreover, engines were never the main way of creating Rails apps in contrast to Hanami slices, where slices are used by default and completely encapsulated

Finally, the purpose of engines is quite different. **It's meant to inject shareable code**, not extracting the business layer aside.

##### Summary of using Rails Engines

For Rails applications, when it comes to implementing clear business domain, I'd always suggest leveraging one of the approaches listed above, either the Arkency's, or Trailblazer's way of solving this problem.

You may also extract the business differently, but doing things not *the rails way* within Rails applications can bring you a lot of troubles and all the custom stuff needs to be well documented, to easily hire new Rails developers.

### Summary

You may argue that only prototyping matters, and it's not relevant to extract business logic apart of the application layer, but I don't agree.

I am only working with long-term collaborations, and I understand, that to make this possible, I and my whole team need to easily understand all the caveats of the business requirements and processes.

Using the same language, while working with the same objects in reality as well as within the system abstractions is very beneficial long-term.

The problem is, that a lot of people do not care, similar to politics not carrying about anything that happens after their terms of office

I, as a developer, strongly believe that my long-term success is tight to the success of my clients and while I often need to agree on simplified solutions, I always look for long-term improvements, streamlining communications between multiple departments, and simplifying the overall architecture of the applications.

That's all for today, I hope you enjoyed this episode and you'll take some inspirations from it.

I am very glad that different communities are aware of this problem and they work independently on high-quality solutions, providing us rich pool of those we can choose from, allowing us to apply the one that best suits our needs or preferences.

I encourage you to give them a try in your projects too!

If you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/channel/UC4Z5nwSfZrUO4NI_n9SY3uQ)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!

### Thanks

I want to especially thank my recent sponsors,

- **MVP match** - which kindly agreed to join my silver sponsors tier with a great potential to closer collaboration in the future. They soon want to start an initiative to support open source developers and maintainers of different technologies. Kudos!
 - **Junyang Ng** - for supporting me in a highest personal tier
- and **DNSimple**.

Thanks for supporting this project, I really apreciate it!

By helping me with a few dollars per month creating this content, you help the open-source developers and maintainers to create amazing software for you and the whole Ruby community!

And remember, if you want to support my work even without money involved, the best you can do is to like, share and comment on my episodes and discussions threads. Help me add value to the Open-Source community!

If you know other great gems you wish me to talk about, leave a comment with `#suggestion`, and I'll gladly cover them in the future episodes!

Thank you all for reading, you are awesome, and have a nice rest of your day!
