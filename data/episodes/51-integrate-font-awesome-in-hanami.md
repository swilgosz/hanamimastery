---
id: 51
aliases:
  - "HMEP051"
published: true
author: "swilgosz"
topics:
  - "hanami"
  - "views"
title: "Font Awesome icons in Hanami apps!"
excerpt: "Probably any web app nowadays requires font icons to be loaded this or other way. In this episode, I'm showing the integration of Font Awesome icons in Hanami 2 applications."
videoId: "84o-aECwCCU"
publishedAt: "2023-11-28"
modifiedAt: "2023-11-28"
thumbnail:
  full: /images/episodes/51/cover-full.jpeg
  big: /images/episodes/51/cover-big.jpeg
  small: /images/episodes/51/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/XXX
  mastodon: https://ruby.social/@hanamimastery/XXX
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/XXX
    hanamirb: https://www.reddit.com/r/hanamirb/comments/XXX
source: "https://github.com/hanamimastery/episodes/compare/HME051-pre...HME051"
---
Hi there!

I have here the user registration form, similar to the one I implemented in [episode 46](/episodes/46-contact-form), and[ it uses Bulma](/episodes/3-style-your-app-with-bulma) to make it pretty without a hassle.

However, when you take a closer look at the form, You'll see that not everything works as expected. In particular, there should be icons here that are not loaded properly.

![Form with missing icons](/images/episodes/51/form-missing-icons.png)

Bulma is compatible with multiple implementations of icons, but it's up to you which you want to use.

## Font awesome icon kit

In today's short episode, I will show you one way to integrate the [font awesome icon set](https://fontawesome.com/).

I will skip the registration part but to use font awesome icons you need to have the icon set created.

![Font awesome kit listing](/images/episodes/51/fa-kits-listing.png)

When you open it, you will see the HTML tag to be pasted into your website. This approach allows you to have control over your icons bundle, and select which are accessible and downloaded by the script, so you can optimize the latency for your page to be fully loaded.

You can also selectively control if your icon kit will be accessible to a single or multiple domains, which makes it very easy to configure, in example, separate icon set for all staging environments, or the same icon set for different microservices.

Let me copy that now and open the hanami application, the main slice layout file to paste it inside

```html
# slices/main/layouts/app.html.erb

<script src="https://kit.fontawesome.com/b3924f7a01.js" crossorigin="anonymous"></script>
```

Now let's refresh the page. Icons are still not showing, so let me open the developer's tools to look for more details. There is an error saying, that we cannot download the fonts because of cross-origin rules violation.

![script-src rule violation](/images/episodes/51/script-src-rule-violation.png)

First of all, it cannot download the script, which will then pull the icons from the remote server, so let me add the rule to the allowed hosts.

```ruby
# config/app.rb

config.actions.content_security_policy[:script_src] = [
  'self',
  'https://kit.fontawesome.com'
].join(' ')
```

Now, when I visit the website again, I will see one more server that requires access to download actual icons but the error says, it first needs to be allowed to even connect with.

![connect-src rule violation](/images/episodes/51/connect-rule-violation.png)

Let me add that very quickly too...

```ruby
# config/app.rb

config.actions.content_security_policy[:connect_src] = [
  'self',
  'https://ka-f.fontawesome.com'
].join(' ')
```

Finally, it tries to download the fonts, but one more rule needs to be set, this time for 'font-src'. I again open the app configuration file to add new rules policy to the config.

```ruby
# config/app.rb

config.actions.content_security_policy[:font_src] = [
  'self',
  'https://ka-f.fontawesome.com'
].join(' ')
```

Having that, when I refresh the page, You will see fonts loaded in the form.

![Loaded icons in the form](/images/episodes/51/form-icons-loaded.png)

Cool!

There is one more error visible now in the sidebar, saying that it cannot download the script from localhost, which is not clear to me, as the `self` rule should resolve it. However, to get rid of it it's enough to add the `localhost` with port 2300. I'll leave it for now as it's not relevant to this episode.

```ruby
config.actions.content_security_policy[:script_src] = [
  'self',
  'https://kit.fontawesome.com',
  'localhost:2300'
].join(' ')
```

### Load app settings in the layout

However, the icon kit ID hardcoded in the layout does not seem to be the best approach.

First of all

- It can change in the future
- It can be different in development, staging, and production environments, with different settings applied.
- While you should always restrict your bundles to be accessible only by specific domains, this is the potential identifier of the paid service, and we don't want random hackers to make use of it.

I would expect something like this to be read from application settings, not directly hard coded so let me refactor this now.

First of all, I would love to have the new setting added, and make it optional for development and tests. The reason for this is, that not having the icons set should not prevent the majority of development excluding some UI stuff

```ruby
# config/settings.rb

module Hanamimastery
  class Settings < Hanami::Settings
    setting :database_url, constructor: Types::String
    setting :font_awesome_kit, constructor: Types::String.optional
  end
end

```


Then let me set the environment variable and paste my kit ID here

```ruby
# .env.development
DATABASE_URL=postgres://localhost/hanamimastery_development
FONT_AWESOME_KIT=b3924f7a01
```

To verify if it works, I can open the app console and check the new setting there.

```ruby
> Hanamimastery::App.settings.font_awesome_kit
=> "b3924f7a01"
```

Works great! Cool!

Now how to access that in the layout?

### Using context to load settings

The first approach would be to [extend the view context](https://guides.hanamib.org/v2.1/views/context) by adding a new method to it. Then here I'll include the app settings using the standard dependency injection mechanism and read my kit ID here.

```ruby
module Main
  module Views
    class Context < Hanami::View::Context
      include Deps["settings"]

      def font_awesome_kit
        settings.font_awesome_kit
      end
    end
  end
end
```

:::TIP Dependency Injection episodes
By the way, if you're new to dependency injection, I've published multiple episodes about this topic, explaining the concept from scratch, and how it works in Hanami applications, so make sure you have checked it out!
:::

Now going back to the code, when I visit the main slice application layout, I can replace the hardcoded string with the `font_awesome_kit` that is read directly from the `Context` object.

```ruby
<script src="https://kit.fontawesome.com/<%= font_awesome_kit %>.js" crossorigin="anonymous"></script>
```

In the templates we have a direct access to all context methods, so we can just call the `font_awesome_kit` directly, like a helper. However, because we injected the app settings, we now can also access all settings in all templates, and that's not something we want.

To solve it, in the context file I'll just mark my injected dependency as private, and now no unintentional class access is leaking into the templates and layouts.

Visiting the app page will still load all the icons as expected, and now I have full control over which icon kit I want to use in which environments.

## Summary

Font awesome is just a single icon integration, but I hope I've shown you clearly enough how to integrate with Hanami 2 any service requiring dynamic identifiers or credentials, like Google Analytics tracking ID Facebook app id.

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
