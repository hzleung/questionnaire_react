import React,{Component} from 'react';
import { Link } from 'umi';
import PropTypes from 'prop-types';
import { createForm } from 'rc-form';
import{getUserCache } from '@/utils/utils';
import { connect } from 'dva';
import moment from 'moment';
import styles from "./index.less";

/**
 * 学生端-学生信息采集任务-填写记录
 * @author zhouzhongkai
 * @date 2020-5-13
 */


const bg = require("../../../assets/images/studentSutffMobile/bg_3.png");
const arrow_black = require("../../../assets/images/studentSutffMobile/arrow_black.png");
const nodata = require("../../../assets/images/studentSutffMobile/nodata.png");


class Record extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'collectRecord/getValidTask',
      params:{userid:getUserCache().userId},
    });

  }


  render() {
      const {validTaskList} = this.props;
    return (
      <div location={location} style={{ background: 'rgba(242,244,247,1);', height: 'fit-content;' }}>
        {
          (validTaskList && validTaskList.length == 0) ?
            <div className={styles.imgBox}>
              <img className={styles.nodata} src={nodata} alt="" />
              <div>当前暂无数据</div>
            </div>
            :
            <div>
              <img className={styles.bg} src={bg} alt="" />
              <h1>信息采集</h1>
              <div className={styles.itemBox}>
                {
                  validTaskList.map((item,index) => {
                    let stautsDom;
                    switch (item.CJZT) {
                      case "0":
                        stautsDom = <div className={styles.stauts_01}>待填写</div>
                        break;
                      case "1":
                        stautsDom = <div className={styles.stauts_02}>已填写</div>
                        break;
                      case "2":
                    stautsDom = <div>
                                  <div className={styles.stauts_03}>回退<br/></div>
                                  <div>回退意见：{item.HTYJ}</div>
                                </div>
                        break;
                    }
                    return (
                      <Link to={`/studentInfoCollect/form/${item.DTBDID}/${item.XSID}/${item.TXID}/${item.CJZT}`}>
                        <div key={index} className={styles.item}>
                          {
                            item.CJZT == 1 &&
                            <div className={styles.Mask}>
                            </div>
                          }
                          <div className={styles.content}>
                            <div className={styles.title}>{item.BT}</div>
                            <div className={item.CJZT == 1 ? styles.grayTime : styles.time}>
                              采集时间: {moment(item.KSSJ).format('YYYY-MM-DD')}至{moment(item.JSSJ).format('YYYY-MM-DD')}
                            </div>
                            {stautsDom}
                          </div>
                          <img src={arrow_black} alt="" />
                        </div>
                      </Link>
                    )
                  })
                }
              </div>
            </div>
        }
      </div>
    )
  }
}

Record.propTypes = {
  location: PropTypes.object.isRequired
};


function mapStateToProps(state) {
	const { login, collectRecord} = state;
	return {
		userId: login.user ? login.user.userId : '',
        validTaskList:collectRecord.validTaskList
	};
}

export default connect(mapStateToProps)(Record);
