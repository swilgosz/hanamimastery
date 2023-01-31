---
id: 40
aliases: ["HMEP040"]
author: "swilgosz"
topics: ['hanami', 'cli']
title: "Spin up your Hanami apps easily with Hanamismith"
excerpt: "I always liked rails templating collections that allowed us to quickly compose ruby apps. Now the same is possible for Hanami!"
videoId: "V4QPZi3j7uY"
publishedAt: "2023-01-31"
modifiedAt: "2023-01-31"
thumbnail:
  full: /images/episodes/40/cover-full.jpeg
  big: /images/episodes/40/cover-big.jpeg
  small: /images/episodes/40/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1620474405343076377
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/10q4ydx/spin_up_your_hanami_apps_easily_with_hanamismith/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/10q4zsh/spin_up_your_hanami_apps_easily_with_hanamismith/
source: https://github.com/hanamimastery/episodes/tree/main/040
---
I was always a fan of having an [easy way to spin up scaffold rails applications](https://railsapps.github.io/rails-application-templates.html) with a [single console command](/episodes/37-dry-cli). For people like me, who test out every week a new idea, getting rid of all the manual work related to the repeatable configuration can mean a lot.

It's even more useful if your company has service-oriented architecture and new projects are being added in a regular manner.

In the Rails ecosystem, there are plenty of solutions for doing it, one example is [Rails Composer](https://github.com/RailsApps/rails_apps_composer) gem that allows you to easily spin-up rails applications from a collection of different recipes.

In this episode, I'll show you how we can easily spin-up Hanami applications in a similar manner. There is no manual coding required, just a simple command in the terminal, and you have a fully working Hanami application with the Persistence and View layer preconfigured.

## Why to use Hanami templates?

If you are asking yourself - why this is useful, if Hanami 2.1 also has a view and persistence components in place, ready to use - then here is my explanation.

Hanami 2.1 officially comes with ROM for persistence and Hanami-View for view and templating engines. However, nothing stops you from getting rid of those components, and replace them with something else, or extend if needed.

For the view layer, there are plenty of great solutions out there, for example:

1. Trailblazer Cells
2. Hanami-View
3. Phlex
4. [View Component](https://github.com/ViewComponent/view_component)

Depending on the need and context, you may need different solutions for your app, and Hanami does not stop you from doing it!

However, even if you'll come with one view engine, there are multiple templating languages you could set as your go-to in your project, like:

1. Haml
2. Slim
3. ERB
4. Liquid
5. ...and others

This already brings different configuration possibilities and arrangments but we won't stop here.

On top of this, you may be thinking of the way your templates communicate with the server, and thus setting up a javascript frontend framework or ajax integrations like

1. React
2. Vue
3. Svelte
5. HTMX

Now let's assume, you'd like to replace your default ROM integration with raw Sequel, or disable persistence completely. Do you want to go with adjusting it over and over in your side projects, or tons of new clients, if you are developing applications for small clients?

What about other integrations, like replacing `rspec` with a different test framework, or integrations for CI or deployment?

**All that can be scripted out**, and the good news is, that ruby community already started making those pre-defined solutions!

## Hanamismith

I recently found that [Brooke Kuhlmann](https://www.alchemists.io/team/brooke_kuhlmann), the author of [Alchemists.io](https://www.alchemists.io/), came up with a new gem, named  [Hanamismith](https://www.alchemists.io/projects/hanamismith/), that allows you to quickly spin up a complete, pre-configured Hanami application. At the moment it comes [with the HTMX integration](https://htmx.org/). **It's a great response for Rails' Hotwire** and I am very much excited about this integration and the possibilities it brings.

I hope, that with enough interest, different options and integrations will be added to `hanamismith` soon, so we can all play with different configuration sets to find our favorite ones.

Let me try it out very quickly

### Building the Hanami project using Hanamismith

First I need to install the `hanamismith` gem in order to use executable commands it provides

```shell
gem install hanamismith
```

Having this, I can spin my new project with some useful options. I'll add `no git`  flag, because I already have a single git repository for all my hanami mastery episodes.

Then I'll append the `github` flag to add some GitHub templates, and `github CI`  for the GitHub actions configuration.

```shell
hanamismith --build hanamimastery --no-git --git_hub --git_hub_ci
```

After hitting enter, my application is built. We may get into the project folder and check out what had been created.

### App structure.

You can see here that we have a standard Hanami 2 application created, but with some additional features.

#### Github integration

First of all, I have the .github folder added, with a simple CI configuration setup, the issue, and pull request templates included. This may need a little adjustment, especially in my case, when I don't have it stored in the root of my repository - but it's already a huge time saver for me.

#### Persistence

Then in the providers' folder, you can find the persistence provider, with a complete ROM integration in place. If I'll run my project now, it'll crash because I don't have my Postgres database created yet.

```shell
hanami server
# > FATAL:  database "hanamimastery_development" does not exist (PG::ConnectionBad)
```

Let me add it and check out what happens.

```ruby
createdb hanamimastery_development
➜  hanamimastery git:(main) ✗ hanami server
[55509] Puma starting in cluster mode...
[55509] * Puma version: 6.0.2 (ruby 3.2.0-p0) ("Sunflower")
[55509] *  Min threads: 5
[55509] *  Max threads: 5
[55509] *  Environment: development
[55509] *   Master PID: 55509
[55509] *      Workers: 8
[55509] *     Restarts: (✔) hot (✖) phased
[55509] * Preloading application
[55509] * Listening on http://0.0.0.0:2300
[55509] Use Ctrl-C to stop

lib/puma/launcher.rb:304:in `write': No such file or directory @ rb_sysopen - tmp/server.pid (Errno::ENOENT)
	from
```

Hm... It crashed again, because it cannot write to the `tmp` directory. I think I just need to create it via the `mkdir` command.

```shell
mkdir tmp
hanami server
[55872] Puma starting in cluster mode...
[55872] * Puma version: 6.0.2 (ruby 3.2.0-p0) ("Sunflower")
[55872] *  Min threads: 5
[55872] *  Max threads: 5
[55872] *  Environment: development
[55872] *   Master PID: 55872
[55872] *      Workers: 8
[55872] *     Restarts: (✔) hot (✖) phased
[55872] * Preloading application
[55872] * Listening on http://0.0.0.0:2300
[55872] Use Ctrl-C to stop
[55872] - Worker 0 (PID: 56028) booted in 0.01s, phase: 0
[55872] - Worker 1 (PID: 56029) booted in 0.01s, phase: 0
[55872] - Worker 2 (PID: 56030) booted in 0.01s, phase: 0
[55872] - Worker 3 (PID: 56031) booted in 0.01s, phase: 0
[55872] - Worker 4 (PID: 56032) booted in 0.01s, phase: 0
[55872] - Worker 5 (PID: 56033) booted in 0.01s, phase: 0
[55872] - Worker 6 (PID: 56034) booted in 0.01s, phase: 0
[55872] - Worker 7 (PID: 56035) booted in 0.01s, phase: 0
```

Now, everything seems to work fine. Visiting my browser at `localhost` on port `2300` will show me the landing page.

![Hanamismith Home page](/images/episodes/40/hanami-smith-home-page.png)

#### Views

Let's check out how the view rendering is done here. Visiting `Gemfile` will show us that *[hanami-view](https://github.com/hanami/view)* is configured together with `erb`, and in the *slices*, we have a pre-generated slice, named Main, with the homepage endpoint configured.

When I'll open the show template of my homepage, and update the content inside, I should see my updates after refreshing the page, without the need to restart the server.

![Updated Home page view](/images/episodes/40/updated-homepage.png)

### HTMX integration

You may already see that some basic styles had been applied to the document, but if we'll check the Layout, you'll see that it's just an inline CSS defined within the HTML head.

What's interesting though, is the [HTMX integration](https://htmx.org/), which allows you to add HTML components with extra abilities, like sending ajax requests and replacing only parts of the document when the request is completed.

Let me show it to you. By adding *div* wrapper with a button inside, I can define some HTMX properties now, to manipulate the button behavior.

I will set it to send the post request on click, and when a successful response will be received, we are going to replace the parent *div* content using the incoming response body as a new div content.

```html
<div id="parent">
  <button hx-post="/subscribe" hx-swap="outerHTML" hx-target="#parent">
    Click Me to subscribe!
  </button>
</div>
```

Now when I click it, my button will send an *ajax* request to the server. Nothing else happens, because I don't have this route defined yet.

Thanks to the new generators though, adding it is extremely simple.

I am going to add a new action named *subscribe* within the main slice. I will use a simplified URL, and set the HTTP method to POST.

```shell
hanami g action home.subscribe --slice=main --url='/subscribe' --http=post
```

Then in the newly created action, let's replace a default response body with the nice notification message and check out the browser again.

Yaay! It works!

With this, You may now add real functionality to your app.

Unfortunately, that's all I have for you today.

## Summary

Hanamismith is a great start and I would love this gem to evolve. If you also want it to become better, feel free to contribute by adding additional features and configuration options :).

I hope you've enjoyed this episode, and if you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/hanamimastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!

:::note Become an awesome subscriber!
If you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/HanamiMastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!
:::

## Thanks

I want to especially thank my recent sponsors,

- [Maxim Gurin](https://github.com/maximgurin)
- [prowly.com](http://prowly.com/)
- [Akilas Yemane](https://twitter.com/akilasy)

and [all the Hanami Mastery PRO subscirbers](https://pro.hanamimastery.com/), for supporting this project, I really appreciate it!

:::important Consider sponsoring?
If you want to support us, check out our [GitHub sponsors page](https://github.com/sponsors/swilgosz) or join [Hanami Mastery PRO](https://pro.hanamimastery.com/) to gain the access to more learning resources and our private discord server!
:::
