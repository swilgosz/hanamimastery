const path = require("path");
const readingTime = require("reading-time");
const matter = require("gray-matter");
const mdxPrism = require("mdx-prism");
const { serialize } = require("next-mdx-remote/serialize");
const { readFileByPath, getPaths } = require("./file-browsers");
const admonitions = require("remark-admonitions");

/*
  Extends the file meta data by additional fields and information, like
  adding HOST to the thumbnail urls, adding slug (from filename), path, URL, etc
  @param [String] filePath, i.e 'episodes/1-super-episode'
  @param [Object] data object to extend, read from the file
*/
function _serializeContentData(filePath, data) {
  const normalizedPath = path.normalize(filePath);
  const postSlug = normalizedPath.split(path.sep).slice(1)[0];
  const type = normalizedPath.split(path.sep)[0];
  const itemPath = type == "pages" ? postSlug : filePath;
  const host = process.env.NEXT_PUBLIC_BASE_URL || "";

  return {
    ...data,
    type,
    premium: data.premium || false,
    fullTitle: type == "episodes" ? `#${data.id} ${data.title}` : data.title,
    slug: postSlug,
    path: itemPath,
    url: `${host}/${itemPath}`,
    namespace: type,
    thumbnail: {
      full: `${host}${data.thumbnail.full}`,
      big: `${host}${data.thumbnail.big}`,
      small: `${host}${data.thumbnail.small}`,
    },
  };
}

/*
  Reads content object based on given type and slug
  @param [String] the folderName (optional), i.e: "articles"
  @param [string] slug
  @return [Object] a content object
*/
async function getContentBySlug(type, slug) {
  const filePath = slug ? `${type}/${slug}` : type;
  const source = readFileByPath(filePath);

  const { data, content } = matter(source);
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [admonitions],
      rehypePlugins: [mdxPrism],
    },
  });
  return {
    mdxSource,
    frontMatter: {
      wordCount: content.split(/\s+/gu).length,
      readingTime: readingTime(content),
      ..._serializeContentData(filePath, data),
    },
  };
}

/*
  Reads content of the given type. If no type given, reads both articles and episodes, then sorts them all by publishedAt.
  @param [String] the folderName (optional), i.e: "articles"
  @param [string] slug
  @return [Array] list of content objects
*/
async function getContent(type) {
  const paths = await getPaths(type);

  return await paths.reduce((allPosts, filePath) => {
    const source = readFileByPath(filePath);
    const { data } = matter(source);

    return [_serializeContentData(filePath, data), ...allPosts].sort(
      (itemA, itemB) => {
        if (itemA.publishedAt > itemB.publishedAt) return -1;
        if (itemA.publishedAt < itemB.publishedAt) return 1;
        return 0;
      }
    );
  }, []);
}

/*
  Fetches mixed content by the given topic
  @param []
*/
async function getContentByTopic(topic) {
  const posts = await getContent();
  return posts.filter((item) => item.topics.includes(topic));
}

exports.getContentBySlug = getContentBySlug;
exports.getContent = getContent;
exports.getContentByTopic = getContentByTopic;
