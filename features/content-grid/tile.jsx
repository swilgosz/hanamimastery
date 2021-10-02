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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NextLink from "next/link";
import { useSelector } from "react-redux";
import TextTruncate from "react-text-truncate";
import { findAuthor } from "../../redux/slices/authors";
import TagList from "../tags/tag-list"

const useStyles = makeStyles((theme) => ({
  content: {
    display: "flex",
    flexDirection: "column",
  },
  media: {
    content: "",
    height: "auto",
    paddingBottom: "56.5%",
    backgroundPosition: "center",
    backgroundSize: "cover",
  },
  actions: {
    padding: theme.spacing(2),
    justifyContent: "flex-end",
  },
}));

const ContentTile = ({ item }) => {
  const classes = useStyles();
  const { author: authorName, tags, namespace, excerpt, thumbnail, slug, title } = item;
  const author = useSelector((state) => findAuthor(state, authorName));
  return (
    <Card className={classes.root}>
      <NextLink href={`/${namespace}/${slug}`} passHref>
        <CardActionArea>
          <CardMedia className={classes.media} image={thumbnail.big} />
        </CardActionArea>
      </NextLink>
      <CardHeader
        disableTypography
        title={
          <NextLink passHref href={`/${namespace}/${slug}`}>
            <Link variant="h5">{title}</Link>
          </NextLink>
        }
        subheader={
          <Typography variant="subtitle1">
            {author && author.name}
            <TagList tags={tags} />
          </Typography>
        }
      />
      <CardContent className={classes.content}>
        <Typography className={classes.excerpt}>
          <TextTruncate line={4} truncateText="…" text={excerpt} />
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <NextLink href={`/${namespace}/${slug}`} passHref>
          <Button variant="contained" color="primary">
            Read more
          </Button>
        </NextLink>
      </CardActions>
    </Card>
  );
};

export default ContentTile;
