import React, { Component } from 'react';
import PropTypes from 'prop-types';
import router from 'umi/router';
import { connect } from 'dva';
import { Accordion, List } from 'antd-mobile';

import styles from './index.less';

/**
 * 学院-年级请假人数统计页面
 * @author: zengxiangkai
 * @date: 2020-04-22 17:22:31
 */
class AcademyStatistics extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'academy_statistics/fetchGroupStatisticsData',
        });
    }

    /**
     * * 列表项点击回调
     * @param {*} pkid 
     * @param {*} level 
     */
    handleListItemClick(item, title) {
        this.props.dispatch({
            type: 'academy_statistics/udpateState',
            payload: { selectItemData: item }
        });
        router.push({ pathname: '/sm-holiday/teacher/gradeStatistics', query: { nav: title + '级', from: 'academy_statistics' } });
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
                    各年级情况
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

AcademyStatistics.propTypes = {
    statisticsData: PropTypes.object, //学院请假人数统计数据
};

function mapStateToProps(state) {
    const { pie_statistics, academy_statistics } = state;
    return {
        statisticsData: pie_statistics ? pie_statistics.selectItemData : {},
        ...academy_statistics
    };
}

export default connect(mapStateToProps)(AcademyStatistics);