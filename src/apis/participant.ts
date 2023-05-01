import axios from 'axios';
import { IParticipant } from '../types/participant';
import { IEvent } from '../types/event';

export const getParticipantList = async (id: string) => {
  const response = await axios.get(`/api/user/attend/${id}`);
  return response.data as IParticipant[];
};

export const getUserParticipateList = async () => {
  const response = await axios.get(`/api/event/attended`);
  return response.data as IEvent[];
};
