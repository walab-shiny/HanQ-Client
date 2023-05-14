import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper } from '@mui/material';
import Iconify from '../../../components/iconify';
import Markdown from '../../../components/markdown/Markdown';
import { fDateString } from '../../../utils/formatTime';

ViewReport.propTypes = {
  event: PropTypes.object,
};

export default function ViewReport({ event }) {
  const { report } = event;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        variant="contained"
        size="small"
        color="success"
        startIcon={<Iconify icon="eva:expand-outline" />}
        onClick={handleOpen}
      >
        소감문 조회
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>소감문 조회</DialogTitle>
        <DialogContent>
          <DialogContentText variant="subtitle1" gutterBottom>
            {event.name}
          </DialogContentText>
          <DialogContentText sx={{ mb: 2 }}>작성일자: {fDateString(report.modifiedAt)}</DialogContentText>
          <Paper variant="outlined" sx={{ px: 2, minHeight: 240 }}>
            <Markdown children={report.content} />
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={handleClose}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
