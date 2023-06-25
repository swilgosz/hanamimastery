import { useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from '@mui/material';

const TableOfContents = ({ headings }) => {
  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Table of Contents
        </ListSubheader>
      }
    >
      {headings.map((heading) => {
        const { children } = heading;
        return (
          <>
            <ListItemButton>
              <ListItemText primary={heading.title} />
            </ListItemButton>
            {children.length >= 1 && (
              <List component="div" disablePadding>
                {children.map((subheading) => {
                  return (
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemText primary={subheading.title} />
                    </ListItemButton>
                  );
                })}
              </List>
            )}
          </>
        );
      })}
    </List>
  );
};

export default TableOfContents;
