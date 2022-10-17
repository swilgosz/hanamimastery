/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Chip, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  protag: {
    marginLeft: '5px',
    padding: '0',
    backgroundColor: 'primary',
  }
}));

const ProTag = ({pro}) => {
  const classes = useStyles();
  if (!pro) {
    return '';
  } else {
    return(
      <Chip
        className={classes.protag}
        label="PRO"
        color="primary"
        component="a"
        href="https://pro.hanamimastery.com"
        target="_blank"
        // variant="filled"
        clickable
      />
    );
  }
}

export default ProTag;
