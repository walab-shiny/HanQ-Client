import { TextField, IconButton, Box } from '@mui/material';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

export default function EventTextField() {
  return (
    <Box display="flex" flexDirection="row">
      <Box>
        <TextField sx={{ mb: 1 }} fullWidth placeholder="이벤트 아이디" size="small" />
        <TextField fullWidth placeholder="이벤트 비밀번호" size="small" />
      </Box>
      <IconButton sx={{ pl: 3, pr: 3 }}>
        <ArrowCircleRightIcon />
      </IconButton>
    </Box>
  );
}
