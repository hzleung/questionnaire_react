import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { getHonorary } from '@/services/api';


export default {
    namespace: 'honorary_student',
    state: {
        mock:[],
    },
    effects: {
        *fetchHonoraryInfo({ payload }, { call, put }) {
            const res = yield call(getHonorary,payload);
            const { data, code } = res;
            if (code === 200) {
                yield put({
                    type: 'selectHonorary',
                    payload: { mock: data },
                });

            } else {

                Toast.fail('查询荣誉称号信息失败！');
                yield put({
                    type: 'clearData',
                });

            }

        },
    },
    reducers: {
        selectHonorary(state, { payload }) {
            return { ...state, ...payload };
        },
        clearData(state, { }) {
            return { mock:[]};
        },
    },
};
