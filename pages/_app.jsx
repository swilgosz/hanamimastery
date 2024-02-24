import '../styles/highlighting.css';
import '../styles/admonition.css';
import '../styles/mdx-components.css';
import '../styles/globals.css';
import * as React from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Head from 'next/head';
import TagManager from 'react-gtm-module';
import TopNav from '../features/top-nav/index';
import Footer from '../features/footer';
import theme from '../styles/theme';
import CookiesPopup from '../features/cookies-popup';

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
    gtmId: process.env.NEXT_PUBLIC_GTM_ID,
  };

  React.useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);

  const responsiveTheme = responsiveFontSizes(theme);

  return (
    <>
      <Head>
        <meta
          name="author"
          content="Hanami Mastery - https://hanamimastery.com"
        />
      </Head>

      <ThemeProvider theme={responsiveTheme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <TopNav />
        <Component {...pageProps} />
        <Footer />
        <CookiesPopup />
      </ThemeProvider>
    </>
  );
}
