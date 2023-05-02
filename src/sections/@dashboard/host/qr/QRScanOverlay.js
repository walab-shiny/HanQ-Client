import { Box } from '@mui/material';

export default function QRScanOverlay() {
  return (
    <Box
      border="100px solid rgba(0, 0, 0, 0)"
      boxShadow="rgba(255, 0, 0, 0.5) 0px 0px 0px 5px inset"
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
