import React from 'react';
import { Card, CardContent } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    // [theme.breakpoints.down("md")]: {
    //   margin: theme.spacing(2),
    // },
  },
}));

export default function EmailSubscriptionForm() {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <div id="om-jygtzgejjk4smsfhwyo7-holder" />
      </CardContent>
    </Card>
  );
}
