import React from 'react';
import { Accordion } from 'antd-mobile';
import { connect } from 'dva';
import styles from './index.less';

const femal = require('../../../../assets/images/studentSutffMobile/apply/female.png');
const mal = require('../../../../assets/images/studentSutffMobile/apply/male.png');

class ScholarshipPieStatisticsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    const { dispatch, location: { query: { level, schoolTime, awardId } } } = this.props;
    dispatch({
      type: 'scholarshipTeacher/queryStatisticsDetail',
      level,
      schoolTime,
      awardId
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
        type:'scholarshipTeacher/updateState',
        state:{
            detailData:{}
        }
    });
  }

  renderList = (list) => {
    if (!list || list.length <= 0) return <div style={{textAlign:'center'}}>暂无数据</div>;
    return (
      <Accordion defaultActiveKey="0" className="my-accordion" >
        {
          list.map((item1) => {
            return (
              <Accordion.Panel key={item1.id} header={`${item1.name}：${item1.total}人`} className={styles.pad1}>
                {
                  item1.children ? this.renderList(item1.children) :

                  <div className={styles.detialBOx}>
                    {
                        item1.studentList.map((item, index) => {
                          return (
                            <div key={item.id}>
                              {
                                <div className={styles.detialLine}>
                                  <div className={styles.detial}>
                                    <div className={styles.nameBox}><div className={styles.name}>{item.name}</div> <img src={item.sex === '2' ? femal : mal} alt="" /></div>
                                    <div className={styles.id}>{item.id}</div>
                                    <div className={styles.class}>{item.timeCode}</div>
                                  </div>
                                </div>
                              }
                              {
                                index !== item1.studentList.length - 1 &&
                                <div className={styles.scale} />
                              }
                            </div>
                          );
                        })
                      }

                  </div>
                }
              </Accordion.Panel>
            );
          })
        }
      </Accordion>
    );
  };

  render() {
    const { detailData = {} } = this.props;
    const { list = [] } = detailData;
    return (
      <div style={{
        background: 'rgba(242,244,247,1)'
        , padding: '15px'
      }}
      >
        <div className={styles.titleBox}>

          <div className={styles.detialBox}>
            <div className={styles.value}>{detailData.total}</div>
            <div className={styles.key}>获奖人数</div>
          </div>

          <div className={styles.detialBox}>
            <div className={styles.value}>{detailData.maleCount}</div>
            <div className={styles.key}>男生人数</div>
          </div>

          <div className={styles.detialBox}>
            <div className={styles.value}>{detailData.femaleCount}</div>
            <div className={styles.key} > 女生人数</div>
          </div>
        </div>

        <div className={styles.group}>
          {
              this.renderList(list)
          }
        </div>
      </div>
    );
  }
}

export default connect((state) => { return { ...state.scholarshipTeacher }; })(ScholarshipPieStatisticsDetail);

