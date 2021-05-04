import NextLink from 'next/link';
import MenuItem from '@material-ui/core/MenuItem';

const links = [
  { href: '/about', label: 'About' },
  // { href: '/#courses', label: 'Courses' },
  { href: 'https://github.com/sponsors/swilgosz', label: 'Github Sponsors' },
];

const MenuItems = ({ MenuItemProps = {} }) =>
  links.map(({ href, label }) => (
    <NextLink href={href}>
      <MenuItem {...MenuItemProps}>{label}</MenuItem>
    </NextLink>
  ));

export default MenuItems;
