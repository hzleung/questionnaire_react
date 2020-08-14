import React from 'react';
import { connect } from 'dva';
import { Picker, List } from 'antd-mobile';

import styles from './index.less';
import { Link } from 'umi';

const pickerData = [
    {
        label: '全部状态',
        value: '0',
    },
    {
        label: '审核中',
        value: '1',
    },
    {
        label: '审核通过',
        value: '2',
    },
    {
        label: '审核不通过',
        value: '3',
    },
    // {
    //     label: '撤销申请',
    //     value: '-1',
    // }
];

const pickerTransData = {
    '0': '全部状态',
    '1': '审核中',
    '2': '审核通过',
    '3': '审核不通过',
    // '-1': '撤销申请',
};

/**
 * 请假管理-学生页面（请假记录查看）
 * @author: zengxiangkai
 * @date: 2020-05-13 16:15:55
 */
class StudentIndexPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectValue: ['0'],
        };
    }

    componentDidMount() {
        const { location } = this.props;
        const { search } = location;
        const { selectValue } = this.state;

        this.props.dispatch({
            type: 'holiday_student/fetchHolidayInfoList',
            payload: { qjztm: selectValue[0] },
            search: search,
        });
    }

    /**
     * * 选择器选中后回调
     *
     * @memberof StudentIndexPage
     */
    handlePickerChange = v => {
        this.setState({ selectValue: v }, () => {
            this.props.dispatch({
                type: 'holiday_student/fetchHolidayInfoList',
                payload: { qjztm: v[0] },
            });
        });
    }


    render() {

        let { selectValue } = this.state;
        let { list } = this.props;

        return (
            <div style={{ padding: '19px 14.5px' }}>
                <style>
                    {
                        `
                            .am-list-extra{
                                overflow: initial !important;
                                padding-top: 0 !important;
                                padding-bottom: 18px !important;
                                color: rgba(24, 144, 255, 1) !important;
                                font-size: 14px !important;
                            }
                            .am-list-item {
                                padding-left: 7px !important;
                            }
                        `
                    }
                </style>
                <div className={styles.headBox}>
                    <div className={styles.title}>
                        申请记录
                    </div>
                    <div className={styles.selectBox}>
                        <Picker
                            data={pickerData}
                            title="选择状态"
                            cols={1}
                            extra={pickerTransData[selectValue]}
                            value={selectValue}
                            onChange={this.handlePickerChange}
                        >
                            <List.Item />
                        </Picker>
                        <div className={styles.triangle} />
                    </div>
                </div>

                <div className={styles.itemBox}>
                    {
                        list.length > 0 ? list.map((item, index) => {

                            let approvalDom, statusDom;

                            switch (item.QJZTM) {
                                case '1':
                                    approvalDom = <div className={styles.pass}>{item.QJZT}</div>;
                                    break;
                                case '2':
                                    approvalDom = <div className={styles.pass}>{item.QJZT}</div>;
                                    break;
                                case '3':
                                    approvalDom = <div className={styles.fail}>{item.QJZT}</div>;
                                    break;
                                case '-1':
                                    approvalDom = <div className={styles.pass}>{item.QJZT}</div>;
                                    break;
                                default: break;
                            }
                            switch (item.XJZT) {
                                case '0':
                                    statusDom = <div className={styles.status_0}>{item.XJMC}</div>;
                                    break;
                                case '1':
                                    statusDom = <div className={styles.status_1}>{item.XJMC}</div>;
                                    break;
                                case '2':
                                    statusDom = <div className={styles.status_0}>{item.XJMC}</div>;
                                    break;
                                case '9':
                                    statusDom = <div className={styles.status_9}>{item.XJMC}</div>;
                                    break;
                                default: break;
                            }
                            return (
                                <Link
                                    key={index}
                                    to={{
                                        pathname: "/sm-holiday/student/index/details",
                                        search: `?pkid=${item.PKID}`,
                                    }}
                                >
                                    <div className={styles.item}>
                                        <div className={styles.titleBox}>
                                            <div className={styles.title}>{item.QJLX}{statusDom}</div>
                                            <div className={styles.applyTime}>{item.QJSQSJ}</div>
                                        </div>
                                        <div className={styles.scale} />
                                        <div className={styles.content}>
                                            <div className={styles.startTime}>开始时间:{item.QJKSSJ}</div>
                                            <div className={styles.endTime}>结束时间:{item.QJJSSJ}</div>
                                            <div className={styles.context}>请假理由：{item.QJLY}</div>
                                            {approvalDom}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                            :
                            <div className={styles.nodata}>
                                <img src={require('../../../assets/images/nodata.png')} alt="" />
                                <div>当前暂无数据</div>
                            </div>
                    }
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { login, holiday_student, loading } = state;
    return {
        user: login.user,
        ...holiday_student,
        loading
    };
}

export default connect(mapStateToProps)(StudentIndexPage);