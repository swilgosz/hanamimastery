/* eslint-disable jsx-a11y/anchor-is-valid */
import { Grid, Container, makeStyles } from '@material-ui/core';
import EmailSubscriptionForm from '../features/email-subscription-form';
import GHSponsor from '../features/gh-sponsor';
import SidebarSponsors from '../features/sidebar-sponsors';
import SidebarJobOffers from '../features/sidebar-job-offers';

import BuyMeACoffee from '../features/buy-me-a-coffee-button';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  card: {},
}));

const ArticlesLayout = ({ article }) => {
  const classes = useStyles();
  return (
    <Container maxWidth="lg" component="main">
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12} md={8} component="article">
          {article}
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
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
  );
};

export default ArticlesLayout;
