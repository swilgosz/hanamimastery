/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { makeStyles, useTheme } from '@mui/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import CustomLink from './custom-link';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const tutorialSteps = [
  // {
  //   label: 'DNSimple',
  //   url: 'https://dnsimple.com/opensource',
  //   imgPath: '/images/partners/dnsimple-logo-blue.png',
  // },
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
        <CustomLink href="/sponsors">
          <Button variant="contained" color="primary">
            See all sponsors
          </Button>
        </CustomLink>
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
