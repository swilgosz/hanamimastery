import React from "react";
import { MDXRemote } from "next-mdx-remote";
import { Container } from "@material-ui/core";
import { getContentBySlug } from "../utils/queries";
import components from "../features/mdx-components";
import ArticlesLayout from "../layouts/articles-layout";
import { SeoComponent } from "../features/seo";

export default function Page({ frontMatter, mdxSource }) {
  return (
    <>
      <SeoComponent
        title="Thank you for your Hanami Mastery subscription!"
        excerpt="Check out the possible next steps to dig into our initiative!"
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
  const post = await getContentBySlug("pages", "thank-you");

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { ...post }, // will be passed to the page component as props
  };
}
