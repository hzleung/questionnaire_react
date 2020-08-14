import React from 'react';
import { Link } from 'umi';
import styles from "./index.less";
import { connect } from 'dva';


/**
 * @author weishihuai
 * @date 2018/7/30
 * @time 9:40
 * @Description: 移动迎新-学生端 个人信息
 */
const bg = require("../../../assets/images/studentSutffMobile/bg_2.png");
const arrow_black = require("../../../assets/images/studentSutffMobile/arrow_black.png");
const nodata = require("../../../assets/images/studentSutffMobile/nodata.png");

// const mock = [
//   {
//     CFJGID: '111111',
//     DQZT: 0,// 处分状态  0：学生待确认  1：处分中  2：已解除  3：已撤销
//     CFMC: '记过处分',
//     CFXQ: '记过时间：2019-2020学年第二学期',
//     // applyTime: '申请日期：2019-11-15',
//     // isRewrite: true
//   },
// ];

class index extends React.Component {

  componentWillMount() {

  }

  componentDidMount() {
    const { user, location } = this.props;
    const { search } = location;

    let { userId = '', userType = '' } = user;
    this.props.dispatch({
        type: 'punish_student/fetchPunishInfo',
        payload: { yhbh: userId },
        search: search,
    });

    this.props.dispatch({
      type: 'punish_student/fetchPunishRelieveProcessId',
    });

  }


  render() {
    const { mock } = this.props;
    const { processId } = this.props;
    return (
      <div>
        {
          (!mock || mock && mock.length == 0) ?
            <div className={styles.imgBox}>
              <img className={styles.nodata} src={nodata} alt="" />
              <div>当前暂无数据</div>
            </div>
            :
            <div>
              <img className={styles.bg} src={bg} alt="" />
              <div className = {styles.chufen}>处分记录</div>
              <div className={styles.itemBox}>
                {
                  mock.map((item) => {
                    let stautsDom = <div className={styles.stauts_01}>{"当前处分状态："+item.DQZT}</div>;
                    let jclcDom ;  

                    let path;

                    switch(item.CFZTFLAG){
                    //'0',待确认',
                    //'1',申诉确认中',
                    //'2','即将期满',
                    //'3','处分期满',
                    //'4','处分中',
                    //'5','已解除',
                    //'6','已撤销',
                    //'7','解除申请中',
                    case 2 :
                        if(item.JCLCID != null && item.SPZT == '3'){
                          jclcDom =  <Link key={item.WJDJID} to={`/process/apply/${processId}/${item.JCLCID}`}><div className={styles.stauts_03}>上一次申请解除结果：不通过【查看详情】</div>  </Link>;
                        }
                        path = {
                            pathname:`/process/apply/${processId}`,
                            query:{
                                wjdjid:item.WJDJID
                            }
                        };
                        break;  
                      case 3 :    
                          if(item.JCLCID != null && item.SPZT == '3'){
                            jclcDom =  <Link key={item.WJDJID} to={`/process/apply/${processId}/${item.JCLCID}`}><div className={styles.stauts_03}>上一次申请解除结果：不通过【查看详情】</div>  </Link>;
                          }
                          path = {
                              pathname:`/process/apply/${processId}`,
                              query:{
                                  wjdjid:item.WJDJID
                              }
                          };
                          break;
                      case 7 :
                        path = {
                            pathname:`/process/apply/${processId}/${item.JCLCID}`
                        };
                        break;
                      default:
                        path = "/sm-punish/student/violationDetial?cfjgid="+item.CFJGID;
                        break;

                    }

                    return (

                      <Link key={item.WJDJID} to={path}>
                        <div className={styles.item}>
                          {
                            item.DQZT == 3 &&
                            <div className={styles.Mask} />
                          }
                          <div className={styles.content}>
                            <div className={styles.title}>{item.CFMC}</div>
                            <div className={item.stauts == 3 ? styles.grayTime : styles.time}>
                              {"处分时间："+item.CFXQ}
                            </div>
                            {stautsDom}
                            {jclcDom}
                          </div>
                          <img src={arrow_black} alt="" />
                        </div>
                      </Link>
                    );
                  })
                }
              </div>
            </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
    const { login, punish_student } = state;
    return {
        user: login.user,
        ...punish_student
    };
}

export default connect(mapStateToProps)(index);
