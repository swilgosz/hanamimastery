import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  container: {
    paddingLeft: '4px',
    paddingRight: '0px',
  },
  article: {
    marginBottom: '100px',
  },
  hero: {
    backgroundSize: 'cover',
    display: 'flex',
    minHeight: theme.spacing(75),
    color: theme.palette.common.white,
    overflow: 'hidden',
  },
  heroFilterWrapper: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'brightness(0.35)',
  },
  heroTitle: {
    fontWeight: '400',
    padding: theme.spacing(2),
    fontSize: '2.125rem',
    lineHeight: '1.235',
    letterSpacing: '0.00735em',
  },
  heroSubtitle: {
    // padding: theme.spacing(2),
    fontSize: '1.125rem',
    fontWeight: '400',
    lineHeight: '1.0',
    letterSpacing: '0.00735em',
  },
}));
