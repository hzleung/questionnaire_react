import React from 'react';
import styles from './index.less';
import { Calendar, Col, Row, Select } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import { connect } from 'dva';
import moment from 'moment';
import { List, Modal, Toast } from 'antd-mobile';
import RepairForm from '../repairForm/index';
import createHashHistory from 'history/createHashHistory';

const hashHistory = createHashHistory();
const up = require('../../../assets/images/workstudy/up.png'),
	down = require('../../../assets/images/workstudy/down.png'),
	locationImg = require('../../../assets/images/workstudy/location.png'),
	time = require('../../../assets/images/workstudy/time.png');

/**
 * @Description: 移动学工 - 勤工助学 - 补打卡
 * @author weishihuai
 * @date 2020/5/18 9:08
 */
class index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		const { query } = this.props.location;
		let rzgwid = query.rzgwid, xsid = query.xsid;
		const pad = n => n < 10 ? `0${n}` : n;
		let nowDate = new Date(),
			currentDate = `${pad(nowDate.getFullYear())}-${pad(nowDate.getMonth() + 1)}-${pad(nowDate.getDate())}`;
		//查询当前日期所有的打卡记录
		this.props.dispatch({
			type: 'studentWorkStudy/getAllClockRecord',
			params: {
				xsid: xsid,
				rzgwid: rzgwid,
				dqrq: currentDate,
			},
		});

		//查询任职岗位信息
		this.props.dispatch({
			type: 'studentWorkStudy/getRzgwxx',
			params: { rzgwid: rzgwid, xsid: xsid },
		});
	}

	// 点击选择日期回调
	onSelect = date => {
		const { query } = this.props.location;
		let rzgwid = query.rzgwid, xsid = query.xsid;
		let dqrq = moment(date).format('YYYY-MM-DD');
		this.props.dispatch({
			type: 'studentWorkStudy/changeRepairClockDate',
			repairClockDate: date,
		});

		//查询当前日期所有的打卡记录
		this.props.dispatch({
			type: 'studentWorkStudy/getAllClockRecord',
			params: {
				xsid: xsid,
				rzgwid: rzgwid,
				dqrq: dqrq,
			},
		});
	};

	//日期面板变化回调
	onPanelChange = (value, mode) => {
		const { query } = this.props.location;
		let rzgwid = query.rzgwid, xsid = query.xsid;
		let dqrq = moment(value).format('YYYY-MM-DD');
		this.props.dispatch({
			type: 'studentWorkStudy/changeRepairClockDate',
			repairClockDate: value,
		});

		//查询当前日期所有的打卡记录
		this.props.dispatch({
			type: 'studentWorkStudy/getAllClockRecord',
			params: {
				xsid: xsid,
				rzgwid: rzgwid,
				dqrq: dqrq,
			},
		});
	};

	//补卡弹窗
	repairListener = (item = []) => {
		const { repairClockDate = {}, rzgwxx = {} } = this.props;
		let repairDate = new Date(moment(repairClockDate).format('YYYY-MM-DD').replace(/-/g,"/"));
		let rzkssj = rzgwxx.KSSJ || '', rzjssj = rzgwxx.JSSJ || '';

		if (rzkssj && (repairDate < new Date(rzkssj.replace(/-/g,"/")))) {
			Toast.info(`补卡时间必须大于等于任职开始时间【${rzkssj}】`);
			return;
		}

		if (rzjssj && (repairDate > new Date(rzjssj.replace(/-/g,"/")))) {
			Toast.info(`补卡时间必须小于等于任职结束时间【${rzjssj}】`);
			return;
		}

		if (repairDate > new Date()) {
			Toast.info(`补卡时间必须小于等于当前时间【${moment().format('YYYY-MM-DD')}】`);
			return;
		}

		this.props.dispatch({
			type: 'studentWorkStudy/changeRepairClockFlag',
			repairClockFlag: true,
		});

		this.props.dispatch({
			type: 'studentWorkStudy/changeCurrentRepairRecord',
			currentRepairRecord: item || [],
		});
	};

	//关闭补卡弹窗
	onCloseListener = key => () => {
		this.props.dispatch({
			type: 'studentWorkStudy/changeRepairClockFlag',
			repairClockFlag: false,
		});

		this.props.dispatch({
			type: 'studentWorkStudy/changeCurrentRepairRecord',
			currentRepairRecord: [],
		});
	};

	// 新增补卡记录
	handleRepairRecord = (formData) => {
		const { query } = this.props.location;
		formData.rzgwid = query.rzgwid;
		formData.xsid = query.xsid;

		this.props.dispatch({
			type: 'studentWorkStudy/submitRepairClockRecord',
			params: formData,
			callback: data => {
				if (data) {
					if (data.code === 1) {
						this.props.dispatch({
							type: 'studentWorkStudy/changeRepairClockFlag',
							repairClockFlag: false,
						});

						this.props.dispatch({
							type: 'studentWorkStudy/changeCurrentRepairRecord',
							currentRepairRecord: [],
						});

						//跳转申请成功页面
						hashHistory.push({
							pathname: '/studentWorkStudy/repairClockRecord/success/index',
						});
					} else {
						Toast.fail(data.msg ? data.msg : '提交失败，请稍后重试!');
					}
				}
			},
		});
	};

	//组装标题栏
	buildTitle = (prevRecord = {}, afterRecord = {}) => {
		const { repairClockDate } = this.props;
		let prevRecordKeysLength = Object.keys(prevRecord).length,
			afterRecordKeysLength = Object.keys(afterRecord).length;
		let date = ` (${repairClockDate ? moment(repairClockDate).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD')})`;
		let title = '';
		if (prevRecordKeysLength > 0 && afterRecordKeysLength === 0) {
			title += '补下班卡';
		} else if (prevRecordKeysLength === 0 && afterRecordKeysLength > 0) {
			title += '补上班卡';
		} else if (prevRecordKeysLength === 0 && afterRecordKeysLength <= 0) {
			title += '补上下班卡';
		}
		return title + date;
	};

	componentWillUnmount() {
		this.props.dispatch({
			type: 'studentWorkStudy/changeRepairClockDate',
			repairClockDate: moment(),
		});
	}

	//不可选择的日期
	getDisabledDate = (date) => {
		const { rzgwxx = {} } = this.props;
		let rzkssj = rzgwxx.KSSJ || '', rzjssj = rzgwxx.JSSJ || '';
		let now = new Date();
		let dateStr = new Date(moment(date).format('YYYY-MM-DD').replace(/-/g,"/"));
		return dateStr >= now || dateStr < new Date(rzkssj.replace(/-/g,"/")) || dateStr > new Date(rzjssj.replace(/-/g,"/"));
	};

	render() {
		const { repairClockDate, studentAllClockRecord = [], repairClockFlag, currentRepairRecord = [] } = this.props;
		let prevRecord = {}, afterRecord = {};
		if (currentRepairRecord && currentRepairRecord.length > 1) {
			prevRecord = currentRepairRecord[0] || {}, afterRecord = currentRepairRecord[1] || {};
		}

		return (
			<div location={location} style={{ background: 'rgba(242,244,247,1)', paddingBottom: '55px' }}>
				<div className={styles.group}>
					{/*<div className={styles.titleBOx}>
						补卡申请
					</div>*/}
					<style>
						{
							`
						.ant-fullcalendar-value {
								border-radius: 50%;
							  }
            			`
						}
					</style>
					<div>
						<Calendar
							locale={locale}
							fullscreen={false}
							value={repairClockDate}
							onPanelChange={this.onPanelChange}
							onSelect={this.onSelect}
							disabledDate={this.getDisabledDate}
							headerRender={({ value, type, onChange, onTypeChange }) => {
								const start = 0;
								const end = 12;
								const monthOptions = [];

								const current = value.clone();
								const localeData = value.localeData();
								const months = [];
								for (let i = 0; i < 12; i++) {
									current.month(i);
									months.push(localeData.monthsShort(current));
								}

								for (let index = start; index < end; index++) {
									monthOptions.push(
										<Select.Option className="month-item" key={`${index}`}>
											{months[index]}
										</Select.Option>,
									);
								}
								const month = value.month();
								const year = value.year();
								const options = [];
								for (let i = year - 10; i < year + 10; i += 1) {
									options.push(
										<Select.Option key={i} value={`${i}`} className="year-item">
											{i}年
										</Select.Option>,
									);
								}
								return (
									<div style={{ padding: 8 }}>
										<Row gutter={10}>
											<Col span={6}>

											</Col>
											<Col span={6}>
												<Select
													size="small"
													dropdownMatchSelectWidth={false}
													className="my-year-select"
													onChange={newYear => {
														const now = value.clone().year(newYear);
														onChange(now);
													}}
													value={String(year)}
												>
													{options}
												</Select>
											</Col>
											<Col span={6}>
												<Select
													size="small"
													dropdownMatchSelectWidth={false}
													value={String(month)}
													onChange={selectedMonth => {
														const newValue = value.clone();
														newValue.month(parseInt(selectedMonth, 10));
														onChange(newValue);
													}}
												>
													{monthOptions}
												</Select>
											</Col>
										</Row>
									</div>
								);
							}}
						/>
					</div>
				</div>

				{
					<div> 
						<div className={styles.clockTitle}>
							打卡明细
						</div>
						{studentAllClockRecord && studentAllClockRecord.length > 0 ? studentAllClockRecord.map((item) => {
							return (
								<div className={styles.clockContentBox}>
									{
										item && item.length > 0 && item.map((itemObj) => {
											return (
												itemObj ? <div className={styles.endBox}>
													<div className={styles.title}>
														<img src={itemObj.dklx === '0' ? up : down} alt=""/>
														{itemObj ? (itemObj.dklx === '0' ? (itemObj.sfbk === '1' ? `上班打卡 (补)` : `上班打卡`) : (itemObj.sfbk === '1' ? `下班打卡 (补)` : `下班打卡`)) : ''}
													</div>
													<div className={styles.timeBox}>
														<div className={styles.time}><img src={time}
																						  alt=""/>打卡时间 {itemObj ? (itemObj.dksjStr || '') : ''}
														</div> 
														{
															itemObj.sfbk === '1' ? <div className={styles.locationImg}>
																<img src={locationImg}
																	 alt=""/>
																<span
																	style={{ color: itemObj.shzt === '1' ? '#1890ff' : itemObj.shzt === '2' ? 'green' : '' }}>{itemObj ? (itemObj.shztStr || '') : ''}</span>
															</div> : <div className={styles.locationImg}><img
																src={locationImg}
																alt=""/> {itemObj ? (itemObj.dkdd ? (itemObj.dkdd.length > 45 ? itemObj.dkdd.substring(0, 45) + '...' : itemObj.dkdd) : '') : ''}
															</div>

														}
													</div>
												</div> : <div className={styles.endBox}>
													<div className={styles.title}>

													</div>
													<div className={styles.timeBox}>
														<div className={styles.time} style={{ marginTop: '0.65rem' }}>
															<img src={time}
																 alt=""/><span style={{ color: '#1890ff' }}
																			   onClick={() => this.repairListener(item)}>补卡></span>
														</div>
													</div>
												</div>
											);
										})
									}
								</div>
							);
						}) : null}
					</div>
				}

				<div style={{ marginBottom: '5px' }}
					 className={styles.botton}
					 onClick={() => this.repairListener()}>补卡申请
				</div>

				<Modal
					popup
					visible={repairClockFlag}
					onClose={this.onCloseListener()}
					maskClosable={true}
					title={this.buildTitle(prevRecord, afterRecord)}
					animationType="slide-up">
					<List className="popup-list">
						<RepairForm handleRepairRecord={this.handleRepairRecord}/>
					</List>
				</Modal>

			</div>
		);
	}
}


function mapStateToProps(state) {
	const { studentWorkStudy } = state;
	return {
		repairClockDate: studentWorkStudy.repairClockDate,
		studentAllClockRecord: studentWorkStudy.studentAllClockRecord || [],
		repairClockFlag: studentWorkStudy.repairClockFlag,
		currentRepairRecord: studentWorkStudy.currentRepairRecord,
		rzgwxx: studentWorkStudy.rzgwxx || {},
	};
}

export default connect(mapStateToProps)(index);
