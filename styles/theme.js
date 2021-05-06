import { createMuiTheme } from "@material-ui/core";
import { orange } from "@material-ui/core/colors";

export default createMuiTheme({
  palette: {
    primary: {
      main: "#CB4426",
    },
  },
  overrides: {
    MuiButton: {
      containedPrimary: { color: "#fff" },
    },
    MuiCssBaseline: {
      "@global": {
        html: {
          WebkitFontSmoothing: "auto",
        },
      },
    },
  },
});
