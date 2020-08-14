import React from 'react';
import { Grid } from 'antd-mobile';
import PropTypes from 'prop-types';
import { Accordion, List } from 'antd-mobile';
import { createForm } from 'rc-form';
import styles from "./index.less";
import echarts from 'echarts/lib/echarts'
//导入饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'
// import { Card } from 'antd'
import { connect } from 'dva';
import createHashHistory from 'history/createHashHistory';
const hashHistory = createHashHistory();

let femal = require('../../../../assets/images/studentSutffMobile/apply/female.png'),
  mal = require('../../../../assets/images/studentSutffMobile/apply/male.png');




// const mock = {
//   total: 1230,
//   man: 460,
//   woman: 770
// }
// const mockDetial = [
//   {
//     title: '12经济学1班：4人',
//     detial: [
//       {
//         name: '李琳琳',
//         id: '12321564675',
//         sex: 'woman'
//       },
//       {
//         name: '张宇',
//         id: '12321564675',
//         sex: 'man'
//       }, {
//         name: '陈奕霖',
//         id: '12321564675',
//         sex: 'woman'
//       }, {
//         name: '嘻嘻',
//         id: '12321524675',
//         sex: 'man'
//       }, {
//         name: '张宇',
//         id: '12321564675',
//         sex: 'man'
//       }, {
//         name: '张宇',
//         id: '12321564675',
//         sex: 'man'
//       }, {
//         name: '李琳琳',
//         id: '12321564675',
//         sex: 'woman'
//       }, {
//         name: '陈奕霖',
//         id: '12321564675',
//         sex: 'woman'
//       }, {
//         name: '陈奕霖',
//         id: '12321564675',
//         sex: 'woman'
//       }, {
//         name: '陈奕霖',
//         id: '12321564675',
//         sex: 'woman'
//       }, {
//         name: '陈奕霖',
//         id: '12321564675',
//         sex: 'woman'
//       }
//     ]
//   },
//   {
//     title: '12经济学2班：4人',
//     detial: [
//       {
//         name: '李琳琳',
//         id: '12321564675',
//         sex: 'woman'
//       },
//       {
//         name: '张宇',
//         id: '12321564675',
//         sex: 'man'
//       }, {
//         name: '陈奕霖',
//         id: '12321564675',
//         sex: 'woman'
//       }
//     ]
//   },
//   {
//     title: '12经济学3班：4人',
//     detial: [
//       {
//         name: '李琳琳',
//         id: '12321564675',
//         sex: 'woman'
//       },
//       {
//         name: '张宇',
//         id: '12321564675',
//         sex: 'man'
//       }, {
//         name: '陈奕霖',
//         id: '12321564675',
//         sex: 'woman'
//       }, {
//         name: '嘻嘻',
//         id: '12321524675',
//         sex: 'man'
//       }
//     ]
//   }
// ]

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

    let urlParams = this.parseUrlParams(),
      title = urlParams.id;
    let college = title.split("~")[0];
    let semester = title.split("~")[1];

    this.props.dispatch({
        type: 'punish_teaDetial/fetchPunishSexData',
        payload: { college,semester },
        search: search,
    });
    this.props.dispatch({
      type: 'punish_teaDetial/fetchPunishPerData',
      payload: { college,semester },
      search: search,
    });
  }


  //解析url搜索参数
  parseUrlParams() {
    let location = this.props.location;
    if (location) {
      const { search } = location;
      if (search) {
        let deocodeUrl = decodeURIComponent(search);
        let url = deocodeUrl.substring(1, search.length); //去除?
        let paramsStr = url.split('&'); //分割参数字符串

        if (paramsStr.length > 0) {

          let params = {};
          //解析成键值对形式对象
          for (let key in paramsStr) {
            let paramStr = paramsStr[key];
            let paramObj = paramStr.split('=');
            let obj = new Object;
            obj[paramObj[0]] = paramObj[1];
            Object.assign(params, obj);
          }

          return params;
        }
      }
    }
    return {};
  }




  render() {
    let urlParams = this.parseUrlParams(),
      title = urlParams.id;
    let showTitle = title.split("~")[0];
    let {mock,mockDetial} = this.props;
    return (
      <div
        style={{
            background: 'rgba(242,244,247,1)'
            , padding: '15px'
        }}
      >

        <style>
          {`
          .am-accordion::before{
            height: 0px !important;
          }
          .am-accordion-header::after{
            height: 0px !important;
          }
          .am-accordion-content-box::after{
            height: 0px !important;
          }

          .am-accordion-item {
            // border-bottom: 1px dashed rgba(230, 230, 230, 1);
            position: relative;
          }
          .am-accordion-header{
            height: 50px  !important;
          }

          .am-accordion-item::after {
            content: '';
            position: absolute;
            bottom: 0;
            background: rgba(230, 230, 230, 1);
            width: 90%;
            left: 5%;
            height: 1px;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            // border-bottom: 1px dashed rgba(230, 230, 230, 1);
          `}
        </style>

        <div className={styles.title}>
          {showTitle}
        </div>
        <div className={styles.titleBox}>

          <div className={styles.detialBox}>
            <div className={styles.value}>{mock.total}</div>
            <div className={styles.key}>违纪总人数</div>
          </div>

          <div className={styles.detialBox}>
            <div className={styles.value}>{mock.man}</div>
            <div className={styles.key}>男生人数</div>
          </div>

          <div className={styles.detialBox}>
            <div className={styles.value}>{mock.woman}</div>
            <div className={styles.key} > 女生人数</div>
          </div>

        </div>

        <div className={styles.detialTitle}>
          各班级情况
        </div>

        <div className={styles.group}>


          <Accordion  className="my-accordion" onChange={this.onChange}>
            {
              mockDetial.map((items) => {
                return (
                  <Accordion.Panel header={items.title} className="pad">
                    <div className={styles.detialBOx}>
                      {
                        items.detial.map((item, index) => {
                          return (
                            <div>
                              {
                                index % 2 == 0 &&
                                <div className={styles.detialLine}>

                                  <div className={styles.detial}>
                                    <div className={styles.name}>{items.detial[index].name} <img src={items.detial[index].sex == 'woman' ? femal : mal} alt="" /></div>
                                    <div className={styles.id}>{items.detial[index].id}</div>
                                  </div>


                                  {
                                    index + 1 != items.detial.length &&
                                    <div className={styles.detial}>
                                      <div className={styles.name}>{items.detial[index + 1].name} <img src={items.detial[index + 1].sex == 'woman' ? femal : mal} alt="" /></div>
                                      <div className={styles.id}>{items.detial[index + 1].id}</div>
                                    </div>
                                  }


                                </div>
                              }
                              {
                                index % 2 == 1 && index != items.detial.length - 1 &&
                                <div className={styles.scale}></div>
                              }
                            </div>
                          )
                        })
                      }

                    </div>
                  </Accordion.Panel>
                )
              })
            }
          </Accordion>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { routing,login, punish_teaDetial } = state;
  return {
      user: login.user,
      ...punish_teaDetial
  };
}

export default connect(mapStateToProps)(index);

