import { isArray } from '@/utils/is';
import { FieldNamesProps } from '@/components/ProTable/interface';

const mode = import.meta.env.VITE_ROUTER_MODE;

/**
 * @description 获取localStorage
 * @param {String} key Storage名称
 * @returns {String}
 */
export function localGet(key: string) {
  const value = window.localStorage.getItem(key);
  try {
    return JSON.parse(window.localStorage.getItem(key) as string);
  } catch (error) {
    return value;
  }
}

/**
 * @description 存储localStorage
 * @param {String} key Storage名称
 * @param {*} value Storage值
 * @returns {void}
 */
export function localSet(key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @description 清除localStorage
 * @param {String} key Storage名称
 * @returns {void}
 */
export function localRemove(key: string) {
  window.localStorage.removeItem(key);
}

/**
 * @description 清除所有localStorage
 * @returns {void}
 */
export function localClear() {
  window.localStorage.clear();
}

/**
 * @description 判断数据类型
 * @param {*} val 需要判断类型的数据
 * @returns {String}
 */
export function isType(val: any) {
  if (val === null) return 'null';
  if (typeof val !== 'object') return typeof val;
  else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase();
}

/**
 * @description 生成唯一 uuid
 * @returns {String}
 */
export function generateUUID() {
  let uuid = '';
  for (let i = 0; i < 32; i++) {
    let random = (Math.random() * 16) | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) uuid += '-';
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
  }
  return uuid;
}

/**
 * 判断两个对象是否相同
 * @param {Object} a 要比较的对象一
 * @param {Object} b 要比较的对象二
 * @returns {Boolean} 相同返回 true，反之 false
 */
export function isObjectValueEqual(a: { [key: string]: any }, b: { [key: string]: any }) {
  if (!a || !b) return false;
  let aProps = Object.getOwnPropertyNames(a);
  let bProps = Object.getOwnPropertyNames(b);
  if (aProps.length != bProps.length) return false;
  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i];
    let propA = a[propName];
    let propB = b[propName];
    if (!b.hasOwnProperty(propName)) return false;
    if (propA instanceof Object) {
      if (!isObjectValueEqual(propA, propB)) return false;
    } else if (propA !== propB) {
      return false;
    }
  }
  return true;
}

/**
 * @description 生成随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @returns {Number}
 */
export function randomNum(min: number, max: number): number {
  let num = Math.floor(Math.random() * (min - max) + max);
  return num;
}

/**
 * @description 获取当前时间对应的提示语
 * @returns {String}
 */
export function getTimeState() {
  let timeNow = new Date();
  let hours = timeNow.getHours();
  if (hours >= 6 && hours <= 10) return `早上好 ⛅`;
  if (hours >= 10 && hours <= 14) return `中午好 🌞`;
  if (hours >= 14 && hours <= 18) return `下午好 🌞`;
  if (hours >= 18 && hours <= 24) return `晚上好 🌛`;
  if (hours >= 0 && hours <= 6) return `凌晨好 🌛`;
}

/**
 * @description 获取浏览器默认语言
 * @returns {String}
 */
export function getBrowserLang() {
  let browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
  let defaultBrowserLang = '';
  if (['cn', 'zh', 'zh-cn'].includes(browserLang.toLowerCase())) {
    defaultBrowserLang = 'zh';
  } else {
    defaultBrowserLang = 'en';
  }
  return defaultBrowserLang;
}

/**
 * @description 获取不同路由模式所对应的 url + params
 * @returns {String}
 */
export function getUrlWithParams() {
  const url = {
    hash: location.hash.substring(1),
    history: location.pathname + location.search
  };
  return url[mode];
}

/**
 * @description 使用递归扁平化菜单，方便添加动态路由
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 */
export function getFlatMenuList(menuList: Menu.MenuOptions[]): Menu.MenuOptions[] {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.flatMap(item => [item, ...(item.children ? getFlatMenuList(item.children) : [])]);
}

/**
 * @description 使用递归过滤出需要渲染在左侧菜单的列表 (需剔除 isHide == true 的菜单)
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 * */
export function getShowMenuList(menuList: Menu.MenuOptions[]) {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.filter(item => {
    item.children?.length && (item.children = getShowMenuList(item.children));
    return !item.meta?.isHide;
  });
}

/**
 * @description 使用递归找出所有面包屑存储到 pinia/vuex 中
 * @param {Array} menuList 菜单列表
 * @param {Array} parent 父级菜单
 * @param {Object} result 处理后的结果
 * @returns {Object}
 */
export const getAllBreadcrumbList = (menuList: Menu.MenuOptions[], parent = [], result: { [key: string]: any } = {}) => {
  for (const item of menuList) {
    result[item.path] = [...parent, item];
    if (item.children) getAllBreadcrumbList(item.children, result[item.path], result);
  }
  return result;
};

/**
 * @description 使用递归处理路由菜单 path，生成一维数组 (第一版本地路由鉴权会用到，该函数暂未使用)
 * @param {Array} menuList 所有菜单列表
 * @param {Array} menuPathArr 菜单地址的一维数组 ['**','**']
 * @returns {Array}
 */
export function getMenuListPath(menuList: Menu.MenuOptions[], menuPathArr: string[] = []): string[] {
  for (const item of menuList) {
    if (typeof item === 'object' && item.path) menuPathArr.push(item.path);
    if (item.children?.length) getMenuListPath(item.children, menuPathArr);
  }
  return menuPathArr;
}

/**
 * @description 递归查询当前 path 所对应的菜单对象 (该函数暂未使用)
 * @param {Array} menuList 菜单列表
 * @param {String} path 当前访问地址
 * @returns {Object | null}
 */
export function findMenuByPath(menuList: Menu.MenuOptions[], path: string): Menu.MenuOptions | null {
  for (const item of menuList) {
    if (item.path === path) return item;
    if (item.children) {
      const res = findMenuByPath(item.children, path);
      if (res) return res;
    }
  }
  return null;
}

/**
 * @description 使用递归过滤需要缓存的菜单 name (该函数暂未使用)
 * @param {Array} menuList 所有菜单列表
 * @param {Array} keepAliveNameArr 缓存的菜单 name ['**','**']
 * @returns {Array}
 * */
export function getKeepAliveRouterName(menuList: Menu.MenuOptions[], keepAliveNameArr: string[] = []) {
  menuList.forEach(item => {
    item.meta.isKeepAlive && item.name && keepAliveNameArr.push(item.name);
    item.children?.length && getKeepAliveRouterName(item.children, keepAliveNameArr);
  });
  return keepAliveNameArr;
}

/**
 * @description 格式化表格单元格默认值 (el-table-column)
 * @param {Number} row 行
 * @param {Number} col 列
 * @param {*} callValue 当前单元格值
 * @returns {String}
 * */
export function formatTableColumn(row: number, col: number, callValue: any) {
  // 如果当前值为数组，使用 / 拼接（根据需求自定义）
  if (isArray(callValue)) return callValue.length ? callValue.join(' / ') : '--';
  return callValue ?? '--';
}

/**
 * @description 处理 ProTable 值为数组 || 无数据
 * @param {*} callValue 需要处理的值
 * @returns {String}
 * */
export function formatValue(callValue: any) {
  // 如果当前值为数组，使用 / 拼接（根据需求自定义）
  if (isArray(callValue)) return callValue.length ? callValue.join(' / ') : '--';
  return callValue ?? '--';
}

/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 * @param {Object} row 当前行数据
 * @param {String} prop 当前 prop
 * @returns {*}
 * */
export function handleRowAccordingToProp(row: { [key: string]: any }, prop: string) {
  if (!prop.includes('.')) return row[prop] ?? '--';
  prop.split('.').forEach(item => (row = row[item] ?? '--'));
  return row;
}

/**
 * @description 处理 prop，当 prop 为多级嵌套时 ==> 返回最后一级 prop
 * @param {String} prop 当前 prop
 * @returns {String}
 * */
export function handleProp(prop: string) {
  const propArr = prop.split('.');
  if (propArr.length == 1) return prop;
  return propArr[propArr.length - 1];
}

/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 字典列表
 * @param {Array} fieldNames label && value && children 的 key 值
 * @param {String} type 过滤类型（目前只有 tag）
 * @returns {String}
 * */
export function filterEnum(callValue: any, enumData?: any, fieldNames?: FieldNamesProps, type?: 'tag') {
  const value = fieldNames?.value ?? 'value';
  const label = fieldNames?.label ?? 'label';
  const children = fieldNames?.children ?? 'children';
  let filterData: { [key: string]: any } = {};
  // 判断 enumData 是否为数组
  if (Array.isArray(enumData)) filterData = findItemNested(enumData, callValue, value, children);
  // 判断是否输出的结果为 tag 类型
  if (type == 'tag') {
    return filterData?.tagType ? filterData.tagType : '';
  } else {
    return filterData ? filterData[label] : '--';
  }
}

/**
 * @description 递归查找 callValue 对应的 enum 值
 * */
export function findItemNested(enumData: any, callValue: any, value: string, children: string) {
  return enumData.reduce((accumulator: any, current: any) => {
    if (accumulator) return accumulator;
    if (current[value] === callValue) return current;
    if (current[children]) return findItemNested(current[children], callValue, value, children);
  }, null);
}
/*
 * 日期时间格式化：将时间对象或者时间戳转成自定义格式的时间字符串
 * datetime 要格式化的日期时间对象或者时间戳
 * format 时间格式化的模板格式，例如：yyyy-mm-dd hh:ii:ss
 * TG迁移的工具函数  这两个常用
 */
function isString(variable: any) {
  return typeof variable === 'string' && variable.constructor == String;
}

export function dateFormat(datetime: any, format: any) {
  let dt: any = '';
  datetime = isString(datetime) ? datetime.replace(/\-/g, '/') : datetime;
  if (/^\d+$/.test(datetime) || Date.parse(datetime)) {
    // 如果是时间戳，转成日期对象
    dt = new Date(datetime);
  } else if (isNaN(datetime)) {
    return ''; // 如果时间不对，则返回空
  } else {
    dt = datetime;
  }
  let fmt = format == undefined ? 'yyyy-mm-dd' : format;
  // 格式化正则替换映射定义（最多两位）
  const rep: any = {
    'm+': dt.getMonth() + 1, // 月
    'd+': dt.getDate(), // 日
    'h+': dt.getHours(), // 时
    'i+': dt.getMinutes(), // 分
    's+': dt.getSeconds(), // 秒
    'q+': Math.floor((dt.getMonth() + 3) / 3), // 季（当前是第几季度）
    'e+': dt.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    // 针对年份，单独处理
    fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + '').substr(4 - RegExp.$1.length)); // 取出具体年份，替换格式里的yyyy符号，根据y的个数截取后N位，最多4位
  }
  for (const k in rep) {
    // 循环所有对应的替换规则，逐一替换
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? rep[k] : ('00' + rep[k]).substr(('' + rep[k]).length)); // 只保留一位的直接替换，两位的前拼“00”，截取后两位再替换，保证每一项都是两位
    }
  }
  return fmt; // 返回替换后的结果
}
export function deepClone(target: any) {
  let result: any;
  if (typeof target === 'object') {
    if (Array.isArray(target)) {
      result = [];
      for (const i in target) {
        result.push(deepClone(target[i]));
      }
    } else if (target === null) {
      result = null;
    } else if (target.constructor == RegExp) {
      result = target;
    } else {
      result = {};
      for (const i in target) {
        result[i] = deepClone(target[i]);
      }
    }
  } else {
    result = target;
  }
  return result;
}

export const getValueByProp = (obj: any, prop: any) => {
  if (/\./.test(prop) && /\//.test(prop)) {
    const keys = prop.split('/');
    let current = obj;
    let _data = '';
    keys.forEach(item => {
      let _value = '';
      const _keys = item.split('.');

      if (!_keys.length) _value = current[item];
      else {
        for (const key of _keys) {
          if (_value) _value = _value[key];
          else _value = current[key];
        }
      }

      _data += _value ? ' / ' + _value : '';
    });
    return _data.slice(3);
  } else if (/\./.test(prop)) {
    const keys = prop.split('.');
    let current = obj;
    for (const key of keys) {
      if (current[key] === undefined) {
        return undefined;
      }
      current = current[key];
    }

    return current;
  } else if (/\//.test(prop)) {
    const keys = prop.split('/');
    let current = obj;
    let _data = '';
    keys.forEach(item => {
      if (current[item]) _data += current[item] + '/';
    });

    return _data.slice(0, -1);
  } else {
    return obj[prop];
  }
};

export const exportStream: (res: any) => Promise<{ code: number }> = res => {
  return new Promise(resolve => {
    const loadStream = window.URL.createObjectURL(new Blob([res.data]));
    const contentDisposition = res.headers['content-disposition'] || '';
    const encodedFilename = contentDisposition.split('=')[1];
    const fileName = decodeURIComponent(encodedFilename);

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = loadStream;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(loadStream);
    resolve({ code: 200 });
  });
};
