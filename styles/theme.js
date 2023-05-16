import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    primary: {
      main: '#CB4426',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        maxWidth: 1280,
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
