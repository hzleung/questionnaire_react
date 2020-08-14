import React from 'react';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile';
import { NHFetch } from 'xgui-mobile-for-react';
import { reqGetFormData } from './config/api';
// import NHFetch from '../../utils/NHFetch'
import AuditNodeForm from './node';

function callFunc(func) {
    if (typeof func === 'function') {
        func();
    }
}
class NHAuditPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            processFormData: {},
            selectedNextNodeList: [],
            allNodeAuditUsers: {},
            jdInfo: {},
        };
    }

    componentDidMount() {
        this.getProcessFormData();
    }

    getProcessFormData = () => {
        const { applyInfo:{lcid, lcsqid} } = this.props;
        reqGetFormData({ processId:lcid, docUnid:lcsqid }).then(res => {
            const { meta, data } = res;
            if (meta.success) {
                if (data) {
                    this.setState({
                        processFormData: data,
                    }, this.getSelectedNextNodeList);
                    this.docUnid = data.docUnid;
                }
            } else {
                Toast.fail(meta.message);
            }
        });
    };

    getSelectedNextNodeList = () => {
        const {
            processFormData: { nextNodeConfig, currentNodeId, processId }
        } = this.state;
        if (nextNodeConfig) {
            const nextNodeConfig1 = JSON.parse(nextNodeConfig);
            const values = nextNodeConfig1
                .filter(
                    item =>
                        JSON.parse(item.GatewayType_DefaultChecked) ||
                        JSON.parse(item.GatewayType_Disabled) || item.initType === 'activity'
                )
                .map(item => item.NODEID);
            this.setState({ selectedNextNodeList: values });
            for (const item of nextNodeConfig1) {
                if (item.initType !== 'end') {
                    // 如果下一个节点不是结束节点，则获取下一节点的审核人
                    this.getNodeInfo(item.NODEID);
                }
            }
        };
        // 获取当前节点配置
        NHFetch('api/sm-bpm-expansion/flowSet/getNodeInfo', 'GET', { lcid: processId, bpmjdid: currentNodeId }).then(res => {
            if (res && res.code === 200) {
                this.setState({ jdInfo: res.data });
            }
        });
    }

    // 获取下一节点的信息
    getNodeInfo = nodeId => {
        const processApplyInfo = {};
        const {processFormData} = this.state;
        const {processId} = processFormData;
        const params = {
            lcid: processId,
            bpmjdid: nodeId
        };
        NHFetch('api/sm-bpm-expansion/flowSet/getNodeInfo', 'GET', params).then(
            res => {
                if (res && res.code === 200) {
                    if (!res.data) {
                        Toast.fail('获取节点信息失败');
                        return;
                    }
                    if (res.data.shrhqfsdm === '01') {
                        this.getZhxgShrList(nodeId);
                    } else if (res.data.shrhqfsdm === '03') {
                        const url = res.data.shrhqgz;
                        processApplyInfo.jdid = res.data.jdid;
                        processApplyInfo.bpmjdid = nodeId;
                        NHFetch(url, 'GET', processApplyInfo).then(res => {
                            if (res) {
                                const allNodeAuditUsers = { ...this.state.allNodeAuditUsers };
                                allNodeAuditUsers[`WF_${nodeId}`] = res.data ? res.data : [];
                                this.setState({ allNodeAuditUsers });
                            }
                        });
                    }
                }
            }
        );
    };

    // 获取综合学工的审核人列表
    getZhxgShrList = nodeId => {
        const {processFormData} = this.state;
        const {processId} = processFormData;
        const {applyInfo:{sqdxid}} = this.props;
        const params = {
            jdid: nodeId,
            lcid: processId,
            sqdxid
        };
        NHFetch(
            'api/sm-bpm-expansion/processdefine/getNextNodeInfo',
            'GET',
            params
        ).then(res => {
            if (res && res.code === 200) {
                const allNodeAuditUsers = { ...this.state.allNodeAuditUsers };
                allNodeAuditUsers[`WF_${nodeId}`] = res.data ? res.data : [];
                this.setState({
                    allNodeAuditUsers
                });
            }
        });
    };

    // 提交办理
    submit = (bpmApplyInfo,isSaveForm) => {
        // 如果是学工的表单且是办理完成的操作，此时调用学工的保存方法进行保存
        // isSaveForm 代表需要使用保存表单内容，回退那些操作不需要保存表单。
        Toast.loading('Loading...', 0);
        const { dynamicFormSaveFunc } = this.props;
        if (dynamicFormSaveFunc && typeof dynamicFormSaveFunc === 'function' && isSaveForm ) {
            dynamicFormSaveFunc(
                () => {
                    this.saveInfo(
                        bpmApplyInfo,
                        this.state.processFormData.isNewDocFlag,
                        this.state.processFormData.nextNodeConfig,
                        () => {
                        },
                        () => {
                        }
                    );
                },
                ()=>{Toast.hide();}
            );
        } else {

            this.saveInfo(
                bpmApplyInfo,
                this.state.processFormData.isNewDocFlag,
                this.state.processFormData.nextNodeConfig,
                () => {
                },
                () => {
                }
            );
        }
    };

    // 流程按钮操作
    handleNodeToolBarClick = (btnInfo) => {
        this.nodeForm.handleNodeToolBarClick(btnInfo);
    }

    saveInfo = async (bpmApplyInfo={}, isNewDocFlag, nextNodeConfig, successfunc, failfunc) => {
        // 判断下一个节点是否是结束节点，如果是结束节点则需要保存
        const {nextNodeId} = bpmApplyInfo;// 下一个节点的ID
        const nextNodeInfo = this.getNextNodeInfo(nextNodeId, nextNodeConfig);
        const { applyInfo } = this.props;
        bpmApplyInfo.remark = bpmApplyInfo.WF_Remark;
        const params = {
            bpmApplyInfo,
            processApplyInfo: applyInfo,
            isNewDocFlag,
            initType: nextNodeInfo.initType,
            spzt: nextNodeInfo.ENDBUSINESSID === '1' ? '2' : '3',// ENDBUSINESSID为1表示审核通过，否则表示审核不通过
        };
        if (bpmApplyInfo && (bpmApplyInfo.actionId === 'GoToFirstNode' || bpmApplyInfo.actionId === 'GoToPrevNode')) {
            params.spzt = '1';
            delete params.initType;
        }
        const {fzbdsjjk} = this.state.jdInfo;
        if (bpmApplyInfo.currentNodeId === 'T10001' && fzbdsjjk) {
            const res = await NHFetch(fzbdsjjk, 'POST', {
                ...applyInfo
            });
            if (!res || res.code !== 200 || !res.data) {
                Toast.error('获取流程分支表单数据失败');
                callFunc(failfunc);
                return;
            }
            params.formData = res.data.formData;
        }
        NHFetch('api/sm-bpm-expansion/processdefine/saveProcessInfo', 'POST', params) 
            .then((res) => {
                if (res && res.code === 200) {
                    if (res.data.code === 0) {
                        Toast.hide();
                        Toast.success(res.data.msg);
                        setTimeout(() => {
                            window.opener = null;
                            window.close();
                        }, 2000);
                        callFunc(successfunc);
                        callFunc(this.props.onClose);
                    } else {
                        Toast.hide();
                        Toast.fail(res.data.msg);
                        callFunc(failfunc);
                    }
                } else {
                    callFunc(failfunc);
                }
            });
    }

    /**
     * 获取下一个节点的信息
     */
    getNextNodeInfo = (nextNodeId, nextNodeConfig) => {
        const nextNodeConfig1 = nextNodeConfig ? JSON.parse(nextNodeConfig) : []; // 后继节点
        let nextNodeInfo = {};
        nextNodeConfig1.map((item) => {
            if (item.NODEID === nextNodeId) {
                nextNodeInfo = item;
            }
            return item;
        });
        return nextNodeInfo;
    }

    render() {
        return (
          <div>
            <AuditNodeForm wrappedComponentRef={ele => this.nodeForm = ele} {...this.state} {...this.props} submit={this.submit} />
          </div>
        );
    }
}
NHAuditPanel.protoTypes = {
    applyInfo: PropTypes.object.isRequired, // 流程申请信息{sqdxid,sqrid,sqdxdm,sqdxsszz,lcid,lcsqid,stsqzjid,pcid}
    dynamicFormSaveFunc: PropTypes.func,
    onClose: PropTypes.func, // 流程办理结束后调用
};

export default NHAuditPanel;
