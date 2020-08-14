import React from 'react';
import PropTypes from 'prop-types';
import { createForm } from 'rc-form';
import styles from "./index.less";
import { InputItem, List, Toast, TextareaItem, Picker, WhiteSpace } from 'antd-mobile';
import { connect } from 'dva';
import { Link } from 'umi';


/**
 * @author liuzicheng
 * @date 2020年5月7日
 * @time 13:59:01
 * @Description: 移动迎新-学生端 学生处分详情
 */

const getHashParam = (name) => {  
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),  
      queryString = window.location.hash.split('?')[1] || '',  
      result = queryString.match(reg);  
  return result ? decodeURIComponent(result[2]) : null;  
}; 
class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount() {

  }

  componentDidMount() {
    const { user, location } = this.props;
    const { search } = location;
    let cfjgid = getHashParam("cfjgid");
    this.props.dispatch({
      type: 'violation_detial/fetchSelectDetial',
      payload: { cfjgid: cfjgid },
      search: search,
    });
    this.props.dispatch({
      type: 'violation_detial/fetchSelectAppeal',
      payload: { cfjgid: cfjgid },
      search: search,
    });
    this.props.dispatch({
      type: 'violation_detial/fetchSelectRelieve',
      payload: { cfjgid: cfjgid },
      search: search,
    });
  }

  isNullObj = (obj) =>{
    for(var n in obj){return false}
    return true;
  }

  render() {
    const { detial,appeal,relieve } = this.props;
    let cfjgid = getHashParam("cfjgid");
    return (
      <div>
        <div className={styles.baseInfo}>
          <div className={styles.btitleBox}>
            <div className={styles.title}>违纪情况</div>
          </div>
          <div className={styles.scale}></div>
          <div className={styles.contentBox}>
            <div className={styles.contentLine}>
              <div className={styles.gray}>违纪类型：</div>
              <div className={styles.values}>{detial.WJLX}</div>
            </div>
            <div className={styles.contentLine}>
              <div className={styles.gray}>违纪事项：</div>
              <div className={styles.values}>{detial.WJNR}</div>
            </div>
            <div className={styles.contentLine}>
              <div className={styles.gray}>违纪事实：</div>
              <div className={styles.values}>{detial.WJSS}</div>
            </div>
            {/* <div className={styles.contentLine}>
              <div className={styles.gray}>违纪材料：</div>
              <div className={styles.valueBlue}>查看</div>
            </div> */}
          </div>
        </div>
        
        <div className={styles.baseInfo}>
          <div className={styles.btitleBox}>
            <div className={styles.title}>违纪结果</div>
          </div>
          <div className={styles.scale}></div>
          <div className={styles.contentBox}>
            <div className={styles.contentLine}>
              <div className={styles.gray}>处分文号：</div>
              <div className={styles.values}>{detial.CFWH}</div>
            </div>
            <div className={styles.contentLine}>
              <div className={styles.gray}>处分评定：</div>
              <div className={styles.values}>{detial.CFPD}</div>
            </div>
            <div className={styles.contentLine}>
              <div className={styles.gray}>处分时间：</div>
              <div className={styles.values}>{detial.CFSJ}</div>
            </div>
            <div className={styles.contentLine}>
              <div className={styles.gray}>处分期间表现：</div>
              <div className={styles.values}>{detial.BXQK}</div>
            </div>
          </div>
        </div>

        {this.isNullObj(appeal)?null:
        <div className={styles.baseInfo}>
          <div className={styles.btitleBox}>
            <div className={styles.title}>处分申诉</div>
          </div>
          <div className={styles.scale}></div>
          <div className={styles.contentBox}>
            <div className={styles.contentLine}>
              <div className={styles.gray}>申诉时间：</div>
              <div className={styles.values}>{appeal.SSSJ}</div>
            </div>
            <div className={styles.contentLine}>
              <div className={styles.gray}>申诉事由：</div>
              <div className={styles.values}>{appeal.SSLY}</div>
            </div>
            <div className={styles.contentLine}>
              <div className={styles.gray}>确认意见：</div>
              <div className={styles.values}>{appeal.QRYJ}</div>
            </div>
            <div className={styles.contentLine}>
              <div className={styles.gray}>确认人：</div>
              <div className={styles.values}>{appeal.QRR}</div>
            </div>
            <div className={styles.contentLine}>
              <div className={styles.gray}>确认时间：</div>
              <div className={styles.values}>{appeal.QRSJ}</div>
            </div>
            <div className={styles.contentLine}>
              <div className={styles.gray}>申诉结果：</div>
              <div className={styles.values}>{appeal.SSJG}</div>
            </div>
          </div>
        </div>
        }
        
        {this.isNullObj(relieve)?null:
        <div className={styles.baseInfo}>
          <div className={styles.btitleBox}>
            <div className={styles.title}>处分解除</div>
          </div>
          <div className={styles.scale}></div>
          <div className={styles.contentBox}>
            <div className={styles.contentLine}>
              <div className={styles.gray}>解除文号：</div>
              <div className={styles.values}>{relieve.CFJCWH}</div>
            </div>
            <div className={styles.contentLine}>
              <div className={styles.gray}>解除确认人：</div>
              <div className={styles.values}>{relieve.XM}</div>
            </div>
            <div className={styles.contentLine}>
              <div className={styles.gray}>解除时间：</div>
              <div className={styles.values}>{relieve.CFJCSJ}</div>
            </div>
          </div>
        </div>
        }
         
        {this.isNullObj(appeal) && this.isNullObj(relieve)?<div className={styles.btnBox}>
          <Link 
              to={{
              pathname: "/sm-punish/student/violationDetial/appealForm",
              search: "?cfjgid="+cfjgid,
            }}>
            <div className={styles.btn}>处分申诉</div>
          </Link>
        </div>:null
        }
      </div >
    )
  }
}

function mapStateToProps(state) {
  const { login, violation_detial, loading } = state;
  return {
      user: login.user,
      ...violation_detial,
      loading
  };
}

export default connect(mapStateToProps)(index);

