/*
 * @Description: 全局公用model
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: zengweijin
 * @LastEditTime: 2020-07-15 15:16:59
 */
import { reqPostLogin } from '@/services/api';
import { setUserCache, getUserCache, removeUserCache } from '@/utils/utils';

// 登录地址
const loginUrl = '/user/login';

export default {
  namespace: 'global',
  state: {},
  subscriptions: {
    setuprouter({ dispatch, history }) {
      // 监听 router 变化，没登录就跳到
      return history.listen(({ pathname, search }) => {
        if (pathname !== loginUrl) {
          const userInfo = getUserCache();
          if (!userInfo.userId) {
            // history.push(loginUrl);
            dispatch({
                type:'login/tryLoginUserInfo'
            })
          }
        }
      });
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      //   const response = yield call(query, payload);
      //   yield put({
      //     type: 'save',
      //     payload: response,
      //   });
    },
  },
  reducers: {
    save(state) {
      return {
        ...state,
      };
    },
  },
};
