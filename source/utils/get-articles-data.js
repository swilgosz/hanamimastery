import getData from './get-data';

const getArticlesData = async () => {
  // const authors = getData(`team/**/*`);
  const authors = [];
  const articles = getData('episodes/*')
    .sort((a, b) => {
      return b.id - a.id;
    })
    .map((article) => {
      return {
        ...article,
        author: authors.find((author) => author.slug === article.author) || {},
        tags: article.tags || []
      };
    });

  return {
    authors,
    articles,
  };
};

export default getArticlesData;
