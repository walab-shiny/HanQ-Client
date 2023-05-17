import PropTypes from 'prop-types';
import { Button, Tooltip } from '@mui/material';
import { useState } from 'react';
// components
import { QRScan } from '../../qr';

QRScanModal.propTypes = {
  event: PropTypes.object,
  disabled: PropTypes.bool,
};

export default function QRScanModal({ event, disabled }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title={disabled ? '이벤트가 진행 중이 아닙니다.' : '출석 QR 스캔 페이지 열기'}>
        <span>
          <Button size="small" variant="contained" color="success" onClick={handleOpen} disabled={disabled}>
            QR
          </Button>
        </span>
      </Tooltip>
      <QRScan event={event} open={open} onClose={handleClose} />
    </>
  );
}
