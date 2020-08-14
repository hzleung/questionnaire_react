import React from 'react';
import { connect } from 'dva';
import { Header } from '@/components';
import { Modal } from 'antd-mobile';
import { Link } from 'umi';
import styles from "./index.less";

const icon = {
    'answer': require('../../../assets/images/questionnaire/intro/answer.png'),
    'question': require('../../../assets/images/questionnaire/intro/question.png'),
    'loading': require('../../../assets/images/questionnaire/answer/loading.png'),
}

class questionnaireIntro extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '职业能力测试',
            showLoadingModal: false, // 是否展示loading Modal
            isFinished: false,  // 该份答卷/问卷是否已经完成，若未完成，点击会跳到上次作答的地方
            last_step: 3,  // 针对中途交卷的，上一步完成到哪道题了
        };
    }

    // 跳转到答题页面
    handleToAnswerPage = () => {
        const { isFinished, last_step } = this.state;
        if (isFinished) {
            // this.showModal();
                this.props.history.push('./answer');
        } else {
            this.showModal();
            setTimeout(() => {
                this.props.history.push({
                    pathname: './answer',
                    query: {
                        step: last_step,
                    },
                });
            }, 2000)
        }
    }

    // loading处理
    showModal = () => {
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


    render() {
        const { title, questionnaire_data, showLoadingModal, isFinished, last_step } = this.state;
        return (
            <div className={styles.intro}>
                <Header title={title} hideHome className={styles.header} />
                <div className={styles.intro_box}>
                    <div className={styles.intro_box__bg}>
                        <img src={icon.answer} />
                    </div>
                    <div className={styles.intro_box__name}>职业能力测试</div>
                    <div className={styles.intro_box__desc}>
                        职业能力测试是用于测出被试者是否具备从事某类职业的能力，以及在多大程度上具备这样的能力。<br />
                        职业能力测试是用于测出被试者是否具备从事某类职业的能力，以及在多大程度上具备这样的能力。<br />
                        请同学们根据自己的实际情况进行选择，答案无对错之分。
                    </div>
                    <div className={styles.intro_box__btn} onClick={this.handleToAnswerPage}>进入答题</div>
                </div>
                <Modal
                    visible={showLoadingModal}
                    transparent
                    maskClosable={false}
                    title="提示"
                >
                    <div className={styles.loading}>
                        <div className={styles.loading_text}>上次作答到{last_step}题</div>
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
})(questionnaireIntro);
