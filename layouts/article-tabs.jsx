import * as React from 'react';
import { Box, Tabs, Tab, useMediaQuery } from '@mui/material';
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
  const { href, ...rest } = props;
  const classes = useStyles();

  return (
    <CustomLink className={classes.link} href={href}>
      <Tab className={classes.link} {...rest} />
    </CustomLink>
  );
}

export default function ArticleTabs() {
  const classes = useStyles();

  const {
    query: { slug, view },
  } = useRouter();

  const value = getTabsValue(view);

  const articlePath = React.useMemo(() => `/articles/${slug}`, [slug]);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <Box className={classes.root}>
      <Tabs
        orientation={isSmallScreen ? 'horizontal' : 'vertical'}
        centered
        value={value}
      >
        <LinkTab
          className={classes.link}
          label="Read"
          href={articlePath}
          {...a11yProps(0)}
        />
        <LinkTab
          className={classes.link}
          label="Discussions"
          href={`${articlePath}?view=discuss`}
          {...a11yProps(1)}
        />
      </Tabs>
    </Box>
  );
}
