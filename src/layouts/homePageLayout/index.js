import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Header } from '@/components';
import withRouter from 'umi/withRouter';
import Authorized from '@/utils/Authorized';
import { connect } from 'dva';
import { getRouterAuthority, getRouterInfo, nProgressDone } from '@/utils/utils';
import Exception403 from '@/pages/exception/403';
import { Icon } from 'antd-mobile';

import styles from './index.less';

/**
 * 首页-布局
 * @author: zengxiangkai
 * @date: 2020-04-13 13:48:47
 */
class HomePageLayout extends PureComponent {

    close = () => {
        this.props.dispatch({
            type: 'login/fetchLoginOut',
            payload: null,
            search: search,
        });
    }

    render() {

        const { children, loading, location: { pathname }, route: { routes } } = this.props;

        const routerConfig = getRouterAuthority(pathname, routes);
        let title = getRouterInfo(pathname, routes, 'title');

        // 页面加载进度条
        nProgressDone(!loading.global);

        return (
            <div className={styles.content}>
                <Header title={title} leftContent={<Icon type="cross" color={'#000'} onClick={this.close} />} hideHome />
                <Authorized authority={routerConfig} noMatch={<Exception403 />}>
                    {children}
                </Authorized>
            </div>
        )
    }
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(HomePageLayout));
