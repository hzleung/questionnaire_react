import React from 'react';
import { connect } from 'dva';
// eslint-disable-next-line import/no-extraneous-dependencies
import router from 'umi/router';
import { Toast } from 'antd-mobile';
import styles from './task.less';

const arrowBlack = require('@/assets/images/studentSutffMobile/arrow_black.png');
const nodata = require('@/assets/images/studentSutffMobile/nodata.png');

class TeacherEvalutionHome extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'teacherEvaluation/getTaskList'
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
        type:'teacherEvaluation/updateState',
        state:{
            taskList:[]
        }
    });
  }

  hanldeTaskClick = item => {
    const { dispatch, location:{ query:{level} } } = this.props;
    dispatch({
      type: 'teacherEvaluation/updateState',
      state: {
        selectTask: item
      }
    });
    if (level === 'school') {
      router.push(
        { pathname: '/teacher/evaluation/school/index', query: { taskId: item.rwid,level } }
      );
    } else if (level === 'academy') {
        router.push(
            { pathname: '/teacher/evaluation/school/index', query: { taskId: item.rwid,level } }
        );
    } else if (level === 'grade') {
        router.push(
            { pathname: '/teacher/evaluation/grade/index', query: { taskId: item.rwid } }
        );
    } else if (level === 'class') {
        router.push(
            { pathname: '/teacher/evaluation/class/index', query: { taskId: item.rwid } }
        );
    } else {
        Toast.info('当前用户没有任职信息，无法查看');
    }
  }

  render() {
    const { taskList } = this.props;
    if (!taskList || taskList.length <= 0) {
        return (
            <div className={styles.imgBox}>
                <img className={styles.nodata} src={nodata} alt=""/>
                <div>暂无数据</div>
            </div>
        );
    }
    return (
      <div>
        <div style={{
          padding: '15px 15px',
        }}
        >
          {
            taskList.map((item) => {
              return (

                <div key={item.rwid}>
                  {
                    item.zt === '1' ?
                      < div className={styles.boxGray} onClick={() => this.hanldeTaskClick(item)} >
                        <div>
                          <div className={styles.title}>{item.bt}</div>
                          <div className={styles.time}>{item.cpzq}</div>

                          <div className={styles.gray}>
                            已完成
                          </div>
                        </div>
                        <img src={arrowBlack} alt="" />
                      </div>

                      :

                      < div className={styles.box} onClick={() => this.hanldeTaskClick(item)} >
                        <div>
                          <div className={styles.title}>{item.bt}</div>
                          <div className={styles.time}>{item.cpzq}</div>

                          <div className={styles.doing}>
                            {item.currentNodeName}
                          </div>

                        </div>

                        <img src={arrowBlack} alt="" />
                      </div>

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
})(TeacherEvalutionHome);
