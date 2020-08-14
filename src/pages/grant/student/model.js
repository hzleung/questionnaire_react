import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { getGrant } from '@/services/api';


export default {
    namespace: 'grant_student',
    state: {
        mock:[],
    },
    effects: {
        *fetchGrantInfo({ payload }, { call, put }) {
            const res = yield call(getGrant,payload);
            const { data, code } = res;
            if (code === 200) {
                yield put({
                    type: 'selectGrant',
                    payload: { mock: data },
                });

            } else {

                Toast.fail('查询助学金信息失败！');
                yield put({
                    type: 'clearData',
                });

            }

        },
    },
    reducers: {
        selectGrant(state, { payload }) {
            return { ...state, ...payload };
        },
        clearData(state, { }) {
            return { mock:[]};
        },
    },
};
