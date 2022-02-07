const fs = require("fs")
const rss = require("rss")

const { getContent } = require("./utils/queries")

async function getRssData() {
  const feed = new rss({
    title: "Hanami Mastery newest episodes!",
    description: "The best way to master Hanami ruby framework!",
    feed_url: "https://hanamimastery.com/feed.xml",
    author: "Sebastian Wilgosz",
    site_url: "https://hanamimastery.com",
    image_url: "https://hanamimastery.com/logo-hm.jpeg",
    managingEditor: "Sebastian Wilgosz",
    webMaster: "Sebastian Wilgosz",
    copyright: `${new Date().getFullYear()} Sebastian Wilgosz`,
    language: "en-us",
    categories: ["Ruby", "Hanami", "Web development"],
    pubDate: new Date().toUTCString(),
    ttl: "60",
  });

  const posts = await getContent();

  posts.map(
    ({
      author,
      excerpt,
      topics,
      videoId,
      publishedAt,
      fullTitle,
      url,
      thumbnail,
    }) => {
      const xmlItem = {
        title: fullTitle,
        image: thumbnail.big,
        description: excerpt,
        categories: topics,
        date: publishedAt,
        url,
      };
      // if (!!videoId) {
      //   xmlItem.enclosure = {
      //     'url'  : `https://www.youtube.com/embed/${videoId}`,
      //     'type' : 'video'
      //   }
      // }
      feed.item(xmlItem);
    }
  );
  return feed;
}

async function generateRssFeed() {
  try {
    const feed = await getRssData();
    fs.mkdirSync("./public/rss", { recursive: true });
    fs.writeFileSync("./public/feed.xml", feed.xml());
  } catch (error) {
    console.log(error)
  }
}

generateRssFeed()
