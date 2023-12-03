import axios from '../utils/axios';
import { uploadImage } from './event.ts';

export const updateUser = async (data) => {
  const picture = typeof data.picture === 'string' ? data.picture : await uploadImage(data.picture);
  const response = await axios.post('/api/user/update', {
    likes: data.tags.map((tag) => tag.id),
    picture,
  });
  return response;
};
