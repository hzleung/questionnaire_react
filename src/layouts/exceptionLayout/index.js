/*
 * @Description: 错误相关页面布局
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: admin
 * @LastEditTime: 2019-10-11 15:44:58
 */
import React, { PureComponent } from 'react';

class Exception extends PureComponent {
  render() {
    const { children } = this.props;

    return <div>{children}</div>;
  }
}

export default Exception;
