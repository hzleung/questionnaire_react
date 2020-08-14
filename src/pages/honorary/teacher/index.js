
import React from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { List } from 'antd-mobile';
const { Item } = List;

class PostFilterPage extends React.Component {

    componentDidMount() {
        const { location, dispatch } = this.props;
        const { search } = location;


        // 查询当前登录用户职务层级信息
        dispatch({
            type: 'honoraryTeacher/fetchPostLevelInfo',
            search,
        });

    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type:'honoraryTeacher/updateState',
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
            type: 'honoraryTeacher/updateState',
            state: { currentLevel: { value: v, text: t } },
        });
        router.push({
            pathname: '/honorary/teacher/pieStatistics/index',
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
            <List>
              {this.renderListItem()}
            </List>
          </div>
        );
    }
}

function mapStateToProps(state) {
    const { login, honoraryTeacher, loading } = state;
    return {
        user: login.user,
        ...honoraryTeacher,
        loading
    };
}

export default connect(mapStateToProps)(PostFilterPage);
