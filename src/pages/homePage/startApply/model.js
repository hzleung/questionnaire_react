import { getAllApplyBpm } from '@/services/api';
import { Toast } from 'antd-mobile';


export default {
    namespace: 'startApply',
    state: {
        data:[]
    },
    effects: {
        *fetchApplyBpm({ payload }, { call, put }) {

            const res = yield call(getAllApplyBpm, payload);
            const { data, code } = res;

            if (code === 200) {

                yield put({
                    type: 'save',
                    payload: { data: data },
                });

            } else {

                Toast.fail('获取流程分类失败');
                yield put({
                    type: 'clearData',
                });

            }

        },
    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
        clearData(state, { }) {
            return { data:[]};
        },
    },
};
