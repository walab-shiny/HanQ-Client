// @mui
import { Alert, Tooltip, Stack, Typography, Box } from '@mui/material';
// hooks
import { useAuthContext } from '../../auth/useAuthContext';
// layouts
import LoginLayout from '../../layouts/login';
//
import AuthWithGoogle from './AuthWithGoogle';
import Analytics from './Analytics';
import EventQRLink from './EventQRLink';

// ----------------------------------------------------------------------

const analytics = [
  { value: 'total user', label: '총 접속자 수', total: 322 },
  { value: 'today user', label: '오늘 접속자 수', total: 23 },
  { value: 'total event', label: '총 이벤트 생성 수', total: 19 },
  { value: 'total scan', label: '총 QR 스캔 수', total: 249 },
];

export default function Login() {
  const { method } = useAuthContext();

  return (
    <LoginLayout
      title="HanQ - 원타임 큐알코드를 활용하는 출입관리 서비스 플랫폼"
      illustration="/assets/images/about/screenshot.png"
    >
      <Stack direction="row" sx={{ mb: 5, position: 'relative', justifyContent: 'space-between' }}>
        <Typography variant="h4">Sign in to HanQ</Typography>

        <Tooltip title={method} placement="left">
          <Box
            component="img"
            alt={method}
            src={`/assets/icons/auth/ic_${method}.png`}
            sx={{ width: 32, height: 32 }}
          />
        </Tooltip>
      </Stack>

      <Alert severity="info" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
        학생 서비스를 사용하고 싶으시면{'\n'}
        <strong>handong.ac.kr</strong>계정으로 로그인해 주세요.
      </Alert>

      <AuthWithGoogle />

      <Box sx={{ height: 80 }} />

      <Analytics list={analytics} />

      <Box sx={{ mt: 4 }}>
        <EventQRLink />
      </Box>
    </LoginLayout>
  );
}
