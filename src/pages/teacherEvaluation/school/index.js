import React, { Component } from 'react';
import { connect } from 'dva';
import { List, WhiteSpace } from 'antd-mobile';
// eslint-disable-next-line import/no-extraneous-dependencies
import router from 'umi/router';
import styles from './index.less';

const bg = require('@/assets/images/studentSutffMobile/bg_4.png');
const arrowBlack = require('@/assets/images/studentSutffMobile/arrow_black.png');
const nodata = require('@/assets/images/studentSutffMobile/nodata.png');

class SchoolPage extends Component {
  state = {}

  componentDidMount() {
    const { dispatch, location: { query: { taskId,level } },selectTask } = this.props;
    if (!selectTask || Object.keys(selectTask).length <= 0) {
        dispatch({
            type:'teacherEvaluation/queryEvaluationTask',
            taskId
        });
    }
    dispatch({
      type: 'teacherEvaluation/evaluationSchoolList',
      taskId:selectTask.taskId||taskId,
      level
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
        type:'teacherEvaluation/updateState',
        state:{
            evaluationSchoolList:[]
        }
    });
  }

  handleItemClick = item => {
    const { location: { query } } = this.props;
    router.push(
      {
        pathname: '/teacher/evaluation/grade/index',
        query: {
          bmid: item.bmid,
          ...query
        }
      }
    );
  }

  render() {
    const { selectTask, evaluationSchoolList } = this.props;
    if (!evaluationSchoolList || evaluationSchoolList.length <= 0) {
        return (
            <div className={styles.imgBox}>
                <img className={styles.nodata} src={nodata} alt=""/>
                <div>暂无数据</div>
            </div>
        );
    }
    return (
      <div>
        <img className={styles.bg} src={bg} alt="" />
        <div className={styles.task}>
          <h1>{selectTask.bt}</h1>
          <h2>{selectTask.cpzq}</h2>
        </div>

        <div className={styles.titleBox_2}>
          <div className={styles.blue}>.</div>
          <div className={styles.title}>各学院测评进度</div>
          <div className={styles.hint_2}>
            <div>
              <div className={styles.color_1} />
              <div className={styles.text}>已提交班级</div>
            </div>

            <div>
              <div className={styles.color_2} />
              <div className={styles.text}>未提交班级</div>
            </div>
          </div>
        </div>

        <div className={styles.accordionBox}>
          {
            evaluationSchoolList && evaluationSchoolList.length > 0 &&
            evaluationSchoolList.map((academy) => {
              return (
                <div key={academy.bmid}>
                  <div className={styles.itemTitleBox} onClick={() => this.handleItemClick(academy)}>
                    <div className={styles.title} >{academy.bmmc}</div>
                    <img src={arrowBlack} alt="" />
                  </div>
                  <List className="my-list">
                    {
                      academy.evaluationList && academy.evaluationList.map((item) => {
                        const number = Math.round(item.submitCount / item.totalCount * 10000) / 100.00;
                        return (
                          <List.Item key={item.nodeId} >
                            <div className={styles.itemBox}>
                              <div className={styles.itemLine}>
                                <div className={styles.dot} />
                                <div className={styles.textAndstudentNumber}>
                                  <div className={styles.text}>{item.nodeName}：</div>
                                  <div className={styles.studentNumber}>{`${number}%`}</div>
                                </div>
                                <div className={styles.progressBox}>
                                  <div
                                    style={{ width: `${number}%` }}
                                    className={styles.progressBlue}
                                  />
                                </div>
                                <div className={styles.studentRate}>{`${item.submitCount}/${item.totalCount - item.submitCount}`}</div>
                              </div>
                            </div>
                          </List.Item>
                        );
                      })
                    }
                  </List>
                  <WhiteSpace />
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default connect((state) => {
  return { ...state.teacherEvaluation };
})(SchoolPage);
