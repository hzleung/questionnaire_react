import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { getUserPostLevelInfo } from '@/services/api';


export default {
    namespace: 'holiday_teacher',
    state: {
        postLevelList: [], //用户职务层级信息
        currentLevel: {}, //当前职务层级
        schoolYearList: [{label: '请选择', value: ''}], //学年列表
    },
    effects: {
        *fetchPostLevelInfo({ payload }, { call, put }) {
            const res = yield call(getUserPostLevelInfo);
            const { data, code } = res;
            if (code === 200) {

                yield put({
                    type: 'savePostLevelList',
                    payload: { postLevelList: data },
                });

                if (!data || data.length == 0) {
                    router.push('/exception/403');
                }

            } else {

                Toast.fail('获取职务层级失败');
                yield put({
                    type: 'clearData',
                });

            }

        }
    },
    reducers: {
        savePostLevelList(state, { payload }) {
            return { ...state, ...payload };
        },
        saveCurrentPostLevel(state, { payload }) {
            return { ...state, ...payload };
        },
        clearData(state, { }) {
            return { postLevelList: [], currentLevel: {}};
        },
    },
};
