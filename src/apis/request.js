import axios from '../utils/axios';

export const requestHost = async (userId, content) => {
  const response = await axios.post('/api/host', {
    userId,
    content,
  });
  return response.data;
};
