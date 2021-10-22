import React from "react";
import { Typography, makeStyles } from "@material-ui/core";
import { NextSeo } from "next-seo";
import { MDXRemote } from "next-mdx-remote";
import components from "../../features/mdx-components";
import EpisodeSchema from "../../features/content-schemas/episode-schema";
import EpisodeLayout from "../../layouts/episode-layout";
import { getSlugs } from "../../utils/file-browsers";
import { getContentBySlug } from "../../utils/queries";
import YoutubeEmbed from "../../features/youtube-embed";
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
  const { topics, path, videoId, title, thumbnail, id, excerpt, url} = frontMatter;
  const videos = videoId ? [{ url: `https://youtu.be/${videoId}` }] : null;
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
      <EpisodeSchema episode={frontMatter} />
      <section
        className={classes.hero}
        style={{ backgroundImage: `url("${thumbnail.full}")` }}
      >
        <Typography variant="h4" align="center" className={classes.heroFilter}>
          {title}
        </Typography>
      </section>
      <EpisodeLayout
        view={activeTab}
        episodePath={`/${path}`}
        episode={
          <div>
            <ShareButtons />
            <TabPanel value={activeTab} index={0}>
              <YoutubeEmbed embedId={videoId} />
              <article className={classes.article}>
                <MDXRemote {...mdxSource} components={components} />
              </article>
            </TabPanel>
            {/* <TabPanel value={activeTab} index='watch'>
            </TabPanel> */}
            <TabPanel value={activeTab} index={1}>
              <Discussions {...frontMatter} url={url} identifier={`episode-${id}`} />
            </TabPanel>
          </div>
        }
      />
    </>
  );
}

export async function getStaticPaths() {
  const slugs = await getSlugs("episodes");

  return {
    paths: slugs.map((p) => ({ params: { slug: p } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getContentBySlug("episodes", params.slug);
  return { props: { ...post } };
}
