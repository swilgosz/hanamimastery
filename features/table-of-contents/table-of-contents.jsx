import { List } from '@mui/material';
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
          <>
            <TableItem
              title={heading.title}
              id={heading.id}
              key={heading.id}
              url={url}
            />
            {children.length >= 1 && (
              <List component="div" disablePadding>
                {children.map((subheading) => {
                  return (
                    <TableItem
                      title={subheading.title}
                      id={subheading.id}
                      subheading
                      url={url}
                    />
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
