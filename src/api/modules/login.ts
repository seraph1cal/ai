import { Login } from '@/api/interface/login';
import authMenuList from '@/mock/authMenuList.json';
import authButtonList from '@/mock/authButtonList.json';
import authLogin from '@/mock/authLogin.json';
import authLogout from '@/mock/authLogout.json';
import request from '@/api';
const SHARK_URL = window.config.SHARK_URL;
/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (data: Login.ReqLoginForm) => {
  // return http.post<Login.ResLogin>(PORT1 + `/login`, params, { loading: false }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/login`, params, { loading: false }); // 控制当前请求不显示 loading
  // return http.post<Login.ResLogin>(PORT1 + `/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/login`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/login?${qs.stringify(params, { arrayFormat: "repeat" })}`); // get 请求可以携带数组等复杂参数
  // 如果想让菜单变为本地数据，注释上一行代码，并引入本地 authLogin.json 数据
  return request.post<{ result: { token: string } }>(SHARK_URL + '/login/getLogin', data);
};

// 获取菜单列表
export const getAuthMenuListApi = () => {
  // return http.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`, {}, { loading: false });
  // 如果想让菜单变为本地数据，注释上一行代码，并引入本地 authMenuList.json 数据
  return authMenuList;
};

// 获取按钮权限
export const getAuthButtonListApi = () => {
  // return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`, {}, { loading: false });
  // 如果想让按钮权限变为本地数据，注释上一行代码，并引入本地 authButtonList.json 数据
  return authButtonList;
};

// 用户退出登录
export const logoutApi = data => {
  // return http.post(PORT1 + `/logout`);
  // 如果想让按钮权限变为本地数据，注释上一行代码，并引入本地 authLogout.json 数据
  // return authLogout;
  return request.post(SHARK_URL + '/login/getLogout', data);
};
