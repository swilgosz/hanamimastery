import React from 'react';
import { Container } from '@mui/material';
import { MDXRemote } from 'next-mdx-remote';
import { SeoComponent } from '../features/seo';

import components from '../features/mdx-components';
import ArticlesLayout from '../layouts/articles-layout';
import { getContentBySlug } from '../utils/queries';

export default function Page({ frontMatter, mdxSource }) {
  return (
    <>
      <SeoComponent
        title="Sponsors | Hanami Mastery - informations for supporters."
        excerpt="Get the information how to support the project!!"
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
  const post = await getContentBySlug('pages', 'sponsors');

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { ...post }, // will be passed to the page component as props
  };
}
