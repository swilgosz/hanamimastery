import { Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

const muiLinkStyles = {
  '&:hover': {
    textDecoration: 'none',
  },
};

const CustomLink = ({ href, children, noUnderline, otherProps }) => (
  <MuiLink
    component={NextLink}
    href={href}
    {...otherProps}
    sx={noUnderline && muiLinkStyles}
  >
    {children}
  </MuiLink>
);

export default CustomLink;
