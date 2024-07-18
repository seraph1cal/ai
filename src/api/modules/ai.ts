import request from '@/api';

export const uploadImage = formdata => {
  return request.post('http://34.46.51.161/api/remove', formdata, {
    responseType: 'blob'
  });
};
