---
id: 45
aliases: ["HMEP045"]
author: "swilgosz"
topics: ['hanami', 'integrations']
title: "Github integration with Hanami"
excerpt: "If you're a developer, you know GitHub. And if you don't know Hanami, you definitely should. In this episode, I'll show you how to make them both to know each other."
videoId: uMBrD6vLL2k
published: true
publishedAt: "2023-05-12"
modifiedAt: "2023-05-12"
thumbnail:
  full: /images/episodes/44/cover-full.png
  big: /images/episodes/44/cover-big.png
  small: /images/episodes/44/cover-small.png
discussions:
  twitter: https://twitter.com/HanamiMastery/status/XXX
  mastodon: https://ruby.social/XXX
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/XXX
    hanamirb: https://www.reddit.com/r/hanamirb/comments/XXX
source: https://github.com/hanamimastery/episodes/tree/main/045
---
I have here a Hanami application listing all my Hanami Mastery episodes and I want to allow managing them from the browser. If you wonder why I need this, check out [episode 38](/episodes/38-hanami-mastery-app) when I've explained that in detail.

The thing is, these episodes' data is pulled out from my DB, but I host my content using the static site generator. The source of truth database is a GitHub repository and markdown file system!

All our content is open-sourced, and everyone can contribute to it, by writing new episodes, or updating the existing ones.

This is part of our mission to bring value to Ruby community together, and I don't want to use private postgres database for this.

This is why I will write the GitHub integration today, which will allow me to pull data from the repository and sync properly with my local database, from where I can preview drafts, pull cover images from google drive, and fill in missing data automatically.

The integration with Google Drive is already in Place, as we shown in [episode 42](43-connect-with-google-drive.md) so Github integration is really, the last piece to make this application actually useful.

### Scope

Our goal for today is to
1. Connect to the Github API
2. Pull the list of all episodes we have published or drafted out.
3. For each episode, pull the content of it's file.
4. Fill database records with all the data we get.

Next time I'm going to extend that by making a commit after the change, but pulling data is already enough for an episode, so let's dive straight into it.

## Fetch Action

To have a clear way of triggering my fetching mechanism, I'm going to add a `button` to my [HTMX template](https://htmx.org/), which will send the *ajax* request to the server, and will prepend my list with the HTML returned by the server.

```html
<section class="section">
  <button class="button is-primary" hx-post="episodes/fetch" hx-swap="beforebegin" hx-target="#recent-episodes">Fetch drafts
  </button>
</section>
```

Calling this will do nothing at the moment because I have no action defined yet. Let me add it using the built-in generator.

### Fetch Action

To the action shell command, I'll add a few parameters, setting its slice to main, and the HTTP method.

```shell
hanami generate action episodes.fetch --slice=main --http=post
```

I can visit the routes file to verify if everything is set as expected. I can see the POST method here, as well as the correct container key, so I can move forward to the action file.

```ruby
# config/routes.rb
post '/episodes/fetch', to: 'episodes.fetch'
```

The action is generated in the way it returns a class name by default, which I'll now wrap with the HTML tag for a table row and cell.

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

This now should prepend my episodes list with a new row each time I'm clicking the button.

Works!

![Unstyled episodes from DB](/images/episodes/45/episodes-list-unstyled.png)

### Setting the view

Having that, I can tweak the action further, to render the actual template using a dedicated view object.

Just to show you I'll fetch the recent episodes from the database using the repository and pass the result to the view.

```ruby
# slices/main/actions/episodes/fetch.rb

def handle(request, response)
  episodes = repo.recent.limit(1)
  response.body = response.render view, episodes:
end
```

The view for this will be pretty simple, but I'll expose episodes to the template, so I can use them for rendering. Also, I'm disabling here the layout, because this HTML will be injected into an existing one.

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

![Styled episodes from DB](/images/episodes/45/episodes-list-styled.png)

When I click, on top of the list, the last saved episode is prepended again, showing duplicates. That's an amazing first step, but what we want to do, is to fetch all new episodes from Github, and this is what we'll do now.

:::tip Subscribe to Hanami Mastery PRO  
This is only a preview of the episode. [Subscribe to Hanami Mastery PRO](https://pro.hanamimastery.com/hanami-mastery-pro) to see the full video, and access several other premium resources. Thanks for watching, and see you in the next one!  
:::

## Thanks

That's all for today, thank you for watching, and see you in the next episode!