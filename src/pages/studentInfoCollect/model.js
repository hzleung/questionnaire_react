import {getValidTask} from '@/services/api'
import { Toast } from 'antd-mobile';

export default {
    namespace: 'collectRecord',
    state : {
        validTaskList:[],

    },
    effects:{
        // 通过当前登录人和当前时间查询有效的采集任务
        * getValidTask({params},{ call, put }){
            const res = yield call(getValidTask, params);
            const { data, code } = res;
            if (code === 200) {
                yield put({
                    type: 'getValidTaskList',
                    result: { validTaskList: data.validTaskList },
                });


            }else{
                Toast.fail('获取流程数据失败');
                yield put({
                    type: 'clearData',
                });
            }
            
        },
    },

    reducers: {
        getValidTaskList(state, { result }) {
            return { ...state, ...result };
        },
        clearData(state, { }) {
            return { validTaskList: [] };
        },
    },
    
}