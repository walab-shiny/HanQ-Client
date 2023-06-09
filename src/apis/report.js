import axios from '../utils/axios';

export const postReport = async (eventId, content) => {
  const response = await axios.post('/api/report', { eventId, content });
  return response;
};

export const editReport = async (id, content) => {
  const response = await axios.post('/api/report/update', { id, content });
  return response;
};

export const getReportList = async (id) => {
  const response = await axios.get(`/api/report/event/${id}`);
  return response.data;
};
