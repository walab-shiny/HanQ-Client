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
import { QRAttend } from '../../apis/qr';
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
  const [attendList, setAttendList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
  };

  const addAttendData = (user) => {
    setAttendList((prev) => [...prev, user]);
  };

  const handleOnResult = async (resultString) => {
    const response = await QRAttend({ eventId: +event.id, qrString: resultString });

    if (response.status === 200) {
      const attendData = response.data;
      if (!attendData.isDuplicate) {
        playSound(successSound);
        enqueueSnackbar(`${attendData.name}님 출석처리 되었습니다.`, {
          variant: 'success',
        });
        addAttendData(attendData);
      } else {
        playSound(failsSound);
        enqueueSnackbar(`${attendData.name}님 이미 태깅 되었습니다.`, {
          variant: 'warning',
        });
      }
      setTotalCount(attendData.total);
    } else {
      enqueueSnackbar(`오류가 발생했습니다.`, {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const attendList = await getParticipantList(event.id);
      setAttendList(attendList);
      setTotalCount(attendList.length);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resultText && resultText !== '') {
      handleOnResult(resultText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultText]);

  const [fullscreen, setFullscreen] = useState(false);

  const onToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

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
            width: { xs: 48, md: 96 },
            height: { xs: 48, md: 96 },
          }}
        />
        <Stack sx={{ position: 'absolute', right: 16, top: 16, flexDirection: 'row', gap: 0.5 }}>
          <IconButton onClick={onToggleFullScreen}>
            <Iconify icon={fullscreen ? 'icon-park-outline:off-screen' : 'icon-park-outline:full-screen'} />
          </IconButton>
          <IconButton onClick={() => window.location.reload()}>
            <Iconify icon="eva:close-outline" />
          </IconButton>
        </Stack>
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
            최근 5명 출석자 목록 (총 {totalCount}명)
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
              {attendList.length ? (
                [...attendList]
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
          zIndex: 1,
          height: 1,
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" sx={{ mt: 10, mb: 3 }}>
          {event.name}
        </Typography>
        <Typography variant="h3" fontWeight={500}>
          스마트캠퍼스 앱에서 QR 스크린을 열어서 태깅해 주세요!
        </Typography>
      </Stack>
      <Box sx={{ position: 'fixed' }}>
        <QrReader
          scanDelay={300}
          onResult={(result) => {
            if (!result) return;
            setResultText(result.text);
          }}
          videoContainerStyle={{
            width: '100vw',
            height: '100vh',
          }}
          videoStyle={{ width: '100vw', height: '100vh' }}
          ViewFinder={ScanOverlay}
        />
      </Box>
      <Footer />
    </Dialog>
  );
}
