/* eslint-disable jsx-a11y/anchor-is-valid */
import { makeStyles } from '@material-ui/core/styles';
import NextLink from 'next/link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Container, useMediaQuery, useTheme, Link } from '@material-ui/core';
import MobileMenu from './menu-mobile';
import DesktopMenu from './menu-desktop';

const useStyles = makeStyles(() => ({
  forkme: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

export default function MenuAppBar() {
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <>
      <AppBar color="inherit">
        <Toolbar
          className={classes.toolbar}
          component={(props) => <Container maxWidth="lg" {...props} />}
          variant="dense"
        >
          <NextLink href="/" passHref>
            <h3>HanamiMastery</h3>
          </NextLink>
          {isDesktop ? <DesktopMenu /> : <MobileMenu />}
        </Toolbar>
      </AppBar>
      <Toolbar variant="dense" />
    </>
  );
}
