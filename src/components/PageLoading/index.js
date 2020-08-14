/*
 * @Description: 页面加载中组件
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: admin
 * @LastEditTime: 2019-10-11 15:24:43
 */
import React from 'react';
import { ActivityIndicator } from 'antd-mobile';

export default () => (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '2rem',
      height: '2rem',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <ActivityIndicator animating size="large" />
      <span style={{ marginTop: 8 }}>加载中...</span>
    </div>
  </div>
);
