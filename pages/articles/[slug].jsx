import { MDXRemote } from "next-mdx-remote";
import components from "../../features/mdx-components";
import ArticleLayout from "../../layouts/article-layout";
import { getContentBySlug, getContent } from "../../utils/queries";
import TopicSuggestion from "../../features/topic-suggestion";

export default function Article({ mdxSource, frontMatter }) {
  return (
    <ArticleLayout article={frontMatter}>
      <MDXRemote {...mdxSource} components={components} />
      <TopicSuggestion />
    </ArticleLayout>
  );
}

export async function getStaticPaths() {
  const posts = await getContent("articles");

  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getContentBySlug("articles", params.slug);
  return { props: { ...post } };
}
