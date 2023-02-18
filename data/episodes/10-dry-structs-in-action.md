---
id: 10
aliases: ["HMEP010"]
author: "swilgosz"
topics: ['dry-rb']
title: "Model your business with structs on steroids - dry-struct in action!"
excerpt: "A struct with static type check for all attributes is a pretty useful thing in Ruby and all other languages. Here are 3 examples of useful applications for typed structs using dry-struct."
videoId: "J3LVridUt_Y"
published: true
publishedAt: "2021-11-22"
modifiedAt: "2022-07-19"
thumbnail:
  full: /images/episodes/10/cover-full.jpeg
  big: /images/episodes/10/cover-big.jpeg
  small: /images/episodes/10/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1462587511562289154
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/qz98gt/10_model_your_business_with_structs_on_steroids/
    rails: https://www.reddit.com/r/rails/comments/qz9a70/10_model_your_business_with_structs_on_steroids/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/qz9akm/10_model_your_business_with_structs_on_steroids/
source: https://github.com/hanamimastery/episodes/tree/main/010
---

In this episode of Hanami Mastery, I will deep dive into the possible implementation of the parts from a business layer in your project and show you **why typed structs** can be useful in your system. To do this, I'll use [dry-struct](https://dry-rb.org/gems/dry-struct) as a struct initialization engine.

`dry-struct` is a project created by [Nikita Shilnikov](https://github.com/flash-gordon) and managed by the [DRY-RB team](https://github.com/orgs/dry-rb/people), and I want to show you why it's extremely helpful, giving you struct-like objects, **but on steroids**.

Unlike regular structs, these give you **a static type checking for free** and will raise an error each time you try to initialize a struct with invalid attributes violating the schema definition.

One may think: "Awesome, a nice, easy-to-use validation gem for my project", but in the next moment your eyes will see, that within the dry family only **there are two other validation gems available already!** Those are [dry-schema](https://dry-rb.org/gems/dry-schema) and [dry-validation](https://dry-rb.org/gems/dry-validation), both great and together fulfill all needs of anyone who needs to validate anything.

However, more importantly, on the official website, you can find a section [addressing directly the question of validating data by using *dry-struct*](https://dry-rb.org/gems/dry-struct/1.0/#validating-data-with-dry-struct)!

It basically says, that validating data with `dry-struct` is totally possible, but you're asked not to do it as it's designed to work with already valid data....

![WAT](/images/episodes/10/wat.gif)

You may now be wondering in which scenario you could need a type check if the data is **supposed to be valid**? I can feel your confusion, so let me show you a few examples of actual applications when `dry-struct` is useful.

## 1. Event sourced systems.

The first example I came up with is when you want to get benefits from the [event sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) in your applications. In such systems, **one of the most important rules** you would like to follow is that "what happened, happened".

It means, when you publish an event, you should not remove it from the log, or even update its data or structure. Most of the event stores don't even allow such a thing to happen by not implementing an interface for updating published events.

Therefore, it's extremely important to be sure, that every event in your system has a valid structure and all data they carry on **are of a proper type.**

This is one case of when `dry-struct` can be useful. No matter if there can be a bug in the validation logic of the API interface, or at any point of the processing, by using `dry-struct` it is not possible to even instantiate an event with inappropriate data.

Let me show it to you by an example.

### Create event using typed struct

```ruby
require 'dry-struct'

module Types
  include Dry.Types()
end

class BaseEvent < Dry::Struct
  include Types
end
```

First I'll add a pre-setup script, where I require `dry-struct`, then create my local types module, in case I'd want to extend it later and create the base event, including my types module in it.

```ruby
class MoneySent < BaseEvent
  attribute :sender_id, Types::Strict::String.constrained(uuid_v4: true)
  attribute :reciever_id, Types::Strict::String.constrained(uuid_v4: true)
  attribute :currency, Types::String
  attribute :amount, Types::Strict::Decimal
end

```

Then I'm going to define my business event. Let's say, I want to track an event in the system, where money is sent to the user. I can then add an attribute named: `sender_id`, and set a rule that it needs to be a UUID type of value.

I'll repeat the same for `reciever_id`. This way, if I have UUIDs in my project to define resources, there is no way to have an invalid format of the identifier when the event is published.

Finally, for the currency, I'll just set a type of string, and the amount will be set to a big decimal. This one is pretty important, as floats are not exact, so if we'd allow floats to be passed into our system, we could end up with inconsistencies in total calculations.

```ruby
event = MoneySent.new(
  sender_id: "c2590lxd-4ec7-409d-c6d2-c7eddb02f295",
  reciever_id: "b2d506fd-409d-4ec7-b02f-c6d2295c7edd",
  currency: "EUR",
  amount: BigDecimal("20.00")
)
pp event
# <MoneySent
#  sender_id="c2590lxd-4ec7-409d-c6d2-c7eddb02f295"
#  reciever_id="b2d506fd-409d-4ec7-b02f-c6d2295c7edd"
#  currency="EUR"
#  amount=0.2e2
# >
```

Now to test it out let me add the irb and the secure random libraries and run the script.

This allows me to initialize correct events in the system, that can be published to or read from the event log, but never allow inconsistent data to pass through.

```ruby
event = MoneySent.new(sender_id: nil)
# lib/dry/types/constrained.rb:42:in `call_unsafe':
#  nil violates constraints (type?(String, nil) AND str?(nil) failed) (Dry::Types::ConstraintError)

```

I never expose the interface for publishing events directly. Publishing an event is a result of the request call handled by my action, so the parameters, which are my input, had already been validated, and the request had been authorized.

At the point where an event is initialized, there should not be any validation issue whatsoever, and if there is a problem, it certainly is unexpected, so the error risen is completely accurate behavior.

This way I can model my business logic without worrying about validation errors, and just test each part of the system in encapsulation, being sure that it's not possible to publish anything that violates the application state.

## 2. Commands

Even if you don't want to make use of events in your system, it is possible you will be interested in using the CQRS pattern in your applications, or even just extract your business domain layer aside from the framework part and communicate with it via service objects.

The rule is similar. A command, or service, directly affecting your business domain state, is something that can be called from multiple places.

- api endpoints
- rake tasks
- background jobs
- process managers
- in rails, callbacks.

All of those cases already have input data pre-validated, as [I have shown in episode 7](/episodes/7-untangle-your-app-with-dry-monads) so again, it's completely fine to raise an error in case of calling a business commands with an invalid set of attributes.

### Example of command implementation using DRY-Struct

Below I'll add a simple command and name it: `SubscribeToHanamiMastery`. Then inside I'll set the command schema.

As in the previous example, it'll inherit from `Dry::Struct` and include my types module. Then I set up the subscriber ID, type of UUID, and the email.

```ruby

class SubscribeToHanamiMastery
  class Schema < Dry::Struct
    include Types

    attribute :subscriber_id, Types::Strict::String.constrained(uuid_v4: true)
    attribute :email, Types::String
  end

  def call(input)
    schema = Schema.new(input)

    # your fancy newsletter subscription call.
    puts "You've successfully subscribed to HanamiMastery"
  end
end
```

With this, I'm going to define the interface to call my command. The `call` method accepts the input argument and initializes my command schema as the first step.

In case of invalid input, we raise the error, as the input should be validated before, in the controller action. If the error is not raised, then we are hundred percent sure that we work with valid data types, which minimizes the possibility to call subscription clients with incorrect data.

```ruby
subscribe = SubscribeToHanamiMastery.new

subscribe.call(subscriber_id: SecureRandom.uuid, email: 'you@awesome.subscriber')
# => You've successfully subscribed to HanamiMastery

subscribe.call(subscriber_id: 'invalid id', email: 'you@awesome.subscriber')
# => Traceback (most recent call last):
# /dry-types-1.5.1/lib/dry/types/constrained.rb:42:in `call_unsafe': "invalid id" violates constraints (uuid_v4?("invalid id") failed) (Dry::Types::ConstraintError)
```

When I'll call this, the command will return a successful value in case of correct data but raise an error otherwise.

## 3. Value objects

One more useful use case for using `dry-struct`, in my opinion, is a value object implementation.

I can't count how many times I have seen undefined method errors on nil class...

Having the type check verification on arguments passed into the value object practically eliminates such errors. It raises an error during the value object initialization but with a way more detailed error message, which helps a lot in debugging and testing your application.

### DRY-Struct based value object definition

Here is an example of a simple Gender value object, where you can initialize the object using integer and in case of passing an invalid value, you get an error, similar to Integer('invalid')

```ruby
class Gender < Dry::Struct::Value
  include Types
  attribute :value, Types::Integer.constrained(gteq: 0, lt: 3)
end
```

By setting the type I can eliminate the possibility to set gender value yet unsupported by the system while keeping this thing easily extendable in the future.

For now, let's just add to_i and to_s methods.

```ruby
def to_i
  value
end

def to_s
  case value
  when 0 then "undefined"
  when 1 then "male"
  when 2 then "female"
  end
end
```

You can see, that setting the type validation check on the value attribute simplifies a lot the whole class. I don't need to care about casting values, and I don't need to consider the case, where value is out of supported range.

```ruby
gender = Gender.new(value: 1)

gender.value.frozen? # true
gender.to_s # male
gender = Gender.new(value: 4) # error
```


The value objects allow us to eliminate from our system the [primitive obsession code smell](https://solnic.codes/2012/06/25/get-rid-of-that-code-smell-primitive-obsession/), and keep our systems way more reliable.

This is just a basic example, but I believe you get the idea.

## Summary

Typed structs and deeply frozen structs are a very useful tool and I certainly barely scratched the surface of possible applications, to make use of them.  I didn't even mention the reciepies or nested structs features but I strongly encourage you to discover them on your own!

I would love to see in what scenarios do you apply them in your projects, so feel free to send me some code samples or article references in the comments of this episode, and if you do want to see more advanced content, join to Hanami Mastery premium, where I dig much deeper into these topics.

I hope you've enjoyed this episode, and if you want to see more content in this fashion, **subscribe to [my YT channel](https://www.youtube.com/c/HanamiMastery)**, [Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter) and **follow me [on Twitter](https://twitter.com/hanamimastery)**!

### Special Thanks!

I'd like to especially thank my existing [github sponsors](https://github.com/sponsors/swilgosz) and a new sponsor, [Andrzej Krzywda](https://github.com/andrzejkrzywda) for supporting this project and the whole Hanami Mastery initiative! I appreciate that as without your financial support this project could not exist.

Also thanks to [Kelly Sikkema](https://unsplash.com/@kellysikkema) - for a great cover image!

Thanks to all of you for being a part of the great Ruby community and for all the positive reactions you give. You're awesome!

Feel free to checkout **my other episodes**!
