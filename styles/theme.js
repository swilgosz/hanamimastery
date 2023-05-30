import { createTheme } from '@mui/material';

export default createTheme({
  palette: {
    primary: {
      main: '#CB4426',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1280,
      xl: 1536,
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          ':hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
  overrides: {
    MuiButton: {
      containedPrimary: { color: '#fff' },
    },
    MuiCssBaseline: {
      '@global': {
        html: {
          WebkitFontSmoothing: 'auto',
        },
      },
    },
  },
});
