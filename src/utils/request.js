/*
 * @Description: 封装axios方法
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: zengweijin
 * @LastEditTime: 2020-04-24 13:48:36
 */

import axios from 'axios';
import { Toast, Modal } from 'antd-mobile';
import { local, session } from '@/utils/store';
import router from 'umi/router';
import qs from 'qs';
const alert = Modal.alert;

// 备用提示信息
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

window.flag = false; //弹出层标记

// 请求超时[config]:showTimeout    1.[true]:显示提示 2.["again"]:显示再次提示弹出框
axios.defaults.timeout = 6000;
axios.defaults.withCredentials = true;
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, PUT, DELETE, OPTIONS';
axios.defaults.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, X-Auth-Token';
axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest'; //Ajax get请求标识
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'; //Ajax post请求标识
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'; //POST请求参数获取不到的问题
axios.defaults.headers.post['Accept'] = 'application/json'; //POST请求参数获取不到的问题
axios.defaults.headers.put['X-Requested-With'] = 'XMLHttpRequest'; //Ajax put请求标识
axios.defaults.headers.delete['X-Requested-With'] = 'XMLHttpRequest'; //Ajax delete请求标识

axios.interceptors.response.use(
  function (response) {
    // 用户未授权，页面跳转到登录页面
    if (response.status == 401 && response.data.code == '53000010' && !window.loginWarnflag) {
      window.loginWarnflag = true; // 标记当前是否有登录提示弹出框
      const returnUrl = encodeURIComponent(window.location.href); // 登录后需返回的 url
      alert('提示', '登录已过期！', [
        {
          text: '重新登录',
          onPress: () => {
            // 清空缓存
            session.clear();
            window.loginWarnflag = false; // 重置
          },
        },
      ]);
    }

    // 备用
    // if (status === 403) {
    //     router.push('/Exception/403');
    //     return;
    //   }
    //   if (status <= 504 && status >= 500) {
    //     router.push('/Exception/500');
    //     return;
    //   }
    //   if (status >= 404 && status < 422) {
    //     router.push('/404');
    //   }

    return response;
  },
  function (error) {
    // 请求超时[config]:showTimeout    1.[true]:显示提示 2.["again"]:显示再次提示弹出框
    if (
      error.config.showTimeout &&
      error.code == 'ECONNABORTED' &&
      error.message.indexOf('timeout') != -1 &&
      !window.timeoutWarnflag
    ) {
      window.timeoutWarnflag = true; // 标记当前是否有超时提示弹出框
      if (error.config.showTimeout == 'again') {
        const timeoutModal = alert('提示', '请求超时是否重试？', [
          {
            text: '取消',
            onPress: () => {
              window.timeoutWarnflag = false; // 重置
            },
          },
          {
            text: '重试',
            onPress: () => {
              timeoutModal.destroy();
              window.timeoutWarnflag = false; // 重置
              return axios.request(error.config);
            },
          },
        ]);
      } else {
        Toast.info('请求超时!', 3, () => {
          window.timeoutWarnflag = false; // 重置
        });
      }
    }
    // 用户未授权，页面跳转到登录页面
    if (
      error.response &&
      error.response.status == 401 &&
      error.response.data &&
      error.response.data.code == '53000010' &&
      !window.loginWarnflag
    ) {
      window.loginWarnflag = true; // 标记当前是否有登录提示弹出框
      const returnUrl = encodeURIComponent(window.location.href); // 登录后需返回的 url
      alert('提示', '登录已过期！', [
        {
          text: '重新登录',
          onPress: () => {
            // 清空缓存
            session.clear()
            window.loginWarnflag = false; // 重置
            // window.location = deployBaseR + `${auth.loginUri}?returnUrl=${returnUrl}`;
          },
        },
      ]);
    }

    // 超时
    if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1 && !error.response) {
      error.response = {
        status: 504,
        statusText: 'timeout',
        data: {
          data: false,
          meta: {
            message: '请求超时!',
            statusCode: 504,
            success: false,
          },
        },
      };
    }

    return error.response ? error.response : error;
  }
);

axios.interceptors.request.use(function (config) {
  // const user = JSON.parse(Cookies.get("user") || "{}");
  // 没有登录跳到登录页
  // if (!user.userName) {
  //     // 排除路径
  //     let isAuthPath = true; // 是否需认证路径
  //     if (auth.excludePaths && auth.excludePaths.length > 0) {
  //         for (let excludePath of auth.excludePaths) {
  //             let regexp = new RegExp(excludePath);
  //             if (regexp.test(config.url)) {
  //                 isAuthPath = false;
  //             }
  //         }
  //     }

  //     if (isAuthPath) {
  //         if (!window.loginWarnflag) {
  //             window.loginWarnflag = true; // 标记当前是否有登录提示弹出框
  //             const returnUrl = encodeURIComponent(window.location.href); // 登录后需返回的 url
  //             Modal.warning({
  //                 title: "提示",
  //                 key: "1",
  //                 content: "会话已过期！",
  //                 okText: "重新登录",
  //                 onOk() {
  //                     // 清空缓存
  //                     local.clear()

  //                     window.loginWarnflag = false; // 重置
  //                     window.location = deployBaseR + `${auth.loginUri}?returnUrl=${returnUrl}`;
  //                 }
  //             });
  //         }
  //         return false;
  //     }
  // }

  let user = session.get('currentUser') || {};
  if (user != null) {
    config.headers.post['loginUserOrgId'] = user.orgId;
    config.headers.post['loginUserId'] = user.userId;
    config.headers.get['loginUserId'] = user.userId;
    config.headers.get['loginUserOrgId'] = user.orgId;

    const Authorization = user.tokenId;
    if (Authorization != null && Authorization != '') {
      config.headers.delete['Authorization'] = Authorization;
      config.headers.get['Authorization'] = Authorization;
      config.headers.post['Authorization'] = Authorization;
      config.headers.put['Authorization'] = Authorization;
    }
  }

  //添加get请求参数
  if (config.method == 'get') {
    config.params = {
      ...config.params,
      _t: Date.parse(new Date()) / 1000,
    };
  } else {
    config.params = {
      ...config.params,
      _t: Date.parse(new Date()) / 1000,
    };
  }
  return config;
});

export default axios;

export function query(url, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params: params, ...config })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

// 导出数据
export function exportDataExcel(url, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, { ...params }, { responseType: 'blob', ...config })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

// 导出模板
export function exportTemplateExcel(url, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params: params, responseType: 'blob', ...config })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}
//Excel导入post请求会有post参数也可能有get参数,请求的一些系列配置
export function importExcel(url, datas, config) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, datas, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

//post请求会有post参数也可能有get参数
export function post(url, datas, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, datas, { params: params, ...config })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function postForm(url, datas, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, qs.stringify(datas), { params: params, ...config })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}
// 使用Authorization统一验证登录
export function authLoginForm(url, headers, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, qs.stringify(params),{headers})
      .then(res => {
        console.log(res);
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}




export function get(url, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params: params, ...config })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function insert(url, datas, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, datas, { params: params, ...config })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function update(url, datas, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, datas, { params: params, ...config })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function remove(url, datas, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, datas, { params: params, ...config })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function requestAll(...paramsFun) {
  return new Promise((resolve, reject) => {
    axios
      .all(...paramsFun)
      .then(
        axios.spread(function (...response) {
          let responseList = [];
          for (let res of response) {
            if (!res.status && res.response) {
              responseList.push(res.response.data);
            } else {
              responseList.push(res.data);
            }
          }
          return responseList;
        })
      )
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}
