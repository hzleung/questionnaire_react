import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { applyCancellationOfLeave, getXsqjsqByPkid, getReviewInfo } from '@/services/api';


export default {
    namespace: 'holiday_student_details',
    state: {
        pkid: '', //请假记录ID
        details: {}, //请假记录详情
        processReviewInfo: [] //流转记录
    },
    subscriptions: {
        setupHistory({ dispatch, history }) {
            // 监听 history 变化
            return history.listen(({ pathname, search }) => {
                const paramsString = search.substring(1);
                const searchParams = new URLSearchParams(paramsString);
                if (pathname == '/sm-holiday/student/index/details') {
                    dispatch({ type: 'init', payload: { pkid: searchParams.get('pkid') } });
                }
            });
        }
    },
    effects: {
        *init({ payload }, { call, put, select }) {
            const holiday_student = yield select((state) => state.holiday_student);
            if (!holiday_student || holiday_student.list.length == 0) {
                yield put({
                    type: 'backToIndex',
                });
            } else {
                let details = holiday_student.list.filter(item => {
                    return item.PKID == payload.pkid;
                })[0];

                if (details) {

                    yield put({
                        type: 'udpateState',
                        payload: { pkid: payload.pkid, details: details ? details : {} },
                    });

                } else {

                    yield put({
                        type: 'backToIndex',
                    });
                }
            }
        },
        *getReviewInfo({ payload, search }, { call, put }) {
            //查询学生请假申请流程实例ID
            const res1 = yield call(getXsqjsqByPkid, payload);
            
            if (res1.code == 200 && res1.data) {
                // 查询请假申请流转记录
                const res2 = yield call(getReviewInfo, res1.data.LCSLID);

                if (res2.code == 200 && res2.data) {
                    yield put({
                        type: 'udpateState',
                        payload: { processReviewInfo: res2.data },
                    });
                } else {
                    Toast.fail('获取请假申请流转记录失败，请重试');
                }

            } else {
                Toast.fail('获取请假申请流转记录失败，请重试');
            }

        },
        *applyCancellationOfLeave({ payload, search }, { call, put }) {

            // 申请销假
            const res = yield call(applyCancellationOfLeave, payload);
            const { data, code } = res;
            if (code == 200) {

                if (data && data == 1) {

                    Toast.success('申请销假成功');
                    yield put({
                        type: 'backToIndex',
                    });
                } else {
                    Toast.fail('申请销假失败，请重试');
                }
            } else {
                Toast.fail('申请销假失败，请重试');
            }
        },
        *backToIndex({ payload }, { call, put }) {
            yield router.push('/sm-holiday/student/index');
        },
    },
    reducers: {
        udpateState(state, { payload }) {
            return { ...state, ...payload };
        },
    },
};
