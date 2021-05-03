import renderToString from 'next-mdx-remote/render-to-string';
import rehypePrism from '@mapbox/rehype-prism';
import fs from 'fs';
import path from 'path';
import readingTime from 'reading-time';
import components from '../features/mdx-components';
import matter from 'gray-matter';

const getArticleSourceFromFile = async (slug) => {
  const file = fs.readFileSync(
    path.join(`${process.cwd()}/data/episodes/${slug}.mdx`)
  );
  const matterResult = matter(file);

  return {
    ...matterResult.data,
    content: matterResult.content,
  };
};

const getArticleData = async (slug) => {
  try {
    const article =
        await getArticleSourceFromFile(slug);

    article.content = await renderToString(article.content, {
      components,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [rehypePrism],
      },
    });
    return { article };
  } catch (error) {
    return undefined;
  }
};

export default getArticleData;
