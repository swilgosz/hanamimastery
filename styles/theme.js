import { createTheme } from '@mui/material';

export default createTheme({
  palette: {
    primary: {
      main: '#CB4426',
    },
  },

  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginTop: '2rem',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginTop: '1.5rem',
    },
    h4: {
      fontSize: '1.3rem',
    },
    h5: {
      fontSize: '1.2rem',
    },
    h6: {
      fontSize: '1.1rem',
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
