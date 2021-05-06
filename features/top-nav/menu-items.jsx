import NextLink from "next/link";
import MenuItem from "@material-ui/core/MenuItem";
import { nanoid } from "@reduxjs/toolkit";

const links = [
  { href: "/about", label: "About" },
  { href: "https://github.com/sponsors/swilgosz", label: "Github Sponsors" },
];

const MenuItems = ({ MenuItemProps = {} }) =>
  links.map(({ href, label }) => (
    <NextLink href={href}>
      <MenuItem key={nanoid()} {...MenuItemProps}>
        {label}
      </MenuItem>
    </NextLink>
  ));

export default MenuItems;
