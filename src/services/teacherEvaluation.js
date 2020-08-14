import {  query } from '@/utils/request';

const smComprehensiveEvaluationUrl = 'api/sm-comprehensive-evaluation';
const xgdwUrl = 'api/zhxg-xgdw';

export const getTaskList = () => {
	return query(`${smComprehensiveEvaluationUrl}/mobile/teacher/task/list`);
};

export const queryYhZwxx = userId => {
    return query(`${xgdwUrl}/openapi/${userId}/queryYhZwxx`);
};

export const queryEvaluationSchoolList = params => {
    return query(`${smComprehensiveEvaluationUrl}/mobile/teacher/task/evaluation/school`,params);
};

export const queryEvaluationGradeList = params => {
    return query(`${smComprehensiveEvaluationUrl}/mobile/teacher/task/evaluation/grade`,params);
};

export const queryEvaluationClassList = params => {
    return query(`${smComprehensiveEvaluationUrl}/mobile/teacher/task/evaluation/class`,params);
};

export const queryEvaluationStudentList = params => {
    return query(`${smComprehensiveEvaluationUrl}/mobile/teacher/task/evaluation/student`,params);
};

export const queryEvaluationTask = taskId => {
    return query(`${smComprehensiveEvaluationUrl}/evaluationTask/${taskId}/get`);
};
