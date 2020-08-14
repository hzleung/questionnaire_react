import {
	getRzgwxx,
	getAddressList,
	getAllClockRecord,
	getCurrentAddress,
	getCurrentDateStudentDkjlList,
	getCurrentDateStudentZgzl,
	getCurrentMapType,
	getCurrentMonthStudentZgzl,
	getGwxqAndXcmx,
	getStudentRzgwxx,
	saveStudentDkjl,
	submitRepairClockRecord,
} from '@/services/api';
import { Toast } from 'antd-mobile';
import moment from 'moment';
import 'moment/locale/zh-cn';

export default {
	namespace: 'studentWorkStudy',
	state: {
		currentAddress: '',   		//当前定位地址
		currentGwxx: {}, 			//默认岗位信息
		sbdkSuccessStatus: false,	//上班打卡成功标识
		xbdkSuccessStatus: false,	//下班打卡成功标识
		currentDate: moment(),		//当前时间
		repairClockDate: moment(),  //补卡日期
		repairClockFlag: false,		//补卡弹窗标识
		currentRepairRecord: [],	//当前补卡记录
	},
	effects: {
		/**
		 * 根据学号查询学生当前任职的所有岗位信息
		 * @param params 请求需要的参数
		 * @param call 用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @param select 用于从state里获取数据
		 * @returns {IterableIterator<*>}
		 */* getStudentRzgwxx({ params, callback }, { call, put, select }) {
			const res = yield call(() => getStudentRzgwxx(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'gwxxListActionType',
					result: { gwxxList: data },
				});
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noGwxxDataActionType',
				});
			}
		},
		/**
		 * 查询岗位详情和薪资明细
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @param select 用于从state里获取数据
		 * @returns {IterableIterator<*>}
		 */* getGwxqAndXcmx({ params, callback }, { call, put, select }) {
			const res = yield call(() => getGwxqAndXcmx(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'gwxqXcmxActionType',
					result: { gwxqXcmxMap: data },
				});
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noGwxqXcmxActionType',
				});
			}
		},
		/**
		 * 保存打卡记录
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @returns {IterableIterator<*>}
		 */* saveStudentDkjl({ params, callback }, { call, put }) {
			const res = yield call(() => saveStudentDkjl(params));
			const { data, code } = res;
			if (code === 200) {
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('打卡失败，请稍后重试！');
			}
		},
		/**
		 * 查询当天所有打卡记录
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @returns {IterableIterator<*>}
		 */* getCurrentDateStudentDkjlList({ params, callback }, { call, put }) {
			const res = yield call(() => getCurrentDateStudentDkjlList(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'studentDkjlListActionType',
					result: { studentDkjlList: data },
				});
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noStudentDkjlListActionType',
				});
			}
		},
		/**
		 * 查询当月总工作量
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @returns {IterableIterator<*>}
		 */* getCurrentMonthStudentZgzl({ params, callback }, { call, put }) {
			const res = yield call(() => getCurrentMonthStudentZgzl(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'studentCurrentMonthZgzlActionType',
					result: { studentCurrentMonthZgzl: data },
				});
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noStudentCurrentMonthZgzlActionType',
				});
			}
		},
		/**
		 * 查询当天工作时长和打卡次数
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @returns {IterableIterator<*>}
		 */* getCurrentDateStudentZgzl({ params, callback }, { call, put }) {
			const res = yield call(() => getCurrentDateStudentZgzl(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'studentCurrentDateRecordActionType',
					result: { studentCurrentDateRecord: data },
				});
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noStudentCurrentDateRecordActionType',
				});
			}
		},
		* getAllClockRecord({ params, callback }, { call, put }) {
			const res = yield call(() => getAllClockRecord(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'studentAllClockRecordActionType',
					result: { studentAllClockRecord: data },
				});
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noStudentAllClockRecordActionType',
				});
			}
		},
		/**
		 * 学生缺卡申请提交方法
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @param select 用于从state里获取数据
		 * @returns {IterableIterator<*>}
		 */* submitRepairClockRecord({ params, callback }, { call, put }) {
			const res = yield call(() => submitRepairClockRecord(params));
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
		* getAddressList({ params, callback }, { call, put }) {
			const res = yield call(() => getAddressList(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'addressActionType',
					result: { address: data },
				});
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noAddressActionType',
				});
			}
		},
		* getCurrentMapType({ params, callback }, { call, put }) {
			const res = yield call(() => getCurrentMapType(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'currentMapTypeActionType',
					result: { currentMapType: data },
				});
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noCurrentMapTypeActionType',
				});
			}
		},
		* getRzgwxx({ params, callback }, { call, put }) {
			const res = yield call(() => getRzgwxx(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'rzgwxxActionType',
					result: { rzgwxx: data },
				});
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noRzgwxxActionType',
				});
			}
		},
	},
	reducers: {
		gwxxListActionType(state, { result }) {
			return { ...state, ...result };
		},
		addressActionType(state, { result }) {
			return { ...state, ...result };
		},
		gwxqXcmxActionType(state, { result }) {
			return { ...state, ...result };
		},
		currentMapTypeActionType(state, { result }) {
			return { ...state, ...result };
		},
		rzgwxxActionType(state, { result }) {
			return { ...state, ...result };
		},
		noCurrentMapTypeActionType({}, {}) {
			return { currentMapType: '' };
		},
		noAddressActionType({}, {}) {
			return { address: '' };
		},
		noGwxxDataActionType({}, {}) {
			return { gwxxList: [] };
		},
		noGwxqXcmxActionType({}, {}) {
			return { gwxqXcmxMap: [] };
		},
		noStudentDkjlListActionType({}, {}) {
			return { studentDkjlList: [] };
		},
		noStudentCurrentMonthZgzlActionType({}, {}) {
			return { noStudentCurrentMonthZgzlActionType: [] };
		},
		noCurrentAddressActionType({}, {}) {
			return { address: '' };
		},
		noStudentCurrentDateRecordActionType({}, {}) {
			return { studentCurrentDateRecord: {} };
		},
		noStudentAllClockRecordActionType({}, {}) {
			return { studentAllClockRecord: [] };
		},
		noRzgwxxActionType({}, {}) {
			return { rzgwxx: '' };
		},
		studentDkjlListActionType(state, { result }) {
			return { ...state, ...result };
		},
		currentAddressActionType(state, { result }) {
			return { ...state, ...result };
		},
		studentCurrentMonthZgzlActionType(state, { result }) {
			return { ...state, ...result };
		},
		studentAllClockRecordActionType(state, { result }) {
			return { ...state, ...result };
		},
		studentCurrentDateRecordActionType(state, { result }) {
			return { ...state, ...result };
		},
		changeCurrentAddress(state, { currentAddress }) {
			return { ...state, currentAddress: currentAddress };
		},
		changeCurrentGwxx(state, { currentGwxx }) {
			return { ...state, currentGwxx: currentGwxx };
		},
		changeSbdkSuccessStatus(state, { sbdkSuccessStatus, dkcgsjTime }) {
			return { ...state, sbdkSuccessStatus: sbdkSuccessStatus, dkcgsjTime: dkcgsjTime };
		},
		changeXbdkSuccessStatus(state, { xbdkSuccessStatus, dkcgsjTime }) {
			return { ...state, xbdkSuccessStatus: xbdkSuccessStatus, dkcgsjTime: dkcgsjTime };
		},
		changeCurrentDate(state, { currentDate }) {
			return { ...state, currentDate: currentDate };
		},
		changeRepairClockDate(state, { repairClockDate }) {
			return { ...state, repairClockDate: repairClockDate };
		},
		changeRepairClockFlag(state, { repairClockFlag }) {
			return { ...state, repairClockFlag: repairClockFlag };
		},
		changeCurrentRepairRecord(state, { currentRepairRecord }) {
			return { ...state, currentRepairRecord: currentRepairRecord };
		},
	},
};
