/* eslint-disable jsx-a11y/anchor-is-valid */
import { Grid, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
import EmailSubscriptionForm from '../features/email-subscription-form';
import GHSponsor from '../features/gh-sponsor';
import SidebarSponsors from '../features/sidebar-sponsors';
import SidebarJobOffers from '../features/sidebar-job-offers';
import BuyMeACoffee from '../features/buy-me-a-coffee-button';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
}));

const ArticlesLayout = ({ article }) => {
  const classes = useStyles();
  return (
    <Container className={classes.root} component="main">
      <Grid container columnSpacing={6}>
        <Grid xs={12} md={8} component="article" item>
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
