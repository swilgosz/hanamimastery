import * as React from 'react';
import { Grid, Container, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { SeoComponent } from '../../features/seo';
import { useStyles } from './article-layout.styles';
import TableOfContents from '../../features/table-of-contents/table-of-contents';
import ArticleSchema from '../../features/content-schemas/article-schema';
import ArticleTabs from '../article-tabs';
import BuyMeACoffee from '../../features/buy-me-a-coffee-button';
import Discussions from '../../features/content/discussions';
import EmailSubscriptionForm from '../../features/email-subscription-form';
import GHSponsor from '../../features/gh-sponsor';
import ShareButtons from '../../features/share-buttons';
import SidebarSponsors from '../../features/sidebar-sponsors';
import SidebarJobOffers from '../../features/sidebar-job-offers';
import AuthorLink from '../../features/author-link';

import {
  shouldDisplayArticle,
  shouldDisplayDiscussions,
} from '../../utils/display-queries';

const ArticleLayout = ({ article, children }) => {
  const classes = useStyles();

  const {
    query: { view },
  } = useRouter();

  const {
    topics,
    title,
    thumbnail,
    id,
    excerpt,
    url,
    discussions,
    authorData,
  } = article;

  const displayArticle = React.useMemo(
    () => shouldDisplayArticle(view),
    [view]
  );
  const displayDiscussions = React.useMemo(
    () => shouldDisplayDiscussions(view),
    [view]
  );

  return (
    <>
      <SeoComponent
        title={title}
        thumbnails={thumbnail}
        topics={topics}
        url={article.url}
        excerpt={excerpt}
      />
      <ArticleSchema article={article} />
      <section
        className={classes.hero}
        style={{ backgroundImage: `url("${thumbnail.full}")` }}
      >
        <Container className={classes.heroFilterWrapper} maxWidth="100vw">
          <Typography variant="h1" align="center" className={classes.heroTitle}>
            {title}
          </Typography>
          <Typography
            variant="h5"
            align="center"
            className={classes.heroSubtitle}
          >{`Episode #${id}`}</Typography>
          <AuthorLink authorData={authorData} />
        </Container>
      </section>
      <Container className={classes.container} maxWidth="xl" component="main">
        <Grid container spacing={3}>
          <Grid
            xs={12}
            sm={12}
            md={12}
            lg={2}
            item
            component="aside"
            sx={{
              maxHeight: { lg: '95vh' },
              position: { lg: 'sticky' },
              top: '40px',
            }}
          >
            <ArticleTabs />
            {view !== 'discuss' && (
              <Box sx={{ overflow: 'auto', maxHeight: '75%', pr: 1 }}>
                <TableOfContents headings={article.headings} />
              </Box>
            )}
          </Grid>
          <Grid
            sm={12}
            md={8}
            lg={7}
            item
            component="article"
            sx={{ width: '100%' }}
          >
            <ShareButtons data={article} />
            {displayArticle && children}
            {displayDiscussions && (
              <Discussions
                discussions={discussions}
                title={title}
                url={url}
                identifier={`episode-${id}`}
              />
            )}
          </Grid>
          <Grid
            xs={12}
            md={4}
            lg={3}
            container
            item
            flexDirection="column"
            alignItems="center"
          >
            <GHSponsor className={classes.card} />
            <BuyMeACoffee className={classes.card} />
            <EmailSubscriptionForm className={classes.card} />
            <SidebarSponsors />
            <SidebarJobOffers />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ArticleLayout;
