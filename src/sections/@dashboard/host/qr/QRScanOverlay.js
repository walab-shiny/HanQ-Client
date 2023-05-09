import { Box, useTheme } from '@mui/material';

export default function QRScanOverlay() {
  const { palette } = useTheme();

  return (
    <Box
      border={`56px solid ${palette.background.paper}`}
      boxShadow={`${palette.primary.light} 0px 0px 0px 5px inset`}
      sx={{
        top: 0,
        left: 0,
        zIndex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}
    />
  );
}
