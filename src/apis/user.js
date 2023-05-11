import axios from '../utils/axios';

export const updateUser = async ({ likes, picture }) => {
  const response = await axios.post('/api/user/update', {
    likes,
    picture,
  });
  return response.data;
};
