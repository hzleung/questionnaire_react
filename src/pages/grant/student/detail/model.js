import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { getGrantDetail,getReviewInfo } from '@/services/api';


export default {
    namespace: 'grant_student_detail',
    state: {
        mock:[],
        statusGroup:[],
    },
    effects: {
        *fetchGrantDetail({ payload }, { call, put }) {
            const res = yield call(getGrantDetail,payload);
            const { data, code } = res;
            if (code === 200) {
                yield put({
                    type: 'selectGrantDetail',
                    payload: { mock: data },
                });

            } else {

                Toast.fail('查询助学金详细信息失败！');
                yield put({
                    type: 'clearData',
                });

            }
        },
        *fetchReviewInfo({ payload }, { call, put }) {
            const res = yield call(getReviewInfo,payload.lcslid);
            const { data, code } = res;
            if (code === 200) {
                yield put({
                    type: 'selectReviewInfo',
                    payload: { statusGroup: data },
                });
            } else {
                Toast.fail('查询流程详细信息失败！');
                yield put({
                    type: 'clearData',
                });

            }
        },
    },
    reducers: {
        selectGrantDetail(state, { payload }) {
            return { ...state, ...payload };
        },
        selectReviewInfo(state, { payload }) {
            return { ...state, ...payload };
        },
        clearData(state, { }) {
            return { mock:[],statusGroup:[]};
        },
    },
};
