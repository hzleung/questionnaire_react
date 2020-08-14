import { query } from '@/utils/request';

const scholarshipUrl = 'api/sm-scholarship';

export const queryScholarshipStatistics = params => {
    return query(`${scholarshipUrl}/openapi/scholarship/statistics`,params);
};

export const queryStatisticsDetail = params => {
    return query(`${scholarshipUrl}/openapi/scholarship/statistics/detail`,params);
};
