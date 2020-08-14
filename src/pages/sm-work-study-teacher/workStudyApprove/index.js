import React from 'react';
import styles from './index.less';
import { List, Picker } from 'antd-mobile';
import { connect } from 'dva';
import Header from '../Header/index';
import { Link } from 'umi';

const arrow_black = require('../../../assets/images/studentSutffMobile/arrow_black.png'),
	up = require('../../../assets/images/workstudy/up.png'),
	down = require('../../../assets/images/workstudy/down.png'),
	locationImg = require('../../../assets/images/workstudy/location.png'),
	time = require('../../../assets/images/workstudy/time.png'),
	nodata = require('../../../assets/images/studentSutffMobile/nodata.png');

/**
 * @Description: 勤工助学 - 补卡审核页面
 * @author weishihuai
 * @date 2020/5/20 14:19
 */
class index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		let props = this.props;
		//查询当前登录人所有的在职岗位负责人信息
		const { userId } = props;
		props.dispatch({
			type: 'teacherWorkStudy/getTeacherRzgwxx',
			params: { userId: userId },
			callback: data => {
				if (data && data.length > 0) {
					let oldGwxx = this.props.currentGwxx || {};
					if (oldGwxx && Object.keys(oldGwxx).length > 0) {
						props.dispatch({
							type: 'teacherWorkStudy/changeCurrentGwxx',
							currentGwxx: oldGwxx,
						});

						//查询该岗位对应的所有补卡记录
						props.dispatch({
							type: 'teacherWorkStudy/getRepairRecordList',
							params: {
								gwxxid: oldGwxx.GWXXID,
							},
						});
					} else {
						//默认展示第一个岗位信息
						let currentGwxx = data[0] || {};
						props.dispatch({
							type: 'teacherWorkStudy/changeCurrentGwxx',
							currentGwxx: currentGwxx,
						});

						//查询该岗位对应的所有补卡记录
						props.dispatch({
							type: 'teacherWorkStudy/getRepairRecordList',
							params: {
								gwxxid: currentGwxx.GWXXID,
							},
						});
					}
				}
			},
		});
	}

	//组装任职岗位数据源
	buildGwxxDataSource = (gwxxList) => {
		let gwxxDataSource = [];
		if (gwxxList && gwxxList.length > 0) {
			for (let item of gwxxList) {
				let obj = {};
				obj['label'] = item.GWMC;
				obj['value'] = item.GWXXID;
				gwxxDataSource.push(obj);
			}
		}
		return gwxxDataSource;
	};

	//岗位信息onChange
	onGwChange = (v) => {
		const { gwxxList = [] } = this.props;
		let currentGwxx = {};
		if (gwxxList && gwxxList.length > 0) {
			let idx = gwxxList.findIndex(value => {
				return value.GWXXID === v[0];
			});
			if (idx !== -1) {
				currentGwxx = gwxxList[idx] || {};
			}
		}

		this.props.dispatch({
			type: 'teacherWorkStudy/changeCurrentGwxx',
			currentGwxx: currentGwxx,
		});

		//查询该岗位对应的所有补卡记录
		this.props.dispatch({
			type: 'teacherWorkStudy/getRepairRecordList',
			params: {
				gwxxid: currentGwxx.GWXXID,
			},
		});
	};

	//后退事件
	goBack = () => {
		history.back();
	};

	render() {
		const { gwxxList = [], repairRecordList = [], currentGwxx = {} } = this.props;

		return (
			<div location={location} style={{ background: 'rgba(242,244,247,1);', marginBottom: '90px' }}>
				<Header title={'补卡申请审核'} goBack={this.goBack}/>
				<style>
					{
						`
						.am-list-extra{
							overflow: initial !important;
							color: black !important;
							font-size:20px !important;
							font-weight:bold !important;
						}
						.am-modal-content{
							padding-bottom: 45px;
							height: ${window.screen.height - 45}px !important;
						}
						.am-modal-transparent{
							width: 66.6%;
						}
						
						`
					}
				</style>

				<div>
					<div id="allmap"/>
					<div className={styles.titleBox}>
						{JSON.stringify(currentGwxx) !== '{}' && <div className={styles.positionPickerBox}>
							<div className={styles.positionPicker}>
								<Picker
									data={this.buildGwxxDataSource(gwxxList)}
									cols={1}
									className="forss"
									value={this.state.collegeValue}
									extra={currentGwxx ? (currentGwxx.GWMC || '') : '请选择职位信息'}
									onChange={this.onGwChange}>
									<List.Item/>
								</Picker>
								<div className={styles.triangle}/>
							</div>
							<div className={styles.text}>
								{(`${currentGwxx.GWFZR || ''}-${currentGwxx.GWLBMC || ''}`)}
							</div>
						</div>}
					</div>
				</div>

				{(gwxxList && gwxxList.length <= 0) ? <div className={styles.quit}>
						暂无在职岗位信息&nbsp; &nbsp;无需审核
					</div> :
					<div>
						{repairRecordList && repairRecordList.length > 0 ? repairRecordList.map((item) => {
							let prevDkjlid = item[0].dkjlid, afterDkjlid = item[1].dkjlid;
							return (
								<Link to={{
									pathname: '/teacherWorkStudy/workStudyApproveDetail/index',
									query: {
										prevRecordId: prevDkjlid,
										afterRecordId: afterDkjlid,
									},
								}}>
									<div className={styles.clockContentBox}
										 style={{ paddingBottom: 0 }}>
										{
											(item && item.length > 1) && item.map((itemObj, indexObj) => {
												return (
													itemObj &&
													<div style={{ position: 'relative' }}>
														{
															indexObj == 0 &&
															<div
																className={styles.endBoxTitle}>{item[0].bjmc} - {item[0].xm}</div>
														}
														{
															indexObj == 1 &&
															<img className={styles.endBoxImg} src={arrow_black} alt=""/>
														}

														<div className={styles.endBox}>
															<div className={styles.title}>
																<img src={itemObj.dklx === '0' ? up : down} alt=""/>
																{itemObj ? (itemObj.dklx === '0' ? (itemObj.sfbk === '1' ? `上班打卡 (补)` : `上班打卡`) : (itemObj.sfbk === '1' ? `下班打卡 (补)` : `下班打卡`)) : ''}
															</div>
															<div className={styles.timeBox}>
																<div className={styles.time}><img src={time}
																								  alt=""/> {itemObj ? (itemObj.dksjStr || '') : ''}
																</div>
																{
																	itemObj.sfbk === '1' ?
																		<div className={styles.locationImg}>
																			<img src={locationImg}
																				 alt=""/> <span
																			style={{
																				color: itemObj.shzt === '1' ? '#1890ff' : itemObj.shzt === '2' ? 'green' : '',
																				whiteSpace: 'nowrap',
																			}}>{itemObj ? (itemObj.shztStr || '') : ''}</span>
																		</div> :
																		<div className={styles.locationImg}><img
																			src={locationImg}
																			alt=""/> {itemObj ? (itemObj.dkdd || '') : ''}
																		</div>
																}
															</div>
														</div>
													</div>
												);
											})
										}
									</div>
								</Link>
							);
						}) : <div className={styles.imgBox}>
							<img className={styles.nodata} src={nodata} alt=""/>
							<div>当前岗位暂无补卡申请</div>
						</div>}
					</div>
				}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { login, teacherWorkStudy } = state;
	return {
		userId: login.user ? login.user.userId : '',
		gwxxList: teacherWorkStudy.gwxxList || [],
		currentGwxx: teacherWorkStudy.currentGwxx || {},
		repairRecordList: teacherWorkStudy.repairRecordList || [],
		approveFlag: teacherWorkStudy.approveFlag,
		currentRepairRecord: teacherWorkStudy.currentRepairRecord,
	};
}

export default connect(mapStateToProps)(index);