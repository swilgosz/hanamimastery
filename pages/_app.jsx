import '../styles/highlighting.css';
import * as React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import CssBaseline from '@material-ui/core/CssBaseline';
import Head from 'next/head';
import TopNav from '../features/top-nav/index';
import Footer from '../features/footer';
import theme from '../styles/theme';
import store from '../redux/store';
import TagManager from 'react-gtm-module'

export default function MyApp(props) {
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
    gtmId: process.env.NEXT_PUBLIC_GTM_ID
  }

  React.useEffect(() => {
    TagManager.initialize(tagManagerArgs)
  }, [])

  return (
    <Provider store={store}>
      <Head>
        <meta name="author" content="Hanami Mastery - https://hanamimastery.com" />
      </Head>

      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <TopNav />
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </Provider>
  );
}
