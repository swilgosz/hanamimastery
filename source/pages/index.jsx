import {
  Box,
  Button,
  Container,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { NextSeo } from 'next-seo';
import NextLink from 'next/link';
import CourseAd from '../features/course-ad';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    padding: 0,
    minHeight: theme.spacing(6),
  },
  hero: {
    backgroundSize: 'cover',
    display: 'flex',
    minHeight: theme.spacing(75),
    color: theme.palette.common.white,
  },
  heroFilter: {
    flexGrow: 1,
    backdropFilter: 'brightness(0.35)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
      alignItems: 'flex-end',
    },
  },
}));

export default function Home() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const classes = useStyles();
  return (
    <>
      <NextSeo
        title="Driggl - Modern web development"
        description="Build modern websites like a professional with Driggl Community!"
        article={{ authors: ['Driggl - https://driggl.com'] }}
        openGraph={{
          type: 'website',
          title: 'Driggl - Modern web development',
          description:
            'Build modern websites like a professional with Driggl Community!',
          images: ['/home-cover.jpg'],
        }}
      />
      <Container maxWidth="xl" component="main" disableGutters>
        <section
          className={classes.hero}
          style={{ backgroundImage: `url("/home-cover.jpg")` }}
        >
          <div className={classes.heroFilter}>
            <Typography
              variant="h4"
              className="title"
              align={isDesktop ? 'inherit' : 'center'}
              gutterBottom
            >
              Wanna be a developer?
            </Typography>
            <NextLink href="#courses" passHref>
              <Button size="large" variant="contained" color="primary">
                Check out our courses!
              </Button>
            </NextLink>
          </div>
        </section>
        <Box px={3} py={12} component="section" textAlign="center">
          <Typography variant="h4" align="center" gutterBottom>
            Experienced & Trusted by{' '}
            <Typography variant="inherit" component="strong" color="primary">
              1000+
            </Typography>{' '}
            People worldwide
          </Typography>
          <Button
            href="https://www.udemy.com/ruby-on-rails-api-the-complete-guide/?couponCode=DGLWEB"
            size="large"
            variant="contained"
            color="primary"
          >
            Start learning now!
          </Button>
        </Box>
        <CourseAd
          BoxProps={{ id: 'courses', component: 'section', px: 3, py: 6 }}
        />
        <Box px={3} py={12} component="section" textAlign="center">
          <Typography variant="h4" align="center" gutterBottom>
            Not sure if it&apos;s for you?
          </Typography>
          <Typography variant="h5" paragraph>
            No worries, we offer{' '}
            <Typography variant="inherit" component="strong" color="primary">
              30-day
            </Typography>{' '}
            money-back!
          </Typography>
          <Button
            href="https://www.udemy.com/ruby-on-rails-api-the-complete-guide/?couponCode=DGLWEB"
            size="large"
            variant="contained"
            color="primary"
          >
            Check it out!
          </Button>
        </Box>
      </Container>
    </>
  );
}
