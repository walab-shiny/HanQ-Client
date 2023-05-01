import axios from 'axios';

export const requestHostAuth = async (userId: number, content: string) => {
  const response = await axios.post('/api/host', {
    userId,
    content,
  });
  return response.data;
};
