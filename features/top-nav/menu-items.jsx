import NextLink from "next/link";
import MenuItem from "@material-ui/core/MenuItem";
import { nanoid } from "@reduxjs/toolkit";
import RssFeedIcon from '@material-ui/icons/RssFeed';

const links = [
  { href: "/episodes", label: "Episodes" },
  { href: "/c/stray", label: "Stray" },
  { href: "/about", label: "About" },
  { href: "/collaboration", label: "Collaboration" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/feed", label: "RSS", icon: '/rss-feed-icon.png' }
];

const MenuItems = ({ MenuItemProps = {} }) =>
  links.map(({ href, label, icon }) => {
    if (icon) {
      return (
        <NextLink key={nanoid()} href={href}>
          <MenuItem {...MenuItemProps}>
            <RssFeedIcon />
          </MenuItem>
        </NextLink>
      );
    }
    return (
      <NextLink key={nanoid()} href={href}>
        <MenuItem {...MenuItemProps}>
          {label}
        </MenuItem>
      </NextLink>
    )
  });

export default MenuItems;
