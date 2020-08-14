import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { getHonoraryDetail,getReviewInfo } from '@/services/api';


export default {
    namespace: 'honorary_student_detail',
    state: {
        mock:[],
        statusGroup:[],
    },
    effects: {
        *fetchHonoraryDetail({ payload }, { call, put }) {
            const res = yield call(getHonoraryDetail,payload);
            const { data, code } = res;
            if (code === 200) {
                yield put({
                    type: 'selectHonoraryDetail',
                    payload: { mock: data },
                });

            } else {

                Toast.fail('查询荣誉称号详细信息失败！');
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
        selectHonoraryDetail(state, { payload }) {
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
