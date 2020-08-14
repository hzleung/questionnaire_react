import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { getScholarShip } from '@/services/api';


export default {
    namespace: 'questionnaire',
    state: {
        mock:[],
    },
    effects: {
        // *fetchScholarShipInfo({ payload }, { call, put }) {
        //     const res = yield call(getScholarShip,payload);
        //     const { data, code } = res;
        //     if (code === 200) {
        //         yield put({
        //             type: 'selectScholarShip',
        //             payload: { mock: data },
        //         });
        //     } else {

        //         Toast.fail('查询奖学金信息失败！');
        //         yield put({
        //             type: 'clearData',
        //         });

        //     }

        // },
    },
    reducers: {
        // selectScholarShip(state, { payload }) {
        //     return { ...state, ...payload };
        // },
        // clearData(state, { }) {
        //     return { mock:[]};
        // },
    },
};
