import { NextSeo } from 'next-seo';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ContentGrid from '../../features/content-grid/index';
import ArticlesLayout from '../../layouts/articles-layout';
import { setAuthors } from '../../redux/slices/authors';
import { getContent } from '../../utils/queries';

export default function BlogIndex({ posts, authors }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAuthors(authors));
  }, [authors]);
  return (
    <>
      <NextSeo
        title="Casual articles about web development in Ruby"
        titleTemplate="%s | Hanami Mastery"
        description="Newest non-episode Hanami Mastery articles. Casual thinking, felietons, and others!"
        openGraph={{
          title: 'Casual articles about web development in Ruby',
          description:
            'Newest non-episode Hanami Mastery articles. Casual thinking, felietons, and others!',
          images: ['/images/logo-hm.jpeg'],
          type: 'website',
        }}
      />
      <ArticlesLayout article={<ContentGrid items={posts} />} />
    </>
  );
}

export async function getStaticProps() {
  const posts = await getContent('articles');
  const authors = await getContent('team');

  return {
    props: { posts, authors }, // will be passed to the page component as props
  };
}
