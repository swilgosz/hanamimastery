---
id: 6
author: "swilgosz"
tags: ['dry-rb', 'dry-transformer']
title: "#6 Complex Ruby Transformations made simple with Dry::Transformer"
excerpt: "Have you ever need to stringify keys outside of rails? Whether you want to import or export CSVs or communicate with external services you may need to parse the input to different output. 'dry-transformer' can help you with it."
publishedAt: "2021-07-09"
modifiedAt: "2021-10-03"
alias: 'HMEP006'
videoId: JAJae1S4tDw
thumbnail:
  full: /images/episodes/6/cover-full.jpeg
  big: /images/episodes/6/cover-big.jpeg
  small: /images/episodes/6/cover-small.jpeg
source: https://github.com/hanamimastery/episodes/tree/main/006
---

I often work with hashes in plain ruby, especially when I prepare **standalone scripts or gem packages**, or [I need to deserialize the parameters comming to the server](/episodes/7-untangle-your-app-with-dry-monads), and there were plenty of situations where I needed to do some simple, or more complex data transformations to achieve the expected output.

In the *episode #4* I've described [how I easily do fancy manipulations on string objects](/episodes/4-string-transformations-with-dry-inflector), but, more complex data sets require more powerful tricks to serve our needs so I've decided to extend this topic.

### Troubles with data transformations - symbolize keys

One example of troublesome hash, is when I get the hash as a method argument, but **I don't know if the keys are symbols or strings**. Then things can get messy.

```ruby
def deserialize(hash)
   hash[:data]
end

deserialize({ 'data' => 'bad luck!' })
# => nil
```

Because the expected key does not exist, I receive `nil` and I can easily end up with the *undefined method* error which may be an embarrassing overlook for me in the eyes of my clients.

#### Custom hash stringifiers

In rails, you can just call `symbolize_keys` or `deep_symbolize_keys` on the given hash and the problem would be solved. This would work on any deep level of my argument.

```ruby
# in rails

def deserialize(hash)
   hash.deep_symbolize_keys[:data]
end

deserialize({ 'data' => 'good luck!' })
# => 'good luck'
```

But how it would look like outside of the Rails ecosystem? The `deep_symbolize_keys` method is not defined in plain ruby.

Here is the simplified solution I used in the past all the time using the `each_with_object` method.

```ruby
hash = {
  'visitor' => 'John',
  'city' => 'NY',
  'zip' => '1234'
}
hash.each_with_object({}) { |(k, v), r| r[k.to_sym] = v }
# => { visitor: 'John', city: 'NY', zip: '1234' }
```

Horrible, but works for plain hashes. However, since ruby 2.5 we have access to the `transform_keys` method, which is way more convenient.

```ruby
hash = {
  'visitor' => 'John',
  'city' => 'NY',
  'zip' => '1234'
}
hash.transform_keys(&:to_s)
# => { 'visitor' => 'John', 'city' => 'NY', 'zip' => '1234' }
```

While this looks fine, **none of this will take into account nested hashes**. If I'd want to solve THIS problem, things would quickly get messy, and in case of more transformations required on the data set, I would quickly get lost in my own code.

>Note: As [thunderbong](https://www.reddit.com/user/thunderbong/) [pointed out on Reddit](https://www.reddit.com/r/ruby/comments/ogu1lu/6_complex_ruby_transformations_made_simple_with/), there is a nice way to handle nested key transformations easily using `JSON` library.

```ruby
require 'json'

hash = {
  'name' =>
  'Mr. Smith',
  'address' => { 'city' => 'Sim City', 'zip' => 123456 }
}

JSON.parse(JSON[hash], symbolize_names: true)
# => { :name=>"Mr. Smith", :address => { :city => "Sim City", :zip => 123456 } }
```

Just it's not trivial to remember about all the edge cases of the data transformations..

### Nest keys

The other very simple example would be to** nest a set of keys** under a chosen parent.  If I store the address information as a `jsonb` in my database, I'd be forced to group the address-related keys and store them together under the `address` column.

Again, the `each_with_object` method would come in handy here.

```ruby
def nest(hash)
  hash.each_with_object({}) do |(k, v), r|
    if %i[city zip].include?(k.to_sym)
      r[:address] ||= {}
      r[:address][k] = v
    else
      r[k] = v
    end
  end
end

hash = { visitor: 'John', city: 'NY', zip: '1234' }
nest(hash)
# => { visitor: 'John', address: { city: 'NY', zip: '1234' } }
```

I can iterate through the initial hash, and in case the key is inside of the given set, nest it under the `address` root, and otherwise just copy the initial value.

If you think it works, You're wrong. It works for symbolized keys, but if I'll pass the same hash with strings as keys,** the original hash will be returned**. Easy to fix? Just let's change the key comparison here to ensure the compared value is a symbol...

And **we end up with a completely messed hash as a result!**

What I want to point out here, is the fact that ensuring data to be transformed expectedly **is not trivial**, and it's extremely easy to overlook a single scenario that can haunt us later.

It's already hard to see what's happening here, and again, if there would be **several transformations like this required** on the given data set, my code would become really messy and hard to handle.

Just imagine that I'd need to stringify and rename some keys too!

### Meet dry-transformer

This is where a great little gem comes with help. It's a [dry-transformer](https://dry-rb.org/gems/dry-transformer), another amazing micro-library put together by [Piotr Solnica](https://github.com/solnic), it is great as it has completely no dependencies whatsoever! You can inject it in your projects without any risk - and in case you want to have it directly in your codebase, you can even just copy the code,** as only plain ruby is used inside**. Amazing stuff.

This little library allows you to pass any data as an input and do some crazy transformations to ensure you will work with the expected data format.

#### Ok, but How that could be handy?

Well, one example is, that in HanamiMastery I work with [JSON:API standard](https://jsonapi.org/) when it comes to my API communication. It's super nice, REST-ful standard, with a lot of overhead already done by very smart people.

However, when I want to make my projects to communicate with, for example, GitHub, it would not work, as GitHub uses the Rest API standard, which is Rails default.

![Communication troubles](/images/episodes/6/adapters-1.png)

It would be silly to ask them to adjust their API for my needs;)

![How not to communicate](/images/episodes/6/adapters-2.png)

What I should do, is transform the incoming data from one standard to another relatively easily and ideally, do the two-way transformations!

![Why we need adapters](/images/episodes/6/adapters-3.png)

#### Other useful examples for data transformations in Ruby

Similar requirements are often needed in case of:
- CSV exports or imports,
- RSS parsing,
- user input
- code highlighting
- markdown files

and so on. There are countless use cases, where I can't just validate the input and throw away an error because data are valid, however in a different format than my script or data store expect.

In such scenarios, I should write an adapter that applies a list of transformations to the input and produces the output I can work with.

With `dry-transformer` our simple examples would be trivial. We create our adapter class, that gets the data from Github

```ruby
class HanamiMasteryAdapter < Dry::Transformer::Pipe
  import Dry::Transformer::HashTransformations

  define! do
    deep_symbolize_keys
    nest :address, %i[city zip]
    rename_keys login: :name
  end
end

hash = {
  'id' => 1
  'login' => 'John',
  'city' => 'NY',
  'zip' => { 'number' => 1234 }
}
adapter.call(hash)
# => { id: name: 'John', address: { city: 'NY', zip: { number: 1234 } } }
```

But also, **some much more complex scenarios** may be done in a simple, easy to read and maintain code.

### Summary

`dry-transformer` allows you to** write middleware for your APIs with no effort**, you can do mappings from hash to objects and other ways around, advanced array modifications, and a whole bunch of other stuff you would ever need.

As I often say, the only thing that restricts us is our imagination and `dry-transformer` **allows you to transform anything into anything else** using a tiny DSL written on top of ruby.

Super useful stuff and I strongly suggest giving it a shot. You may be surprised how easily you can write adapters, serializers, and deserializers from now on.

I hope you've enjoyed this episode, and if you want to see more content in this fashion,** Subscribe to [this YT channel](https://www.youtube.com/channel/UC4Z5nwSfZrUO4NI_n9SY3uQ)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!

Also, If you have any suggestions of amazing ruby gems You'd like me to cover, or ideas on how to improve, please mention them in the comments!

### Special thanks

I'd like to thank [Benjamin Klotz]. for joining my Github sponsors, I appreciate that a lot!

Any support allows me to spend more time on creating this content, promoting, and supporting great open source projects, and helping you use them. So thank you!

As always, check out my other episodes and let me know what you think! Thank you all for being here, you're awesome! - and see you in the next Hanami Mastery episode!

-[Benjamin Klotz](https://github.com/tak1n) For joining my [High Five! supporters tier](https://github.com/sponsors/swilgosz)!
- [Arseny Togulev](https://unsplash.com/@tetrakiss)- for a great cover image
- [Mateusz Jarosz](https://twitter.com/jaroszm91) - for an inspiration for this article
