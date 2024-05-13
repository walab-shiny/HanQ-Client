import PropTypes from 'prop-types';
import { QrReader } from 'react-qr-reader';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import tadaSound from '../../assets/audios/tada.mp3';
import Footer from '../../layouts/dashboard/footer';

const EVENT_HOST_ID = null;
const EVENT_GIFT_INTERVAL = 10;
const EVENT_GIFT_MAX = 1000;

// For testing
// const EVENT_HOST_ID = 7;
// const EVENT_GIFT_INTERVAL = 1;
// const EVENT_GIFT_MAX = 1000;

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
  const [childOpen, setChildOpen] = useState(false);
  const [childText, setChildText] = useState('');

  const handleCloseChild = () => {
    setChildOpen(false);
  };

  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
  };

  const addAttendData = (user) => {
    setAttendList((prev) => [...prev, user]);
  };

  const handleOnResult = async (resultString) => {
    const response = await QRAttend({ eventId: +event.id, qrString: resultString });
    const isGiftEvent = event.hostId === EVENT_HOST_ID;

    if (response.status === 200) {
      const attendData = response.data;
      const totalCount = attendData.total;
      if (!attendData.isDuplicate) {
        playSound(successSound);
        enqueueSnackbar(`${attendData.name}님 출석처리 되었습니다.`, {
          variant: 'success',
        });
        addAttendData(attendData);

        if (isGiftEvent && totalCount % EVENT_GIFT_INTERVAL === 0 && totalCount <= EVENT_GIFT_MAX && totalCount !== 0) {
          playSound(tadaSound);
          setChildText(`축하합니다 ${attendData.name}님! 경품에 당첨되셨습니다!\n담당자에게 경품을 수령하세요.`);
          setChildOpen(true);
        }
      } else {
        playSound(failsSound);
        enqueueSnackbar(`${attendData.name}님 이미 태깅 되었습니다.`, {
          variant: 'warning',
        });
      }
      setTotalCount(totalCount);
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
            width: 380,
            borderColor: 'error.main',
            borderWidth: 2,
          }}
        >
          <Typography variant="h2" sx={{ textAlign: 'center', my: 1 }} color="error.main">
            출석 확인하세요!
          </Typography>
          <Typography variant="h5" sx={{ textAlign: 'center', my: 1 }}>
            최근 5명 출석자 목록 (총 {totalCount}명)
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Typography variant="subtitle1">학번</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1">이름</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1">스캔 시간</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendList.length ? (
                [...attendList]
                  .reverse()
                  .slice(0, 5)
                  .map((user, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        <Typography variant="h6">{user.studentNum}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h6">{maskingName(user.name)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h6">{fTimeString(user.taggedAt)}</Typography>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={3}>
                    <Typography variant="h6" sx={{ my: 1 }}>
                      출석자가 없습니다.
                    </Typography>
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
        <Typography variant="h2" fontWeight={600}>
          스마트캠퍼스 앱에서 QR 스크린을 열고 태깅해 주세요!
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
      <ChildModal open={childOpen} handleClose={handleCloseChild} text={childText} />
    </Dialog>
  );
}

function ChildModal({ open, handleClose, text }) {
  const initialSeconds = 5;
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (open) {
      setSeconds(initialSeconds);
    }
  }, [open]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      handleClose();
      setSeconds(initialSeconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle variant="h2">축하합니다!</DialogTitle>
      <DialogContent sx={{ width: 480, height: 120 }}>
        <DialogContentText variant="h5" sx={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
          {text}
          {'\n\n'}이 메세지는 {seconds}초 후에 자동으로 닫힙니다.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} size="large" variant="contained">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ChildModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  text: PropTypes.string,
};
