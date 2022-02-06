/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import ArrowIcon from '@material-ui/icons/ArrowRight';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import { Link, Typography, Card, CardMedia, CardActions, CardContent, CardHeader, Button } from "@material-ui/core";
import NextLink from "next/link";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  list: {
    width: '100%',
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nestedList: {
    paddingLeft: theme.spacing(4),
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


export default function JobOffers() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Card sx={{ maxWidth: 345 }} className={ classes.root }>
      <CardHeader title="Open Hanami Jobs" className={classes.header} />
      <CardContent>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">

            </ListSubheader>
          }
          className={classes.root}
        >
          <ListItem button onClick={handleClick} className={classes.list}>
            <ListItemText primary="DNSimple" className={classes.list} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button color="primary" className={classes.nestedList}>
                {/* <ListItemIcon>
                  <ArrowIcon />
                </ListItemIcon> */}
                <Link href="https://apply.workable.com/dnsimple/j/36AE622A87/" target="_blank_">
                  <ListItemText primary="Software Engineer" />
                </Link>
              </ListItem>
              <ListItem button color="primary" className={classes.nestedList}>
                <Link href="https://apply.workable.com/dnsimple/j/F17DAD5B37/" target="_blank_">
                  <ListItemText primary="Sr Software Engineer" />
                </Link>
              </ListItem>
            </List>
          </Collapse>
        </List>
      </CardContent>
      {/* <CardActions className={ classes.centered }>
        <NextLink href={`/sponsors`} passHref>
          <Button variant="contained" color="primary">
            See all sponsors
          </Button>
        </NextLink>
      </CardActions> */}
    </Card>
  );
}
