import { useState } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import Iconify from '../../components/iconify/Iconify';

export default function EventQRLink() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleOpen} endIcon={<Iconify icon="eva:external-link-outline" />}>
        이벤트 출석 QR 스캔 페이지 이동
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>QR 스캔 페이지로 이동하기</DialogTitle>
        <DialogContent>
          <DialogContentText mb={3}>주최 이벤트 상세 페이지에서 이벤트 코드를 확인하세요.</DialogContentText>
          <TextField sx={{ mb: 1 }} fullWidth placeholder="이벤트 코드" size="small" />
          <TextField fullWidth placeholder="이벤트 비밀번호" size="small" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            취소
          </Button>
          <Button onClick={handleClose} variant="contained">
            이동하기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
