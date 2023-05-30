import axios from '../utils/axios';

export const updateViews = async (id) => {
  const response = await axios.get(`/api/event/views/${id}`);

  return response;
};
