import React from 'react';
import { ListView, Button, Radio, Toast, List, SearchBar } from 'antd-mobile';
import { connect } from 'dva';
import { router } from 'umi';
import styles from './index.less';

class StudentSelector extends React.Component {

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type:'studentSelector/queryStudent'
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type:'studentSelector/updateState',
            state:{
                data:[],
                page:1,
                user:undefined
            }
        });
    }
    renderFooter = () => {
        if (this.props.isLoading) {
            return <div style={{ padding: 30, textAlign: 'center' }}>加载中...</div>;
        }
        return null;
    }
    handleItemOnchange = (newuser) => {
        // this.setState({user});
        const { dispatch,dataSource,data,user={} } = this.props;
        const index = data.findIndex(row => row.xsid === user.xsid);
        const newData = [...data];
        if (index > -1) {
            // 改变row的引用，使其重新渲染
            newData[index] = JSON.parse(JSON.stringify(user));
        }
        const index2 = data.findIndex(row => row.xsid === newuser.xsid);
        if (index2 > -1) {
            // 改变row的引用，使其重新渲染
            newData[index2] = JSON.parse(JSON.stringify(newuser));
        }
        dispatch({
            type:'studentSelector/updateState',
            state:{
                user:newuser,
                dataSource:dataSource.cloneWithRows(newData)
            }
        });
    }
    renderRow = (rowData, sectionID, rowID) => {
        const { user={} } = this.props;
        return (
            <div onChange={() => this.handleItemOnchange(rowData)}>
                <Radio.RadioItem
                    key={rowData.xsid} checked={user.xsid === rowData.xsid}
                >
                    {rowData.xm}-{rowData.xh}
                    <List.Item.Brief>{rowData.bmmc}/{rowData.zymc}/{rowData.bjmc}</List.Item.Brief>
                </Radio.RadioItem>
            </div>
        );
    }
    // 所有数据已经渲染完，需要获取新的数据
    onEndReached = (event) => {
        const { dispatch, hasMore } = this.props;
        if (hasMore) {
            dispatch({
                type:'studentSelector/loadMore'
            });
        } else {
            Toast.info('已加载所有数据',1);
        }
    }

    handleOkClick = () => {
        const { user } = this.props;
        if (user) {
            const { location:{ query:{lcid,title} } } = this.props;
            router.replace({
                pathname:`/process/apply/${lcid}`,
                query:{
                    personId:user.xsid,
                    nav:title
                }
            });
        } else {
            Toast.info('必须选择一个学生',1);
        }
    }
    onSearch = value => {
        const { dispatch } = this.props;
        dispatch({
            type:'studentSelector/search',
            params:{
                keyword:value
            }
        });
    }
    handleSearchClear = () => {
        const { dispatch } = this.props;
        dispatch({
            type:'studentSelector/searchClear',
        });
    }
    render() {
        const { dataSource } = this.props;
        return (
            <div>
                <SearchBar
                    placeholder="请输入学号或姓名"
                    onSubmit={this.onSearch}
                    onClear={this.handleSearchClear}
                />
                <ListView
                    style={{
                        height:document.body.clientHeight - 130,
                        overflow: 'auto'
                    }}
                    dataSource={dataSource}
                    // renderHeader={renderHeader}
                    renderFooter={this.renderFooter}
                    renderRow={this.renderRow}
                    className="am-list"
                    pageSize={20}
                    onEndReached={this.onEndReached}
                />
                <div className={styles.footer}>
                    <Button type={'primary'} onClick={this.handleOkClick}>确定</Button>
                </div>
            </div>
        );
    }

}

export default connect((state) => {
    return { ...state.studentSelector };
  }) (StudentSelector);
