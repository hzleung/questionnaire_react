import { Toast } from 'antd-mobile';
import { getUserPostLevelInfo, getSchoolYearList, getCurrentSchoolYearAndSemester } from '@/services/api';
import { queryStatistics,queryStatisticsDetail } from '@/services/grant';
// eslint-disable-next-line import/no-extraneous-dependencies
import { router } from 'umi';

export default {
    namespace: 'grantTeacher',
    state: {
        postLevelList: [], // 用户职务层级信息
        currentLevel: {}, // 当前职务层级
        schoolTimeData: [], // 学年学期列表
        currentSchoolYear: '',
        currentSchoolSemester: '',
        selectedSchoolTime: '',
        statistics: [],
        detailData:{}
    },
    effects: {
        *fetchPostLevelInfo(params, { call, put }) {
            const res = yield call(getUserPostLevelInfo);
            const { data, code } = res;
            if (code === 200) {

                if (data && data.length === 1) {
                    router.replace({
                        pathname: '/grant/teacher/pieStatistics/index',
                        query: {
                            level: data[0].value
                        }
                    });
                    return;
                }
                if (!data || data.length === 0) {
                    router.push('/exception/403');
                    return;
                }

                yield put({
                    type: 'updateState',
                    state: { postLevelList: data },
                });


            } else {
                Toast.fail('获取职务层级失败');
                yield put({
                    type: 'clearData',
                });

            }
        },
        * querySchoolTimeData({level}, { call, put }) {
            const res1 = yield call(getSchoolYearList);
            const res2 = yield call(getCurrentSchoolYearAndSemester);
            if (res2 && res2.code === 200) {
                yield put({
                    type: 'updateState',
                    state: {
                        currentSchoolYear: res2.data.dqxn,
                        currentSchoolSemester: res2.data.dqxq,
                        selectedSchoolTime: res2.data.dqxn
                    }
                });
                const schoolTime = `${res2.data.dqxn},${res2.data.dqxn}-1,${res2.data.dqxn}-2`;
                yield put({
                    type:'queryStatistics',
                    schoolTime,
                    level
                });
            }

            if (res1 && res1.code === 200) {
                const arr = [];
                const { data = [] } = res1;
                data.forEach(item => {
                    arr.push(item);
                    arr.push({
                        label: `${item.value}第1学期`,
                        value: `${item.value}-1`
                    });
                    arr.push({
                        label: `${item.value}第2学期`,
                        value: `${item.value}-2`
                    });
                });
                yield put({
                    type: 'updateState',
                    state: {
                        schoolTimeData: arr
                    }
                });
            }
        },
        * queryStatistics({ level, schoolTime }, { call, put }) {
            const res = yield call(() => queryStatistics({ level, schoolTime }));
            if (res && res.code === 200) {
                yield put({
                    type: 'updateState',
                    state: {
                        statistics: res.data || []
                    }
                });
            }
        },
        * queryStatisticsDetail({level,schoolTime,awardId},{call,put}) {
            const res = yield call(queryStatisticsDetail,{level,schoolTime,awardId});
            if (res && res.code === 200) {
                yield put({
                    type: 'updateState',
                    state: {
                        detailData: res.data || {}
                    }
                });
            } else {
                Toast.error(res.message);
            }
        }
    },
    reducers: {
        updateState(state, newState) {
            return { ...state, ...newState.state };
        },
        clearData(state) {
            return {
                ...state,
                postLevelList: [],
                currentLevel: {},
                schoolYearList: []
            };
        }
    }
};
