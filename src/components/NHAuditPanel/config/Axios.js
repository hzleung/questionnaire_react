import axios from 'axios';
import qs from 'qs';
// import { Toast } from "antd-mobile";
// import getLoginUser from '../../../utils/getLoginUser';
// import { history } from 'dva';

// 注释原因，使用外部脚手架配置
// var baseAuthorization =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6Imp3dCJ9.eyJzdWIiOiJhZG1pbiIsImF1ZCI6InBjIiwiaXNzIjoiTElBTllJIiwianRpIjoiMDUyZWQzOTctOGQ2Zi00ZDBhLWIyZTgtZWNhNjkwOGFmN2FhIiwiaWF0IjoxNTQ2NTY1NTYzNDk0fQ.-ua77tOmVpnqa9XWNNjii0YtdaMFrw3Hj-FYGT-Glko";
// axios.defaults.withCredentials = true;
// axios.defaults.headers.get["X-Requested-With"] = "XMLHttpRequest"; //Ajax get请求标识
// axios.defaults.headers.post["X-Requested-With"] = "XMLHttpRequest"; //Ajax post请求标识
// axios.defaults.headers.post["Content-Type"] =
//     "application/x-www-form-urlencoded;charset=utf-8"; //POST请求参数获取不到的问题
// axios.defaults.headers.put["X-Requested-With"] = "XMLHttpRequest"; //Ajax put请求标识
// axios.defaults.headers.delete["X-Requested-With"] = "XMLHttpRequest"; //Ajax delete请求标识

// axios.interceptors.response.use(
//     function(response) {
//         if(response.data.meta) {
//             if (response.data.meta.statusCode == 302) {
//                 Toast.fail(response.data.meta.message);
//                 window.sessionStorage.removeItem("access_user");
//                 if (window.casStatus) {
//                     window.location =
//                         window.location.origin +
//                         window.location.pathname +
//                         "auth?service=" +
//                         encodeURIComponent(
//                             window.location.origin +
//                                 window.location.pathname +
//                                 "#/workspace"
//                         );
//                 } else {
//                     history.push("/");
//                 }
//             } else if (response.data.meta.statusCode == 401) {
//                 Toast.fail(response.data.meta.message);
//             }
//         }
//         return response;
//     },
//     function(error) {
//         if(error.response.data.meta) {
//             if (error.response.data.meta.statusCode == 302) {
//                 Toast.fail(error.response.data.meta.message);
//                 window.sessionStorage.removeItem("access_user");
//                 //window.indexRouter.push("/");
//                 if (window.casStatus) {
//                     window.location =
//                         window.location.origin +
//                         window.location.pathname +
//                         "auth?service=" +
//                         encodeURIComponent(
//                             window.location.origin +
//                                 window.location.pathname +
//                                 "#/workspace"
//                         );
//                 } else {
//                     history.push("/");
//                 }
//             } else if (error.response.data.meta.statusCode == 401) {
//                 Toast.fail(error.response.data.meta.message);
//             } else if (error.response.data.meta.statusCode == 500) {
//                 return error.response;
//             }
//         }
//     }
// );

// axios.interceptors.request.use(function(config) {
//     let user = getLoginUser();
//     let Authorization = window.sessionStorage.getItem("access_token") || baseAuthorization;
//     if(Authorization!=null && Authorization!='') {
//       config.headers.Authorization = Authorization;
//     }
//     if(user!=null) {
//       config.headers.loginUserId = user.userId;
//       config.headers.loginUserOrgId = user.orgId;
//     }


//     if (config.method == "get") {
//         config.params = {
//             _t: Date.parse(new Date()) / 1000,
//             ...config.params
//         };
//     }
//     return config;
// });

export function query(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params}).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data);
        });
    });
}

// 导出数据
export function exportDataExcel(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, {...params},{responseType:'blob'}).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err.data);
        });
    });
}

// 导出模板
export function exportTemplateExcel(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params,responseType:'blob'}).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err.data);
        });
    });
}

// post请求会有post参数也可能有get参数
export function post(url, datas, params) {
    return new Promise((resolve, reject) => {
        axios.post(url,datas,{params}).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data);
        });
    });
}

export function postForm(url, datas, params) {
    return new Promise((resolve, reject) => {
        axios.post(url,qs.stringify(datas),{params}).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data);
        });
    });
}

export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params}).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data);
        });
    });
}

export function insert(url, datas, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, datas,{params}).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data);
        });
    });
}

export function update(url, datas, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, datas,{params}).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data);
        });
    });
}

export function remove(url, datas, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, datas,{params}).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data);
        });
    });
}

export function requestAll(...paramsFun) {
    return new Promise((resolve, reject) => {
        axios.all(...paramsFun).then(axios.spread(function (...response) {
            const responseList = [];
            for(const res of response){
                if(!res.status && res.response){
                    responseList.push(res.response.data);
                }else{
                    responseList.push(res.data);
                }
            }
            return responseList;
        })).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err.data);
        });
    });
}
