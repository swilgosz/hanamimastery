import { NextSeo } from 'next-seo';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ContentGrid from '../../features/content-grid/index';
import ArticlesLayout from '../../layouts/articles-layout';
import HomePageSchema from '../../features/content-schemas/homepage-schema';
import { setAuthors } from '../../redux/slices/authors';
import { getContent } from '../../utils/queries';

export default function BlogIndex({ episodes, authors }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAuthors(authors));
  }, [authors]);
  return (
    <>
      <NextSeo
        title="Newest Hanami screencasts, articles, and video tutorials"
        titleTemplate="%s | Hanami Mastery - learn Hanami as a pro"
        description="Get familiar with Hanami framework and realise that Ruby is not only Rails!"
        openGraph={{
          title: 'Recent articles',
          description:
            'Get familiar with Hanami framework and realise that Ruby is not only Rails! Newest episodes with screencasts related to Hanami!',
          images: ['/images/logo-hm.jpeg'],
          type: 'website',
        }}
      />
      <HomePageSchema />
      <ArticlesLayout
        article={
          <>
            <h1>Recent Hanami Mastery screencast episodes</h1>
            <ContentGrid items={episodes} more />
          </>
        }
      />
    </>
  );
}

export async function getStaticProps() {
  const episodes = await getContent('episodes');
  const authors = await getContent('team');

  return {
    props: {
      episodes,
      authors,
    }, // will be passed to the page component as props
  };
}
