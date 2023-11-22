---
id: 48
aliases:
  - "HMEP048"
author: swilgosz
topics:
  - "views"
  - "hanami"
title: "Phlex with Hanami - make your views written in Ruby. Completely."
excerpt: "There is a famous video about the IT skill iceberg - but thankfully, there is an alternative. If you ever wondered if you can build entire websites without HTML overhead, now you can! Meet Phlex, a view engine, where you can write Ruby instead of HTML"
videoId: "Vg-ifUh-r4Q"
publishedAt: "2023-09-27"
modifiedAt: "2023-09-27"
thumbnail:
  full: /images/episodes/48/cover-full.png
  big: /images/episodes/48/cover-big.png
  small: /images/episodes/48/cover-small.png
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1707062634502090938
  mastodon: https://ruby.social/@hanamimastery/111137983649643097
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/16togwv/phlex_with_hanami_make_your_views_written_in_ruby/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/16tommx/phlex_with_hanami_make_your_views_written_in_ruby/
source: "https://github.com/hanamimastery/episodes/compare/HME048-pre...HME048"
published: true
---
When I started with web development, I remember this overwhelming feeling, after starting to gain information about new tech stacks, more modern tech stacks, and **even more** modern tech stacks. I did it in the pace, I could not even process the information.

Whenever I started to learn something, before I dug into it, I realized, that the knowledge I've just consumed is already obsolete!

![Too many information](/images/episodes/48/too-many.jpeg)

It appears it's a more or less common feeling in the IT world, well described in the [God-Tier Developer Roadmap](https://www.youtube.com/watch?v=pEfrdAtAmqk), where the author presents the Programming Skills Iceberg.

Even if you'll skip most of it, and have already decided that you want to work with web development in ruby, successfully narrowing down the number of skills you need in order to start making money as a programmer, you still need to learn a lot.

- Ruby
- CSS
- HTML
- SQL
- Javascript
- ...and more

Even with technology like [HTMX](/episodes/40-hanamismith) or [Hotwire](https://www.hotrails.dev/), limiting your JS requirements to the bare minimum, You cannot avoid writing HTML, right?

![No need HTML for web meme](/images/episodes/48/meme-blog.png)

Well... not right, actually.

:::warning Disclaimer
By reading this article you may get an inpression, that it suggests that you can skip learning HTML completely which is not true. It's a humorous way to point out that you can decide to start learning ruby and write complete applications in pure Ruby, however you'll need to learn HTML tags anyway.
:::

## Meet Phlex

Different people started to address this issue, of web development being too complicated. Tools like
*HTMX* and *Hotwire* allow you to skip writing *Javascript*, and work only with *HTML* documents being sent to the server, and new documents being sent back.

Simpler stack, and fewer developers needed, meaning easier to recruit.

But there is a crazy guy (in a good way), [Joel Drapper](https://github.com/joeldrapper), who decided to put the bar to the next level. If we can skip JS, why not skip *HTML* completely?

He came up with [Phlex](https://github.com/phlex-ruby) - a view framework, allowing you to write all your views and templates entirely in ruby classes.

:::important
Before I go further, make sure you consider [sponsoring Joel's work](https://github.com/phlex-ruby#sponsorship-), as this thing is amazing and he does it all in Open Source, so we can all make our lives better for free.
:::
### Why to use Phlex?
You may ask, why would we even consider using Phlex? We have views in Rails, We have views in Hanami, and we all know HTML (right?)?

- **Framework-agnostic** - Hanami and Rails are not the only Ruby frameworks out there, and sometimes, for smaller applications, you'll not have a view layer included out of the box. You can even skip the framework completely. Phlex is great because you can include it in anything, the same as Hanami-View. Writing Framework-agnostic libraries and solutions is exactly the approach we promote on Hanami Mastery.
- **It's simple to use** - You just have one method named `temolate`, and HTML tags as ruby methods you can use within. No magic, no overhead, you can just start and write.
- **easy to test** - because you have your objects all ruby written, you can unit-test them all without a hustle.
- **thread-safe** - This is a standard now I guess, but worth mentioning in the world of multi-thread applications, distributed systems and who knows what else.
## Starting with Phlex

There is no better way to work with Phlex in Ruby than starting with the [handbook guide](https://www.phlex.fun/), but in this episode, I'll show you how to make it working with Hanami 2.X, because why not?

> [!NOTE] Default Views in Hanami
> Hanami 2.1+ Has an amazing [built-in view layer already in place](https://github.com/hanami/view), with a dedicated, standalone gem *dry-view* as I've presented in [HME046](/episodes/46-contact-form), but following Hanami's philosophy of keeping things flexible, **you can remove it easily** if you don't want to use it, or if you want to experiment with other solutions.

### Phlex with Hanami

The goal for this episode is to make views work similar to How we had things running in [Episode 046](/episodes/46-contact-form) about the contact form. If you haven't watched that, it includes the top navigation, home page, and contact page, rendering the form to be submitted.

All that, with [Bulma being integrated](/episodes/3-style-your-app-with-bulma).

![Contact form page](/images/episodes/46/contact-form.png)

I may leave the actual form page to you though, focusing on explaining the first parts. Let's start then
### Configuration
To start with *Phlex*, as usual, we'll need to add it to the Gemfile.

```ruby
# Gemfile
gem "phlex"
```

After installing it, let's replace the main view in the application with the new engine. It's super simple, just require phlex, and make my main view inherited from the `Phlex::HTML`.

```ruby
# frozen_string_literal: true

require 'phlex'

module Sandbox
  class View < Phlex::HTML
  end
end
```

Now, because I work on the existing project, let me clean up a few things. In the `main` slice view configuration object, I have a templates path defined - I can remove that.

```ruby
module Main
  # The main view.
  class View < Hanamimastery::View
    # config.paths = [Pathname(__dir__).join("templates").expand_path]
  end
end
```
Then, in the contact view object, I can comment out the content just for now.

### The home view

Having that, let's revisit the `home/show` view. Usually, what you would need, is a separate template file, written in `ERB`, `SLIM`, or any other templating language, that allows you to inject ruby code into the HTML and dynamically translate it into the actual *HTML* later on.

With *Phlex*, you'll need only a `template` method to be added in the view class, and then you can define your content totally in ruby.

```ruby

module Sandbox
  module Views
    module Home
      class Show < View
        def template
          h1 { "👋 Hello!" }
          strong { "Phlex 🪨️s!" }
          p { "Phlex allows you to write pure ruby to write complete web applications"}
        end
      end
    end
  end
end
```

Let me paste here a hello-world sort of thing, copying from the *phlex* documentation. It is supposed to render a nice welcome message, a bolded string underneath, followed by a paragraph.

However, to render it well, I need to yet call this view, so let me visit my action file.

```ruby
module Sandbox
  module Actions
    module Home
      class Show < Sandbox::Action
        def handle(request, response)
          response.body = Views::Home::Show.new.call
        end
      end
    end
  end
end
```

As you can see, I only need to instantiate the view class here, because Hanami calls the `render` method on the object returned by the class.

I think that's all.

Let's check what will happen after running the server and visiting the browser.

![Phlex - Basic unstyled view rendered](/images/episodes/48/phlex-basic-view-rendered.png)

You can see, that the content had been properly interpreted and rendered as HTML, which is great! However, there is no styling applied. Let me fix that, by adding the layout.

### Layout

I'll create a new file, named `application_layout.rb`, and inside use exactly the same `template` method as in the actual view. Layouts in *Phlex* are nothing more than a view that yields another inside, so let me prove it.

```ruby
# app/views/application_layout.rb

module Sandbox
  module Views
    class ApplicationLayout < View
      def template
        doctype
        html do
          head do
            link(rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css")
          end
          body do
            yield
          end
        end
      end
    end
  end
end

```

First of all, I'll add a `doctype`, and then call the `html` method, passing head and body inside.

In the body, I'll set a div with a `container` class, and yield whatever will use this layout in the future.

Then in the `head` block, I'm going to add a stylesheet link, loading *Bulma* from the CDN. If this is too fast, I'm sorry - I'm kind of speeding through the *Bulma* itself because I already covered it in 2 of my previous episodes. Check them out if you want to learn more about this amazing CSS framework.

For now, let me switch to the view file and use my newly created Layout. To do this, I just need to call the `render` method, and instantiate my `ApplicationLayout`, passing the content of my view as a block to the *new* method. It'll be all yielded within the body, applying anything defined in the layout as you may expect.

```ruby
# frozen_string_literal: true

module Sandbox
  module Views
    module Home
      class Show < Phlex::HTML
        def template
          render ApplicationLayout.new do
            h1 { "👋 Hello!" }
            strong { "Phlex 🪨️s!" }
            p { "Phlex allows you to write pure ruby to write complete web applications"}
          end
        end
      end
    end
  end
end

```

With this, visiting the browser results with adjusted styling of my website, showing that *Bulma* had been properly applied.

![Phlex with bulma integrated](/images/episodes/48/phlex-bulma-integrated.png)

Isn't that great?

Yes, I know you still need to somewhat know the HTML tags, *Phlex* does not eliminate this completely, but it allows you to write your views completely in pure Ruby, leveraging all the benefits, including the easiness of testing.

Let me jump into the more complex example though.
## More complex example

I want to add a navigation to my layout, as I had in my previous episode. For this, let me copy the HTML I had before, and adjust to the Ruby syntax.

All you see seems to be pretty intuitive. We call the HTML tag as method, passing the attributes into the brackets, and opening the block to place elements inside.

```ruby
# app/views/application_layout.rb

body do
  div(class:"container") do
    nav(class: "navbar", role:"navigation") do
      div(class: "navbar-menu") do
        div(class: "navbar-start") do
          a(href: '/', class: 'navbar-item') { 'Home' }
          a(href: '/contact', class: 'navbar-item') { 'Contact' }
        end
      end
    end
    yield
  end
end
```

I'm wrapping my whole content with the `container` `div`, and in the `navbar`, I'll have two items, for the home page, and the contact page.

Now, worried about the copyright of Joel to his code snippets, let's change the rendering output to something more representative and unique.

I'll add the *Bulma* class to indicate this HTML tag is indeed the H1 title header, and change the content to a random string. Yes, it's totally random, and if you don't believe it, sorry! It's recorded and I cannot change it again.

Then below I'm going to add exactly the same button I have in HME046, and wrap it with the `parent` div, so we can integrate this with [HTMX](https://htmx.org/) later.

```ruby
# app/views/home/show.rb

render ApplicationLayout.new do
  h1(class: "title is-1") { "Consider subscribing?!" }

  div(id: "parent") do
    button(class: "button is-primary") do
      "Click Me to Subscribe!"
    end
  end
end

```

The result, you can see on the page.

![Final home page view rendered](/images/episodes/48/consider-subscribing.png)

You can integrate HTMX or any other javascript library the same way I integrated *Bulma*, but I won't do it now.

Instead, I'll leave it to you as homework.

![Disgusted](/images/episode qws/48/disgusted.jpg)

**Yep! Love you too!**

Let me know in the comments if you managed to pull it together, and don't forget to send some appreciation to Joel! He does a great job, going against the flow of the mainstream approach.
## Summary

I love that tools like *Phlex* appear in the Ruby ecosystem, and I'll definitely promote more of such. Pushing boundaries is important to keep innovation appearing in the community, and I love those fresh examples of new approaches to the old problems. I am also super glad that other blogs also started to cover them (you can find [Phlex mentions on the NB casts](https://nbcasts.com/episodes/more-phlex)).

I hope you've enjoyed this episode, and if you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/hanamimastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!
## Thanks

I want to especially thank my recent sponsors,

- [Lucian Ghinda](https://github.com/lucianghinda)
- [Maxim Gurin](https://github.com/maximgurin)
- [prowly.com](http://prowly.com/)

and [all the Hanami Mastery PRO subscirbers](https://pro.hanamimastery.com/), for supporting this project, I really appreciate it!

:::important[Consider sponsoring?]
If you want to support us, check out our [Github sponsors page](https://github.com/sponsors/swilgosz) or join [Hanami Mastery PRO](https://pro.hanamimastery.com/) to gain the access to more learning resources and our private discord server!
:::
