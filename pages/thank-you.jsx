import React from "react";
import { MDXRemote } from "next-mdx-remote";
import { Container } from "@material-ui/core";
import { getFileBySlug } from "../utils/index";
import components from "../features/mdx-components";
import ArticleLayout from "../layouts/article-layout";

export default function Page({ mdxSource }) {
  return (
    <ArticleLayout
      article={
        <Container maxWidth="lg">
          <MDXRemote {...mdxSource} components={components} />
        </Container>
      }
    />
  );
}

export async function getStaticProps() {
  const post = await getFileBySlug("pages", "thank-you");

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { ...post }, // will be passed to the page component as props
  };
}
