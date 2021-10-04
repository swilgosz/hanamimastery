import React from "react";
import { DiscussionEmbed } from "disqus-react";

import { List, ListItem, ListItemIcon, ListItemText, Divider, Typography } from '@material-ui/core';

import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {},
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    marginTop: "30px",
    marginBottom: "100px",
  },
}));

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

function DiscussionsList({ discussions }) {
  const classes = useStyles();
  const reddits = Object.keys(discussions.reddit);

  return (
    <div className={classes.list}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItemLink key='twitter' href={discussions.twitter} target="_blank">
          <ListItemIcon>
            <TwitterIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Twitter thread" />
        </ListItemLink>
        <Divider />
        {
          reddits.map((_key) => (
            <ListItemLink key={_key} href={discussions.reddit[_key]} target="_blank">
              <ListItemIcon>
                <RedditIcon color="primary"/>
              </ListItemIcon>
              <ListItemText primary={`Reddit thread on r/${_key}`} />
            </ListItemLink>
          ))
        }
      </List>
      <Divider />
    </div>
  );
}

export default function Discusions(content) {
  return(
    <div>
      <div>
        <Typography variant="h4">Comments and discussion links</Typography>
        <DiscussionsList discussions={content.discussions}/>
      </div>
      <div>
        <DiscussionEmbed
          shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME}
          config={{
            url: `${content.url}`,
            title: content.title,
            identifier: content.identifier
          }}
        />
      </div>
    </div>
  )
}
