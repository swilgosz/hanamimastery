import { Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

const CustomLink = ({ href, children, otherProps }) => (
  <MuiLink
    component={NextLink}
    href={href}
    {...otherProps}
    sx={{ textDecoration: 'none' }}
  >
    {children}
  </MuiLink>
);

export default CustomLink;
