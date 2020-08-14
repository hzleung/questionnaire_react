import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import router from 'umi/router';
import { connect } from 'dva';
import styles from './index.less';

const bg = require('@/assets/images/studentSutffMobile/bg_4.png');
const arrow = require('@/assets/images/studentSutffMobile/arrow_black.png');

class StudentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { dispatch, selectTask, location: { query: { classId,taskId } } } = this.props;
    if (!selectTask || Object.keys(selectTask).length <= 0) {
        dispatch({
            type:'teacherEvaluation/queryEvaluationTask',
            taskId
        });
    }
    dispatch({
      type: 'teacherEvaluation/evaluationStudentList',
      taskId: selectTask.rwid || taskId,
      classId
    });
  }

  render() {
    const { selectTask, evaluationStudentList, location: { query: { className,taskId } } } = this.props;
    return (
      <div style={{ background: 'rgba(242,244,247,1)', paddingBottom: '20px' }}>
        <style>
          {
            `
            .am-accordion::before{
              height:0 !important;
            }
              .am-accordion-item{
                margin-bottom: 12px;
                border-radius:5px;w
              }
              .am-list-line::after{
                height:0 !important;
              }
              .am-list-item{
                min-height: 35px !important;
              }
              .am-list-body{
                padding-bottom: 10px;
              }
            `
          }
        </style>
        <img className={styles.bg} src={bg} alt="" />
        <div className={styles.task}>
          <h1>{selectTask.bt }</h1>
          <h2>{selectTask.cpzq }</h2>
        </div>

        <div className={styles.situationBox}>
          <div className={styles.title}>
            {className}测评情况
          </div>
          <div className={styles.scale} />
          {
            evaluationStudentList.map((item, index) => {
              let status = '未测评';
              if (item.score) {
                  status = `${item.score}分`;
              } else if (item.nodeStatus === '3') {
                  status = '已提交';
              } else if (item.nodeStatus === '2') {
                  status = '已测评';
              }
              return (
                <div key={item.studentId}>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      router.push({
                        pathname: '/teacher/evaluation/student/result',
                        query:{
                            rwid:taskId,
                            lcid:selectTask.lcid,
                            xsid:item.studentId
                        }
                      });
                    }}
                    className={styles.detialBox}
                  >
                    <div className={styles.name}>{item.studentName}</div>
                    <div className={styles.statusStudent}>{item.nodeName}</div>
                    <div className={item.score ? styles.grade : styles.gray}>{status}</div>
                    <img src={arrow} alt="" />
                  </div>
                  {
                    index !== evaluationStudentList.lenght - 1 &&
                    <div className={styles.scale_2} />
                  }

                </div>
              );
            })
          }
        </div>

      </div >
    );
  }
}
export default connect((state) => {
  return { ...state.teacherEvaluation };
})(StudentPage);

