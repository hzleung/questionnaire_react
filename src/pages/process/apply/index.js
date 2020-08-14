import React from 'react';
import { generateUUID } from '@/utils/utils';
import { connect } from 'dva';
import { NHDynamicFormShow } from 'xgui-mobile-for-react';
// import { NHAuditPanel } from 'xgui-mobile-for-react';
import NHAuditPanel from '@/components/NHAuditPanel/index';
import { Toast, Button, WingBlank, Flex, WhiteSpace } from 'antd-mobile';
import Opinion from '../opinion/index'
import router from 'umi/router';

import styles from './index.less';

class Aplly extends React.Component {
    componentDidMount() {
        const { match: { params: { processId, docUnid: docUnid0 } }, dispatch, location: { query: { personId = '', nav } } } = this.props;
        const docUnid = docUnid0 || generateUUID();
        dispatch({
            type: 'processApply/getProcessFormData',
            payload: { processId, docUnid, personId, title: nav } // nav是头部标题，这里传过去是防止代申请返回是头部不正确
        });
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'processApply/updateState',
            state: { processFormData: undefined, processApplyInfo: undefined, page: 'form',reviewInfo:[] }
        });
    }

    gotoSubmit = () => {
        const { dispatch } = this.props;
        this.nhDynamicForm.validate(() => {
            dispatch({
                type: 'processApply/updateState',
                state: { page: 'submit' }
            });
        });
    }

    gobackForm = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'processApply/updateState',
            state: { page: 'form' }
        });
    }

    handleNodeToolBarClick = (btnInfo) => {
        this.nhAudit.handleNodeToolBarClick(btnInfo);
    }


    saveDynamicForm = (success, fail) => {
        this.nhDynamicForm.saveAllInfo(success, fail);
    }

    setSubmitBtnDisabled = flag => {
        const { dispatch } = this.props;
        dispatch({
            type: 'processApply/updateState',
            state: { submitBtnDisabled: flag }
        });
    };

    render() {
        const { processInfo, processApplyInfo, nodeFormInfo, rwid, processFormData, page, submitBtnDisabled, reviewInfo} = this.props;
        if (!processApplyInfo || !processInfo || !nodeFormInfo) {
            return (
                <div className={styles.nodata}>
                    <img src={require('../../../assets/images/nodata.png')} alt="" />
                </div>
            );
        }
        const formId = nodeFormInfo.bdid || processInfo.bdid;
        if (!formId) {
            Toast.info('流程未配置表单，请先去配置表单！');
        }
        const model = (processFormData.isFirstNodeFlag === 'true' || nodeFormInfo.bdid) ? 'edit' : 'view';
        let { currentNodeToolbar = '[]' } = processFormData;
        currentNodeToolbar = JSON.parse(currentNodeToolbar);
        let buttonList = currentNodeToolbar.map(item => {
            let text = item.TOOLBARNAME;
            let type = 'ghost';
            let onClick = () => this.handleNodeToolBarClick(item);
            let disabled = false;
            if (item.TOOLBARID === 'BU1001') {
                text = '办理';
                type = 'primary';
                onClick = this.gotoSubmit;
                disabled = submitBtnDisabled;
            }
            // 暂存文档功能不存在，屏蔽掉
            if (item.TOOLBARID === 'BU1022') return null;
            return <Flex.Item key={item.TOOLBARID}><Button disabled={disabled} key={item.TOOLBARID} type={type} onClick={onClick} >{text}</Button></Flex.Item>;
        }).reverse();
        if (buttonList.length > 3) {
            let nbuttonList = [];
            nbuttonList.push(<Flex>{buttonList.slice(0,3)}</Flex>);
            nbuttonList.push(<WhiteSpace />);
            nbuttonList.push(<Flex>{buttonList.slice(3)}</Flex>);
            buttonList = nbuttonList;
        } else {
            buttonList = <Flex>{buttonList}</Flex>;
        }
        return (
            <div>
                <style>
                    {
                        `
                        .am-list-item .am-input-label.am-input-label-5{
                            width: fit-content !important;
                        }

                        `
                    }
                </style>
                <div style={{ display: page === 'form' ? 'block' : 'none' }}>
                    <NHDynamicFormShow
                        ref={ele => this.nhDynamicForm = ele}
                        formId={formId}
                        isShowNav={false}
                        border={false}
                        objId={processApplyInfo.sqdxid}
                        pkid={processApplyInfo.stsqzjid}
                        processId={processApplyInfo.lcid}
                        processApplyId={processApplyInfo.lcsqid}
                        rwid={rwid}
                        params={{
                            pcid: processApplyInfo.pcid,
                            objId: processApplyInfo.sqdxid
                        }}
                        model={model}
                        setSubmitBtnDisabled={this.setSubmitBtnDisabled}
                    />
                    <Opinion  list={reviewInfo} />
                    {/* <WingBlank> */}
                    <div style={{marginLeft:5,marginRight:5}}>
                        {buttonList}
                    </div>
                    {/* </WingBlank> */}
                    <WhiteSpace />
                </div>
                <div style={{ display: page === 'submit' ? 'block' : 'none' }}>
                    <NHAuditPanel
                        ref={ele => this.nhAudit = ele}
                        applyInfo={processApplyInfo}
                        dynamicFormSaveFunc={this.saveDynamicForm}
                        onClose={() => router.goBack()}
                    />
                    <WingBlank>
                        <Button type='ghost' onClick={this.gobackForm} >返回</Button>
                    </WingBlank>
                </div>
            </div>
        );
    }
}
export default connect((state) => { return { ...state.processApply }; })(Aplly);
