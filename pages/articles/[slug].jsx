import React from "react";
import { Typography, makeStyles } from "@material-ui/core";
import { NextSeo } from "next-seo";
import { MDXRemote } from "next-mdx-remote";
import components from "../../features/mdx-components";
import ArticleSchema from "../../features/content-schemas/article-schema";
import ArticleLayout from "../../layouts/article-layout";
import { getSlugs } from "../../utils/file-browsers";
import { getContentBySlug } from "../../utils/queries";

import ShareButtons from "../../features/share-buttons";
import { useRouter } from 'next/router'
import TabPanel from '../../features/tab-panel';
import queryString from "query-string";
import Discussions from "../../features/content/discussions";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    padding: 0,
    minHeight: theme.spacing(6),
  },
  hero: {
    backgroundSize: "cover",
    display: "flex",
    minHeight: theme.spacing(75),
    color: theme.palette.common.white,
  },
  heroFilter: {
    flexGrow: 1,
    backdropFilter: "brightness(0.35)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    fontSize: "2.125rem",
    fontWeight: "400",
    lineHeight: "1.235",
    letterSpacing: "0.00735em",
  },
  article: {
    marginBottom: "100px",
  },
}));

export default function Article({ mdxSource, frontMatter }) {
  const router = useRouter()
  router.query = {
    ...router.query,
    ...queryString.parse(router.asPath.split(/\?/)[1])
  }
  const classes = useStyles();

  const mapping = {
    'read': 0,
    'discuss': 1
  }
  const activeTab = mapping[router.query.view] || 0;
  const { topics, path, title, thumbnail, id, excerpt, url} = frontMatter;

  return (
    <>
      <NextSeo
        title={title}
        titleTemplate=" %s | Hanami Mastery - a knowledge base to hanami framework"
        twitter={{
          site: "@hanamimastery",
          handle: "@sebwilgosz",
          cardType: "summary_large_image",
        }}
        additionalMetaTags={[{
          name: 'twitter:image',
          content: thumbnail.big,
        }]}
        canonical={url}
        description={excerpt}
        openGraph={{
          article: {
            authors: ["https://www.facebook.com/sebastian.wilgosz"],
            topics,
          },
          locale: "en_US",
          url,
          title,
          description: excerpt,
          defaultImageWidth: 120,
          defaultImageHeight: 630,
          type: "article",
          site_name: "Hanami Mastery - a knowledge base to hanami framework",
          images: [
            {
              url: thumbnail.big,
              width: 780,
              height: 440,
              alt: title,
            }
          ],
        }}
        facebook={{
          appId: process.env.NEXT_PUBLIC_FB_APP_ID,
        }}
      />
      <ArticleSchema article={frontMatter} />
      <section
        className={classes.hero}
        style={{ backgroundImage: `url("${thumbnail.full}")` }}
      >
        <Typography variant="h1" align="center" className={classes.heroFilter}>
          {title}
        </Typography>
      </section>
      <ArticleLayout
        view={activeTab}
        articlePath={`/${path}`}
        article={
          <div>
            <ShareButtons />
            <TabPanel value={activeTab} index={0}>
              <article className={classes.article}>
                <MDXRemote {...mdxSource} components={components} />
              </article>
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <Discussions {...frontMatter} url={url} identifier={`article-${id}`} />
            </TabPanel>
          </div>
        }
      />
    </>
  );
}

export async function getStaticPaths() {
  const slugs = await getSlugs("articles");

  return {
    paths: slugs.map((p) => ({ params: { slug: p } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getContentBySlug("articles", params.slug);
  return { props: { ...post } };
}
