import { NextSeo } from 'next-seo';
import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import ArticlesGrid from '../../features/articles-grid/index';
import EmailSubscriptionForm from '../../features/email-subscription-form';
import getArticlesData from '../../utils/get-articles-data';
import { setAuthors } from '../../redux/slices/authors';
import { setArticles } from '../../redux/slices/articles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
}));

export default function BlogIndex({ articles, authors }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setArticles(articles));
    dispatch(setAuthors(authors));
  }, [dispatch]);
  return (
    <>
      <NextSeo
        title="Recent articles"
        titleTemplate="%s | Driggl - Modern web development"
        description="Build modern websites like a professional with Driggl's Community!"
        openGraph={{
          title: 'Recent articles',
          description:
            'Newest content from web Professionals and the Modern web development Community!',
          images: ['/home-cover.jpg'],
          type: 'website',
        }}
      />
      <Grid
        container
        className={classes.root}
        component={(props) => (
          <Container maxWidth="lg" component="main" {...props} />
        )}
      >
        <Grid item xs={12} md={9}>
          <ArticlesGrid />
        </Grid>
        <Grid item xs={12} md={3}>
          <EmailSubscriptionForm />
        </Grid>
      </Grid>
    </>
  );
}

export async function getStaticProps() {
  const { articles, authors } = await getArticlesData();

  return {
    props: { articles, authors }, // will be passed to the page component as props
  };
}
