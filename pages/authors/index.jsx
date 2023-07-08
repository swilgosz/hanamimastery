import React from 'react';
import Image from 'next/image';
import { Container, Typography, Grid } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getAuthors } from '../../utils/queries';
import { SeoComponent } from '../../features/seo';
import CustomLink from '../../features/custom-link';

export default function AuthorIndex({ authors }) {
  return (
    <>
      <SeoComponent
        title="HanamiMastery authors"
        excerpt="All the contributors"
        ogtype="website"
      />
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        maxWidth="md"
      >
        <Typography variant="h2" mb={4}>
          Authors
        </Typography>
        <Container sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {authors.map((author) => {
            const { avatar, name, slug } = author;

            return (
              <Grid
                container
                columns={1}
                maxWidth="100px"
                gap={1}
                mb={4}
                key={slug}
              >
                <Grid container item xs={12} justifyContent="center">
                  {(author.avatar && (
                    <Image
                      src={`/${avatar}`}
                      style={{
                        objectFit: 'cover',
                        borderRadius: '100%',
                        padding: '4px',
                      }}
                      width="56"
                      height="56"
                      alt="Picture of the author"
                      unoptimized
                    />
                  )) || (
                    <AccountCircleIcon
                      sx={{
                        color: 'primary.main',
                        width: '56px',
                        height: '56px',
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <CustomLink href={`authors/${slug}`}>
                    <Typography textAlign="center">{name}</Typography>
                  </CustomLink>
                </Grid>
              </Grid>
            );
          })}
        </Container>
      </Container>
    </>
  );
}

export async function getStaticProps() {
  const authors = await getAuthors('authors');

  return {
    props: {
      authors,
    }, // will be passed to the page component as props
  };
}
