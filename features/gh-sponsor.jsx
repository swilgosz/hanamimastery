/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {},
  centered: {
    display: 'block',
    textAlign: 'center',
  },
  btn: {
    border: 0,
  },
}));

export default function GHSponsor() {
  const classes = useStyles();
  return (
    <iframe
      src="https://github.com/sponsors/swilgosz/card"
      title="Sponsor swilgosz"
      height="400"
      width="100%"
      className={classes.btn}
    />
  );
}
