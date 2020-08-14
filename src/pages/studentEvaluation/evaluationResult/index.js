import React from 'react';
import styles from './index.less';
import { Badge, Tabs, WhiteSpace } from 'antd-mobile';
import Header from '../Header/index';
import { connect } from 'dva';
import extendStyles from '../evaluation/extend.less';
import { getTreeToList } from '../common/common';
import {Icon} from 'antd';

/**
 * @Description: 移动学工 - 学生端 - 学生自评结果查看
 * @author weishihuai
 * @date 2020/4/26 9:37
 */
class index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		const { query } = this.props.location;
		let rwid = query.rwid, lcid = query.lcid, xsid = query.xsid;
		let params = {};
		params['rwid'] = rwid;
		params['lcid'] = lcid;
		params['xsid'] = xsid;

		this.props.dispatch({
			type: 'studentEvaluation/getProcessLinkList',
			params: { lcid: lcid },
		});

		this.props.dispatch({
			type: 'studentEvaluation/getYdxgEvaluationResultInfo',
			params: params,
			callback: (data) => {
				if (data) {
					const { evaluationResultInfo = {} } = this.props;
					let cpxqxx = evaluationResultInfo.hjdfxq ? JSON.parse(evaluationResultInfo.hjdfxq.cpxqxx) : '',
						formDesignList = evaluationResultInfo.formDesignList || [];
					this.initFormData(cpxqxx);

					let newData = formDesignList;
					for (let item of formDesignList) {
						this.buildCpxqxx(item, cpxqxx);
					}
					let itemDataList = getTreeToList(newData);
					this.props.dispatch({
						type: 'studentEvaluation/changeResultFormDesignList',
						evaluationResultInfo: {
							...this.props.evaluationResultInfo,
							formDesignList: formDesignList,
							tableData: itemDataList,
							newData: newData,
						},
					});
				}
			},
		});
	}

	onTabChange = (tab, index) => {
		this.props.dispatch({
			type: 'studentEvaluation/changeInitialPage',
			initialPage: index,
		});
	};

	//递归构造测评详情信息
	buildCpxqxx = (item, cpxqxx) => {
		if (!item) {
			return;
		}
		let lxdm = item.lxdm;
		switch (lxdm) {
			case '1':
				Object.assign(item, { title_1: item.cpxmc, id_1: item.cpxid });
				break;
			case '2':
				Object.assign(item, { title_2: item.cpxmc, id_2: item.cpxid });
				break;
			case '3':
				Object.assign(item, { title_3: item.cpxmc, id_3: item.cpxid });
				if (item.pffsdm === '4') {
					//组装加分项信息
					let idx = cpxqxx.findIndex(value => {
						return value.cpxid === item.cpxid;
					});
					if (idx !== -1) {
						let gxxChildren = cpxqxx[idx]['gxxlist'];
						if (gxxChildren && gxxChildren.length > 0) {
							for (let i = 0; i <= gxxChildren.length - 1; i++) {
								let gxxItem = gxxChildren[i];
								Object.assign(gxxItem, { pxh: (i + 1) });
							}
						}
						item.children = gxxChildren;
					}
					Object.assign(item, { type: 'add' });
				}
				let idx = cpxqxx.findIndex(value => {
					return value.cpxid === item.cpxid;
				});
				if (idx !== -1) {
					if (item.pffsdm === '1') {
						Object.assign(item, { isChecked: cpxqxx[idx].isChecked });
					}
					//组装分数、备注信息
					Object.assign(item, { score: cpxqxx[idx].score, bzlist: cpxqxx[idx]['bzlist'] });
				}
				break;
			default:
				break;
		}

		if (item.pffsdm && item.pffsdm === '5') {
			let zbjkfsArr = this.props.zbjkfsArr || [];
			this.props.dispatch({
				type: 'studentEvaluation/getZbjkFs',
				params: { zbjk: item.zbjk },
				callback: (data) => {
					if (data) {
						let obj = {};
						obj[item.cpxid] = data;
						zbjkfsArr.push(obj);
					}
				},
			});
		}

		if (item.children && item.children.length > 0) {
			for (let child of item.children) {
				this.buildCpxqxx(child, cpxqxx);
			}
		}
	};

	//初始化FormData
	initFormData = (cpxqxx) => {
		let addedGxxList = [];
		for (let item of cpxqxx) {
			if (item.gxxlist) {
				let obj = {};
				obj['cpxid'] = item.cpxid;
				obj['gxxlist'] = item.gxxlist;
				addedGxxList.push(obj);
			}
		}
		this.props.dispatch({
			type: 'studentEvaluation/initFormData',
			formData: cpxqxx,
		});

		this.props.dispatch({
			type: 'studentEvaluation/changeAddedGxxList',
			addedGxxList: addedGxxList,
		});
	};

	//构建一级指标
	buildTabs = (formDesignList) => {
		let tabs = [];
		if (formDesignList && formDesignList.length > 0) {
			formDesignList.map((item, index) => {
				tabs.push({ title: <Badge key={index}>{item.cpxmc || ''}</Badge> });
			});
		}
		return tabs;
	};

	buildCpxFs = (cphjid = '', record, infoItem = {}) => {
		let score = record.score || [];
		let fs = null;
		if (score && score.length > 0) {
			let idx = score.findIndex(value => value.hjid === cphjid);
			if (idx !== -1) {
				if (record.pffsdm === '4') {
					let checkArr = infoItem.isChecked || [];
					let idx1 = checkArr.findIndex(value => value.hjid === cphjid);
					if (idx1 !== -1) {
						let checkObj = checkArr[idx1];
						if (checkObj.checked) {
							fs = checkObj['score'] || null;
						}
					}
				} else {
					let scoreObj = score[idx];
					fs = scoreObj['score'];
				}
			}
		}
		return fs;
	};

	//组装各个环节分数
	buildProcessLinkScore = (record, infoItem = {}) => {
		const { processLinkList = [] } = this.props;
		if (processLinkList.length <= 0) {
			return null;
		}
		let scoreDom = [];
		//循环流程对应的所有环节，组装对应的分数
		for (let item of processLinkList) {
			let hjmc = item.HJMC || '';
			if (hjmc.length > 6) {
				hjmc = hjmc.substr(0, 6) + '...';
			}
			let linkScore = this.buildCpxFs(item.CPHJID, record, infoItem);
			let dom = linkScore != null ? <div>
				<div>{hjmc}</div>
				<div>{linkScore > 0 ? '+' : ''}<span
					style={{ color: linkScore <= 0 ? '#ff4d4f' : '' }}>{linkScore}</span>{linkScore ? '分' : ''}</div>
			</div> : <div>
				<div>{hjmc}</div>
				<div>{''}</div>
			</div>;
			scoreDom.push(dom);
		}
		return scoreDom;
	};

	buildDynamicColumn = (record) => {
		switch (record.pffsdm) {
			case '1':  //固定分值
			case '2':  //分数段
			case '3':  //分数不限制
			case '5':  //指标接口
				return (<div>
					<div className={styles.content}>{record.cpxmc || ''}</div>
					<div className={styles.gradeDetialBox}>
						{this.buildProcessLinkScore(record)}
					</div>
					<div className={extendStyles.scale}/>
				</div>);
			case '4':
				return (<div>
					<div className={styles.extend}>
						<div className={styles.title}>{record.cpxmc || ''}</div>
						{(record.children && record.children.length > 0) ? record.children.map((infoItem) => {
							return (
								<div>
									<div className={styles.extendBox}>
										<div>
											<div>奖项名称</div>
											<div>{infoItem.title_4}</div>
										</div>
										<div>
											<div>获奖情况</div>
											<div>{infoItem.grade || ''}</div>
										</div>
										<div>
											<div>加分情况</div>
											<div>{infoItem.fs >= 0 ? '+' : ''}{infoItem.fs}分</div>
										</div>
										<div>
											<div>备 &nbsp; &nbsp; &nbsp; &nbsp;注</div>
											<div
												className={styles.long}>{infoItem.bz || ''}</div>
										</div>
										{infoItem.file && infoItem.file.length > 0 && infoItem.file.map((fileItem) => {
											return (
												<div>
													<div>附 &nbsp; &nbsp; &nbsp;&nbsp; 件</div>
													<div
														className={styles.enclosure}>{fileItem.name ? (fileItem.name.length > 20 ? fileItem.name.substr(0, 20) + '...' : fileItem.name) : ''}
														<Icon
															type="download"
															className="download"
															onClick={() => {
																window.open(`zuul/docrepo/download/file?attachmentId=${fileItem.id}`);
															}}
														/></div>
												</div>
											);
										})}
										<WhiteSpace size="sm"/>
										{this.buildProcessLinkScore(record, infoItem)}
									</div>
								</div>
							);
						}) : <div>
							<div className={styles.extendBox}>
								{this.buildProcessLinkScore(record)}
							</div>
						</div>}
					</div>
					<div className={extendStyles.scale}/>
				</div>);
			default:
				return null;
		}
	};

	goBack = () => {
		history.back();
		this.props.dispatch({
			type: 'studentEvaluation/changeResultFormDesignList',
			evaluationResultInfo: {},
		});
		this.props.dispatch({
			type: 'studentEvaluation/changeInitialPage',
			initialPage: 0,
		});
	};

	render() {
		const { evaluationResultInfo = {}, initialPage } = this.props;
		let formDesignList = evaluationResultInfo.formDesignList || [],
			rwMapInfo = evaluationResultInfo.rwMapInfo || {}, cpjgzt = evaluationResultInfo.cpjgzt || '',
			scoreMap = evaluationResultInfo.scoreMap || {};
		let deviation = ((+initialPage) *
			(document.body.clientWidth * 0.92 * 0.25) /
			(formDesignList.length - 4)) /
			(formDesignList.length - 1);
		let tabs = this.buildTabs(formDesignList);

		return (
			<div style={{ background: 'rgba(242,244,247,1)', padding: '12px 15px' }}>
				<Header title={'学生自评'} goBack={this.goBack}/>
				{/* 覆盖antd的样式 */}
				<style jsx="true" global="true">
					{`
			.am-tabs-default-bar-top .am-tabs-default-bar-tab {
				border-bottom: 1PX solid #ddd;
    			border: none;
			}

            .am-tabs-default-bar-tab {
              height:61px;
              line-height: 61px;
            }

            .am-tabs-default-bar-underline{
              width: 40px !important;
              height: 3px !important;
              left: 0 !important;
              background-color: #108ee9;
              border: none !important;
              opacity: 0;
            }
            .am-tabs-default-bar-tab{
              width:25% !important;
              position: relative;
              font-size: 16px;
              font-weight:500;
              color:rgba(153,153,153,1);
              background:rgba(242,244,247,1) !important;
            }
            .am-tabs-default-bar-tab-active{
              font-size: 20px !important;
              color: rgba(26,26,26,1) !important;
            }
            .am-icon-minus am-icon-xxs{
              color: rgba(73, 161, 242, 1) !important;
            }
            .am-stepper-handler-down{
              background:rgba(241,246,250,1) !important;
              border-radius:5px !important;
            }
            .am-stepper-handler-up{
              background:rgba(241,246,250,1) !important;
              border-radius:5px !important;
            }
            .am-stepper-handler{
              color: #1890FF;
            }
            .am-tabs-default-bar-content{
              transform: translate3d(-` + deviation + `px, 0px, 0px);
              background: rgb(242, 244, 247);

             }
             .am-badge{
             	 white-space: nowrap !important;
             }
        `}
				</style>
				{cpjgzt === '1' ? <div className={styles.titleBox}>
					<div className={styles.title}>
						{rwMapInfo.MC || ''}
					</div>
					<div className={styles.titleInfo}>
						{(rwMapInfo.BT && rwMapInfo.BT.length > 19) ? rwMapInfo.BT.substring(0, 19) + '...' : (rwMapInfo.BT || '')}
					</div>
					<div className={styles.whiteSpace}/>
					<div className={styles.gradeGroup}>
						<div className={styles.gradeBox}>
							<div className={styles.Gtitle}>综测成绩</div>
							<div className={styles.Gvalue}>{scoreMap.YXFS ? scoreMap.YXFS.toFixed(2) : ''}</div>
						</div>
						<div className={styles.gradeBox}>
							<div className={styles.Gtitle}>班级排名</div>
							<div className={styles.Gvalue}>{scoreMap.BJPM || '0'}/{scoreMap.BJZRS || '0'}</div>
						</div>
						<div className={styles.gradeBox}>
							<div className={styles.Gtitle}>专业排名</div>
							<div className={styles.Gvalue}>{scoreMap.ZYPM || '0'}/{scoreMap.ZYZRS || '0'}</div>
						</div>
						<div className={styles.gradeBox}>
							<div className={styles.Gtitle}>学院排名</div>
							<div className={styles.Gvalue}>{scoreMap.XYPM || '0'}/{scoreMap.BMZRS || '0'}</div>
						</div>
					</div>
				</div> : <div className={styles.titleBox} style={{ height: '120px' }}>
					<div className={styles.title}>
						{rwMapInfo.MC || ''}
					</div>
					<div className={styles.titleInfo}>
						{(rwMapInfo.BT && rwMapInfo.BT.length > 19) ? rwMapInfo.BT.substring(0, 19) + '...' : (rwMapInfo.BT || '')}
					</div>
					<div className={styles.whiteSpace}/>
				</div>
				}

				<div className={styles.contentBox}>
					{
						<Tabs tabs={tabs}
							  initialPage={0}
							  onChange={(tab, index) => this.onTabChange(tab, index)}
							  page={initialPage}>
							{formDesignList && formDesignList.length > 0 && formDesignList.map((infoItem, infoIndex) => {
								return (
									<div className={styles.itemsBox} style={{}}>
										{infoItem && infoItem.children && infoItem.children.length > 0 && infoItem.children.map((items, infoItemIndex) => {
											return (
												<div>

													<div className={styles.grade}>
														<div className={styles.title}>{items.cpxmc || ''}</div>
														{
															items.children && items.children.length > 0 && items.children.map((item, index) => {
																return this.buildDynamicColumn(item);
															})
														}
													</div>
												</div>
											);
										})
										}
									</div>
								);
							})
							}
						</Tabs>
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
		evaluationResultInfo: studentEvaluation.evaluationResultInfo || {},
		formData: studentEvaluation.formData || [],
		zbjkfsArr: studentEvaluation.zbjkfsArr || [],
		addedGxxList: studentEvaluation.addedGxxList || [],
		initialPage: studentEvaluation.initialPage || 0,
		processLinkList: studentEvaluation.processLinkList || [],
	};
}

export default connect(mapStateToProps)(index);

