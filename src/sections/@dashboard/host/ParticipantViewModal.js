import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonGroup,
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
import ExportButton from './AttendListExportButton';
import { getParticipantList } from '../../../apis/participant.ts';
import Iconify from '../../../components/iconify';
import { fDateString } from '../../../utils/formatTime';
import { useSnackbar } from '../../../components/snackbar';

ParticipantViewModal.propTypes = {
  event: PropTypes.object,
};

export default function ParticipantViewModal({ event }) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [participants, setParticipants] = useState();

  const fetchData = async () => {
    const response = await getParticipantList(event.id);
    setParticipants(response);
  };

  const handleRefresh = async () => {
    try {
      await fetchData();
      enqueueSnackbar('참여자 명단을 새로고침했습니다.', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('참여자 명단을 새로고침하는 도중 오류가 발생했습니다.', { variant: 'error' });
    }
  };

  const handleSort = (key) => {
    const sorted = [...participants].sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
    setParticipants(sorted);
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
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          이벤트 참여자 명단 (총 {participants?.length}명)
          <ButtonGroup color="secondary">
            <Button startIcon={<Iconify icon="eva:hash-outline" />} onClick={() => handleSort('studentNum')}>
              학번순
            </Button>
            <Button startIcon={<Iconify icon="eva:clock-outline" />} onClick={() => handleSort('taggedAt')}>
              태깅시간순
            </Button>
          </ButtonGroup>
        </DialogTitle>
        <DialogContent>
          <TableContainer
            sx={{
              maxHeight: 'calc(70vh)',
              height: 320,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>순번</TableCell>
                  <TableCell>학부</TableCell>
                  <TableCell>학번</TableCell>
                  <TableCell>이름</TableCell>
                  <TableCell>태깅시간</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {participants?.length ? (
                  participants.map((participant, index) => (
                    <TableRow key={participant.studentNum} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{participant.department}</TableCell>
                      <TableCell>{participant.studentNum}</TableCell>
                      <TableCell>{participant.name}</TableCell>
                      <TableCell>{fDateString(participant.taggedAt)}</TableCell>
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
          <Button onClick={handleRefresh} startIcon={<Iconify icon="eva:refresh-outline" />} color="secondary">
            새로고침
          </Button>
          <ExportButton data={participants} event={event} />
          <Button onClick={handleClose} variant="outlined">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
