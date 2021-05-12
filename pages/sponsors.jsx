import React from "react";
import { Container, makeStyles } from "@material-ui/core";
import { NextSeo } from "next-seo";

import { MDXRemote } from "next-mdx-remote";
import components from "../features/mdx-components";
import ArticleLayout from "../layouts/article-layout";
import { getFileBySlug } from "../utils/index";

export default function Page({ frontMatter, mdxSource }) {
  return (
    <>
      <NextSeo
        title="Sponsors | Hanami Mastery - informations for supporters."
        titleTemplate="%s | Hanami Mastery - learn hanami as a pro"
        description="Get the information how to support the project!"
        openGraph={{
          title: "Sponsors - Hanami Mastery",
          description: "Get the information how to support the project!",
          images: ["/home-cover.jpg"],
          type: "website",
        }}
      />

      <ArticleLayout
        article={
          <Container maxWidth="lg">
            <MDXRemote {...mdxSource} components={components} />
          </Container>
        }
      />
    </>
  );
}

export async function getStaticProps() {
  const post = await getFileBySlug("pages", "sponsors");

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { ...post }, // will be passed to the page component as props
  };
}
