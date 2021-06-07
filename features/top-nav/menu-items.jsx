import NextLink from "next/link";
import MenuItem from "@material-ui/core/MenuItem";
import { nanoid } from "@reduxjs/toolkit";

const links = [
  { href: "/c/stray", label: "Stray" },
  { href: "/about", label: "About" },
  { href: "/sponsors", label: "Sponsors" },
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
