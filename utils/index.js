import fs from "fs";
import { Feed } from "feed";
import matter from "gray-matter";
import path from "path";
import readingTime from "reading-time";
import { serialize } from "next-mdx-remote/serialize";
import mdxPrism from "mdx-prism";

const root = process.cwd();

export async function getFiles(type) {
  return fs.readdirSync(path.join(root, "data", type));
}

export async function getFileBySlug(type, slug) {
  const source = slug
    ? fs.readFileSync(path.join(root, "data", type, `${slug}.md`), "utf8")
    : fs.readFileSync(path.join(root, "data", `${type}.md`), "utf8");

  const { data, content } = matter(source);
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [mdxPrism],
    },
  });
  return {
    mdxSource,
    frontMatter: {
      wordCount: content.split(/\s+/gu).length,
      readingTime: readingTime(content),
      slug: slug || null,
      ...data,
    },
  };
}

export async function getAllFilesFrontMatter(type, content) {
  const files = fs.readdirSync(path.join(root, "data", type));

  return files.reduce((allPosts, postSlug) => {
    const source = fs.readFileSync(
      path.join(root, "data", type, postSlug),
      "utf8"
    );
    const { data, content } = matter(source);
    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [mdxPrism],
      },
    });
    return [
      {
        ...data,
        mdxSource,
        slug: postSlug.replace(".md", ""),
      },
      ...allPosts,
    ].sort(function (a, b) {
      return b.id - a.id;
    });
  }, []);
}


export async function getRssData() {
  const feed = new Feed({
    title: "Hanami Mastery newest episodes!",
    description: "The best way to master Hanami ruby framework!",
    id: "https://hanamimastery.com",
    link: "https://hanamimastery.com/atom",
    language: "en-US", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: "https://hanamimastery.com/logo-hm.jpeg",
    favicon: "https://hanamimastery.com/favicon.ico",
    copyright: `${new Date().getFullYear()} Sebastian Wilgosz`,
    date: new Date(2021, 5, 1),
    ttl: "60",
    author: {
      name: "Sebastian Wilgosz",
      email: "sebastian@hanamimastery.com",
      link: "https://github.com/swilgosz"
    },
    feedLinks: {
      atom: "https://hanamimastery.com/atom",
      rss: "https://hanamimastery.com/rss"
    },
  });

  feed.addCategory("Ruby");
  feed.addCategory("Hanami");
  feed.addCategory("Web development");

  feed.addContributor({
    name: "Johan Cruyff",
    email: "johancruyff@example.com",
    link: "https://example.com/johancruyff"
  });

  const posts = await getAllFilesFrontMatter("stray");
  const postsWithSlug = posts.map((item) => ({
    ...item,
    url: `https://hanamimastery.com/articles/${item.slug}`,
  }));

  const episodes = await getAllFilesFrontMatter("episodes");
  const episodesWithSlug = episodes.map((item) => ({
    ...item,
    url: `https://hanamimastery.com/episodes/${item.slug}`,
  }));

  const items = postsWithSlug.concat(episodesWithSlug).sort((itemA, itemB) => {
    if (itemA.publishedAt > itemB.publishedAt) return -1;
    if (itemA.publishedAt < itemB.publishedAt) return 1;
    return 0;
  });
  items.map(({ title, excerpt, videoId, author, tags, publishedAt, url, thumbnail, content }) => {
    feed.addItem({
      title,
      description: excerpt,
      categories: tags,
      date: publishedAt,
      video: `https://youtu.be/${videoId}`,
      id: url,
      link: url,
      // TODO: <dc:creator><![CDATA[ swilgosz ]]></dc:creator>
      date: new Date(publishedAt),
      image: `https://hanamimastery.com/${thumbnail.big}`,
      content,
      author: [
        {
          name: "Sebastian Wilgosz",
          email: "sebastian@hanamimastery.com",
          link: "https://github.com/swilgosz"
        }
      ],
    });
  });
  return feed;
}
