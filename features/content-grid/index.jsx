import { Grid } from '@mui/material';

import ContentTile from './tile';

const ContentDisplay = (props) => {
  const { items, relatedContent } = props;
  return (
    <Grid container spacing={3}>
      {items.map((item, index) => (
        <Grid
          key={item.id}
          xs={12}
          md={index === 0 && !relatedContent ? 12 : 6}
          sx={{ padding: 3 }}
        >
          <ContentTile
            item={item}
            variant={index === 0 && !relatedContent ? 'big' : 'small'}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ContentDisplay;
