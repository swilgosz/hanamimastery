import '../styles/highlighting.css';
import '../styles/fonts.css';
import * as React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import CssBaseline from '@material-ui/core/CssBaseline';
import Head from 'next/head';
import TagManager from 'react-gtm-module';
import { Typography } from '@material-ui/core';
import NextLink from 'next/link';
import TopNav from '../features/top-nav/index';
import Footer from '../features/footer';
import theme from '../styles/theme';
import store from '../redux/store';

const useStyles = makeStyles(() => ({
  alert: {
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    margin: '30px auto',
  },
  alertText: {
    textAlign: 'center',
    margin: 'auto',
    fontWeight: 'bold',
  },
  link: {
    color: 'white !important',
    fontWeight: 'bold',
  },
}));

export default function MyApp(props) {
  const classes = useStyles();
  const { Component, pageProps } = props;

  const { asPath } = useRouter();
  React.useEffect(() => {
    if (window.om82043_72987) {
      window.om82043_72987.reset();
    }
  }, [asPath]);

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const tagManagerArgs = {
    gtmId: process.env.NEXT_PUBLIC_GTM_ID,
  };

  React.useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);

  return (
    <Provider store={store}>
      <Head>
        <meta
          name="author"
          content="Hanami Mastery - https://hanamimastery.com"
        />
      </Head>

      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <TopNav />
        <div className={classes.alert}>
          <Typography paragraph className={classes.alertText}>
            Dear friends, please watch President Zelenskyy's{' '}
            <NextLink
              href="https://twitter.com/PMoelleken/status/1496941845812760577"
              passHref
              className={classes.link}
            >
              speech
            </NextLink>
            . 🇺🇦 Help our brave mates in Ukraine with{' '}
            <NextLink
              href="https://actions.sumofus.org/a/give-to-ukrainians-who-need-an-urgent-lifeline"
              passHref
              className={classes.link}
            >
              a donation
            </NextLink>
            .
          </Typography>
        </div>
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </Provider>
  );
}
