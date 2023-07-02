import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(5),
    maxWidth: '1920px',
  },
  hero: {
    backgroundSize: 'cover',
    display: 'flex',
    minHeight: theme.spacing(75),
    color: theme.palette.common.white,
  },
  heroFilterWrapper: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'brightness(0.35)',
    gap: 12,
  },
  heroTitle: {
    fontWeight: '400',
    padding: theme.spacing(2),
    lineHeight: '1.235',
    letterSpacing: '0.00735em',
  },
}));
