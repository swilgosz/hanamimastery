---
id: 29
aliases: ["HMEP029"]
author: "swilgosz"
topics: ["rom-rb", "persistence", "hanami"]
title: "Leverage ROM Repositories"
excerpt: "Relations are the heart of ROM, but for bigger applications, you'll appreciate to know repositories."
videoId: kbpFGlCXIeg
publishedAt: "2022-09-22"
modifiedAt: "2022-09-22"
premium: true
thumbnail:
  full: /images/episodes/29/cover-full.jpeg
  big: /images/episodes/29/cover-big.jpeg
  small: /images/episodes/29/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1572750433969381376
source: https://github.com/hanamimastery/episodes/tree/main/029
---

In the last episode, I've shown you how to configure the persistence layer from scratch in Hanami applications. That was fun, however, we [ended up **using only relations**](https://hanamimastery.com/episodes/28-configure-rom-from-scratch).

[Relations are the heart of ROM](https://rom-rb.org/learn/core/5.2/relations/), but this is only a single piece of the whole ORM. Using relations alone in a bigger project would not be too convenient so it makes sense to improve on it.

We are Ruby developers, aren't we? And Ruby was **designed for developers' happiness**!

In this episode, we'll go one step further, by extending our current application by adding [repositories](https://rom-rb.org/learn/repository/5.2/) to the system.

### Convenience.

I start with the code from the previous example, where I have just a single action defined to list my articles.

```ruby
module Sandbox
  module Actions
    module Articles
      class Index < Action
        include Deps['persistence.rom']

        def handle(req, res)
          res.status = 200
          relation = rom.relations[:articles].combine(:author)
          res.body = serialize(relation)
        end

        private

        def serialize(collection)
          collection.to_a.to_json
        end
      end
    end
  end
end

```

You may notice, that I've added the `serialize` method to clean the code just a little bit.

Still, however, there are some problems with this approach.

When I want to list articles with authors, I need to explicitly tell my relation, loaded from the `ROM` container, to join the _authors_ table. I can see two problems here.

-   First, I depend on ROM to give me the proper relation
-   Secondly, I have the data fetching logic leaked into the action.

I bet that You've never heard good words about fat controllers in Rails. **This is also true in Hanami** - we want to keep our actions slim and skinny, and hide the persistence logic if possible.

This is what repositories are for.

:::tip Subscribe to Hanami Mastery PRO
This is only a preview of the episode. [Subscribe to Hanami Mastery PRO](https://pro.hanamimastery.com/hanami-mastery-pro) to see the full video, and access several other premium resources. Thanks for watching, and see you in the next one!
:::

### Thanks

In the next PRO episode, we'll talk more about **mapping the structs to different entity classes**, for better data presentation management.

That's all for today!

Thank you for being a part of this community and watching this content, without your support this whole initiative would never be possible.

See you in the next episode!
