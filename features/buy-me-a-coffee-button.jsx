import React from 'react';
import { Card, CardContent, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
  centered: {
    display: 'block',
    textAlign: 'center',
  },
}));

export default function GHSponsor() {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <a
          href="https://www.buymeacoffee.com/swilgosz"
          className={classes.centered}
        >
          <img
            src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=swilgosz&button_colour=FF5F5F&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00"
            alt="Coffee buy button"
          />
        </a>
      </CardContent>
    </Card>
  );
}
