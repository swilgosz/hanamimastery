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
          <Container maxWidth="lg">
            <MDXRemote {...mdxSource} components={components} />
          </Container>
        }
      />
    </>
  );
}

export async function getStaticProps() {
  const post = await getFileBySlug("pages", "about");

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { ...post }, // will be passed to the page component as props
  };
}
