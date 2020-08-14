import React from 'react';
import { List, Picker } from 'antd-mobile';
import { connect } from 'dva';
// eslint-disable-next-line import/no-extraneous-dependencies
import { router } from 'umi';
// 导入饼图
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import styles from './index.less';

const arrowBlack = require('@/assets/images/studentSutffMobile/main/arrow_black.png');

function convertSchoolTime(schoolTime) {
    let time = schoolTime;
    if (time.split('-').length === 2) {
        time = `${time},${time}-1,${time}-2`;
    }
    return time;
}

class GrantPieStatistics extends React.Component {

  componentDidMount() {
    const { dispatch, location:{ query:{level} } } = this.props;
    dispatch({
        type:'honoraryTeacher/querySchoolTimeData',
        level
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
        type:'honoraryTeacher/updateState',
        state:{
            statistics:[]
        }
    });
  }

  goToDetial = item => {
    const { selectedSchoolTime, location:{ query:{level} } } = this.props;
    router.push({
      pathname: '/honorary/teacher/detail/index',
        query:{
            level,
            schoolTime:convertSchoolTime(selectedSchoolTime),
            awardId:item.id,
            nav:item.name
        },

    });
  };

  handleSchoolTimeChange = (schoolTime) => {
    const time = convertSchoolTime(schoolTime[0]);
    const { dispatch, location:{ query:{level} } } = this.props;
    dispatch({
        type:'honoraryTeacher/queryStatistics',
        level,
        schoolTime:time
    });
    dispatch({
        type:'honoraryTeacher/updateState',
        state:{
            selectedSchoolTime:schoolTime[0]
        }
    });
  }

  getOption = () => {
    const { statistics=[] } = this.props;
    let maleTotalCount = 0;
    let femaleTotalCount = 0;
    statistics.forEach(item=>{
        maleTotalCount += item.maleCount;
        femaleTotalCount += item.femaleCount;
    });
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br />{b} ({d}%)'
      },
      title: {
        text: `${maleTotalCount + femaleTotalCount  }人`,
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
          name: '获奖人数',
          type: 'pie',
          radius: ['30%', '50%'],
          center: ['55%', '44%'],
          data: [
            { value: maleTotalCount, name: `男生数: \n${  maleTotalCount  }人` },
            { value: femaleTotalCount, name: `女生数: \n${  femaleTotalCount  }人` }
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
              borderWidth: 5, // 设置border的宽度有多大
              borderColor: '#fff',
              color (params) {
                // 自定义颜色
                const colorList = [
                  '#77BEFF', '#C7E08A'
                ];
                return colorList[params.dataIndex];
              }
            }
          }
        }
      ]
    };
  }

  render() {
    const { schoolTimeData, selectedSchoolTime, statistics } = this.props;
    return (
      <div
        style={{
        background: 'rgba(242,244,247,1)'
        , padding: '19px 14.5px'
      }}
      >
        <div className={styles.contentBox}>
          <div className={styles.titleBox}>
            <div className={styles.title}>
              荣誉称号人数统计
            </div>

            <div className={styles.pickerBox} onClick={(e) => e.preventDefault}>
              <Picker
                cols={1}
                data={schoolTimeData}
                extra="请选择(可选)"
                value={[selectedSchoolTime]}
                onOk={this.handleSchoolTimeChange}
              >
                <List.Item arrow="horizontal" />
              </Picker>
            </div>
          </div>

          <div className={styles.echartBox} >
            {/* <Card.Grid className="pie_b"> */}
            <ReactEcharts option={this.getOption()} />
            {/* </Card.Grid> */}
          </div>
          <div className={styles.leftCycle} />
          <div className={styles.rightCycle} />
          <hr className={styles.scale} />

        </div>

        <div className={styles.itemBox}>

          <div className={styles.detialBox}>
            {
              statistics && statistics.length > 0 ?
              statistics.map((item, index) => {
                return (
                  <div
                    className={styles.items}
                    onClick={() => {
                      this.goToDetial(item);
                    }}
                    key={item.id}
                  >
                    <div className={styles.title}>{item.name}</div>
                    <div className={styles.detial}>
                      <span className={styles.man}>男 &nbsp;</span>
                      <span className={styles.value}>{item.maleCount}&nbsp;&nbsp;</span>
                      <span className={styles.woman}>女&nbsp;</span>
                      <span className={styles.value}>{item.femaleCount}&nbsp;&nbsp;</span>
                      <span className={styles.total}>{item.maleCount + item.femaleCount}人&nbsp;&nbsp;&nbsp;</span>
                      <img className={styles.arrow} src={arrowBlack} alt="" />
                    </div>

                    {index !== statistics.length - 1 && <div className={styles.scaleBox}><div className={styles.scale} /></div>}
                  </div>
                );
              }) : <div className={styles.items}><div className={styles.noData}>暂无数据</div></div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state)=>{return {...state.honoraryTeacher};})(GrantPieStatistics);

