/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Button, Typography, Card, CardContent, CardActions, CardHeader } from "@material-ui/core";

import DeleteIcon from '@material-ui/icons/Delete';
import ChatIcon from '@material-ui/icons/Chat';
import TwitterIcon from '@material-ui/icons/Twitter';

// import CardActions from '@mui/material/CardActions';


import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
  },
  centered: {
    display: 'block',
    textAlign: 'center',
  },
  btn: {
    border: 0,
    marginBottom: '2em',
  }
}));

export default function TopicSuggestion() {
  const classes = useStyles();
  return (
    <Card sx={{ maxWidth: 345 }} className={classes.centered}>
      <CardContent>
      <h3></h3>
        <Typography gutterBottom variant="h5" component="div">
        Do you know great Ruby gems?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add your suggestion to our <strong>discussion panel!</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          I'll gladly cover them in the future episodes! <strong>Thank you!</strong>
        </Typography>
      </CardContent>
      <CardActions className={classes.centered}>
        <Button href="https://github.com/orgs/hanamimastery/discussions/new?category=Suggestions" target="_blank" color="primary" variant="contained" startIcon={<ChatIcon />} className={classes.btn}>
          Suggest topic
        </Button>

        <Button href="https://twitter.com/intent/tweet?text=%40HanamiMastery%20%23suggestion%20%0A%0A&url=http%3A%2F%2Fhanamimastery.com%2Fepisodes" target="_blank" variant="contained" startIcon={<TwitterIcon />} className={classes.btn}>
          Tweet #suggestion
        </Button>
      </CardActions>
    </Card>
  );
}
