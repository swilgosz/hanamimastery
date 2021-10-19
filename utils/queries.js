const fs = require('fs')
const path = require("path")
const root = process.cwd();

const readingTime = require("reading-time");
const matter = require("gray-matter");
const mdxPrism = require("mdx-prism");
const { serialize } = require("next-mdx-remote/serialize");

/*
  Read an md file with a given path from the "data" root folder. File path should not contain format extension
  @param [String] file path, i.e: "episodes/1-funny-episode"
  @return [String] a content of the markdown file
*/
async function _readFileByPath(filePath) {
  const source = fs.readFileSync(
    path.join(root, "data", `${filePath}.md`),
    "utf8"
  );
  return source;
}

/*
  Extends the file meta data by additional fields and information, like
  adding HOST to the thumbnail urls, adding slug (from filename), path, URL, etc
  @param [String] filePath, i.e 'episodes/1-super-episode'
  @param [Object] data object to extend, read from the file
*/
function _serializeContentData(filePath, data) {
  const postSlug = filePath.split("/").slice(1)[0];
  const type = filePath.split("/").slice(0)[1]
  const itemPath = (type == 'pages') ? postSlug : filePath;
  const host = process.env.NEXT_PUBLIC_BASE_URL || '';

  return {
    ...data,
    slug: postSlug,
    path: itemPath,
    url: `${host}/${itemPath}`,
    namespace: type,
    thumbnail: {
      full: `${host}${data.thumbnail.full}`,
      big: `${host}${data.thumbnail.big}`,
      small: `${host}${data.thumbnail.small}`
    }
  }
}

/*
  Reads content object based on given type and slug
  @param [String] the folderName (optional), i.e: "articles"
  @param [string] slug
  @return [Object] a content object
*/
async function getContentBySlug(type, slug) {
  const filePath = slug ? `${type}/${slug}` : type
  const source = await _readFileByPath(filePath);

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
      ..._serializeContentData(filePath, data),
    },
  };
}

exports.getContentBySlug = getContentBySlug;
