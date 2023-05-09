import {
  Box,
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
import PropTypes from 'prop-types';
import { useState } from 'react';
import Iconify from '../../../components/iconify/Iconify';

ShareModal.propTypes = {
  event: PropTypes.object,
};

export default function ShareModal({ event }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="이벤트 코드 공유">
        <span>
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:share-outline" />
          </IconButton>
        </span>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>QR 스캔 페이지 공유하기</DialogTitle>
        <DialogContent>
          <Stack spacing={4} p={3} pb={0}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                이벤트 코드
              </Typography>
              <Typography variant="subtitle2">{event.code}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" display="flex" alignItems="center">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                이벤트 비밀번호
              </Typography>
              <TextField size="small" />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2} p={3} pb={1}>
            <Button onClick={handleClose} variant="outlined">
              닫기
            </Button>
            <Button variant="contained">저장하기</Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
