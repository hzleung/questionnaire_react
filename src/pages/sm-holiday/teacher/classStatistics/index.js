import React, { Component } from 'react';
import PropTypes from 'prop-types';
import router from 'umi/router';
import { connect } from 'dva';
import { Accordion } from 'antd-mobile';

import styles from './index.less';

const female = require('../../../../assets/images/sm-holiday/female.png');
const male = require('../../../../assets/images/sm-holiday/male.png');

/**
 * 年级-班级请假人数统计页面
 * @author: zengxiangkai
 * @date: 2020-04-23 10:01:52
 */
class GradeStatistics extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        this.props.dispatch({
            type: 'class_statistics/fetchGroupStatisticsData',
        });
    }

    render() {

        const { statisticsData, list } = this.props;

        return (
            <div style={{ padding: 15 }}>
                <div className={styles.titleBox}>
                    <div className={styles.detialBox}>
                        <div className={styles.value}>{statisticsData.man}</div>
                        <div className={styles.key}>男生人数</div>
                    </div>
                    <div className={styles.detialBox}>
                        <div className={styles.value}>{statisticsData.woman}</div>
                        <div className={styles.key} >女生人数</div>
                    </div>
                    <div className={styles.detialBox}>
                        <div className={styles.value}>{statisticsData.total}</div>
                        <div className={styles.key}>请假总人数</div>
                    </div>
                </div>
                <div className={styles.detialTitle}>
                    请假学生详情
                </div>
                <div className={styles.group}>
                    <div className={styles.detialBox}>
                        {
                            list && list.length > 0 ?
                                list.map((item, index) => {
                                    return (
                                        <div key={index} className={styles.items}>
                                            <div className={styles.title}> {item.xm} <img src={item.xbm == '1' ? male : female} alt="" /></div>
                                            <div>{item.xh}</div>
                                            {index != list.length - 1 && <div className={styles.scaleBox}><div className={styles.scale}></div></div>}
                                        </div>
                                    )
                                })
                                : <div className={styles.items}><div style={{ width: '100%', textAlign: 'center' }}>暂无数据</div></div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

GradeStatistics.propTypes = {
    statisticsData: PropTypes.object, //年级请假人数统计数据
};

function mapStateToProps(state) {
    const { routing, pie_statistics, class_statistics, grade_statistics } = state;
    const { location } = routing;
    let statisticsData = location.query.from == 'grade_statistics' ?
        (grade_statistics ? grade_statistics.selectItemData : {})
        :
        (pie_statistics ? pie_statistics.selectItemData : {});
    return {
        // 判断是从gradeStatistics页面跳转还是pieStatistics跳转
        statisticsData,
        ...class_statistics
    };
}

export default connect(mapStateToProps)(GradeStatistics);