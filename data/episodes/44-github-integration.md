---
id: 44
aliases: ["HMEP044"]
author: "swilgosz"
topics: []
title: "#44 <<Title>>"
excerpt: "<<Summary>>"
videoId: null
publishedAt: "2022-02-09"
modifiedAt: "2022-02-09"
thumbnail:
  full: /images/episodes/44/cover-full.jpeg
  big: /images/episodes/44/cover-big.jpeg
  small: /images/episodes/44/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/XXX
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/XXX
    rails: https://www.reddit.com/r/rails/comments/pjuqct/XXX
    hanamirb: https://www.reddit.com/r/hanamirb/comments/XXX
source: https://github.com/hanamimastery/episodes/tree/main/044
---
Hi there!
## Introduction
### Browsing episodes from DB

I have here a Hanami application listing all my Hanami Mastery episodes. If you wonder why, check out episode 38 when I've explained that in details.

The thing is, this episodes data is pulled out from my db, while I host my content using static site generator, and my source of truth database, is Github repository and markdown file system!

All our content is open sourced, and everyone can contribute to it, by writing new episodes, or updating the existing ones. 

This is part of our mission to bring value to Ruby community together, and I don't want to use private postgres database for this.

This is why I'm going to write today the GitHub integration, that will allow me to pull data from the repository and sync properly with my local database, from where I can preview drafts, pull cover images from google drive and fill missing data automatically.

The integration with Google Drive is already in Place, as we shown in episode 42 so Github integration is really, the last piece to make this application actually useful.

### Scope

Our goal for today is to
1. Connect to the Github API
2. Pull the list of all episodes we have published or drafted out.
3. For each episode, pull the content of it's file.
4. Fill database records with all the data we get.

Next time I'm going to extend that by making a commit after the change, but pulling data is already enough for an episode, so let's dive straight into it.

### Authentication

Personal Access Token.

## Implementation

```ruby
# Gemfile

gem 'octokit'
```
### Github provider

```ruby
# config/providers/github.rb

Hanami.app.register_provider :github, namespace: true do
  prepare do
    require 'octokit'

    client = Octokit::Client.new(
      access_token: target['settings'].github_access_token
    )

    register 'client', client
  end
end

```

Having that let me add the access token to the settings so it's available.

```ruby
module Hanamimastery
  # Configures application settings.
  class Settings < Hanami::Settings
    setting :database_url

    setting :github_access_token
  end
end
```

By the way, I love this separation, where I can safely show on the video the settings, without risking to show the actual environment variables.

### Checking the client

```ruby
client = Hanamimastery::App.container['github.client']
client.user
# ...
```

Works

### Github repository.

http://mattgreensmith.net/2013/08/08/commit-directly-to-github-via-api-with-octokit/

```ruby
# Provide authentication credentials
client = Octokit::Client.new(:access_token => 'personal_access_token')

# You can still use the username/password syntax by replacing the password value with your PAT.
# client = Octokit::Client.new(:login => 'defunkt', :password => 'personal_access_token')

# Fetch the current user
client.user
```

## Summary

I hope you've enjoyed this episode, and if you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/hanamimastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!

## Thanks: 
> Use [[THME - Thanks]]