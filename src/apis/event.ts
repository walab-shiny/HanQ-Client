import AWS from 'aws-sdk';
import uuid from 'react-uuid';
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

export const uploadImage = async (file: File) => {
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
  });
  const uploadBucket = new AWS.S3({
    params: { Bucket: process.env.REACT_APP_S3_BUCKET },
    region: process.env.REACT_APP_S3_REGION,
  });

  const imageRef = `upload/${uuid()}`;
  const params = {
    ACL: 'public-read',
    Body: file,
    Bucket: process.env.REACT_APP_S3_BUCKET,
    Key: imageRef,
    ContentType: 'image/jpeg',
  };

  const { Location } = await uploadBucket.upload(params).promise();

  return Location;
};

export const closeEvent = async (id: number) => {
  const response = await axios.post('/api/event/close', { id });
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
  const image = data.image ? await uploadImage(data.image) : '';
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
  });
  return response;
};
