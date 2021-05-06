/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import NextLink from "next/link";
import { Link, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  footer: { marginTop: "auto", padding: theme.spacing(2) },
}));

export default function footer() {
  const classes = useStyles();
  return (
    <Typography
      component="footer"
      align="center"
      gutterBottom
      className={classes.footer}
    >
      Copyright © HanamiMastery {new Date().getFullYear()}.{" "}
      <NextLink href="/privacy-policy" passHref>
        <Link>Privacy Policy</Link>
      </NextLink>
    </Typography>
  );
}
