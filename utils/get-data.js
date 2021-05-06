import fg from "fast-glob";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const dataDir = `${process.cwd()}/data`;

const getFile = (fullPath) => {
  const file = fs.readFileSync(path.join(fullPath), "utf-8").toString();
  const matterResult = matter(file);

  return {
    ...matterResult.data,
    content: matterResult.content,
  };
};

const getData = (glob) => {
  const files = fg.sync(`${path.join(dataDir, glob)}.mdx`.replace(/\\/g, "/"));
  // if [files.lngth === 0] {
  //   fg.sync(`${path.join(dataDir, glob)}.mdx`.replace(/\\/g, '/'));
  // }
  const objects = files.map((filePath) => ({
    slug: path
      .basename(filePath)
      .replace(/\\/g, "/")
      .replace(/\.mdx$/, "")
      .replace(/\s/g, "-"),
    path: `/${path
      .relative(dataDir, filePath)
      .replace(/\\/g, "/")
      .replace(/\.mdx$/, "")
      .replace(/\s/g, "-")}`,
    ...getFile(filePath),
  }));

  return { objects, dataDir, files };
};

export default getData;
