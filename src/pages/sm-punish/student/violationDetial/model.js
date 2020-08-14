import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { getPunishDetial,getPunishAppeal,getPunishRelieve } from '@/services/api';


export default {
    namespace: 'violation_detial',
    state: {
        detial: {}, //处分详情
        appeal: {}, //处分申诉
        relieve: {}, //处分解除
    },
    effects: {
        //获取处分详情中违纪情况和违纪结果
        *fetchSelectDetial({ payload }, { call, put }) {
            const res = yield call(getPunishDetial, payload);
            let { data, code } = res;

            if (code == 200) {
                yield put({
                    type: 'selectDetial',
                    payload: { detial: data ? data : {} },
                });
            } else {
                Toast.fail('获取处分详情数据失败');
                return;
            }
        },
        //获取处分详情中的处分申诉
        *fetchSelectAppeal({ payload }, { call, put }) {

            const res = yield call(getPunishAppeal, payload);
            const { data, code } = res;

            if (code === 200) {

                yield put({
                    type: 'selectAppeal',
                    payload: { appeal: data ? data : {} },
                });

            } else {

                Toast.fail('获取处分申诉数据失败');
                yield put({
                    type: 'clearData',
                });

            }

        },
        //获取处分详情中的处分解除
        *fetchSelectRelieve({ payload }, { call, put }) {

            const res = yield call(getPunishRelieve, payload);
            const { data, code } = res;

            if (code === 200) {

                yield put({
                    type: 'selectRelieve',
                    payload: { relieve: data ? data : {} },
                });

            } else {

                Toast.fail('获取处分解除数据失败');
                yield put({
                    type: 'clearData',
                });

            }

        },
    },
    reducers: {
        selectDetial(state, { payload }) {
            return { ...state, ...payload };
        },
        selectAppeal(state, { payload }) {
            return { ...state, ...payload };
        },
        selectRelieve(state, { payload }) {
            return { ...state, ...payload };
        },
        clearData(state, { }) {
            return { detial:[],appeal:[],relieve:[]};
        },
    },
};
