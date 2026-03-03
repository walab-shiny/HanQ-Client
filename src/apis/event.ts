import moment from 'moment';
import { IEvent } from '../types/event.ts';
import axios from '../utils/axios';

const getStatus = (event) => {
  if (event.closed) {
    return '종료됨';
  }
  if (moment(new Date(event.openAt)).subtract(15, 'minute') > moment()) {
    return '진행 전';
  }
  if (moment(new Date(event.closeAt)) < moment()) {
    return '종료됨';
  }
  return '진행 중';
};

export const getEventListAll = async () => {
  const response = await axios.get('/api/event/list/all');
  return response.data.map((event) => ({ ...event, status: getStatus(event) }));
};

export const getTaggedEventList = async () => {
  const response = await axios.get('/api/event/tagged');
  return response.data.map((event) => ({ ...event, status: getStatus(event) }));
};

export const getHotEventList = async () => {
  const response = await axios.get('/api/event/list/hot');
  return response.data.map((event) => ({ ...event, status: getStatus(event) }));
};

export const getEventList = async () => {
  const response = await axios.get('/api/event/list');
  return response.data.map((event) => ({ ...event, status: getStatus(event) }));
};

export const getAttendEventList = async () => {
  const response = await axios.get(`/api/event/attended`);
  return response.data.map((event) => ({ ...event, status: getStatus(event) }));
};

export const getEvent = async (id: number) => {
  const response = await axios.get(`/api/event/${id}`);
  return response.data as IEvent;
};

export const addEvent = async (data: IEvent) => {
  const image = data.image ? await uploadImage(data.image) : '';
  const response = await axios.post('/api/event', {
    name: data.name,
    openAt: moment(new Date(data.openAt)).format('YYYY-MM-DDTHH:mm:ss'),
    closeAt: moment(new Date(data.closeAt)).format('YYYY-MM-DDTHH:mm:ss'),
    location: data.location,
    maxUsers: data.maxUsers,
    content: data.content,
    availableTime: data.availableTime,
    image,
    tags: data.tags.map((tag) => tag.id),
    isPublic: data.isPublic,
  });
  return response;
};

// eslint-disable-next-line no-unused-vars
export const uploadImage = async (file: File) => {
  alert('이미지 업로드 기능이 일시적으로 중단되었습니다. 이미지 없이 등록됩니다.');
  return '';
};

export const closeEvent = async (id: number) => {
  const response = await axios.post('/api/event/close', { id });
  return response;
};

export const deleteEvent = async (id: number) => {
  const response = await axios.post('/api/event/delete', { id });
  return response;
};

export const setEventPassword = async (id: string, password: string) => {
  const response = await axios.post('/api/event/password', { id, password });
  return response;
};

export const checkEventPassword = async (code: string, password: string) => {
  const response = await axios.post('/api/event/check', { code, password });
  return response.data;
};

export const editEvent = async (id: number, data: IEvent) => {
  const isImageChanged = data.image && data.image instanceof File;
  const image = isImageChanged ? await uploadImage(data.image) : data.image;
  const response = await axios.post('/api/event/update', {
    id,
    name: data.name,
    openAt: moment(new Date(data.openAt)).format('YYYY-MM-DDTHH:mm:ss'),
    closeAt: moment(new Date(data.closeAt)).format('YYYY-MM-DDTHH:mm:ss'),
    location: data.location,
    maxUsers: data.maxUsers,
    content: data.content,
    availableTime: data.availableTime,
    image,
    tags: data.tags.map((tag) => tag.id),
    isPublic: data.isPublic,
  });
  return response;
};
