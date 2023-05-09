import { useState } from 'react';
// @mui
import { Alert, Tooltip, Stack, Typography, Link, Box, Button } from '@mui/material';
// hooks
import { useAuthContext } from '../../auth/useAuthContext';
// layouts
import LoginLayout from '../../layouts/login';
//
import AuthWithGoogle from './AuthWithGoogle';
import EventTextField from './EventTextField';
import Analytics from './Analytics';

// ----------------------------------------------------------------------

const analytics = [
  { value: 'total user', label: '총 접속자 수', total: 322 },
  { value: 'today user', label: '오늘 접속자 수', total: 23 },
  { value: 'total event', label: '총 이벤트 생성 수', total: 19 },
  { value: 'total scan', label: '총 QR 스캔 수', total: 249 },
];

export default function Login() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { method } = useAuthContext();

  return (
    <LoginLayout
      title="HanQ - 원타임 큐알코드를 활용하는 출입관리 서비스 플랫폼"
      illustration="/assets/images/about/screenshot.png"
    >
      <Stack spacing={3} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Sign in to HanQ</Typography>

        <Link variant="subtitle2" onClick={handleOpen}>
          이벤트 출석 QR 스캔 페이지 이동
        </Link>

        <EventTextField open={open} handleClose={handleClose} />

        <Tooltip title={method} placement="left">
          <Box
            component="img"
            alt={method}
            src={`/assets/icons/auth/ic_${method}.png`}
            sx={{ width: 32, height: 32, position: 'absolute', right: 0 }}
          />
        </Tooltip>
      </Stack>

      <Alert severity="info" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
        학생 서비스를 사용하고 싶으시면{'\n'}
        <strong>handong.ac.kr</strong>계정으로 로그인해 주세요.
      </Alert>

      <AuthWithGoogle />

      <Box sx={{ height: 40 }} />

      <Analytics list={analytics} />
    </LoginLayout>
  );
}
