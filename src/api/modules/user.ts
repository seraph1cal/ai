import request from '@/api';

const SHARK_URL = window.config.SHARK_URL;
const api = {
  queryList: SHARK_URL + '/user/queryList',
  addUser: SHARK_URL + '/user/addUser',
  deleteUser: SHARK_URL + '/user/deleteUser',
  updateUser: SHARK_URL + '/user/updateUser'
};
export function queryList(data) {
  return request.post(api.queryList, data);
}
export function addUser(data) {
  return request.post(api.addUser, data);
}
export function deleteUser(data) {
  return request.post(api.deleteUser, data);
}
export function updateUser(data) {
  return request.post(api.updateUser, data);
}
