import React from 'react';
import { connect } from 'dva';
import { List, Radio, Drawer, Checkbox, TextareaItem, Modal, InputItem } from 'antd-mobile';
import { Header } from '@/components';
import styles from "./index.less";
import { Link } from 'umi';

const RadioItem = Radio.RadioItem;
const CheckboxItem = Checkbox.CheckboxItem;
const alert = Modal.alert;

const icon = {
    'answer': require('../../../assets/images/questionnaire/intro/answer.png'),
    'question': require('../../../assets/images/questionnaire/intro/question.png'),
    'sidebar': require('../../../assets/images/questionnaire/answer/sidebar.png'),
    'loading': require('../../../assets/images/questionnaire/answer/loading.png'),
}


// 一张试卷的所有题目
const testItem = [
    {
        id: 1,  // 题序， 从1开始
        answer_type: 'Radio',  // 题目类型：Radio 单选，Checkbox 多选，fillInTheBlanks 填空，Textarea 解答
        answer_type_text: '一、单选题',  // 题目类型文字描述
        answer_content_title: '这是第一题',  // 该题题目
        score: '5',  // 该题所占分数
        optionData: [  // 该题选项
            { value: 0, label: '第一题选项A' },
            { value: 1, label: '第一题选项B' },
            { value: 2, label: '第一题选项C' },
            { value: 3, label: '第一题选项D' },
        ],
        checked_value: -1
    },
    {
        id: 2,  // 题序， 从1开始
        answer_type: 'Checkbox',  // 题目类型：Radio 单选，Checkbox 多选，fillInTheBlanks 填空，Textarea 解答
        answer_type_text: '二、多选题',  // 题目类型文字描述
        answer_content_title: '这是第二题',  // 该题题目
        score: '10',  // 该题所占分数
        optionData: [  // 该题选项
            { value: 0, label: '第二题选项A' },
            { value: 1, label: '第二题选项B' },
            { value: 2, label: '第二题选项C' },
            { value: 3, label: '第二题选项D' },
        ],
        checked_value: -1
    },
    {
        id: 3,  // 题序， 从1开始
        answer_type: 'fillInTheBlanks',  // 题目类型：Radio 单选，Checkbox 多选，fillInTheBlanks 填空，Textarea 解答
        answer_type_text: '三、填空题',  // 题目类型文字描述
        answer_content_title: '这是第三题，填空题',  // 该题题目
        score: '15',  // 该题所占分数
        optionData: [  // 填空题，这即是空格的数量value以及内容label
            { value: 0, label: '' },
            { value: 1, label: '' },
            { value: 2, label: '' },
            { value: 3, label: '' },
        ],
        checked_value: -1
    },
    {
        id: 4,  // 题序， 从1开始
        answer_type: 'Textarea',  // 题目类型：Radio 单选，Checkbox 多选，fillInTheBlanks 填空，Textarea 解答
        answer_type_text: '四、问答题',  // 题目类型文字描述
        answer_content_title: '这是第四题,说题目会很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',  // 该题题目
        score: '20',  // 该题所占分数
        value: '',
        checked_value: -1
    },
]

class questionnaireAnswer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '职业能力测试',
            sidebarOpen: false,  // 侧边栏开关
            test_item: testItem,  // 题目数据
            test_item_offset: 0,  // 上一题和下一题向左偏移量
            all_count: 0, // 总共有多少道题目
            finished_count: 0,  //已完成多少道题目
            countdown: 60,  // 倒计时
            isConfirmSubmit: false,  //是否确认交卷
            offsetWidth: 0,  // 该区域占该分辨率下的宽度
            showLoadingModal: false,  // 交卷后loading过渡
        };
    }

    componentWillMount = () => {
        let offsetWidth = document.querySelector('body').offsetWidth * 0.904; // 该区域占该分辨率下的宽度
        this.setState({
            offsetWidth
        })
        this.handleCountDown();
        this.handleHasStep(offsetWidth);
    }

    componentDidMount = () => {
        this.handleProcess();
    }

    // 通过判断路径是否存在 step 参数来辨别是不是中途交卷进来的。
    handleHasStep = (offsetWidth) => {
        let step = 0;
        let left = 0;
        // 如果有step，则跳转到对应题目，通过控制 left 的值
        if(this.props.location.query.step) {
            step = this.props.location.query.step
            left = -(step-1) * offsetWidth
            this.setState({
                test_item_offset: left
            })
        }
    }

    // 操作顶部进度条和整体数据
    handleProcess = () => {
        const { test_item } = this.state;
        let all_count = test_item.length;
        let finished_count = test_item.filter(i => i.checked_value !== -1).length;
        this.setState({
            all_count,
            finished_count
        })
    }

    // 处理顶部倒计时
    handleCountDown = () => {
        let { countdown } = this.state;
        const timer = setInterval(() => {
            this.setState({
                countdown: (countdown--)
            }, () => {
                if (countdown === 0) {
                    clearInterval(timer);
                    console.log('时间到，已自动交卷')
                }
            })
        }, 1000)
    }

    // 单选
    onRadioChange = (id, value) => {
        const { test_item } = this.state;
        test_item[id - 1].checked_value = value
        this.setState({
            test_item
        });
        this.handleProcess();
    };

    // 复选框
    onCheckboxChange = (id, e) => {
        const { test_item } = this.state;
        if (e.target.checked) {
            test_item[id - 1].checked_value = 1 // 用于判断该题是否作答
        } else {
            // test_item[id - 1].checked_value = -1 
        }
        this.setState({
            test_item
        });
        this.handleProcess();
    }

    // 填空题
    onFillInBlanksChange = (id, value) => {
        console.log('111', id, value)
        const { test_item } = this.state;
        if (value !== '') {
            test_item[id - 1].checked_value = 1
        } else {
            test_item[id - 1].checked_value = -1
        }
        this.setState({
            test_item
        });
        this.handleProcess();
    }

    // 问答题作答区域
    onTextareaChange = (id, value) => {
        const { test_item } = this.state;
        // console.log(value)
        if (value !== '') {
            test_item[id - 1].checked_value = 1
        } else {
            test_item[id - 1].checked_value = -1
        }
        this.setState({
            test_item
        });
        this.handleProcess();
    }

    // 滑出侧边栏
    onOpenSidebarChange = (...args) => {
        console.log(args);
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }

    // 切换题目
    onSwitchItem = (value) => {
        // console.log('document', document.querySelector('body').offsetWidth)
        const { test_item_offset, test_item, offsetWidth } = this.state;
        let left = 0;
        if (value === 'toPre') {
            // 第一题，不能向前偏移
            if (test_item_offset === 0) {
                left = 0;
            } else {
                left = test_item_offset + offsetWidth;
            }
        } else if (value === 'toNext') {
            // 最后一题，不能向后偏移
            if (test_item_offset === -(test_item.length - 1) * offsetWidth) {
                left = -(test_item.length - 1) * offsetWidth
            } else {
                left = test_item_offset - offsetWidth;
            }
        }
        this.setState({
            test_item_offset: left
        })
    }

    // 提交试卷
    onSubmit = () => {
        console.log('提交试卷')
        const { all_count, finished_count, isConfirmSubmit } = this.state;
        if (all_count === finished_count) {
            console.log('题目已作答完，可以正常提交')
            this.setState({
                isConfirmSubmit: true
            })
            this.showModal();
            setTimeout(() => {
                this.props.history.push('./result');
            }, 2000)
        } else {
            console.log('题目未作答完，给个提示')
            alert('提示', '未作答完，确定交卷吗？当前交卷仍统计分数，下次还可继续答卷', [
                {
                    text: '确定', onPress: () => {
                        this.setState({
                            isConfirmSubmit: true
                        })
                        console.log('22222')
                        this.showModal();
                        setTimeout(() => {
                            this.props.history.push('./result')
                        }, 2000)
                    }
                },
                {
                    text: '取消', onPress: () => {
                        this.setState({
                            isConfirmSubmit: false
                        })
                    }
                },
            ])
        }
    }

    // loading处理
    showModal = e => {
        // e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            showLoadingModal: true
        });
        setTimeout(() => {
            this.setState({
                showLoadingModal: false
            });
        }, 2000)
    }
    onClose = () => {
        this.setState({
            showLoadingModal: false,
        });
    }

    // onWrapTouchStart = (e) => {
    //     // fix touch to scroll background page on iOS
    //     if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
    //         return;
    //     }
    //     const pNode = closest(e.target, '.am-modal-content');
    //     if (!pNode) {
    //         // e.preventDefault();
    //     }
    // }


    render() {
        const { title, test_item, sidebarOpen, test_item_offset, all_count, finished_count, countdown, isConfirmSubmit, offsetWidth, showLoadingModal } = this.state;
        // 侧边栏
        const sidebar = (<List>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i, index) => {
                if (index === 0) {
                    return (<List.Item key={index}
                        thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
                        multipleLine
                    >Category</List.Item>);
                }
                return (<List.Item key={index}
                    thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
                >Category{index}</List.Item>);
            })}
        </List>);
        return (
            <div className={styles.answer}>
                <Header title={title} hideHome className={styles.header} />
                <div className={styles.answer_box}>
                    <div className={styles.top}>
                        <div className={styles.process}>
                            <div className={styles.process_text}>
                                <div>{finished_count}/{all_count}</div>
                                <div>倒计时：{countdown}s</div>
                            </div>
                            <div className={styles.process_view}>
                                <div style={{ width: `${(finished_count / all_count * 100).toFixed(2)}%` }}></div>
                            </div>
                        </div>
                        <div className={styles.submit} onClick={this.onSubmit}>交卷</div>
                    </div>
                    <div className={styles.answer_list}>
                        <div className={styles.answer_view} style={{ left: `${test_item_offset}px` }}>
                            {test_item.map(item => {
                                if (item.answer_type === 'Radio') {
                                    return (
                                        <div className={styles.answer_item} key={item.id}>
                                            <div className={styles.answer_type}>{item.answer_type_text}</div>
                                            <div className={styles.answer_area}>
                                                <List renderHeader={() => `${item.id}.${item.answer_content_title}（分值：${item.score}分）`}>
                                                    {item.optionData.map(i => (
                                                        <RadioItem key={i.value} checked={item.checked_value === i.value} onChange={this.onRadioChange.bind(this, item.id, i.value)}>
                                                            {i.label}
                                                        </RadioItem>
                                                    ))}
                                                </List>
                                            </div>
                                        </div>
                                    )
                                } else if (item.answer_type === 'Checkbox') {
                                    return (
                                        <div className={styles.answer_item} key={item.id}>
                                            <div className={styles.answer_type}>{item.answer_type_text}</div>
                                            <div className={styles.answer_area}>
                                                <List renderHeader={() => `${item.id}.${item.answer_content_title}（分值：${item.score}分）`}>
                                                    {item.optionData.map(i => (
                                                        <CheckboxItem key={i.value} onChange={this.onCheckboxChange.bind(this, item.id)}>
                                                            {i.label}
                                                        </CheckboxItem>
                                                    ))}
                                                </List>
                                            </div>
                                        </div>
                                    )
                                } else if (item.answer_type === 'fillInTheBlanks') {
                                    return (
                                        <div className={styles.answer_item} key={item.id}>
                                            <div className={styles.answer_type}>{item.answer_type_text}</div>
                                            <div className={styles.answer_area}>
                                                <List renderHeader={() => `${item.id}.${item.answer_content_title}（分值：${item.score}分）`}>
                                                    {item.optionData.map(i => {
                                                        return (
                                                            <InputItem
                                                                key={i.value}
                                                                placeholder="请输入答案"
                                                                onChange={this.onFillInBlanksChange.bind(this, item.id)}
                                                            >{`填空${i.value + 1}：`}</InputItem>
                                                        )
                                                    })}
                                                </List>
                                            </div>
                                        </div>
                                    )
                                } else if (item.answer_type === 'Textarea') {
                                    return (
                                        <div className={styles.answer_item} key={item.id}>
                                            <div className={styles.answer_type}>{item.answer_type_text}</div>
                                            <div className={styles.answer_area}>
                                                <List renderHeader={() => `${item.id}.${item.answer_content_title}（分值：${item.score}分）`}>
                                                    <TextareaItem
                                                        placeholder='点击这里开始作答'
                                                        rows={6}
                                                        onChange={this.onTextareaChange.bind(this, item.id)}
                                                    />
                                                </List>
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                    <div className={styles.btn}>
                        {test_item_offset === 0
                            ? ''
                            : <div className={styles.btn_pre} onClick={this.onSwitchItem.bind(this, 'toPre')}>上一题</div>
                        }
                        <div className={styles.btn_next} onClick={test_item_offset === -(test_item.length - 1) * offsetWidth ? this.onSubmit : this.onSwitchItem.bind(this, 'toNext')}>{test_item_offset === -(test_item.length - 1) * offsetWidth ? '提交' : '下一题'}</div>
                    </div>
                    <div className={styles.sidebar_box} onClick={this.onOpenSidebarChange}>
                        <img src={icon.sidebar} />
                    </div>
                    <style>
                        {`
                            .am-modal-title {
                                font-size: 0.32rem;
                                font-family:'Microsoft YaHei';
                                font-weight:bold;
                                color:#333;
                            }
                        
                            .am-modal-transparent {
                                width: 6.1rem;
                            }

                            .am-modal-transparent .am-modal-content {
                                padding-top: 0.36rem;
                            }

                            .am-modal-transparent .am-modal-content .am-modal-body {
                                padding-bottom: 0.5rem;
                            }

                            .am-modal-button-group-h .am-modal-button {
                                height     : 0.8rem;
                                line-height: 0.8rem;
                                font-size  : 0.26rem;
                                font-family: 'Microsoft YaHei';
                                font-weight: 400;
                            }
                        `}
                    </style>
                </div>
                {/* <Drawer
                    style={{ minHeight: document.documentElement.clientHeight }}
                    enableDragHandle
                    contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                    sidebar={sidebar}
                    open={false}
                    onOpenChange={this.onOpenSidebarChange}
                >
                </Drawer> */}
                <Modal
                    visible={showLoadingModal}
                    transparent
                    maskClosable={false}
                    title="提示"
                >
                    <div className={styles.loading}>
                        <div className={styles.loading_text}>正在交卷</div>
                        <div className={styles.loading_img}>
                            <img className={styles.loading_img__icon} src={icon.loading} />
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default connect((state) => {
    return {}
})(questionnaireAnswer);
