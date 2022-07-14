import * as React from "react";

import { Grid, Container, Typography } from "@material-ui/core";
import { SeoComponent } from "../../features/seo";
import { useRouter } from "next/router";
import { useStyles } from "./episode-layout.styles";
import BuyMeACoffee from "../../features/buy-me-a-coffee-button";
import Discussions from "../../features/content/discussions";
import EmailSubscriptionForm from "../../features/email-subscription-form";
import EpisodeSchema from "../../features/content-schemas/episode-schema";
import EpisodeTabs from "../episode-tabs";
import GHSponsor from "../../features/gh-sponsor";
import ShareButtons from "../../features/share-buttons";
import YoutubeEmbed from "../../features/youtube-embed";
import SidebarSponsors from "../../features/sidebar-sponsors";
import SidebarJobOffers from "../../features/sidebar-job-offers";
import {
  shouldDisplayArticle,
  shouldDisplayDiscussions,
  shouldDisplayVideo,
} from "../../utils/display-queries";

const EpisodeLayout = ({ episode, children }) => {
  const classes = useStyles();

  const {
    query: { view },
  } = useRouter();

  const { topics, videoId, title, thumbnail, id, excerpt, url, discussions } =
    episode;

  const displayArticle = React.useMemo(
    () => shouldDisplayArticle(view),
    [view]
  );
  const displayDiscussions = React.useMemo(
    () => shouldDisplayDiscussions(view),
    [view]
  );
  const displayVideo = React.useMemo(() => shouldDisplayVideo(view), [view]);

  let prefix;
  if (view == "discuss") {
    prefix = "Discussions for "
  } else {
    prefix = ""
  }

  return (
    <>
      <SeoComponent
        title={`${prefix}${title}`}
        thumbnails={thumbnail}
        topics={topics}
        url={episode.url}
        excerpt={`${prefix}${excerpt}`}
      />
      <EpisodeSchema episode={episode} />
      <section
        className={classes.hero}
        style={{ backgroundImage: `url("${thumbnail.full}")` }}
      >
        <div className={classes.heroFilterWrapper}>
        <Typography variant="h1" align="center" className={classes.heroTitle}>
          {title}
        </Typography>
        <Typography variant="h5" align="center" className={classes.heroSubtitle}>
          {`Episode #${id}`}
        </Typography>
        </div>
      </section>
      <Container className={classes.conainer} maxWidth="xl" component="main">
        <Grid container className={classes.root} spacing={4}>
          <Grid item xs={12} sm={12} md={12} lg={2} xl={3} component="aside">
            <EpisodeTabs episode={episode} />
          </Grid>
          <Grid
            item
            sm={12}
            md={8}
            lg={7}
            xl={6}
            component="article"
            className={classes.article}
          >
            <ShareButtons />
            {displayVideo && <YoutubeEmbed embedId={videoId} />}
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

export default EpisodeLayout;
