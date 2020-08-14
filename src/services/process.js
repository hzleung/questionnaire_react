import { query } from '@/utils/request';
const smMobileUrl = 'api/sm-mobile';

export const queryStudent = parmas => {
    return query(`${smMobileUrl}/openapi/stu/selector`,parmas);
};
