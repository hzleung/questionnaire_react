import React, { Component } from 'react';
import { connect } from 'dva';
import { List, WhiteSpace } from 'antd-mobile';
// eslint-disable-next-line import/no-extraneous-dependencies
import router from 'umi/router';
import styles from './index.less';

const bg = require('@/assets/images/studentSutffMobile/bg_4.png');
const arrowBlack = require('@/assets/images/studentSutffMobile/arrow_black.png');
const nodata = require('@/assets/images/studentSutffMobile/nodata.png');

class GradePage extends Component {
  state = {}

  componentDidMount() {
    const { dispatch, selectTask, location: { query: { bmid,taskId } } } = this.props;
    if (!selectTask || Object.keys(selectTask).length <= 0) {
        dispatch({
            type:'teacherEvaluation/queryEvaluationTask',
            taskId
        });
    }
    dispatch({
      type: 'teacherEvaluation/evaluationGradeList',
      taskId: selectTask.rwid || taskId,
      bmid
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
        type:'teacherEvaluation/updateState',
        state:{
            evaluationGradeList:[]
        }
    });
  }

  handleItemClick = (item,academy) => {
    const { location: { query } } = this.props;
    router.push(
        {
            pathname: '/teacher/evaluation/class/index',
            query: {
              grade: item.gradeId,
              ...query,
              bmid:academy.bmid
            }
          }
    );
  }

  render() {
    const { selectTask, evaluationGradeList } = this.props;
    if (!evaluationGradeList || evaluationGradeList.length <= 0) {
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
          <h1>{selectTask.bt }</h1>
          <h2>{selectTask.cpzq }</h2>
        </div>

        <div className={styles.titleBox_2}>
          <div className={styles.blue}>.</div>
          <div className={styles.title}>各年级测评进度</div>
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
            evaluationGradeList && evaluationGradeList.length > 0 &&
            evaluationGradeList.map((academy) => {
              return (
                <div key={academy.bmid}>
                  {
                    academy.evaluationGradeList && academy.evaluationGradeList.map((grade) => {
                      return (
                        <div key={grade.gradeId}>
                          <div className={styles.itemTitleBox} onClick={() => this.handleItemClick(grade,academy)}>
                            <div className={styles.title} >{`${academy.bmmc}-${grade.gradeName}`}</div>
                            <img src={arrowBlack} alt="" />
                          </div>
                          <List className="my-list">
                            {
                              grade.evaluationList && grade.evaluationList.map((item) => {
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
})(GradePage);
