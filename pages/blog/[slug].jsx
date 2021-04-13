/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import hydrate from 'next-mdx-remote/hydrate';
import renderToString from 'next-mdx-remote/render-to-string';
import rehypePrism from '@mapbox/rehype-prism';
import fs from 'fs';
import path from 'path';
import readingTime from 'reading-time';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import { DiscussionEmbed } from 'disqus-react';
import getArticlesData from '../../utils/get-articles-data';
import components from '../../features/mdx-components';

const getArticleSourceFromFile = async (slug) => {
  const file = fs.readFileSync(
    path.join(`${process.cwd()}/articles/${slug}.mdx`)
  );
  return file;
};

const getArticleData = async (slug) => {
  try {
    const res = await fetch(
      `https://api.sourcerio.com/blogging/v1/blogs/driggl/articles/${slug}`
    );
    const data = await res.json();
    if (!data) throw new Error();

    const {
      publishedAt,
      status,
      metadata,
      excerpt,
      content,
      title,
      thumbnail,
    } = data.data.attributes;

    const author = data.data.relationships.author.data;
    const article = {
      id: data.data.id,
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

export default function BlogIndex({ source, article }) {
  const content = hydrate(source, { components });
  const { slug, title, thumbnail, id } = article;
  return (
    <>
      <Box component="img" src={thumbnail.full} width="100%" />
      <Container maxWidth="lg" component="main">
        <Typography variant="h2">{title}</Typography>
        {content}
        <DiscussionEmbed
          shortname="driggl"
          config={{
            url: `https://driggl.com/blog/a/${slug}?comments-version=2`,
            title,
            identifier: `article-${id}-v2`,
          }}
        />
      </Container>
    </>
  );
}

export async function getStaticPaths() {
  const { articles } = await getArticlesData();
  const paths = Object.values(articles).map((article) => ({
    params: { slug: article.attributes.slug },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps(context) {
  const articleData = await getArticleData(context.params.slug);
  if (!articleData) {
    return {
      notFound: true,
    };
  }

  const { source, article } = articleData;

  return {
    props: { source, article }, // will be passed to the page component as props
  };
}
