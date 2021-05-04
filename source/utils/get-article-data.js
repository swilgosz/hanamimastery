import renderToString from 'next-mdx-remote/render-to-string';
import rehypePrism from '@mapbox/rehype-prism';
import path from 'path';
import readingTime from 'reading-time';
import components from '../features/mdx-components';
import matter from 'gray-matter';
import getData from './get-data';

const getArticleData = async (slug) => {
  // try {
    const article =
        getData(`episodes/${slug}*`)[0];

    article.content = await renderToString(article.content, {
      components,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [rehypePrism],
      },
    });
    return { article };
  // } catch (error) {
    // return undefined;
  // }
};

export default getArticleData;
