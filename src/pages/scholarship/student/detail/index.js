import React from 'react';
import PropTypes from 'prop-types';
// import Main from '../../../layouts/main';
import { WhiteSpace, Badge } from 'antd-mobile';
import { createForm } from 'rc-form';
import styles from "./index.less";
import Opinion from '@/pages/process/opinion/index';
import { connect } from 'dva';
// const requireContext = require.context("../../../../assets/images/studentSutffMobile/main", false, /^\.\/.*\.png$/);
// let rounter = []
// requireContext.keys().map((items,index)=>{
//     rounter[index] = items

// })
// 使用webpack批量载入图片 可以使用sort给文件加上排序规则

const getHashParam = (name) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
      queryString = window.location.hash.split('?')[1] || '',
      result = queryString.match(reg);
  return result ? decodeURIComponent(result[2]) : null;
};

const arrow = require('../../../../assets/images/studentSutffMobile/main/arrow_black.png'),
  icon_fail = require('../../../../assets/images/studentSutffMobile/stuff/icon_fail.png'),
  icon_pass = require('../../../../assets/images/studentSutffMobile/stuff/icon_pass.png'),
  femal = require('../../../../assets/images/studentSutffMobile/apply/female.png'),
  mal = require('../../../../assets/images/studentSutffMobile/apply/male.png'),
  doing = require('../../../../assets/images/studentSutffMobile/common/doing_icon.png'),
  success = require('../../../../assets/images/studentSutffMobile/common/succeed_icon.png');

/**
 * @author sunyu
 * @date 2020年4月9日
 * @time 10:55:05
 * @Description: 移动迎新-学生端 申请待办
 */
class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    const { search } = location;
    let hjmdid = getHashParam("hjmdid");
    let lcslid = getHashParam("lcslid");
    this.props.dispatch({
      type: 'scholarship_student_detail/fetchScholarShipDetail',
      payload: { hjmdid: hjmdid },
      search: search,
    });
    this.props.dispatch({
      type: 'scholarship_student_detail/fetchReviewInfo',
      payload: { lcslid: lcslid },
      search: search,
    });
  }


  render() {
    let { mock,statusGroup } = this.props;
    let statusDiv = null;
    if (mock.spzt === '2') {
        statusDiv = <img className={styles.imgType} src={icon_pass} alt="" />;
    }
    if (mock.spzt === '3') {
        statusDiv = <img className={styles.imgType} src={icon_fail} alt="" />;
    }
    return (

      <div style={{ background: 'rgba(242,244,247,1)', marginBottom: '90px' }}>
        <style jsx="true" global="true">
          {/* antd-mobile 的自定义样式 */}
          {`

        `}
        </style>
        <div className={styles.titleBox}>

          <div>
            <div className={styles.imgBox} />
            <div className={styles.titleDetial}>
              <div className={styles.title}>{mock.title}
              </div>

              <div className={styles.class}>{mock.applyTime}</div>
            </div>
          </div>
            {statusDiv}
        </div>

        <WhiteSpace />

        <div className={styles.detialBox}>

          <div className={styles.detialLine}>
            <div className={styles.title}>申请人：</div>
            <span className={styles.value}>{mock.xm}</span>
          </div>

          <div className={styles.detialLine}>
            <div className={styles.title}>学号：</div>
            <span className={styles.value}>{mock.xh}</span>
          </div>

          <div className={styles.detialLine}>
            <div className={styles.title}>学院：</div>
            <span className={styles.value}>{mock.bmmc}</span>
          </div>

          <div className={styles.detialLine}>
            <div className={styles.title}>班级：</div>
            <span className={styles.value}>{mock.bjmc}</span>
          </div>

          <div className={styles.detialLine}>
            <div className={styles.title}>奖项名称：</div>
            <span className={styles.value}>{mock.title}</span>
          </div>

          <div className={styles.detialLine}>
            <div className={styles.title}>奖励金额：</div>
            <span className={styles.value}>{mock.price}</span>
          </div>

          <div className={styles.detialLine}>
            <div className={styles.title}>评奖周期：</div>
            <span className={styles.value}>{mock.time}</span>
          </div>

          <div className={styles.detialLine}>
            <div className={styles.title}>申请理由：</div>
            <span className={styles.value}>{mock.sqly}</span>
          </div>

          {/* <div className={styles.detialLine}>
            <div className={styles.title}>请假图片：</div>
            <img className={styles.improveImg} src="" alt="" />
          </div> */}

        </div>

        <WhiteSpace />
        <Opinion list={statusGroup} />
      </div >
    );
  }
}

function mapStateToProps(state) {
  const { routing,login, scholarship_student_detail } = state;
  return {
      user: login.user,
      ...scholarship_student_detail
  };
}

export default connect(mapStateToProps)(index);

