import { Grid, Container, makeStyles } from '@material-ui/core';
import EmailSubscriptionForm from '../features/email-subscription-form';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
}));

const ArticleLayout = ({ aside, article }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      className={classes.root}
      component={(props) => (
        <Container maxWidth="lg" component="main" {...props} />
      )}
    >
      <Grid item xs={12} md={8} component="article">
        {article}
      </Grid>
      <Grid item xs={12} md={4}>
        <EmailSubscriptionForm />
      </Grid>
    </Grid>
  );
};

export default ArticleLayout;
