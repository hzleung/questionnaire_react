/*
 * @Description: 403页面
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: admin
 * @LastEditTime: 2019-10-11 15:46:28
 */
import React from 'react';
import Link from 'umi/link';
import { Exception } from '@/components';

const Exception403 = () => (
  <Exception type="403" desc="抱歉，你无权访问该页面" linkElement={Link} backText="返回首页" />
);

export default Exception403;
