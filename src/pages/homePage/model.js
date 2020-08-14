import { getAvailableServices } from '@/services/api';
import { Toast } from 'antd-mobile';


export default {
    namespace: 'homePage',
    state: {
        servicesList: []
    },
    effects: {
        *fetchServices({ payload }, { call, put }) {
            const res = yield call(getAvailableServices);
            const { data, code } = res;

            if (code === 200) {

                yield put({
                    type: 'saveServices',
                    payload: { servicesList: data },
                });

            } else {

                Toast.fail('获取服务列表失败');
                yield put({
                    type: 'clearData',
                });

            }

        },
    },
    reducers: {
        saveServices(state, { payload }) {
            return { ...state, ...payload };
        },
        clearData(state, { }) {
            return { servicesList: [] };
        },
    },
};
