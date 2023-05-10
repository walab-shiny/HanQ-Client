import axios from '../utils/axios';

export const getTagList = async () => {
  const response = await axios.get('/api/tag');
  return response.data;
};
