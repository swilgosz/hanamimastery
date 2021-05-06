import getData from "./get-data";

const getArticlesData = () => {
  const { objects: authors, dataDir, files } = getData(`team/**/*`);
  const {
    objects: articles,
    dataDir: filesDataDir,
    files: episodesFiles,
  } = getData("episodes/*");
  articles
    .sort((a, b) => {
      return b.id - a.id;
    })
    .map((article) => {
      return {
        ...article,
        author: authors.find((author) => author.slug === article.author) || {},
        tags: article.tags || [],
      };
    });

  return {
    articles,
    dataDir,
    files,
    filesDataDir,
    episodesFiles,
  };
};

export default getArticlesData;
