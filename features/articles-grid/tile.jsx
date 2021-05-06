/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  CardContent,
  CardMedia,
  Card,
  Typography,
  CardActions,
  Chip,
  Box,
  CardActionArea,
  CardHeader,
  Link,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { nanoid } from "@reduxjs/toolkit";
import NextLink from "next/link";
import TextTruncate from "react-text-truncate";

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

const ArticleTile = ({ article }) => {
  const classes = useStyles();
  const author = article.author;
  const {
    tags,
    excerpt,
    thumbnail,
    content,
    slug,
    title,
    readingTime,
  } = article;
  return (
    <Card className={classes.root}>
      <NextLink href={`/episodes/${slug}`} passHref>
        <CardActionArea>
          <CardMedia className={classes.media} image={thumbnail.big} />
        </CardActionArea>
      </NextLink>
      <CardHeader
        disableTypography
        title={
          <NextLink passHref href={`/episodes/${slug}`}>
            <Link variant="h5">{title}</Link>
          </NextLink>
        }
        subheader={
          <>
            <Typography variant="subtitle1">
              {author}
              <Box>
                {tags.length ? (
                  <>
                    {tags.map((tag) => (
                      <Chip key={nanoid()} label={tag} />
                    ))}
                  </>
                ) : null}
              </Box>
            </Typography>
          </>
        }
      />
      <CardContent className={classes.content}>
        <Typography className={classes.excerpt}>
          <TextTruncate line={4} truncateText="…" text={excerpt} />
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <NextLink href={`/episodes/${slug}`} passHref>
          <Button variant="contained" color="primary">
            Read more
          </Button>
        </NextLink>
      </CardActions>
    </Card>
  );
};

export default ArticleTile;
