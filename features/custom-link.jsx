import { Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

const muiLinkStyles = {
  '&:hover': {
    textDecoration: 'none',
  },
};

const headerLink = {
  color: '#000000',
};

const CustomLink = ({ href, children, noUnderline, otherProps, header }) => {
  return (
    <MuiLink
      component={NextLink}
      href={href}
      {...otherProps}
      sx={(noUnderline && muiLinkStyles) || (header && headerLink)}
    >
      {children}
    </MuiLink>
  );
};

export default CustomLink;
