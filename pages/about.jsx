import React from "react";
import hydrate from "next-mdx-remote/hydrate";
import { Container, Typography, makeStyles } from "@material-ui/core";
import { NextSeo } from "next-seo";
import getPageData from "../utils/get-page-data";
import components from "../features/mdx-components";
import ArticleLayout from "../layouts/article-layout";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    padding: 0,
    minHeight: theme.spacing(6),
  },
}));

export default function Page({ page, content }) {
  console.log(page, content);
  const classes = useStyles();
  const pageContent = hydrate(content, { components });
  const { slug, title, thumbnail, id, excerpt } = page;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/episodes/${slug}`;

  return (
    <>
      <NextSeo
        title="About | Hanami Mastery - the concept and mission."
        titleTemplate="%s | Hanami Mastery - learn hanami as a pro"
        description="Discover the rules driving the Hanami Mastery project!"
        openGraph={{
          title: "About - Hanami Mastery",
          description: "Discover the rules driving the Hanami Mastery project!",
          images: ["/home-cover.jpg"],
          type: "website",
        }}
      />

      <ArticleLayout
        article={
          <Container maxWidth="lg" component="main">
            <article>{pageContent}</article>
          </Container>
        }
      />
    </>
  );
}

export async function getStaticProps() {
  const pageData = await getPageData("about");

  if (!pageData) {
    return {
      notFound: true,
    };
  }

  const { page, content } = pageData;

  return {
    props: { page, content }, // will be passed to the page component as props
    revalidate: 604800, // revalidate the page every week
  };
}
