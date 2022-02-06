/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import NextLink from "next/link";
import { Typography, Card, CardMedia, CardActions, CardContent, CardHeader, Button } from "@material-ui/core";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: '20px'
  },
  centered: {
    // display: 'block',
    paddingTop: "0px",
    marginTop: "0px",
    textAlign: 'center',
    display: 'block'
  },
  header: {
    textAlign: 'center',
    display: 'block',
    padding: '0px'
  },
  media: {
    padding: '20px'
  }
}));

export default function SidebarSponsors() {
  const classes = useStyles();
  return (
    // <h1>Trusted & Supported By</h1>
    // <img src="" />

    <Card sx={{ maxWidth: 345 }} className={ classes.root }>
      <CardHeader title="Trusted & Supported by" className={classes.header} />
      <a href="https://dnsimple.com/opensource" target="_blank_">
        <CardMedia
          component="img"
          alt="DNSimple"
          image="/images/partners/dnsimple-logo-blue.png"
          className={classes.media}
        />
      </a>
      <CardActions className={ classes.centered }>
        <NextLink href={`/sponsors`} passHref>
          <Button variant="contained" color="primary">
            See all sponsors
          </Button>
        </NextLink>
      </CardActions>
    </Card>
  );
}
