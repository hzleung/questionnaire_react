import { getProcessFormData, getProcessFormParams, getReviewInfo, checkQulification } from '@/services/api';
import React from 'react';
import { Toast, Modal } from 'antd-mobile';
import { router } from 'umi';

export default {
    namespace: 'processApply',
    state: {
        processFormData: undefined,
        processApplyInfo: undefined,
        page:'form',
        reviewInfo:[],
        submitBtnDisabled:false
    },
    effects: {
        * getProcessFormData({ payload }, { call, put }) {
            const res = yield call(() => getProcessFormData(payload));
            const { data, meta } = res;
            if (!meta.success) {
                Toast.fail(meta.message !== '' ? meta.message : '服务器异常，请稍后重试！');
                return;
            }
            const { currentNodeId, isNewDocFlag } = data;
            yield put({
                type: 'getProcessFormParams',
                payload: { lcid: payload.processId, lcsqid: payload.docUnid, bpmjdid: currentNodeId, isNewDocFlag, personId: payload.personId },
                title:payload.title
            });
            yield put({
                type: 'updateState',
                state: { processFormData: data },
            });
        },
        * getProcessFormParams({ payload,title }, { call, put }) {
            const res = yield call(() => getProcessFormParams(payload));
            const { data, code, message } = res;
            if (code !== 200) {
                Toast.fail(message);
                return;
            }
            if (!data) {
                Toast.fail('流程配置不存在');
                return;
            }
            if (data && data.code === '1') {
                if (data.end === 1 && payload.isNewDocFlag === 'true') {
                    Toast.info('该流程的申请时间已结束，不能进行申请！');
                    return;
                }
                if (data.processInfo.zgpdjk) {
                    const res1 = yield call(() => checkQulification({ url: data.processInfo.zgpdjk, processApplyInfo: data.processApplyInfo }));
                    if (res1.code !== 200) {
                        Toast.fail(res1.message);
                        return;
                    }
                    if (res1.data.state === '2') {
                        const info = res1.data.ms;
                        const infoList = info.split(';');
                        const bfhtj = infoList.map((item, index) => {
                            return <span key={index}>{index + 1}、{item} <br /></span>;
                        });
                        Modal.alert('提示', bfhtj);
                        return;
                    }
                }
                yield put({
                    type: 'getReviewInfo',
                    payload: payload.lcsqid
                });
                yield put({
                    type: 'updateState',
                    state: {
                        ...data
                    }
                });
            } else {
                // 代申请
                if (data.sqdxdm === 'stu') {
                    router.replace({
                        pathname:'/process/selector/student/index',
                        query:{
                            lcid:payload.lcid,
                            title
                        }
                    });
                }
            }
        },
        * getReviewInfo({ payload }, { call, put }) {
            const res = yield call(() => getReviewInfo(payload));
            const { data, code, message } = res;
            if (code !== 200) {
                Toast.fail(message);
                return;
            }
            yield put({
                type: 'updateState',
                state: { reviewInfo: data || [] }
            });
        }
    },
    reducers: {
        updateState(state, newState) {
            return { ...state, ...newState.state };
        }
    },
};
