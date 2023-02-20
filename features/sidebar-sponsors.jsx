/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import NextLink from 'next/link';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const tutorialSteps = [
  {
    label: 'DNSimple',
    url: 'https://dnsimple.com/opensource',
    imgPath: '/images/partners/dnsimple-logo-blue.png',
  },
  {
    label: 'AscendaLoyalty',
    url: 'https://ascendaloyalty.com',
    imgPath: '/images/partners/Ascenda-mainlogo.png',
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    maxWidth: 460,
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    // height: 50,
    // paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    // height: 255,
    display: 'block',
    maxWidth: 460,
    overflow: 'hidden',
    width: '100%',
  },
  centered: {
    textAlign: 'center',
    // alignItems: "center",
    // display: "flex",
  },
}));

function SidebarSponsors() {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tutorialSteps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <div className={classes.root}>
      <Paper square elevation={0} className={classes.header}>
        <Typography variant="h5" gutterBottom>
          Trusted & Supported by
        </Typography>
      </Paper>
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {tutorialSteps.map((step, index) => (
          <div key={step.label}>
            {Math.abs(activeStep - index) <= 2 ? (
              <a href={step.url} target="_blank_" rel="sponsored">
                <img
                  className={classes.img}
                  src={step.imgPath}
                  alt={step.label}
                />
              </a>
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <Typography className={classes.centered}>
        <NextLink href="/sponsors" passHref>
          <Button variant="contained" color="primary">
            See all sponsors
          </Button>
        </NextLink>
      </Typography>
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
    </div>
  );
}

export default SidebarSponsors;
