/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import NextLink from 'next/link';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  footer: { marginTop: 'auto', padding: theme.spacing(2) },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <Typography
      component="footer"
      align="center"
      gutterBottom
      className={classes.footer}
    >
      Copyright © HanamiMastery {new Date().getFullYear()}.{' '}
      <NextLink href="/privacy-policy" passHref>
        Privacy Policy
      </NextLink>
    </Typography>
  );
}
