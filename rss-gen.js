// import { getAllFilesFrontMatter } from "utils";

const RSS = require('rss');
const fs = require('fs');
const path = require('path');

/* lets create an rss feed */
var feed = new RSS({
    title: 'Hanami Mastery newest episodes!',
    description: 'The best way to master Hanami ruby framework!',
    feed_url: 'https://hanamimastery.com/rss.xml',
    site_url: 'https://hanamimastery.com',
    image_url: 'https://hanamimastery.com/logo-hm.jpeg',
    // docs: 'http://hanamimastery.com/rss/docs.html',
    managingEditor: 'Sebastian Wilgosz',
    webMaster: 'Sebastian Wilgosz',
    copyright: '2021 Sebastian Wilgosz',
    language: 'en',
    categories: ['Ruby','Hanami','Web development'],
    pubDate: new Date().toLocaleString(),
    ttl: '60'
});

// export async function getStaticProps() {
//   const episodes = await getAllFilesFrontMatter("episodes");
//   const articles = await getAllFilesFrontMatter("stray");
//   const authors = await getAllFilesFrontMatter("team");

//   const posts = [
//     ...episodes.map((episode) => {
//       episode.slug = `episodes/${episode.slug}`
//       return episode
//     }),
//     ...article.map((article) => {
//       article.slug = `articles/${article.slug}`
//       return article
//     }),
//   ].sort(function(a, b) { return b.id - a.id });

//   return {
//     props: { posts, authors }, // will be passed to the page component as props
//   };
// }

/* loop over data and add to feed */

// const allContent = getStaticProps().posts

// allContent.map((article, index) => {
  // feed.item({
  //   title:  article.title,
  //   description: article.excerpt,
  //   url: `https://hanamimastery.com/episodes/${article.slug}`,
  //   categories: article.tags
  //   // author: 'Guest Author', // optional - defaults to feed author property
  //   //     date: 'May 27, 2012', // any format that js Date can parse.
  // });
// })

// cache the xml to send to clients
var xml = feed.xml();

fs.writeFileSync(path.resolve(__dirname, 'public') + '/rss.xml', xml);
