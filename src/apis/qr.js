import axios from '../utils/axios';

export const sendQrRequest = async (data) => {
  const response = await axios.post('/api/attend', data);
  return response;
};
