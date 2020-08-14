import React from 'react';
import PropTypes from 'prop-types';
import { createForm } from 'rc-form';
import styles from "./index.less";
import { connect } from 'dva';
import { Link } from 'umi';

const bg = require("../../../assets/images/studentSutffMobile/bg.png");
const arrow_black = require("../../../assets/images/studentSutffMobile/arrow_black.png");

const nodata = require("../../../assets/images/studentSutffMobile/nodata.png");

// let mock = []
// const mock = [
//   {
//     stauts: 0,// 0 待测评 1学生自评中 2 班级测评中 3 已完成
//     isReturn: true,
//     title: '医学院三好学生',
//     time: '评奖周期：2019-2020学年第二学期',
//     applyTime: '获奖时间：2019-11-15',
//     isRewrite: true,
//     price: '500元'
//   },
//   {
//     stauts: 1,// 0 待测评 1学生自评中 2 班级测评中 3 已完成
//     isReturn: false,
//     title: '医学院三好学生',
//     time: '评奖周期：2019-2020学年第二学期',
//     applyTime: '获奖时间：2019-11-15',
//     isRewrite: false
//   },
//   {
//     stauts: 2,// 0 待测评 1学生自评中 2 班级测评中 3 已完成
//     isReturn: false,
//     title: '医学院三好学生',
//     time: '评奖周期：2019-2020学年第二学期',
//     applyTime: '获奖时间：2019-11-15',
//     isRewrite: false
//   },
//   {
//     stauts: 3,// 0 待测评 1学生自评中 2 班级测评中 3 已完成
//     isReturn: false,
//     title: '医学院三好学生',
//     time: '评奖周期：2019-2020学年第二学期',
//     applyTime: '获奖时间：2019-11-15',
//     isRewrite: false
//   },

// ];

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

    let { userId = '', userType = '' } = user;
    this.props.dispatch({
      type: 'scholarship_student/fetchScholarShipInfo',
      payload: { yhbh: userId },
      search: search,
    });
  }


  render() {
    let mock = this.props.mock;
    return (
      <div style={{ background: 'rgba(242,244,247,1)' }}>
        {
          (mock && mock.length == 0 || !mock) ?
            <div className={styles.imgBox}>
              <img className={styles.nodata} src={nodata} alt="" />
              <div>当前暂无数据</div>
            </div>
            :
            <div>

              <img className={styles.bg} src={bg} alt="" />
              <div className = {styles.chufen}>我的奖学金</div>
              <div className={styles.itemBox}>
                {
                  mock.map((item) => {
                    let stautsDom = <div className={styles.stauts_01}>{item.stauts}</div>;
                    return (
                      <Link
                            to={{
                            pathname: "/scholarship/student/detail/index",
                            search: "?hjmdid="+item.hjmdid+"&lcslid="+item.lcslid,
                          }}>
                        <div className={styles.item}>
                          {
                            item.stauts == 3 &&
                            <div className={styles.Mask}>

                            </div>
                          }
                          <div className={styles.content}>
                            <div className={styles.title}>{item.title} {item.price && <div className={styles.price}> {item.price}元</div>}</div>
                            <div className={item.stauts == 3 ? styles.grayTime : styles.time}>
                              {item.time}
                            </div>
                            <div className={item.stauts == 3 ? styles.grayApplyTime : styles.applyTime}>
                              {item.applyTime}
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
            </div>}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { routing,login, scholarship_student } = state;
  return {
      user: login.user,
      ...scholarship_student
  };
}

export default connect(mapStateToProps)(index);
