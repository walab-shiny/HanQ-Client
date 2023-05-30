import axios from '../utils/axios';

export const getAnalytics = async () => {
  const response1 = await axios.get('/api/login/count');
  const response2 = await axios.get('/api/event/count');
  const response3 = await axios.get('/api/attend/count');
  const { total, today } = response1.data;
  const eventCount = response2.data.count;
  const attendCount = response3.data.count;

  return [
    { value: 'total user', label: '총 접속자 수', count: total },
    { value: 'today user', label: '오늘 접속자 수', count: today },
    { value: 'total event', label: '총 이벤트 생성 수', count: eventCount },
    { value: 'total scan', label: '총 QR 스캔 수', count: attendCount },
  ];
};
