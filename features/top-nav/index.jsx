/* eslint-disable jsx-a11y/anchor-is-valid */
import { makeStyles } from '@mui/styles';
import {
  Container,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
} from '@mui/material';
import MobileMenu from './menu-mobile';
import DesktopMenu from './menu-desktop';
import CustomLink from '../custom-link';

const useStyles = makeStyles(() => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '56px',
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
          component={(props) => <Container {...props} />}
          variant="dense"
        >
          <CustomLink href="/">
            <h3>HanamiMastery</h3>
          </CustomLink>
          {isDesktop ? <DesktopMenu /> : <MobileMenu />}
        </Toolbar>
      </AppBar>
      <Toolbar variant="dense" />
    </>
  );
}
