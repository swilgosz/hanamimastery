import React from "react";
import { Container, makeStyles } from "@material-ui/core";
import { NextSeo } from "next-seo";

import { MDXRemote } from "next-mdx-remote";
import components from "../features/mdx-components";
import ArticlesLayout from "../layouts/articles-layout";
import { getContentBySlug } from "../utils/queries";

export default function Page({ frontMatter, mdxSource }) {
  return (
    <>
      <NextSeo
        title="Collaboration - how we can help each other? | Hanami Mastery"
        titleTemplate="%s | Hanami Mastery - learn hanami as a pro"
        description="Find out how we can help you and how you can help us!"
        openGraph={{
          title: "Collaboration - how we can help each other? | Hanami Mastery",
          description: "Find out how we can help you and how you can help us!",
          images: ["/images/logo-hm.jpeg"],
          type: "website",
        }}
      />

      <ArticlesLayout
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
  const post = await getContentBySlug("pages", "collaboration");

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { ...post }, // will be passed to the page component as props
  };
}
