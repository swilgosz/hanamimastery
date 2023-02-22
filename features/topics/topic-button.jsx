/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Chip, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {},
}));

export default function TopicButton({ topic }) {
  const classes = useStyles();
  const href = `/t/${topic}`;
  return (
    <Chip
      className={classes.root}
      label={topic}
      component="a"
      href={href}
      color="primary"
      size="small"
      variant="outlined"
      clickable
    />
  );
}
