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
        로그인 없이 출석 QR 스캔 페이지 열기 (주최자 전용)
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>로그인 없이 출석 QR 스캔 페이지 열기</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            주최 이벤트 목록 페이지에서 이벤트 코드를 확인할 수 있습니다.
          </DialogContentText>
          <TextField fullWidth placeholder="이벤트 코드 6글자를 입력하세요." size="small" sx={{ mb: 2 }} />
          <TextField fullWidth placeholder="비밀번호를 입력하세요." size="small" />
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
