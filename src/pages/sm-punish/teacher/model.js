import router from 'umi/router'; 
import { Toast } from 'antd-mobile';
import { getSemester,getPunishStatisticsData } from '@/services/api';


export default {
    namespace: 'punish_teacher',
    state: {
        mock:[],
        mockDetial:[],
        sValue:undefined,
    },
    effects: {
        *fetchSemesterInfo({ payload }, { call, put }) {
            const res = yield call(getSemester,payload);
            const { data, code } = res;
            if (code === 200 && data.length > 0 ) {
                yield put({
                    type: 'selectSemester',
                    payload: { mock: data,sValue: data[0].value },
                });
            
            } else {

                Toast.fail('没有找到相关违纪统计信息！');
                yield put({
                    type: 'clearData',
                });

            }

        },
        *fetchPunishStatistics({ payload }, { call, put }) {
            const res = yield call(getPunishStatisticsData,payload);
            const { data, code } = res;
            if (code === 200) {
                yield put({
                    type: 'selectPunishStatistics',
                    payload: { mockDetial: data },
                });

      

            } else {

                Toast.fail('查询违纪统计信息情况失败！');
                yield put({
                    type: 'clearData',
                });

            }

        }
    },
    reducers: {
        selectSemester(state, { payload }) {
            return { ...state, ...payload };
        },
        selectPunishStatistics(state, { payload }) {
            return { ...state, ...payload };
        },
        clearData(state, { }) {
            return { mock:[],mockDetial:[]};
        },
    },
};
