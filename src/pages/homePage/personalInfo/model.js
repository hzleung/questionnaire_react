import { getStudentBaseInfo, getTeacherBaseInfo } from '@/services/api';
import { Toast } from 'antd-mobile';


export default {
    namespace: 'personalInfo',
    state: {
        userInfo: {}
    },
    effects: {
        *fetchStudentInfo({ payload }, { call, put }) {

            const res = yield call(getStudentBaseInfo, payload);
            const { data, code } = res;

            if (code === 200) {

                yield put({
                    type: 'save',
                    payload: { userInfo: data },
                });

            } else {

                Toast.fail('获取用户信息失败');
                yield put({
                    type: 'clearData',
                });

            }

        },
        *fetchTeacherInfo({ payload }, { call, put }) {

            const res = yield call(getTeacherBaseInfo, payload);
            const { data, code } = res;
            if (code === 200) {

                yield put({
                    type: 'save',
                    payload: { userInfo: data },
                });

            } else {

                Toast.fail('获取用户信息失败');
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
            return { userInfo: {} };
        },
    },
};
