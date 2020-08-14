
import React from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import { Grid } from 'antd-mobile';
import styles from './index.less';
import check from '@/components/Authorized/CheckPermissions';
import {queryBpmwaitingProcess,queryBpmApplyedProcess} from '@/services/api';

/**
 * 首页
 * @author: zengxiangkai
 * @date: 2020-04-13 13:53:54
 */



class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            waitingProcessList : [],
            applyedProcessList : []
        }
    }

   


    

    componentDidMount() {
        const { search } = this.props.location;
        this.props.dispatch({
            type: 'homePage/fetchServices',
            payload: {},
            search: search,
        });
        

        queryBpmwaitingProcess().then(res =>{
            if(res.code === 200){
                this.setState(() => ({
                    waitingProcessList : res.data
                }))
                
            }

        })

        
        queryBpmApplyedProcess().then(res =>{
            if(res.code === 200){
                this.setState(() => ({
                    applyedProcessList : res.data
                }))
                
            }

        })





    }

    /**
     * * 根据服务类型不同，渲染相应的跳转方式
     *
     * @memberof HomePage
     */
    renderServiceItem = item => {
        let fwlxm = item.FWLXM;
        let fwmc = item.FWMC ? item.FWMC : '未命名';
        if(fwmc.length > 5) {
            fwmc = fwmc.substring(0,4) + '...';
        }
        let renderItem = null;

        switch (fwlxm) {
            // 内置页面
            case '1':
                renderItem = (
                    <Link to={item.LJDZ}>
                        <div className={styles.icons} style={{ padding: '0 12.5px' }}>
                            <img src={`api/zhxg-xtgl/openapi/getServiceIcon?pkid=${item.PKID}`} style={{ width: '32px', height: '32px' }} alt="" />
                            <div style={{ color: 'rgba(51,51,51,1)', fontSize: '12px', marginTop: '15px' }}>
                                <span>{fwmc}</span>
                            </div>
                        </div>
                    </Link>
                )
                break;
            // 其他第三方链接地址（暂时没用到，后面需要做单点或认证的需要修改此处）
            default:
                renderItem = (
                    <a href={item.LJDZ} target={'_blank'}>
                        <div style={{ padding: '0 12.5px' }}>
                            <img src={`api/zhxg-xtgl/openapi/getServiceIcon?pkid=${item.PKID}`} style={{ width: '32px', height: '32px' }} alt="" />
                            <div style={{ color: 'rgba(51,51,51,1)', fontSize: '12px', marginTop: '15px' }}>
                                <span>{fwmc}</span>
                            </div>
                        </div>
                    </a>
                )
                break;
        }

        return renderItem;
    }
    
    render() {

        let { user = {}, servicesList } = this.props;

        let xm = user.userName ? user.userName : '';
        if(xm.length > 6) {
            xm = xm.substring(0,5) + '...';
        }

        servicesList = servicesList.filter(item => {
            return check(item.QXDM, item) === item;
        });
  
        return (
            <React.Fragment>
                <div className={styles.title1}>
                    <div className={styles.top1}>
                        <div className={styles.top1div}>
                            <div className={styles.name}>{xm}</div>
                            <Link to="/personalInfo">
                                <div className={styles.more}><div>更多</div><img src={require('../../assets/images/homePage/arrow.png')} alt="" /></div>
                            </Link>
                        </div>
                        {/*<img  className = {styles.icon_search} src={require('../../assets/images/homePage/icon_search.png')} alt="" />*/}
                    </div>
                  {/*<div className={styles.contentBox}>
                        <img className={styles.msg} src={require('../../assets/images/homePage/icon_msg.png')} alt="" />
                        <div>关于开学填写学生信息采集的通知</div>
                        <img className={styles.new} src={require('../../assets/images/homePage/new.png')} alt="" />
                    </div>*/}
                </div>

                <div className={styles.stuffHall}>
                    <div className={styles.title}>事务大厅</div>
                    <div className={styles.contentBox}>
                        <div className={styles.title}>
                        <Link to="/startApply">
                            <div className={styles.botton}><img src={require('../../assets/images/homePage/icon_edit.png')} alt="" />发起申请</div>
                        </Link>
                        </div>
                        <div className={styles.stuffList}>
                           {/**待办项 */}
                           {(this.state.waitingProcessList && this.state.waitingProcessList.length >0)?
                                <Link to={`/processCenter/index?tabIndex=0`}>
                                <div className={styles.stuffItem}>
                                    <div className={styles.stuffType_1}>
                                        待办
                                    </div>
                                    <div className={styles.stuffContent}>
                                        <p>你有<span style={{color:'red'}}> {this.state.waitingProcessList.length}</span> 个待办事务</p>
                                        <p className={styles.time}>{this.state.waitingProcessList[0].ddsj}</p>
                                    </div>
                                    <img src={require('../../assets/images/homePage/arrow_black.png')} alt="" />                       
                                </div>
                                </Link>
                            :
                                <div className={styles.stuffItem}>
                                    <div className={styles.stuffType_1}>
                                        待办
                                    </div>
                                
                                <div className={styles.stuffContent}>
                                    —— 暂无待办数据 ——
                                    </div>   
                                </div>
                            }

                            <div className={styles.scale}></div>

                              {/**申请项 */}
                            {
                            (this.state.applyedProcessList && this.state.applyedProcessList.length >0)?  
                                <Link to={`/processCenter/index?tabIndex=1`}>
                                    <div className={styles.stuffItem}>
                                        <div className={styles.stuffType_2}>
                                            申请
                                    </div>
                                        <div className={styles.stuffContent}>
                                            <p>你发起了{this.state.applyedProcessList[0].lcmc}</p>
                                            <p className={styles.time}>{this.state.applyedProcessList[0].sqsj}</p>
                                        </div>
                                        <img src={require('../../assets/images/homePage/arrow_black.png')} alt="" />
                                    </div>
                                </Link>
                                :      

                                <div className={styles.stuffItem}>
                                    <div className={styles.stuffType_2}>
                                        申请
                                </div>
                                    <div className={styles.stuffContent}>
                                    —— 暂无待办数据 ——
                                    </div>
                                
                                </div>
                            }
                        </div>
                        <Link  to={`/processCenter/index`}>
                        <div className={styles.scale_bottom}></div>
                        <div className={styles.more2}>
                            <div>
                                查看更多
                            </div>
                           <img className={styles.more2img} src={require('../../assets/images/homePage/arrow_black.png')} alt="" /> 
                        </div>
                        </Link>
                    </div>
                </div>

                <div className={styles.icon}>
                    <div className={styles.textServer}>常用服务</div>
                    <div className={styles.iconBox}>
                        <Grid data={servicesList} hasLine={false}
                            renderItem={dataItem => {
                                return this.renderServiceItem(dataItem);
                            }}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { login, homePage } = state;
    return {
        user: login.user,
        servicesList: homePage.servicesList
    };
}

export default connect(mapStateToProps)(HomePage);