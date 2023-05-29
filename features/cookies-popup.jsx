import { Box, Button, Collapse, Typography, useTheme } from '@mui/material';
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
        height: { xs: '120px', md: '90px' },
        position: 'sticky',
        padding: { xs: '0 10px', md: '0' },
        bottom: 0,
        zIndex: '10000',
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        boxShadow: '0px -2px 3px rgba(0,0,0,0.2)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          minHeight: { xs: '120px', md: '90px' },
          alignItems: 'center',
          gap: '10px',
          justifyContent: 'space-evenly',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Typography sx={{ textAlign: 'center' }}>
          We use cookies to improve your experience on our site. To find out
          more, read our{' '}
          <CustomLink href="/privacy-policy">privacy policy.</CustomLink>
        </Typography>
        <Button variant="contained" color="primary" onClick={handleSetCookie}>
          I understand
        </Button>
      </Box>
    </Collapse>
  );
};

export default CookiesPopup;
