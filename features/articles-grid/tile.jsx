import {
  Button,
  CardContent,
  CardMedia,
  Card,
  Typography,
  CardActions,
  Chip,
  Box,
  CardActionArea,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import NextLink from 'next/link';
import readingTime from 'reading-time';
import TextTruncate from 'react-text-truncate';
import { findAuthor } from '../../redux/slices/authors';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    maxHeight: theme.spacing(70),
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      maxHeight: theme.spacing(40),
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  excerpt: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxHeight: `${theme.typography.body1.lineHeight * 3}rem`,
  },
  media: {
    content: '',
    height: 'auto',
    paddingBottom: '56.5%',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    [theme.breakpoints.up('sm')]: {
      width: '33%',
      paddingRight: '35%',
    },
  },
  actions: {
    justifySelf: 'flex-end',
  },
}));

const ArticleTile = ({ article }) => {
  const classes = useStyles();
  const author = useSelector((state) =>
    findAuthor(state, article.relationships.author.data.id)
  );
  const {
    attributes: { tags, excerpt, thumbnail, content, slug, title },
  } = article;
  return (
    <NextLink href={`/blog/${slug}`} passHref>
      <CardActionArea>
        <Card className={classes.root}>
          <CardMedia className={classes.media} image={thumbnail.medium} />
          <CardContent className={classes.content}>
            <Typography variant="subtitle1">
              {author.attributes.fullName}{' '}
            </Typography>
            <Box>
              {tags.length ? (
                <>
                  {tags.map((tag) => (
                    <Chip label={tag} />
                  ))}
                </>
              ) : null}
            </Box>
            <Typography variant="h5">{title}</Typography>
            <Typography variant="subtitle2">
              {readingTime(content).text}
            </Typography>
            <Typography className={classes.excerpt}>
              <TextTruncate line={4} truncateText="…" text={excerpt} />
              {excerpt}
            </Typography>
            <CardActions className={classes.actions}>
              <NextLink href={`/blog/${slug}`} passHref>
                <Button color="primary">Read more</Button>
              </NextLink>
            </CardActions>
          </CardContent>
        </Card>
      </CardActionArea>
    </NextLink>
  );
};

export default ArticleTile;
