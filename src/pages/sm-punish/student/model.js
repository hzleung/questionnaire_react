import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { getDispositionRecord,getPunishRelieveProcessInfo } from '@/services/api';


export default {
    namespace: 'punish_student',
    state: {
        mock:[],
        cfjfid:'',
        processId:'',
    },
    effects: {
        *fetchPunishInfo({ payload }, { call, put }) {
            const res = yield call(getDispositionRecord,payload);
            const { data, code } = res;
            if (code === 200) {

                yield put({
                    type: 'selectPunish',
                    payload: { mock: data },
                });

            } else {

                Toast.fail('处分记录查询失败！');
                yield put({
                    type: 'clearData',
                });
            }
        },
        //获取当前学校违纪解除流程ID
        *fetchPunishRelieveProcessId({ payload }, { call, put }) {
            const res = yield call(getPunishRelieveProcessInfo,payload);
            const { data, code } = res;
            if (code === 200 && data) {

                yield put({
                    type: 'selectPunishRelieveProcessId',
                    payload: { processId: data.LCID },
                });

            } else {

                Toast.fail('当前学校违纪处分解除流程未设置，请检查！');
                // yield put({
                //     type: 'clearData',
                // });
            }
        },
    },
    reducers: {
        selectPunish(state, { payload }) {
            return { ...state, ...payload };
        },
        selectPunishRelieveProcessId(state, { payload }) {
            return { ...state, ...payload };
        },
        clearData(state, { }) {
            return { mock:[]};
        },
    },
};
