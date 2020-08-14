import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Badge, List, Modal, Stepper, Tabs, Toast } from 'antd-mobile';
import { Icon, Switch } from 'antd';
import extendStyles from './extend.less';
import EvaluationItemAddOrEditForm from '../evaluationItemAddOrEditForm/index';
import createHashHistory from 'history/createHashHistory';
import Header from '../Header/index';
import { getTreeToList } from '../common/common';

const hashHistory = createHashHistory();

const addImg = require('../../../assets/images/studentSutffMobile/add.png');
const editImg = require('../../../assets/images/studentSutffMobile/edit.png');
const deleteImg = require('../../../assets/images/studentSutffMobile/delete.png');

const alert = Modal.alert;

/**
 * @Description: 移动迎新 - 学生端 - 综合测评 - 测评页面
 * @author weishihuai
 * @date 2020/4/15 9:31
 */
class index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			noShowCpx: [],
		};
	}

	componentDidMount() {
		const { query } = this.props.location;
		let rwid = query.rwid, lcid = query.lcid, xsid = query.xsid;
		let params = {};
		params['rwid'] = rwid;
		params['lcid'] = lcid;
		params['xsid'] = xsid;
		params['dycj'] = 'student';

		//查询测评表单信息
		this.props.dispatch({
			type: 'studentEvaluation/getEvaluationInfo',
			params: params,
			callback: (data) => {
				if (data) {
					//存在自评详情信息，则初始化表单
					if (data.xszpHjztdm) {
						this.initFormData(data.hjdfxq ? data.hjdfxq : '');
					}

					let formDesignList = data.formDesignList || [];
					//查看学生自评环节状态代码
					if (!data.xszpHjztdm) {
						let newData = formDesignList;
						for (let item of formDesignList) {
							this.buildBz(item);
						}
						let itemDataList = getTreeToList(newData);

						//过滤不显示的测评项
						for (let item of formDesignList) {
							this.filterFormDesignList(item, formDesignList, formDesignList);
						}

						//更新state里面的测评项
						this.props.dispatch({
							type: 'studentEvaluation/changeFormDesignList',
							evaluationInfo: {
								...this.props.evaluationInfo,
								formDesignList: formDesignList,
								tableData: itemDataList.filter(item => !(item.lxdm === '3' && item.radio === '01')),
								newData: newData,
							},
						});
					} else {
						const { cpxqxx } = this.props;
						let newData = formDesignList;
						for (let item of formDesignList) {
							this.buildCpxqxx(item, cpxqxx);
						}
						let itemDataList = getTreeToList(newData);

						//过滤不显示的测评项
						for (let item of formDesignList) {
							this.filterFormDesignList(item, formDesignList, formDesignList);
						}

						this.props.dispatch({
							type: 'studentEvaluation/changeFormDesignList',
							evaluationInfo: {
								...this.props.evaluationInfo,
								formDesignList: formDesignList,
								tableData: itemDataList.filter(item => !(item.lxdm === '3' && item.radio === '01')),
								newData: newData,
							},
						});
					}
				}
			},
		});
	}

	componentWillUnmount() {
		this.props.dispatch({
			type: 'studentEvaluation/changeInitialPage',
			initialPage: 0,
		});
		this.props.dispatch({
			type: 'studentEvaluation/changeFormDesignList',
			evaluationInfo: {},
		});
		this.props.dispatch({
			type: 'studentEvaluation/changeAddedGxxList',
			addedGxxList: [],
		});
		this.props.dispatch({
			type: 'studentEvaluation/initFormData',
			formData: '',
		});
		this.props.dispatch({
			type: 'studentEvaluation/changeAddedRemarkList',
			addedRemarkList: [],
		});
	}

	onCloseListener = key => () => {
		this.props.dispatch({
			type: 'studentEvaluation/changeCurrentGxxInfo',
			currentGxxInfo: {
				currentRecord: {}, gxxAddFlag: false, gxxEditFlag: false,
			},
		});

		this.props.dispatch({
			type: 'studentEvaluation/changeHookOptionDetail',
			hookOptionDetail: {},
		});
	};

	//过滤不显示的测评项
	filterFormDesignList = (item = {}, children = [], formDesignList = []) => {
		if (!item) {
			return;
		}

		if (item.lxdm === '3' && item.radio === '01') {
			if (children && children.length > 0) {
				let idx = children.findIndex(val => {
					return val.cpxid === item.cpxid;
				});
				if (idx !== -1) {
					const { noShowCpx = [] } = this.state;
					noShowCpx.push(item.cpxid);
					this.setState({
						noShowCpx,
					});
				}
			}
		}

		if (item.children && item.children.length > 0) {
			for (let child of item.children) {
				this.filterFormDesignList(child, item.children, formDesignList);
			}
		}
	};

	//递归构造测评详情信息
	buildCpxqxx = (item, cpxqxx) => {
		if (!item) {
			return;
		}
		let lxdm = item.lxdm;
		switch (lxdm) {
			case '1' :
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
							for (let i = 0; i < gxxChildren.length; i++) {
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
						// this.props.dispatch({
						// 	type: 'studentEvaluation/changezbjkfsArr',
						// 	zbjkfsArr:zbjkfsArr
						// });
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
	initFormData = (data) => {
		if (!data) {
			return;
		}
		let cpxqxx = JSON.parse(data.cpxqxx);
		let addedGxxList = [], addedRemarkList = [];
		for (let item of cpxqxx) {
			if (item.gxxlist) {
				let obj = {};
				obj['cpxid'] = item.cpxid;
				obj['gxxlist'] = item.gxxlist;
				addedGxxList.push(obj);
			}
			if (item.bzlist) {
				let obj = {};
				obj['cpxid'] = item.cpxid;
				obj['bzlist'] = item.bzlist;
				addedRemarkList.push(obj);
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

		this.props.dispatch({
			type: 'studentEvaluation/changeAddedRemarkList',
			addedRemarkList: addedRemarkList,
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

	// 新增加分项
	addGxx = (record) => {
		const { addedGxxList = [] } = this.props;
		let cpxid = record.cpxid, sfdx = record.sfdx, gxxList = [];
		let idx = addedGxxList.findIndex(value => {
			return value.cpxid === cpxid;
		});
		if (idx !== -1) {
			gxxList = addedGxxList[idx].gxxlist || [];
		}

		//限制加分项是否单选
		if (sfdx === '1' && gxxList.length >= 1) {
			Toast.fail('抱歉，只能添加一个加分项！', 1);
			return;
		}
		this.props.dispatch({
			type: 'studentEvaluation/changeCurrentGxxInfo',
			currentGxxInfo: {
				currentRecord: record, gxxAddFlag: true,
			},
		});
	};

	//组装测评项分数
	buildCpxFs = (score = [], record) => {
		let fs = '';
		const { currentHjId } = this.props;

		if (score && score.length > 0) {
			let idx = score.findIndex(value => {
				return value.hjid === currentHjId;
			});
			if (idx !== -1) {
				let scoreObj = score[idx];
				fs = scoreObj['score'];
			}
		}
		if (record.pffsdm === '2' || record.pffsdm === '3') {
			return fs ? fs > 0 ? fs : -fs : null;
		}
		return fs;
	};

	// 编辑加分项
	editGxx = (record, infoItem) => {
		this.props.dispatch({
			type: 'studentEvaluation/changeCurrentGxxInfo',
			currentGxxInfo: {
				currentRecord: record, gxxEditFlag: true, infoItem: infoItem,
			},
		});
	};

	//根据类型动态构建需要展示的控件
	buildDynamicColumn = (record) => {
		switch (record.pffsdm) {
			case '1':  //固定分值
				return record.radio === '03' ?
					<div>
						<div className={styles.switchItemBox}>
							<div className={styles.switchItem}>
								<div className={styles.title}>{record.cpxmc || ''}</div>
								<div className={styles.switch}>
									<div className={styles.hint} style={{ color: '#999999' }}>（固定分值）勾选表示认可该测评项
										({record.cpxlbdm === '1' ? '+' : '-'}{record.gdfz}分)
									</div>
									<Switch defaultChecked={record.isChecked === '1'}
											onChange={(e) => this.onGdfzSwitchChange(e, record)}/>
								</div>
							</div>
						</div>
						<div className={extendStyles.scale}/>
					</div>
					: null;
			case '2':  //分数段打分
				let tip = record.cpxlbdm === '1' ? '加分项' : '减分项';
				return record.radio === '03' ?
					<div>
						<div>
							<style jsx="true" global="true">
								{`
                        .am-icon-minus am-icon-xxs{
                        color: rgba(73, 161, 242, 1) !important;
                        }
                        .am-stepper-handler-down{
                        background:rgba(241,246,250,1) !important;
                        border:1px solid rgba(202,213,221,1) !important;
                        border-radius:5px !important;
                        }
                        .am-stepper-handler-up{
                        background:rgba(241,246,250,1) !important;
                        border:1px solid rgba(202,213,221,1) !important;
                        border-radius:5px !important;
                        }
                        .am-stepper-handler{
                        color: #1890FF;
                        }
                    `}
							</style>
							<div className={styles.item}>
								<div className={styles.content}>{record.cpxmc || ''}</div>
								<div className={styles.info}>
									<div className={styles.hint}>{`分数段打分（${record.zdfz}-${record.zgfz}分）（${tip}）`}</div>
									<div>
										<Stepper style={{ width: '100%', minWidth: '100px' }}
												 showNumber={true}
												 max={record.zgfz}
												 min={record.zdfz}
												 defaultValue={this.buildCpxFs(record.score, record)}
												 onChange={(value) => this.onInputNumberChange(value, record)}/>
									</div>
								</div>

							</div>
						</div>
						<div className={extendStyles.scale}/>
					</div> : null;
			case '3': //分数不限
				return record.radio === '03' ?
					<div>
						<div>
							<style jsx="true" global="true">
								{`
                        .am-icon-minus am-icon-xxs{
                        color: rgba(73, 161, 242, 1) !important;
                        }
                        .am-stepper-handler-down{
                        background:rgba(241,246,250,1) !important;
                        border:1px solid rgba(202,213,221,1) !important;
                        border-radius:5px !important;
                        }
                        .am-stepper-handler-up{
                        background:rgba(241,246,250,1) !important;
                        border:1px solid rgba(202,213,221,1) !important;
                        border-radius:5px !important;
                        }
                        .am-stepper-handler{
                        color: #1890FF;
                        }
                    `}
							</style>
							<div className={styles.item}>
								<div className={styles.content}>{record.cpxmc || ''}</div>
								<div className={styles.info}>
									<div
										className={styles.hint}>{`分数不限（${record.cpxlbdm === '1' ? '加分项' : '减分项'}）`}</div>
									<div>
										<Stepper
											style={{ width: '100%', minWidth: '100px' }}
											showNumber={true}
											defaultValue={this.buildCpxFs(record.score, record)}
											onChange={(value) => this.onInputNumberChange(value, record)}/>
									</div>
								</div>
							</div>
						</div>
						<div className={extendStyles.scale}/>
					</div> : null;
			case '4':
				return record.radio === '03' ? <div>
					<div>
						<div className={extendStyles.title}>
							{record.cpxmc || ''}
						</div>
						<div className={extendStyles.itemBoxExt}>
							{record.children && record.children.length > 0 && record.children.map((infoItem) => {
								let inputDom =
									<div className={extendStyles.inputStashGroup}>
										<div className={extendStyles.inputStashBox}>
											<div className={extendStyles.extendBox}>
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
													<div className={extendStyles.long}>{infoItem.bz || ''}</div>
												</div>
												{infoItem.file && infoItem.file.length > 0 && infoItem.file.map((fileItem) => {
													return (
														<div>
															<div>附 &nbsp; &nbsp; &nbsp; &nbsp;件</div>
															<div
																className={extendStyles.long}
																style={{}}>{fileItem.name ? (fileItem.name.length > 20 ? fileItem.name.substr(0, 20) + '...' : fileItem.name) : ''}
																<Icon
																	type="download"
																	className="download"
																	onClick={() => {
																		window.open(`zuul/docrepo/download/file?attachmentId=${fileItem.id}`);
																	}}
																/>
															</div>
														</div>
													);
												})
												}
											</div>
											<div className={extendStyles.scale_1}/>
											<div className={extendStyles.bottonBox}>
												<div className={extendStyles.edit}
													 onClick={() => this.editGxx(record, infoItem)}>
													<img src={editImg} alt=""/>
													<div>编辑</div>
												</div>
												<div className={extendStyles.scale_2}/>
												<div className={extendStyles.delete}
													 onClick={() => this.deleteJfxAlertListener(record, infoItem)}>
													<img src={deleteImg} alt=""/>
													<div>删除</div>
												</div>
											</div>
										</div>
									</div>;
								return (
									<div className={extendStyles.item}>
										{inputDom}
									</div>
								);
							})
							}
						</div>
						<div className={extendStyles.botton} onClick={() => this.addGxx(record)}>
							<img src={addImg} alt=""/>
							添加
						</div>
					</div>
					<div className={extendStyles.scale}/>
				</div> : null;
			case '5':
				return record.radio !== '01' ?
					<div>
						<div className={styles.switchItemBox}>
							<div className={styles.switchItem}>
								<div className={styles.title}
									 style={{ color: '#999999', fontSize: '0.3rem' }}>{record.cpxmc || ''}</div>
								<div className={styles.switch}>
									<div className={styles.hint}>
										{record.zbjkfs > 0 ? '+' : ''}{record.zbjkfs}分
									</div>
								</div>
							</div>
						</div>
						<div className={extendStyles.scale}/>
					</div> : null;
			default:
				return null;
		}
	};

	//固定分值onChange
	onGdfzSwitchChange = (isChecked, record) => {
		const { formData = [] } = this.props;
		const { currentHjId } = this.props;
		let cpxid = record.cpxid, gdfz = record.gdfz, cpxlbdm = record.cpxlbdm;
		let itemIdx = formData.findIndex(value => {
			return value.cpxid === cpxid;
		});

		//是否加分 1-加分 0-扣分
		let isAddScore = cpxlbdm === '1' ? '1' : '0';
		if (itemIdx === -1) {  //表单数据不存在该测评分数
			let itemObj = {};
			itemObj['cpxid'] = cpxid;
			let itemFsObj = {}, itemFsArr = [];
			itemFsObj['hjid'] = currentHjId;
			itemFsObj['score'] = isChecked ? (cpxlbdm === '1' ? gdfz : -gdfz) : 0;
			itemFsArr.push(itemFsObj);
			itemObj['score'] = itemFsArr;
			itemObj['isChecked'] = isChecked ? '1' : '0';
			itemObj['isAddScore'] = isAddScore;
			formData.push(itemObj);
		} else {  //表单数据存在该测评分数
			let itemObj = formData[itemIdx];
			let fsArr = itemObj['score'];
			let fsObjIdx = fsArr.findIndex(val => {
				return val.hjid === currentHjId;
			});
			if (fsObjIdx === -1) {
				let itemObj = {};
				itemObj['hjid'] = currentHjId;
				itemObj['score'] = isChecked ? (cpxlbdm === '1' ? gdfz : -gdfz) : 0;
				fsArr.push(itemObj);
			} else {
				let itemObj = fsArr[fsObjIdx];
				itemObj.score = isChecked ? (cpxlbdm === '1' ? gdfz : -gdfz) : 0;
			}
			itemObj['cpxid'] = cpxid;
			itemObj['isChecked'] = isChecked ? '1' : '0';
			itemObj['isAddScore'] = isAddScore;
		}
		this.props.dispatch({
			type: 'studentEvaluation/initFormData',
			formData: formData,
		});
	};

	//输入框onChange事件
	onInputNumberChange = (value, record) => {
		this.setState({ val: value });
		const { currentHjId, formData = [] } = this.props;
		let cpxid = record.cpxid, cpxlbdm = record.cpxlbdm;
		let isAddScore = cpxlbdm === '1' ? '1' : '0';
		let itemIdx = formData.findIndex(value => {
			return value.cpxid === cpxid;
		});
		if (itemIdx === -1) { //表单数据不存在该测评分数
			let itemObj = {};
			itemObj['cpxid'] = cpxid;
			let itemFsObj = {}, itemFsArr = [];
			itemFsObj['hjid'] = currentHjId;
			itemFsObj['score'] = cpxlbdm === '1' ? (value > 0 ? value : -value) : (value > 0 ? -value : value);
			itemFsArr.push(itemFsObj);
			itemObj['score'] = itemFsArr;
			itemObj['isAddScore'] = isAddScore;
			formData.push(itemObj);
		} else {  //表单数据存在该测评分数
			let itemObj = formData[itemIdx];
			itemObj['cpxid'] = cpxid;
			let fsArr = itemObj['score'] || [];
			let fsObjIdx = fsArr.findIndex(val => {
				return val.hjid === currentHjId;
			});
			if (fsObjIdx === -1) {
				let itemObj = {};
				itemObj['hjid'] = currentHjId;
				itemObj['score'] = cpxlbdm === '1' ? (value > 0 ? value : -value) : (value > 0 ? -value : value);
				fsArr.push(itemObj);
			} else {
				let itemObj = fsArr[fsObjIdx];
				itemObj.score = cpxlbdm === '1' ? (value > 0 ? value : -value) : (value > 0 ? -value : value);
			}
			itemObj['isAddScore'] = isAddScore;
		}
		this.props.dispatch({
			type: 'studentEvaluation/initFormData',
			formData: formData,
		});
	};

	buildLxdm = (item) => {
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
					Object.assign(item, { type: 'add' });
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
						// this.props.dispatch({
						// 	type: 'studentEvaluation/changezbjkfsArr',
						// 	zbjkfsArr:zbjkfsArr
						// });
					}
				},
			});
		}
	};

	buildBz = (item) => {
		if (!item) {
			return;
		}
		this.buildLxdm(item);
		if (item.children && item.children.length > 0) {
			for (let child of item.children) {
				this.buildBz(child);
			}
		}
	};

	//递归构造指标接口分数
	buildZbjkFs = (item) => {
		const { zbjkfsArr } = this.props;
		if (!item) {
			return;
		}
		if (item.pffsdm && item.pffsdm === '5') {
			if (zbjkfsArr && zbjkfsArr.length > 0) {
				for (let data of zbjkfsArr) {
					if (Object.keys(data).findIndex((value) => {
						return value === item.cpxid;
					}) !== -1) {
						Object.assign(item, { zbjkfs: parseFloat(data[item.cpxid]) });
					}
				}
			}
		}

		if (item.children && item.children.length > 0) {
			for (let child of item.children) {
				this.buildZbjkFs(child);
			}
		}
	};

	//构造表单需要提交的数据
	buildFormData = () => {
		const { currentHjId, formData = [], evaluationInfo, addedGxxList = [], addedRemarkList = [] } = this.props;
		let tableData = evaluationInfo.tableData || [];
		for (let item of tableData) {
			this.buildZbjkFs(item);
		}
		//过滤所有具体的测评项
		let itemList = tableData.filter(item => item.lxdm === '3');
		let tempList = [];

		//遍历找出学生未填写的测评项
		for (let item of itemList) {
			let idx = formData.findIndex(value => {
				return value.cpxid === item.cpxid;
			});
			if (idx === -1 && !item.gxxpkid) {
				tempList.push(item);
			}
		}

		//初始化未填写测评项表单数据
		for (let item of tempList) {
			let isAddScore = item.cpxlbdm === '1' ? '1' : '0';
			switch (item.pffsdm) {
				case '1': //固定分值
					let gdfzObj = {};
					gdfzObj['cpxid'] = item.cpxid;
					let gdfzFsObj = {}, gdfzFsArr = [];
					gdfzFsObj['hjid'] = currentHjId;
					gdfzFsObj['score'] = 0;
					gdfzFsArr.push(gdfzFsObj);
					gdfzObj['score'] = gdfzFsArr;
					gdfzObj['isChecked'] = '0';
					gdfzObj['isAddScore'] = isAddScore;
					formData.push(gdfzObj);
					break;
				case '2': //分数段打分
				case '3': //分数不限制
					let itemObj = {};
					itemObj['cpxid'] = item.cpxid;
					let itemFsObj = {}, itemFsArr = [];
					itemFsObj['hjid'] = currentHjId;
					let fs = 0;
					if (item.zyjcfx) {
						fs = item.zyjcfs;
					} else if (item.dyjcfx) {
						fs = item.dyjcfs;
					} else if (item.tyjcfx) {
						fs = item.tyjcfs;
					} else if (item.bnhpx) {
						fs = item.bnhpfs;
					}
					itemFsObj['score'] = fs;
					itemFsArr.push(itemFsObj);
					itemObj['score'] = itemFsArr;
					itemObj['isAddScore'] = isAddScore;
					formData.push(itemObj);
					break;
				case '4': //勾选项
					let gxxObj = {};
					gxxObj['cpxid'] = item.cpxid;
					let gxxFsObj = {}, gxxFsArr = [];
					gxxFsObj['hjid'] = currentHjId;
					gxxFsObj['score'] = 0;
					gxxFsArr.push(gxxFsObj);
					gxxObj['score'] = gxxFsArr;
					gxxObj['isAddScore'] = isAddScore;
					gxxObj['gxxlist'] = [];
					formData.push(gxxObj);
					break;
				case '5': //指标接口
					let zbjkObj = {};
					zbjkObj['cpxid'] = item.cpxid;
					let zbjkFsObj = {}, zbjkFsArr = [];
					zbjkFsObj['hjid'] = currentHjId;
					zbjkFsObj['score'] = item.zbjkfs;
					zbjkFsArr.push(zbjkFsObj);
					zbjkObj['score'] = zbjkFsArr;
					zbjkObj['isAddScore'] = isAddScore;
					formData.push(zbjkObj);
					break;
				default:
					break;
			}
		}

		//组装加分项到表单数据
		for (let data of formData) {
			let idx = addedGxxList.findIndex(value => {
				return value.cpxid === data.cpxid;
			}), gxxList = [];
			if (idx !== -1) {
				gxxList = addedGxxList[idx].gxxlist || [];
				let totalScore = 0;
				for (let gxx of gxxList) {
					totalScore += gxx['fs'];
				}
				data['gxxlist'] = gxxList;
				let fsArr = [], fsObj = {};
				fsObj['hjid'] = currentHjId;
				fsObj['score'] = totalScore;
				fsArr.push(fsObj);
				data['score'] = fsArr;
			}

			//组装备注信息到FormData中
			let bzIdx = addedRemarkList.findIndex(value => {
				return value.cpxid === data.cpxid;
			}), bzList = [];
			//如果该测评项存在备注信息，则组装
			if (bzIdx !== -1) {
				bzList = addedRemarkList[bzIdx].bzlist || [];
				data['bzlist'] = bzList;
			}
		}
		return formData;
	};

	//保存学生自评表单数据
	saveStudentEvaluationFormData = () => {
		const { currentHjId, currentTaskId, currentLcid, currentXsid } = this.props;
		//表单详情JSON信息
		let formData = this.buildFormData();

		if (formData && formData.length <= 0) {
			Toast.fail('抱歉，请先完善测评表单信息！', 1);
			return;
		}

		//表单详情
		let cpxqxx = JSON.stringify(formData);
		let params = {
			xsid: currentXsid,
			hjid: currentHjId,
			rwid: currentTaskId,
			lcid: currentLcid,
			cpxqxx: cpxqxx,
			type: '1',
		};

		// 保存操作
		this.handleSaveOrSubmit(params, data => {
			if (data === 1) {
				Toast.success('保存成功！', 1, () => {
					hashHistory.push({
						pathname: '/studentEvaluation/evaluationMain/index',
					});
					this.props.dispatch({
						type: 'studentEvaluation/changeInitialPage',
						initialPage: 0,
					});
					this.props.dispatch({
						type: 'studentEvaluation/changeFormDesignList',
						evaluationInfo: {},
					});
					this.props.dispatch({
						type: 'studentEvaluation/changeAddedGxxList',
						addedGxxList: [],
					});
					this.props.dispatch({
						type: 'studentEvaluation/initFormData',
						formData: '',
					});
					this.props.dispatch({
						type: 'studentEvaluation/changeAddedRemarkList',
						addedRemarkList: [],
					});
				});
			}
		});
	};

	//保存环节打分详情信息、各环节测评情况等
	handleSaveOrSubmit = (params, callback) => {
		if (!params) {
			Toast.fail('服务器异常，请稍后重试！');
			return;
		}

		this.props.dispatch({
			type: 'studentEvaluation/insertLinkScoreDetail',
			params: params,
			callback: data => {
				if (data) {
					if (callback && typeof callback === 'function') {
						callback(data);
					}
				}
			},
		});
	};

	//组装下一个环节的测评表单详情信息
	buildNextHjCpxqxx = (hjid, formData, data = []) => {
		const { currentHjId } = this.props;
		//1. 获取当前环节以及下一个环节的测评项并集
		let cpxArr = formData.concat(data) || [];
		//2. 去掉重复的测评项
		let cpxArray = [];
		for (let cpxObj of cpxArr) {
			let cpxid = cpxObj.cpxid;
			if (cpxArray.findIndex(item => item.cpxid === cpxid) === -1) {
				cpxArray.push(cpxObj);
			}
		}

		for (let i = 0; i <= cpxArray.length - 1; i++) {
			let item = cpxArray[i];
			if (!item.isAddScore) {
				let isAddScore = item.cpxlbdm === '1' ? '1' : '0';
				switch (item.pffsdm) {
					case '1': //固定分值
						let gdfzObj = {};
						gdfzObj['cpxid'] = item.cpxid;
						let gdfzFsObj = {}, gdfzFsArr = [];
						gdfzFsObj['hjid'] = currentHjId;
						gdfzFsObj['score'] = 0;
						gdfzFsArr.push(gdfzFsObj);
						gdfzObj['score'] = gdfzFsArr;
						gdfzObj['isChecked'] = '0';
						gdfzObj['isAddScore'] = isAddScore;
						cpxArray.push(gdfzObj);
						break;
					case '2': //分数段打分
					case '3': //分数不限制
						let itemObj = {};
						itemObj['cpxid'] = item.cpxid;
						let itemFsObj = {}, itemFsArr = [];
						itemFsObj['hjid'] = currentHjId;
						itemFsObj['score'] = 0;
						itemFsArr.push(itemFsObj);
						itemObj['score'] = itemFsArr;
						itemObj['isAddScore'] = isAddScore;
						cpxArray.push(itemObj);
						break;
					case '4': //勾选项
						let gxxObj = {};
						gxxObj['cpxid'] = item.cpxid;
						let gxxFsObj = {}, gxxFsArr = [];
						gxxFsObj['hjid'] = currentHjId;
						gxxFsObj['score'] = 0;
						gxxFsArr.push(gxxFsObj);
						gxxObj['score'] = gxxFsArr;
						gxxObj['isAddScore'] = isAddScore;
						gxxObj['gxxlist'] = [];
						cpxArray.push(gxxObj);
						break;
					case '5': //指标接口
						let zbjkObj = {};
						zbjkObj['cpxid'] = item.cpxid;
						let zbjkFsObj = {}, zbjkFsArr = [];
						zbjkFsObj['hjid'] = currentHjId;
						zbjkFsObj['score'] = item.zbjkfs;
						zbjkFsArr.push(zbjkFsObj);
						zbjkObj['score'] = zbjkFsArr;
						zbjkObj['isAddScore'] = isAddScore;
						cpxArray.push(zbjkObj);
						break;
					default:
						break;
				}
			}
		}

		//过滤重复的测评分数项
		cpxArray = cpxArray.filter(item => {
			return Object.keys(item).includes('isAddScore');
		});

		//3. 循环组装下一环节的测评分数
		for (let item of cpxArray) {
			let itemFsObj = {}, itemFsArr = item.score || [];
			let idx = itemFsArr.findIndex(value => {
				return value.hjid === hjid;
			});
			// //如果已存在下一环节分数，则不需要重新添加
			if (idx === -1) {
				itemFsObj['hjid'] = hjid;
				itemFsObj['score'] = null;
				itemFsArr.push(itemFsObj);
			} else {
				itemFsObj = itemFsArr[idx];
				if (!Object.keys(itemFsObj).includes('score')) {
					itemFsObj['score'] = null;
				}
			}
		}
		return JSON.stringify(cpxArray);
	};

	//提交学生自评表单数据
	submitStudentEvaluationFormData = () => {
		//表单详情JSON信息
		let formData = this.buildFormData();
		if (formData && formData.length <= 0) {
			Toast.fail('抱歉，请先完善测评表单信息！', 1);
			return;
		}

		let { currentHjId, currentTaskId, currentLcid, currentXsid, nextHjid } = this.props;
		let cpxqxx = JSON.stringify(formData);

		//组装下一个环节测评表单JSON数据
		if (nextHjid) {
			this.props.dispatch({
				type: 'studentEvaluation/getEvaluationItemByHjid',
				params: { lcid: currentLcid, hjid: nextHjid },
				callback: data => {
					if (data) {
						let newData = data;
						for (let item of data) {
							this.buildBz(item);
						}
						let itemDataList = getTreeToList(newData);
						let newItemDataList = itemDataList.filter(item => (item.lxdm === '3' && item.radio !== '01'));
						let nextHjCpxqxx = this.buildNextHjCpxqxx(nextHjid, formData, newItemDataList);
						let params = {
							xsid: currentXsid,
							hjid: currentHjId,
							rwid: currentTaskId,
							lcid: currentLcid,
							cpxqxx: cpxqxx,
							nextHjCpxqxx: nextHjCpxqxx,
							nextHjid: nextHjid,
							type: '3',
						};

						//提交学生自评表单数据
						this.handleSaveOrSubmit(params, data => {
							if (data === 1) {
								Toast.success('提交成功！', 1, () => {
									hashHistory.push({
										pathname: '/studentEvaluation/evaluationMain/index',
									});
									this.props.dispatch({
										type: 'studentEvaluation/changeInitialPage',
										initialPage: 0,
									});
									this.props.dispatch({
										type: 'studentEvaluation/changeFormDesignList',
										evaluationInfo: {},
									});
									this.props.dispatch({
										type: 'studentEvaluation/changeAddedGxxList',
										addedGxxList: [],
									});
									this.props.dispatch({
										type: 'studentEvaluation/initFormData',
										formData: '',
									});
									this.props.dispatch({
										type: 'studentEvaluation/changeAddedRemarkList',
										addedRemarkList: [],
									});
								});
							}
						});
					}
				},
			});
		} else {
			let params = {
				xsid: currentXsid,
				hjid: currentHjId,
				rwid: currentTaskId,
				lcid: currentLcid,
				cpxqxx: cpxqxx,
				nextHjCpxqxx: '',
				type: '3',
			};

			//提交学生自评表单数据
			this.handleSaveOrSubmit(params, data => {
				if (data === 1) {
					Toast.success('提交成功！', 1, () => {
						hashHistory.push({
							pathname: '/studentEvaluation/evaluationMain/index',
						});
						this.props.dispatch({
							type: 'studentEvaluation/changeInitialPage',
							initialPage: 0,
						});
						this.props.dispatch({
							type: 'studentEvaluation/changeFormDesignList',
							evaluationInfo: {},
						});
						this.props.dispatch({
							type: 'studentEvaluation/changeAddedGxxList',
							addedGxxList: [],
						});
						this.props.dispatch({
							type: 'studentEvaluation/initFormData',
							formData: '',
						});
						this.props.dispatch({
							type: 'studentEvaluation/changeAddedRemarkList',
							addedRemarkList: [],
						});
					});
				}
			});
		}
	};

	//保存警告框
	saveAlertListener = () => {
		alert('保存后可以再次修改数据，确定保存吗？', '', [
			{
				text: '取消', onPress: () => {
				}, style: 'default',
			},
			{ text: '确定', onPress: this.saveStudentEvaluationFormData },
		]);
	};

	//提交警告框
	submitAlertListener = () => {
		alert('数据一旦提交，将不允许再次修改！确定提交吗？', '', [
			{
				text: '取消', onPress: () => {
				}, style: 'default',
			},
			{ text: '确定', onPress: this.submitStudentEvaluationFormData },
		]);
	};

	//删除加分项警告框
	deleteJfxAlertListener = (record, infoItem) => {
		alert('确定删除吗？', '', [
			{
				text: '取消', onPress: () => {
				}, style: 'default',
			},
			{ text: '确定', onPress: () => this.deleteJfx(record, infoItem) },
		]);
	};

	//删除加分项
	deleteJfx = (record, infoItem) => {
		const { addedGxxList = [], evaluationInfo = {} } = this.props;
		let cpxid = record.cpxid, gxxpkid = infoItem.gxxpkid, gxxList = [];
		if (!gxxpkid) {
			Toast.fail('请选择需要删除的数据');
			return;
		}
		let idx = addedGxxList.findIndex(value => {
			return value.cpxid === cpxid;
		});
		if (idx !== -1) {
			gxxList = addedGxxList[idx].gxxlist || [];
		}

		let gxxIdx = gxxList.findIndex(value => {
			return value.gxxpkid === gxxpkid;
		});
		if (gxxIdx !== -1) {
			gxxList.splice(gxxIdx, 1);
		}

		this.props.dispatch({
			type: 'studentEvaluation/changeAddedGxxList',
			addedGxxList: addedGxxList,
		});

		let data = evaluationInfo.newData;
		for (let item of data) {
			this.buildGxxInfo(item, this.props.addedGxxList);
		}

		let itemDataList = getTreeToList(data);
		//过滤不显示的测评项
		this.props.dispatch({
			type: 'studentEvaluation/changeFormDesignList',
			evaluationInfo: {
				...this.props.evaluationInfo,
				formDesignList: data,
				tableData: itemDataList.filter(item => !(item.lxdm === '3' && item.radio === '01')),
			},
		});
	};

	// 新增加分项 - 确认
	handleAddGxx = async (formData, uploadedFileList, fjzbid) => {
		const { currentHjId, addedGxxList = [], evaluationInfo = {} } = this.props;
		let btmc = formData.btmc || '', bz = formData.bz || '', fs = formData.fs, fj = formData.fj,
			cpxid = formData.cpxid,
			xxmc = formData.xxmc, gxxpkid = formData.gxxpkid, xxpkid = formData.xxpkid, fjxx = formData.fjxx || '';
		let gxxObj = {}, gxxList = [], obj = {};
		let gxxFjArr = [];
		if (fjxx) {
			let fjArr = fjxx.split(',');
			for (let fj of fjArr) {
				let fjInfoArr = fj.split(';');
				let fjObj = {};
				fjObj['id'] = fjInfoArr[0] || '';
				fjObj['name'] = fjInfoArr[1] || '';
				gxxFjArr.push(fjObj);
			}
		}

		//判断当前测评项是否已有加分项信息,若没有则新增，有的话获取加分项进行追加
		let idx = addedGxxList.findIndex(value => {
			return value.cpxid === cpxid;
		});
		if (idx !== -1) {
			let gxxList = addedGxxList[idx];
			let list = gxxList['gxxlist'];
			obj['bz'] = bz;
			obj['id_4'] = gxxpkid;
			obj['gxxpkid'] = gxxpkid;
			obj['grade'] = btmc;
			obj['title_4'] = xxmc;
			obj['xxpkid'] = xxpkid;
			obj['fs'] = fs;
			obj['createHjid'] = currentHjId;
			obj['fjzbid'] = fj;
			let checkArr = obj['isChecked'] || [];
			// 判断是否有做初始化
			let idx1 = checkArr.findIndex(value => value.hjid === currentHjId);
			if (idx1 !== -1) {
				let checkObj = checkArr[idx1];
				checkObj.checked = true;
				checkObj.score = fs;
			} else {
				let checkObj = {
					hjid: currentHjId,
					checked: true,
					score: fs,
				};
				checkArr.push(checkObj);
			}
			obj['isChecked'] = checkArr;
			let fileList = obj['file'] || [];
			//组装附件信息
			if (gxxFjArr && gxxFjArr.length > 0) {
				for (let item of gxxFjArr) {
					let fileObj = {};
					fileObj['name'] = item.name;
					fileObj['id'] = item.id;
					fileList.push(fileObj);
				}
			}
			obj['file'] = fileList;
			list.push(obj);
		} else {
			gxxObj['cpxid'] = cpxid;
			obj['bz'] = bz;
			obj['id_4'] = gxxpkid;
			obj['gxxpkid'] = gxxpkid;
			obj['grade'] = btmc;
			obj['title_4'] = xxmc;
			obj['xxpkid'] = xxpkid;
			obj['fjzbid'] = fj;
			obj['fs'] = fs;
			obj['createHjid'] = currentHjId;
			let checkArr = obj['isChecked'] || [];
			let checkObj = {
				hjid: currentHjId,
				checked: true,
				score: fs,
			};
			checkArr.push(checkObj);
			obj['isChecked'] = checkArr;
			//组装附件信息
			let fileList = [];
			if (gxxFjArr && gxxFjArr.length > 0) {
				for (let item of gxxFjArr) {
					let fileObj = {};
					fileObj['name'] = item.name;
					fileObj['id'] = item.id;
					fileList.push(fileObj);
				}
			}
			obj['file'] = fileList;
			gxxList.push(obj);
			gxxObj['gxxlist'] = gxxList;
			addedGxxList.push(gxxObj);
		}

		if (uploadedFileList && uploadedFileList.length > 0) {
			//附件主表ID
			this.uploadFileToDynamicForm(fjzbid, uploadedFileList);
			this.props.dispatch({
				type: 'studentEvaluation/saveFileToDynamicForm',
				params: [fjzbid],
			});
		}

		this.props.dispatch({
			type: 'studentEvaluation/changeAddedGxxList',
			addedGxxList: addedGxxList,
		});

		let data = evaluationInfo.newData;
		for (let item of data) {
			this.buildGxxInfo(item, this.props.addedGxxList);
		}

		let itemDataList = getTreeToList(data);
		//过滤不显示的测评项
		this.props.dispatch({
			type: 'studentEvaluation/changeFormDesignList',
			evaluationInfo: {
				...this.props.evaluationInfo,
				formDesignList: data,
				tableData: itemDataList.filter(item => !(item.lxdm === '3' && item.radio === '01')),
			},
		});
	};

	// 编辑加分项 - 确认
	handleUpdateGxx = async (formData, uploadedFileList, fjzbid = '') => {
		const { currentHjId, addedGxxList = [], evaluationInfo = {} } = this.props;
		let btmc = formData.btmc, bz = formData.bz, fj = formData.fj, fjxx = formData.fjxx || '', fs = formData.fs,
			cpxid = formData.cpxid, xxmc = formData.xxmc, gxxpkid = formData.gxxpkid, xxpkid = formData.xxpkid;
		let gxxFjArr = [];
		if (fjxx) {
			let fjArr = fjxx.split(',');
			for (let fj of fjArr) {
				let fjInfoArr = fj.split(';');
				let fjObj = {};
				fjObj['id'] = fjInfoArr[0] || '';
				fjObj['name'] = fjInfoArr[1] || '';
				gxxFjArr.push(fjObj);
			}
		}
		let idx = addedGxxList.findIndex(value => {
			return value.cpxid === cpxid;
		});

		if (idx !== -1) {
			let gxxList = addedGxxList[idx];
			let list = gxxList['gxxlist'];
			let index = list.findIndex(value => {
				return value.gxxpkid === gxxpkid;
			});

			if (index !== -1) {
				let gxxObj = list[index];
				gxxObj['bz'] = bz;
				gxxObj['id_4'] = gxxpkid;
				gxxObj['gxxpkid'] = gxxpkid;
				gxxObj['grade'] = btmc;
				gxxObj['title_4'] = xxmc;
				gxxObj['xxpkid'] = xxpkid;
				gxxObj['fjzbid'] = fj;
				gxxObj['fs'] = fs;
				let fileList = [];
				if (gxxFjArr && gxxFjArr.length > 0) {
					for (let item of gxxFjArr) {
						let fileObj = {};
						fileObj['name'] = item.name;
						fileObj['id'] = item.id;
						fileList.push(fileObj);
					}
				}
				gxxObj['file'] = fileList;
				let checkArr = gxxObj['isChecked'] || [];
				let checkObjIdx = checkArr.findIndex(value => {
					return value.hjid === currentHjId;
				});
				if (checkObjIdx !== -1) {
					let checkObj = checkArr[checkObjIdx];
					checkObj['score'] = fs;
				}
			}
		}

		if (uploadedFileList && uploadedFileList.length > 0) {
			//附件主表ID
			this.uploadFileToDynamicForm(fjzbid, uploadedFileList);
			this.props.dispatch({
				type: 'studentEvaluation/saveFileToDynamicForm',
				params: fjzbid ? [fjzbid] : [],
			});
		}

		this.props.dispatch({
			type: 'studentEvaluation/changeAddedGxxList',
			addedGxxList: addedGxxList,
		});

		let data = evaluationInfo.newData;
		for (let item of data) {
			this.buildGxxInfo(item, this.props.addedGxxList);
		}

		let itemDataList = getTreeToList(data);
		//过滤不显示的测评项
		this.props.dispatch({
			type: 'studentEvaluation/changeFormDesignList',
			evaluationInfo: {
				...this.props.evaluationInfo,
				formDesignList: data,
				tableData: itemDataList.filter(item => !(item.lxdm === '3' && item.radio === '01')),
			},
		});
	};

	uploadFileToDynamicForm = (fjzbid, fileList) => {
		if (fileList && fileList.length > 0) {
			let fileMapList = [];
			for (let item of fileList) {
				let params = {
					fjzbid: fjzbid,
					fwbz: 'sm-comprehensive-evaluation',
					mkmc: '学生自评_新增/编辑勾选项',
					ms: '',
					fjzbm: '',
					fjid: item['fjid'],
					fjmc: item['name'],
					cjsid: this.props.userId,
				};
				fileMapList.push(params);
			}
			//保存附件到动态表单
			this.props.dispatch({
				type: 'studentEvaluation/uploadFileToDynamicForm',
				params: fileMapList,
			});
		}
	};

	//递归构造加分项选项
	buildGxxInfo = (item, addedGxxList = []) => {
		if (!item) {
			return;
		}

		this.buildLxdm(item);

		if (item.pffsdm && item.pffsdm === '4') {
			let idx = addedGxxList.findIndex(value => {
				return value.cpxid === item.cpxid;
			});

			if (idx !== -1) {
				let gxxList = addedGxxList[idx];
				item.children = gxxList['gxxlist'];
			}
		}

		if (item.children && item.children.length > 0) {
			for (let child of item.children) {
				this.buildGxxInfo(child, addedGxxList);
			}
		}
	};

	onTabChange = (tab, index) => {
		this.props.dispatch({
			type: 'studentEvaluation/changeInitialPage',
			initialPage: index,
		});
	};

	//后退事件
	goBack = () => {
		history.back();
	};

	//过滤不显示的测评项
	filterCpflItem = (children = [], noShowCpx = []) => {
		if (noShowCpx && noShowCpx.length > 0) {
			return children.filter(item => !noShowCpx.includes(item.cpxid));
		}
		return children;
	};

	render() {
		const { evaluationInfo = {}, currentGxxInfo = {}, initialPage = 0, rwMapInfo = {} } = this.props;
		let currentRecord = currentGxxInfo.currentRecord || {};
		let gxxAddFlag = currentGxxInfo.gxxAddFlag || false, gxxEditFlag = currentGxxInfo.gxxEditFlag || false;
		let formDesignList = evaluationInfo.formDesignList || [];
		let tabs = this.buildTabs(formDesignList);
		let deviation = ((+initialPage) *
			(document.body.clientWidth * 0.92 * 0.25) /
			(formDesignList.length - 4)) /
			(formDesignList.length - 1);

		for (let item of formDesignList) {
			this.buildZbjkFs(item);
		}

		return (
			<div>
				{<div>
					<div style={{ padding: '12px 15px' }}>
						<Header title={'学生自评'} goBack={this.goBack}/>
						<style jsx="true" global="true">
							{`
							.am-badge{
								white-space: nowrap !important;
							}
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
								 .am-drawer-sidebar{
								 	width: 100%  !important;
								 }
								 .am-drawer-open
								 .am-drawer
								 .am-drawer-left
								 .am-drawer-sidebar{
								 width: 100%  !important;
								 }
							`}
						</style>
						<div className={styles.titleBox}>
							<div className={styles.title}>
								{rwMapInfo.MC || ''}
							</div>
							<div className={styles.titleInfo}>
								{(rwMapInfo.BT && rwMapInfo.BT.length > 19) ? rwMapInfo.BT.substring(0, 19) + '...' : (rwMapInfo.BT || '')}
							</div>
							<div className={styles.whiteSpace}/>
						</div>

						<div className={styles.contentBox}>
							{
								<Tabs tabs={tabs}
									  initialPage={0}
									  page={initialPage}
									  onChange={(tab, index) => this.onTabChange(tab, index)}>
									{formDesignList && formDesignList.length > 0 && formDesignList.map((infoItem) => {
										return (
											<div className={styles.itemsBox} style={{}}>
												{infoItem && infoItem.children && infoItem.children.length > 0 && infoItem.children.map((cpflItem, infoItemIndex) => {
													cpflItem.children = this.filterCpflItem(cpflItem.children, this.state.noShowCpx);
													return (
														<div>
															{
																<div className={styles.items}>
																	{cpflItem.children && cpflItem.children.length > 0 &&
																	<div
																		className={styles.title}>{cpflItem.cpxmc || ''}</div>}
																	{
																		cpflItem.children && cpflItem.children.length > 0 && cpflItem.children.map((item, index) => {
																			return this.buildDynamicColumn(item);
																		})
																	}
																</div>
															}
														</div>
													);
												})}
											</div>
										);
									})
									}
								</Tabs>
							}

							{/* 最后一页展示提交按钮*/}
							{
								(formDesignList && formDesignList.length > 0 && initialPage === formDesignList.length - 1) &&
								<div className={styles.buttonGroup}>
									<div className={styles.submit} style={{ marginLeft: '5px' }}
										 onClick={this.saveAlertListener}>
										保存
									</div>
									<div className={styles.submit} style={{ marginRight: '5px' }}
										 onClick={this.submitAlertListener}>
										提交
									</div>
								</div>
							}
						</div>
					</div>

					<Modal
						popup
						visible={gxxAddFlag}
						onClose={this.onCloseListener()}
						maskClosable={true}
						title={`${gxxEditFlag ? '编辑' : '新增'}${currentRecord.cpxlbdm === '1' ? '加分项' : '减分项'}`}
						animationType="slide-up">
						<List className="popup-list">
							<EvaluationItemAddOrEditForm handleAddGxx={this.handleAddGxx}/>
						</List>
					</Modal>

					<Modal
						popup
						visible={gxxEditFlag}
						onClose={this.onCloseListener()}
						title={`${gxxEditFlag ? '编辑' : '新增'}${currentRecord.cpxlbdm === '1' ? '加分项' : '减分项'}`}
						animationType="slide-up">
						<List className="popup-list">
							<EvaluationItemAddOrEditForm handleUpdateGxx={this.handleUpdateGxx}/>
						</List>
					</Modal>
				</div>
				}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { login, studentEvaluation } = state;
	return {
		userId: login.user ? login.user.userId : '',
		evaluationInfo: studentEvaluation.evaluationInfo || {},
		cpxqxx: studentEvaluation.cpxqxx || '',
		nextHjid: studentEvaluation.nextHjid || '',
		currentHjId: studentEvaluation.currentHjId || '',
		currentTaskId: studentEvaluation.currentTaskId || '',
		currentLcid: studentEvaluation.currentLcid || '',
		currentXsid: studentEvaluation.currentXsid || '',
		approveOpinionList: studentEvaluation.approveOpinionList || [],
		rwMapInfo: studentEvaluation.rwMapInfo || {},
		formData: studentEvaluation.formData || [],
		zbjkfsArr: studentEvaluation.zbjkfsArr || [],
		addedGxxList: studentEvaluation.addedGxxList || [],
		currentGxxInfo: studentEvaluation.currentGxxInfo || {},
		hookOptionDetail: studentEvaluation.hookOptionDetail || {},
		initialPage: studentEvaluation.initialPage || 0,
	};
}

export default connect(mapStateToProps)(index);

