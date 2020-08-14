
import React from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { List } from 'antd-mobile';

import styles from './index.less';

const { Item } = List;
/**
 * 请假管理-教师页面（数据查看范围选择）
 * @author: zengxiangkai
 * @date: 2020-04-17 16:04:56
 */
class TeacherIndexPage extends React.Component {

    componentDidMount() {
        const { location, dispatch } = this.props;
        const { search } = location;


        // 查询当前登录用户职务层级信息
        dispatch({
            type: 'teacherEvaluation/fetchPostLevelInfo',
            search,
        });

    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type:'teacherEvaluation/updateState',
            state:{
                postLevelList:[]
            }
        });
      }

    /**
     * * 列表项点击回调
     *
     * @memberof TeacherIndexPage
     */
    onListItemClick = (v, t) => {
        const { dispatch } = this.props;
        // 保存选择的层级信息
        dispatch({
            type: 'teacherEvaluation/updateState',
            state: { currentLevel: { value: v, text: t } },
        });
        router.push({
            pathname: '/teacher/evaluation/task',
            query: {
                level: v
            }
        });
    }

    /**
     * * 渲染列表项
     *
     * @memberof TeacherIndexPage
     */
    renderListItem = () => {
        const { postLevelList = [] } = this.props;

        // 如果有多个职务层级，则提供数据层级范围选择器
        if (postLevelList.length >= 1) {

            const items = [];

            for (const i in postLevelList) {
                items.push(
                  <Item key={i} arrow="horizontal" onClick={() => this.onListItemClick(postLevelList[i].value, postLevelList[i].text)}>
                    {postLevelList[i].text}
                  </Item>
                );
            }
            return items;
        }
        return null;
    }

    render() {
        return (
          <div>
            <List className={styles.list_item}>
              {this.renderListItem()}
            </List>
          </div>
        );
    }
}

function mapStateToProps(state) {
    const { login, teacherEvaluation, loading } = state;
    return {
        user: login.user,
        ...teacherEvaluation,
        loading
    };
}

export default connect(mapStateToProps)(TeacherIndexPage);
