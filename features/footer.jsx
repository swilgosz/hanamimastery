/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import NextLink from 'next/link';
import { Link, Typography } from '@material-ui/core';

export default function footer() {
  return (
    <Typography component="footer" align="center" gutterBottom>
      Copyright © HanamiMastery {new Date().getFullYear()}.{' '}
      <NextLink href="/privacy-policy" passHref>
        <Link>Privacy Policy</Link>
      </NextLink>
    </Typography>
  );
}
