import normalize from 'json-api-normalizer';
import lodashMerge from 'lodash.merge';

const getArticlesData = async (
  link = `${process.env.API_URL}/articles?page[number]=1`
) => {
  const response = await fetch(link);
  const body = await response.json();

  const {
    meta: {
      '/articles': {
        links: { next },
      },
    },
    articles,
    authors,
  } = normalize(body, { endpoint: '/articles?page[number]=0' });
  if (next) {
    return lodashMerge(await getArticlesData(next), { articles, authors });
  }
  return { articles, authors };
};

export default getArticlesData;
