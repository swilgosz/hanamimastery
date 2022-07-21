import React from "react";
import { Container, makeStyles } from "@material-ui/core";
import { SeoComponent } from "../features/seo";

import { MDXRemote } from "next-mdx-remote";
import components from "../features/mdx-components";
import ArticlesLayout from "../layouts/articles-layout";
import { getContentBySlug } from "../utils/queries";

export default function Page({ frontMatter, mdxSource }) {
  return (
    <>
      <SeoComponent
        title="Collaboration - how we can help each other?"
        excerpt="Find out how we can help you and how you can help us!"
        thumbnails={frontMatter.thumbnail}
        ogtype="website"
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
