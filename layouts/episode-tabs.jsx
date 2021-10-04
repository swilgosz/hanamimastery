import * as React from 'react';
import { Box, Tabs, Tab, makeStyles, useMediaQuery } from '@material-ui/core';
import NextLink from "next/link";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  link: {
    display: "inline-flex",
    alignSelf: "center",
  },
}));

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  const classes = useStyles();
  return (
    <NextLink className={classes.link} centered href={props.href} passHref>
      <Tab className={classes.link}
        {...props}
      />
    </NextLink>
  );
}

export default function EpisodeTabs({ activeTab, episodePath }) {
  const classes = useStyles();
  const mapping = {
    'read': 0,
    'discuss': 1,
    // 'watch': 2,
  }

  const value = mapping[activeTab];

  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down("md"));

  const tabsProps = {
    orientation: isSmallScreen ? false : "vertical",
    // size: isSmallScreen ? "small" : "large"
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', borderColor: 'divider', width: '100%' }}>
      <Tabs
        {...tabsProps}
        value={value}
        centered
      >
        <LinkTab label="Read" aria-selected={true} href={episodePath} {...a11yProps(0)}/>
        {/* <LinkTab label="Watch" href={`${episodePath}?view=watch`} {...a11yProps('watch')}/> */}
        <LinkTab className={classes.link} label="Discussions" href={`${episodePath}?view=discuss`} passHref {...a11yProps(1)}/>
      </Tabs>
    </Box>
  );
}
