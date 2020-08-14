import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { getGroupStatisticsData } from '@/services/api';


export default {
    namespace: 'academy_statistics',
    state: {
        list: [], //列表数据
        selectItemData: {} //选择查看的数据项
    },
    subscriptions: {
        setupHistory({ dispatch, history }) {
            // 监听 history 变化
            return history.listen(({ pathname, search }) => {
                if (pathname == '/sm-holiday/teacher/academyStatistics') {
                    dispatch({ type: 'init' });
                }
            });
        }
    },
    effects: {
        *init({ payload }, { call, put, select }) {

            //如果未选择要查看的职务层级数据范围或非校级层级，则返回到职务层级选择页面,这个页面只有校级层级才能查看
            const holiday_teacher = yield select((state) => state.holiday_teacher);
            if (!holiday_teacher || holiday_teacher.currentLevel.value != 'school') {
                yield put({
                    type: 'goPostLevelSelectPage',
                });
            }
        },
        //获取分组统计列表数据
        *fetchGroupStatisticsData({ payload }, { call, put, select }) {

            const pie_statistics = yield select((state) => state.pie_statistics);

            const { pickerValue, selectItemData } = pie_statistics;

            let params = {
                dqxq: pickerValue[0] + '-' + pickerValue[1],
                zwcj: 'academy',
                pkid: selectItemData.pkid
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
