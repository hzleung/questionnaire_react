import React from 'react';
import { connect } from 'dva';
import { getUserCache } from '@/utils/utils';
import styles from './index.less';
import { Toast } from 'antd-mobile';
import { Link } from 'umi';

/**
 * 困难生认定-学生页面（困难生认定申请记录查看）
 * @author: huangyingjie
 * @date: 2020-05-19 16:09:03
 */
const arrowBlack = require('@/assets/images/studentSutffMobile/arrow_black.png');

class StudentIndexPage extends React.Component {

    //初始化数据
    componentDidMount() {
        const { dispatch } = this.props;
        //查询当前登录人所有的困难生认定信息
        dispatch({
            type: 'difficult_student/fetchDifficultStudentApply',
            params: { xh: getUserCache().userId },
        });
    }


    render() {
        const { taskList } = this.props;
        return (
            <div>
                <div className={styles.itemBox} style={{
                    padding: '15px 15px',
                }}
                >
                    {
                        taskList.map((item) => {
                            return (
                                    <Link to={`/process/apply/${item.LCID}/${item.LCSLID}`}>
                                <div key={item.XQID}>
                                    < div className={styles.boxGray} >
                                        <div>
                                            <div className={styles.time}>认定周期：{item.RDZQ}</div>
                                            <div className={styles.time}>申请时间：{item.SQSJ}</div>

                                            <div className={styles.time}>
                                                困难等级：{item.KNDJ}
                                            </div>
                                        </div>
                                        <img src={arrowBlack} alt="" />
                                    </div>
                                </div>
                                </Link>
                            );
                        })
                    }
                  {
                    !taskList || taskList.length===0 &&<div className={styles.nodata}>
                      <img src={require('../../../assets/images/nodata.png')} alt="" />
                      <div>当前暂无数据</div>
                    </div>
                  }
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return { ...state.difficult_student };
})(StudentIndexPage);
