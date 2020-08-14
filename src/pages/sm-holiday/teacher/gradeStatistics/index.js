import React, { Component } from 'react';
import PropTypes from 'prop-types';
import router from 'umi/router';
import { connect } from 'dva';
import { Accordion } from 'antd-mobile';

import styles from './index.less';

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
            type: 'grade_statistics/fetchGroupStatisticsData',
        });
    }

    /**
     * * 列表项点击回调
     * @param {*} pkid 
     * @param {*} level 
     */
    handleListItemClick(item, title) {
        this.props.dispatch({
            type: 'grade_statistics/udpateState',
            payload: { selectItemData: item }
        });
        router.push({ pathname: '/sm-holiday/teacher/classStatistics', query: { nav: title, from: 'grade_statistics' } });
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
                        <div className={styles.key}>女生人数</div>
                    </div>
                    <div className={styles.detialBox}>
                        <div className={styles.value}>{statisticsData.total}</div>
                        <div className={styles.key}>请假总人数</div>
                    </div>
                </div>
                <div className={styles.detialTitle}>
                    各班级情况
                </div>
                <div className={styles.group}>
                    <div className={styles.detialBox}>
                        {
                            list && list.length > 0 ?
                                list.map((item, index) => {
                                    return (
                                        <div key={index} className={styles.items}
                                            onClick={e => {
                                                this.handleListItemClick(item, item.title);
                                            }}>
                                            <div className={styles.title}>{item.title + '级'}</div>
                                            <div className={styles.detial}>
                                                <span className={styles.man}>男 &nbsp;</span>
                                                <span className={styles.value}>{item.man}&nbsp;&nbsp;</span>
                                                <span className={styles.woman}>女&nbsp;</span>
                                                <span className={styles.value}>{item.woman}&nbsp;&nbsp;</span>
                                                <span className={styles.total}>{item.total}人&nbsp;&nbsp;&nbsp;</span>
                                                <img className={styles.arrow} src={require('../../../../assets/images/sm-holiday/arrow_black.png')} alt="" />
                                            </div>
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
    const { routing, pie_statistics, academy_statistics, grade_statistics } = state;
    const { location } = routing;
    let statisticsData = location.query.from == 'academy_statistics' ?
        (academy_statistics ? academy_statistics.selectItemData : {})
        :
        (pie_statistics ? pie_statistics.selectItemData : {});
    return {
        // 判断是从academyStatistics页面跳转还是pieStatistics跳转
        statisticsData,
        ...grade_statistics
    };
}

export default connect(mapStateToProps)(GradeStatistics);