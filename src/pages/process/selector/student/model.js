import { Toast, ListView } from 'antd-mobile';
import { queryStudent } from '@/services/process';

export default {
    namespace: 'studentSelector',
    state: {
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        isLoading: false,
        total: 0,
        pageSize: 20,//当前页默认多少条数据
        page: 1,
        pageCount: 0,
        data: [],
        hasMore: false,
        user: undefined
    },
    effects: {
        *queryStudent({ params },{ call, put, select }) {
            yield put({
                type:'updateState',
                state:{
                    isLoading:true
                }
            });
            const { page, pageSize ,dataSource, data, pageCount } = yield select(state => state.studentSelector);
            const res = yield call(queryStudent,{pageSize,page,...params});
            if (res && res.code === 200) {
                const newData = [...data,...res.data.list];
                yield put({
                    type:'updateState',
                    state:{
                        data:newData,
                        total:res.data.total,
                        dataSource:dataSource.cloneWithRows(newData),
                        isLoading:false,
                        hasMore:res.data.pageCount > pageCount
                    }
                });
            } else {
                Toast.fail('查询数据失败');
            }
            yield put({
                type:'updateState',
                state:{
                    isLoading:false
                }
            });
        },
        * loadMore({params},{call,put,select}) {
            const { page } = yield select(state => state.studentSelector);
            yield put({
                type:'updateState',
                state:{
                    page:page+1
                }
            });
            yield put({
                type:'queryStudent',
            });
        },
        * search({params},{put,select}) {
            yield put({
                type:'updateState',
                state:{
                    page:1,
                    data:[]
                }
            });
            yield put({
                type:'queryStudent',
                params
            });
        },
        * searchClear({params},{put}) {
            yield put({
                type:'updateState',
                state:{
                    page:1,
                    data:[]
                }
            });
            yield put({
                type:'queryStudent',
            });
        }

    },
    reducers: {
        updateState(state, newState) {
            return { ...state, ...newState.state };
        }
    },
};
