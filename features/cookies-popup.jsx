import { Button, Collapse, Grid, Typography, useTheme } from '@mui/material';
import CustomLink from './custom-link';
import { useCookiesCheck } from '../hooks/useCookiesCheck';

const CookiesPopup = () => {
  const [checked, { handleSetCookie }] = useCookiesCheck();
  const theme = useTheme();

  return (
    <Collapse
      in={!checked}
      sx={{
        width: '100%',
        position: 'sticky',
        padding: { xs: '10px', md: '0' },
        bottom: 0,
        zIndex: '100000',
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0px -2px 3px rgba(0,0,0,0.2)',
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        height="90px"
      >
        <Grid container item xs={12} md={8} justifyContent="center">
          <Typography textAlign="center">
            We use cookies to improve your experience on our site. To find out
            more, read our
            <CustomLink href="/privacy-policy"> privacy policy.</CustomLink>
          </Typography>
        </Grid>
        <Grid container item xs={12} md={4} justifyContent="center">
          <Button variant="contained" color="primary" onClick={handleSetCookie}>
            I understand
          </Button>
        </Grid>
      </Grid>
    </Collapse>
  );
};

export default CookiesPopup;
