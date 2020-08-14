/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';
import { Tabs, WhiteSpace, Badge } from 'antd-mobile';
import { Card, WingBlank } from 'antd-mobile';
import { connect } from 'dva';
import { Link } from 'umi';
import styles from './index.less';

/**
 * 移动端bpm流程办理中心 
 */

class ProcessCenter extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { userId } = this.props;
        this.props.dispatch({
            type: 'processCenter/queryBpmwaitingProcess',
        });
        this.props.dispatch({
            type: 'processCenter/queryBpmApplyedProcess',
        });
        this.props.dispatch({
            type: 'processCenter/queryBpmRelatedProcess',
        });
    }

    //加载我的待办数据
    getBpmwaitingProcessItem = (waitingProcessList) => {
        return (waitingProcessList && waitingProcessList.length > 0) ? waitingProcessList.map((item, index) => {
            return (
                <div key={index}>
                    <WingBlank size="lg">
                        <WhiteSpace size="lg" />
                        <Card>
                        <Link 
                            to={{
                                pathname:`/process/apply/${item.lcid}/${item.lcsqid}`,
                                query:{
                                    nav:item.lcmc
                                }
                            }}
                       >
                                <Card.Header
                                    title={item.lcmc}
                                    thumb=""

                                />
                                <Card.Body>

                                    <div className={styles.cardBody}>申请人：{item.sqr}</div>
                                    <div className={styles.cardBodyDQJD}>{item.dqjd}</div>

                                </Card.Body>
                                <Card.Footer content={item.ddsj} />
                            </Link>
                        </Card>
                    </WingBlank>
                </div>
            );
        }) : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
                没有查找到流程数据
       </div>;
    }

    // 加载我的申请数据
    getBpmApplyedProcessItem = (applyedProcessList) => {
        return (applyedProcessList && applyedProcessList.length > 0) ? applyedProcessList.map((item, index) => {
            return (
                <div key={index}>
                    <WingBlank size="lg">
                        <WhiteSpace size="lg" />
                        <Card>
                        <Link 
                            to={{
                                pathname:`/process/apply/${item.lcid}/${item.lcsqid}`,
                                query:{
                                    nav:item.lcmc
                                }
                            }}
                       >

                                <Card.Header
                                    title={item.lcmc}
                                    thumb=""
                                    extra={<span></span>}
                                />
                                <Card.Body>
                                    <div className={styles.cardBodySQSJ}>申请时间：{item.sqsj}
                                        {item.dqjd == '审核通过' ? <img className={styles.imgType} src={require('../../assets/images/processCenter/icon_pass@2x.png')} alt="" /> : null}
                                        {item.dqjd == '审核不通过' ? <img className={styles.imgType} src={require('../../assets/images/processCenter/icon_fail@2x.png')} alt="" /> : null}
                                    </div>
                                    <div className={styles.cardBodyDQJD}>{item.dqjd}

                                    </div>

                                </Card.Body>
                                <Card.Footer />
                            </Link>
                        </Card>
                    </WingBlank>
                </div>
            );
        }) : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
                没有查找到流程数据
       </div>;
    }

    // 加载我的参与数据
    getBpmRelatedProcessItem = (relatedProcessList) => {
        return (relatedProcessList && relatedProcessList.length > 0) ? relatedProcessList.map((item, index) => {
            return (
                <div key={index}>
                    <WingBlank size="lg">
                        <WhiteSpace size="lg" />
                        <Card>
                        <Link 
                            to={{
                                pathname:`/process/apply/${item.lcid}/${item.lcsqid}`,
                                query:{
                                    nav:item.lcmc
                                }
                            }}
                       >
                                <Card.Header
                                    title={item.lcmc}
                                    thumb=""
                                    extra={<span></span>}
                                />
                                <Card.Body>
                                    <div className={styles.cardBodySQSJ}>申请时间：{item.sqsj}
                                        {item.dqjd == '审核通过' ? <img className={styles.imgType} src={require('../../assets/images/processCenter/icon_pass@2x.png')} alt="" /> : null}
                                        {item.dqjd == '审核不通过' ? <img className={styles.imgType} src={require('../../assets/images/processCenter/icon_fail@2x.png')} alt="" /> : null}
                                    </div>
                                    <div className={styles.cardBodyDQJD}>{item.dqjd}</div>
                                </Card.Body>
                                <Card.Footer />
                            </Link>
                        </Card>
                    </WingBlank>
                </div>
            );
        }) :
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
                没有查找到流程数据
        </div>;
    }

    render() {
        const tabs = [
            { title: <Badge >我的待办</Badge> },
            { title: <Badge >我的申请</Badge> },
            { title: <Badge >我的参与</Badge> },
        ];

        const { waitingProcessList } = this.props;
        const { applyedProcessList } = this.props;
        const { relatedProcessList } = this.props;
        const { location: { query: { tabIndex } } } = this.props;

        return (
            <div>
                <Tabs tabs={tabs}
                    initialPage={tabIndex != undefined ? Number(tabIndex) : this.props.tabIndex}
                    // initialPage={1}
                    onChange={(tab, index) => {
                        this.props.dispatch({
                            type: 'processCenter/updateTabIndex',
                            tabIndex: index
                        });
                    }}

                    onTabClick={(tab, index) => {

                    }}
                >
                    {/**我的待办 */}
                    {this.getBpmwaitingProcessItem(waitingProcessList)}

                    {/**我的申请 */}
                    {this.getBpmApplyedProcessItem(applyedProcessList)}

                    {/**我的参与 */}
                    {this.getBpmRelatedProcessItem(relatedProcessList)}

                </Tabs>
                <WhiteSpace />
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { login, processCenter } = state;
    return {
        userId: login.user ? login.user.userId : '',
        waitingProcessList: processCenter.waitingProcessList,
        applyedProcessList: processCenter.applyedProcessList,
        relatedProcessList: processCenter.relatedProcessList,
        tabIndex: processCenter.tabIndex,
    };
}

export default connect(mapStateToProps)(ProcessCenter);
