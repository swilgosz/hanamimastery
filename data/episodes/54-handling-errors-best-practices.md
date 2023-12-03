---
id: 54
aliases:
  - "HMEP054"
published: 
author: swilgosz
topics:
  - "errors"
  - "hanami"
title: "Exceptional Exceptions in Ruby!"
excerpt: "Proper error handling in your application is often overlooked, but it's extremely important to not get crazy in maintaining your projects. Check out how you can put your error notifications to the next level in any ruby application."
videoId: 
publishedAt: "2023-10-17"
modifiedAt: "2023-10-17"
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
source: "https://github.com/hanamimastery/episodes/compare/HME054-pre...HME054"
---
[🎬 01] Hi there!

Today I want to show you one of the great ways to handle ruby errors in your applications. With this knowledge, you can speed up the debugging process, and simplify the maintainability of your whole application, making your and your team's lives much easier.
## Example
[🎬 02] In the Hanami Mastery app I have [Github](/episodes/45-github-integration), [Google Drive](/episodes/43-connect-with-google-drive), and Notion integrations, and to work with GitHub, I'm using the [Octokit gem](https://github.com/octokit/octokit.rb).

[🎬 03] There are numerous things that may go wrong with this.

1. The client can raise a connection error
2. Github can return errors due to internal problems with a particular endpoint
3. I can have permissions issues
4. Or I could try to access resources that are not available due to being changed or removed.

[🎬 04] In most of those cases, I'll end up with my GitHub client raising the **gem-specific error**. Let me show you an example when I want to fetch my article content, but the file does not exist or has been removed from the repository.

[🎬 05] I have here my Github integration that I've written in [[45-github-integration|HMEP045]], so if you want to check it out, feel free to do so.

[🎬 06] If I try to fetch the episode's file content by passing the path to the file that does not exist, I'll get the `Octokit::NotFound` error

```ruby
# Ruby console
client = Octokit::Client.new(
	access_token: File.read('./.access_token')
)
github = Github.new(client)
github.fetch('data/222')
# Octokit::NotFound: 
#  GET https://api.github.com/repos/swilgosz/hanamimastery/contents/data/222?ref=heads%2Fmaster: 404 - Not Found // See: https://docs.github.com/rest/repos/contents#get-repository-content
# from # /Users/sebastian/.asdf/installs/ruby/3.2.0/lib/ruby/gems/3.2.0/gems/octokit-7.1.0/lib/octokit/response/raise_error.rb:14:in `on_complete'
```

[🎬 07] The issue with this is, that there is a lack of context in the returned value. Even though I know where it happened because I have the backtrace and the message, I can only react quickly because I'm a developer and this project is small. 

Imagine having a few teammates working on a **much bigger application**, where not everyone is familiar with every single feature of the app. What does it mean that content under this path is not found? What even `Octokit` mean?

If different people will be looking for any issues raised by my application, they would love to be able to react quickly, knowing what exactly happened and what to do with this.

In this episode, I'll show you how you can avoid working with errors raised by gems directly and how you can have application-specific error handling that provides you with all the context you need.
## The solution for this.

[🎬 08] If we visit the [Octokit source code](https://github.com/octokit/octokit.rb/blob/main/lib/octokit/error.rb), you'll see that they do the same thing.  Developers of this gem don't rely on the standard ruby exceptions, but they wrap original errors with their own error objects, so they can freely manage the additional information useful for debugging.

Let me show you how we can leverage this information.
## The end goal

[🎬 09] My goal for this episode is to provide you with the context of what happened in the system, make it easier to document the action needed when an error happens, and not lose the information about the original error that had been raised.

- ✅ Additional context
- ✅ Easy to document recovery actions for error raised
- ✅ Include original error information.
## Different ways of error handling
[🎬 10] Going back to my  github integration, let's focus on the method that allows me to fetch the file content using the Octokit client.

In the example below, I'm working with the external service, and I rely on the fact it'll raise an error that I can handle.

```ruby
# slices/main/integrations/github.rb

def fetch(path)
  res = client.contents(REPO,path: path, query: { ref: REF })
  Base64.decode64(res.content)
end
```

[🎬 11] The problem with this is, that I can't control the error class or structure. Whenever I update the gem, my error notifications can start to differ, causing confusion in the team. Also, they often are library-specific and do not provide enough context over what happened in the specific scenario. 

Overall, gem cannot be aware of the business logic you have in your app.
### Message passing
[🎬 12] To deal with this problem, we could simply `rescue` from the `Standard` error, and provide the context message for us to find the problem more quickly.

```ruby
# slices/main/integrations/github.rb

def fetch(path)
  res = client.contents(REPO, path: path, query: { ref: REF })
  Base64.decode64(res.content)
rescue StandardError => e
  raise "Fetching Content of the requested file failed"
end
```

[🎬 13] If I just do this, I'll lose all the information about the original error though. Also, working with hardcoded strings is hard to maintain, especially on a larger scale. Imagine documenting this to your team. Once you'll want to update the message to be more clear, you'll have to change the documentation, to keep things searchable.

[🎬 14] When I call it with a begin-rescue block, you'll get the `RuntimeError`, with the message I've passed.

```ruby
# Ruby console

begin
  github.fetch(222)
rescue => e
end

e
# => <RuntimeError: Fetching Content of the requested file failed>
```

Here at least, you may prevent the original error from being swallowed.

### Original error cause
[🎬 15] Ruby exceptions have the `cause` method available, that will return the previous error being raised by the system.

```ruby
e.cause
#<Octokit::NotFound: GET https://api.github.com/repos/swilgosz/hanamimastery/contents/data/222?ref=heads%2Fmaster: 404 - Not Found // See: https://docs.github.com/rest/repos/contents#get-repository-content>
```

[🎬 16] Whenever you log the error to your external error notifier, you may want to include the `cause` information - or at least I would suggest you do so.

[🎬 17] Without this, you'd need to log the original error caused by the system in the place where the error is raised.

```ruby
# slices/main/integrations/github.rb

def fetch(path)
  res = client.contents(REPO, path: path, query: { ref: REF })
  Base64.decode64(res.content)
rescue StandardError => e
  logger.error(e) # this is original Octokit::NotFound error
  raise "Fetching Content of the requested file failed"
end
```

[🎬 18] However, with the `cause` method, you may have a global error handler, and log the errors in a single place however you want.

```ruby
# Ruby console

def handle(&block)
  block.call
rescue => e
  logger = Hanamimastery::App['logger']
  logger.error(e)
  logger.error("caused by")
  logger.error(e.cause) # may be nil or error object
end
```

However, we have not yet solved our documentation issues.

[🎬 19] If you use string messages as errors, You'll have trouble with filtering them down and grouping them correctly if the message includes dynamic data.

At the end, you'll have problems with documenting recovery actions for those errors. 

Ideally, for each important error, I want to have a clean place to look at, in order to check who to reach out to for help, and how to react to this.

Let me extend it further
### Custom error classes
[🎬 20] The other way to do error handling is by raising the custom error class instead of just a string.

```ruby
# slices/main/integrations/github.rb

GithubFetchingError = Class.new(StandardError)

def fetch(path)
  res = client.contents(REPO, path: path, query: { ref: REF })
  Base64.decode64(res.content)
rescue StandardError => e
  raise GithubFetchingError
end
```

[🎬 21] In this approach, You've set up a custom error class, which is usually easier to maintain, document, and filter. [🎬 22] You still can access the original error using the `cause` method, which prevents you from losing any existing information about the error.

```ruby
begin
  github.fetch(200)
rescue => e
  logger.error(e.cause)
  logger.error(e)
end

e
=> #<Main::Integrations::Github::GithubFetchingError: Main::Integrations::Github::GithubFetchingError>
e.cause
#<Octokit::NotFound: GET https://api.github.com/repos/swilgosz/hanamimastery/contents/data/222?ref=heads%2Fmaster: 404 - Not Found // See: https://docs.github.com/rest/repos/contents#get-repository-content>
```

[🎬 22] Additionally, you can pass the custom message to provide more context about the exact use case when this error happened.

```ruby
# slices/main/integrations/github.rb

def fetch(path)
  res = client.contents(REPO, path: path, query: { ref: REF })
  Base64.decode64(res.content)
rescue StandardError => e
  raise GithubFetchingError, "Fetching Content of the requested file failed"
end
```

[🎬 23] Then calling it will give us both, the information about the error ruby class and the context message. Error class is unlikely to change often, so we can document it inline and refer to it in technical documentation. The context message, however, we can tweak freely over time to ensure a better experience.

```ruby
# Ruby console

begin
  github.fetch('data/222')
rescue => e
end

e
=> #<Main::Integrations::Github::GithubFetchingError: Fetching Content of the requested file failed>
e.message
=> "Fetching Content of the requested file failed"
e.cause
=> #<Octokit::NotFound: GET https://api.github.com/repos/swilgosz/hanamimastery/contents/200?ref=heads%2Fmaster: 404 - Not Found // See: https://docs.github.com/rest/repos/contents#get-repository-content>
```

[🎬 24] This is already great. You can document your error classes, you can pass additional context via the messages, and you still can access the original error messages!

But can we improve on this even further?
## Next level - extending errors
[🎬 25] If you work on some larger systems or microservices, you may need some more control over what is logged out, and what data you include in the error logs. 

[🎬 26] Passing simply a string message can be not enough, and including the Ruby-specific error class may be confusing for the first level of the support team, who don't necessarily need to know Ruby.

[🎬 27] What if we'd want to have a way to identify our errors by providing internal codes for each error, that is language-agnostic, but still easily documentable? [🎬 28] Also, what if I'd love to include additional information to my error, like the severity level, or parameters that the method failing was called with?

You can still do it, by adding some steroids to your errors.

In short, I'd love to see error messages like this:

```ruby
'SEV0: HMA0001: Fetching Content of the requested file failed: {"source_path":"data/222.md"}'
```

When I see such a message, I can immediately understand a few things. [🎬 29] The first part is severity, which can identify the urgency of the error. If it's 0, means, that nobody needs to react, and the service will work correctly or will self-recover.

[🎬 30] The next part is the internal error code, which I can quickly look for in my documentation of the app, to find out detailed information about the exception, and how to react to this.

[🎬 31] Then I have the error message, providing me the context about the failure, as well as some additional meta-information about the exact conditions that happened when this error occurred.

Look at the error code. You may pass any important information in this, to make things even easier to understand!

[🎬 32] For example, if I have an exception starting from `HMA`, it can refer to my Hanami Mastery service. Other letters could identify different applications in your system. [🎬 33] The following number may identify the base error. `HMA0` will mean a data input issue. Errors starting from `HMA1` could refer to `internal` errors, while `HMA2` could point to external services.

I'm not telling you to do this, but I just want to show you the idea, of how you can make it easier for your teammates to document and remember stuff.

[🎬 34] Continuing with this, I want to make my error clearly point to the severity 1 external error, saying that this should be checked but is no urgent.

```ruby
'SEV1: HMA2001: Fetching Content of the requested file failed: {"source_path":"data/222.md"}'
```

[🎬 35] Let me visit the GitHub integration service again and call an error in the way we could pass in that additional information.

As you can see, I'm extracting the information to the `error` variable and instantiating the object because I want to not only pass-in the additional metadata for the context.

```ruby
def fetch(path)
  res = client.contents(REPO, path: path, query: { ref: REF })
  Base64.decode64(res.content)
rescue Octokit::NotFound => e
  error = Hanamimastery::Errors::GithubServiceError.new(
    'Fetching content of the requested file failed',
    source_path: path
  )
  raise error
end
```

[🎬 36] For this to work, I'm going to create the `lib/hanamimastery/errors.rb` file, and do some ruby magic there.

[🎬 37] First let me paste some code snippets for error definitions I've prepared earlier. Inside them I'm calling the `code` method in them. These codes will be my internal identifiers

```ruby
# lib/hanamimastery/errors.rb

module Hanamimastery
  module Errors
    class Error < StandardError
    end
    
    # Indicates that input data is incorrect
    #
    class InputDataError < Error
      code 'HMA0000'
    end

    # Indicates that input data is incorrect
    #
    class InternalError < Error
      code 'HMA1000'
    end

    # Indicates that error comes from external service, like Github, Google or Notion
    #
    class ExternalError < Error
      code 'HMA2000'
    end

    class GithubServiceError < ExternalError
      code 'HMA2100'
    end
  end
end
```
### Internal Code support
[🎬 38] To support these internal codes, I'd love to extend the base error class, by defining the `code` class method.

```ruby
module Hanamimastery
  module Errors
    class Error < StandardError
      def self.code(code_string)
        define_method(:code) { code_string }
      end
    end
    # ... errors
  end
end
```

[🎬 39] Then in the `initialize` method, I'll accept the custom message and set both the `reason` and `code` instance variables. [🎬 40] Because I have the code method defined, I only need the `attr_reader` to be added for the `reason`.

```ruby
module Hanamimastery
  module Errors
    class Error < StandardError
      attr_reader :reason
      
      # ...
      
      def initialize(reason)
        @reason = reason
        @code = code
      end
    end

    # ... errors
  end
end
```

[🎬 41] Finally, I'm going to add the default message method for my errors, that will join together the context string, and the code I've defined for this error object.

```ruby
# lib/hanamimastery/errors.rb

module Hanamimastery
  module Errors
    class Error < StandardError
      attr_reader :reason

      def initialize(reason, **)
        @reason = reason
        @code = code
        super(default_message)
      end

      private

      def default_message
        [code, reason].join(': ')
      end
    end

    # ... errors
  end
end
```

Let's check what will happen if I raise my GitHub error now.

```ruby
begin
  github.fetch('data/222')
rescue => e
end

e
#<Hanamimastery::Errors::GithubServiceError: HMA2100: Cannot fetch the file content from GitHub repository>
e.message
# => "HMA2100: Cannot fetch the file content from GitHub repository"
e.reason
# => "Cannot fetch the file content from GitHub repository"
e.code
# => "HMA2100"
e.cause
#<Octokit::NotFound: GET https://api.github.com/repos/swilgosz/hanamimastery/contents/data/222'?ref=heads%2Fmaster: 404 - Not Found // See: https://docs.github.com/rest/repos/contents#get-repository-content>
```

[🎬 42] You can see here, that I can log detailed messages, including my internal code or additional criteria, but I can also access just the reason why this error happened.

[🎬 43] I also can access the internal code directly, and I don't lose any information about the original error that was raised by the external gem.

How cool is this? Let me now add the information about the severity and additional metadata.
### Severity
[🎬 44] First I'll add the severity information. I'll start by defining a constant and mapping my severity levels. Usually, you map names to a number, but in this case, I think that numbers in front will look cleaner.

```ruby
# lib/hanamimastery/errors.rb

module Hanamimastery
  module Errors
    class Error < StandardError
      SEVERITY = {
        0 => :no_action,
        1 => :low,
        2 => :medium,
        3 => :urgent
      }
      
      # ...
    end
  end
end
```

[🎬 45] Having that I'll define my class method, where I can pass the severity level name.

```ruby
# lib/hanamimastery/errors.rb

attr_reader :reason, :severity,

# Falling back to urgent, as it means, something unexpected happens,
#   not forseen by developers, potentially crashing the system.
#
def self.severity(severity_symbol)
  level = SEVERITY.key(severity_symbol) || SEVERITY.key(:urgent)
  define_method(:default_severity_level) { level }
end
```

[🎬 46] As you can see here, in case we cannot map a symbol, we'll fall back to the urgent severity. I find it always a cool way, to fall back on more urgent stuff instead of less important as I see that in case of a mistake or overlook, better is to react when you don't need to, instead of not reacting when urgency happens.

[🎬 47]  Now I only need to make my severity accessible by setting it up in the initializer.

```ruby
# lib/hanamimastery/errors.rb

attr_reader :reason, :code, :severity

def initialize(reason, **)
  @reason = reason
  @code = code
  @severity = default_severity_level
  super(default_message)
end
```

[🎬 48] This way ALL my errors are `:urgent` by default, and I only can reduce the severity level explicitly when it's ok to do that.

[🎬 49] The final thing in this section is to include this severity information in my message, which I'll do by adding the `severity_string` method, and passing it into the default message.

```ruby
# lib/hanamimastery/errors.rb

def default_message
  severity_string = "SEV#{severity}"
  [severity_string, code, reason]
end
```
### Overriding details
[🎬 50] All that is cool, but I would love to make a way to override this information in a particular error though when I realize that severity is lower for a particular context, so let me do it now.

[🎬 51] I'm going to add a way to pass in the details hash and call the `severity_level` method, passing in the `severity` hash deleted from the hash I got.

[🎬 52] Inside of this method, I'll try to fetch the correct key from my constant, and fallback to the default severity level.

```ruby
def initialize(reason, **details)
  @reason = reason
  @code = code
  @severity = severity_level(details.delete(:severity))
  super(default_message)
end

# ...

private

  def severity_level(severity_symbol)
    SEVERITY.key(severity_symbol) || default_severity_level
  end
  
  # ...
```

[🎬 53] Now, let me just update my default message, so I can include this information in my logs.

```ruby
def default_message
  severity_string = "SEV#{severity}"
  [severity_string, code, reason]
end
```

[🎬 54] Having this I can set this up for all my errors in the system. Input data error will be `:low` severity, internal I set to `:urgent`, and the external errors to `:medium`

```ruby
# lib/hanamimastery/errors.rb

# Indicates that input data is incorrect
#
class InputDataError < Error
  code 'HMA0000'
  severity :low
end

# Indicates that input data is incorrect
#
class InternalError < Error
  code 'HMA1000'
  severity :urgent
end

# Indicates that error comes from external service, like Github, Google or Notion
#
class ExternalError < Error
  code 'HMA2000'
  severity :medium
end

class GithubServiceError < ExternalError
  code 'HMA2100'
end
```

[🎬 55] Let me show you what happens. now.

```ruby
# ruby console

github = Main::Slice['integrations.github']
begin
  github.fetch('data/222')
rescue => e
end

e
#<Hanamimastery::Errors::GithubServiceError: SEV2: HMA2100: Cannot fetch the file content from GitHub repository>
e.message
# => "SEV2: HMA2100: Cannot fetch the file content from GitHub repository"
e.severity
# => 2
e.code
# => "HMA2100"
e.reason
# => "Cannot fetch the file content from GitHub"
e.cause
# => #<Octokit::NotFound: GET https://api.github.com/repos/swilgosz/hanamimastery/contents/data/222?ref=heads%2Fmaster: 404 - Not Found // See: https://docs.github.com/rest/repos/contents#get-repository-content>
```

[🎬 56] That's almost all the information I'd ever need, but there is one more thing to add.
### The detailed context

[🎬 57] The final thing I'd love to do here is to allow for providing additional details to my error, so I can pass through information like input parameters, or any other information useful for debugging quickly. In this case, I want my error to also log the `path` parameter I pass to the method.

```ruby
# slices/main/integrations/github.rb

def fetch(path)
  res = client.contents(REPO, path: path, query: { ref: REF })
  Base64.decode64(res.content)
rescue StandardError
  error = Hanamimastery::Errors::GithubServiceError.new(
    "Cannot fetch the file content from GitHub repository",
    severity: :no_action,
    source_path: path
  )
  raise error
end
```

[🎬 58] Except being able to override my severity, I also want my By passing the custom severity, I want to also clearly show the additional metadata for this error. Let me add this functionality now.

[🎬 59] First let me add the *metadata* `attr_reader`. Then, let's just set the details to the *metadata* instance variable. Because I extract the severity from the original hash, I can just assign what's left here.
```ruby
# lib/hanamimastery/errors.rb

module Hanamimastery
  module Errors
    class Error < StandardError
      attr_reader :reason, :severity, :metadata

      def initialize(reason, **details)
        @reason = reason
        @code = code
        @severity = severity_level(details.delete(:severity))
        @metadata = details
        super(default_message)
      end
      # ...
      private
      
        def default_message
          [
            "SEV#{severity}", 
            code, 
            reason, 
            metadata&.to_json
          ].join(': ')
        end
    end
  end
end  
```

[🎬 60] Then I've added these metdata information to the default message, and now we have the final structure in place.
### Additional useful methods
[🎬 61] Before I'll show you the result though, I'm going to add two more useful methods for the error representation.

One is `to_h`, so we can clearly list all important information in a nice hash format, and the other is `to_json`, useful for serializing errors later.

```ruby
# lib/hanamimastery/errors.rb

def to_h
  {
    reason: reason,
    code: code,
    severity: severity,
    metadata: metadata
  }
end

def to_json(*)
  to_h.to_json
end
```

[🎬 62] Now let's jump into the console again and do the final showcase. I can access the severity level of the error, it's internal code, clean, condensed message, as well as a full message usually listed in most of the applications. Then I can transform the error to hash or json form, but I can also extract just a metadata from it, ignoring the rest of the information.

```ruby
github = Main::Slice['integrations.github']
begin
  github.fetch('data/222')
rescue => e
end
e
# => #<Hanamimastery::Errors::GithubServiceError: SEV0: HMA2100: Cannot fetch the file content from GitHub repository: {"source_path":"data/222"}>
e.severity
# => 0
e.code
# => "HMA2100"
e.reason
# => "Cannot fetch the file content from GitHub repository"
e.message
# => "SEV0: HMA2100: Cannot fetch the file content from GitHub repository: {\"source_path\":\"data/222\"}"
e.to_h
# => {:reason=>"Cannot fetch the file content from GitHub repository", :code=>"HMA2100", :severity=>0, :metadata=>{:source_path=>"data/222"}}
e.metadata
# => {:source_path=>"data/222"}
```

[🎬 63] This approach to your errors can put debugging to the next level, and it does not even require too much of custom coding.
### Tests for this all.
[🎬 64] Before we finish, I'd love to add an important notice about tests here. While this is all great, upgrades like that affect your whole application and you always should remember about testing it well. I usually skip to write tests on the Hanami Mastery episodes, to keep things condensed and focused, however, I do write tests for my apps and strongly encourage you to do so as well.

[🎬 65] if you want to checkout the tests coverage for this particular piece of code, check out the linked source code.
## Summary
[🎬 66] Proper error handling is one of those things that are often overlooked, but things like that make a huge difference in your application maintenance in a long term.

I hope you've enjoyed this episode and that it will save tons of time for your team!

[🎬 67] Unfortunately, that's all I have for you today, and if you want to see more content in this fashion, **Subscribe to [my YT channel](https://www.youtube.com/c/hanamimastery)**, **[Newsletter](https://mailchi.mp/6ac8f64f3c5d/hanami-mastery-newsletter)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!
## Thanks: 
[🎬 68] I want to especially thank my recent sponsors,

- [Lucian Ghinda](https://github.com/lucianghinda)
- [Maxim Gurin](https://github.com/maximgurin)
- [prowly.com](http://prowly.com/)

And [all the Hanami Mastery PRO subscirbers](https://pro.hanamimastery.com/), for supporting this project, I really appreciate it!

:::important[Consider sponsoring?]
[🎬 69] If you want to support us, check out our [Github sponsors page](https://github.com/sponsors/swilgosz) or join [Hanami Mastery PRO](https://pro.hanamimastery.com/) to gain the access to more learning resources and our private discord server!
:::

Wish you all the amazing week and see you the next time!