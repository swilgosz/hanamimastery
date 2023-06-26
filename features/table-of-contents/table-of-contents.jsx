import { List } from '@mui/material';
import React from 'react';
import TableItem from './table-item';

const TableOfContents = ({ url, headings }) => {
  return (
    <List
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        borderTop: '2px solid',
        borderColor: 'primary.main',
        display: { xs: 'none', lg: 'block' },
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {headings.map((heading) => {
        const { children } = heading;
        return (
          <React.Fragment key={`heading-${heading.id}`}>
            <TableItem
              title={heading.title}
              key={`key-${heading.id}`}
              id={`${heading.id}`}
              url={url}
            />
            {children.length >= 1 && (
              <List component="div" disablePadding>
                {children.map((subheading) => {
                  return (
                    <React.Fragment key={`subheading-${subheading.id}`}>
                      <TableItem
                        title={subheading.title}
                        id={subheading.id}
                        key={`key-${subheading.id}`}
                        subheading
                        url={url}
                      />
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default TableOfContents;
