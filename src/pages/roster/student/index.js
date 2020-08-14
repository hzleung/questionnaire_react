import React from 'react';
import { ListView, Toast, List, SearchBar } from 'antd-mobile';
import { connect } from 'dva';
import { router } from 'umi';

class StudentRoster extends React.Component {

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type:'studentRoster/queryStudent'
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type:'studentRoster/updateState',
            state:{
                data:[],
                page:1,
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
        router.push({
            pathname:`/roster/student/info`,
            query:{
                xsid:newuser.xsid,
            }
        });
    }
    renderRow = (rowData, sectionID, rowID) => {
        return (
            <List.Item onClick={() => this.handleItemOnchange(rowData)}>
                {rowData.xm}-{rowData.xh}
                <List.Item.Brief>{rowData.bmmc}/{rowData.zymc}/{rowData.bjmc}</List.Item.Brief>
            </List.Item>
        );
    }
    // 所有数据已经渲染完，需要获取新的数据
    onEndReached = (event) => {
        const { dispatch, hasMore } = this.props;
        if (hasMore) {
            dispatch({
                type:'studentRoster/loadMore'
            });
        } else {
            Toast.info('已加载所有数据',1);
        }
    }
    onSearch = value => {
        const { dispatch } = this.props;
        dispatch({
            type:'studentRoster/search',
            params:{
                keyword:value
            }
        });
    }
    handleSearchClear = () => {
        const { dispatch } = this.props;
        dispatch({
            type:'studentRoster/searchClear',
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
                        height:document.body.clientHeight - 50,
                        overflow: 'auto'
                    }}
                    dataSource={dataSource}
                    renderFooter={this.renderFooter}
                    renderRow={this.renderRow}
                    className="am-list"
                    pageSize={20}
                    onEndReached={this.onEndReached}
                />
            </div>
        );
    }

}

export default connect((state) => {
    return { ...state.studentRoster };
  }) (StudentRoster);
