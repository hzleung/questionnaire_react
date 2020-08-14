import React from 'react';
import { Grid } from 'antd-mobile';
import PropTypes from 'prop-types';
import { InputItem, List, Toast, Picker, PickerView } from 'antd-mobile';
import { createForm } from 'rc-form';
import styles from "./index.less";
//导入饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'
// import { Card } from 'antd'
import { connect } from 'dva';
import createHashHistory from 'history/createHashHistory';
const hashHistory = createHashHistory();
const nodata = require("../../../assets/images/studentSutffMobile/nodata.png");


// const mock = [
//   {
//     label: '2019-2020学年第一学期',
//     value: '2019-2020-1',
//   },
//   {
//     label: '2019-2020学年第二学期',
//     value: '2019-2020-2',
//   },
// ];
// const mockDetial = [
//   {
//     time: '2018-2019-2',
//     total: [655, 255],
//     detial: [
//       {
//         title: '阿萨德学院',
//         man: 2380,
//         woman: 6380,
//         total: 10567
//       },
//       {
//         title: '管理学院',
//         man: 2380,
//         woman: 6380,
//         total: 10567
//       },
//       {
//         title: '工程学院',
//         man: 2380,
//         woman: 6380,
//         total: 10567
//       }
//       ,
//       {
//         title: '教育学院',
//         man: 2380,
//         woman: 6380,
//         total: 10567
//       }
//     ],
//     histogramMock: [122, 153, 24, 12, 2]
//   },
//   {
//     time: '2019-2020-2',
//     total: [654, 123],
//     detial: [
//       {
//         title: '商学院',
//         man: 2380,
//         woman: 6380,
//         total: 10567
//       },
//       {
//         title: '管理学院',
//         man: 2380,
//         woman: 6380,
//         total: 10567
//       },
//       {
//         title: '工程学院',
//         man: 2380,
//         woman: 6380,
//         total: 10567
//       }
//       ,
//       {
//         title: '教育学院',
//         man: 2380,
//         woman: 6380,
//         total: 10567
//       }
//     ],
//     histogramMock: [132, 53, 24, 12, 2]
//   }
// ]

class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sValue:  this.props.sValue,
    };
  }

  componentWillMount() {



  }

  componentDidMount() {
    const { user, location } = this.props;
    const { search } = location;

    let { userId = '', userType = '' } = user;
    this.props.dispatch({
        type: 'punish_teacher/fetchSemesterInfo',
        payload: { },
        search: search,
    });
    this.props.dispatch({
      type: 'punish_teacher/fetchPunishStatistics',
      payload: { },
      search: search,
    });



  }

  goToDetial(title) {
    let sValue=this.state.sValue?this.state.sValue:this.props.sValue;
    let jumpSearch = encodeURIComponent(`id=${title+'~'+sValue}`);

    hashHistory.push({
      pathname: '/sm-punish/teacher/leaveAdministrationDetial',
      search: jumpSearch

    })
  }

  getHistogramOption = () => {
    let { sValue, mockDetial } = this.props, histogramMock = [];
    sValue=this.state.sValue?this.state.sValue:sValue;
    mockDetial && mockDetial.map((item) => {
      if (item.time == sValue) {
        histogramMock = item.histogramMock
      }
    })

    let option = {
      color: ['#77BEFF'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        marginTop:30,
        height:240,
        left: '-8%',
        right: '4%',
        bottom: '0',
        top: '10%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['警告', '严重警告', '记过', '留校查看', '开除学籍'],
          // data: ['警告', '警告', '警告', '警告', '警告'],
          axisTick: {
            alignWithLabel: true
          },
          // x轴的字体样式
          axisLabel: {
            show: true,
            interval: 0,
            textStyle: {
              color: '#999999',
              fontSize: '12',

            }
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            lineStyle: {
              // 使用深浅的间隔色
              // color: ['#aaa', '#ddd'],
              type: 'dotted'
            }
          },
        }

      ],
      series: [
        {
          name: '人数',
          type: 'bar',
          barWidth: '26%',
          data: histogramMock,
          // legendHoverLink: true,
          label: {                     //---图形上的文本标签
            show: true,
            // position: [-7, -15],   //---相对位置
            position: ['-50%', -15],   //---相对位置

            rotate: 0,               //---旋转角度
            color: '#000000',
            formatter: '{@score}人'
          },
          // distance:10,

        }
      ]
    };


    return option;
  }

  getOption = () => {
    let { sValue, mockDetial } = this.props, total = [];
    sValue=this.state.sValue?this.state.sValue:sValue;
    mockDetial && mockDetial.map((item) => {
      if (item.time == sValue) {
        total = item.total
      }
    })

    let option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br />{b} ({d}%)'
      },
      title: {
        text: total[0] + total[1] + '人',
        subtext: '总人数',
        x: 'center',
        y: 'center',
        top: '36%',
        left: '48%',
        textStyle: {
          fontSize: 15,
          fontWeight: 500
        },
        subtextStyle: {
          fontSize: 13,
          color: '#999999',
          fontWeight: 400
        }
      },
      series: [
        {
          name: '违纪人数',
          type: 'pie',
          radius: ['30%', '50%'],
          center: ['55%', '44%'],
          data: [
            { value: total[0], name: '男生数: \n' + total[0] + '人' },
            { value: total[1], name: '女生数: \n' + total[1] + '人' }
          ],
          barWidth: 40,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              normal: {
                color: '#FAD337'
              }
            }
          },
          itemStyle: {
            normal: {
              borderWidth: 5, //设置border的宽度有多大
              borderColor: '#fff',
              color: function (params) {
                //自定义颜色
                var colorList = [
                  '#77BEFF', '#C7E08A'
                ];
                return colorList[params.dataIndex]
              }
            }
          }
        }
      ]
    };

    return option;
  }

  render() {
    let { mock, mockDetial,sValue} = this.props, list;

    sValue =this.state.sValue?this.state.sValue : this.props.sValue;


    mockDetial && mockDetial.map((item) => {
      if (item.time === sValue) {
        list = item.detial
      }
    })
    console.log(mockDetial);
    // const { getFieldProps } = this.props.form;
    return (

      (mockDetial && mockDetial.length < 0)?
      <div className={styles.imgBox}>
              <img className={styles.nodata} src={nodata} alt="" />
              <div>当前暂无违纪统计数据</div>
            </div>
      :
      <div>
        <style jsx="true" global="true">
          {/* antd-mobile 的自定义样式 */}
          {`
            .am-list-item{
              min-height: 0px !important;
              background-color: rgba(0,0,0,0)!important;
              font-size：12px !important;

            }
          .am-list-item-middle{
            min-height: 0px !important;
            background-color: rgba(0,0,0,0)!important;
            font-size：12px !important;

          }
             .am-list-line{
              justify-content: space-between !important;
             }
             .am-list-extra{
              flex-basis: initial !important;
              padding-top: 4px !important;
              font-size: 12px !important;
             }
             .am-list-arrow{
              width: 10px !important;
              height: 9px !important;
              transform: rotate(90deg);
             }

        `}
        </style>

        <div className={styles.contentBox}>
          <div className={styles.titleBox}>
            <div className={styles.title}>
              全校违纪处分人数统计
            </div>

            <div className={styles.pickerBox} onClick={(e) => e.preventDefault}>
              <Picker
                cols={1}
                data={mock}
                // cascade={false}
                extra={
                  JSON.stringify(sValue) == "{}"?
                  "请选择学期"
                  :
                  mock.map((item, index) => {
                    if (item.value == sValue) {
                      return mock[index].label
                    }
                  })
                }
                //extra="请选择"
                value={[this.state.sValue]}
                onChange={v => this.setState({ sValue: v[0] })}
                onOk={v => this.setState({ sValue: v[0] })}
                // {...getFieldProps('district3')}
              >
                <List.Item arrow="horizontal"></List.Item>
              </Picker>
            </div>
          </div>

          <div className={styles.echartBox} >
            {/* <Card.Grid className="pie_b"> */}
            <ReactEcharts option={this.getOption()} />
            {/* </Card.Grid> */}
          </div>
          <div className={styles.leftCycle}></div>
          <div className={styles.rightCycle}></div>
          <hr className={styles.scale} />
        </div>



        <div className={styles.contentBox}>
          <div className={styles.echartBox_2} >
            {/* <Card.Grid className="pie_b"> */}
            <ReactEcharts option={this.getHistogramOption()} />
            {/* </Card.Grid> */}
          </div>
          <div className={styles.leftCycle}></div>
          <div className={styles.rightCycle}></div>
          <hr className={styles.scale} />
        </div>



        <div className={styles.itemBox}>
          <div className={styles.title}>各学院情况</div>
          <div className={styles.detialBox}>
            {
              list &&
              list.map((item, index) => {
                return (
                  <div className={styles.items}
                    onClick={e => {
                      this.goToDetial(item.title)
                    }}>
                    <div className={styles.title}>{item.title}</div>

                    <div className={styles.detial}>
                      <span className={styles.total}>{item.total}人违纪&nbsp;&nbsp;&nbsp;</span>
                      <img className={styles.arrow} src={require('../../../assets/images/studentSutffMobile/main/arrow_black.png')} alt="" />
                    </div>

                    {index != list.length - 1 && <div className={styles.scaleBox}><div className={styles.scale}></div></div>}
                  </div>
                )
              })
            }

          </div>
        </div>
      </div >


    )
  }
}

function mapStateToProps(state) {
  const { routing,login, punish_teacher } = state;
  return {
      user: login.user,
      ...punish_teacher
  };
}

export default connect(mapStateToProps)(index);

