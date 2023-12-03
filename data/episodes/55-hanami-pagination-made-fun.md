---
id: 55
aliases:
  - "HMEP055"
published: false
author: swilgosz
topics: ["hanami", "views"]
title: "Pagination in Hanami made fun!"
excerpt: "When you want to implement the pagination feature in Hanami, you'll quickly realize how annoying it can be, making all the repository methods accept the pagination parameters - unless you check out this episode of Hanami Mastery, where I implement pagination in a cool way."
videoId:
publishedAt: 2022-02-09
modifiedAt: 2022-02-09
thumbnail:
  full: /images/episodes/54/cover-full.jpeg
  big: /images/episodes/54/cover-big.jpeg
  small: /images/episodes/54/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/XXX
  mastodon: https://ruby.social/@hanamimastery/XXX
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/XXX
    hanamirb: https://www.reddit.com/r/hanamirb/comments/XXX
source: "https://github.com/hanamimastery/episodes/compare/HME055-pre...HME055"
---
Hi there!

Some time ago, in the [episode 32](/episodes/32-rom-pagination) I've covered a simple way to implement pagination in ROM-based applications. However,

1. Create a gem, hm-pagination
2. Integrate the gem in the video.
3. Bonus - explain the implementation details in premium video?

referenced [[11-effective-ruby-programming-with-dry-effects]], [[40-hanamismith]]

Context to access routes helpers
https://guides.hanamirb.org/v2.1/views/context/

I'll make use of the reader effect.
https://dry-rb.org/gems/dry-effects/0.4/effects/reader/

To validate types i'll make ue of dry-types gem. It's to minimize the dependencies as I shown in [[dry-rb-dependency-graph]]
https://dry-rb.org/gems/dry-types/1.0/constraints/


## Summary

I hope you've enjoyed this episode, and if you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/hanamimastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!

## Thanks:
> Use [[THME - Thanks]]
