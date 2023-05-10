import { Box, Button, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import CustomLink from './custom-link';

const useStyles = makeStyles(() => ({
  root: {
    margin: '25px 0',
    padding: '10px',
    backgroundColor: 'rgb(245,245,245)',
  },
}));

export default function CourseAd({ BoxProps = {}, size = 'big', bg }) {
  const classes = useStyles();

  return (
    <Grid
      className={classes.root}
      spacing={3}
      container
      component={(props) => (
        <Box
          {...BoxProps}
          {...props}
          bgcolor={bg || ''}
          width="100%!important"
        />
      )}
    >
      <Grid
        item
        xs={12}
        md={6}
        component="img"
        src="/rails-rest-api.jpg"
        alt="Rails api thumbnail"
      />
      <Grid item xs={12} md={6}>
        <Typography className={classes.header} variant="h5">
          Ruby On Rails REST API
        </Typography>
        <Typography variant={size === 'small' ? 'subtitle2' : 'h6'}>
          The complete guide
        </Typography>
        <p className={size === 'small' ? 'is-size-6' : 'is-size-3'}>
          Create professional API applications that you can hook anything into!
          Learn how to code like professionals using Test Driven Development!
        </p>
        <CustomLink href="https://www.udemy.com/ruby-on-rails-api-the-complete-guide/?couponCode=DGLWEB">
          <Button
            variant="contained"
            color="primary"
            size={size === 'small' ? 'medium' : 'large'}
            target="_blank"
            rel="noreferrer"
          >
            Take this course!
          </Button>
        </CustomLink>
      </Grid>
    </Grid>
  );
}
