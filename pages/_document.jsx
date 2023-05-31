import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import { ServerStyleSheets } from '@mui/styles';
import theme from '../styles/theme';

export default class MyDocument extends Document {
  render() {
    const siteUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/feed.xml`;
    return (
      <Html lang="en">
        <Head>
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link
            rel="alternate"
            type="application/rss+xml"
            title="Hanami Mastery RSS channel!"
            href={siteUrl}
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <Script
            src="https://a.omappapi.com/app/js/api.min.js"
            strategy="lazyOnload"
            data-account="82043"
            data-user="72987"
          />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  };
};
