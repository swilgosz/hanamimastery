const fs = require('fs')
const path = require("path")
const root = process.cwd();

/*
  Reads the given folder from "data" root folder and returns list of all files in it.
  @param [String] folder name
  @return [Array] - list of files in the given folder
*/
async function getFiles(type) {
  return fs.readdirSync(path.join(root, "data", type));
}

exports.getFiles = getFiles;
