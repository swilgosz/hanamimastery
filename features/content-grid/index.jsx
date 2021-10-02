import { Grid, makeStyles } from "@material-ui/core";
import ContentTile from "./tile";

const useStyles = makeStyles((theme) => ({
  list: {
    listStyle: "none",
    padding: theme.spacing(0, 4),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(0, 0),
    },


  },
}));

const ContentDisplay = (props) => {
  const classes = useStyles();
  const items = props.items;
  return (
    <Grid container component="ul" className={classes.list} spacing={6}>
      {items.map((item, index) => (
        <Grid
          key={item.id}
          item
          xs={12}
          md={index === 0 ? 12 : 6}
          component="li"
        >
          <ContentTile item={item} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ContentDisplay;
