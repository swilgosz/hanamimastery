---
id: 3
author: "swilgosz"
topics: ["hanami", "hanami-view" ]
title: "Style your Hanami App with Bulma using Hanami Assets"
excerpt: "In this episode I make use of Bulma CSS framework and integrate it with Hanami 2.0 application to prettify it with the least effort possible."
published: true
publishedAt: "2021-05-30"
modifiedAt: "2021-10-03"
aliases: ['HMEP003']
videoId: "tnOaUNfdgfo"
thumbnail:
  full: /images/episodes/3/cover-full.jpeg
  big: /images/episodes/3/cover-big.jpeg
  small: /images/episodes/3/cover-small.jpeg
discussions:
  twitter: https://twitter.com/HanamiMastery/status/1399429644143706125
  reddit:
    ruby: https://www.reddit.com/r/ruby/comments/ns1don/style_your_hanami_app_with_bulma_using/
source: https://github.com/hanamimastery/episodes/tree/main/003
---

I have [this simple Hanami web application here](/episodes/2-listing-articles-with-hanami-view), listing sample blog articles with cat's images on top. Honestly, It's horrible. Really. And my goal for this episode is to **make it prettier with the least effort possible**.

![Unstyled articles list](/images/episodes/3/unstyled.png)

To achieve this, I'll make use of [Bulma CSS](https://bulma.io/), which is a great, simple to use, CSS-only framework. This means it works with any JS engine you would like to use in your app. No matter if you use your custom scripts, jQuery, React, Angular, or Vue, Bulma will always work as you may expect and this is the main reason I've chosen it for this showcase.

### Install Bulma in Hanami application

Let's integrate Bulma with our project first

Due to Hanami::Assets being fully configured in the new Hanami application, it's pretty easy to install any `npm` package and use it in our web apps.

In the getting started guide, You can see several ways to install it, and, just for now, we'll use the option to import the CSS directly from the CDN's official URL.

I just need to copy the source code and paste it in the `slices/main/assets/public/index.css` Index.css file for my `main` slice.

Then going back to the installation, I can see that in the _code requirements_ section of Bulma's documentation I also need to add viewport information into my application layout HTML file. Let me copy that very quickly.

```css
# slices/main/assets/public/index.css

@import "https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css";
```

Also, as I'm already in the main application layout file, I'll add the section and container wrapper, as mentioned in the installation guide.

```html
// slices/main/web/templates/layouts/application.html.slim

body
 section.section
  .container
    == yield
```


Then run `npm start` to run my assets server and when I check the browser, you can already see that my application looks a little bit better. You can notice it mainly by the font being changed together with its color.

> Disclaimer: If you're using the Hanami 2 Template before the Hanami 2.0 is released, you may encounter a little configuration issue and assets can not be loaded due to the Headers misconfiguration. Here is a fix for that. Add the code below to the `config/application.rb` file.

```ruby
# config/application.rb

config.actions.content_security_policy[:default_src] = "'self' http://localhost:8080"
```

![Article's grid](/images/episodes/3/bulma-installed.png)


### Install Bulma with Hanami via NPM

Bulma is also shipped as an NPM package, so If you don't want to use CDN, thanks to Hanami::View you can easily install any NPM package into your hanami application using the standard package installation instructions.

In the terminal let me just install the `bulma` package

```bash
npm install bulma
```

and then in the `index.css` file just replace the CDN download link with the package path. In my case it's `bulma/css/bulma`

```css
@import 'bulma/css/bulma'
```

When you'll visit the browser, you should not notice any changes in the rendered content.

### Add Bulma grid to Hanami template

The margins had been changed too, however, this is still pretty bad. Let's update it by adding some grid. I want articles to be shown in rows of three elements. To achieve this, I'll iterate through my array of articles, using `each_slice` method, passing the expected number of columns as an argument.

Then at the beginning of each slice, I'll add a `.columns` wrapper, and then for each column in a row I'll add a `.column` class

```html
// slices/main/web/templates/templates/articles/index.html.slim

h1.title Blog articles

- articles.each_slice(3) do |row|
  .columns
    - row.each do |article|
      .column
        == render :item, article: article
```

This finally gives a nice change to the rendered result. All articles are grouped in columns, and I did not write a single CSS line, everything is working out of the box. Awesome!

![Bulma installed](/images/episodes/3/grid.png)


### Adding Breadcrumbs

Bulma has a lot of predefined components ready to be used. I'll just add some breadcrumbs on top of my articles list just to demonstrate how to use them.

```html
// slices/main/web/templates/blog/articles/index.html.slim

nav.breadcrumb aria-label="breadcrumbs"
  ul
    li
      a href="/" Home
    li.is-active
      a href='/articles' aria-current='page' articles
```

I'll need a `navigation` tag with `breadcrumb` class, with a list of items to be displayed. The last one I mark as active by adding a proper class to the list element and now let's see the result.

![Breadcrumbs component](/images/episodes/3/breadcrumbs.png)

Now let's update the single article's item. For this, I'll use [Bulma's _card_ component](https://bulma.io/documentation/components/card/) and similar to breadcrumbs, I just need to copy the HTML structure to my template file. To speed things up I'll just paste the content I've prepared before. This is a card component, translated to slim - as this is what I'm working with, and instead of static strings, I show the appropriate article's attributes.

```html
// slices/main/web/templates/blog/articles/_item_.html.slim

.card
  .card-image
    figure.image.is-16by9
      img src=(article.thumbnail)
  .card-content
    .media
      .media-content
        h4.title.is-4 = article.title
        h6.subtitle.is-6
          == article.by
          time datetime==article.published_on
            = article.published_on
    .content
      = article.excerpt
      .buttons.is-right
        a.button.is-primary.mt-4.is-right href=("/articles/#{article.id}")
          | Read...
```

![Cards component](/images/episodes/3/cards.png)

With similar tweaks, you can easily prettify the single article's page or anything you want in your application.

```html
// slices/main/web/templates/blog/articles/show.html.slim

nav.breadcrumb aria-label="breadcrumbs"
  ul
    li
      a href="/" Home
    li
      a href='/articles' articles
    li.is-active
      a href='/articles/#{article.id}' aria-current='page' = article.id

article.container
  figure class="image is-16by9"
    img src=(article.thumbnail) alt="Placeholder image"

  div class="media"
    div class="media-content"
      p class="title is-4" = article.title
      p class="subtitle is-6"
        == article.by
        time datetime==article.published_on
          = article.published_on
  .content
    = article.content

```

### Summary

[Hanami-Assets](https://github.com/hanami/assets) is an amazing gem that allows managing assets in any Ruby application. In [Hanami 2,](https://hanamirb.org), with zero-configuration integration, it's just a pleasure to work with.

You can use it with Bulma, Foundation, React, Vue, or any other asset framework, as it's extremely flexible.

### Special Thanks

- [Yuttanant Suwansiri](https://github.com/armgit5) for supporting this project.
- [Pankaj Patel](https://unsplash.com/@pankajpatel) for a great cover photo.
