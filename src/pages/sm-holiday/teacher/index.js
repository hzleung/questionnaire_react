
import React from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { ActionSheet, Toast, Button, List } from 'antd-mobile';

import styles from './index.less';

const Item = List.Item;

// fix touch to scroll background page on iOS
// https://github.com/ant-design/ant-design-mobile/issues/307
// https://github.com/ant-design/ant-design-mobile/issues/163
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

/**
 * 请假管理-教师页面（数据查看范围选择）
 * @author: zengxiangkai
 * @date: 2020-04-17 16:04:56
 */
class TeacherIndexPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        const { user, location } = this.props;
        const { search } = location;

        let { userId = '' } = user;

        //查询当前登录用户职务层级信息
        this.props.dispatch({
            type: 'holiday_teacher/fetchPostLevelInfo',
            payload: { yhbh: userId },
            search: search,
        });

    }

    /**
     * * 列表项点击回调
     *
     * @memberof TeacherIndexPage
     */
    onListItemClick = (v, t, item) => {

        if (item && item.length > 1 && v != 'school') {

            const actionValues = [];
            const actionButtons = item.map(item => {

                if (item.ssnj) {
                    actionValues.push(item.zzjgid + "-" + item.ssnj);
                    return item.zzjgmc + "-" + item.ssnj + "级";
                } else {
                    actionValues.push(item.zzjgid);
                    return item.zzjgmc;
                }
            });

            ActionSheet.showActionSheetWithOptions(
                {
                    options: actionButtons,
                    maskClosable: true,
                    'data-seed': 'logId',
                    wrapProps,
                },
                (buttonIndex) => {
                    if(buttonIndex != -1) {
                        //保存选择的层级信息
                        this.props.dispatch({
                            type: 'holiday_teacher/saveCurrentPostLevel',
                            payload: { currentLevel: { value: v, text: t, zzjgid: actionValues[buttonIndex]} }
                        });
                        router.push('/sm-holiday/teacher/pieStatistics');
                    }
                }
            );
        } else {
            //当前层级只有一个组织机构时，默认选中
            if(v == 'grade') {
                this.props.dispatch({
                    type: 'holiday_teacher/saveCurrentPostLevel',
                    payload: { currentLevel: { value: v, text: t, zzjgid: item[0].zzjgid + '-' + item[0].ssnj } }
                });
            } else {
                this.props.dispatch({
                    type: 'holiday_teacher/saveCurrentPostLevel',
                    payload: { currentLevel: { value: v, text: t, zzjgid: item[0].zzjgid } }
                });
            }
            router.push('/sm-holiday/teacher/pieStatistics');
        }
        
    }

    /**
     * * 渲染列表项
     *
     * @memberof TeacherIndexPage
     */
    renderListItem = () => {
        const { postLevelList = [] } = this.props;

        //如果有多个职务层级，则提供数据层级范围选择器
        if (postLevelList.length >= 1) {

            let items = [];

            for (let i in postLevelList) {
                items.push(
                    <Item
                        key={i}
                        arrow="horizontal"
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick={
                            () => this.onListItemClick(postLevelList[i].value, postLevelList[i].text, postLevelList[i].levelOrgVOList)
                        }
                    >
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
    const { login, holiday_teacher, loading } = state;
    return {
        user: login.user,
        ...holiday_teacher,
        loading
    };
}

export default connect(mapStateToProps)(TeacherIndexPage);