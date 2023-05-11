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
    setPassword('');
    alert(
      `이벤트 코드와 비밀번호를 잊어버리지 않도록 메모한 후,\n다른 기기에서 입력해주세요.\n\n이벤트 코드: ${event.code}\n비밀번호: ${password}`
    );
    enqueueSnackbar('비밀번호가 설정되었습니다.', { variant: 'success' });
    handleClose();
  };
  const isClosed = event.status === '종료됨';

  return (
    <>
      <Tooltip title={isClosed ? '이벤트가 종료되었습니다.' : '다른 기기에서 출석 QR 스캔 페이지 열기'}>
        <span>
          <IconButton onClick={handleOpen} disabled={isClosed}>
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
                비밀번호
              </Typography>
              <TextField
                size="small"
                placeholder="비밀번호를 설정해주세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
