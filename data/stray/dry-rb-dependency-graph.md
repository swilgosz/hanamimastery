---
id: 4
author: "swilgosz"
tags: ['dry-rb', 'backend']
title: "I've made a dependency graph for DRY-RB Ruby gems family"
excerpt: "Have you ever wondered which DRY-RB library learn first? I did when I started with DRY-RB. I hope this will help!"
publishedAt: "2021-07-27"
thumbnail:
  full: /images/articles/dry-rb-dependency-graph/cover-full.png
  big: /images/articles/dry-rb-dependency-graph/cover-big.png
  small: /images/articles/dry-rb-dependency-graph/cover-small.png
source: https://github.com/hanamimastery/episodes/tree/main/001
category: stray
---

When I've been starting with DRY-RB family, I've been wondering, **what the hell should I start learning first**. Which gems are the best to learn at the beginning, and **which one I should skip**?

Recently, when I've been browsing through the DRY-RB discourse forum, I went through a post from Jed Schneider, [suggesting a visualization of dependencies](https://discourse.dry-rb.org/t/documentation-help-wanted/1212/13) for a DRY-RB family. I think It's a great idea, so here it is!

### Full DRY-RB dependency char

This network diagram shows connections between all the official [gems from DRY-RB organization](https://dry-rb.org/gems).

The darker nodes are representing **external dependencies**.

![DRY-RB full dependency graph with external deps](/images/articles/dry-rb-dependency-graph/dry-rb-dependency-graph-full.png)

It was surprising to see, that except `concurrent-ruby`, there are almost no external dependencies. There is `ice-nine` used for creating deeply frozen objects for structs, but other than that, it's pure Ruby! Amazing!


### DRY-RB no external dependencies char

This diagram shows **only internal gems connections**, for a more simplified view. There are several gems that have no dependencies at all, like `dry-transformer` which I['ve already made an episode about](/episodes/6-complex-ruby-data-transformations-made-simple) or `dry-equalizer`, or [dry-inflector](/episodes/4-string-transformations-with-dry-inflector). **All of them are very small and focused on doing a single task**, which makes them easy to be used in different scenarios.

![DRY-RB internal dependency graph](/images/articles/dry-rb-dependency-graph/dry-rb-dependency-graph-internal.png)


**You can quickly identify also key gems** for the whole DRY-RB ecosystem, like `dry-core`, or `dry-container` which are designed as a base for building more complex gems and libraries. Of course, you still can use them directly in your apps if you see the benefits from it, but it may be harder to find a use case for them.

### Sorting DRY-RB libraries based on connections.

The philosophy behind the DRY-RB ecosystem is **to provide simple gems that perform single tasks** and **can be connected together to build more complex abstractions**.

Therefore there are gems that are easily applicable for complete web applications and designed to be used within them directly, but also gems that are meant to be used to build other gems and libraries.

Based on the dependency graph, and links between multiple libraries, you can identify some gems that are meant to be used in the applications directly, and others, that can should be rather used as a base for other libraries.

**For example. **

#### 1. Application-level gems

`dry-rails` depends on `dry-validation`, `dry-system`, and `dry-schema`.

As `dry-rails` is a pure integration with Rails applications, you can safely assume, that if the core team had put an effort to integrate those three gems with rails apps, those are the entry points to the wide range of application-level use cases.

If I'd have this graph when I started learning DRY-RB, I'd be super happy, as it would remove a lot of overhead from me allowing me to focus on what's easiest to adopt in my web applications.

#### 2. Low-level gems

A lot of gems depend on `dry-core`, `dry-container`, which may give you an idea, that those two gems are very useful, but maybe not for direct usage but rather for building your own ruby libraries.

#### 3. Standalone gems

This is a bit misleading because each of DRY-RB gems is "standalone" and can be used independently, only with its own dependencies. However, some gems stand out in front of others even on the graph above, as **they have no dependencies and nothing depends on them**.

It's worth checking out why those few gems had been created. **What kind of tasks had been so important**, that they required separate gems to be built?

`dry-transformer` ([see episode #6](/episodes/6-complex-ruby-data-transformations-made-simple)), `dry-equalizer` or `dry-files` are gems that allow to solve common ruby problems without loading anything else.


### Summary

While this graph is useful as a starting point, **you cannot figure out everything**. For example, one of the most common problems in programming advanced components is solved by `dry-configuration`. I've talked about it in [episode #4](/episodes/5-configure-anything-with-dry-configurable), however, you cannot figure it out from this graph.

Also, an amazing micro-library used for string transformations, [dry-inflector](/episodes/4-string-transformations-with-dry-inflector), have no dependencies, but **it's hard to figure out that it's a completely standalone gem**, easy to be used everywhere.

To know such things, you will need to go through the [DRY-RB](https://dry-rb.org) documentation or **subscribe to our newsletter** and **follow me** [on twitter](https://twitter.com/hanamimastery)**!

I'll soon publish more episodes and tricks related to DRY-RB family.

<br />

<EmailSubscriptionForm />

<br />
Also, If you have any suggestions of amazing ruby gems You'd like me to cover, or ideas on how to improve, please mention it in the comments!

### Special Thanks!

I'd like to thank Andreas Wagner and [Thomas Carr](https://github.com/htcarr3) for supporting this project on Github sponsors! I really appreciate that!

If you enjoy this project, consider [sponsoring me on Github](https://github.com/sponsors/swilgosz)!

Any support allows me to spend more time on creating this content, promoting great open source projects.

Thanks and see you soon!
