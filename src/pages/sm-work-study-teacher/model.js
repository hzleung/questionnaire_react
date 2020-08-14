import {
	approveStudentDkjl,
	getAllClockRecord,
	getCurrentAddress,
	getCurrentDateStudentDkjlList,
	getCurrentDateStudentZgzl,
	getCurrentMonthStudentZgzl,
	getGwxqAndXcmx,
	getRepairRecordList,
	getTeacherRzgwxx,
	saveStudentDkjl,
	submitRepairClockRecord,
	getApproveRecordInfo,
} from '@/services/api';
import { Toast } from 'antd-mobile';
import 'moment/locale/zh-cn';

export default {
	namespace: 'teacherWorkStudy',
	state: {
		currentGwxx: {}, 			//默认岗位信息
		approveFlag: false, 		//审核补卡弹窗标识
	},
	effects: {
		/**
		 * 查询当前登录人所有的在职岗位负责人信息
		 * @param params 请求需要的参数
		 * @param call 用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @param select 用于从state里获取数据
		 * @returns {IterableIterator<*>}
		 */* getTeacherRzgwxx({ params, callback }, { call, put, select }) {
			const res = yield call(() => getTeacherRzgwxx(params));
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
		 * 查询该岗位对应的所有补卡记录
		 * @param params 请求需要的参数
		 * @param call 用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @param select 用于从state里获取数据
		 * @returns {IterableIterator<*>}
		 */* getRepairRecordList({ params, callback }, { call, put, select }) {
			const res = yield call(() => getRepairRecordList(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'repairRecordListActionType',
					result: { repairRecordList: data },
				});
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noRepairRecordListActionType',
				});
			}
		},
		/**
		 * 审核补卡记录并计算工作量
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @returns {IterableIterator<*>}
		 */* approveStudentDkjl({ params, callback }, { call, put }) {
			const res = yield call(() => approveStudentDkjl(params));
			const { data, code } = res;
			if (code === 200) {
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('服务器异常，请稍后重试！');
			}
		},
		/**
		 * 审核补卡记录并计算工作量
		 * @param params 请求需要的参数
		 * @param callback 回调方法
		 * @param call  用于调用异步逻辑,支持Promise
		 * @param put 用于触发Action
		 * @returns {IterableIterator<*>}
		 */* getApproveRecordInfo({ params, callback }, { call, put, select }) {
			const res = yield call(() => getApproveRecordInfo(params));
			const { data, code } = res;
			if (code === 200) {
				yield put({
					type: 'approveInfoActionType',
					result: { approveInfoList: data },
				});
				if (callback && typeof callback === 'function') {
					// 回调方法
					callback(data);
				}
			} else {
				Toast.fail('服务器异常，请稍后重试！');
				yield put({
					type: 'noApproveInfoListActionType',
				});
			}
		},
	},
	reducers: {
		changeCurrentGwxx(state, { currentGwxx }) {
			return { ...state, currentGwxx: currentGwxx };
		},
		repairRecordListActionType(state, { result }) {
			return { ...state, ...result };
		},
		approveInfoActionType(state, { result }) {
			return { ...state, ...result };
		},
		noRepairRecordListActionType({}, {}) {
			return { repairRecordList: [] };
		},
		noApproveInfoListActionType({}, {}) {
			return { approveInfoList: [] };
		},
		gwxxListActionType(state, { result }) {
			return { ...state, ...result };
		},
		noGwxxDataActionType({}, {}) {
			return { gwxxList: [] };
		},
		changeCurrentRepairRecord(state, { currentRepairRecord }) {
			return { ...state, currentRepairRecord: currentRepairRecord };
		},
	},
};
