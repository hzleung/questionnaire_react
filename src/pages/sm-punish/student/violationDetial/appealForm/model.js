import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { saveAppeal } from '@/services/api';


export default {
    namespace: 'appealForm',
    state: {

    },
    effects: {
        //获取处分详情中违纪情况和违纪结果
        *fetchSaveAppeal({ payload }, { call, put }) {
            const res = yield call(saveAppeal, payload);
            let { data, code } = res;

            if (code == 200) {
                Toast.success('违纪申诉成功！');
                router.push('/sm-punish/student/index');
            } else {
                Toast.fail('违纪申诉失败！');
                return;
            }
        },
    },
};
