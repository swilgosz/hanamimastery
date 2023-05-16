import RssFeedIcon from '@mui/icons-material/RssFeed';
import { Button, MenuItem } from '@mui/material';
import CustomLink from '../custom-link';

const links = [
  {
    id: 1,
    href: 'https://pro.hanamimastery.com',
    label: 'GO PRO',
    highlight: 'true',
  },
  { id: 2, href: '/episodes', label: 'Episodes' },
  { id: 3, href: '/c/stray', label: 'Stray' },
  { id: 4, href: '/about', label: 'About' },
  { id: 5, href: '/collaboration', label: 'Collaboration' },
  { id: 6, href: '/sponsors', label: 'Sponsors' },
  { id: 7, href: '/feed', label: 'RSS', icon: '/rss-feed-icon.png' },
];

const MenuItems = () =>
  links.map(({ id, href, label, icon, highlight }) => {
    if (icon) {
      return (
        <CustomLink key={id} href={href}>
          <MenuItem>
            <RssFeedIcon />
          </MenuItem>
        </CustomLink>
      );
    }

    if (highlight) {
      return (
        <CustomLink key={id} href={href} noUnderline>
          <MenuItem>
            <Button variant="contained" color="primary">
              {label}
            </Button>
          </MenuItem>
        </CustomLink>
      );
    }
    return (
      <CustomLink key={id} href={href} noUnderline>
        <MenuItem sx={{ color: 'text.primary' }}>{label}</MenuItem>
      </CustomLink>
    );
  });

export default MenuItems;
