import { Container, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import React from 'react';
import ContentDisplay from './content-grid';

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginTop: '20px',
  },
}));

export default function RelatedContent({ posts }) {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Typography variant="h3">May also interest you...</Typography>
      <ContentDisplay items={posts} relatedContent />
    </Container>
  );
}
