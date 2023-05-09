import React from 'react';
import { DiscussionEmbed } from 'disqus-react';

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';

import RedditIcon from '@mui/icons-material/Reddit';
import TwitterIcon from '@mui/icons-material/Twitter';

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {},
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    marginTop: '30px',
    marginBottom: '100px',
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
        <ListItemLink key="twitter" href={discussions.twitter} target="_blank">
          <ListItemIcon>
            <TwitterIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Twitter thread" />
        </ListItemLink>
        <Divider />
        {reddits.map((_key) => (
          <ListItemLink
            key={_key}
            href={discussions.reddit[_key]}
            target="_blank"
          >
            <ListItemIcon>
              <RedditIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={`Reddit thread on r/${_key}`} />
          </ListItemLink>
        ))}
      </List>
      <Divider />
    </div>
  );
}

/**
 * Displays Discuss section based on the current page
 * @param {discussions} discussions from the frontMatter
 * @param {title} title from the frontMatter
 * @param {url} url from the frontMatter
 * @param {identifier} identifier from the frontMatter
 * @returns
 */
export default function Discusions({ discussions, url, title, identifier }) {
  return (
    <div>
      <div>
        <Typography variant="h4">Comments and discussion links</Typography>
        <DiscussionsList discussions={discussions} />
      </div>
      <div>
        <DiscussionEmbed
          shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME}
          config={{
            url: `${url}`,
            title,
            identifier,
          }}
        />
      </div>
    </div>
  );
}
