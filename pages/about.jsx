import React from 'react';
import { Container } from '@material-ui/core';
import { MDXRemote } from 'next-mdx-remote';
import { SeoComponent } from '../features/seo';

import components from '../features/mdx-components';
import ArticlesLayout from '../layouts/articles-layout';
import { getContentBySlug } from '../utils/queries';

export default function Page({ frontMatter, mdxSource }) {
  return (
    <>
      <SeoComponent
        title="About | Hanami Mastery - the concept and mission."
        excerpt="Discover the rules driving the Hanami Mastery project!"
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
  const post = await getContentBySlug('pages', 'about');

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { ...post }, // will be passed to the page component as props
  };
}
