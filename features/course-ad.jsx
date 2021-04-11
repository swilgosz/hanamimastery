import { Box, Button, Grid, Typography, makeStyles } from '@material-ui/core';
import NextLink from 'next/link';

const useStyles = makeStyles((theme) => ({
  linkButton: {
    color: theme.palette.common.white,
  },
}));

export default function CourseAd({ BoxProps = {}, size = 'big', bg }) {
  const classes = useStyles();
  return (
    <Grid
      spacing={3}
      container
      component={(props) => <Box {...BoxProps} {...props} bgcolor={bg || ''} />}
    >
      <Grid
        item
        xs={6}
        component="img"
        src="/rails-rest-api.jpg"
        alt="Rails api thumbnail"
      />
      <Grid item xs={6}>
        <Typography variant="h4">Ruby On Rails REST API</Typography>
        <Typography variant={size === 'small' ? 'subtitle2' : 'h6'}>
          The complete guide
        </Typography>
        <p className={size === 'small' ? 'is-size-6' : 'is-size-3'}>
          Create professional API applications that you can hook anything into!
          Learn how to code like professionals using Test Driven Development!
        </p>
        <NextLink
          href="https://www.udemy.com/ruby-on-rails-api-the-complete-guide/?couponCode=DGLWEB"
          passHref
        >
          <Button
            className={classes.linkButton}
            variant="contained"
            color="primary"
            size={size === 'small' ? 'medium' : 'large'}
            target="_blank"
            rel="noreferrer"
          >
            Take this course!
          </Button>
        </NextLink>
      </Grid>
    </Grid>
  );
}
