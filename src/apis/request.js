import axios from '../utils/axios';

export const requestHost = async ({ userId, content, affiliation, hostUntil }) => {
  const response = await axios.post('/api/host', {
    userId,
    content,
    affiliation,
    hostUntil,
  });
  return response.data;
};
