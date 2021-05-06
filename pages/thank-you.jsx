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
  const classes = useStyles();
  const pageContent = hydrate(content, { components });
  const { slug, title, thumbnail, id, excerpt } = page;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/episodes/${slug}`;

  return (
    <>
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
  const pageData = await getPageData("thank-you");

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
