import { useEffect, useState } from 'react';
import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material';
import { checkEventPassword } from '../apis/event.ts';
import { QRScan } from '../sections/qr';

export default function LinkQRScanPage() {
  const [init, setInit] = useState(false);
  const [event, setEvent] = useState();

  const [qr, setQr] = useState(false);
  const handleOpenQr = () => setQr(true);
  const handleCloseQr = () => setQr(false);

  useEffect(() => {
    const checkPassword = async (code, password) => {
      try {
        const response = await checkEventPassword(code, password);

        if (response.result === true) {
          const eventData = response.event;
          setEvent(eventData);
          handleOpenQr();
        } else {
          alert('비밀번호가 일치하지 않습니다.');
        }
        setInit(true);
      } catch (error) {
        alert('이벤트 정보가 틀립니다.');
        setInit(true);
      }
    };

    const queryParams = new URLSearchParams(window.location.search);

    const code = queryParams.get('code');
    const password = queryParams.get('password');

    if (code && password) {
      checkPassword(code, password);
    }
  }, []);

  return (
    <>
      {init ? (
        <>
          {event ? (
            <QRScan event={event} open={qr} onClose={handleCloseQr} />
          ) : (
            <Stack justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
              <Typography variant="h6">이벤트를 찾을 수 없습니다.</Typography>
            </Stack>
          )}
        </>
      ) : (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
}
