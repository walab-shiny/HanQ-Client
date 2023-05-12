import PropTypes from 'prop-types';
import { QrReader } from 'react-qr-reader';
import {
  Box,
  Card,
  Dialog,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Iconify from '../../components/iconify';
import { sendQrRequest } from '../../apis/qr';
// components
import { useSnackbar } from '../../components/snackbar';
import Logo from '../../components/logo';
import ScanOverlay from './QRScanOverlay';
import { getParticipantList } from '../../apis/participant.ts';
import { maskingName } from '../../utils/formatName';
import { fTimeString } from '../../utils/formatTime';
import successSound from '../../assets/audios/success.mp3';
import failsSound from '../../assets/audios/fail.mp3';
import Footer from '../../layouts/dashboard/footer';

QRScan.propTypes = {
  event: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function QRScan({ event, open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const [resultText, setResultText] = useState('');

  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
  };

  const handleOnResult = async (resultString) => {
    const response = await sendQrRequest({ eventId: +event.id, qrString: resultString });
    if (response.status === 200) {
      if (!response.data.isDuplicate) {
        playSound(successSound);
        enqueueSnackbar(`${response.data.name}님 출석처리 되었습니다.`, {
          variant: 'success',
        });
      } else {
        playSound(failsSound);
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
    <Dialog open={open} onClose={onClose} fullScreen>
      <Box
        sx={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          zIndex: 2,
        }}
      >
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
          variant="outlined"
          sx={{
            position: 'absolute',
            left: 32,
            bottom: 32,
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
          }}
        >
          <Typography variant="caption" textAlign="center">
            나의 출석 목록 보러가기 ⬇️
          </Typography>
          <Divider />
          <Box component="img" src="/assets/images/qr/qrLink.png" sx={{ width: 150, p: '2px' }} />
        </Card>
        <Card
          component={TableContainer}
          variant="outlined"
          sx={{
            position: 'absolute',
            right: 32,
            bottom: 32,
            display: { xs: 'none', sm: 'block' },
            width: 300,
          }}
        >
          <Typography variant="subtitle1" sx={{ textAlign: 'center', my: 1 }}>
            최근 5명 출석자 목록 (총 {userList.length}명)
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">학번</TableCell>
                <TableCell align="center">이름</TableCell>
                <TableCell align="center">스캔 시간</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.length > 0 ? (
                userList
                  .reverse()
                  .slice(0, 5)
                  .map((user, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{user.studentNum}</TableCell>
                      <TableCell align="center">{maskingName(user.name)}</TableCell>
                      <TableCell align="center">{fTimeString(user.taggedAt)}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={3}>
                    출석자가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </Box>
      <Stack
        sx={{
          height: 1,
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ mb: 4 }}>
          {event.name}
        </Typography>
        <Typography variant="h4">스마트캠퍼스 앱에서 QR 스크린을 열어서 태깅해 주세요!</Typography>
        <QrReader
          scanDelay={500}
          onResult={(result) => {
            if (!result) return;
            setResultText(result.text);
          }}
          videoContainerStyle={{
            width: 400,
            height: 400,
          }}
          videoStyle={{ width: 400, height: 400 }}
          ViewFinder={ScanOverlay}
        />
      </Stack>
      <Footer />
    </Dialog>
  );
}
