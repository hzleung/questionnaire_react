import { query } from '@/utils/request';

const grantUrl = 'api/sm-student-grant';

export const queryStatistics = params => {
    return query(`${grantUrl}/openapi/grant/statistics`,params);
};

export const queryStatisticsDetail = params => {
    return query(`${grantUrl}/openapi/grant/statistics/detail`,params);
};
