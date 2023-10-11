import axios from '../utils/axios';
import { IParticipant } from '../types/participant.ts';

export const getParticipantList = async (id: string, page?: number, size?: number) => {
  const defaultPage = 0;
  const defaultSize = 500;
  const response = await axios.get(`/api/user/attend/${id}?page=${page ?? defaultPage}&size=${size ?? defaultSize}`);
  return response.data as IParticipant[];
};
