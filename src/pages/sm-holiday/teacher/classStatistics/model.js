import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { getGroupStatisticsData } from '@/services/api';


export default {
    namespace: 'class_statistics',
    state: {
        list: [], //列表数据
    },
    subscriptions: {
        setupHistory({ dispatch, history }) {
            // 监听 history 变化
            return history.listen(({ pathname, search }) => {
                if (pathname == '/sm-holiday/teacher/classStatistics') {
                    dispatch({ type: 'init' });
                }
            });
        }
    },
    effects: {
        *init({ payload }, { call, put, select }) {

            //这个页面只有校级、院系、年级层级才能查看
            const holiday_teacher = yield select((state) => state.holiday_teacher);
            if (!holiday_teacher || (holiday_teacher.currentLevel.value != 'school'
                && holiday_teacher.currentLevel.value != 'academy'
                && holiday_teacher.currentLevel.value != 'grade')) {
                yield put({
                    type: 'goPostLevelSelectPage',
                });
            }
        },
        //获取分组统计列表数据
        *fetchGroupStatisticsData({ payload }, { call, put, select }) {

            const state = yield select((state) => state);
            const { pie_statistics, grade_statistics, routing } = state;
            const { pickerValue } = pie_statistics;
            const { location } = routing;

            // 判断是从gradeStatistics页面跳转还是pieStatistics跳转
            let pkid = location.query.from == 'grade_statistics' ? grade_statistics.selectItemData.pkid :
                pie_statistics.selectItemData.pkid;

            let params = {
                dqxq: pickerValue[0] + '-' + pickerValue[1],
                zwcj: 'class',
                pkid
            }

            const res = yield call(getGroupStatisticsData, params);
            let { data, code } = res;

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
            router.push('/sm-holiday/teacher/index');
        },
    },
    reducers: {
        udpateState(state, { payload }) {
            return { ...state, ...payload };
        },
    },
};
