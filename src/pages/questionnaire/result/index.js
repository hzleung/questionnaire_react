import React from 'react';
import { connect } from 'dva';
import { Header } from '@/components';
import { Link } from 'umi';
import { List, Radio, Drawer, Checkbox, TextareaItem, Modal } from 'antd-mobile';
import styles from "./index.less";

const icon = {
    'result': require('../../../assets/images/questionnaire/result/result.png'),
    'goBack': require('../../../assets/images/questionnaire/result/goBack.png'),
}

const RadioItem = Radio.RadioItem;
const CheckboxItem = Checkbox.CheckboxItem;
const alert = Modal.alert;

const testItem = [
    {
        id: 1,
        is_right: true,
        title: '这是第一道单项选择题',
        score: 5,
        option_detail: [
            {
                isTrue: true,
                isChecked: false,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: false,
                isChecked: true,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
    {
        id: 2,
        is_right: false,
        title: '这是一道多项选择题',
        score: 10,
        option_detail: [
            {
                isTrue: true,
                isChecked: true,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: true,
                isChecked: true,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
    {
        id: 3,
        is_right: false,
        title: '这是第3道单项选择题',
        score: 15,
        option_detail: [
            {
                isTrue: true,
                isChecked: true,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
    {
        id: 4,
        is_right: true,
        title: '这是第4道单项选择题',
        score: 20,
        option_detail: [
            {
                isTrue: true,
                isChecked: true,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
    {
        id: 5,
        is_right: true,
        title: '这是第5道单项选择题',
        score: 5,
        option_detail: [
            {
                isTrue: true,
                isChecked: true,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
    {
        id: 6,
        is_right: true,
        title: '这是第6道单项选择题',
        score: 15,
        option_detail: [
            {
                isTrue: true,
                isChecked: true,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
    {
        id: 7,
        is_right: true,
        title: '这是第7道单项选择题',
        score: 5,
        option_detail: [
            {
                isTrue: true,
                isChecked: true,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
    {
        id: 8,
        is_right: true,
        title: '这是第8道单项选择题',
        score: 5,
        option_detail: [
            {
                isTrue: true,
                isChecked: true,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
    {
        id: 9,
        is_right: true,
        title: '这是第9道单项选择题',
        score: 5,
        option_detail: [
            {
                isTrue: true,
                isChecked: false,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: false,
                isChecked: true,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
    {
        id: 10,
        is_right: true,
        title: '这是第10道单项选择题',
        score: 5,
        option_detail: [
            {
                isTrue: true,
                isChecked: true,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
    {
        id: 11,
        is_right: false,
        title: '这是第11道单项选择题',
        score: 5,
        option_detail: [
            {
                isTrue: true,
                isChecked: true,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
    {
        id: 12,
        is_right: true,
        title: '这是第12道单项选择题',
        score: 5,
        option_detail: [
            {
                isTrue: true,
                isChecked: true,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
    {
        id: 13,
        is_right: false,
        title: '这是第13道单项选择题',
        score: 5,
        option_detail: [
            {
                isTrue: true,
                isChecked: false,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: false,
                isChecked: true,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
    {
        id: 14,
        is_right: true,
        title: '这是第14道单项选择题',
        score: 5,
        option_detail: [
            {
                isTrue: true,
                isChecked: true,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
    {
        id: 15,
        is_right: true,
        title: '这是第15道单项选择题',
        score: 5,
        option_detail: [
            {
                isTrue: true,
                isChecked: true,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
    {
        id: 16,
        is_right: true,
        title: '这是第16道单项选择题',
        score: 5,
        option_detail: [
            {
                isTrue: true,
                isChecked: true,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
    {
        id: 17,
        is_right: false,
        title: '这是第17道单项选择题',
        score: 5,
        option_detail: [
            {
                isTrue: true,
                isChecked: true,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
    {
        id: 18,
        is_right: true,
        title: '这是第18道单项选择题',
        score: 5,
        option_detail: [
            {
                isTrue: true,
                isChecked: true,
                value: 0,
                label: '选项A'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 1,
                label: '选项B'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 2,
                label: '选项C'
            },
            {
                isTrue: false,
                isChecked: false,
                value: 3,
                label: '选项D'
            },
        ]
    },
]

class questionnaireResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '职业能力测试',
            test_type: 'answer',
            // test_type: 'question',
            test_item: testItem,
            clickId: -1,
            showScore: true,
            currentIndex: -1,  // 当前选中的题号
        };
    }

    componentWillMount = () => {
        this.onGetUserInfo();
    }


    // 获取答题学生信息
    onGetUserInfo = () => {
        let currentUser_data = JSON.parse(window.sessionStorage.getItem('currentUser'));
        // console.log(currentUser_data)
    }

    // 点击一个题号，显示该题的作答情况
    onClickItem = (id, index) => {
        const { showScore } = this.state;
        let currentIndex = index + 1;
        document.querySelector("#answer_result_box").scrollIntoView(true);
        this.setState({
            clickId: id,
            currentIndex
        })
    }


    render() {
        const { title, test_type, test_item, clickId, showScore, currentIndex } = this.state;
        return (
            <div className={styles.result}>
                <Header title={title} hideBack hideHome className={styles.header} />
                <Link to={''}>
                    <div className={styles.goBack}>
                        <img src={icon.goBack} />
                    </div>
                </Link>
                {test_type === 'question'
                    ? <div className={styles.question_result_box}>
                        <div className={styles.img}>
                            <img src={icon.result} />
                        </div>
                        <div className={styles.desc}>提交问卷成功</div>
                        <Link to={''}>
                            <div className={styles.btn}>返回首页</div>
                        </Link>
                    </div>
                    : <div className={styles.answer_result_box} id='answer_result_box'>
                        <div className={styles.score} style={showScore ? {} : { display: 'none' }}>
                            <div className={styles.title}>
                                <div></div>
                                <div>得分情况</div>
                            </div>
                            <div className={styles.info}>
                                <div>姓名：阿基米诺</div>
                                <div>学院：电子信息与计算机学院</div>
                                <div>学号：12345678911</div>
                                <div>班级：土木工程（3）班</div>
                            </div>
                            <div className={styles.score_card}>
                                <div className={styles.score_card_top}>
                                    <div className={styles.used_time}>答题用时：59s</div>
                                    <div className={styles.score_view}>
                                        <div className={styles.score_view_left}>
                                            <div>当前得分：</div>
                                            <div>96分</div>
                                        </div>
                                        <div className={styles.reanswer_btn}>重新作答</div>
                                    </div>
                                </div>
                                <div className={styles.desc}>
                                    <div className={styles.total_score}>问卷总分：100</div>
                                    <div className={styles.pass_score}>合格分数：60</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.answer_detail}>
                            <div className={styles.title}>
                                <div></div>
                                <div>答题情况（本次问卷共{test_item.length}题）</div>
                            </div>
                            <div className={styles.grid}>
                                {test_item.map((item, index) => {
                                    return (
                                        <div className={styles.grid_item} key={item.id} style={item.is_right ? (currentIndex === item.id ? { background: '#25C4A9', color: '#FFF' } : {}) : (currentIndex === item.id ? { background: '#FF5E5E', color: '#FFF' } : { background: 'rgba(255,17,17,0.1)', color: '#FF1111' })} onClick={this.onClickItem.bind(this, item.id, index)}>{item.id}</div>
                                    )
                                })}
                            </div>
                            <div className={styles.explain}>点击题号查看答题详情</div>
                        </div>
                        {clickId !== -1
                            ? <div className={styles.item_detail}>
                                <div className={styles.title}>{`${clickId}.${test_item[clickId - 1].title}（分值：${test_item[clickId - 1].score}分）`}</div>
                                {test_item[clickId - 1].option_detail.map(i => {
                                    return (
                                        <div className={styles.option_item} key={i.value}>
                                            <div className={i.isChecked ? styles.circle_checked : styles.circle}></div>
                                            <div className={styles.content} style={i.isTrue ? { color: '#25C4A9' } : { color: '#FF1111' }}>{i.label}</div>
                                        </div>
                                    )
                                })}
                            </div>
                            : ''
                        }
                    </div>
                }

            </div>
        )
    }
}

export default connect((state) => {
    return {}
})(questionnaireResult);
