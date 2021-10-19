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

exports.getSlugs = getSlugs;
