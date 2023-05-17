// @mui
import { Stack, Button, Typography, Box, Link } from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
import { HOST_EMAIL } from '../../../config';

// ----------------------------------------------------------------------

export default function NavDocs() {
  const { user } = useAuthContext();

  return (
    <Stack
      spacing={3}
      sx={{
        px: 5,
        pb: 5,
        mt: 10,
        width: 1,
        display: 'block',
        textAlign: 'center',
      }}
    >
      <Box component="img" src="/assets/illustrations/illustration_docs.svg" />

      <div>
        <Typography gutterBottom variant="subtitle1">
          {user?.name}님 반갑습니다. 👋
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
          도움이 필요하십니까?{'\n'}메일로 문의를 남겨주세요.
        </Typography>
      </div>

      <Button component={Link} variant="contained" href={`mailto:${HOST_EMAIL}`}>
        문의하기
      </Button>
    </Stack>
  );
}
