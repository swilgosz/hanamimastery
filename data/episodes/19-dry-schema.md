---
id: 19
aliases: ["HMEP019"]
author: "swilgosz"
topics: ["dry-rb", "dry-schema", "hanami"]
title: "The underrated power of dry-schema"
excerpt: "dry-schema is an extremely powerful and validation engine for Ruby applications and as it's a built-in validation solution for Hanami projects, It is important to get familiar with it."
videoId: 6ayFwr2OcDc
publishedAt: "2022-04-19"
modifiedAt: "2022-04-19"
thumbnail:
  full: /images/episodes/19/cover-full.jpeg
  big: /images/episodes/19/cover-big.jpeg
  small: /images/episodes/19/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/XXX
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/XXX
    rails: https://www.reddit.com/r/rails/comments/pjuqct/XXX
    hanamirb: https://www.reddit.com/r/hanamirb/comments/XXX
source: https://github.com/hanamimastery/episodes/tree/main/019
---

[dry-validation](https://dry-rb.org/gems/dry-validation) is **the most popular gem from the whole collection of the DRY libraries**, there is no doubt about it. Validating data incoming to the system is an extremely important thing to do well, and *dry-validation* is probably the best ruby gem to take care of that task.

However, *dry-validation* consists of 2 big parts, one of which, and I think the bigger piece, is another gem, named *dry-schema*, and dry validation is a library built on top to extend *dry-schema* functionality by a few useful features.

In this episode, I want to explicitly tell you about *dry-schema* and explain in what scenarios you could use it as a standalone validation engine.

### What is *dry-schema*

[dry-schema](https://dry-rb.org/gems/dry-schema) is a gem created by [Peter Solnica](https://github.com/solnic) around 2019 by extracting it from `dry-validation` and the intention was to make dry-validation more extendable, by extracting the structure and the basic type checks to simplify dry-validation source code.

You may [read more about dry-schema origins](https://solnic.codes/2019/01/31/introducing-dry-schema/) on the blog post published by the gem's creator a few years back already.

In this episode, I'll mostly focus on covering a few nice features and explaining, when `dry-schema` is a perfect choice for validating data structures.

### What is *dry-schema* for
Dry schema is only designed for simple data validations, and because of its amazing performance, it lets you validate every input to your system, not just models just before saving them to the databases.

The key goal of this gem is to ensure that data you'll work with, is safe for being used by your code. It provides two main functionalities:

- data structure validation
- type validation

The list of features is actually stupidly long, but these two points are the main focus of the library.

#### Data structure

In your application you may have various types of input, like: 
- Form Params
- JSON body parameters.
- YAML or JSON config files
- CSV data collections
- Nested GET params for filtering purposes

However, in most of ruby applications, not everything is validated. Over years I've found that people tend to validate mostly database models, to avoid saving records to the database with incorrect field values.

But this is waay too late to apply validations. If you don't agree, please recall if you've ever experienced an [undefined method error  for nil class](https://stackoverflow.com/search?q=undefined+method+for+nil+class)? I did. A lot actually.

This kind of issues can be completely eliminated if more people would make use of gems like `dry-schema`, validating and transforming all the input incomming to the system, ensuring they always work with data types they expect.

#### Why we validate data?

##### 1. Security

But why we validate params in the first place? One of the important reasons is of course security. You may experience [SQL injection](https://en.wikipedia.org/wiki/SQL_injection), or just hacking to the system by updating the field you won't intended to allow. This is why we need [strong parameters in Rails](https://quick-adviser.com/why-do-we-need-strong-params-in-rails/), and this is [why dry-schema is used as a improved replacement for this use case in Hanami actions](/episodes/18-hanami-actions-basics). I've covered this in my previous episode, feel free to check it out!

##### 2. Reliability

The second big reason is to avoid unexpected errors caused by invalid data values or formatted in an incorrect way.

If you think you do validate your app well, **how many of you validate the GET params** collections to only apply filters for supported queries?

`dry-schema` allows you to easily validate exactly that. It helps you check if the given data is in the expected format, structure, and contains fields of expected types.

Additionally, it allows you to coerce some data types in certain elements and do basic transformations when needed to ensure you never get `nil` when you don't intend to.

But best would be to show it to you by an example.

Let's say I want to validate the name and age of the input hash.

```ruby
input = { name: 'Seb', age: 19 } 
```

With `dry-schema` you can define the expected data structure for your validation, defining all the input structure rules.

Here I'm going to specify, that my name is required, but my age is optional.

```ruby
require 'dry-schema'

schema = Dry::Schema.define do
  required(:name)
  optional(:age)
end
```

When I'll call it with or without `age` key, it'll return success.

```ruby

input = { name: 'Seb', age: 19 }
schema.call(input).success?
# => true

input = { name: 'Seb' }
schema.call(input).success?
# => true
```

However, for missing name field, we'll get the failure, with error messages being filled in for missing field.

```ruby
input = { age: 19 }
schema.call(input).success?
```

I can add more stuff, like requiring some data to be filled, while allowing others to be empty.

```ruby
require 'dry-schema'

schema = Dry::Schema.define do
  required(:name).filled(:string)
  optional(:age).maybe(:integer)
end
```

The code above will allow my age to be `nil` or filled string, while my name would always need to be a filled string.

```ruby
input = { name: nil, age: nil }
schema.call(input).success?
# => false
schema.call(input).errors.to_h
# => {:name=>["must be a string"]}
```

#### Data coercion

However, for certain scenarios, my validations would not behave as expected. If I'll pass to my web server a params, they'll be transformed from JSON string to a hash, but all the values would be strings, no integers.

```ruby
input = { name: 'Seb', age: '19' }
schema.call(input).success?
# => false

schema.call(input).errors.to_h
# => {:age=>["must be an integer"]}
```

This could be an issue, as we would need to explicitly transform the string values to Integer. However, [that often does not work well](https://solnic.codes/2020/07/29/be-cautious-with-ruby-coercion-methods/). - I recommend another great article explicitly about this topic if you want to increase your vast knowledge about Ruby coercion methods.

Fortunately, dry-schema allows you to perform simple data coercions with no effort - and in a secure manner. To do so, just replace the `define` method with `Params` coercion type, and it will properly recognize all the integers in your schema.

```ruby
require 'dry-schema'

schema = Dry::Schema.Params do
  required(:name).filled(:string)
  required(:age).filled(:integer)
end

input = { name: 'Seb', age: '19' }
result = schema.call(input)

result.success?
# => true
```

The super awesome thing about it is that you can now work with the result of your validation, having all the values properly transformed to expected data types!

```ruby
result.to_h
# => { name: 'Seb', age: 19 } # notice it's not string anymore
```

And it's highly recommended to always do so, to minimize the situation where our code crashes due to unexpected data type as an input argument.

Never more `undefined method on nil class` never more trying to add two strings instead integers!

What a wonderful time to be alive!

However, it's not the end of the awesome features `dry-schema` allows you to do.

#### Macros

`dry-schema` comes with a great collection of built-in predicates logic, that allows you to chain multiple simple rules. With this you can create way more strict validations if needed.

For example, if I'd like to validate all **tags in my search query** I could require the `tags` key, passing a block with a predicate logic inside. I can check if the input is an `array`, and **for each array element check if it's a string**.

```ruby
schema = Dry::Schema.Params do
  required(:tags) { array? & each { str? } } 
end

tags = ['tag1', 'tag2', :tag3]
result = schema.call(tags: tags)
result.success?
# => false
results.errors.to_h
# => { :tags=>{ 2=>["must be a string"] } }

```

However, while this is very powerful and extendable, it can lead to a lot of redundant code and may not be very convenient in case of more complex examples.

This is why common predicates had been [wrapped in macros](https://dry-rb.org/gems/dry-schema/1.9/basics/macros/), simplifying the usage of the gem by a lot.

To achieve the same tags array validation, we can replace the block call with an `each` macro.

```ruby
schema = Dry::Schema.Params do
  required(:tags).value(:array, min_size?: 2).each(:str?)
end

result = schema.call(tags: tags)
result.success?
# => false
results.errors.to_h
# => { :tags=>{ 2=>["must be a string"] } }
```

All the `filled`, and `maybe` keywords were macros too. I strongly recommend visit the documentation for all the built-in macros and **how to build your own**.

Because YES, you can build your own macros, wrapping any set of predicates common for your project, to make your code more DRY, however that is easier to be done by using dry-validation gem.

#### Using classes instead variables.

Now let me go one step further.

When you work with multiple files, you probably would like to have your validation objects being defined in separate files, placed in a folder like: `contracts`, `schemas` or `validators`.

It's easy to do so too! Just make your class inheriting form the `Params` schema, and define your schema using the `define` keyword.

```ruby
class MySchema < Dry::Schema.Params
  define do
    required(:tags).value(:array, min_size?: 2).each(:str?)
  end
end

contract = MySchema.new
result = contract.call(['tag1', 2])
result.success?
# => false
result.errors.to_h
# => 
```

These error messages [can accept locale information](https://dry-rb.org/gems/dry-schema/1.9/basics/working-with-schemas/#working-with-error-messages) to return information in different languages, as well as several other options.

### Reusing schemas

You can also extract common parts of your schemas to the reusable classes. For example, if I have the other info schema defined, I can just use it in the user schema, and all the nested fields will be properly validated, if I'll ever want to create a whole user object at once!

```ruby
class OtherInfoSchema < Dry::Schema::Params
  define do
    required(:tags).value(:array, min_size?: 2).each(:str?)
  end
end

class UserSchema < Dry::Schema::Params
  define do
    required(:name).filled(:string)
    optional(:age).maybe(:integer)
    required(:other_info).schema(OtherInfoSchema.new)
  end
end
```

Now when I'll pass my tags wrapped within the `other_info` key, I'll get my validation rules applied to the user validator! 

```ruby
schema = UserSchema.new
result = schema.call(
  name: 'Seb',
  age: '19',
  other_info: { tags: [] }
)
result.success?
# => false
result.errors.to_h
# => {:other_info=>{:tags=>["size cannot be less than 2"]}}
```

It's amazing, how it can allow you to organize your code and manage input data validations apart from the business logic.

### Summary

But this is all I've for you in this episode!

:::note Become an awesome subscriber!

If you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/channel/UC4Z5nwSfZrUO4NI_n9SY3uQ)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!
:::

In this video, I have only touched basics of using the *dry-schema*. There is way more to learn - a whole *advanced* section of features, with filtering, composing schemas, Abstract Syntax Tree, and more.

There are extensions, predicates logic and types checks which use `dry-types` under the hood. It's a whole world of validation-related features, and I honestly love this gem a lot.

`dry-schema` is in my opinion one of the most powerful DRY gems out there and `dry-validation` extends it even more to add business validation on top.

It's extremely fast, composable, and powerful validation engine and I strongly recommend to check it out if you haven't yet.

Maybe with this gem added to your project, you'll start to validate more input data, and less bugs will appear in your applications.

### When to use dry-schema?

At the end, by quoting the documentation statement, if you wonder when to use this beauty, the answer is "Always, and Everywhere!"

### Thanks!

I want to especially thank my recent sponsors, 

- **[Saeloun](https://github.com/saeloun)**
- **[Brandon Weaver](https://github.com/baweaver)**
- **[AscendaLoyalty](https://ascendaloyalty.com)**

for supporting this project, I really appreciate it!

By helping me with monthly github sponsorship to creating this content, together we really start making a difference in the Open-Source world! Thank you all for your support!

And remember, if you want to support my work even without money involved, the best you can do is to like, share and comment on my episodes and discussions threads. Help me add value to the Open-Source community!

Also big thanks to [Arnold Antoo](https://unsplash.com/@arnold_antoo) for the great cover image!

:::note Do you know great Ruby gems?

Leave a comment with `#suggestion`, I'll gladly cover them in the future episodes!
:::
