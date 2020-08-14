/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { List, Button, WingBlank, WhiteSpace, TextareaItem, Toast, Modal, Picker, Icon, SearchBar, Pagination, Flex, Checkbox as mCheckbox } from 'antd-mobile';
import { createForm } from 'rc-form';
// import RadioGroup from '../NHRadioGroup/index'
// import CheckboxGroup from '../NHCheckboxGroup/index'
import { Radio, Checkbox, Row } from 'antd';
import { btnActionIdMap } from './config/data';
import { reqGetCommonRemark, reqGetUserList } from './config/api';
import styles from './node.less';


const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const CheckboxItem = mCheckbox.CheckboxItem;

const isNotEmpty = (value) => {
    return value !== undefined && value !== null && value !== '';
};
const add = require('../../assets/images/studentSutffMobile/common/add_user.png');
const icon_location = require('../../assets/images/studentSutffMobile/common/icon_location.png');

class AuditNode extends React.Component {

    static defaultProps = {
        type: 'userSelector', // 选择器类型：userSelector、deptSelector、roleSelector、postSelector
        title: '', // 选择器标题
        visible: false, // 是否显示选择器对话框
        width: 1000, // 对话框宽度
        isSingleSelection: false, // 是否单选，默认多选
        selectedKeys: '', // 用户之前选中的所有id字符串，以，分隔
        selectedNames: '', // 用户之前选中的所有name字符串，以，分隔
        selectedDeptId: '', // 用户之前选中的所有departmentId字符串，以，分隔。需要传部门id的情况
        onOk: () => { }, // 保存回调
        onCancel: () => { } // 取消回调
    };

    constructor(props) {
        super(props);
        this.state = {
            allNodeAuditUsers: { ...props.allNodeAuditUsers },
            remarkList: [],
            open: false,
            loading: false,
            loadingTree: false,
            treeData: [], // 树数据
            dataSource: [], // 列表数据
            total: 0,
            selectedTreeKeys: '', //（受控）选中的树节点
            expandedKeys: [], //展开的树节点
            searchValue: '', // 树搜索value
            autoExpandParent: true,
            selectedRowKeys: [], // 选中项的key数组
            selectedRows: [], // 选中项数据
            list: [],
            searchKeyword: '' //用户选择器搜索关键字值
        };
    }

    componentDidMount() {
        this.getRemarkList();
        this.getTableData();
    }

    UNSAFE_componentWillReceiveProps(nextprops) {
        if (nextprops.allNodeAuditUsers !== this.props.allNodeAuditUsers) {
            this.setState({ allNodeAuditUsers: { ...nextprops.allNodeAuditUsers } });
        }
    }

    params = {
        pageNum: 1,
        pageSize: 5,
        keyword: ''
    };

    // 分页改变
    handleTableChange = (e) => {
        this.params.pageNum = e;
        this.getTableData();
    };

    getTableData = () => {
        const { selectedTreeKeys } = this.state;
        let list = [];
        this.state.list && this.state.list.length > 0 &&
            this.state.list.map((item) => {
                list.push(item.value);
                return item;
            });
        const { type } = this.props;
        const apiMap = {
            userSelector: reqGetUserList,
        };
        const idMap = {
            userSelector: 'departmentsTreeId',
            deptSelector: 'parentId'
        };
        apiMap[type]({
            ...this.params,
            [idMap[type]]: selectedTreeKeys ? selectedTreeKeys : null,
            ...(type === 'userSelector' && { selectType: '1' }), // 查询类型（1-查询已经有的用户，0-查询还没有的用户）
            ...(type === 'roleSelector' && { status: '1' }) // 状态 0 禁用 1激活
        })
            .then((res) => {
                const { meta, data } = res;
                if (meta.success) {
                    if (list && list.length > 0) {
                        data.list && data.list.length > 0 &&
                            data.list.map((item) => {
                                if (list.indexOf(item.userId) != -1) {
                                    item.checked = true;
                                }
                                return item;
                            });
                    }
                    this.setState({ dataSource: data.list, total: data.total });
                } else {
                    Toast.info(meta.message);
                }
                this.setState({ loading: false });
            });
    }

    /**
     * * 用户选择器搜索
     *
     * @memberof AuditNode
     */
    onSearch = (e) => {
        this.params.keyword = e;
        this.params.pageNum = 1;
        this.getTableData();
    };

    /**
     * * 取消搜索
     *
     * @memberof AuditNode
     */
    onSearchCancel = () => {
        this.params.pageNum = 1;
        this.params.keyword = '';
        this.setState({ searchKeyword: '' });
        this.getTableData();
    }

    //用户选择器选择判断
    onChangeCheck = (val) => {
        let list = this.state.list;
        let dataSource = this.state.dataSource;
        let delIndex = '';
        list.map((item, index) => {
            if (val.userId == item.value) {
                delIndex = index;
            }
            return item;
        });
        if (delIndex === '') {
            let newObj = {};
            newObj.value = val.userId;
            newObj.label = val.userName;
            list.push(newObj);
            dataSource.map((item) => {
                if (val.userId == item.userId && item.checked !== true) {
                    item.checked = true;
                }
                return item;
            });
        } else {
            list.splice(delIndex, 1);
            dataSource.map((item) => {
                if (val.userId == item.userId && item.checked === true) {
                    item.checked = false;
                }
                return item;
            });
        }
        this.setState({ list, dataSource });
    }

    // 获取常用意见列表。后台返回结果是个编码后的用，分隔的字符串
    getRemarkList = () => {
        reqGetCommonRemark().then(res => {
            const { meta, data } = res;
            if (meta.success) {
                this.setState({
                    remarkList: decodeURIComponent(data.remark).split('##')
                });
            } else {
                Toast.error(meta.message);
            }
        });
    };

    handleNodeToolBarClick = (btnInfo) => {
        const { TOOLBARID: btnId, TOOLBARNAME: btnName } = btnInfo;
        const actionId = btnActionIdMap[btnId];
        const { form, submit } = this.props;
        // 判断操作按钮是否有设置对应的id
        if (!actionId) {
            Toast.fail('未绑定的actionId!');
        }
        // 操作按钮提示信息
        const msg0 = {
            BU1001: '您确认要提交本流程吗？',
            BU1002: '您确认要转交本文档吗？'
        };

        let params = this.getAllFormData();
        // 回退上一环节
        if (btnId === 'BU1004') {
            Modal.prompt('回退上一环节','请输入办理意见', [
                { text: '取消', onPress: () => { } },
                {
                    text: '确定', onPress: (value) => {
                        params = {
                            ...params,
                            actionId
                        };
                        //  console.log({...params,WF_Remark:value});
                        submit({...params,WF_Remark:value});
                    }
                }
            ]);
            return;
        }

        // 回退首环节按钮
        if (btnId === 'BU1005') {
            Modal.operation([
                {
                    text: '需要用户再次提交审批', onPress: () => {
                        params = {
                            ...params,
                            WF_IsBackFlag: '1',
                            actionId: 'GoToFirstNode'
                        };
                        // console.log(params);
                        Modal.prompt('回退首环节','请输入办理意见', [
                            { text: '取消', onPress: () => { } },
                            {
                                text: '确定', onPress: (value) => {
                                    //   console.log({...params,WF_Remark:value});
                                    submit({...params,WF_Remark:value});
                                }
                            }
                        ]);
                    }
                },
                {
                    text: '用户修改后直接提交给我', onPress: () => {
                        params = {
                            ...params,
                            WF_IsBackFlag: '2',
                            actionId: 'GoToFirstNode'
                        };
                        // console.log(params);
                        Modal.prompt('回退首环节','请输入办理意见', [
                            { text: '取消', onPress: () => { } },
                            {
                                text: '确定', onPress: (value) => {
                                    //   console.log({...params,WF_Remark:value});
                                    submit({...params,WF_Remark:value});
                                }
                            }
                        ]);
                    }
                },
            ]);
            return;
        }
        form.validateFields((err, values) => {
            if (err) {
                const msg = [];
                for (const error in err) {
                    err[error].errors.forEach(item => msg.push(item.message));
                }
                Toast.fail(msg[0]);
            } else {
                params = {
                    ...params,
                    actionId
                };
                Modal.alert('', msg0[btnId] ? msg0[btnId] : `您确认要${btnName}吗?`, [
                    { text: '取消', onPress: () => { } },
                    {
                        text: '确定', onPress: () => {
                            // console.log(params);
                            submit(params,true); //true代表需要保存表单内容
                        }
                    }
                ]);

            }
        });
    };



    getAllFormData = () => {
        const { processFormData, form } = this.props;
        const values = form.getFieldsValue();
        const {
            WF_NextNodeid,
            WF_SelCopyUser = [],
            WF_Remark,
            WF_OtherUserList,
            WF_SendToOtherUser,
            WF_SendToOtherUserAndBack
        } = values;
        const _currentNodeConfig = JSON.parse(processFormData.currentNodeConfig); // 当前节点

        // 后继节点参与者处理
        const _WF_NextUserList = [];
        let _WF_NextNodeid = [];
        if (WF_NextNodeid) {
            _WF_NextNodeid =
                typeof WF_NextNodeid === 'string'
                    ? [WF_NextNodeid]
                    : WF_NextNodeid; // 单选、多选
            for (const node of _WF_NextNodeid) {
                const data = values[`WF_${node}`];
                if (data) {
                    const userList = typeof data === 'string' ? [data] : data;
                    for (const user of userList) {
                        _WF_NextUserList.push(`${user}$${node}`);
                    }
                }
            }
        }


        // 传参
        const params = {
            docUnid: processFormData.docUnid,
            processId: processFormData.processId,
            nextNodeId: _WF_NextNodeid.join(','),
            nextUserList: _WF_NextUserList.join(','),
            appId: processFormData.appId,
            currentNodeId: processFormData.currentNodeId,
            currentNodeName: _currentNodeConfig.NODENAME,
            isNewDocFlag: processFormData.isNewDocFlag,
            isFirstNodeFlag: processFormData.isFirstNodeFlag,
            WF_CopyUserList: WF_SelCopyUser.join(','),
            WF_Remark,
            docStatus: processFormData.status,
            // 转他人处理
            ...(WF_OtherUserList && {
                otherUserList: WF_OtherUserList.join(','),
                sendToOtherUser: WF_SendToOtherUser ? 'on' : '',
                WF_ReassignmentFlag: WF_SendToOtherUserAndBack ? '2' : '1',
                nextUserList: WF_OtherUserList.join(',')
            }),
        };
        // console.log("👉全部数据: ", params);
        return params;
    };

    handleAddUserClick = key => () => {
        this.setState({ [key]: false });
    }

    handleAddUserClickOpen = key => () => {
        this.setState({ [key]: true });
    }

    handleOnOk = () => {
        const { form } = this.props;
        const { allNodeAuditUsers, list = [] } = this.state;
        const nodeId = form.getFieldValue('WF_NextNodeid');
        const allNodeAuditUsers0 = { ...allNodeAuditUsers };
        allNodeAuditUsers0[`WF_${nodeId}`] = allNodeAuditUsers0[`WF_${nodeId}`] || [];
        list.forEach(item0 => {
            if (allNodeAuditUsers0[`WF_${nodeId}`].findIndex(item => item.value === item0.value) === -1) {
                allNodeAuditUsers0[`WF_${nodeId}`] = [...allNodeAuditUsers0[`WF_${nodeId}`], item0];
            }
        });
        this.setState({
            allNodeAuditUsers: allNodeAuditUsers0,
            open: !this.state.open
        });
    }

    handleRemarkSelect = val => {
        const { form: { setFieldsValue } } = this.props;
        setFieldsValue({ 'WF_Remark': val[0] });
    }

    render() {
        const {
            processFormData: {
                currentNodeName = '',
                nextNodeConfig = '[]',
                currentNodeConfig = '{}',
                currentNodeToolbar = '[]',
                isFirstNodeFlag = 'true'
            },
            form: { getFieldProps, getFieldValue },
            selectedNextNodeList
        } = this.props;
        const { remarkList, dataSource = [], total, open } = this.state;
        const wrapRemarkList = remarkList.map(item => { return { value: item, label: item }; });
        const _nextNodeConfig = nextNodeConfig ? JSON.parse(nextNodeConfig) : []; // 后继节点
        const _currentNodeConfig = currentNodeConfig !== '' ? JSON.parse(currentNodeConfig) : {}; // 当前节点
        const _currentNodeToolbar = currentNodeToolbar
            ? JSON.parse(currentNodeToolbar)
            : []; // 操作按钮
        const _isFirstNodeFlag = isFirstNodeFlag
            ? JSON.parse(isFirstNodeFlag)
            : true; // 是否首环节
        const _isSendToOtherUser = getFieldValue('WF_SendToOtherUser'); // 是否转他人处理
        // console.log(this.props)
        const selectedNodeId = isNotEmpty(getFieldValue('WF_NextNodeid')) ? getFieldValue('WF_NextNodeid') : selectedNextNodeList[0];
        const selectedNode = _nextNodeConfig.find(item => item.NODEID === selectedNodeId) || {};
        // console.log(selectedNodeId, selectedNode)
        let auditUsers = this.state.allNodeAuditUsers[`WF_${selectedNodeId}`] || [];
        // console.log(auditUsers)
        auditUsers = auditUsers.filter(item => isNotEmpty(item.value) && isNotEmpty(item.label));
        const renderNextNodeItem = () => {
            const isHide = _currentNodeToolbar.some(item =>
                ['BU1006', 'BU1007', 'BU1009', 'BU1010'].includes(item.TOOLBARID)
            );

            // 转他人处理、以下按钮：BU1006, BU1007, BU1009, BU1010 不需要选择后继节点选项
            if (_isSendToOtherUser || isHide) {
                return null;
            }
            // console.log(selectedNode, selectedNextNodeList)
            return (
                <div style={{ background: 'rgba(242, 244, 247, 1)' }}>

                    <div className={styles.titleBox}>
                        <img src={icon_location} alt="" />
                        <div >当前节点：{currentNodeName || _currentNodeConfig.NODENAME}</div>
                    </div>
                    <div className={styles.nextstuff}>
                        <div className={styles.title}>后继节点</div>
                        <RadioGroup
                            className={styles.radio}
                            options={_nextNodeConfig.map(item => {
                                const row = {};
                                row.value = item.NODEID;
                                row.label = item.NodeName_Router;
                                return row;
                            })}
                            {...getFieldProps('WF_NextNodeid', {
                                initialValue: selectedNextNodeList[0],
                                rules: [{ required: true, message: '下一节点不能为空' }]
                            })}
                        />
                    </div>
                    <div className={styles.scale} />
                    {
                        selectedNode.USEPOSTOWNER === '1' && selectedNode.initType !== 'end' ?
                            <div className={styles.nextPeople}>
                                <div className={styles.title}>后继参与者</div>
                                <div className={styles.peopleBox}>
                                    <div className={styles.checkBoxTitle}>
                                        {
                                            _nextNodeConfig.filter(item => {
                                                return item.NODEID == getFieldValue('WF_NextNodeid');
                                            })[0].NodeName_Router
                                        } 参与者（多选）
                                    </div>
                                    <CheckboxGroup
                                        {...getFieldProps(`WF_${selectedNodeId}`, {
                                            initialValue: auditUsers.map(item => item.value),
                                            rules: [{ required: true, message: '审核人不能为空' }]
                                        })}
                                    >
                                        {auditUsers.map(item => <Row key={item.value}><Checkbox value={item.value}>{item.label}</Checkbox></Row>)}
                                    </CheckboxGroup>
                                    <div className={styles.scale_1} />
                                    <div className={styles.addUser} onClick={this.handleAddUserClickOpen('open')}>
                                        <img src={add} width={16} height={16} alt="" />
                                        <div>添加参与者</div>
                                    </div>
                                </div>
                            </div> : null
                    }
                    <WhiteSpace />
                </div>
            );
        };
        return (
            <div>
                <style>
                    {
                        `
                            .arrow-align {
                                display: flex;
                                align-items: center;
                                height:100%;
                            }
                        `
                    }
                </style>
                <Modal
                    popup
                    visible={open}
                    onClose={this.handleAddUserClick('open')}
                    maskClosable
                    title={"用户选择器"}
                    animationType="slide-up"
                >
                    <List>
                        <SearchBar
                            placeholder="请输入姓名或工号"
                            value={this.state.searchKeyword}
                            onChange={(s) => { this.setState({ searchKeyword: s }); }}
                            onSubmit={this.onSearch}
                            onCancel={this.onSearchCancel} />
                        {
                            dataSource && dataSource.length > 0 ?
                                dataSource.map((item, index) => {

                                    let itemTitle = item.userName + "(" + item.userId + ")";

                                    return (
                                        <CheckboxItem key={index} onChange={() => this.onChangeCheck(item)} checked={item.checked ? true : false}>
                                            <Flex>
                                                <Flex.Item>
                                                    {
                                                        itemTitle && itemTitle.length > 7 ? itemTitle.substring(0, 7) + '...' : itemTitle
                                                    }
                                                </Flex.Item>
                                                <Flex.Item>
                                                    {
                                                        item.departmentName && item.departmentName.length > 7 ? item.departmentName.substring(0, 7) + '...' : item.departmentName
                                                    }
                                                </Flex.Item>
                                            </Flex>
                                        </CheckboxItem>
                                    );
                                })
                                :
                                <div style={{ textAlign: "center", padding: '15px 5px' }}>暂无数据</div>
                        }
                        <Pagination
                            style={{ paddingTop: 5 }}
                            total={Math.ceil(total / 5) == 0 ? 1 : Math.ceil(total / 5)}
                            current={this.params.pageNum}
                            locale={{
                                prevText: (<span className="arrow-align"><Icon type="left" /></span>),
                                nextText: (<span className="arrow-align"><Icon type="right" /></span>),
                            }}
                            onChange={this.handleTableChange}
                        />
                        {
                            this.state.list && this.state.list.length > 0 ?
                                <Button type="primary" onClick={this.handleOnOk}>确定</Button>
                                :
                                <Button disabled onClick={this.handleOnOk}>确定</Button>
                        }

                    </List>
                </Modal>
                {renderNextNodeItem()}
                <div className={styles.opinionBox}>
                    <div className={styles.title}> 办理意见</div>
                    <div className={styles.opinion}>
                        <Picker
                            data={wrapRemarkList}
                            cols={1}
                            onOk={this.handleRemarkSelect}
                            title="请选择常用处理意见"
                        >
                            <List.Item arrow="horizontal" />
                        </Picker>
                        <div className={styles.scale_1} />
                        <TextareaItem
                            placeholder="请输入办理意见"
                            rows={5}
                            {...getFieldProps('WF_Remark')}
                        />
                    </div>
                </div>
                <WhiteSpace />
                <WingBlank >
                    <Button
                        type="primary"
                        onClick={() => { this.handleNodeToolBarClick({ TOOLBARID: 'BU1001', TOOLBARNAME: '办理完成' }); }}
                    >
                        确认
                    </Button>
                    <WhiteSpace />
                </WingBlank>
            </div>
        );
    }
}

const AuditNodeForm = createForm()(AuditNode);
export default AuditNodeForm;
