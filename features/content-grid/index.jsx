import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';

import ContentTile from './tile';

const useStyles = makeStyles((theme) => ({
  list: {
    listStyle: 'none',
    padding: theme.spacing(0, 4, 4, 0),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(0, 0),
    },
  },
}));

const ContentDisplay = (props) => {
  const classes = useStyles();
  const { items, relatedContent } = props;
  return (
    <Grid container component="ul" className={classes.list} spacing={6}>
      {items.map((item, index) => (
        <Grid
          key={item.id}
          item
          xs={12}
          md={index === 0 && !relatedContent ? 12 : 6}
          component="li"
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
