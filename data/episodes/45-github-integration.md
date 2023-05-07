---
id: 45
aliases: ["HMEP045"]
author: "swilgosz"
topics: ['hanami', 'integrations']
title: "Github integration with Hanami"
excerpt: "If you're a developer, you know GitHub. And if you don't know Hanami, you definitely should. In this episode, I'll show you how to make them both to know each other."
videoId: null
published: false
publishedAt: "2023-05-11"
modifiedAt: "2023-05-11"
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
source: https://github.com/hanamimastery/episodes/tree/main/045
---
[🎬 01] Hi there!

I have here a Hanami application listing all my Hanami Mastery episodes and I want to allow managing them from the browser. If you wonder why I need this, check out [episode 38](/episodes/38-hanami-mastery-app) when I've explained that in detail.

[🎬 02] The thing is, these episodes' data is pulled out from my DB, but I host my content using the static site generator. [🎬 03] The source of truth database is a GitHub repository and markdown file system!

All our content is open-sourced, and everyone can contribute to it, by writing new episodes, or updating the existing ones.

This is part of our mission to bring value to Ruby community together, and I don't want to use private postgres database for this.

This is why I will write the GitHub integration today, which will allow me to pull data from the repository and sync properly with my local database, from where I can preview drafts, pull cover images from google drive, and fill in missing data automatically.

[🎬 04] The integration with Google Drive is already in Place, as we shown in [episode 42](43-connect-with-google-drive.md) so Github integration is really, the last piece to make this application actually useful.

### Scope

[🎬 05-] Our goal for today is to
1. Connect to the Github API
2. Pull the list of all episodes we have published or drafted out.
3. For each episode, pull the content of it's file.
4. Fill database records with all the data we get.

Next time I'm going to extend that by making a commit after the change, but pulling data is already enough for an episode, so let's dive straight into it.

## Fetch Action

[🎬 06] To have a clear way of triggering my fetching mechanism, I'm going to add a `button` to my [HTMX template](https://htmx.org/), which will send the *ajax* request to the server, and will prepend my list with the HTML returned by the server.

```html
<section class="section">
  <button class="button is-primary" hx-post="episodes/fetch" hx-swap="beforebegin" hx-target="#recent-episodes">Fetch drafts
  </button>
</section>
```

[🎬 07] Calling this will do nothing at the moment because I have no action defined yet. Let me add it using the built-in generator.

### Fetch Action

[🎬 08] To the action shell command, I'll add a few parameters, setting its slice to main, and the HTTP method.

```shell
hanami generate action episodes.fetch --slice=main --http=post
```

[🎬 09] I can visit the routes file to verify if everything is set as expected. I can see the POST method here, as well as the correct container key, so I can move forward to the action file.

```ruby
# config/routes.rb
post '/episodes/fetch', to: 'episodes.fetch'
```

[🎬 10] The action is generated in the way it returns a class name by default, which I'll now wrap with the HTML tag for a table row and cell.

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

[🎬 11] This now should prepend my episodes list with a new row each time I'm clicking the button.

Works!

![[Pasted image 20230219210640.png]]

### Setting the view

[🎬 12] Having that, I can tweak the action further, to render the actual template using a dedicated view object.

Just to show you I'll fetch the recent episodes from the database using the repository and pass the result to the view.

```ruby
# slices/main/actions/episodes/fetch.rb

def handle(request, response)
  episodes = repo.recent.limit(1)
  response.body = response.render view, episodes:
end
```

[🎬 13] The view for this will be pretty simple, but I'll expose episodes to the template, so I can use them for rendering. Also, I'm disabling here the layout, because this HTML will be injected into an existing one.

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

[🎬 14] Then finally, I want to prepare the template, where I loop over the episodes and construct their rows in the HTML document.

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

[🎬 15] For explaining how this part works, I recommend you to go back to visit [episode 2](/episodes/2-listing-articles-with-hanami-view) of Hanami Mastery, where I've described more about the view rendering in Hanami apps.

[🎬 16] For today, let's check how it behaves.

![[Pasted image 20230219210935.png]]

When I click, on top of the list, the last saved episode is prepended again, showing duplicates. That's an amazing first step, but what we want to do, is to fetch all new episodes from Github, and this is what we'll do now.

---end of free---

### Authentication

[🎬 17] To work with github, I'll need the way to authenticate my requests. For this, I've generated the [personal access token](https://github.com/settings/personal-access-tokens). I am the only one using my app now, it allows to pick only what I want, and is simple to use for this showcase.

For more advanced usages, you may want to consider using oauth application instead and this is what I also will do if I'll extend this project too far.

[🎬 18] If you have the token, save it in your environment variables and add the proper setting to your Hanami app.

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

## Github Connection implementation

[🎬 19] To work with GitHub, I'm going to use the [Octokit gem](https://github.com/octokit/octokit.rb), which is the official client to work with [GitHub API](https://docs.github.com/en/rest/git/blobs?apiVersion=2022-11-28#about-git-blobs).

You may do with it pretty much anything GitHub allows and as you may expect, it's quite a lot! Today I won't go through this gem in details, just will use a small piece of its functionality to download my episodes data.

```ruby
# Gemfile

gem 'octokit'
```

[🎬 20] First I'll install the gem and once we have it, let's configure the client in the provider.

### Github provider

[🎬 21] My GitHub provider will be namespaced, and in the prepare block, I'm going to require *octokit*, then instantiate the client passing my access token read from the settings.

Finally, I can register the client in my container.

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

### Checking the client

[🎬 22] When the implementation is done, it would be nice to test this out in the console. I only need to fetch the client from the container and call the current user information to verify if I'm logged in properly.

```ruby
client = container['github.client']
client.user
# ...
```

Seems it works!

## Github integration class.

[🎬 23] So we know that our GitHub client works as expected, and that's amazing. Now we can write a helper class, that will browse our repository and download the files, in order to save them later.

[🎬 24] First, let me create the github integration class.

```ruby
# slices/main/integrations/github.rb

module Main
  module Integrations
    class Github
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

### Listing episodes

[🎬 25] To do this, I need to fetch from GitHub the file tree object pointing to the latest version in my repo. By adding the `recursive` option, It'll return all files from all subfolders.

```ruby
# slices/main/integrations/github.rb
def entries
  client.tree(REPO, base_tree_sha, recursive: true).tree.
    select { |t| t.path.include?('data/episodes/') }
end
```

[🎬 26] The base tree SHA can be extracted from the tree object included in the latest commit. However, to fetch the latest commit without knowing it's unique identifier, we'll need to get it first, passing the reference we've defined above.

```ruby
def base_tree_sha
  latest_commit_sha = client.ref(REPO, REF).object.sha
  client.commit(REPO, latest_commit_sha).commit.tree.sha
end
```

[🎬 27] This already is enough to test it so let me open the console again. This time I'll fetch component from my slice container, and then call the entries method on it.

```ruby
github = Main::Slice.container['integrations.github']
github.entries
# => Sawyer::Resource
```

[🎬 28] Our method returns `Sawyer::Resource` kind of object, which means, we can access it's sub-hashes via method calls instead of hash symbols.

[🎬 29] I am interested in the `tree` object, but I don't care about the majority of the files, so I can filter them by checking the path attribute.

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

This is why, only a minimal set of data is returned here, and to download the content of the file itself, we need to do it via a separate request.

### Fetching Content

[🎬 30] To fetch the actual file content, I will need the file path from the GitHub repository. Then I'll use the `contents` method for the `Octokit` client to read the given file.

It needs my repository name, file path, and some more strict pointer to the exact file reference because as you know, GitHub stores all versions of all your files.

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

[🎬 31] The returned file will be `base64` encoded, so we need to decode it yet, and with this, we can check it out.

```ruby
entry = github.entries.first
github.fetch(entry.path)
```

Works like a charm! We can now fetch from GithHub all the details of any episode we want!

## Interactor

[🎬 32] Now the final step is writing our results into the database. For this, I'm going to write an interactor that will inject the github integration class and the episodes repository.

[🎬 33] It will use the `Success` object, including all new drafts that are imported. If you're interested in how the interactor is implemented, check out the source code of the app, but you can also refer to [episode 007 about dry-monads](/episodes/7-untangle-your-app-with-dry-monads).

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

[🎬 34] First step would be to fetch all the entries from GitHub. Then I can fetch the existing episode ids, and keep only the new ones.

Finally, we'll filter the GitHub entries to only contain the new objects.

```ruby
def call(params)
  entries = github.entries
  new_ids = entries.map(&:source_id) - episodes.source_ids
  new_entries = entries.select { |entry| new_ids.include?(entry.source_id) }

  Success(drafts: new_drafts)
end
```

Now we can save them to the database.

### Importing to DB

[🎬 36] Because I often will import multiple objects, I'll use a custom command named `multi_insert`, that can insert an array of objects at once.

```ruby
def call(params)
  # ...
  new_drafts = episodes.multi_insert(new_entries.map &:to_h)

  Success(drafts: new_drafts)
end
```

[🎬 37] Then let me add it to the main repository.

```ruby
  def multi_insert(array)
    root.command(:create, result: :many).call(array)
  end

```

It just uses the `create` ROM command, but with the custom options allowing for multiple inputs to be passed in.


### Entity mapping

[🎬 38] Before we'll go further, I need to take a step back though.

Here I'm using the *source id* method to compare my already saved episodes with the objects I get from github API, but there is a caveat.

The object returned from `entries` does not have the `source id`. It only contains a `path` which I can use to calculate the actual episode number.

```ruby
{
  :path=>"data/episodes/1-creating-hanami-application.md",
  :mode=>"100644",
  :type=>"blob",
  :sha=>"3d152f3a8af52e13d0d2e12eed15af99e1ee8e45",
  :size=>7074,
  :url=>
   "https://api.github.com/repos/swilgosz/hanamimastery/git/blobs/3d152f3a8af52e13d0d2e12eed15af99e1ee8e45"
}
```

[🎬 39] Therefore, I'll tweak quickly my integration, by adding the entry initialization to the final return value.

```ruby
def entries
  client.tree(REPO, base_tree_sha, recursive: true).tree.
    select { |entry| entry.path.match(/^data\/episodes\//) }
    .map { |entry| Entry.new(entry.to_h) }
end
```

[🎬 40] This `Entry` object will contain my basic attributes renaming and transformations so let me define it now.

[🎬 41] I'll use `dry-struct` to define the structure of the   GitHub Entry object.

I'm interested in three attributes, for path, original URL, and the `sha` of the file version to compare later, all of those being type of String.

```ruby
module Main
  module Integrations
    class Github
      class Entry < Dry::Struct
        attribute :source_path, Types::String
        attribute :source_url, Types::String
        attribute :sha, Types::String
      end
    end
  end
end
```

[🎬 42] Then I want to have a `source id` extracted out of my path and added to the hash transformation when needed.

```ruby
def source_id
  source_path.split('/').last.
    split(/-/).first.to_i
end

def to_h
  super.merge(source_id: source_id)
end
```

This is almost everything, but our input values are different than expected in this definition. I get the `path` and `url`, instead of `source_path` and `source_url` and trying to initialize my struct in the current form will raise an error.

[🎬 43] To fix this, I want to add some input key transformations using the `transform_keys` method. By passing a block I can check for each key the condition and return the updated value. For this situation, a simple case statement will be enough. Then I'll symbolize the keys to be sure I always work with unified input data.

```ruby
# frozen_string_literal: true

module Main
  module Integrations
    class Github
      class Entry < Dry::Struct
        transform_keys do |key|
          case key
          when :path then :source_path
          when :url then :source_url
          else
            key
          end.to_sym
        end

        # ...
      end
    end
  end
end
```

### Updating the action.

[🎬 44] We now can import new files to the system, but nothing calls our interactor, so let's update our action accordingly.

I need to inject my interactor as a dependency, and then extract a value from the call.

```ruby
module Main
  module Actions
    module Episodes
      class Fetch < Main::Action
        include Deps['interactors.fetch_draft_episodes']

        def handle(request, response)
          result = fetch_draft_episodes.call
          episodes = result.value![:drafts]
          response.render(view, episodes:)
        end
      end
    end
  end
end
```

## Final Test.

[🎬 45] Now it's time for the final test. I've removed everything I have in my database and let's check out what will happen.

When I check my browser, after clicking fetch, new draft episodes will be imported and persisted in DB

![[Pasted image 20230222210959.png]]

The episde Number had been filled in properly but no details are set.

We already have a way to fetch the actual file content and details, however, in order to do so we'll need to work with the front matter, and this is what we'll tackle in the next video.
