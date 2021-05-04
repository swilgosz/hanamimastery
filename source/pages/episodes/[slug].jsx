import React from 'react';
import hydrate from 'next-mdx-remote/hydrate';
import { Container, Typography, makeStyles } from '@material-ui/core';
import { DiscussionEmbed } from 'disqus-react';
import { NextSeo } from 'next-seo';
import getArticlesData from '../../utils/get-articles-data';
import getArticleData from '../../utils/get-article-data';
import components from '../../features/mdx-components';
import ArticleLayout from '../../layouts/article-layout';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    padding: 0,
    minHeight: theme.spacing(6),
  },
  hero: {
    backgroundSize: 'cover',
    display: 'flex',
    minHeight: theme.spacing(75),
    color: theme.palette.common.white,
  },
  heroFilter: {
    flexGrow: 1,
    backdropFilter: 'brightness(0.35)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  article: {
    marginBottom: '100px'
  },
}));

export default function Article({ article }) {
  const classes = useStyles();
  const content = hydrate(article.content, { components });
  const { tags, slug, title, thumbnail, id, excerpt } = article;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/episodes/${slug}`;

  return (
    <>
      <NextSeo
        title={title}
        titleTemplate=" %s | Hanami Mastery - a knowledge base to hanami framework"
        twitter={{
          site: '@hanamimastery',
          cardType: 'summary_large_image',
          creator: '@sebwilgosz',
          title,
          description: excerpt,
          image: thumbnail.big,
        }}
        description={excerpt}
        openGraph={{
          article: {
            authors: ['https://www.facebook.com/sebastian.wilgosz'],
            tags,
          },
          url,
          title,
          description: excerpt,
          images: thumbnail,
          defaultImageWidth: 120,
          defaultImageHeight: 630,
          type: 'article',
          site_name: 'Hanami Mastery - a knowledge base to hanami framework',
        }}
        facebook={{
          appId: process.env.NEXT_PUBLIC_FB_APP_ID,
        }}
      />
      <section
        className={classes.hero}
        style={{ backgroundImage: `url("${thumbnail.full}")` }}
      >
        <Typography variant="h4" align="center" className={classes.heroFilter}>
          {title}
        </Typography>
      </section>
      <ArticleLayout
        article={
          <Container maxWidth="lg" component="main">
            <article className={classes.article}>
              {content}
            </article>
            <div>
              <DiscussionEmbed
                shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME}
                config={{
                  url: `${url}`,
                  title,
                  identifier: `episode-${id}`,
                }}
              />
            </div>
          </Container>
        }
      />
    </>
  );
}

export async function getStaticPaths() {
  const { articles } = await getArticlesData();
  const paths = Object.values(articles).map((article) => ({
    params: { slug: article.slug },
  }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps(context) {
  const articleData = await getArticleData(context.params.slug);
  if (!articleData) {
    return {
      notFound: true,
    };
  }

  const { article } = articleData;

  return {
    props: { article }, // will be passed to the page component as props
    revalidate: 604800, // revalidate the article every week
  };
}
