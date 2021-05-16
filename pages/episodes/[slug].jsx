import React from "react";
import { Container, Typography, makeStyles } from "@material-ui/core";
import { DiscussionEmbed } from "disqus-react";
import { NextSeo } from "next-seo";
import { MDXRemote } from "next-mdx-remote";
import components from "../../features/mdx-components";
import ArticleLayout from "../../layouts/article-layout";
import { getFiles, getFileBySlug } from "../../utils/";
import YoutubeEmbed from "../../features/youtube-embed";

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
  },
  article: {
    marginBottom: "100px",
  },
}));

export default function Article({ mdxSource, frontMatter }) {
  const classes = useStyles();
  const { tags, slug, videoId, title, thumbnail, id, excerpt } = frontMatter;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/episodes/${slug}`;
  const videos = videoId ? [{ url: `https://youtu.be/${videoId}` }] : null;
  return (
    <>
      <NextSeo
        title={title}
        titleTemplate=" %s | Hanami Mastery - a knowledge base to hanami framework"
        twitter={{
          handle: "@hanamimastery",
          site: "@hanamimastery",
          cardType: "summary_large_image",
          creator: "@sebwilgosz",
          title,
          description: excerpt,
          image: thumbnail.big,
        }}
        description={excerpt}
        openGraph={{
          article: {
            authors: ["https://www.facebook.com/sebastian.wilgosz"],
            tags,
          },
          url,
          title,
          description: excerpt,
          defaultImageWidth: 120,
          defaultImageHeight: 630,
          type: "article",
          site_name: "Hanami Mastery - a knowledge base to hanami framework",
          videos: videos,
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
              <YoutubeEmbed embedId={videoId} />
              <MDXRemote {...mdxSource} components={components} />
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
  const posts = await getFiles("episodes");

  return {
    paths: posts.map((p) => ({
      params: {
        slug: p.replace(/\.mdx/, ""),
      },
    })),
    fallback: false,
  };
}
export async function getStaticProps({ params }) {
  const post = await getFileBySlug("episodes", params.slug);
  return { props: { ...post } };
}
