import request from '@/api';

export const uploadImage = formdata => {
  return request.post('http://35.185.213.127/api/remove', formdata, {
    responseType: 'blob'
  });
};
