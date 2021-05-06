import getData from "./get-data";

const getArticlesData = () => {
  const authors = getData(`team/**/*`);
  const articles = getData("episodes/*");
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
    authors,
  };
};

export default getArticlesData;
