import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from '../../../components/snackbar';
import Iconify from '../../../components/iconify';
import { closeEvent } from '../../../apis/event.ts';

CloseEventModal.propTypes = {
  event: PropTypes.object,
  fetchData: PropTypes.func,
};

export default function CloseEventModal({ event, fetchData }) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseEvent = async () => {
    setLoading(true);
    try {
      await closeEvent(event.id);
      await fetchData();
      enqueueSnackbar('종료되었습니다.', {
        variant: 'success',
      });
      handleClose();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  const isClosed = event.status === '종료됨';

  return (
    <>
      <Tooltip title={isClosed ? '이벤트가 종료되었습니다.' : '이벤트 종료'}>
        <span>
          <IconButton onClick={handleOpen} disabled={isClosed}>
            <Iconify icon="eva:close-circle-outline" />
          </IconButton>
        </span>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>이벤트 종료</DialogTitle>
        <DialogContent>
          <DialogContentText>정말로 {event.name} 이벤트를 종료하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            취소
          </Button>
          <LoadingButton variant="contained" onClick={handleCloseEvent} loading={loading}>
            종료
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
