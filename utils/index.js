const fs = require("fs")
const path = require("path")
const readingTime = require("reading-time")
const matter = require("gray-matter")
const mdxPrism = require("mdx-prism")
const { serialize } = require("next-mdx-remote/serialize");

const root = process.cwd();

async function getFiles(type) {
  return fs.readdirSync(path.join(root, "data", type));
}

async function getFileBySlug(type, slug) {
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

async function getAllFilesFrontMatter(type) {
  const files = fs.readdirSync(path.join(root, "data", type));

  return files.reduce((allPosts, postSlug) => {
    const source = fs.readFileSync(
      path.join(root, "data", type, postSlug),
      "utf8"
    );
    const { data } = matter(source);

    return [
      {
        ...data,
        slug: postSlug.replace(".md", ""),
      },
      ...allPosts,
    ].sort((itemA, itemB) => {
      if (itemA.publishedAt > itemB.publishedAt) return -1;
      if (itemA.publishedAt < itemB.publishedAt) return 1;
      return 0;
    });
  }, []);
}

async function getAllContent() {
  const posts = await getAllFilesFrontMatter("articles");
  const episodes = await getAllFilesFrontMatter("episodes");
  const postsWithSlug = posts.map((item) => ({
    ...item,
    url: `https://hanamimastery.com/articles/${item.slug}`,
    namespace: 'articles',
  }));
  const episodesWithSlug = episodes.map((item) => ({
    ...item,
    url: `https://hanamimastery.com/episodes/${item.slug}`,
    namespace: 'episodes',
  }));
  const items = postsWithSlug.concat(episodesWithSlug).sort((itemA, itemB) => {
    if (itemA.publishedAt > itemB.publishedAt) return -1;
    if (itemA.publishedAt < itemB.publishedAt) return 1;
    return 0;
  });
  return items;
}

exports.getAllFilesFrontMatter = getAllFilesFrontMatter;
exports.getFileBySlug = getFileBySlug;
exports.getFiles = getFiles;
exports.getAllContent = getAllContent;
