import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  container: {
    paddingLeft: "4px",
    paddingRight: "0px",
  },
  hero: {
    backgroundSize: "cover",
    display: "flex",
    minHeight: theme.spacing(75),
    color: theme.palette.common.white,
  },
  heroFilter: {
    flexGrow: 1,
    backdropFilter: "brightness(0.35)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    fontSize: "2.125rem",
    fontWeight: "400",
    lineHeight: "1.235",
    letterSpacing: "0.00735em",
  },
}));
