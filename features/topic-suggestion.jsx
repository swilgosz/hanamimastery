/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import ChatIcon from '@mui/icons-material/Chat';
import TwitterIcon from '@mui/icons-material/Twitter';

const useStyles = makeStyles(() => ({
  root: {},
  centered: {
    display: 'block',
    textAlign: 'center',
  },
  btn: {
    border: 0,
    marginBottom: '2em',
  },
}));

export default function TopicSuggestion() {
  const classes = useStyles();
  return (
    <Card className={classes.centered}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Do you know great Ruby gems?
        </Typography>
        <Typography variant="body2">
          Add your suggestion to our <strong>discussion panel!</strong>
        </Typography>
        <Typography variant="body2">
          I'll gladly cover them in the future episodes!{' '}
          <strong>Thank you!</strong>
        </Typography>
      </CardContent>
      <CardActions className={classes.centered}>
        <Button
          rel="nofollow"
          href="https://github.com/orgs/hanamimastery/discussions/new?category=Suggestions"
          target="_blank"
          color="primary"
          variant="contained"
          startIcon={<ChatIcon />}
          className={classes.btn}
        >
          Suggest topic
        </Button>

        <Button
          rel="nofollow"
          href="https://twitter.com/intent/tweet?text=%40HanamiMastery%20%23suggestion%20%0A%0A&url=http%3A%2F%2Fhanamimastery.com%2Fepisodes"
          target="_blank"
          variant="contained"
          startIcon={<TwitterIcon />}
          className={classes.btn}
        >
          Tweet #suggestion
        </Button>
      </CardActions>
    </Card>
  );
}
