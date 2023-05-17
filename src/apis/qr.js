import axios from '../utils/axios';

export const sendQrRequest = async (data) => {
  const response = await axios.post('/api/attend', data);
  return response;
};

export const getQRInfo = async (qrString) => {
  const response = await axios.post('/api/attend/qrInfo', { qrString });
  return response.data;
};
