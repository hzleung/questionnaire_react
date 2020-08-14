
import { getDifficultStudentApply } from '@/services/api';


export default {
    namespace: 'difficult_student',
    state: {
        taskList: [],
    },
    effects: {
        * fetchDifficultStudentApply({ params }, { call, put }) {
            const res = yield call(() => getDifficultStudentApply(params));
            if (res && res.code === 200) {
                yield put({
                    type: 'updateState',
                    state: {
                        taskList: res.data || []
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
