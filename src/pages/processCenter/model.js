import {queryBpmwaitingProcess,queryBpmApplyedProcess,queryBpmRelatedProcess} from '@/services/api'
import { Toast } from 'antd-mobile';

export default {
    namespace : 'processCenter',
    state : {
        waitingProcessList : [],
        applyedProcessList : [],
        relatedProcessList : [],
        tabIndex:0, 
    },
    effects: {
        * queryBpmwaitingProcess({ payload }, { call, put }) {

            const res = yield call(queryBpmwaitingProcess, payload);
            const { data, code } = res;
            if (code === 200) {

                yield put({
                    type: 'queryBpmList',
                    result: { waitingProcessList: data },
                });

            } else {

                Toast.fail('获取流程数据失败');
                yield put({
                    type: 'clearData',
                });

            }
        },
        * queryBpmApplyedProcess({ payload }, { call, put }) {

            const res = yield call(queryBpmApplyedProcess, payload);
            const { data, code } = res;
            if (code === 200) {

                yield put({
                    type: 'queryBpmList',
                    result: { applyedProcessList: data },
                });

            } else {

                Toast.fail('获取流程数据失败');
                yield put({
                    type: 'clearData',
                });

            }
        },
        * queryBpmRelatedProcess({ payload }, { call, put }) {

            const res = yield call(queryBpmRelatedProcess, payload);
            const { data, code } = res;
            if (code === 200) {

                yield put({
                    type: 'queryBpmList',
                    result: { relatedProcessList: data },
                });

            } else {

                Toast.fail('获取流程数据失败');
                yield put({
                    type: 'clearData',
                });

            }
        },

    },

    reducers: {
        queryBpmList(state, { result }) {
            return { ...state, ...result };
        },
        clearData(state, { }) {
            return { waitingProcessList: [] };
        },
        updateTabIndex(state,{tabIndex}){
            return {...state,tabIndex}    
        }
    },


    
}
