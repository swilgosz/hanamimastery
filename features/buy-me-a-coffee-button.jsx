/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
/* eslint-disable jsx-a11y/anchor-is-valid */
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(1)
  },
  centered: {
    display: 'block',
    textAlign: 'center'
  },
}));

import { Typography, Card, CardContent, CardHeader } from "@material-ui/core";

export default function GHSponsor() {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
      <a href="https://www.buymeacoffee.com/swilgosz" className={classes.centered}>
          <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=swilgosz&button_colour=FF5F5F&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00" />
      </a>
      </CardContent>
    </Card>
  )
}
