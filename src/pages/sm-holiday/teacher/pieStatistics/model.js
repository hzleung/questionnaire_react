import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { getSchoolYearList, getCurrentSchoolYearAndSemester, getStatisticsData, getGroupStatisticsData } from '@/services/api';


export default {
    namespace: 'pie_statistics',
    state: {
        pickerValue: ['', '1'], //选择器选择值
        schoolYearList: [{ label: '请选择', value: '' }], //学年列表
        pieData: { man: 0, woman: 0, total: 0 }, //饼图数据
        list: [], //分组统计数据
        selectItemData: {}, //选择查看的数据项
    },
    subscriptions: {
        setupHistory({ dispatch, history }) {
            // 监听 history 变化
            return history.listen(({ pathname, search }) => {
                if (pathname == '/sm-holiday/teacher/pieStatistics') {
                    dispatch({ type: 'init' });
                }
            });
        }
    },
    effects: {
        *init({ payload }, { call, put, select }) {

            //如果未选择要查看的职务层级数据范围，则返回到职务层级选择页面
            const holiday_teacher = yield select((state) =>{ return state.holiday_teacher; });
            if (!holiday_teacher || !holiday_teacher.currentLevel.value) {
                yield put({
                    type: 'goPostLevelSelectPage',
                });
            }
        },
        //初始化学年学期选择器数据
        *fetchPickerData({ payload }, { call, put, select }) {

            const res1 = yield call(getSchoolYearList);
            const res2 = yield call(getCurrentSchoolYearAndSemester);

            let nextState = {};

            if (res1.code == 200) {
                nextState.schoolYearList = res1.data;
            } else {
                Toast.fail('获取学年数据失败');
                return;
            }

            if (res2.code == 200) {
                if (res2.data) {
                    nextState.pickerValue = [res2.data.dqxn, res2.data.dqxq];
                }
            } else {
                Toast.fail('获取当前学年学期数据失败');
                return;
            }

            yield put({
                type: 'udpateState',
                payload: nextState,
            });

            yield put({
                type: 'fetchPieStatisticsData',
                payload: { dqxq: res2.data.dqxn + '-' + res2.data.dqxq, zwcj: payload.currentLevel, zzjgid: payload.zzjgid },
            });

        },
        //获取饼图统计数据
        *fetchPieStatisticsData({ payload }, { call, put, select }) {
            
            const res = yield call(getStatisticsData, { ...payload });

            const { data, code } = res;
            if (code == 200) {
                yield put({
                    type: 'udpateState',
                    payload: { pieData: data ? data : { man: 0, woman: 0, total: 0 } },
                });
                yield put({
                    type: 'fetchGroupStatisticsData',
                    payload: payload,
                });
            } else {
                Toast.fail('加载饼图统计数据失败');
                return;
            }

        },
        //获取分组统计列表数据
        *fetchGroupStatisticsData({ payload }, { call, put, select }) {

            const res = yield call(getGroupStatisticsData, { ...payload });
            const { data, code } = res;
            if (code == 200) {
                yield put({
                    type: 'udpateState',
                    payload: { list: data ? data : [] },
                });
            } else {
                Toast.fail('加载分组统计数据失败');
                return;
            }

        },
        //跳转到职务层级选择页面
        *goPostLevelSelectPage({ payload }, { call, put }) {
            yield router.push('/sm-holiday/teacher/index');
            return;
        },
    },
    reducers: {
        udpateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
};
