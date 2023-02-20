const fs = require('fs')
const path = require("path")

const root = process.cwd();

/*
  Reads the given folder from "data" root folder and returns list of all files in it.
  @param [String] folder name
  @return [Array] - list of files in the given folder
*/
async function _getFiles(type) {
  return fs.readdirSync(path.join(root, "data", type));
}

/*
  Our dynamic data file names are content slugs with extensions. This function strips file names from the format extension.
  @param [String] contentType (folder name)
  @return [Array] list of items' slugs
*/
async function getSlugs(contentType) {
const fileNames = await _getFiles(contentType);

return fileNames.map((fileName) => (fileName.replace(/\.md/, "")));
}

/*
  Our dynamic data file names are content slugs with extensions. This function strips file names from the format extension.
  @param [String] contentType (folder name) (optional)
  @return [Array] list of items' file paths relative to 'data' folder
*/
async function getPaths(contentType) {
  let paths = [];

  if (contentType === 'articles' || !contentType) {
    const articles = await getSlugs('articles')

    paths = [
      ...paths,
      ...articles.map((slug) => (path.join('articles', slug)))
    ];
  }

  if (contentType === 'episodes' || !contentType) {
    const episodes = await getSlugs('episodes')

    paths = [
      ...paths,
      ...episodes.map((slug) => (path.join('episodes', slug)))
    ];
  }

  return paths;
}

/*
  Read an md file with a given path from the "data" root folder. File path should not contain format extension
  @param [String] file path, i.e: "episodes/1-funny-episode"
  @return [String] a content of the markdown file
*/
function readFileByPath(filePath) {
  const source = fs.readFileSync(
    path.join(root, "data", `${filePath}.md`),
    "utf8"
  );
  return source;
}


exports.getSlugs = getSlugs;
exports.getPaths = getPaths;
exports.readFileByPath = readFileByPath;
