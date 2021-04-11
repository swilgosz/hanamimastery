import { useState, useEffect } from "react";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import { Close } from "@material-ui/icons";
import MenuItems from "./menu-items";

const MobileMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(Boolean(anchorEl));
  }, [anchorEl]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleMenu}
      >
        {open ? <Close /> : <MenuIcon />}
      </IconButton>
      <Menu
        id="simple-appbar"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        onClose={handleClose}
      >
        <MenuItems MenuItemProps={{ onClick: handleClose }} />
      </Menu>
    </>
  );
};

export default MobileMenu;
