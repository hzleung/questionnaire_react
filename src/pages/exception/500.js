/*
 * @Description: 500页面
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: admin
 * @LastEditTime: 2019-10-14 14:35:16
 */
import React from 'react';
import Link from 'umi/link';
import { Exception } from '@/components';

const Exception500 = () => (
  <Exception type="500" desc="抱歉，服务器出错了" linkElement={Link} backText="返回首页" />
);

export default Exception500;
