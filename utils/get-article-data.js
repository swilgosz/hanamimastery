import renderToString from 'next-mdx-remote/render-to-string';
import rehypePrism from '@mapbox/rehype-prism';
import fs from 'fs';
import path from 'path';
import readingTime from 'reading-time';
import components from '../features/mdx-components';

const getArticleSourceFromFile = async (slug) => {
  const file = fs.readFileSync(
    path.join(`${process.cwd()}/articles/${slug}.mdx`)
  );
  return file;
};

const getArticleData = async (slug) => {
  try {
    const res = await fetch(`${process.env.API_URL}/articles/${slug}`);
    const data = await res.json();
    if (!data) throw new Error();

    const {
      publishedAt,
      status,
      metadata,
      excerpt,
      content,
      title,
      tags,
      thumbnail,
    } = data.data.attributes;

    const author = data.data.relationships.author.data;
    const article = {
      id: data.data.id,
      tags,
      author,
      publishedAt,
      status,
      slug,
      metadata,
      excerpt,
      title,
      thumbnail,
      readingTime: readingTime(content),
    };

    // Currently, articles are being read from the file system
    // if you change ARTICLES_SOURCE env var to 'API'
    // make sure that the mdx buffer is being stored as content

    const articleSource =
      process.env.ARTICLES_SOURCE === 'API'
        ? content
        : await getArticleSourceFromFile(slug);

    const mdxSource = await renderToString(articleSource, {
      components,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [rehypePrism],
      },
    });
    return { source: mdxSource, article };
  } catch (error) {
    return undefined;
  }
};

export default getArticleData;
