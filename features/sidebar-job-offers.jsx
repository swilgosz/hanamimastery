/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { makeStyles } from '@mui/styles';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link, Card, CardContent, CardHeader } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
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
    paddingTop: '0px',
    marginTop: '0px',
    textAlign: 'center',
    display: 'block',
  },
  header: {
    textAlign: 'center',
    display: 'block',
    padding: '0px',
  },
  media: {
    padding: '20px',
  },
}));

export default function JobOffers() {
  const classes = useStyles();
  const [open1, setOpen1] = React.useState(true);
  const [open2, setOpen2] = React.useState(true);

  const handleClick1 = () => {
    setOpen1(!open1);
  };

  const handleClick2 = () => {
    setOpen2(!open2);
  };

  return (
    <Card sx={{ maxWidth: 345 }} className={classes.root}>
      <CardHeader title="Open Hanami Jobs" className={classes.header} />
      <CardContent>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader" />
          }
          className={classes.root}
        >
          <ListItem button onClick={handleClick1} className={classes.list}>
            <ListItemText primary="DNSimple" className={classes.list} />
            {open1 ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open1} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button color="primary" className={classes.nestedList}>
                {/* <ListItemIcon>
                  <ArrowIcon />
                </ListItemIcon> */}
                <Link
                  href="https://apply.workable.com/dnsimple/"
                  target="_blank_"
                >
                  <ListItemText primary="All job offers" />
                </Link>
              </ListItem>
              {/* <ListItem button color="primary" className={classes.nestedList}>
                <Link href="https://apply.workable.com/dnsimple/j/F17DAD5B37/" target="_blank_">
                  <ListItemText primary="Sr Software Engineer" />
                </Link>
              </ListItem> */}
            </List>
          </Collapse>

          <ListItem button onClick={handleClick2} className={classes.list}>
            <ListItemText primary="AscendaLoyalty" className={classes.list} />
            {open2 ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open2} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button color="primary" className={classes.nestedList}>
                <Link
                  href="https://careers.ascendaloyalty.com/"
                  target="_blank_"
                >
                  <ListItemText primary="All job offers" />
                </Link>
              </ListItem>
            </List>
          </Collapse>
        </List>
      </CardContent>
    </Card>
  );
}
