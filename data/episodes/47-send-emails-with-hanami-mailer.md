---
id: 47
aliases: ["HMEP047"]
author: "swilgosz"
topics: ["hanami", "mailer"]
title: "Send emails with hanami-mailer"
excerpt: "Sending emails in web apps is a very common task. In this video, I'm going to send a contact email using hanami-mailer gem."
videoId: olYAcN88-xc
publishedAt: "2023-06-14"
modifiedAt: "2023-06-14"
published: true
thumbnail:
  full: /images/episodes/47/cover-full.jpeg
  big: /images/episodes/47/cover-big.jpeg
  small: /images/episodes/47/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/XXX
  mastodon: https://ruby.social/@hanamimastery/XXX
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/XXX
    hanamirb: https://www.reddit.com/r/hanamirb/comments/XXX
source: https://github.com/hanamimastery/episodes/tree/main/047
---
I have here the simple application that I've built in the previous episodes, and [in the last one, I've added this form](/episodes/46-contact-form), allowing us to send values to the server for processing.

There is no processing other than logging the parameters in the console, though.

In this episode, we're going to change this and send the actual email to the support.

## Hanami-Mailer

There are many ways to send emails in Ruby, and plenty of solutions had already been created. 

Today, I'll show you the `hanami-mailer` gem.

[hanami-mailer](https://github.com/gems/hannami/mailer) is a great little library allowing you to create mailer classes for different purposes, that can be used in any application.

It aims to be easy to integrate with Hanami applications, but the caveat with it is that it had been created for the previous version of Hanami, and the full integration with Hanami 2 is not done yet, at least at the moment of publishing this video.

Usually in Hanami Mastery episodes, you can see the cool, up-to-date solutions, integrated more or less with the latest Hanami versions out of the box, or just framework-agnostic gems that can be easily used anywhere.

In this episode, though, I'll take a somewhat different approach and will integrate the *hanami-mailer* showing you how to solve some caveats leveraging the power of providers to integrate anything you want.

### Install hanami-mailer

First of all, let me install the gem by adding it to the `Gemfile`, and calling: `bundle` 

```ruby
# Gemfile

gem "hanami-mailer", github: "hanami/mailer", branch: "main"
```

### Configuration

Having that, I can create the provider for the main slice, where I'll have my mailer config, and set up the client. I'm adding it in the main slice, because different slices could be responsible for sending different types of emails, with different recipients specified or other configuration applied.

```ruby
# slices/main/config/providers/mailer.rb

Main::Slice.register_provider :mailer, namespace: true do
  prepare do
    require "hanami/mailer"
  end

  start do
  end
end
```

In the *prepare* block, I'll initialize a new configuration object and set the templates' root to `mailers`, default charset to `UTF-8`, and configure the *delivery method* to _test_ just for now. 

```ruby
# slices/main/config/providers/mailer.rb

Main::Slice.register_provider :mailer, namespace: true do
  prepare do
    require "hanami/mailer"
    
    configuration = Hanami::Mailer::Configuration.new do |config|
      config.root = target.root.join("mailers")
      config.default_charset = "UTF-8"
      config.delivery_method = :test 
    end

    register "configuration", configuration
  end

  start do
  end
end

```

Having the mailer configured, I'm going to add the configuration to the components container registry.

Keep in mind, that here in the root folder configuration for my mailers, I'm using the `target.root`, and the target refers to the slice's container, not the general application. This is why I'll place my mailers in the slice's root folder in a moment. 

### Finalize configuration.

Once the mailers are loaded, we'll need to finalize the configuration yet, and here is the caveat. 

According to the [Conventions](https://github.com/hanami/mailer#conventions) all mailers need to be loaded and initialized with the configuration object before calling `finalize` on the `Hanami::Mailer`

Without that,  my mailers will not be found in the configuration object.

```ruby
# slices/main/config/providers/mailer.rb

Main::Slice.register_provider :mailer, namespace: true do
  prepare do
    # ...
  end

  start do
    configuration = target['mailer.configuration']
    
    # TODO: load mailers here...
    
    Hanami::Mailer.finalize(configuration)
  end
end
```

This most likely will be fixed on the next version of *hanami-mailer*, but it's somewhat lower on the priority list right now, so  if you'd wonder where to start your open-source journey to become an [open-source hero worth of a poem](https://hanamimastery.com/articles/open-source-heroes), this could be a great opportunity for you to contribute to a meaningful OSS project.

But in the meantime, let's just make sure all my mailers are indeed initialized first.

```ruby
# slices/main/config/providers/mailer.rb

start do
  configuration = target['mailer.configuration']
  # Hanami::Mailer requires to initialize all mailers before finalizing
  # config, and finalizing config before using them.
  #
  mailers = Dir[configuration.root.join('*.rb')]
  mailers.each do |path|
    mailer_name = File.basename(path, '.*')
    target["mailers.#{mailer_name}"]
  end
  Hanami::Mailer.finalize(configuration)
end
```

First I want to find all defined mailers in my slice, and for that, I'm going to use the configured root path extracted from the configuration object.

This way, I'll have all my mailer filenames accessed, and I can iterate through them, forcing my container to load the object before config finalization.

I know that it's not too convenient, but in ruby community, there are many gems that are implemented using different programming styles and patterns than those proposed by Hanami 2, and I hope this example shows how elastic configuration of gems via providers can be.

With this little snippet, all the preparation work is done. Now we just need a mailer.

### Create Mailer.

I'm going to add a new folder, where I place my *ContactMailer* file, and inside define the mailer class.

First I'm going to inject my configuration object, so it'll be automatically used when we load it into the container.

Then, I'll define some required properties, like sender and recipient. For now, let me just hardcode my stuff to check if everything works as expected.

Now I need the email subject and the template name.

```ruby
# slices/main/mailers/contact_mailer.rb

module Main
  module Mailers
    class ContactMailer < Hanami::Mailer
      include Deps['mailer.configuration']
      
      from "awesome@subscriber.youare"
      to "support@hanamimastery.com"

      subject "Request: Subscription does not work"
      template 'contact_mailer'
    end
  end
end
```

### Template

I don't have a template file yet, so let me just create a new `ERB` file, with a single paragraph, showing a sample message.

```html
<p>This is a hardcoded message</p>
```

With this, I only need to call my mailer from the action.

## Calling the mailer.

In the action file, I'm going to inject the contact mailer [as a dependency](/t/dependency-injection), and inside of the `handle` method, just call `deliver` on it, passing my contact form object as arguments.

```ruby
# slices/main/actions/contact/send.rb

module Main
  module Actions
    module Contact
      class Send < Main::Action
        include Deps[
          failure_view: 'views.contact.show',
          mailer: 'mailers.contact_mailer'
        ]

        before :deserialize, :validate

        def handle(*, response)
          mailer.deliver(contact: response[:contact])
          response.redirect routes.path(:contact)
        end

        private

        # ...
      end
    end
  end
end
```

Those arguments will become my locals, which I can access from both template, and the mailer object, but I'll get back to it in a moment.

### Sending an email

For now, let's check if we actually can send the email with hardcoded content. I would love to see if I hadn't made any stupid mistakes on the way, so let me run the server now.
Hmm... as one might expect, the server crashes because of some typos I made, so let me remove them now.

I have for sure an extra colon in the provider, but let me scan if nothing else is here. Oh! One more. Let's hope that's everything as I don't want to re-record this whole video.

Ok, the application is running now. Let me then change the delivery method to `:smtp` so we could test the actual email delivery.

```ruby
config.delivery_method = :smtp, { address: "localhost", port: 1025 }
```

If I'll run the application server, and the email server, I should be able to see new emails coming in the browser tab.

```shell
hanami server
docker run -p 1080:1080 -p 1025:1025 maildev/maildev
```

Let me simulate the potential subscriber coming to HanamiMastery. For the message, I'll just paste in the string I've prepared as you probably don't want to watch me typing it in especially since we have the content of the email hardcoded.

![Filled in Contact Form](/images/episodes/47/filled-in-contact-form.png)

Now let's check the inbox... Works just great!

![Incoming email view](/images/episodes/47/incoming-mail-view.png)

:::info[Info]
I'm using [Maildev](https://github.com/maildev/maildev) to run an email server locally. Totally recommend it as it's nice and easy to use.
:::

## Adding Dynamic data

That's cool, but we need more dynamic values to be included in the email, so let's do it now.

In the email template, I'm going to change my text with the simple `message` call, that comes from the mailer object

```html
<p><%= locals.dig(:contact, :message) %></p>
```

Now, in the mailer, I'll replace the static sender with the email also fetched from locals, and finally, I'll extract the recipient to be read from settings.

```ruby
from ->(locals) { locals.dig(:contact, :email) }

to Slice['settings'].mail_support
```

### Define settings

This looks better, but let me yet define the new setting for the app. If you're not familiar with it, this module allows you to clearly define the required settings in your app, making it less error-prone in case of missing environment variables are not present.

```ruby
# config/settings.rb

setting :mail_support
```

Now let me also add the value to the corresponding variable in the development environment file.

```ruby
# .environment.development

MAIL_SUPPORT=support@hanamimastery.com
```

Now Let's test the email again. 

By the way, a much better approach would be to work with tests, instead of browser checks, but I've found that episodes full of code are hard to follow, and this way I keep videos more interesting. I already published the TDD course, but, if you'd love to see more tests in my tutorials, let me know and I'll address that in the future!

![Dynamic message in filled in contact form](/images/episodes/47/dynamic-message-contact-form-filled.png)

The email works!

![Incoming dynamic email view](/images/episodes/47/dynamic-content-incoming-email.png)

## Summary

Sending emails in ruby is a common thing, but I usually send templated emails, managed by external services and It's been a while since I've touched any email-sending library.

Hanami Mailer is a great opportunity to make email sending simple and powerful, and I'm looking forward to seeing updates and seamless integration with Hanami 2.

I hope you've enjoyed this episode, and if you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/hanamimastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!

## Thanks

I want to especially thank my recent sponsors,

-  [Lucian Ghinda](https://github.com/lucianghinda)
- [Maxim Gurin](https://github.com/maximgurin)
- [prowly.com](http://prowly.com/)

and [all the Hanami Mastery PRO subscirbers](https://pro.hanamimastery.com/), for supporting this project, I really appreciate it!

:::important[Consider sponsoring?]
If you want to support us, check out our [Github sponsors page](https://github.com/sponsors/swilgosz) or join [Hanami Mastery PRO](https://pro.hanamimastery.com/) to gain the access to more learning resources and our private discord server!
:::
