import { local, session } from '@/utils/store';

// 默认权限
const defaultAuthority = ['admin'];

/**
 * 获取权限
 * @param {*} str
 * @returns
 */
export function getAuthority(str) {
  const authorityString = typeof str === 'undefined' ? session.get('authority') : str;
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || defaultAuthority;
}

/**
 * 设置权限
 * @param {*} authority
 * @returns
 */
export function setAuthority(authority) {
  const Authority = typeof authority === 'string' ? [authority] : authority;
  return session.set('authority', Authority);
}
