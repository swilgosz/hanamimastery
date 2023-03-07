---
id: 38
aliases: ["HMEP038"]
author: "swilgosz"
topics: ["hanami", "architecture"]
title: "Intro to Apps architecture - Level 1: Context"
excerpt: "In this episode we are going to design high-level concept of Hanami-based Web application. In 2023 we're going to automate a few things, and create production-ready Hanami application, that will support our content creation."
videoId: "TDeuxcRrjpU"
premium: true
published: true
publishedAt: "2023-01-13"
modifiedAt: "2023-01-13"
thumbnail:
  full: /images/episodes/38/cover-full.jpeg
  big: /images/episodes/38/cover-big.jpeg
  small: /images/episodes/38/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1613836453829558272
---
Hi there!

During Hanami Mastery episodes production, I'm struggling with some repeatable actions, that I'd love to automate if possible. Without that, this generates unnecessary costs and delays. Moreover, it makes ME a bottleneck when it comes to releasing videos and articles more often.

**NOTE**: present: [Hanami Mastery App](https://github.com/hanamimastery/app) In this episode, I'm going to give you a short overview of one of the projects I've in plans for 2023 which will significantly simplify my workflows.

## Real-world Hanami application

I'm going to write a real-world application to optimize this process. It will be open-sourced and will be baked with Hanami of course.

Therefore, I'm going to record videos about implementing the core features and release them as part of my [Hanami Mastery PRO initiative](https://pro.hanamimastery.com).

Let's have a quick look at what to expect.

Enjoy!

## Episode publication process

In this diagram, you can see a visualization of what is needed to publish an episode of Hanami Mastery. Unfortunately, a lot of actions are required, to publish a single video with an article, and this is troublesome for me.

![Diagram showing current process of content creation](/images/episodes/38/diagram-old-rcreation-process.png)

### Scheduling an episode.

Currently, when I have an episode text, and video shoots ready, I send them to my team for production. In the meantime, I'm adding my `*.md` file to the Hanami Mastery repository and push to the episode's branch.

![Diagram showing current process of scheduling videos](/images/episodes/38/diagram-video-schedule-process-old.png)

When the video is ready, my team uploads it to the google drive folder, from where I upload it to Youtube and schedule it for publication.

Then I grab the video ID, and manually commit it to the `*.md` file.

NOTE: Present bullet points.
I'm wondering if we could simplify that into:
1. automatically recognize when the video is uploaded to google drive.
2. then automatically fetch the file and upload it to youtube
3. then grab the video ID, and commit to the episode's `*.md` file on the GitHub episode branch
4. Schedule a worker, that periodically checks episodes to publish, and merges my branch to master when the correct publication date appears.

That would be one part. Having sth like this will be already a huge help for me, but we can do even better!

### Image version preparation

The next part of the process I'm struggling with is image preparation.

At the moment, I have image versions for each episode thumbnail, and often some images are included in the episode content too.

Unfortunately, I'm preparing the image versions manually, because I work with static site generator, without any neat image optimization/resizing logic involved.

![Diagram showing current process of preparing versions](/images/episodes/38/diagram-versions-preparation-old.png)

But what if I could only come with 1 image version, and I'd have a script that resizes all thumbnails for me, and optimizes quality for web rendering, and then push them to the GitHub repository?

Jeez, that would be awesome and it is totally possible with Ruby, and Hanami, so why not to try?

But is it all?

### Scheduling episodes, and automatic publishing

In content creation, consistency is the key, and I do struggle with it, because I'm publishing my episodes manually right now.

![Diagram showing current process of scheduling videos](/images/episodes/38/diagram-publishing-scheduling-old.png)

It's impossible to publish every week at the same time this way, and automatic that part is crucial.

I'd love to have a backlog of 3 to 5 episodes ready, scheduled for publication, that I don't need to worry about at all.

This is what I'm going to improve in this year too, but there is one more piece of the puzzle.

### Publishing to multiple channels

I have the final part of this process, where every single episode needs to be published to multiple channels, to notify all of you about the release.

![[Pasted image 20221231061224.png]]

I don't mind, but it's freaking time consuming, and if we could simplify this too, that would mean wonders to me.

For example, because of [content_for :devs podcast](https://www.contentfor.dev) and NOTE: Show bullet points below. Hanami Mastery, I'm running
- 3 different Twitter accounts,
- 3 Mastodon accounts,
- 2 Facebook profiles,
- 2 Email newsletters
- ... and more

Then we have Reddit communities, twitter communities, facebook groups, Linkedin, custom notifiers...

It's a lot.

![Diagram showing current process of scheduling videos](/images/episodes/38/diagram-publisher-old.png)

Then, when I publish episode on Reddit and Twitter, I paste the posts URLs to the episode content, and commit again to Github.

I bet you feel the pain. **It's not optimized at all**.

So what about having an app to help you with it? Allowing you to publish to several platforms, several accounts, communities?

I'm not saying, to automate it all, but maybe allow some browsing, with status, publish to mastodon and twitter, and commit links automatically?

Will see.

For sure it's going to be a project for the whole year, and I'll focus on the biggest pains first.

Then I will document the coding using [Hanami Mastery PRO](https://pro hanamimastery.com), and will share it with my supporters.

Now let's architecture this beauty...

## Summary

:::tip Subscribe to Hanami Mastery PRO  
This is only a preview of the episode. [Subscribe to Hanami Mastery PRO](https://pro.hanamimastery.com/hanami-mastery-pro) to see the full video, and access several other premium resources. Thanks for watching, and see you in the next one!  
:::

## Thanks

That's all for today, thank you for watching!, and see you in the next episode!
