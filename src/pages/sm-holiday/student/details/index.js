import React from 'react';
import { connect } from 'dva';
import { WhiteSpace } from 'antd-mobile';
import Opinion from '@/pages/process/opinion/index';
import styles from './index.less';

const icon_fail = require('../../../../assets/images/sm-holiday/icon_fail.png'),
    icon_pass = require('../../../../assets/images/sm-holiday/icon_pass.png'),
    femal = require('../../../../assets/images/sm-holiday/female.png'),
    mal = require('../../../../assets/images/sm-holiday/male.png'),
    doing = require('../../../../assets/images/sm-holiday/doing_icon.png'),
    success = require('../../../../assets/images/sm-holiday/succeed_icon.png');

/**
 * 请假管理-学生页面（请假记录详情）
 * @author: zengxiangkai
 * @date: 2020-05-15 11:01:08
 */
class StudentDetailsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        if (this.props.pkid) {
            this.props.dispatch({
                type: 'holiday_student_details/getReviewInfo',
                payload: { pkid: this.props.pkid }
            });
        }
    }

    /**
     * * 申请销假
     *
     * @memberof StudentDetailsPage
     */
    handleApplyBtnClick = () => {

        this.props.dispatch({
            type: 'holiday_student_details/applyCancellationOfLeave',
            payload: { pkid: this.props.pkid }
        });
    }

    render() {

        const { details = {}, processReviewInfo = [] } = this.props;

        let status_icon, reviewInfoList = [];

        if (details && details.QJZTM) {
            switch (details.QJZTM) {
                case '2':
                    status_icon = <img className={styles.imgType} src={icon_pass} alt="" />;
                    break;
                case '3':
                    status_icon = <img className={styles.imgType} src={icon_fail} alt="" />;
                    break;
                default:
                    break;
            }
        }

        for (let i = processReviewInfo.length - 1; i >= 0; i--) {
            reviewInfoList.push(processReviewInfo[i]);
        }

        return (
            <div style={{ marginBottom: details.SFM == '1' ? 90 : 24 }}>
                <div className={styles.titleBox}>
                    <div >
                        <div className={styles.avatar}>
                            <img src={`api/sm-student/openapi/getStudentPhoto?xsid=${details.XSID}&type=20`} alt="" />
                        </div>
                        <div className={styles.info}>
                            <div className={styles.title}>{details.XM}
                                {
                                    details.XB === '女' ?
                                        <img className={styles.icon} src={femal} alt="" />
                                        :
                                        <img className={styles.icon} src={mal} alt="" />
                                }
                            </div>
                            <div className={styles.class}>{details.BMMC} | {details.BJMC}</div>
                        </div>
                    </div>
                </div>
                <WhiteSpace />
                <div className={styles.detialBox}>

                    <div className={styles.detialLine}>
                        <div className={styles.title}>请假类型：</div>
                        <span className={styles.value}>{details.QJLX}</span>
                    </div>

                    <div className={styles.detialLine}>
                        <div className={styles.title}>是否需要离校：</div>
                        <span className={styles.value}>{details.SFXYLX}</span>
                    </div>

                    <div className={styles.detialLine}>
                        <div className={styles.title}>开始时间：</div>
                        <span className={styles.value}>{details.KSSJ}</span>
                    </div>

                    <div className={styles.detialLine}>
                        <div className={styles.title}>结束时间：</div>
                        <span className={styles.value}>{details.JSSJ}</span>
                    </div>

                    <div className={styles.detialLine}>
                        <div className={styles.title}>统计时长：</div>
                        <span className={styles.value}>{details.QJSCT}天{details.QJSCXS}小时</span>
                    </div>

                    <div className={styles.detialLine}>
                        <div className={styles.title}>紧急联系人：</div>
                        <span className={styles.value}>{details.JJLXR}</span>
                    </div>

                    <div className={styles.detialLine}>
                        <div className={styles.title}>联系人电话：</div>
                        <span className={styles.value}>{details.JJLXRDH}</span>
                    </div>

                    <div className={styles.detialLine}>
                        <div className={styles.title}>请假理由：</div>
                        <span className={styles.value}>{details.QJLY}</span>
                    </div>

                    <div className={styles.detialLine}>
                        <div className={styles.title}>请假状态：</div>
                        <span className={styles.value_2}>{details.QJZT}</span>
                    </div>

                    <div className={styles.detialLine}>
                        <div className={styles.title}>销假状态：</div>
                        <span className={styles.value}>{details.XJMC}</span>
                    </div>

                    {/* <div className={styles.detialLine}>
                        <div className={styles.title}>请假图片：</div>
                        <img className={styles.improveImg} src="" alt="" />
                    </div> */}
                    {
                        status_icon ? status_icon : null
                    }

                </div>

                <WhiteSpace />
                <Opinion list={reviewInfoList} />
                {
                    details.SFM == '1' ?
                        (
                            <div className={styles.footerBox}>
                                {
                                    //未销假和逾期未销假才能点击申请销假
                                    details.XJZT && (details.XJZT == '0' || details.XJZT == '2') ?
                                        <div className={styles.available_btn} onClick={this.handleApplyBtnClick}>申请销假</div>
                                        :
                                        <div className={styles.disable_btn} >
                                            {details.XJZT == '1' ? '已申请销假' : details.XJMC}
                                        </div>
                                }
                            </div>
                        )
                        : null
                }
            </div >
        );
    }
}

function mapStateToProps(state) {
    const { login, holiday_student_details, loading } = state;
    return {
        user: login.user,
        ...holiday_student_details,
        loading
    };
}

export default connect(mapStateToProps)(StudentDetailsPage);
