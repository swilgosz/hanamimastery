import { makeStyles } from '@mui/styles';
import { MenuList } from '@mui/material';
import MenuItems from './menu-items';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
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
