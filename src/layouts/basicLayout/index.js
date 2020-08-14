/*
 * @Description: 基础布局
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: admin
 * @LastEditTime: 2019-10-11 15:39:17
 */
import React, { PureComponent } from 'react';
import withRouter from 'umi/withRouter';
import Authorized from '@/utils/Authorized';
import pathToRegexp from 'path-to-regexp';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'dva';
import { getRouterAuthority, getRouterInfo, nProgressDone } from '@/utils/utils';
import { Header } from '@/components';
import Exception403 from '@/pages/exception/403';
import styles from './index.less';

class BasicLayout extends PureComponent {
    render() {
        const {
            children,
            loading,
            location: { pathname, query },
            route: { routes },
        } = this.props;
        const routerConfig = getRouterAuthority(pathname, routes);
        // 当页面需要自定义标题时，可在路由跳转时传入navName参数
        let title;
        let { nav } = query;
        if (nav && nav.trim().length > 0) {
            title = nav;
            title = title.trim().length > 15 ? title.substr(0, 15) + '...' : title.trim();
        } else {
            title = getRouterInfo(pathname, routes, 'title');
        }

        // 页面加载进度条
        nProgressDone(!loading.global);

        return (
            <div className={styles.page_basic_layout}>
                {/* 头部 */}
                <Header title={title} />
                {/* 内容 */}
                <ReactCSSTransitionGroup
                    transitionName="transitionWrapper"
                    component="div"
                    className={styles.transitionWrapper}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}
                >
                    <div key={pathname} style={{ position: 'absolute', width: '100%', height: '100%' }}>
                        <Authorized authority={routerConfig} noMatch={<Exception403 />}>
                            {children}
                        </Authorized>
                    </div>
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(BasicLayout));
