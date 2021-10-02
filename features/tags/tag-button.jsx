/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Chip, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {

  },
}));

export default function TagButton({tag}) {
  const classes = useStyles();
  const href = `/t/${tag}`;
  return (
    <Chip
      className={classes.root}
      label={tag}
      component='a'
      href={href}
      color="primary"
      size="small"
      variant="outlined"
      clickable
    />
  )
}
