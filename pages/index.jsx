import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button } from '@mui/material';
import { SeoComponent } from '../features/seo';
import ContentGrid from '../features/content-grid/index';
import ArticlesLayout from '../layouts/articles-layout';
import HomePageSchema from '../features/content-schemas/homepage-schema';
import { setAuthors } from '../redux/slices/authors';
import { getContent } from '../utils/queries';
import CustomLink from '../features/custom-link';

export default function BlogIndex({ articles, episodes, authors }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAuthors(authors));
  }, [authors]);
  return (
    <>
      <SeoComponent
        title="Newest Hanami screencasts, articles, and video tutorials"
        excerpt="Get familiar with Hanami framework and realise that Ruby is not only Rails!"
        ogtype="website"
      />
      <HomePageSchema />
      <ArticlesLayout
        article={
          <>
            <h1>Recent episodes</h1>
            <ContentGrid items={episodes} more />
            <Box align="right" m={4}>
              <CustomLink href="/episodes" center>
                <Button variant="contained" color="primary">
                  More episodes...
                </Button>
              </CustomLink>
            </Box>
            <h1>Recent articles</h1>
            <ContentGrid items={articles} more />
            <Box align="right" m={4}>
              <CustomLink href="/c/stray" center>
                <Button variant="contained" color="primary">
                  More articles...
                </Button>
              </CustomLink>
            </Box>
          </>
        }
      />
    </>
  );
}

export async function getStaticProps() {
  const episodes = await getContent('episodes');
  const articles = await getContent('articles');
  const authors = await getContent('team');

  return {
    props: {
      articles: articles.slice(0, 3),
      episodes: episodes.slice(0, 5),
      authors,
    }, // will be passed to the page component as props
  };
}
