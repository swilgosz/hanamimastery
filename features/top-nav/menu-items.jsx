import NextLink from "next/link";
import MenuItem from "@material-ui/core/MenuItem";
import { nanoid } from "@reduxjs/toolkit";
import RssFeedIcon from '@material-ui/icons/RssFeed';

const links = [
  { href: "/c/stray", label: "Stray" },
  { href: "/about", label: "About" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/feed", label: "RSS", icon: '/rss-feed-icon.png'}
];

const MenuItems = ({ MenuItemProps = {} }) =>
  links.map(({ href, label, icon }) => {
    if (icon) {
      return (
        <NextLink href={href}>
          <MenuItem key={nanoid()} {...MenuItemProps}>
            <RssFeedIcon />
          </MenuItem>
      </NextLink>
      );
    }
    return (
      <NextLink href={href}>
        <MenuItem key={nanoid()} {...MenuItemProps}>
          {label}
        </MenuItem>
      </NextLink>
    )
  });

export default MenuItems;
