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
import { useSnackbar } from '../../../components/snackbar';
import { setEventPassword } from '../../../apis/event.ts';

ShareModal.propTypes = {
  event: PropTypes.object,
};

export default function ShareModal({ event }) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    if (password.length < 4) {
      alert('비밀번호는 4자 이상이어야 합니다.');
      return;
    }
    await setEventPassword(event.id, password);
    window.prompt('링크를 복사하세요.', `${window.location.origin}/qr?code=${event.code}&password=${password}`);
    enqueueSnackbar('비밀번호가 설정되었습니다.', { variant: 'success' });
    setPassword('');
    handleClose();
  };
  const isClosed = event.status === '종료됨';

  return (
    <>
      <Tooltip title={isClosed ? '이벤트가 종료되었습니다.' : 'QR 스캔 페이지 URL 링크 생성'}>
        <span>
          <IconButton onClick={handleOpen} disabled={isClosed}>
            <Iconify icon="eva:link-outline" />
          </IconButton>
        </span>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>URL 링크로 출석 QR 스캔 페이지 열기</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="subtitle1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }} gutterBottom>
              URL 링크를 생성하면{'\n'}로그인 없이 출석 QR 스캔 페이지를 열 수 있습니다.
            </Typography>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                이벤트 코드
              </Typography>
              <Typography variant="subtitle1">{event.code}</Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                비밀번호
              </Typography>
              <TextField
                size="small"
                placeholder="비밀번호를 설정해주세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="비밀번호가 이미 있는 경우 재설정 됩니다."
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            닫기
          </Button>
          <Button variant="contained" onClick={handleSave}>
            저장하기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
