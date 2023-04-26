// @mui
import { Alert, Tooltip, Stack, Typography, Link, Box } from '@mui/material';
// hooks
import { useAuthContext } from '../../auth/useAuthContext';
// layouts
import LoginLayout from '../../layouts/login';
//
import AuthWithGoogle from './AuthWithGoogle';

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuthContext();

  return (
    <LoginLayout title="HanQ - 원타임 큐알코드를 활용하는 출입관리 서비스 플랫폼">
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Sign in to HanQ</Typography>

        <Link variant="subtitle2">HanQ 사용법 알아보기</Link>

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
    </LoginLayout>
  );
}
