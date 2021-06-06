/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Typography, Card, CardContent, CardHeader } from "@material-ui/core";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
  },
  centered: {
    display: 'block',
    textAlign: 'center'
  },
}));

export default function GHSponsor() {
  const classes = useStyles();
  return (
    <Card>
      <CardHeader
        disableTypography
        title={
          <Typography variant="h4">
            Sponsor this project on Github!
          </Typography>
        }
        subheader={
          <Typography variant="subtitle1">
            10% of all your support goes to Hanami development support
          </Typography>
        }
      />
      <CardContent>
        <Typography>
          <div className={classes.centered}>
            <iframe
              src="https://ghbtns.com/github-btn.html?user=swilgosz&type=sponsor"
              frameBorder="0"
              scrolling="0"
              width="150"
              height="20"
              title="GitHub"
            />
          </div>
        </Typography>
      </CardContent>
    </Card>
  );
}
