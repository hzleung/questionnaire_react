import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { getUserHolidayInfoList } from '@/services/api';


export default {
    namespace: 'holiday_student',
    state: {
        list: [],
    },
    effects: {
        *init({ payload }, { call, put }) {

        },
        *fetchHolidayInfoList({ payload }, { call, put }) {

            const res = yield call(getUserHolidayInfoList, payload);
            const { data, code } = res;
            if (code === 200) {

                yield put({
                    type: 'udpateState',
                    payload: { list: data ? data : [] },
                });

            } else {

                Toast.fail('获取请假信息失败，请重试');
                yield put({
                    type: 'clearData',
                });

            }
        }
    },
    reducers: {
        udpateState(state, { payload }) {
            return { ...state, ...payload };
        },
        clearData(state, { }) {
            return { list: [] };
        },
    },
};
