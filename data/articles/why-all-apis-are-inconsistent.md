---
id: 5
author: "swilgosz"
topics: ["thoughts"]
title: "Why ALL APIs are inconsistent?"
excerpt: "One of the most common problems in web applications, is to update the application state based on the business rules. How it's possible, that API specification does not cover it?"
published: true
publishedAt: "2021-09-17"
modifiedAt: "2022-04-29"
aliases: ['HMAP005']
thumbnail:
  full: /images/articles/why-all-apis-are-inconsistent/cover-full.png
  big: /images/articles/why-all-apis-are-inconsistent/cover-big.png
  small: /images/articles/why-all-apis-are-inconsistent/cover-small.png
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1438963253993000979
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/pq858k/why_all_apis_are_inconsistent/
    rails: https://www.reddit.com/r/rails/comments/pq850g/why_all_apis_are_inconsistent/
    hanamirb: https://www.reddit.com/r/hanamirb/comments/pq85mr/why_all_apis_are_inconsistent/
source: null
category: stray
---

There is a particular mystery within designing APIs for web applications, that is known for any API expert, however, not everyone does realize how incomplete our specifications are.

A missing piece in the specification. Basically, **HOW TO HANDLE BUSINESS LOGIC VIOLATIONS?**

To explain it, I need to talk a bit about [HTTP status codes](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).

### HTTP Status codes

If you've ever worked with any API, you're familiar with the fact, that when you send a request to the server, **it can respond with different responses**.

For example, if I want to get an article, the server can respond with a 200 status code, including the article content.

![Successful (200) HTTP status code](/images/articles/why-all-apis-are-inconsistent/successful-request.png)

However, if the requested resource does not exist, the server will probably return an error response, with a 404 status code pointing to the fact **that article cannot be found**.

![Not found (404) HTTP status code](/images/articles/why-all-apis-are-inconsistent/not-found-request.png)

There are plenty of different [officially defined HTTP codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) for different kinds of responses, where it's commonly assumed, that

- successful responses start from 2xx,
- the error responses related to the redirection messages start from 3xx.
- 4xx status code identifies the problem with the user-defined input, like missing parameters,
- 5xx status codes are related to the issues with the server, like a service being down, or an internal error appears.

There are some **commonly used responses**, like 201, or 404, but there are also some rare birds, that you've probably never seen because of unclear specification, in which situation they may be useful.

One example is a 300 status code, which identifies, that for a certain request, the server can give different responses and you should be more precise. However, there is no official guide in which particular situations it should be applied or how to specify the request path so this one is rarely used.

![Multiple responses (300) HTTP status code][/images/articles/why-all-apis-are-inconsistent/multiple-responses-request.png]

### The missing piece

However, even though there are a lot of defined status codes, **there is a certain common problem, where none of them really applies**.

**And I mean, a business rule violation.**

The book example would be when you want to publish an article.

Let's say you have an article, and you publish it. If everything goes fine, you'll get a successful response from the server. However, if you'll try to publish the article again, **it's not clear how a server should respond!**

#### Forbidden (403).

One way to approach this problem would be to **return a forbidden error**, indicating that the user cannot perform this action. However, **it has nothing related to user permissions**. Even super admin cannot publish already published article, because **business rules just do not allow such thing to happen**!
#### So maybe Method not allowed? (405)

The other candidate could be a 405 HTTP status code referring to an invalid method error. However, this one refers to the HTTP method, not just unacceptable action at the given moment.

Again, it points to the issue with the format of the request. It could be useful, if you'd want your server to only process PATCH requests, and never accept PUT requests, but it doesn't feel right in this particular case.

So what are the other options?

### I'm a teapot (418)

Well, there is one, an especially interesting solution I would be eager to implement in a real application, even though this one is also designed for a different use case. It's a `teapot` 418 status code.

![Teapot (418) status code](/images/articles/why-all-apis-are-inconsistent/teapot.jpeg)

I've used it once just for fun already, when I've shown [how to untangle API endpoints in your applications](/episodes/7-untangle-your-app-with-dry-monads).

The teapot status code had been invented as an **April Fools' joke in 1998** and as you can imagine, it's not often used due to that fact. Honstly, I'd not use it either except maybe my personal projects, when I would just like to have fun and put a smile on users actually using my API.

However, **applications DO use it sometimes**, mostly to prevent automated queries, scrapping data, or creating a lot of random resources.

The thing is, that server refused to do something because of a reason known to the server - not because the user input is broken or invalid.

When you want to make a coffee, using a teapot, you may return `418`, as `POST /teapot/:id/brew?drink_type=coffee` can be refused by the server, because on the list of allowed drinks to brew view teapot is the tea only.

**This is a business rule defined on the server.**

When you want to publish an article that is already published, it's the same situation. The server has internal business rules defined that prevent you from changing its state. You could think then, that the 418 status code is the best matching candidate for this use case!

However, there is one more, I think even better.

### 409 - conflict

409, standing for a conflict. It states that the request could not be completed due to the conflict of the state of the requested resource.

Is it exactly this case though?

> This code is only allowed in situations where it is expected that the user might be able to resolve the conflict and resubmit the request.

In the described situation, the user cannot resubmit the request. The article is published, it's nothing with the request body that can be fixed.

Then adjusting the email in the form may make the request succeed.

Even though it's not the case in this example, in the ideal world I'd still go with this one for most of the business violations.

However, what if the action cannot be performed, because the OTHER resource conflicts with it?

For example, what if you want to register the user but the EMAIL or Frontend-Generated ID is already taken by ANOTHER user registered in the system.

Or do you want to set the article as premium, but the BLOG has a basic plan?

Hm.... teapot?

#### Invalid (422) or just BAD (400)

Then we could say, that the request is not valid (422), or bad (400), but if you think about it, it isn't! **It's everything ok with the request itself**, it's just that in this particular moment APPLICATION refuses to process it due to the business conditions!

However, as one of Reddit users (BigLoveForNoodles) [pointed out in the discussion thread to this article](https://www.reddit.com/r/rails/comments/pq850g/why_all_apis_are_inconsistent/hdc1wqp), 422 is actually an amazing candidate in most of such problems.

As 422 (invalid) error is meant to be used for semantic errors. The business logic violation is actually an example of semantic error in your system, so 422 fits really well to solve this question.

For me personally validation error in this case seems to be out of place, but let's put personal feelings aside. Logically, it seems as a winner.

### Capability-based API

In 2017 Scott Wlaschin gave a talk about [Software Design with Capabilities](https://www.youtube.com/watch?v=fi1FsDW1QeY). This approach is not about returning specific error responses when user tries to perform unsupported action, but rather opposite. In every request, API can return a list of possible actions to be performed.

It's also not a common approach to the problem, however I can see it useful, in some scenarios, and it is a perfect example of thinking outside of the box. You can check it out here.

The one particularly interesting part is that with this approach, you can make your API consumers completely unaware how your business logic works!

<YoutubeEmbed embedId='fi1FsDW1QeY' />

### Final thoughts

This is a pointless discussion because we don't leave in the ideal world, and a lot of situations are just simplified, because, in the end, it doesn't matter, as long as you document your API well. So even if APIs are built differently even if use the same standards and specs, the **only thing that matters, is INTERNAL consistency**.

This is why we have Validation errors, where a user tries to register with non-unique emails, why we have forbidden errors, where an article is already published, and so on.

In this artilce I'm just saying, that there are different approaches, to one of the most common problems in the modern web applications, due to the lack of specification in that field, and even the April Fools' joke - 418 HTTP status code - seems to be a valid candidate for real use cases when it comes to business logic violations and the application states.

But if you ask me **how I'd solve the article publication issue?**

### My approach - 404

Well, in this particular case, would just return 404, saying that `draft article to be sent cannot be found`. For different business cases, I'd choose individual approaches, even though it's exhausting to make those decisions over and over.

But try to think outside of the box, and maybe YOU will be the one that will add a missing piece to the API standards!

### Do you like this content?

I hope you've enjoyed this article, and if you want to see more content in this fashion,** Subscribe to [this YT channel](https://www.youtube.com/c/HanamiMastery)** and **follow me [on Twitter](https://twitter.com/hanamimastery)**!  As always, all links you can find the description of the video or in the https://hanamimastery.com.

### Special Thanks!

I'd like to thank [all my sponsors](https://github.com/sponsors/swilgosz) for supporting this project!

Any support allows me to spend more time on creating this content, promoting great open source projects.

Also thanks to

- [Toa Heftiba](https://unsplash.com/@heftiba) for a great cover photo
- [Michał Parzuchowski](https://unsplash.com/@mparzuchowski)- for a great yellow teapot photo.
- All people pointing flaws in my thinking on [Reddit](https://www.reddit.com/r/rails/comments/pq850g/why_all_apis_are_inconsistent/) and [Twitter](https://twitter.com/sebwilgosz/status/1438964529841549327)

Thank you all for being here, you're awesome! - and see you soon in the upcoming publications!
