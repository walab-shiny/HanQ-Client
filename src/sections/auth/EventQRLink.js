import { useState } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import Iconify from '../../components/iconify/Iconify';
import { checkEventPassword } from '../../apis/event.ts';
import { QRScan } from '../qr';

export default function EventQRLink() {
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState();
  const [eventCode, setEventCode] = useState('');
  const [password, setPassword] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [qr, setQr] = useState(false);
  const handleOpenQr = () => setQr(true);
  const handleCloseQr = () => setQr(false);

  const checkPassword = async () => {
    try {
      const response = await checkEventPassword(eventCode, password);

      if (response.result === true) {
        const eventData = response.event;
        setEvent(eventData);
        handleOpenQr();
        handleClose();
      } else {
        alert('비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      alert('이벤트 정보가 틀립니다.');
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={handleOpen} endIcon={<Iconify icon="eva:external-link-outline" />}>
        로그인 없이 출석 QR 스캔 페이지 열기 (주최자 전용)
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>로그인 없이 출석 QR 스캔 페이지 열기</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            주최 이벤트 목록 페이지에서 이벤트 코드를 확인할 수 있습니다.
          </DialogContentText>
          <TextField
            value={eventCode}
            onChange={(e) => setEventCode(e.target.value)}
            fullWidth
            placeholder="이벤트 코드 6글자를 입력하세요."
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            placeholder="비밀번호를 입력하세요."
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            취소
          </Button>
          <Button onClick={checkPassword} variant="contained">
            이동하기
          </Button>
        </DialogActions>
      </Dialog>
      {event && <QRScan event={event} open={qr} onClose={handleCloseQr} />}
    </>
  );
}
