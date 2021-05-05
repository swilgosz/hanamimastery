import renderToString from 'next-mdx-remote/render-to-string';
import rehypePrism from '@mapbox/rehype-prism';
import components from '../features/mdx-components';
import getData from './get-data';

const getArticleData = async (slug) => {
  // try {
    // const articles = getData(`episodes/${slug}*`);
    const articles = getData('episodes/1-creating-hanami-application');

    console.log(`Fetching articles: ${slug}`);
    console.log(articles)
    const article = articles[0];
    // if (!article) {
    //   return undefined;
    // }

    article.content = await renderToString(article.content, {
      components,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [rehypePrism],
      },
    });
    return { article };
  // } catch (error) {
  //   console.log('-------------------')
  //   console.log('Article Rendering error')
  //   console.log(error)
  //   return undefined;
  // }
};

export default getArticleData;
