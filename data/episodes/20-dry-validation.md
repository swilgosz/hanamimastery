---
id: 20
aliases: ["HMEP020"]
author: "swilgosz"
topics: ["dry-rb", "dry-validation", "hanami"]
title: "dry-validation - The one gem to validate them all!"
excerpt: "Validating data input is an extremely important problem to tackle in all applications. In Ruby ecosystem there is no better tool for that than dry-validation. Here is why!"
videoId: 2FhHo38dHpw
published: true
publishedAt: "2022-04-25"
modifiedAt: "2022-04-29"
thumbnail:
  full: /images/episodes/20/cover-full.jpeg
  big: /images/episodes/20/cover-big.jpeg
  small: /images/episodes/20/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1518496292569333760
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/ubfop4/dryvalidation_the_one_gem_to_validate_them_all/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/ubfoyg/dryvalidation_the_one_gem_to_validate_them_all/
source: https://github.com/hanamimastery/episodes/tree/main/020
---

In the last episode, I've talked to you about the [*dry-schema* features](/episodes/19-dry-schema) **allowing you to easily validate data structures and attributes types** in your ruby applications.

However powerful, it's not [dry-schema](https://dry-rb.org/gems/dry-schema) that is the mostly used DRY library. It's another gem, built on top of that engine which extends it's functionality.

It's *dry-validation* and this is what I'll talk today about.

## What is dry-validation?

*[dry-validation](https://dry-rb.org/gems/dry-validation)* is a data validation library for all kinds of ruby applications, that provides complete set of features you'd need to validate anything.

1. **It uses *dry-schema* for data structure and type validation**, which is great on its own!
2. Extends the functionality to add business validations.
3. Allows injecting external dependencies
4. Allows writing **custom macros**.
5. **It plays extremely well with dependency injection**

I have recorded two episodes about [how to do dependency injection in ruby like a PRO](/t/dependency-injection) using DRY-libraries, so feel free to check them out!

:::tip[Do you want to apply next-level dependency injection in your ruby apps?]

Here you can learn about how dry-container can solve some of the DI problems: [HME014 - Dependency Injection in Ruby: From zero to hero](/episodes/14-dependency-injection-in-ruby-from-zero-to-hero-part-1)
And here how to master DI in ruby by leveraging the features of dry-system:
[HME015 - Dependency injection in Ruby: God Level](/episodes/15-dependency-injection-god-level-part-2)
:::

## When to use dry-validation?

If you have projects, where there is not too much of the business logic to be validated, **chances are that dry-schema standalone would be enough** for you.

However, when you want to add more advanced validation, like
- email uniqueness,
- validating attributes based on others provided,
- connect to external apis ,
- display powerful YAML-based error messages

then *dry-validation* is the way to go.

**In Hanami, you have access to both gems**, as *dry-schema* is a subset of *dry-validation*, and in the actions, it's usually ok to just validate the data structures.

Let me show you a few nice features specific for *dry-validation*.

:::important
If you want to use *dry-validation* in your project, **this video shows just a subset of features** - the whole functionality provided by *dry-schema* is omitted here, **as I've covered this gem in two of my previous episodes**. Check them out to have a complete overview of validation power you get for free in Hanami applications.

- [HME018 - Validating params in Hanami Actions](/episodes/18-hanami-actions-basics)
- [HME019 - dry-schema overview](/episodes/19-dry-schema)
:::

So let's go over a few things that are cool in *dry-validation*.

## Rules

As an addition to built in structure and type check, *dry-validation* allows you to define custom validation rules.

Here I have a contract, that validates the start and the end date of my reservation.

```ruby
class ReservationContract < Dry::Validation::Contract
  params do
    required(:from).value(:date)
    required(:to).value(:date)
  end

  rule(:from, :to) do
    key.failure('must be after start date') if values[:to] <= values[:from]
  end
end
```

The params section is a simple validation that is provided by *dry-schema*. It checks the input and applies the basic transformations if applicable, to ensure I'll work with the data of expected types.

If this basic validation fails, program stops there, and does not even reach the advanced validation rules, which is an extremely nice boost to the performance!

Only when the basic validation passed, we reach the advanced validation `rule` , which compares two different attributes and returns the error response in case of expectations not being met.

Now I can use it by creating the contract and calling it with some attributes and checking the error responses.

```ruby
contract = EventContract.new
result = contract.call(from: Date.today, to: Date.today - 1)

result.success?
# => false

result.errors.to_h
# => {:end_date=>["must be after start date"]}
```

## Custom macros

In case you have a very common validation scenario, like email validation, that should be the same across your whole application, you may save some code duplication by extracting this validation rule, to a macro!

```ruby
Dry::Validation.register_macro(:email_format) do
  unless /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i.match?(value)
    key.failure('not a valid email format')
  end
end
```

```ruby
class HanamiMasterySubscriptionContract < ApplicationContract
  params do
    required(:email).filled(:string)
  end

  rule(:email).validate(:email_format)
end
```

This makes the syntax extremely easy to use, while [keeping the gem very simple concept-wise](https://youtu.be/cCD7QJB4HHs).

However, it's not the end.

## Injecting external dependencies

As in addition you may inject the external dependencies to the contract. For example, you may pass here in the repository object, or *activerecord* model to check if given user has already subscribed to your newsletter!

```ruby
class HanamiMasterySubscriptionContract < Dry::Validation::Contract
  option :repo

  params do
    required(:email).filled(:string)
  end

  rule(:email).validate(:email_format)
  rule(:email) do
    unless repo.exists?(values[:email])
      key.failure("I appreciate you want to subscribe twice but we don't want to spam you!")
    end
  end
end
```

Now I can pass the repo to the contract using dependency injection, and validate freely the uniqueness of my email.

```ruby
class Repo
  def exists?(email)
    true
  end
end

contract = HanamiMasterySubscriptionContract.new(repo: Repo.new)
result = contract.call(email: 'awesomesubscriber@hanamimastery.com')
result.errors.to_h
# => {:email=>["I appreciate you want to subscribe twice but we don't want to spam you!"]}
```

Awesome!

This works perfectly in Hanami applications, where you have dependency injection integrated as the main way to manage dependencies, however, I have used it in Rails apps in the past too and it worked great with*activerecord* objects!

### Monads

The next feature I wanted to show you, is the fact that *dry-validation* is extendable. *dry-validation* [comes with two extensions built-in](https://dry-rb.org/gems/dry-validation/1.8/extensions/) which you can enable if you want, but you can also write your own whenever you need them.

Here is an example of `monads` extension, which makes your contracts compatible with [dry-monads](https://dry-rb.org/gems/dry-monads).

I strongly recommend checking that one too! I've covered it in [HME007](/episodes/7-untangle-your-app-with-dry-monads) which is the most popular episode I've recorded so far!

To use it I need to enable monads extension somewhere in your app code

```ruby
require 'dry/validation'

Dry::Validation.load_extensions(:monads)
```

And now, I can treat my contracts as monads, making use of all the operations *dry-monads* provides

```ruby
class MyContract < Dry::Validation::Contract
  params do
    required(:name).filled(:string)
  end
end

my_contract = MyContract.new

my_contract.(name: "")
  .to_monad
  .fmap { |r| puts "passed: #{r.to_h.inspect}" }
  .or   { |r| puts "failed: #{r.errors.to_h.inspect}" }
```

If you want to know more, I recommend checking out the [DRY in Five Youtube series](https://www.youtube.com/watch?v=6FITn8FheQs&list=PLLproF5gmeGGvXX7kZuCmWnZ6dOaeLs_v) by [Luca Guidi](https://lucaguidi.com/), which is a nice intro to this gem. And, if you want to get the always up-to-date information, make sure you follow the DRY-RB on Twitter and visit the [gem's documentation](https://dry-rb.org/gems)!

### Summary

*dry-validation* is an amazing library. It's the most popular DRY gem released so far, and there is a reason for this.

The funny thing is that people often use it in Rails applications, skipping strong_parameters and active_model validations completely, as this one is more safe and faster.

Unfortunately, this is all I've for today! I hope you enjoyed this episode and stay in touch to get updates about my upcoming content!

:::important[Become an awesome subscriber!]

If you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/HanamiMastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!
:::

### Thanks

I want to especially thank my recent sponsors,

- **[Saeloun](https://github.com/saeloun)**
- **[Brandon Weaver](https://github.com/baweaver)**
- **[AscendaLoyalty](https://ascendaloyalty.com)**

By helping me with [monthly github sponsorship](https://github.com/sponsors/swilgosz) to create this content, together we really start making a difference in the Open-Source world! Thank you all for your support!

And remember, if you want to support my work even without money involved, the best you can do is to like, share and comment on my episodes and discussions threads. Help me add value to the Open-Source community!

Also big thanks to [Thibault Luycx](https://unsplash.com/@conscious_design) for a great cover image!
