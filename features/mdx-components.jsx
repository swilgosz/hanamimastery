import {
  Typography,
  Chip,
  Link,
  makeStyles,
  createStyles,
  withTheme,
  Grid,
  withStyles,
} from "@material-ui/core";
import NextLink from "next/link";
import CourseAd from "./course-ad";
import EmailSubscriptionForm from "./email-subscription-form/index";
import YoutubeEmbed from "./youtube-embed";
import GHSponsor from "./gh-sponsor";

const CustomChip = withTheme(
  withStyles((theme) => ({
    root: {
      backgroundColor: "transparent",
      boxShadow: `inset 0 -1px 0 ${theme.palette.grey[400]}`,
      borderRadius: `${theme.spacing(0.75)}px`,
      padding: `${theme.spacing(3 / 8)}px ${theme.spacing(5 / 8)}px`,
      border: `1px solid ${theme.palette.grey[400]}`,
      lineHeight: `${theme.spacing(10 / 8)}px`,
      fontSize: `11px`,
    },
    labelSmall: {
      padding: 0,
    },
  }))(Chip)
);
const Kbd = ({ children }) => <CustomChip size="small" label={children} />;

const useImageStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    image: {
      maxWidth: "100%",
      margin: `0 auto ${theme.spacing(1.25)}px auto`,
      borderRadius: `${theme.spacing(1)}px`,
    },
    caption: {
      fontWeight: "lighter",
      fontSize: "16px",
      lineHeight: "20px",
      color: theme.palette.grey[600],
      textAlign: "center",
    },
  })
);
const CustomImage = ({ src, alt }) => {
  const classes = useImageStyles();
  return (
    <span className={classes.wrapper}>
      <img src={src} alt={alt} className={classes.image} />
      <Typography variant="h5" className={classes.caption} component="span">
        {alt}
      </Typography>
    </span>
  );
};

const CustomLink = (props) => {
  const { href } = props;
  const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));

  if (isInternalLink) {
    return (
      <NextLink href={href} passHref>
        <Link {...props} />
      </NextLink>
    );
  }

  return <Link target="_blank" {...props} />;
};

const useHeaderStyles = makeStyles(() =>
  createStyles({
    root: {
      marginTop: "40px",
      marginBottom: "20px",
      scrollMarginTop: "100px",
      scrollSnapMargin: "100px", // Safari
      // '&[id]': {
      //   pointerEvents: 'none',
      // },
      "&[id]:before": {
        display: "block",
        height: " 6rem",
        marginTop: "-6rem",
        visibility: "hidden",
        content: `""`,
      },
      "&[id]:hover a": { opacity: 1 },
    },
    anchor: {
      fontWeight: "normal",
      marginLeft: "0.375rem",
      opacity: "0",
      "&:focus": {
        opacity: 1,
        boxShadow: "outline",
      },
    },
  })
);

const CustomHeader = ({ variant, children, id, ...props }) => {
  const classes = useHeaderStyles();
  return (
    <Typography
      className={classes.root}
      variant={variant}
      id={id}
      gutterBottom
      {...props}
    >
      {children}
      {id && (
        <Link
          className={classes.anchor}
          color="primary"
          aria-label="anchor"
          href={`#${id}`}
        >
          #
        </Link>
      )}
    </Typography>
  );
};
const Om = ({ om }) => <div id={om} />;

const MDXComponents = {
  h1: (props) => <CustomHeader variant="h2" component="h1" my={4} {...props} />,
  h2: (props) => <CustomHeader variant="h3" {...props} />,
  h3: (props) => <CustomHeader variant="h4" {...props} />,
  h4: (props) => <CustomHeader variant="h5" {...props} />,
  h5: (props) => <CustomHeader variant="h6" {...props} />,
  h6: (props) => <CustomHeader variant="h6" {...props} />,
  p: (props) => <Typography {...props} paragraph />,
  li: (props) => <Typography {...props} component="li" />,
  kbd: (props) => <Kbd {...props} />,
  a: CustomLink,
  img: (props) => <CustomImage {...props} />,
  CourseAd,
  EmailSubscriptionForm,
  Om,
  Grid,
  Typography,
  YoutubeEmbed,
  GHSponsor,
};

export default MDXComponents;
