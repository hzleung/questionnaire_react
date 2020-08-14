/*
 * @Description: api地址
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: zengweijin
 * @LastEditTime: 2020-07-15 14:51:51
 */

import { post, postForm, query,authLoginForm } from '@/utils/request';

// 移动学工后台服务
const sm_mobile_url = '/api/sm-mobile';
// 系统管理后台服务
const sm_xtgl_url = '/api/zhxg-xtgl';
// 学工队伍后台服务
const sm_xgdw_url = '/api/zhxg-xgdw';
// 学生信息后台服务
const sm_student_url = '/api/sm-student';
// 综合测评后端服务
const sm_comprehensive_evaluation_url = '/api/sm-comprehensive-evaluation';
// 请假管理后台服务
const sm_holiday_url = '/api/sm-holiday';
// 违纪处分后台服务
const sm_punish_url = '/api/sm-punish';
// 奖学金后台服务
const sm_scholarship_url = '/api/sm-scholarship';
// 助学金后台服务
const sm_grant_url = '/api/sm-student-grant';
// 助学金后台服务
const sm_honorary_url = '/api/sm-honorary-title';
// 工作流后台服务
const sm_bpm_url = '/api/sm-bpm-expansion';
// restfulbpm服务
const restful_bpm_url = 'bpm/rest';
// 勤工助学服务
const student_work_study_url = '/api/sm-work-study';
// 困难生服务
const difficult_student_url = '/api/sm-difficult-student';

/************************************ 公共请求 ************************************/
// 登录
export const reqPostLogin = params => {
	return postForm(`/login`, params);
};

// 退出
export const reqPostLogout = params => {
	return query(`/logout`, params);
};

// 登录
export const reqPostTryLoginUserInfo = params => {
	return postForm(`/tryLoginUserInfo`, params); 
};

// 授权登录模式
export const reqPostAuthLogin = (headers,params) => {
	return authLoginForm(`/tryLoginUserInfo`, headers,params); 
};







/************************************ 移动学工 ************************************/

/**********首页**********/
/**
 * 查询可用服务列表
 * @param {*} params
 */
export const getAvailableServices = params => {
	return query(`${sm_mobile_url}/homePage/getAvailableServices`, params);
};

/**********请假管理-教师端**********/
/**
 * 查询学年列表数据
 * @param {*} params
 */
export const getSchoolYearList = params => {
	return query(`${sm_mobile_url}/openapi/getSchoolYearList`);
};
/**
 * 查询当前学年、学期
 * @param {*} params
 */
export const getCurrentSchoolYearAndSemester = params => {
	return query(`${sm_mobile_url}/openapi/getCurrentSchoolYearAndSemester`);
};


/************************************ 系统管理 ************************************/

// 查询移动端服务图标
export const getServiceIcon = params => {
	return query(`${sm_xtgl_url}/openapi/getServiceIcon`, params);
};





/************************************ 学生信息 ************************************/

// 查询学生基本信息
export const getStudentBaseInfo = params => {
	return query(`${sm_student_url}/openapi/getStudentBaseInfo`, params);
};

//通过当前登录人和当前时间查询有效的采集任务
export const getValidTask = params =>{
	return post(`${sm_student_url}/openapi/studentInfoCollect/getValidTask/`+params.userid);
};

// 学生问卷调查更新填写状态
export const updateCjzt = params =>{
	return post(`${sm_student_url}/openapi/studentInfoCollect/updateCjzt`,params);
};

// 移动端-教师端-学生信息-院系专业人数统计
export const selectCountXsByXyAndZy = params => {
	return query(`${sm_student_url}/openapi/studentInfoStatistics/selectCountXsByXyAndZy`, params);
};

// 移动端-教师端-学生信息-年级人数统计
export const selectCountXsByNj = params => {
	return query(`${sm_student_url}/openapi/studentInfoStatistics/selectCountXsByNj`, params);
};

// 移动端-教师端-学生信息-民族人数统计
export const selectCountXsByMz = params => {
	return query(`${sm_student_url}/openapi/studentInfoStatistics/selectCountXsByMz`, params);
};

// 移动端-教师端-学生信息-政治面貌人数统计
export const selectCountXsByZzmm = params => {
	return query(`${sm_student_url}/openapi/studentInfoStatistics/selectCountXsByZzmm`, params);
};

// 移动端-教师端-学生信息-学生类别人数统计
export const selectCountXsByXslb = params => {
	return query(`${sm_student_url}/openapi/studentInfoStatistics/selectCountXsByXslb`, params);
};

// 移动端-教师端-学生信息-生源地人数统计(截取到省份)
export const selectCountXsBySyd = params => {
	return query(`${sm_student_url}/openapi/studentInfoStatistics/selectCountXsBySyd`, params);
};


// 移动端-教师端-学生信息-统计学校人数与在校人数
export const selectCountXsByTotalNumber = params => {
	return query(`${sm_student_url}/openapi/studentInfoStatistics/selectCountXsByTotalNumber`, params);
};

// 移动端-教师端-学生信息-统计学校性别，男女生人数
export const selectCountXsByXb = params => {
	return query(`${sm_student_url}/openapi/studentInfoStatistics/selectCountXsByXb`, params);
};





/************************************ 学工队伍 ************************************/

// 查询教师基本信息
export const getTeacherBaseInfo = params => {
	return query(`${sm_xgdw_url}/openapi/getTeacherBaseInfo`, params);
};
// 查询当前登录用户任职职务层级信息
export const getUserPostLevelInfo = params => {
	return query(`${sm_xgdw_url}/openapi/getUserPostLevelInfo`);
};





/************************************ 请假管理 ************************************/

/**
 * 根据条件查询请假未销假的饼图统计数据（男、女、总数）
 * @param {*} params
 */
export const getStatisticsData = params => {
	return query(`${sm_holiday_url}/openapi/getStatisticsData`, params);
};
/**
 * 根据条件查询请假未销假的分组统计数据（男、女、总数）
 * @param {*} params
 */
export const getGroupStatisticsData = params => {
	return query(`${sm_holiday_url}/openapi/getGroupStatisticsData`, params);
};
/**
 * 查询用户请假记录
 * @param {*} params
 */
export const getUserHolidayInfoList = params => {
	return query(`${sm_holiday_url}/openapi/getUserHolidayInfoList`, params);
};
/**
 * 申请销假
 * @param {*} params
 */
export const applyCancellationOfLeave = params => {
	return post(`${sm_holiday_url}/openapi/applyCancellationOfLeave`, params);
};

/**
 * 申请销假
 * @param {*} params
 */
export const getXsqjsqByPkid = params => {
	return query(`${sm_holiday_url}/openapi/getXsqjsqByPkid/${params.pkid}`);
};






/************************************ 奖学金 ************************************/

/**
 * 查询奖学金数据
 * @param {*} params
 */
export const getScholarShip = params => {
	return query(`${sm_scholarship_url}/openapi/getScholarShip`, params);
};
/**
 * 查询奖学金详情数据
 * @param {*} params
 */
export const getScholarShipDetail = params => {
	return query(`${sm_scholarship_url}/openapi/getScholarShipDetail`, params);
};




/************************************ 助学金 ************************************/

/**
 * 查询助学金数据
 * @param {*} params
 */
export const getGrant = params => {
	return query(`${sm_grant_url}/openapi/getGrant`, params);
};
/**
 * 查询助学金详情数据
 * @param {*} params
 */
export const getGrantDetail = params => {
	return query(`${sm_grant_url}/openapi/getGrantDetail`, params);
};




/************************************ 荣誉称号 ************************************/

/**
 * 查询助学金数据
 * @param {*} params
 */
export const getHonorary = params => {
	return query(`${sm_honorary_url}/openapi/getHonorary`, params);
};
/**
 * 查询助学金详情数据
 * @param {*} params
 */
export const getHonoraryDetail = params => {
	return query(`${sm_honorary_url}/openapi/getHonoraryDetail`, params);
};




/************************************ 违纪处分 ************************************/

// 查询当前登录人所有违纪情况
export const getDispositionRecord = params => {
	return query(`${sm_punish_url}/openapi/getDispositionRecord`, params);
};

// 查询当前学校的违纪处分解除流程信息
export const getPunishRelieveProcessInfo = params => {
	return query(`${sm_bpm_url}/openapi/getPunishRelieveProcessInfo`, params);
};

//查询当前等处分详情
export const getPunishDetial = params => {
	return query(`${sm_punish_url}/openapi/getPunishDetial`, params);
};

//查询当前处分申诉详情
export const getPunishAppeal = params => {
	return query(`${sm_punish_url}/openapi/getPunishAppeal`, params);
};

//查询当前处分解除详情
export const getPunishRelieve = params => {
	return query(`${sm_punish_url}/openapi/getPunishRelieve`, params);
};

//查询查询当前学期下拉框
export const getSemester = params => {
	return query(`${sm_punish_url}/openapi/getSemester`, params);
};

//查询当前学期数据情况
export const getPunishStatisticsData = params => {
	return query(`${sm_punish_url}/openapi/getNowStatisticsData`, params);
};

//查询当前学院数据情况
export const getPunishSexData = params => {
	return query(`${sm_punish_url}/openapi/getPunishSexData`, params);
};

//查询当前班级数据情况
export const getPunishPerData = params => {
	return query(`${sm_punish_url}/openapi/getPunishPerData`, params);
};

//学生申诉
export const saveAppeal = params => {
	return query(`${sm_punish_url}/openapi/saveAppeal`, params);
};


/************************************ 综合测评 ************************************/

// 查询当前登录学生参与的所有测评任务
export const getAllTaskByXh = params => {
	return query(`${sm_comprehensive_evaluation_url}/ydxg/student/openapi/getAllTaskByXh`, params);
};

// 查询测评表单信息
export const getEvaluationInfo = params => {
	return post(`${sm_comprehensive_evaluation_url}/ydxg/student/openapi/getYdxgEvaluationInfo`, params, {});
};

// 查询指标接口分数
export const getZbjkFs = params => {
	return query(`${sm_comprehensive_evaluation_url}/ydxg/student/openapi/` + params.zbjk, {});
};

// 根据测评项ID查询勾选项信息
export const getHookOptionsByCpxid = params => {
	return query(`${sm_comprehensive_evaluation_url}/ydxg/student/openapi/getHookOptionsByCpxid`, params);
};

// 查询勾选项详情
export const getEvaluationHookOptionDetail = params => {
	return query(`${sm_comprehensive_evaluation_url}/ydxg/student/openapi/getEvaluationHookOptionDetail/` + params.cpxid, {});
};

// 保存环节打分详情信息、各环节测评情况等
export const insertLinkScoreDetail = params => {
	return post(`${sm_comprehensive_evaluation_url}/ydxg/student/openapi/insertLinkScoreDetail`, params, {});
};

//根据环节ID查询对应的测评项信息
export const getEvaluationItemByHjid = params => {
	return query(`${sm_comprehensive_evaluation_url}/ydxg/student/openapi/getEvaluationItemByHjid`, params);
};

//保存附件信息到动态表单
export const uploadFileToDynamicForm = params => {
	return post(`front/zhxg-unauth/dynamic/multipartInsert`, params, {});
};

//启用附件
export const saveFileToDynamicForm = params => {
	return post(`front/zhxg-unauth/dynamic/save`, params, {});
};

//获取测评结果信息
export const getYdxgEvaluationResultInfo = params => {
	return post(`${sm_comprehensive_evaluation_url}/ydxg/student/openapi/getYdxgEvaluationResultInfo`, params, {});
};

//获取流程对应的所有环节
export const getProcessLinkList = params => {
	return query(`${sm_comprehensive_evaluation_url}/ydxg/student/openapi/getProcessLinkList`, params, {});
};


/************************************restfulbpm的流程 ************************************/
export const getProcessFormData = params => {
	return query(`${restful_bpm_url}/processes/tasks/form/json`, params);
};

// 资格判断
export const checkQulification = params => {
	return query(params.url, params.processApplyInfo);
};

/************************************ bpm流程 ************************************/
// 查询当前登录人-bpm-我的待办数据
export const queryBpmwaitingProcess = params => {
	return query(`${sm_mobile_url}/processCenter/queryBpmwaitingProcess`, params);
}


// 查询当前登录人-bpm-我的申请数据
export const queryBpmApplyedProcess = params => {
	return query(`${sm_mobile_url}/processCenter/queryBpmApplyedProcess`, params);
}

// 查询当前登录人-bpm-我的参与数据
export const queryBpmRelatedProcess = params => {
	return query(`${sm_mobile_url}/processCenter/queryBpmRelatedProcess`, params);
}



/************************************ 流程扩展服务 ************************************/

// 查询当前登录人能申请的所有流程
export const getAllApplyBpm = params => {
	return query(`${sm_bpm_url}/openapi/getAllApplyBpm`, params);
};
// 获取学工流程相关配置
export const getProcessFormParams = params => {
	return query(`${sm_bpm_url}/processdefine/getProcessFormParams`, params);
};
// 查询审批意见（流转记录）
export const getReviewInfo = lcsqid => {
	return query(`${sm_bpm_url}/processdefine/${lcsqid}/getReviewInfo`);
};





/************************************ 勤工助学 ************************************/
//根据学号查询学生当前任职的所有岗位信息
export const getStudentRzgwxx = params => {
	return query(`${student_work_study_url}/ydxg/openapi/getStudentRzgwxx`, params);
};

//查询岗位详情和薪资明细
export const getGwxqAndXcmx = params => {
	return post(`${student_work_study_url}/ydxg/openapi/getGwxqAndXcmx`, params, {});
};

//保存打卡记录
export const saveStudentDkjl = params => {
	return post(`${student_work_study_url}/ydxg/openapi/saveStudentDkjl`, params, {});
};

//查询当天所有打卡记录
export const getCurrentDateStudentDkjlList = params => {
	return post(`${student_work_study_url}/ydxg/openapi/getCurrentDateStudentDkjlList`, params, {});
};

//查询当月总工作量
export const getCurrentMonthStudentZgzl = params => {
	return post(`${student_work_study_url}/ydxg/openapi/getCurrentMonthStudentZgzl`, params, {});
};

//查询当天工作时长和打卡次数
export const getCurrentDateStudentZgzl = params => {
	return post(`${student_work_study_url}/ydxg/openapi/getCurrentDateStudentZgzl`, params, {});
};

//查询当天所有的打卡记录(不分上下班打卡类型)
export const getAllClockRecord = params => {
	return post(`${student_work_study_url}/ydxg/openapi/getAllClockRecord`, params, {});
};

//学生缺卡申请提交方法
export const submitRepairClockRecord = params => {
	return post(`${student_work_study_url}/ydxg/openapi/submitRepairClockRecord`, params, {});
};

//查询当前登录人所有的在职岗位负责人信息
export const getTeacherRzgwxx = params => {
	return query(`${student_work_study_url}/ydxg/openapi/getTeacherRzgwxx`, params);
};

//查询该岗位对应的所有补卡记录
export const getRepairRecordList = params => {
	return query(`${student_work_study_url}/ydxg/openapi/getRepairRecordList`, params);
};

//审核补卡记录并计算工作量
export const approveStudentDkjl = params => {
	return post(`${student_work_study_url}/ydxg/openapi/approveStudentDkjl`, params, {});
};

//腾讯地图webservice接口
export const getAddressList = params => {
	return post(`${student_work_study_url}/ydxg/openapi/getTencentAddressList`, params, {});
};

//腾讯地图webservice接口
export const getCurrentMapType = params => {
	return query(`${student_work_study_url}/ydxg/openapi/getCurrentMapType`, params);
};

//查询任职岗位信息
export const getRzgwxx = params => {
	return query(`${student_work_study_url}/ydxg/openapi/getRzgwxx`, params);
};

//查询补卡审核详情信息
export const getApproveRecordInfo = params => {
	return post(`${student_work_study_url}/ydxg/openapi/getApproveRecordInfo`, params, {});
};

/************************************ 困难生 ************************************/
//根据学号查询学生所有困难生申请信息
export const getDifficultStudentApply = params => {
    return query(`${difficult_student_url}/openapi/getDifficultStudentApply`, params,{});
};
