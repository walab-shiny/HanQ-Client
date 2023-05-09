import axios from '../utils/axios';
import { IParticipant } from '../types/participant.ts';

export const getParticipantList = async (id: string) => {
  const response = await axios.get(`/api/user/attend/${id}`);
  return response.data as IParticipant[];
};
