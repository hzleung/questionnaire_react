/*
 * @Description: TabBar页面布局
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: admin
 * @LastEditTime: 2019-10-14 14:35:28
 */
import React from 'react';
import withRouter from 'umi/withRouter';
import { TabBar, Popover, Icon } from 'antd-mobile';
import router from 'umi/router';
import Authorized from '@/utils/Authorized';
import { getRouterAuthority, getRouterInfo, getTabBarItems } from '@/utils/utils';
import Exception403 from '@/pages/exception/403';
import { Header } from '@/components';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import theme from '../../theme';
import styles from './index.less';

// 导入svg图标
import { ReactComponent as Alipay } from '@/assets/svg/alipay.svg';
import { ReactComponent as AlipayUn } from '@/assets/svg/alipay-un.svg';
import { ReactComponent as Friend } from '@/assets/svg/friend.svg';
import { ReactComponent as FriendUn } from '@/assets/svg/friend-un.svg';
import { ReactComponent as Koubei } from '@/assets/svg/koubei.svg';
import { ReactComponent as KoubeiUn } from '@/assets/svg/koubei-un.svg';
import { ReactComponent as My } from '@/assets/svg/my.svg';
import { ReactComponent as MyUn } from '@/assets/svg/my-un.svg';

// svg图标
const iconList = {
  alipay: <Alipay />,
  'alipay-un': <AlipayUn />,
  friend: <Friend />,
  'friend-un': <FriendUn />,
  koubei: <Koubei />,
  'koubei-un': <KoubeiUn />,
  my: <My />,
  'my-un': <MyUn />,
};

class TabBarLayout extends React.PureComponent {
  /**
   * 渲染 TabBar 组件
   * @param pathname
   * @param routes
   * @returns {*}
   */
  getTabBar = (pathname, routes) => {
    let tabBarItems = getTabBarItems(routes);
    let tabBarItem = [];
    if (tabBarItems && tabBarItems.length > 0) {
      tabBarItem = tabBarItems.map(item => (
        <TabBar.Item
          title={item.title}
          key={`tab-bar-item-${item.path}`}
          icon={iconList[`${item.iconName || item.title}-un`]}
          selectedIcon={iconList[`${item.iconName || item.title}`]}
          selected={pathname === item.path}
          badge={0}
          onPress={() => {
            router.push(item.path);
          }}
          data-seed="logId"
        />
      ));

      return (
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          tabBarPosition="bottom"
        >
          {tabBarItem}
        </TabBar>
      );
    }
    return null;
  };

  render() {
    const {
      children,
      location: { pathname },
      route: { routes },
    } = this.props;

    let routerConfig = getRouterAuthority(pathname, routes);
    let title = getRouterInfo(pathname, routes, 'title');

    return (
      <div className="page-tabBar-content">
        {/* 头部 */}
        <Header title={title} hideBack hideHome />
        {/* 内容 */}
        <Authorized authority={routerConfig} noMatch={<Exception403 />}>
          {children}
        </Authorized>
        {/* TabBar */}
        <div className="page-tabBar">{this.getTabBar(pathname, routes)}</div>
      </div>
    );
  }
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(TabBarLayout));
