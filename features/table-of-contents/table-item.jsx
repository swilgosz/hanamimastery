import React from 'react';

import { ListItemButton, ListItemText } from '@mui/material';
import CustomLink from '../custom-link';

const TableItem = ({ title, id, subheading }) => {
  return (
    <CustomLink href={`#${id}`}>
      <ListItemButton sx={[subheading && { pl: 4 }]}>
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
