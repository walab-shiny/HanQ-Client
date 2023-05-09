/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
import axios from '../utils/axios';

export const getAnalytics = async () => {
  //   const response1 = await axios.post('/api/login/count');
  //   const response2 = await axios.post('/api/attend/monthly');

  return [
    { value: 'total user', label: '총 접속자 수', total: 322 },
    { value: 'today user', label: '오늘 접속자 수', total: 23 },
    { value: 'total event', label: '총 이벤트 생성 수', total: 19 },
    { value: 'total scan', label: '총 QR 스캔 수', total: 249 },
  ];
};
