/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { List, Picker } from 'antd-mobile';

//导入饼图
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';

import styles from "./index.less";

const female = require('../../../../assets/images/sm-holiday/female.png');
const male = require('../../../../assets/images/sm-holiday/male.png');

/**
 * 校级数据范围页面
 * @author: zengxiangkai
 * @date: 2020-04-20 10:20:09
 */
class SchoolPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        const { currentLevel } = this.props;
        if (currentLevel.value) {
            this.props.dispatch({
                type: 'pie_statistics/fetchPickerData',
                payload: { currentLevel: currentLevel.value, zzjgid: currentLevel.zzjgid }
            });
        }
    }

    /**
     * * 饼图参数配置
     *
     * @memberof SchoolPage
     */
    getOption = (pieData) => {

        let option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br />{b} ({d}%)'
            },
            title: {
                text: pieData.total + '人',
                subtext: '总人数',
                x: 'center',
                y: 'center',
                top: '36%',
                left: '48%',
                textStyle: {
                    fontSize: 15,
                    fontWeight: 500
                },
                subtextStyle: {
                    fontSize: 13,
                    color: '#999999',
                    fontWeight: 400
                }
            },
            series: [
                {
                    name: '请假人数',
                    type: 'pie',
                    radius: ['30%', '50%'],
                    center: ['55%', '44%'],
                    data: [
                        { value: pieData.man, name: '男生数: \n' + pieData.man + '人' },
                        { value: pieData.woman, name: '女生数: \n' + pieData.woman + '人' }
                    ],
                    barWidth: 40,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            normal: {
                                color: '#FAD337'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderWidth: 5, //设置border的宽度有多大
                            borderColor: '#fff',
                            color: function (params) {
                                //自定义颜色
                                let colorList = [
                                    '#77BEFF', '#C7E08A'
                                ];
                                return colorList[params.dataIndex];
                            }
                        }
                    }
                }
            ]
        };

        return option;
    }

    /**
     * * 组装学年学期Picker数据
     *
     * @memberof SchoolPage
     */
    handlePickerData = list => {
        let data = [];
        data.push(list);
        data.push(
            [
                {
                    label: '上学期',
                    value: '1',
                },
                {
                    label: '下学期',
                    value: '2',
                },
            ]
        );
        return data;
    }

    /**
     * * 学年学期选择器变化回调
     *
     * @memberof SchoolPage
     */
    handlePickerChange = v => {
        this.props.dispatch({
            type: 'pie_statistics/udpateState',
            payload: { pickerValue: v }
        });
    }

    /**
     * * 学年学期选择器确定选择回调
     *
     * @memberof SchoolPage
     */
    handlePickerOk = v => {
        this.props.dispatch({
            type: 'pie_statistics/udpateState',
            payload: { pickerValue: v },
        });

        const { currentLevel } = this.props;

        this.props.dispatch({
            type: 'pie_statistics/fetchPieStatisticsData',
            payload: { dqxq: v[0] + '-' + v[1], zwcj: currentLevel.value, zzjgid: currentLevel.zzjgid }
        });
    }

    /**
     * * 渲染相应数据层级范围详情列表
     *
     * @memberof SchoolPage
     */
    renderList = () => {
        const { currentLevel, list } = this.props;
        const level = currentLevel.value;

        let title = '';

        switch (level) {
            case 'school':
                title = '各学院情况';
                break;
            case 'academy':
                title = '各年级情况';
                break;
            case 'grade':
                title = '各班级情况';
                break;
            case 'class':
                title = '请假学生详情';
                break;
            default:
                break;
        }

        return level != 'class' ?
            (
                <div className={styles.itemBox}>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.detialBox}>
                        {
                            list && list.length > 0 ?
                                list.map((item, index) => {
                                    return (
                                        <div key={index} className={styles.items}
                                            onClick={e => {
                                                this.handleListItemClick(item, item.title, level);
                                            }}>
                                            <div className={styles.title}>{level == 'academy' ? item.title + '级' : item.title}</div>
                                            <div className={styles.detial}>
                                                <span className={styles.man}>男 &nbsp;</span>
                                                <span className={styles.value}>{item.man}&nbsp;&nbsp;</span>
                                                <span className={styles.woman}>女&nbsp;</span>
                                                <span className={styles.value}>{item.woman}&nbsp;&nbsp;</span>
                                                <span className={styles.total}>{item.total}人&nbsp;&nbsp;&nbsp;</span>
                                                <img className={styles.arrow} src={require('../../../../assets/images/sm-holiday/arrow_black.png')} alt="" />
                                            </div>
                                            {index != list.length - 1 && <div className={styles.scaleBox}><div className={styles.scale}/></div>}
                                        </div>
                                    );
                                })
                                : <div className={styles.items}><div style={{ width: '100%', textAlign: 'center' }}>暂无数据</div></div>
                        }

                    </div>
                </div>
            )
            :
            (
                <div className={styles.itemBox}>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.detialBox}>
                        {
                            list && list.length > 0 ?
                                list.map((item, index) => {
                                    return (
                                        <div key={index} className={styles.item_stu}>
                                            <div className={styles.title}> {item.xm} <img src={item.xbm == '1' ? male : female} alt="" /></div>
                                            <div>{item.xh}</div>
                                            {index != list.length - 1 && <div className={styles.scaleBox}><div className={styles.scale}/></div>}
                                        </div>
                                    );
                                })
                                : <div className={styles.items}><div style={{ width: '100%', textAlign: 'center' }}>暂无数据</div></div>
                        }
                    </div>
                </div>
            )
            ;
    }

    /**
     * * 列表项点击回调
     * @param {*} pkid 
     * @param {*} level 
     */
    handleListItemClick(item, title, level) {
        switch (level) {
            case 'school':
                this.props.dispatch({
                    type: 'pie_statistics/udpateState',
                    payload: { selectItemData: item }
                });
                router.push({ pathname: '/sm-holiday/teacher/academyStatistics', query: { nav: title, from: 'pie_statistics' } });
                break;
            case 'academy':
                this.props.dispatch({
                    type: 'pie_statistics/udpateState',
                    payload: { selectItemData: item }
                });
                router.push({ pathname: '/sm-holiday/teacher/gradeStatistics', query: { nav: title + '级', from: 'pie_statistics' } });
                break;
            case 'grade':
                this.props.dispatch({
                    type: 'pie_statistics/udpateState',
                    payload: { selectItemData: item }
                });
                router.push({ pathname: '/sm-holiday/teacher/classStatistics', query: { nav: title, from: 'pie_statistics' } });
                break;
            default:
                break;
        }
    }

    render() {

        const { currentLevel, pickerValue, schoolYearList, pieData } = this.props;

        return (
            <div>
                <style jsx="true" global="true">
                    {/* antd-mobile 的自定义样式 */}
                    {`  
                        .am-list-item{
                            min-height: 0px !important;
                            background-color: rgba(0,0,0,0)!important;
                            font-size：12px !important;
                        }
                        .am-list-item-middle{
                            min-height: 0px !important;
                            background-color: rgba(0,0,0,0)!important;
                            font-size：12px !important;
                        }
                        .am-list-line{
                            justify-content: space-between !important;
                        }
                        .am-list-extra{
                            flex-basis: initial !important;
                            padding-top: 4px !important;
                            font-size: 12px !important;
                        }
                    `}
                </style>
                <div className={styles.contentBox}>
                    <div className={styles.titleBox}>
                        <div className={styles.title}>
                            {currentLevel.text}请假人数统计
                        </div>
                        <div className={styles.pickerBox} onClick={(e) => e.preventDefault}>
                            <Picker
                                data={this.handlePickerData(schoolYearList)}
                                cascade={false}
                                extra="请选择"
                                value={pickerValue}
                                onChange={this.handlePickerChange}
                                onOk={this.handlePickerOk}
                            >
                                <List.Item arrow="horizontal"></List.Item>
                            </Picker>
                        </div>
                    </div>
                    <div className={styles.echartBox} >
                        {/* <Card.Grid className="pie_b"> */}
                        <ReactEcharts option={this.getOption(pieData)} />
                        {/* </Card.Grid> */}
                    </div>
                    <div className={styles.leftCycle}></div>
                    <div className={styles.rightCycle}></div>
                    <hr className={styles.scale} />
                </div>
                {this.renderList()}
            </div>
        );
    }
}

SchoolPage.propTypes = {

};

function mapStateToProps(state) {
    const { login, holiday_teacher, pie_statistics } = state;
    return {
        user: login.user,
        ...holiday_teacher,
        ...pie_statistics
    };
}

export default connect(mapStateToProps)(SchoolPage);