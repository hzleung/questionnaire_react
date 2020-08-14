import React from 'react';
import moment from 'moment';
import NProgress from 'nprogress';
import pathToRegexp from 'path-to-regexp';
import nzh from 'nzh/cn';
import { local, session } from '@/utils/store';
import { parse, stringify } from 'qs';

// 用户信息缓存key
const userCacheKey = 'currentUser';

/**
 * 获取登录缓存
 * @returns {object}
 */
export function getUserCache() {
  return session.get(userCacheKey) || {};
}

/**
 * 设置登录缓存
 * @param {*} key
 */
export function setUserCache(key) {
  session.set(userCacheKey, key);
}

/**
 * 清除登录缓存
 */
export function removeUserCache() {
  session.remove(userCacheKey);
}

/**
 * 是否微信环境
 * @returns {bool}
 */
export function isWeixn() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger');
}

/**
 * 获取路由访问权限
 * @param {*} pathname
 * @param {*} routeData
 * @param {string} [defaultAuthority='noAuthority']
 * @returns {string[]}
 */
export function getRouterAuthority(pathname, routeData, defaultAuthority = 'noAuthority') {
  let routeAuthority = [defaultAuthority];
  let exist = false;
  const getAuthority = (key, routes) => {
    routes.map(route => {
      if (route.path && pathToRegexp(route.path).test(key) && !exist) {
        routeAuthority = route.authority;
        exist = true;
      } else if (route.routes) {
        routeAuthority = getAuthority(key, route.routes);
      }
      return route;
    });
    return routeAuthority;
  };
  return getAuthority(pathname, routeData);
}

/**
 * 获取路由信息
 * @param {*} pathname
 * @param {*} routeData
 * @param {*} label 指定字段
 * @returns {any}
 */
export function getRouterInfo(pathname, routeData, label) {
  let res = undefined;
  let exist = false;
  const getRouter = (key, routes) => {
    routes.map(route => {
      if (route.path && pathToRegexp(route.path).test(key) && !exist) {
        res = label ? route[label] : route;
        exist = true;
      } else if (route.routes) {
        res = getRouter(key, route.routes);
      }
      return route;
    });
    return res;
  };
  return getRouter(pathname, routeData);
}

/**
 * 获取 路由配置中带有 NAME 属性的路由信息
 * @param routes
 */
export function getTabBarItems(routes) {
  if (routes && typeof routes === 'object') {
    return (routes || []).filter(item => item.title !== undefined);
  }
  return [];
}

NProgress.configure({ showSpinner: false });
let currHref = '';
/**
 * 页面加载进度条
 * @param {boolean} [isDone=false]
 */
export function nProgressDone(isDone = false) {
  const { href } = window.location; // 浏览器地址栏中地址
  if (currHref !== href) {
    // currHref 和 href 不一致时说明进行了页面跳转
    NProgress.start(); // 页面开始加载时调用 start 方法
    if (isDone) {
      // isDone 为 true 时表示加载完毕
      NProgress.done(); // 页面请求完毕时调用 done 方法
      currHref = href; // 将新页面的 href 值赋值给 currHref
    }
  }
}

/**
 * 数字补零
 * @param {*} val
 * @returns {string}
 */
export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

/**
 * 获取时间间隔
 * @param {*} type (today|week|month|year)
 * @returns [string, string]
 */
export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

/**
 * 获取路由节点
 * @param {*} nodeList
 * @param {string} [parentPath='']
 * @returns
 */
export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}
/**
 *
 *
 * 转中文金额
 * @param {*} n
 * @returns {string}
 */
export function digitUppercase(n) {
  return nzh.toMoney(n);
}

/**
 * 判断两者的关系
 * @param {*} str1
 * @param {*} str2
 * @returns {number} 1:str1包含str2、2:str2包含str1、3:str2不相关str1
 */
function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

/**
 * 获取路径（移除深度呈现）
 * @param {*} routes
 * @returns
 */
function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * 获取路由配置
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

/**
 * 获取路径参数
 * @returns {object}
 */
export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

/**
 * 获取url参数
 * @param {*} name
 * @returns {string}
 */
const getHashParam = name => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
    queryString = window.location.href.split('?')[1] || '',
    result = queryString.match(reg);
  return result ? decodeURIComponent(result[2]) : null;
};

/**
 * 根据参数得到路径
 * @param {string} [path='']
 * @param {*} [query={}]
 * @returns
 */
export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

// url地址正则
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

/**
 * 是否是Url地址
 * @param {*} path
 * @returns {bool}
 */
export function isUrl(path) {
  return reg.test(path);
}

/**
 * 格式化数字为万
 * @param {*} val
 * @returns {node}
 */
export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

/**
 *  获取 UUID
 * @param len 长度
 * @param radix 基数
 * @returns {string}
 */
export function generateUUID(len, radix) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = [];
  let i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    let r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

/**
 * 连字符转驼峰
 * @returns {string}
 */
String.prototype.hyphenToHump = function() {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase();
  });
};

/**
 * 驼峰转连字符
 * @returns {string}
 */
String.prototype.humpToHyphen = function() {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase();
};

/**
 * 日期格式化
 * @param {*} format
 * @returns
 */
Date.prototype.format = function(format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      );
    }
  }
  return format;
};

/**
 * 获取Url参数
 * @param  name {String}
 * @param  search {String}
 * @return  {String}
 */
export function queryURL(name, search) {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  let r = search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
export function queryArray(array, key, keyAlias = 'key') {
  if (!(array instanceof Array)) {
    return null;
  }
  const item = array.filter(_ => _[keyAlias] === key);
  if (item.length) {
    return item[0];
  }
  return null;
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
export function arrayToTree(array, id = 'id', pid = 'pid', children = 'children') {
  let data = cloneDeep(array);
  let result = [];
  let hash = {};
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index];
  });

  data.forEach(item => {
    let hashVP = hash[item[pid]];
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = []);
      hashVP[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}

/**
 * getLabelValueTree
 * @version 171221 1.0
 * @param {Arr} data 数据源
 * @param {Arr} children 子类键名
 */
export const getLabelValueTree = (
  Data,
  label = 'label',
  value = 'value',
  children = 'children'
) => {
  var data = JSON.parse(JSON.stringify(Data));
  var tree = [];
  for (var i in data) {
    if (data[i][children] && data[i][children].length) {
      tree.push({
        label: data[i][label],
        value: data[i][value],
        children: getLabelValueTree(data[i][children], label, value, children),
      });
    } else {
      tree.push({
        label: data[i][label],
        value: data[i][value],
      });
    }
  }
  return tree;
};

/**
 * 滚动到指定y轴坐标
 * @param {Int} y        文档y轴坐标
 * @param {Int} optimize 优化距离，当前scrollTop大于这个值，先去到这个点，再进行滚动
 */
export const scrollTo = (y = 0, optimize = 3000) => {
  if (document.documentElement.scrollTop || document.body.scrollTop > optimize) {
    document.documentElement.scrollTop = document.body.scrollTop = optimize;
  }

  const timer = setInterval(() => {
    //获取滚动条的滚动高度
    const osTop = document.documentElement.scrollTop || document.body.scrollTop;

    //用于设置速度差，产生缓动的效果
    const speed = Math.floor(-osTop / 10);

    //控制新滚动高度一定不能小于y
    const limit = osTop + speed <= y ? y : osTop + speed;
    document.documentElement.scrollTop = document.body.scrollTop = limit;

    if (osTop <= y) clearInterval(timer);
  }, 10);
};
