import {
    getTaskList, queryEvaluationSchoolList,
    queryEvaluationGradeList, queryEvaluationClassList,
    queryEvaluationStudentList, queryEvaluationTask
} from '@/services/teacherEvaluation';
import { getUserPostLevelInfo } from '@/services/api';
import { router } from 'umi';
import { Toast } from 'antd-mobile';

export default {
    namespace: 'teacherEvaluation',
    state: {
        taskList: [
        ]
        ,
        level: '',
        selectTask: {},
        evaluationSchoolList: [],
        evaluationGradeList: [],
        evaluationClassList: [],
        evaluationStudentList: []
    },
    effects: {
        *fetchPostLevelInfo(params, { call, put }) {
            const res = yield call(getUserPostLevelInfo);
            const { data, code } = res;
            if (code === 200) {
                if (data && data.length === 1) {
                    router.replace({
                        pathname: '/teacher/evaluation/task',
                        query: {
                            level: data[0].value
                        }
                    });
                    return;
                }

                if (!data || data.length === 0) {
                    router.push('/exception/403');
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
        * getTaskList(params, { call, put }) {
            const res = yield call(() => getTaskList());
            if (res && res.code === 200) {
                yield put({
                    type: 'updateState',
                    state: {
                        taskList: res.data || []
                    }
                });
            }
        },
        * evaluationSchoolList({ taskId,level }, { call, put }) {
            const res = yield call(queryEvaluationSchoolList,{ taskId,academy:level==='academy' });
            if (res && res.code === 200) {
                yield put({
                    type: 'updateState',
                    state: {
                        evaluationSchoolList: res.data || []
                    }
                });
            }
        },
        * evaluationGradeList({ taskId, bmid }, { call, put }) {
            const res = yield call(() => queryEvaluationGradeList({ taskId, bmid }));
            if (res && res.code === 200) {
                yield put({
                    type: 'updateState',
                    state: {
                        evaluationGradeList: res.data || []
                    }
                });
            }
        },
        * evaluationClassList({ taskId, bmid, grade }, { call, put }) {
            const res = yield call(() => queryEvaluationClassList({ taskId, bmid, grade }));
            if (res && res.code === 200) {
                yield put({
                    type: 'updateState',
                    state: {
                        evaluationClassList: res.data || []
                    }
                });
            }
        },
        * evaluationStudentList({ taskId, classId }, { call, put }) {
            const res = yield call(() => queryEvaluationStudentList({ taskId, classId }));
            if (res && res.code === 200) {
                yield put({
                    type: 'updateState',
                    state: {
                        evaluationStudentList: res.data || []
                    }
                });
            }
        },
        * queryEvaluationTask({ taskId }, { call, put }) {
            const res = yield call(() => queryEvaluationTask(taskId));
            if (res && res.code === 200) {
                yield put({
                    type: 'updateState',
                    state: {
                        selectTask: res.data
                    }
                });
            }
        }

    },
    reducers: {
        updateState(state, newState) {
            return { ...state, ...newState.state };
        }
    },
};
