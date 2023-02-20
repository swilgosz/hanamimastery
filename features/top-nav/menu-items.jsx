import NextLink from 'next/link';
import MenuItem from '@material-ui/core/MenuItem';
import { nanoid } from '@reduxjs/toolkit';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import { Button } from '@material-ui/core';

const links = [
  { href: 'https://pro.hanamimastery.com', label: 'GO PRO', highlight: 'true' },
  { href: '/episodes', label: 'Episodes' },
  { href: '/c/stray', label: 'Stray' },
  { href: '/about', label: 'About' },
  { href: '/collaboration', label: 'Collaboration' },
  { href: '/sponsors', label: 'Sponsors' },
  { href: '/feed', label: 'RSS', icon: '/rss-feed-icon.png' },
];

const MenuItems = ({ MenuItemProps = {} }) =>
  links.map(({ href, label, icon, highlight }) => {
    if (icon) {
      return (
        <NextLink key={nanoid()} href={href} shallow passHref>
          <MenuItem {...MenuItemProps}>
            <RssFeedIcon />
          </MenuItem>
        </NextLink>
      );
    }

    if (highlight) {
      return (
        <NextLink key={nanoid()} href={href}>
          <MenuItem variant="">
            <Button variant="contained" color="primary">
              {label}
            </Button>
          </MenuItem>
        </NextLink>
      );
    }
    return (
      <NextLink key={nanoid()} href={href}>
        <MenuItem variant="">{label}</MenuItem>
      </NextLink>
    );
  });

export default MenuItems;
