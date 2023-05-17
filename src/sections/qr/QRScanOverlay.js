import { Box, alpha, useTheme } from '@mui/material';

export default function QRScanOverlay() {
  const { palette } = useTheme();
  const alphaColor = alpha(palette.background.paper, 0.5);

  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        zIndex: 1,
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        borderTop: `calc(50vh - 150px) solid ${alphaColor}`,
        borderBottom: `calc(50vh - 150px) solid ${alphaColor}`,
        borderLeft: `calc(50vw - 150px) solid ${alphaColor}`,
        borderRight: `calc(50vw - 150px) solid ${alphaColor}`,
        boxShadow: `${palette.primary.light} 0px 0px 0px 5px inset`,
      }}
    />
  );
}
