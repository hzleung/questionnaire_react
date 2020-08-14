/*
 * @Description: 登录model
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: zengweijin
 * @LastEditTime: 2020-07-15 15:52:39
 */
import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { reqPostLogin, reqPostLogout, reqPostTryLoginUserInfo,reqPostAuthLogin } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { setUserCache, getUserCache, removeUserCache } from '@/utils/utils';
const urlencode = require('urlencode');

// 初始化缓存
const initState = {
    user: getUserCache(),
};

//获取url参数
let getQueryString = (name) => {
    return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[, ''])[1].replace(/\+/g, '%20')) || null
};

const handleLoginSucess = (data,redirect_url='/') => { 
    // 设置登录缓存
    setUserCache(data);
    // 设置权限
    if (data.authorization && typeof data.authorization === 'object') {
        let authoritys = [];
        for (let authorKey in data.authorization) {
            authoritys.push(authorKey);
        }
        setAuthority(authoritys);
    } else if (data.authorization && typeof data.authorization === 'string') {
        setAuthority(data.authorization);
    } else {
        setAuthority('noAuthority');
    }
    // 跳转首页
    router.push(redirect_url);
}
export default {
    namespace: 'login',
    state: {
        ...initState,
    },
    // subscriptions: {
    //     setupHistory({ dispatch, history }) { 
    //         // 监听 history 变化，没登录就跳到/login
    //         return history.listen(({ pathname, search }) => {
    //             const token = getUserCache();
    //             if (!token.userId && pathname !== '/user/login') {
    //                 // history.replace('/user/login');
    //                 // location.reload();
    //                 dispatch({
    //                     type:'tryLoginUserInfo'
    //                 })
    //             }
    //         });
    //     },
    // },
    effects: {
        *fetchLogin({ payload: formData }, { put, call, select }) {
            // 发起登录请求
            const res = yield call(reqPostLogin, formData);
            const { meta, data } = res;
            if (meta.success) {
                yield put({
                    type: 'setData',
                    payload: { user: data },
                });
                handleLoginSucess(data)
            } else {
                Toast.fail(meta.message || '登录失败');
                yield put({
                    type: 'clearData',
                });
            }
        },
        *fetchLoginOut({ }, { put, call, select }) {
            const res = yield call(reqPostLogout, {});
            const { meta, data } = res;
            if (meta.success) {
                // 清除缓存
                removeUserCache();
                setAuthority('noAuthority');

                yield put({
                    type: 'clearData',
                });
                // 跳转登录页
                router.push('/user/login');
            } else {
                Toast.fail(meta.message || '退出失败');
            }
        },
        *tryLoginUserInfo({ }, { put, call, select }) {
            const res = yield call(reqPostTryLoginUserInfo);
            const { meta, data } = res;
            console.log(res)
            if (meta.success) {
                yield put({
                    type: 'setData',
                    payload: { user: data },
                });
                handleLoginSucess(data)
            } else {
                //是否是微信单点登录
                if (window.location.href.indexOf('appKey') !== -1) {
                    let redirect_url = window.location.href.split('?')[0];
                    let params1 = window.location.href.split('?')[1];
                    let params2 = params1.split('#/')[0];
                    let tabKey2 = querystring.parse(params2);
                    let params = {
                        code: tabKey2.code,
                        appKey: tabKey2.appKey
                    };
                    // 先登出
                    const logoutRes = yield call(reqPostLogout, {});
                    if (logoutRes.meta.success) {
                        // 清除缓存
                        removeUserCache();
                        setAuthority('noAuthority');

                        yield put({
                            type: 'clearData',
                        });
                    }
                    // 登入
                    const loginRes = yield call(reqPostLogin, params);
                    if (loginRes.meta.success) {
                        yield put({
                            type: 'setData',
                            payload: { user: loginRes.data },
                        });
                        handleLoginSucess(loginRes.data,redirect_url)
                    }
                } else if(window.casStatus) {
                    // 是否启用认证单点登录
                    //跳转至单点登录验证页面
                    window.location = window.location.origin + window.location.pathname + 'auth?service=' + urlencode(window.location.origin + window.location.pathname);
                 
                    
                //使用Authorization的 Token模式登录    
                } else if(window.location.href.indexOf('Authorization') != -1){    
                    let Authorization = getQueryString("Authorization");
                    let headers = {
                        'Authorization':Authorization    
                    }
                    const res = yield call(reqPostAuthLogin, headers,{});
                    if (meta.success) {
                        yield put({
                            type: 'setData',
                            payload: { user: data },
                        });
                    handleLoginSucess(data)
                    }else{
                        router.push('/user/login')
                    }    
                } else {
                    router.push('/user/login')
                }
            }
        }
    },
    reducers: {
        setData(state, { payload }) {
            return { ...state, ...payload };
        },
        clearData(state, { }) {
            return { user: {} };
        },
    }

    
}
