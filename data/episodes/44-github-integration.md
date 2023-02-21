---
id: 44
aliases: ["HMEP044"]
author: "swilgosz"
topics: ['hanami', 'integrations']
title: "Github integration with Hanami"
excerpt: "If you're a developer, you know GitHub. And if you don't know Hanami, you definitely should. In this episode, I'll show you how to make them both to know each other."
videoId: null
published: false
publishedAt: "2023-02-09"
modifiedAt: "2023-02-09"
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
[🎬 01] Hi there!

I have here a Hanami application listing all my Hanami Mastery episodes. If you wonder why I need this, check out [episode 38](/episodes/38-hanami-mastery-app) when I've explained that in detail.

The thing is, these episodes' data is pulled out from my DB, but I host my content using the static site generator. The source of truth database is a GitHub repository and markdown file system!

All our content is open-sourced, and everyone can contribute to it, by writing new episodes, or updating the existing ones. 

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

## Fetch Action

To have a clear way of triggering my fetching mechanism, I'm going to add a `button` to my HTMX template, which will send the *ajax* request to the server, and will prepend my list with the HTML returned by the server.

```html
<section class="section">
  <button class="button is-primary" hx-post="episodes/fetch" hx-swap="beforebegin" hx-target="#recent-episodes">Fetch drafts
  </button>
</section>
```

Calling this will do nothing at the moment, because I have no action defined yet. Let me add it using the generator.

### Fetch Action

```shell
hanami generate action episodes.fetch --slice=main --http=post --url='episodes/fetch'
```

```ruby
# config/routes.rb
post '/episodes/fetch', to: 'episodes.fetch'
```

The action is generated in the way it returns a class name by default, which I'll now wrap with the `tr` HTML tag. and this now should prepend my episodes list with a new row each time I'm clicking the button.

```ruby
# frozen_string_literal: true

module Main
  module Actions
    module Episodes
      class Fetch < Main::Action
        def handle(request, response)
          response.body = "<tr><td>#{self.class.name}</td></tr>"
        end
      end
    end
  end
end
```

Works!

![[Pasted image 20230219210640.png]]

### Setting the view

Having that, I can tweak the action further, to render the actual template using dedicated view object.

Just to show you I'll fetch the recent episodes from the database using the repository and pass the result to the view.

```ruby
# slices/main/actions/episodes/fetch.rb

def handle(request, response)
  episodes = repo.recent.limit(1)
  response.body = response.render view, episodes:
end
```

The view for this will be pretty simple, but I'll expose episodes to the template, so I can use them for rendering.
Also, I'm disabling here the l
ayout, because this HTML will be injected into existing one.

```ruby
# slices/main/views/episodes/fetch.rb
module Main
  module Views
    module Episodes
      # Renders show view.
      class Fetch < Main::View
        config.layout = false
        expose :episodes
      end
    end
  end
end

```

Then finally, I want to prepare the template, where I loop over the episodes and construct their rows in the HTML document.

```html
<%- episodes.each do |episode| %>
<tr>
  <th><%= episode.source_id %></th>
  <td><img src="<%= episode.cover[:small]%>" class="is6b9" /></td>
  <td><%= episode.title %></td>
  <td>Edit Button</td>
</tr>
<%- end %>
```

For explaining how this part works, I recommend you to go back to visit [episode 2](/episodes/2-listing-articles-with-hanami-view) of Hanami Mastery, where I've described more about the view rendering in Hanami apps.

For today, let's check how it behaves.

![[Pasted image 20230219210935.png]]

When I click, on top of the list, the last saved episode is prepended again, showing duplicates. That's an amazing first step, but what we want to do, is to fetch all new episodes from Github, and this is what we'll do now.

---end of free---

### Authentication

To work with github, I'll need the way to authenticate my requests. For this, I've generated the [personal access token](https://github.com/settings/personal-access-tokens). I am the only one using my app now, it allows to pick only what I want, and is simple to use for this showcase.

For more advanced usages, you may want to consider using oauth application instead and this is what I also will do if I'll extend this project too far.

If you have the token, save it in your environment variables and add the proper setting to your Hanami app.

```ruby
module Hanamimastery
  # Configures application settings.
  class Settings < Hanami::Settings
    setting :database_url
    setting :github_access_token
  end
end
```

Now let's configure the connection.

## Implementation

To work with GitHub, I'm going to use the [Octokit gem](https://github.com/octokit/octokit.rb), which is the official client to work with [GitHub API](https://docs.github.com/en/rest/git/blobs?apiVersion=2022-11-28#about-git-blobs).

You may do with it pretty much anything GitHub allows and as you may expect, it's quite a lot! Today I won't go through this gem in details, just will use a small piece of its functionality to download my episodes data.

```ruby
# Gemfile

gem 'octokit'
```

First I'll install the gem and once we have it, let's configure the client in the provider.

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

By the way, I love this separation, where I can safely show on the video settings, without risking to show the actual environment variables.

### Checking the client

```ruby
client = Hanamimastery::App.container['github.client']
client.user
# ...
```

### Github integration class.

http://mattgreensmith.net/2013/08/08/commit-directly-to-github-via-api-with-octokit/

So we know that our github client works as expected, and that's amazing. Now we can write a helper class, that will browse our repository and download the files, in order to save them later.

First, let me create the github integration class.

```ruby
# slices/main/integrations/github.rb
module Hanamimastery
  module Integrations
      include Deps['github.client']

      REPO = 'swilgosz/hanamimastery'
      REF = 'heads/master'
    end
  end
end

```

It will serve as a wrapper for this super huge Github API feature set and will implement just those methods we need to achieve our goals.

I inject the configured GitHub client as a dependency here and define two constants.

One is referring to the repository we want to browse and communicate with, and the other is the reference we will look at. Because I am only interested in checking the master branch, I'll set it here.

Now let's fetch the entries.

#### Listing episodes

To do this, I need to fetch from github the file tree object pointing to the latest version in my repo. By adding the `recursive: true` option, It'll return all files from all subfolders.

```ruby
# slices/main/integrations/github
def entries
  client.tree(REPO, base_tree_sha, recursive: true).tree.
    select { |t| t.path.include?('data/episodes/') }
end
```

The base tree SHA can be extracted from the tree object included in the latest commit. However, to fetch the latest commit without knowing it's unique identifier, we'll need to get it first, passing the reference we've defined above.

```ruby
def base_tree_sha
  latest_commit_sha = client.ref(REPO, REF).object.sha
  client.commit(REPO, latest_commit_sha).commit.tree.sha
end
```

This already is enough to test it.

```ruby
github = container['integrations.github']
github.entries
# => Sawyer::Resource
```

Our method returns `Sawyer::Resource` kind of object, which means, we can access it's sub hashes via method calls instead of hash symbols.

I am interested in the `tree` object, but I don't care about the majority of the files, so I can filter them by checking the path attribute.

```ruby
github.entries.select { |entry| entry.path.match(/^data\/episodes\//)}
=>
[
{:path=>"data/episodes/1-creating-hanami-application.md",
 :mode=>"100644",
 :type=>"blob",
 :sha=>"3d152f3a8af52e13d0d2e12eed15af99e1ee8e45",
 :size=>7074,
 :url=>"https://api.github.com/repos/swilgosz/hanamimastery/git/blobs/3d152f3a8af52e13d0d2e12eed15af99e1ee8e45"}
,
 {:path=>"data/episodes/10-dry-structs-in-action.md",
 :mode=>"100644",
 :type=>"blob",
 :sha=>"3d7a492c43da8d8c3bf419fe0ab435e3cfaaa4af",
 :size=>12618,
 :url=>"https://api.github.com/repos/swilgosz/hanamimastery/git/blobs/3d7a492c43da8d8c3bf419fe0ab435e3cfaaa4af"}
, #...
]
```

This is pretty promising. However, because You may have a lot of files in the repository, returning all the content of files in the same request would be hilarious.

This is why, only minimal set of data is returned here, and to download the content of the file itself, we need to do it via the separate request.

#### Fetching Content

To fetch the actual file content, I will need the file path from the GitHub repository. Then I'll use the `contents` method for the `Octokit` client to read the given file. It needs my repository name, file path, and some more strict pointer to the exact file reference because as you know, GitHub stores all versions of all your files.

```ruby
# slices/main/integrations/github.rb

def fetch(path)
  res = client.contents(
    REPO,
    path: path,
    query: { ref: REF }
  )
  Base64.decode64(res.content)
end
```

The returned file will be `base64` encoded, so we need to decode it yet, and with this, we can check it out.

```ruby
entry = github.entries.first
github.fetch(entry.path)
```

Works like a charm!

### Interactor

Now the final step, which is writing our results to the database. For this I'm going to write an interactor that will inject github integration class, and the episodes repository. It will use Success object, including all new drafts that are imported.

```ruby
module Main
  module Interactors
    class FetchDraftEpisodes < Main::Interactor
      include Deps[
        'integrations.github',
        'repositories.episodes'
      ]

      def call

        Success(drafts: new_drafts)
      end
    end
  end
end

```

First step would be to fetch all the entries from github. Then I can fetch the existing episode ids, keep only the new ones.

Finally, we'll filter the GitHub entries to only contain the new objects.

You may notice, that it's not the super efficient way of doing things, as over time number of IDs to fetch fom DB will grow. Better would be to just get the last import date or last imported episode ID, but I don't expect to get any performance issues in the next ten years with the number of episodes I have.

Now we can save them to the database.

#### Importing to DB

```ruby
def call(params)
  entries = github.entries
  new_ids = entries.map(&:source_id) - episodes.source_ids
  new_entries = entries.select { |entry| new_ids.include?(entry.source_id) }

  Success(drafts: new_drafts)
end
```

Because I often will import multiple objects, I'll use a custom command named `multi_insert`, that can insert an array of objects at once.

```ruby
def call(params)
  # ...
  new_drafts = episodes.multi_insert(new_entries.map &:to_h)

  Success(drafts: new_drafts)
end
```

Then let me add it to the main repository.

```ruby
  def multi_insert(array)
    root.command(:create, result: :many).call(array)
  end

```

It just uses the `create` rom command, but with the custom options allowing for multiple inputs to be passed in.

Updating the action.

```ruby
Update action to use interactor 
```
## Final Test.

And done. 

When I check my browser, after clicking fetch, new draft episodes will be imported and persisted in DB

Now we also have a way to fetch the actual file content. To fill the details though, we'll need to work with the front matter, and this is what we'll tackle in the next video.

## Summary

I hope you've enjoyed this episode, and if you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/hanamimastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!

## Thanks: 
> Use [[THME - Thanks]]