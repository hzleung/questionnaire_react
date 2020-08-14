import { query } from '@/utils/request';

const honoraryUrl = 'api/sm-honorary-title';

export const queryStatistics = params => {
    return query(`${honoraryUrl}/openapi/honorary/statistics`,params);
};

export const queryStatisticsDetail = params => {
    return query(`${honoraryUrl}/openapi/honorary/statistics/detail`,params);
};
