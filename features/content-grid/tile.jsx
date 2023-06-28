/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  CardContent,
  CardMedia,
  Card,
  Typography,
  CardActions,
  CardActionArea,
  CardHeader,
  Button,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import TextTruncate from 'react-text-truncate';
import TopicList from '../topics/topic-list';
import ProTag from '../content/pro-tag';
import CustomLink from '../custom-link';

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    paddingTop: '0px',
    height: '100%',
  },
  media: {
    height: 'auto',
    paddingBottom: '56.5%',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  },
  actions: {
    padding: theme.spacing(2),
    justifyContent: 'flex-end',
  },
}));

const ContentTile = ({ item, variant }) => {
  const classes = useStyles();
  const { topics, path, excerpt, thumbnail, fullTitle } = item;
  const thumbnailUrl = variant === 'big' ? thumbnail.big : thumbnail.small;
  return (
    <Card className={classes.card}>
      <CustomLink href={`/${path}`}>
        <CardActionArea>
          <CardMedia className={classes.media} image={thumbnailUrl} />
        </CardActionArea>
      </CustomLink>
      <CardHeader
        titleTypographyProps={{ sx: { fontWeight: '100' } }}
        title={
          <>
            <CustomLink href={`/${path}`}>{fullTitle}</CustomLink>
            <ProTag pro={item.premium} />
          </>
        }
        subheader={
          <Typography variant="subtitle1">
            <TopicList topics={topics} />
          </Typography>
        }
      />
      <CardContent className={classes.content}>
        <Typography className={classes.excerpt}>
          <TextTruncate
            element="span"
            line={4}
            truncateText="…"
            text={excerpt}
          />
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <CustomLink href={`/${path}`}>
          <Button variant="contained" color="primary">
            Read more
          </Button>
        </CustomLink>
      </CardActions>
    </Card>
  );
};

export default ContentTile;
