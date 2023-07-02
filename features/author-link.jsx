import React from 'react';
import { Container, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import Image from 'next/image';
import CustomLink from './custom-link';

export default function AuthorLink({ authorData }) {
  const { avatar, name, slug } = authorData;

  return (
    <Container
      sx={{
        display: 'flex',
        gap: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography>
        by
        <CustomLink href={`/authors/${slug}`}>
          <Typography component="span" sx={{ fontWeight: 'bold' }}>
            {' '}
            {name}
          </Typography>
        </CustomLink>
      </Typography>
      {(avatar && (
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
            color: 'background.paper',
            width: '56px',
            height: '56px',
          }}
        />
      )}
    </Container>
  );
}
