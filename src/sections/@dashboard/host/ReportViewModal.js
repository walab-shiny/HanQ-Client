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
import ExportButton from './ReportListExportButton';
import Iconify from '../../../components/iconify';
import { fDateString } from '../../../utils/formatTime';
import { getReportList } from '../../../apis/report';
import { useSnackbar } from '../../../components/snackbar';

ReportViewModal.propTypes = {
  event: PropTypes.object,
};

export default function ReportViewModal({ event }) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [reports, setReports] = useState();

  const fetchData = async () => {
    const response = await getReportList(event.id);
    setReports(response);
  };

  const handleRefresh = async () => {
    try {
      await fetchData();
      enqueueSnackbar('소감문 목록을 새로고침했습니다.', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('소감문 목록을 새로고침하는 도중 오류가 발생했습니다.', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Tooltip title="소감문 목록 조회">
        <span>
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:file-text-outline" />
          </IconButton>
        </span>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>소감문 목록</DialogTitle>
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
                  <TableCell align="center">학번</TableCell>
                  <TableCell align="center">이름</TableCell>
                  <TableCell align="center">제출 시간</TableCell>
                  <TableCell align="center">내용</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports?.length ? (
                  reports.map((reports) => (
                    <TableRow key={reports.studentNum} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="center" component="th" scope="row">
                        {reports.studentNum}
                      </TableCell>
                      <TableCell align="center">{reports.name}</TableCell>
                      <TableCell align="center">{fDateString(reports.modifiedAt)}</TableCell>
                      <TableCell align="center">{reports.content.replace(/<[^>]+>/g, '')}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={4}>
                      제출된 소감문이 없습니다.
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
          <ExportButton data={reports} eventName={event.name} />
          <Button onClick={handleClose} variant="outlined">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
