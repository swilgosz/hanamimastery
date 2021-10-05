/* eslint-disable jsx-a11y/anchor-is-valid */
import { Grid, Container, makeStyles } from "@material-ui/core";
import EmailSubscriptionForm from "../features/email-subscription-form";
import GHSponsor from "../features/gh-sponsor";
import BuyMeACoffee from "../features/buy-me-a-coffee-button";
import EpisodeTabs from "./episode-tabs"

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  container: {
    paddingLeft: "4px",
    paddingRight: "0px"
  },
}));

const EpisodeLayout = ({ episode, view, episodePath }) => {
  const classes = useStyles();
  return (
    <Container className={classes.conainer} maxWidth="xl" component="main">
      <Grid container className={classes.root} spacing={4}>
        <Grid item xs={12} sm={12} md={12} lg={2} xl={3} component="aside">
          <EpisodeTabs activeTab={view} episodePath={episodePath} />
        </Grid>
        <Grid item sm={12} md={8} lg={7} xl={6} component="episode">
          {episode}
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default EpisodeLayout;
