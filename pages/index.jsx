import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ContentGrid from "../features/content-grid/index";
import ArticlesLayout from "../layouts/articles-layout";
import HomePageSchema from "../features/content-schemas/homepage-schema";
import { setAuthors } from "../redux/slices/authors";
import { getContent } from "../utils/queries";
import {
  Box,
  Button,
  Divider,
} from "@material-ui/core";
import NextLink from "next/link";

export default function BlogIndex({ articles, episodes, authors }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAuthors(authors));
  }, [authors]);
  return (
    <>
      <NextSeo
        title="Newest Hanami screencasts, articles, and video tutorials"
        titleTemplate="%s | Hanami Mastery - learn Hanami as a pro"
        description="Get familiar with Hanami framework and realise that Ruby is not only Rails!"
        openGraph={{
          title: "Recent articles",
          description:
            "Get familiar with Hanami framework and realise that Ruby is not only Rails! Newest episodes with screencasts related to Hanami!",
          images: ["/images/logo-hm.jpeg"],
          type: "website",
        }}
      />
      <HomePageSchema />
      <ArticlesLayout
        article={
          <>
            <h1>Recent episodes</h1>
            <ContentGrid items={episodes} more={true} />
            <Box align="right" m={4}>
              <NextLink href={`/episodes`} passHref center>
                <Button variant="contained" color="primary">
                  More episodes...
                </Button>
              </NextLink>
            </Box>
            <h1>Recent articles</h1>
            <ContentGrid items={articles} more={true} />
            <Box align="right" m={4}>
              <NextLink href={`/c/stray`} passHref center>
                <Button variant="contained" color="primary">
                  More articles...
                </Button>
              </NextLink>
            </Box>
          </>
        }
      />
    </>
  );
}

export async function getStaticProps() {
  const episodes = await getContent("episodes");
  const articles = await getContent("articles");
  const authors = await getContent("team");

  return {
    props: {
      articles: articles.slice(0, 3),
      episodes: episodes.slice(0, 5),
      authors
    }, // will be passed to the page component as props
  };
}
