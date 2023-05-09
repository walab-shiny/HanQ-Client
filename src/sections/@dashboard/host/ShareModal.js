import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Iconify from '../../../components/iconify';

ShareModal.propTypes = {
  event: PropTypes.object,
};

export default function ShareModal({ event }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="다른 기기에서 출석 QR 스캔 페이지 열기">
        <span>
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:link-outline" />
          </IconButton>
        </span>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>다른 기기에서 출석 QR 스캔 페이지 열기</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="subtitle1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }} gutterBottom>
              다른 기기에서 해당 코드와 비밀번호를 입력하면{'\n'}로그인 없이 출석 QR 스캔 페이지를 열 수 있습니다.
            </Typography>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                이벤트 코드
              </Typography>
              <Typography variant="subtitle2">{event.code}</Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                이벤트 비밀번호
              </Typography>
              <TextField size="small" placeholder="비밀번호를 설정해주세요." />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            닫기
          </Button>
          <Button variant="contained">저장하기</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
