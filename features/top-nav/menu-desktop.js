import { makeStyles } from "@material-ui/core/styles";
import { MenuList } from "@material-ui/core";
import MenuItems from "./menu-items";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    padding: 0,
    minHeight: theme.spacing(6),
  },
}));

const DesktopMenu = () => {
  const classes = useStyles();
  return (
    <MenuList className={classes.root}>
      <MenuItems />
    </MenuList>
  );
};

export default DesktopMenu;
