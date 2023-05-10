import { Box, Link, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 32,
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'center',
        width: 1,
      }}
    >
      <Typography variant="caption">
        Copyright ©{' '}
        <Link href="https://github.com/walab-shiny" target="_blank" rel="noopener">
          와랩 샤이니
        </Link>{' '}
        {new Date().getFullYear()}. 배주영 송다빈 정석민
      </Typography>
    </Box>
  );
}
