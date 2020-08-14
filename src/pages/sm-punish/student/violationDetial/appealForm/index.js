import React from 'react';
import PropTypes from 'prop-types';
import { createForm } from 'rc-form';
import styles from "./index.less";
import { InputItem, List, Toast, TextareaItem, Picker, WhiteSpace } from 'antd-mobile';
import { connect } from 'dva';


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
        ssly:'',
    };
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  handleSave = () =>{
        let ssly =this.state.ssly;
        let cfjgid = getHashParam("cfjgid");
        if(!ssly){
            Toast.fail('申诉事由不能为空！');
            return;
        }
        this.props.dispatch({
            type: 'appealForm/fetchSaveAppeal',
            payload: { ssly: ssly,cfjgid:cfjgid },
            search: search,
        });
  }

  render() {
    let cfjgid = getHashParam("cfjgid");
    let ssly =this.state.ssly;
    return (
      <div style={{ padding: '19px 0px' }}>
        <form>
            <TextareaItem
                title="申诉事由"
                placeholder="请输入申诉事由...."
                data-seed="logId"
                clear={true}
                rows={3}
                count={150}
                autoHeight
                value={ssly}
                onChange={v => this.setState({ ssly: v })}
                error={ssly?false:true}
            />
        </form>
        <div className={styles.btnBox}>
            <div className={styles.btn} onClick={this.handleSave}>提交申诉</div>
        </div>
      </div>
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

