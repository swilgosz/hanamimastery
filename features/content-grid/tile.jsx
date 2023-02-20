/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  CardContent,
  CardMedia,
  Card,
  Typography,
  CardActions,
  CardActionArea,
  CardHeader,
  Link,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NextLink from 'next/link';
import { useSelector } from 'react-redux';
import TextTruncate from 'react-text-truncate';
import { findAuthor } from '../../redux/slices/authors';
import TopicList from '../topics/topic-list';
import ProTag from '../content/pro-tag';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '0px',
  },
  media: {
    content: '',
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
  const {
    author: authorName,
    topics,
    path,
    excerpt,
    thumbnail,
    fullTitle,
  } = item;
  const author = useSelector((state) => findAuthor(state, authorName));
  const thumbnailUrl = variant === 'big' ? thumbnail.big : thumbnail.small;
  return (
    <Card className={classes.card}>
      <NextLink href={`/${path}`} passHref>
        <CardActionArea>
          <CardMedia className={classes.media} image={thumbnailUrl} />
        </CardActionArea>
      </NextLink>
      <CardHeader
        disableTypography
        title={
          <>
            <NextLink passHref href={`/${path}`}>
              <Link variant="h6">{fullTitle}</Link>
            </NextLink>
            <ProTag pro={item.premium} />
          </>
        }
        subheader={
          <Typography variant="subtitle1">
            {author && author.name}
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
        <NextLink href={`/${path}`} passHref>
          <Button variant="contained" color="primary">
            Read more
          </Button>
        </NextLink>
      </CardActions>
    </Card>
  );
};

export default ContentTile;
