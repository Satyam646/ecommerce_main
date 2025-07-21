import React from 'react';
import { Stack, Typography, Divider, Box } from '@mui/material';
const Footer = () => (
  <Box
    component="footer"
    sx={{
      backgroundColor: '#333B6A',
      color: 'white',
      width: '100%',
      mt: '40px',
      py: { xs: 3, md: 4 },
      px: { xs: 2, md: 4 },
      textAlign: 'center',
      boxShadow: '0 -2px 12px rgba(0,0,0,0.4)',
    }}
  >
    <Stack spacing={1}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
        BookBecho
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.85 }}>
        Your trusted marketplace for buying books.
      </Typography>
      <Divider
        sx={{
          borderColor: 'rgba(255, 255, 255, 0.2)',
          my: 1,
          mx: 'auto',
          width: '50%',
        }}
      />
      <Typography variant="body2" sx={{ opacity: 0.75 }}>
        Contact: <a href="mailto:support@bookbecho.com" style={{ color: '#ffffff', textDecoration: 'underline' }}>
          support@bookbecho.com
        </a>{' '}
        | +917482990927
      </Typography>
      <Typography variant="caption" sx={{ opacity: 0.5 }}>
        &copy; {new Date().getFullYear()} Book Becho. All Rights Reserved.
      </Typography>
    </Stack>
  </Box>
);

export default Footer;

