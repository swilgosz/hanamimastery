import * as React from "react";
import { Grid, Container, Typography } from "@material-ui/core";
import { SeoComponent } from "../../features/seo";
import { useRouter } from "next/router";
import { useStyles } from "./article-layout.styles";
import ArticleSchema from "../../features/content-schemas/article-schema";
import ArticleTabs from "../article-tabs";
import BuyMeACoffee from "../../features/buy-me-a-coffee-button";
import Discussions from "../../features/content/discussions";
import EmailSubscriptionForm from "../../features/email-subscription-form";
import GHSponsor from "../../features/gh-sponsor";
import ShareButtons from "../../features/share-buttons";
import SidebarSponsors from "../../features/sidebar-sponsors";
import SidebarJobOffers from "../../features/sidebar-job-offers";

import {
  shouldDisplayArticle,
  shouldDisplayDiscussions,
} from "../../utils/display-queries";

const ArticleLayout = ({ article, children }) => {
  const classes = useStyles();

  const {
    query: { view },
  } = useRouter();

  const { topics, title, thumbnail, id, excerpt, url, discussions } = article;

  const displayArticle = React.useMemo(
    () => shouldDisplayArticle(view),
    [view]
  );
  const displayDiscussions = React.useMemo(
    () => shouldDisplayDiscussions(view),
    [view]
  );

  let prefix;
  if (view == "discuss") {
    prefix = "Discussions for "
  } else {
    prefix = ""
  }

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
        <Typography variant="h1" align="center" className={classes.heroFilter}>
          {title}
        </Typography>
      </section>
      <Container className={classes.conainer} maxWidth="xl" component="main">
        <Grid container className={classes.root} spacing={4}>
          <Grid item xs={12} sm={12} md={12} lg={2} xl={3} component="aside">
            <ArticleTabs />
          </Grid>
          <Grid item sm={12} md={8} lg={7} xl={6} component="article">
            <ShareButtons />
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
            item
            xs={12}
            md={4}
            lg={3}
            component={(props) => (
              <Container maxWidth="lg" component="aside" {...props} />
            )}
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
