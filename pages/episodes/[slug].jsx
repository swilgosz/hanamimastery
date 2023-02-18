import React from "react";
import { MDXRemote } from "next-mdx-remote";
import components from "../../features/mdx-components";
import TopicSuggestion from "../../features/topic-suggestion";
import EpisodeLayout from "../../layouts/episode-layout";
import { getContent, getContentBySlug } from "../../utils/queries";

export default function Episode({ mdxSource, frontMatter }) {
  return (
    <EpisodeLayout episode={frontMatter}>
      <MDXRemote {...mdxSource} components={components} />
      <TopicSuggestion />
    </EpisodeLayout>
  );
}

export async function getStaticPaths() {
  const posts = await getContent("episodes");

  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getContentBySlug("episodes", params.slug);
  return { props: { ...post } };
}
