/*
 * @Description: 用户相关页面布局
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: admin
 * @LastEditTime: 2019-10-11 15:44:50
 */
import React from 'react';
import Link from 'umi/link';
import styles from './index.less';
import logo from '../../assets/svg/logo.svg';

class UserLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return <div className={styles.container}>{children}</div>;
  }
}

export default UserLayout;
