import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import ExportButton from './ExportButton';
import { getParticipantList } from '../../../apis/participant.ts';
import Iconify from '../../../components/iconify';
import { fDateString } from '../../../utils/formatTime';

ParticipantViewModal.propTypes = {
  event: PropTypes.object,
};

export default function ParticipantViewModal({ event }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [participants, setParticipants] = useState();

  const fetchData = async () => {
    const response = await getParticipantList(event.id);
    setParticipants(response);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Tooltip title="참여자 명단 조회">
        <span>
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:people-outline" />
          </IconButton>
        </span>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>이벤트 참여자 명단</DialogTitle>
        <DialogContent>
          <TableContainer
            sx={{
              maxHeight: 'calc(70vh)',
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center">학번</TableCell>
                  <TableCell align="center">이름</TableCell>
                  <TableCell align="center">학부</TableCell>
                  <TableCell align="center">태깅시간</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {participants?.length ? (
                  participants.map((participant) => (
                    <TableRow key={participant.studentNum} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="center" component="th" scope="row">
                        {participant.studentNum}
                      </TableCell>
                      <TableCell align="center">{participant.name}</TableCell>
                      <TableCell align="center">{participant.department}</TableCell>
                      <TableCell align="center">{fDateString(participant.taggedAt)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={4}>
                      참여자가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <ExportButton data={participants} eventName={event.name} />
          <Button onClick={handleClose} variant="outlined">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
