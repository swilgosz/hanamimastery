import { NextSeo } from 'next-seo';
import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import ArticlesGrid from '../../features/articles-grid/index';
import getArticlesData from '../../utils/get-articles-data';
import { setAuthors } from '../../redux/slices/authors';
import { setArticles } from '../../redux/slices/articles';
import ArticleLayout from '../../layouts/article-layout';

export default function BlogIndex({ articles, authors }) {
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
      <ArticleLayout article={<ArticlesGrid />} />
    </>
  );
}

export async function getStaticProps() {
  const { articles, authors } = await getArticlesData();

  return {
    props: { articles, authors }, // will be passed to the page component as props
  };
}
