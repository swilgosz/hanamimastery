import { Grid } from '@mui/material';

import ContentTile from './tile';

const ContentDisplay = (props) => {
  const { items, relatedContent } = props;
  return (
    <Grid container spacing={6}>
      {items.map((item, index) => (
        <Grid
          item
          key={item.id}
          xs={12}
          md={index === 0 && !relatedContent ? 12 : 6}
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
