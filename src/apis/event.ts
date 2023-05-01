import AWS from 'aws-sdk';
import uuid from 'react-uuid';
import moment from 'moment';
import { IEvent } from '../types/event.ts';
import axios from '../utils/axios';

export const getEventList = async () => {
  const response = await axios.get('/api/event/list');
  return response.data as IEvent[];
};

export const getEvent = async (id: number) => {
  const response = await axios({
    url: `/api/event/${id}`,
    method: 'get',
  });
  return response.data as IEvent;
};

export const addEvent = async (data: IEvent) => {
  const image = data.image ? await uploadImage(data.image) : null;
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

  const imageRef = `upload/${uuid()}-${file.name}`;
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
