import { useEffect, useState } from 'react';
import { checkEventPassword } from '../apis/event.ts';
import { QRScan } from '../sections/qr';

export default function LinkQRScanPage() {
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
      } catch (error) {
        alert('이벤트 정보가 틀립니다.');
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
      {event ? <QRScan event={event} open={qr} onClose={handleCloseQr} /> : <div>QR 스캔 페이지를 열 수 없습니다.</div>}
    </>
  );
}
