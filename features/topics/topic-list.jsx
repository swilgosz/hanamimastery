/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
/* eslint-disable jsx-a11y/anchor-is-valid */
import TopicButton from "./topic-button"
import { Box, makeStyles } from "@material-ui/core";
import { nanoid } from "@reduxjs/toolkit";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    // justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function TopicList({ topics }) {
  const displayedTopics = topics.slice(0, 3);
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {displayedTopics.length
        ? displayedTopics.map((topic) => <TopicButton key={nanoid()} topic={topic}/>)
        : null}
    </Box>
  )
}
