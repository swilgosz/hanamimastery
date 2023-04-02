import { MDXRemote } from 'next-mdx-remote';
import components from '../../features/mdx-components';
import ArticleLayout from '../../layouts/article-layout';
import {
  getContentBySlug,
  getContent,
  getRelatedContent,
} from '../../utils/queries';
import TopicSuggestion from '../../features/topic-suggestion';
import RelatedContent from '../../features/related-content';

export default function Article({ mdxSource, frontMatter, relatedContent }) {
  return (
    <ArticleLayout article={frontMatter}>
      <MDXRemote {...mdxSource} components={components} />
      <TopicSuggestion />
      <RelatedContent posts={relatedContent} />
    </ArticleLayout>
  );
}

export async function getStaticPaths() {
  const posts = await getContent('articles');

  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getContentBySlug('articles', params.slug);
  const relatedContent = await getRelatedContent(post.frontMatter);

  return { props: { ...post, relatedContent } };
}
