/*
 * @Description: 权限验证
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: admin
 * @LastEditTime: 2019-10-11 15:51:57
 */
import React from 'react';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';
import Redirect from 'umi/redirect';



export default ({ children }) => {
  const Authority = getAuthority();
  const Authorized = RenderAuthorized(Authority);
  return <Authorized authority={children.props.route.authority} noMatch={<Redirect to="/exception/403" />}>
    {children}
  </Authorized>
}
  

