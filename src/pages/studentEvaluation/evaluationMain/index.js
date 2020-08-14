import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import Link from 'umi/link';
import Header from '../Header/index';
const bg = require('../../../assets/images/studentSutffMobile/bg.png');
const arrow_black = require('../../../assets/images/studentSutffMobile/arrow_black.png');
const nodata = require('../../../assets/images/studentSutffMobile/nodata.png');

/**
 * @Description: 移动学工 - 学生端 - 综合测评 - 主页面
 * @author weishihuai
 * @date 2020/4/14 14:29
 */
class index extends React.Component {

	componentDidMount() {
		const { userId } = this.props;
		//查询当前参与的所有综测任务
		this.props.dispatch({
			type: 'studentEvaluation/getAllTaskByXh',
			payload: { xh: userId },
		});
	}

	//动态构造Component
	buildComponent = (item, isExistXszp, currentXh) => {
		let currentLinkInfo = item.currentLinkInfo || {};
		//(1).只有存在学生自评时: a. 学生自评未提交; b. 学生自评已提交且被回退时
		if (isExistXszp && (item.XSZPHJZTDM !== '3' || item.XSZPHJHTBJ === '1')) {     //可编辑表单页面
			return <Link to={{
				pathname: '/studentEvaluation/evaluation/index',
				query: {
					lcid: item.LCID,
					xsid: item.XSID,
					rwid: item.RWID,
				},
			}}>
				<div className={styles.item + ' ' + (item.CPJGZT === '1' ? styles.opacity : '')
				}>

					<div className={styles.content}>
						<div className={styles.title}>{item.BT || ''}</div>
						<div
							className={item.CPJGZT === '1' ? styles.grayTime : styles.time}>{item.MC || ''}</div>
						<div className={styles.stauts_01}>待测评</div>
					</div>
					<img src={arrow_black} alt=""/>
				</div>
			</Link>;
		} else if (item.CPJGZT !== '1') {       //测评未结束等待测评结果页面
			//(1). 测评结果表状态为未结束时
			return <Link to={{
				pathname: '/studentEvaluation/evaluationResult/index',
				query: {
					lcid: item.LCID,
					xsid: item.XSID,
					rwid: item.RWID,
				},
			}}>
				<div className={styles.item + ' ' + (item.CPJGZT === '1' ? styles.opacity : '')}>
					<div className={styles.content}>
						<div className={styles.title}>{item.BT || ''}</div>
						<div
							className={item.CPJGZT === '1' ? styles.grayTime : styles.time}>{item.MC || ''}</div>
						<div className={styles.stauts_01}>{currentLinkInfo.HJMC || ''}</div>
					</div>
					<img src={arrow_black} alt=""/>
				</div>
			</Link>;
		} else if (item.CPJGZT === '1') {       //查看测评结果页面
			// (1). 综合测评结果表状态已完成
			return <Link to={{
				pathname: '/studentEvaluation/evaluationResult/index',
				query: {
					lcid: item.LCID,
					xsid: item.XSID,
					rwid: item.RWID,
				},
			}}>
				<div className={styles.item}>
					<div className={styles.content}>
						{
							item.CPJGZT === '1' &&
							<div className={styles.mask}>

							</div>
						}
						<div className={styles.title}>{item.BT || ''}</div>
						<div
							className={item.CPJGZT === '1' ? styles.grayTime : styles.time}>{item.MC || ''}</div>
						<div className={styles.stauts_02}>已完成</div>
					</div>
					<img src={arrow_black} alt=""/>
				</div>
			</Link>;
		}
	};

	goBack = () => {
		history.back();
	};

	render() {
		const { taskList, userId } = this.props;
		return (
			<div>
				<Header title={'学生自评'} goBack={this.goBack}/>
				<img className={styles.bg} src={bg} alt=""/>
				<h1 className={styles.title}>综合测评</h1>
				<div className={styles.itemBox}>
					{
						(taskList && taskList.length > 0) ? taskList.map((item) => {
							let dycjList = item.dycjlList || [];
							let isExistXszp = dycjList.includes('student');
							return (
								<div>
									{this.buildComponent(item, isExistXszp, userId)}
								</div>
							);
						}) : <div className={styles.imgBox}>
							<img className={styles.nodata} src={nodata} alt=""/>
							<div>暂无综合测评数据</div>
						</div>
					}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { login, studentEvaluation } = state;
	return {
		userId: login.user ? login.user.userId : '',
		taskList: studentEvaluation.taskList,
	};
}

export default connect(mapStateToProps)(index);
