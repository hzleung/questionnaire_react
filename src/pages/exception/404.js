/*
 * @Description: 404页面
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: admin
 * @LastEditTime: 2019-10-11 15:48:37
 */
import React from 'react';
import Link from 'umi/link';
import { Exception } from '@/components';

const Exception404 = () => (
  <Exception type="404" desc="抱歉，你访问的页面不存在" linkElement={Link} backText="返回首页" />
);

export default Exception404;
