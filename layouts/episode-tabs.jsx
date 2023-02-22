import * as React from 'react';
import { Box, Tabs, Tab, makeStyles, useMediaQuery } from '@material-ui/core';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    borderColor: 'divider',
  },
  link: {
    display: 'inline-flex',
    alignSelf: 'center',
  },
}));

const getTabsValue = (view) => {
  switch (view) {
    case 'episodes':
      return 0;
    case 'discuss':
      return 1;
    default:
      return 0;
  }
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  const classes = useStyles();
  return (
    <NextLink
      className={classes.link}
      centered
      href={props.href}
      passHref
      shallow
    >
      <Tab className={classes.link} {...props} />
    </NextLink>
  );
}

export default function EpisodeTabs({ episode }) {
  const classes = useStyles();

  const {
    query: { slug, view },
  } = useRouter();

  const episodePath = React.useMemo(() => `/episodes/${slug}`, [slug]);
  const value = getTabsValue(view);
  const { source } = episode;
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <Box className={classes.root}>
      <Tabs
        orientation={isSmallScreen ? false : 'vertical'}
        value={value}
        centered
      >
        <LinkTab
          label="Read"
          aria-selected
          href={episodePath}
          {...a11yProps(0)}
        />
        <LinkTab
          className={classes.link}
          rel="alternate"
          label="Discussions"
          href={`${episodePath}?view=discuss`}
          {...a11yProps(1)}
        />
        {source && (
          <LinkTab
            label="Source"
            className={classes.link}
            href={source}
            target="_blank"
            {...a11yProps(0)}
          />
        )}
      </Tabs>
    </Box>
  );
}
