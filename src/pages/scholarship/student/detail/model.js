import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { getScholarShipDetail,getReviewInfo } from '@/services/api';


export default {
    namespace: 'scholarship_student_detail',
    state: {
        mock:[],
        statusGroup:[],
    },
    effects: {
        *fetchScholarShipDetail({ payload }, { call, put }) {
            const res = yield call(getScholarShipDetail,payload);
            const { data, code } = res;
            if (code === 200) {
                yield put({
                    type: 'selectScholarShipDetail',
                    payload: { mock: data },
                });

                if (!data || data.length == 0) {
                    router.push('/exception/403');
                }

            } else {

                Toast.fail('查询奖学金详细信息失败！');
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
        selectScholarShipDetail(state, { payload }) {
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
