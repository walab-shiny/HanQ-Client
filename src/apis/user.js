import axios from '../utils/axios';

export const updateUser = async ({ likes }) => {
  const response = await axios.post('/api/user/update', {
    likes,
  });
  return response.data;
};
