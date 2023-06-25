import { List } from '@mui/material';
import TableItem from './table-item';

const TableOfContents = ({ headings }) => {
  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {headings.map((heading) => {
        const { children } = heading;
        return (
          <>
            <TableItem title={heading.title} id={heading.id} key={heading.id} />
            {children.length >= 1 && (
              <List component="div" disablePadding>
                {children.map((subheading) => {
                  return (
                    <TableItem
                      title={subheading.title}
                      id={subheading.id}
                      subheading
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
