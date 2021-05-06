/* eslint-disable jsx-a11y/anchor-is-valid */
import { Typography, Card, CardContent, CardHeader } from "@material-ui/core";
import { Grid, Container, makeStyles } from "@material-ui/core";
import EmailSubscriptionForm from "../features/email-subscription-form";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  card: {
    [theme.breakpoints.down("md")]: {
      margin: theme.spacing(0, 4),
    },
  },
}));

const ArticleLayout = ({ article }) => {
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
          <Card className={classes.card}>
            <CardHeader
              disableTypography
              title={
                <Typography variant="h4">
                  Sponsor this project on Github!
                </Typography>
              }
              subheader={
                <Typography variant="subtitle1">
                  10% of all your support goes to Hanami development support
                </Typography>
              }
            />
            <CardContent>
              <Typography>
                <iframe
                  src="https://ghbtns.com/github-btn.html?user=swilgosz&type=sponsor"
                  frameBorder="0"
                  scrolling="0"
                  width="150"
                  height="20"
                  title="GitHub"
                />
              </Typography>
            </CardContent>
          </Card>
          <EmailSubscriptionForm />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ArticleLayout;
