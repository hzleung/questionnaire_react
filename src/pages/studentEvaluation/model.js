import {
	getAllTaskByXh,
	getEvaluationHookOptionDetail,
	getEvaluationInfo,
	getEvaluationItemByHjid,
	getHookOptionsByCpxid,
	getProcessLinkList,
	getYdxgEvaluationResultInfo,
	getZbjkFs,
	insertLinkScoreDetail,
	saveFileToDynamicForm,
	uploadFileToDynamicForm,
} from '@/services/api';
import { Toast } from 'antd-mobile';

export default {
	namespace: 'studentEvaluation',
	state: {
		taskList: [],		//任务列表
		formData: [],		//学生测评Form表单信息
		zbjkfsArr: [],    	//指标接口分数
		addedGxxList: [],	//已经新增的加分项
		currentRecord: [],	//当前选中测评项
		addedRemarkList: [],//当前已经添加的备注信息
		initialPage: 0,		//记录当前Tab索引
	},
	effects: {
		/**
		 * 查询当前参与的所有综测任务
		 * @param payload 请求需要的参数
		 * @param call 用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @param select 用于从state里获取数据
		 * @returns {IterableIterator<*>}
		 */* getAllTaskByXh({ payload }, { call, put, select }) {
			const res = yield call(() => getAllTaskByXh(payload));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'buildTaskList',
					result: { taskList: data },
				});
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noTaskDataActionType',
				});
			}
		},
		/**
		 * 查询学生自评相关信息
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @param select 用于从state里获取数据
		 * @returns {IterableIterator<*>}
		 */* getEvaluationInfo({ params, callback }, { call, put, select }) {
			const res = yield call(() => getEvaluationInfo(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'evaluationInfo',
					result: {
						evaluationInfo: {
							...data,
							currentTaskId: params['rwid'],
							currentXsid: params['xsid'],
							currentLcid: params['lcid'],
						},
					},
				});
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noEvaluationInfoActionType',
				});
			}
		},
		/**
		 * 查询指标接口分数
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @param select 用于从state里获取数据
		 * @returns {IterableIterator<*>}
		 */* getZbjkFs({ params, callback }, { call, put, select }) {
			const res = yield call(() => getZbjkFs(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'zbjkfs',
					result: { zbjkfs: data },
				});
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noZbjkfsInfoActionType',
					result: { zbjkfs: null },
				});
			}
		},
		/**
		 * 查询测评项对应的所有勾选项信息
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @param select 用于从state里获取数据
		 * @returns {IterableIterator<*>}
		 */* getHookOptionsByCpxid({ params, callback }, { call, put }) {
			const res = yield call(() => getHookOptionsByCpxid(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'hookOptionsDataSourceActionType',
					result: { hookOptionsDataSource: data },
				});
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noHookOptionsDataSourceActionType',
				});
			}
		},
		/**
		 * 查询勾选项详情信息
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @param select 用于从state里获取数据
		 * @returns {IterableIterator<*>}
		 */* getEvaluationHookOptionDetail({ params, callback }, { call, put, select }) {
			const res = yield call(() => getEvaluationHookOptionDetail(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'optionsDetailActionType',
					result: { hookOptionDetail: data },
				});
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noOptionsDetailActionType',
				});
			}
		},
		/**
		 * 学生自评保存、提交方法
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @param select 用于从state里获取数据
		 * @returns {IterableIterator<*>}
		 */* insertLinkScoreDetail({ params, callback }, { call, put }) {
			const res = yield call(() => insertLinkScoreDetail(params));
			const { data, code } = res;
			if (code === 200) {
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('保存失败，请稍后重试！');
			}
		},
		/**
		 * 查询环节对应流程中所有的测评项
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @param select 用于从state里获取数据
		 * @returns {IterableIterator<*>}
		 */* getEvaluationItemByHjid({ params, callback }, { call, put }) {
			const res = yield call(() => getEvaluationItemByHjid(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'nextHjEvaluationItemListActionType',
					result: { nextHjEvaluationItemList: data },
				});
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noNextHjEvaluationItemListActionType',
				});
			}
		},
		/**
		 * 保存附件到动态表单
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @param select 用于从state里获取数据
		 * @returns {IterableIterator<*>}
		 */* uploadFileToDynamicForm({ params }, { call, put }) {
			const res = yield call(() => uploadFileToDynamicForm(params));
			const { code } = res;
			if (code === 200) {

			} else {
				Toast.fail('附件保存失败，请稍后重试！');
			}
		},
		/**
		 * 启用动态表单对应的附件
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @param select 用于从state里获取数据
		 * @returns {IterableIterator<*>}
		 */* saveFileToDynamicForm({ params }, { call, put }) {
			const res = yield call(() => saveFileToDynamicForm(params));
			const { code } = res;
			if (code === 200) {

			} else {
				Toast.fail('附件保存失败，请稍后重试！');
			}
		},
		/**
		 * 查询学生自评测评结果信息
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @param select 用于从state里获取数据
		 * @returns {IterableIterator<*>}
		 */* getYdxgEvaluationResultInfo({ params, callback }, { call, put }) {
			const res = yield call(() => getYdxgEvaluationResultInfo(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'evaluationResultInfo',
					result: {
						evaluationResultInfo: {
							...data,
							currentTaskId: params['rwid'],
							currentXsid: params['xsid'],
							currentLcid: params['lcid'],
						},
					},
				});
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noEvaluationResultActionType',
				});
			}
		},
		/**
		 * 查询流程对应的所有环节信息
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @param select 用于从state里获取数据
		 * @returns {IterableIterator<*>}
		 */* getProcessLinkList({ params, callback }, { call, put }) {
			const res = yield call(() => getProcessLinkList(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'processLinkListActionType',
					result: { processLinkList: data },
				});
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noProcessLinkListActionType',
				});
			}
		},
	},
	reducers: {
		buildTaskList(state, { result }) {
			return { ...state, ...result };
		},
		noTaskDataActionType({}, {}) {
			return { taskList: [] };
		},
		evaluationInfo(state, { result }) {
			return {
				...state,
				currentHjId: result.evaluationInfo.currentHjid,
				nextHjid: result.evaluationInfo.nextHjid,
				cpxqxx: result.evaluationInfo.xszpHjztdm ? (result.evaluationInfo.hjdfxq ? JSON.parse(result.evaluationInfo.hjdfxq.cpxqxx) : '') : '',
				currentXsid: result.evaluationInfo.currentXsid,
				currentTaskId: result.evaluationInfo.currentTaskId,
				currentLcid: result.evaluationInfo.currentLcid,
				rwMapInfo: result.evaluationInfo.rwMapInfo,
				approveOpinionList: result.evaluationInfo.approveOpinionList,
			};
		},
		noEvaluationResultActionType({}, {}) {
			return { evaluationResultInfo: {} };
		},
		evaluationResultInfo(state, { result }) {
			return { ...state, ...result };
		},
		noEvaluationInfoActionType({}, {}) {
			return { evaluationInfo: {} };
		},
		noHookOptionsDataSourceActionType({}, {}) {
			return { hookOptionsDataSource: [] };
		},
		noProcessLinkListActionType({}, {}) {
			return { processLinkList: [] };
		},
		changeFormDesignList(state, { evaluationInfo }) {
			return { ...state, evaluationInfo: evaluationInfo };
		},
		changezbjkfsArr(state, { zbjkfsArr }) {
			return { ...state, zbjkfsArr: zbjkfsArr };
		},
		changeAddedGxxList(state, { addedGxxList }) {
			return { ...state, addedGxxList: addedGxxList };
		},
		changeAddedRemarkList(state, { addedRemarkList }) {
			return { ...state, addedRemarkList: addedRemarkList };
		},
		zbjkfs(state, { result }) {
			return { ...state, ...result };
		},
		noZbjkfsInfoActionType(state, { result }) {
			return { ...state, ...result };
		},
		changeCurrentGxxInfo(state, { currentGxxInfo }) {
			return { ...state, currentGxxInfo: currentGxxInfo };
		},
		changeHookOptionDetail(state, { hookOptionDetail }) {
			return { ...state, hookOptionDetail: hookOptionDetail };
		},
		hookOptionsDataSourceActionType(state, { result }) {
			return { ...state, ...result };
		},
		processLinkListActionType(state, { result }) {
			return { ...state, ...result };
		},
		optionsDetailActionType(state, { result }) {
			return { ...state, ...result };
		},
		noOptionsDetailActionType({}, {}) {
			return { hookOptionDetail: {} };
		},
		noNextHjEvaluationItemListActionType({}, {}) {
			return { nextHjEvaluationItemList: [] };
		},
		nextHjEvaluationItemListActionType(state, { result }) {
			return { ...state, ...result };
		},
		initFormData(state, { formData }) {
			return { ...state, formData: formData };
		},
		changeInitialPage(state, { initialPage }) {
			return { ...state, initialPage: initialPage };
		},
		changeResultFormDesignList(state, { evaluationResultInfo }) {
			return { ...state, evaluationResultInfo: evaluationResultInfo };
		},
	},
};
