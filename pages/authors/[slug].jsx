import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { MDXRemote } from 'next-mdx-remote';
import components from '../../features/mdx-components';
import { getAuthors, getContentBySlug, getContent } from '../../utils/queries';
import ArticlesLayout from '../../layouts/articles-layout';
import CustomLink from '../../features/custom-link';
import ContentDisplay from '../../features/content-grid';

export default function Episode({ mdxSource, frontMatter, episodesByAuthor }) {
  const { socialLinks, name } = frontMatter;

  return (
    <ArticlesLayout
      article={
        <Container maxWidth="lg" mb={2}>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            {name}
          </Typography>
          <MDXRemote {...mdxSource} components={components} />
          <Typography variant="h5" fontWeight="bold">
            Check my socials:
          </Typography>
          <Container
            sx={{ display: 'flex', flexDirection: 'column' }}
            component="ul"
          >
            {Object.entries(socialLinks).map(([key, value]) => (
              <Box component="li" key={key}>
                <CustomLink href={value}>
                  <Typography textTransform="capitalize" display="inline">
                    {key}
                  </Typography>
                </CustomLink>
              </Box>
            ))}
          </Container>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
            Episodes/articles by {name}:
          </Typography>
          <ContentDisplay items={episodesByAuthor} relatedContent />
        </Container>
      }
    />
  );
}

export async function getStaticPaths() {
  const authors = await getAuthors('authors');

  return {
    paths: authors.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const author = await getContentBySlug('authors', params.slug);
  const episodes = await getContent();
  const episodesByAuthor = episodes.filter(
    (episode) => episode.author === params.slug
  );
  return { props: { ...author, episodesByAuthor } };
}
