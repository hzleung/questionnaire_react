import React from 'react';
import { connect } from 'dva';
import { Header } from '@/components';
import { Link } from 'umi';
import styles from "./index.less";

const icon = {
  'ongoing_answer': require('../../assets/images/questionnaire/ongoing_answer.png'),
  'ongoing_question': require('../../assets/images/questionnaire/ongoing_question.png'),
  'finished_answer': require('../../assets/images/questionnaire/finished_answer.png'),
  'finished_question': require('../../assets/images/questionnaire/finished_question.png'),
}

const TEST_TYPE = {
  ANSWER_SHEET: 'answer_sheet',  //答卷
  QUESTIONNAIRE: 'questionnaire',  //问卷
}

const TEST_STATUS = {
  NOT_START: '未开始',
  ONGOING: '进行中',
  FINISHED: '已完成',
}

const questionnaireData = [
  {
    id: 1,
    test_type: TEST_TYPE.ANSWER_SHEET,
    title: '这是一份进行中的答卷答卷来的啊啊',
    fullScore: 100,     //答卷才有分数
    completion: 0,
    desc: '此次问卷请在8.10~8.14完成',
    status: TEST_STATUS.ONGOING
  },
  {
    id: 2,
    test_type: TEST_TYPE.QUESTIONNAIRE,
    title: '这是一份进行中的问卷问卷来的啊啊',
    completion: 0,
    desc: '此次问卷请在8.10~8.14完成',
    status: TEST_STATUS.ONGOING
  },
  {
    id: 3,
    test_type: TEST_TYPE.ANSWER_SHEET,
    title: '这是一份已完成的答卷答卷来的啊啊',
    fullScore: 100,     //答卷才有分数
    completion: 0,
    desc: '此次问卷请在8.10~8.14完成',
    status: TEST_STATUS.FINISHED
  },
  {
    id: 4,
    test_type: TEST_TYPE.QUESTIONNAIRE,
    title: '这是一份已完成的问卷问卷来的啊啊',
    completion: 0,
    desc: '此次问卷请在8.10~8.14完成',
    status: TEST_STATUS.FINISHED
  },
  {
    id: 5,
    test_type: TEST_TYPE.ANSWER_SHEET,
    title: '这是一份未开始的答卷答卷来的啊啊',
    fullScore: 100,     //答卷才有分数
    completion: 0,
    desc: '此次问卷请在8.10~8.14完成',
    status: TEST_STATUS.NOT_START
  },
  {
    id: 6,
    test_type: TEST_TYPE.QUESTIONNAIRE,
    title: '这是一份未开始的问卷问卷来的啊啊',
    completion: 0,
    desc: '此次问卷请在8.10~8.14完成',
    status: TEST_STATUS.NOT_START
  },
  {
    id: 7,
    test_type: TEST_TYPE.QUESTIONNAIRE,
    title: '这是一份进行中的问卷问卷来的啊啊',
    completion: 0,
    desc: '此次问卷请在8.10~8.14完成',
    status: TEST_STATUS.ONGOING
  },
  {
    id: 8,
    test_type: TEST_TYPE.QUESTIONNAIRE,
    title: '这是一份已完成的问卷问卷来的啊啊',
    completion: 0,
    desc: '此次问卷请在8.10~8.14完成',
    status: TEST_STATUS.FINISHED
  },
]

class questionnaireIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '在线答题',
      questionnaire_data: questionnaireData,
    };
  }

  componentWillMount = () => {
    this.handleSort();
  }

  // 根据 问卷/答卷 以及 进行中/已完成 匹配对应的图标
  handleMatchIcon = (test_type, test_status) => {
    if (test_type === 'answer_sheet') {  //答卷
      if (test_status === '进行中' || test_status === '未开始') {
        return icon.ongoing_answer
      } else {
        return icon.finished_answer
      }
    } else {     // 问卷
      if (test_status === '进行中' || test_status === '未开始') {
        return icon.ongoing_question
      } else {
        return icon.finished_question
      }
    }
  }

  // 处理 问卷/答卷 的状态，未开始的点击之后变成正再进行中。
  handleStatus = (id, status) => {
    const { questionnaire_data } = this.state;
    if(status === '未开始') {
      questionnaire_data[id - 1].status = TEST_STATUS.ONGOING
    }
  }

  // 排序，依次是：进行中、已完成、未开始
  handleSort = () => {
    const { questionnaire_data } = this.state;
    let sort_questionnaire_data = [];
    // 先push进行中的
    questionnaire_data.filter(item => item.status === TEST_STATUS.ONGOING).map(i => {
      sort_questionnaire_data.push(i)
    })
    // 先push已完成的
    questionnaire_data.filter(item => item.status === TEST_STATUS.FINISHED).map(i => {
      sort_questionnaire_data.push(i)
    })
    // 先push未开始的
    questionnaire_data.filter(item => item.status === TEST_STATUS.NOT_START).map(i => {
      sort_questionnaire_data.push(i)
    })
    this.setState({
      questionnaire_data: sort_questionnaire_data
    })
  }


  render() {
    const { title, questionnaire_data } = this.state;
    return (
      <div className={styles.questionnaire}>
        <Header title={title} hideBack hideHome className={styles.header} />
        <div className={styles.questionnaire_list}>
          {questionnaire_data.map(item => {
            return (
              <Link to={item.status === '已完成' ? './questionnaire/result' : './questionnaire/intro' } key={item.id}>
                <div className={styles.questionnaire_list__item} style={item.status === '进行中' ? {} : {background: '#fff'}} onClick={this.handleStatus.bind(this, item.id, item.status)}>
                  <div className={styles.questionnaire_list__item__img}>
                    <img src={this.handleMatchIcon(item.test_type, item.status)} />
                  </div>
                  <div className={styles.questionnaire_list__item__content}>
                    <div className={styles.title}>{item.title}</div>
                    <div className={styles.intro}>
                      {item.test_type === 'answer_sheet'
                        ? <div style={item.status === '已完成' ? { color: '#25C4A9' } : { color: '#666' }}>满分：{item.fullScore}分</div>
                        : ''
                      }
                      {item.status === '未开始'
                        ? ''
                        : <div style={item.status === '已完成' ? { color: '#25C4A9' } : { color: '#FF1111' }}>完成度：{item.completion}%</div>
                      }
                    </div>
                    <div className={styles.desc} style={item.status === '进行中' ? { color: '#2E7BFF' } : { color: '#999' }}>{item.desc}</div>
                  </div>
                  <div className={styles.questionnaire_list__item__status} style={item.status === '进行中' ? {} : (item.status === '已完成' ? { background: '#25C4A9' } : { background: 'rgba(46,123,255,0.1)', color: '#2E7BFF' })}>{item.status}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }
}

export default connect((state) => {
  return {}
})(questionnaireIndex);
