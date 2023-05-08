import PropTypes from 'prop-types';
import { QrReader } from 'react-qr-reader';
import {
  Box,
  Button,
  Card,
  Dialog,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Iconify from '../../../../components/iconify';
import { sendQrRequest } from '../../../../apis/qr';
// components
import { useSnackbar } from '../../../../components/snackbar';
import Logo from '../../../../components/logo';
import ScanOverlay from './QRScanOverlay';
import { getParticipantList } from '../../../../apis/participant.ts';
import { maskingName } from '../../../../utils/formatName';

QRScan.propTypes = {
  event: PropTypes.object,
  disabled: PropTypes.bool,
};

export default function QRScan({ event, disabled }) {
  const { enqueueSnackbar } = useSnackbar();
  const [resultText, setResultText] = useState('');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOnResult = async (resultString) => {
    const response = await sendQrRequest({ eventId: +event.id, qrString: resultString });
    if (response.status === 200) {
      if (!response.data.isDuplicate) {
        enqueueSnackbar(`${response.data.name}님 출석처리 되었습니다.`, {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(`${response.data.name}님 이미 태깅 되었습니다.`, {
          variant: 'warning',
        });
      }
      fetchData();
    } else {
      enqueueSnackbar(`오류가 발생했습니다.`, {
        variant: 'error',
      });
    }
  };

  const [userList, setUserList] = useState([]);

  const fetchData = async () => {
    const userList = await getParticipantList(event.id);
    setUserList(userList);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resultText && resultText !== '') {
      handleOnResult(resultText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultText]);

  return (
    <>
      <Tooltip title={disabled ? '이벤트가 진행 중이 아닙니다.' : '출석 QR 스캔하기'}>
        <span>
          <Button size="small" variant="contained" color="success" onClick={handleOpen} disabled={disabled}>
            QR
          </Button>
        </span>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullScreen>
        <Logo
          sx={{
            zIndex: 9,
            position: 'absolute',
            mt: { xs: 1.5, md: 5 },
            ml: { xs: 2, md: 5 },
          }}
        />
        <IconButton
          onClick={() => window.location.reload()}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
          }}
        >
          <Iconify icon="eva:close-outline" />
        </IconButton>
        <Card
          component={TableContainer}
          sx={{
            position: 'absolute',
            right: 40,
            top: '70%',
            width: 240,
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">학번</TableCell>
                <TableCell align="center">이름</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.length > 0 ? (
                userList.reverse().map((user, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{user.studentNum}</TableCell>
                    <TableCell align="center">{maskingName(user.name)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={2}>
                    출석자가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
        <Box
          sx={{
            height: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h3">{event.name} 출석 태깅하기</Typography>
          <QrReader
            scanDelay={500}
            onResult={(result) => {
              if (!result) return;
              setResultText(result.text);
            }}
            videoContainerStyle={{
              width: 500,
              height: 500,
            }}
            videoStyle={{ width: 500, height: 500 }}
            ViewFinder={ScanOverlay}
          />
        </Box>
      </Dialog>
    </>
  );
}
