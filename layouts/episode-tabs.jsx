import * as React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import CustomLink from '../features/custom-link';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    borderColor: 'divider',
  },
  link: {
    width: '100%',
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
  const { href, ...rest } = props;
  return (
    <CustomLink href={href}>
      <Tab className={classes.link} {...rest} />
    </CustomLink>
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
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <Box className={classes.root}>
      <Tabs
        centered
        orientation={isSmallScreen ? 'horizontal' : 'vertical'}
        value={value}
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
