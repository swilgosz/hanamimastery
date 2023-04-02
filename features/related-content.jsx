import { Container, Typography, makeStyles } from '@material-ui/core';
import React from 'react';
import ContentDisplay from './content-grid';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1rem',
    padding: theme.spacing(0, 0, 0, 4),
  },
}));

export default function RelatedContent({ posts }) {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Typography variant="h2">Related Content</Typography>
      <ContentDisplay items={posts} relatedContent />
    </Container>
  );
}
