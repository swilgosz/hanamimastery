---
id: 11
author: "kkpiotrowski"
topics: ["hanami", "htmx", "sidekiq", "rom-rb", "redis", "sequel"]
title: "Hanami and HTMX progress bar"
excerpt: "<<Summary>>"
videoId: null
published: false
publishedAt: 
modifiedAt: 
aliases: ['HMEP011']
thumbnail:
  full: https://via.placeholder.com/1920/600?text=HanamiMastery.com
  big: https://via.placeholder.com/780/440?text=HanamiMastery.com
  small: https://via.placeholder.com/360/200?text=HanamiMastery.com
discussions:
  twitter: null
  reddit:
    ruby: null
    rails: null
    hanamirb: null
source: 
---

Hi there! I want to show off a little feature I made using hanami, [htmx](https://htmx.org/) and a little bit od [redis](https://redis.io/) + [sidekiq](https://sidekiq.org/).

It is a popular pattern to show a progress bar when you're doing some longer-running task, like uploading a file, or processing some data. I wanted to show you how to do it in hanami, while making the progress bar fill smoothly, and not just jump from 0 to 100% when the task is done.


### The app and the task

I have an app running Hanami 2.1, it [has persistence setup with ROM](https://hanamimastery.com/episodes/28-configure-rom-from-scratch) and is using hanami-views for rendering, hanami-assets for providing CSS. Pretty much everything that we need for our task is in a slice called `main`.

[Sidekiq is already configured](https://hanamimastery.com/episodes/27-integrate-sidekiq-with-hanami) along with assets, [tailwindsCSS](https://tailwindcss.com/).

Our app is going to be a personal library management system, where users can track their books, their placement on a shelf, racks, status of borrowing etc. 

The main page has an input for ISBN number. That input sends a GET request to the server, which then fetches the book data from [google books API](https://developers.google.com/books), parses the data to fit our own books relation in ROM, checks if we have it saved in our DB, saves it if not, or just returns the finished status if we already have it.
In the meantime, users sees a progress bar that fills up smoothly, and when the task is done, the progress bar disappears and the book data is shown.

The resulting code will have to use some sleep statements to show the "animation" on the progress bar since normally it is too fast to notice.

### Redis

Redis setup is super easy thanks to [providers](https://guides.hanamirb.org/v2.1/app/providers/)

`config/providers/redis.rb`
```ruby
Hanami.app.register_provider(:redis) do
  prepare do
    require "redis"
  end

  start do
    client ||= ConnectionPool::Wrapper.new do
      Redis.new(url: target["settings"].redis_url)
    end

    register "redis", client
  end
end
```

`config/settings.rb`
```ruby
setting :redis_url, default: "redis://localhost:6379", constructor: Types::String
```

Now when we do `include Deps['redis]` we get a redis client that we can use to store/read our progress data.

### HTMX

HTMX has a [couple of ways to install](https://htmx.org/docs/#installing). I chose `npm` because I already used it in the project for tailwindCSS and I have hanami-assets configured for assets.

`slices/main/assets/js/app.js`
```javascript
import "../css/app.css";
import 'htmx.org';
import './htmx.js'
```

`slices/main/assets/js/htmx.js`
```javascript
window.htmx = require('htmx.org');
```

And this is all it takes to have HTMX working on your hanami project. If you want to see a quick test example to make sure it works, check out [this commit on the demo repo](https://github.com/krzykamil/libus/commit/5e7b1d176563aac52cc7a7e3b759d5b3d3bda06a).

### Actions and Views

We need few blocks in place: downloading the data, parsing it, saving it to DB, and checking if we already have it. All of this needs to be tracked by the backend and monitored by frontend to show the progress.

So lets start with displaying everything, since we can use placeholders for that. 

Our slice will have 3 relevant actions: `IsbnSearch`, `SearchProgress` and `SearchResult`.
```ruby
    scope 'search' do
      get '/isbn', to: 'isbn_search.show'
      get '/progress', to: 'search_progress.show'
      get '/result', to: 'search_result.show'
    end
```

First step will be the search:
```ruby
module Main
  module Actions
    module IsbnSearch
      class Show < Main::Action
        params do
          required(:isbn).filled(:string)
        end

        def handle(request, response)
          halt 422, {errors: request.params.errors}.to_json unless request.params.valid?
          Main::Workers::IsbnSearch.perform_async(request.params[:isbn])
          response.render(view, isbn: request.params[:isbn])
        end
      end
    end
  end
end

# Spec, only showing the basic happy path example, for breviety
#   context "with good params"  do
let(:params) { Hash[isbn: "978-0-306-40615-7"] }
let(:worker) { double(Main::Workers::IsbnSearch) }
it "works" do
  Sidekiq::Testing.fake! do
    response = subject.call(params)
    allow(Main::Workers::IsbnSearch).to receive(:perform_async).with("978-0-306-40615-7").and_return(worker)
    expect(response.status).to eq 200
  end
end
```
Then we have the view object

```ruby
module Main
  module Views
    module IsbnSearch
      class Show < Main::View
        config.layout = nil

        expose :isbn do |isbn:|
          { type: isbn.size, identifier: isbn }
        end
      end
    end
  end
end
```

With the template:

```html
<input hidden id="isbn-type" name="isbn[type]" value="<%= isbn[:type] %>">
<input hidden id="isbn-identifier" name="isbn[identifier]" value="<%= isbn[:identifier] %>">

<div
    hx-trigger="done"
    hx-get="/search/result"
    hx-include="#isbn-type, #isbn-identifier"
    hx-swap="outerHTML"
    hx-target="this">
  <h3 role="status" id="pblabel" tabindex="-1" autofocus>Searching</h3>

  <div
    hx-get="/search/progress"
    hx-include="#isbn-type, #isbn-identifier"
    hx-trigger="every 2000ms"
    hx-target="this"
    hx-swap="innerHTML">

    <div class="w-64 h-5 mb-5 overflow-hidden bg-base-100 rounded-md shadow-inner" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="122" aria-labelledby="pblabel">
      <div id="pb" class="float-left h-full text-white text-center bg-accent transition-width duration-2000" style="width:0%"></div>
    </div>
  </div>
</div>
```

This is where the majority of HTMX magic comes in. We have 3 important div's:
1. The outer div, that will be replaced with the result of the search, and along with him, all divs inside, that are described below
2. The progress div, that every 2 seconds checks the progress of the search, and updates the progress bar -> div below
3. The initial progress bar div, that is replaced with the progress bar div from the `SearchProgress` action, the div from point 2 makes the request.

All this happens based on the `hx-target`, `hx-get` and `hx-swap` attributes, `hx-trigger` is used to repeat the request every 2 seconds on the div that checks the progress, and for comlepting the process in case of the outer div.
`target` tells HTMX where to put the response
`get` is simply the request identifier, the `get` is the type and the value given is the URL
`swap` is a method of replacement, so how to replace the target with the response

So lets take a look at the `SearchProgress` action:

```ruby
module SearchProgress
  class Show < Main::Action
    include Deps["redis"]
    def handle(request, response)
      response.headers["HX-Trigger"] = "done" if redis.hget("isbn_search", request.params[:isbn][:identifier]).to_i == 3
      response.render(view, isbn: request.params[:isbn])
    end
  end
end
```

`HX-Trigger` is a header that will tell the HTMX to trigger the `done` action, which will fire up the `SearchResult` action, which will render the result of the search.
The header is based on the redis value, which is set by the worker, which we will see in a moment.

```ruby
module SearchResult
  class Show < Main::Action
    include Deps["repositories.books"]

    def handle(request, response)
      response.render(view, book_found: books.by_isbn(type: request.params[:isbn][:type].to_i, identifier: request.params[:isbn][:identifier]))
    end
  end
end
```

Result is simple, we use the books repo to make a simple request.

You probably noticed the inputs in the view, they just hold the values we need to keep finding the correct book based on the initial isbn (which later got an identifier on the back, that tells us if it is ISBN-10 or 13 to make some queries easier).

The templates are also important, here is the template for progress along with its view object:

```html
<div class="w-64 h-5 mb-5 overflow-hidden bg-gray-300 rounded-md shadow-inner" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="<%= search_progress %>" aria-labelledby="pblabel">
  <div id="pb" class="float-left h-full text-white text-center bg-accent transition-width duration-2000" style="width: <%= search_progress %>%"></div>
</div>
```

```ruby
module Main
  module Views
    module SearchProgress
      class Show < Main::View
        config.layout = nil
        include Deps["redis"]
        expose :search_progress, decorate: false do |isbn:|
          search_progress(isbn: isbn)
        end

        private

        def search_progress(isbn:)
          progress = redis.hget("isbn_search", isbn[:identifier])
          case progress.to_i
          when 1
            40
          when 2
            80
          when 3
            100
          else
            10
          end
        end
      end
    end
  end
end
```
Just a simple check of the redis value, and returning the correct value for the progress bar. Then the rest is taken care by CSS thanks to sharing the `id` between the HTML elements that are "replaced".

And the result is also simple:

```html
<div class="card lg:card-side bg-base-100 shadow-xl">
  <figure class="w-1/2 h-1/2 max-w-96 max-h-96"><img src="<%= book.image_url.gsub("http", "https") %>" alt="Cover" /></figure>
  <div class="card-body">
    <h2 class="card-title"><%= book.title %></h2>
    <p><%= book.description[0..500] %></p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">See more</button>
    </div>
  </div>
</div>
```
    
```ruby
module SearchResult
  class Show < Main::View
    config.layout = nil

    expose :book, decorate: false do |book_found:|
      book_found
    end
  end
end
```

That are all the blocks we need in place to have a fully functional frontend. We just need the backend to implement all the logic that does the actual work, and monitors the progress.


### Worker that works hard

For brevity's sake I will only show the basic spec, with the conditions we wanna meet.

We wanna take an ISBN, and delegate work to other objects, checking if the book was saved (this is a scenario where the ISBN is for a new book), and that redis status was updated correctly at the end.

```ruby
  context 'when called' do
    let(:google_isbn_service) { double(Main::Services::GetGoogleIsbn) }
    let(:parser) { double(Main::Services::GetGoogleIsbn) }
    let(:parse_output) {
      { title: "Dune",
        description: "A nice SF book",
        image_url: "https://www.some.site",
        published_date: "1965",
        category: "SF",
        language: "en",
        authors: ["Frank Herbert"],
        isbn_numbers: [
          { type: 10, identifier: "0441172717" },
          { type: 13, identifier: "9780441172719" }
        ]
      }

    }

    it 'processes the job' do
      expect(Main::Services::GetGoogleIsbn).to receive(:new).and_return(google_isbn_service)
      expect(Main::Parsers::Google::Isbn).to receive(:new).and_return(parser)
      expect(google_isbn_service).to receive(:call).with(isbn: "9780441172719").and_return({ body: "some body" })
      expect(parser).to receive(:parse).with(json: { body: "some body" }).and_return(parse_output)
      expect{Main::Workers::IsbnSearch.perform_async("9780441172719")}.to change{db[:books].count}.by(1)
      expect(Hanami.app["redis"].hget("isbn_search", "9780441172719")).to eq("3")
    end
  end
```

In general sidekiq workers should only take the most basic input (strings etc.) and delegate most of the work to other objects, so that we can test them in isolation, handle errors better etc. This is the way I always prefered the workers/jobs to be coded, and it works great here too, cause we just list all the dependencies, use them one by one and monitor the process easily and clearly thanks to that.

For brevity's sake I've put everything in the perform method, but it in real life it could be a good idea to split it out more into methods, for readability and clearer error outputs.

```ruby
module Main
  module Workers
    class IsbnSearch
      include Sidekiq::Job
      include Deps[
                "services.get_google_isbn",
                "redis",
                "persistence.rom",
                "repositories.books",
                parser: "parsers.google.isbn"]

      def perform(isbn)
        redis.hset("isbn_search", { isbn => 1 })

        output = parser.parse(json: get_google_isbn.call(isbn:))
        
        redis.hset("isbn_search", { isbn => 2 })

        if books.by_isbn(type: 10, identifier: isbn) || books.by_isbn(type: 13, identifier: isbn)
          redis.hset("isbn_search", { isbn => 3 })
        else
          rom.relations[:books].transaction do
            author = rom.relations[:authors].changeset(:create, { name: output[:authors].join(', ') }).commit
            new_book = rom.relations[:books].changeset(:create, output[:data]).commit
            redis.hset("isbn_search", { isbn => 3 })
          end
        end
      end
    end
  end
end

```

Now this is a fully functional progress bar (the implementations of parser and get_google_isbn objects are not really relevant).

This could be further improved and made into a far more reusable code, with redis communication being delegated to pub/sub system, that could be better coupled with places that do actually push the progress forward, rather than putting everything into a worker, that should be more of a simple delegator.

Now lets see how this looks in action (please not that I am not exactly a CSS wizard, or an UI designer so the styling is not the best, but it works!):


![Progress Bar gif](/images/articles/progress-bar/demo.gif)



### Summary

I hope you've enjoyed this episode, and if you want to see more content in this fashion,** Subscribe to [this YT channel](https://www.youtube.com/c/HanamiMastery)** and **follow me [on twitter](twitter.com/hanamimastery)**!  As always, all links you can find the description of the video or in the the https://hanamimastery.com.

### Special Thanks!

I'd like to thank [LATEST SPONSORS]. for supporting this project!

Any support allows me to spend more time on creating this content, promoting great open source projects.

Also, check out two of my previous videos here! Thank you all for being here, you're awesome! - and see you in the next Hanami Mastery episode!

- [John Smith]()- for a great cover image
