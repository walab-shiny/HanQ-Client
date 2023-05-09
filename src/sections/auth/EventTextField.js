import {
  TextField,
  IconButton,
  Box,
  Dialog,
  Typography,
  useTheme,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

export default function EventTextField({ open, handleClose }) {
  const { palette } = useTheme();
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>QR 스캔 페이지로 이동하기</DialogTitle>
      <DialogContent>
        <DialogContentText mb={3}>주최 이벤트 상세 페이지에서 이벤트 코드를 확인하세요.</DialogContentText>
        <TextField sx={{ mb: 1 }} fullWidth placeholder="이벤트 코드" size="small" />
        <TextField fullWidth placeholder="이벤트 비밀번호" size="small" />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          취소
        </Button>
        <Button onClick={handleClose} variant="contained">
          이동하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
