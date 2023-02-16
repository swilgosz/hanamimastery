---
id: 42
aliases: ["HMEP042"]
author: "swilgosz"
topics: ['hanami', 'integrations', 'google']
title: "Connect your ruby app with google drive."
excerpt: ""
videoId: null
premium: true
publishedAt: "2023-02-23"
modifiedAt: "2023-02-23"
thumbnail:
  full: /images/episodes/42/cover-full.jpeg
  big: /images/episodes/42/cover-big.jpeg
  small: /images/episodes/42/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/XXX
source: https://github.com/hanamimastery/app
---
Hi there!

In [[38-hanami-mastery-app|episode 38]], we used a high-level application diagram to visualize the needs [our hanami mastery application](https://app.hanamimastery.com) will help us to solve.

In this episode, we'll go to the next level, and I'll start taking care of one of the most annoying steps I have during the episode creation process, which is thumbnail preparation.

My process for preparing thumbnails is this: 

1. **Create Thumbnail in Google Drive** - When the video is starting to be produced, the thumbnail is chosen, prepared, and downloaded to the episode's google drive folder.
2. **Prepare Versions** - We use this thumbnail for youtube videos, but also we save it in the repository and generate image versions out of it.
3. **Push all versions to GitHub** - at the end, all the images are committed to the episode's branch and pushed to GitHub, waiting for publication. 

![](/images/episodes/42/google-drive-component-diagram.png)

I want to completely delegate or automate the work choosing and adjusting thumbnails, and I don't want people to be forced learning how to work with GitHub repositories and how to commit files.

This is the reason why I'll keep uploading thumbnails to drive following a simple file name convention and automate the rest.

## First step - google drive integration

As you may expect, to work with thumbnails, I need to download my file from google.

Later we'll download it once the episode gets scheduled using some sort of sidekiq observer or event listener.

Let's start with the google drive integration then.

### Enable API and download credentials

To start working with google API, I [visited their Python tutorial](https://developers.google.com/drive/api/quickstart/python) for the language-agnostic part.

First you need to enable it on your account using google UI, and then  setup credentials.

Then make sure you share your drive with the service account email.

 You'll need to create a new access Key and download as a json file, saved in the root directory of our project.

Once you have it, we can implement the connection.

## Summary

This is only a part of the episode!
Subscribe to [Hanami Mastery PRO](https://pro.hanamimastery.com) to see the full video, and access several other premium resources. Thanks for watching, and see you in the next one!

## Thanks

That's all for today, thank you for watching!, and see you in the next episode!
