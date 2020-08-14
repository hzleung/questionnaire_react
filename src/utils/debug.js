/*
 * @Description: 导入debug
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: admin
 * @LastEditTime: 2019-10-11 16:04:11
 */
import ImportCDNJS from 'import-cdn-js';

export default () =>
  new Promise(resolve => {
    if (window.location.href.includes('isDebug=true')) {
      ImportCDNJS(
        '//res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/3.0.0/vconsole.min.js',
        'VConsole'
      ).then(VConsole => {
        new VConsole();
        resolve();
      });
    } else {
      resolve();
    }
  });
