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
import { deleteEvent } from '../../../apis/event.ts';

DeleteEventModal.propTypes = {
  event: PropTypes.object,
  fetchData: PropTypes.func,
};

export default function DeleteEventModal({ event, fetchData }) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDeleteEvent = async () => {
    setLoading(true);
    try {
      await deleteEvent(event.id);
      await fetchData();
      enqueueSnackbar('삭제되었습니다.', {
        variant: 'success',
      });
      handleClose();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      <Tooltip title="이벤트 삭제">
        <IconButton onClick={handleOpen}>
          <Iconify icon="eva:trash-2-outline" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>이벤트 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>정말로 {event.name} 이벤트를 삭제하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            취소
          </Button>
          <LoadingButton variant="contained" onClick={handleDeleteEvent} loading={loading}>
            삭제
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
