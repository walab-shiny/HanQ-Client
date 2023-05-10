import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Iconify from '../../../components/iconify';
import Editor from '../../../components/editor';

PostReport.propTypes = {
  event: PropTypes.object,
};

export default function PostReport({ event }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        variant="contained"
        size="small"
        color="success"
        startIcon={<Iconify icon="eva:edit-2-outline" />}
        onClick={handleOpen}
      >
        소감문 작성
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>소감문 작성</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>{event.name}에 대한 소감문을 작성하세요.</DialogContentText>
          <Editor simple />
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            취소
          </Button>
          <Button variant="contained" color="success">
            제출
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
