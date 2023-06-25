import React from 'react';

import { ListItemButton, ListItemText } from '@mui/material';
import CustomLink from '../custom-link';

const TableItem = ({ title, id, subheading, url }) => {
  return (
    <CustomLink href={`${url}#${id}`} noUnderline>
      <ListItemButton
        sx={[
          (subheading && { p: '2px 2px 2px 32px' }) || {
            p: '2px 2px 2px 16px',
          },
        ]}
      >
        {(!subheading && (
          <ListItemText
            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 'bold' }}
            primary={title}
          />
        )) || (
          <ListItemText
            primaryTypographyProps={{ fontSize: '0.8rem' }}
            primary={title}
          />
        )}
      </ListItemButton>
    </CustomLink>
  );
};

export default TableItem;
