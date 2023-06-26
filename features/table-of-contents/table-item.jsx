import React from 'react';

import { ListItemButton, ListItemText } from '@mui/material';
import CustomLink from '../custom-link';

const TableItem = ({ title, id, subheading }) => {
  return (
    <CustomLink href={`#${id}`} noUnderline>
      <ListItemButton
        sx={[
          (subheading && { p: '0 0 0 32px' }) || {
            p: '0 0 0 16px',
          },
        ]}
      >
        {(!subheading && (
          <ListItemText
            primaryTypographyProps={{
              fontSize: '0.9rem',
              fontWeight: 'bold',
            }}
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
