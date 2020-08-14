import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { getPunishSexData,getPunishPerData } from '@/services/api';


export default {
    namespace: 'punish_teaDetial',
    state: {
        mock:{},
        mockDetial:[],
    },
    effects: {
        *fetchPunishSexData({ payload }, { call, put }) {
            const res = yield call(getPunishSexData,payload);
            const { data, code } = res;
            if (code === 200) {
                yield put({
                    type: 'selectPunishSexData',
                    payload: { mock: data },
                });

                if (!data || data.length == 0) {
                    router.push('/exception/403');
                }

            } else {

                Toast.fail('查询当前学院数据失败！');
                yield put({
                    type: 'clearData',
                });

            }

        },
        *fetchPunishPerData({ payload }, { call, put }) {
            const res = yield call(getPunishPerData,payload);
            const { data, code } = res;
            if (code === 200) {
                yield put({
                    type: 'selectPunishPerData',
                    payload: { mockDetial: data },
                });

                if (!data || data.length == 0) {
                    router.push('/exception/403');
                }

            } else {

                Toast.fail('查询当前学期数据情况失败！');
                yield put({
                    type: 'clearData',
                });

            }

        }
    },
    reducers: {
        selectPunishSexData(state, { payload }) {
            return { ...state, ...payload };
        },
        selectPunishPerData(state, { payload }) {
            return { ...state, ...payload };
        },
        clearData(state, { }) {
            return { mock:[],mockDetial:[]};
        },
    },
};
