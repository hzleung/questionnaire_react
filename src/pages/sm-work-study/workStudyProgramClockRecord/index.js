import React from 'react';
import styles from './index.less';
import { Badge, Calendar, Col, Row, Select } from 'antd';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import { connect } from 'dva';

const up = require('../../../assets/images/workstudy/up.png'),
	down = require('../../../assets/images/workstudy/down.png'),
	locationImg = require('../../../assets/images/workstudy/location.png'),
	time = require('../../../assets/images/workstudy/time.png');

/**
 * @Description: 移动学工 - 勤工助学 - 打卡记录
 * @author weishihuai
 * @date 2020/5/15 9:17
 */
class index extends React.Component {

	componentDidMount() {
		const pad = n => n < 10 ? `0${n}` : n;
		let nowDate = new Date(), currentMonth = `${pad(nowDate.getFullYear())}-${pad(nowDate.getMonth() + 1)}`,
			currentDate = `${pad(nowDate.getFullYear())}-${pad(nowDate.getMonth() + 1)}-${pad(nowDate.getDate())}`;
		const { query } = this.props.location;
		let rzgwid = query.rzgwid, xsid = query.xsid;
		this.loadClockInfo(xsid, rzgwid, currentMonth, currentDate);
	}

	//日期面板变化回调
	onPanelChange = (value, mode) => {
		const { query } = this.props.location;
		let rzgwid = query.rzgwid, xsid = query.xsid;
		let dqrq = moment(value).format('YYYY-MM-DD'), dqyf = moment(value).format('YYYY-MM');
		this.props.dispatch({
			type: 'studentWorkStudy/changeCurrentDate',
			currentDate: value,
		});
		this.loadClockInfo(xsid, rzgwid, dqyf, dqrq);
	};

	// 自定义渲染日期单元格
	dateCellRender = date => {
		let dateStr = moment(date).format('YYYY-MM-DD');
		//判断日期在当前月份是否存在打卡记录
		const { studentCurrentMonthZgzl = {} } = this.props;
		let currentMonthAllDkrqList = studentCurrentMonthZgzl.currentMonthAllDkrqList || [];
		if (currentMonthAllDkrqList && currentMonthAllDkrqList.length > 0) {
			if (currentMonthAllDkrqList.includes(dateStr)) {
				return <Badge status="processing"/>;
			}
		}
		return null;
	};

	// 点击选择日期回调
	onSelect = date => {
		const { query } = this.props.location;
		let rzgwid = query.rzgwid, xsid = query.xsid;
		let dqrq = moment(date).format('YYYY-MM-DD'), dqyf = moment(date).format('YYYY-MM');
		this.props.dispatch({
			type: 'studentWorkStudy/changeCurrentDate',
			currentDate: date,
		});
		this.loadClockInfo(xsid, rzgwid, dqyf, dqrq);
	};

	//加载打卡相关信息
	loadClockInfo = (xsid, rzgwid, dqyf, dqrq) => {
		//查询当月总工作量
		this.props.dispatch({
			type: 'studentWorkStudy/getCurrentMonthStudentZgzl',
			params: {
				xsid: xsid,
				rzgwid: rzgwid,
				dqyf: dqyf,
			},
		});

		//查询当天打卡明细
		this.props.dispatch({
			type: 'studentWorkStudy/getCurrentDateStudentDkjlList',
			params: {
				xsid: xsid,
				rzgwid: rzgwid,
				dqrq: dqrq,
			},
		});

		//查询当天打卡次数和工作量
		this.props.dispatch({
			type: 'studentWorkStudy/getCurrentDateStudentZgzl',
			params: {
				xsid: xsid,
				rzgwid: rzgwid,
				dqrq: dqrq,
			},
		});
	};

	componentWillUnmount() {
		this.props.dispatch({
			type: 'studentWorkStudy/changeCurrentDate',
			currentDate: moment(),
		});
	}

	render() {
		const { studentCurrentMonthZgzl = {}, studentDkjlList = [], studentCurrentDateRecord = {}, currentDate = moment() } = this.props;

		return (
			<div location={location} style={{ background: 'rgba(242,244,247,1);', marginBottom: '25px' }}>
				<style>
					{
						`
						.ant-fullcalendar-value {
								border-radius: 50%;
							  }

						.ant-badge-status-processing::after{
							border: none;
						}
						.ant-fullcalendar-content{
							left:4px;
						}

            			`
					}
				</style>
				<div>
					<div className={styles.titleBOx}>
						本月统计总工时：{studentCurrentMonthZgzl.currentMonthZgzl || '0'}小时
					</div>

					<Calendar
						locale={locale}
						fullscreen={false}
						value={currentDate}
						onPanelChange={this.onPanelChange}
						dateCellRender={this.dateCellRender}
						onSelect={this.onSelect}
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

				{
					<div>
						<div className={styles.clockTitle}>
							打卡明细
						</div>
						<div className={styles.count}>
							今日共打卡 {studentCurrentDateRecord.totalRecord || '0'} 次，工作时长总计 {studentCurrentDateRecord.totalGzl || '0'} 小时
						</div>

						{studentDkjlList && studentDkjlList.length > 0 ? studentDkjlList.map((item) => {
							return (
								<div>
									<div className={styles.endBox}>
										<div className={styles.title}><img src={item.DKLX === '0' ? up : down}
																		   alt=""/>{item.DKLX === '0' ? (item.SFBK === '1' ? '上班打卡 (补)' : '上班打卡') : (item.SFBK === '1' ? '下班打卡 (补)' : '下班打卡')}
										</div>
										<div className={styles.timeBox}>
											<div className={styles.time}><img src={time} alt=""/>打卡时间  {item.DKSJ}
											</div>
											{
												item.SFBK === '1' ?
													<div className={styles.locationImg}><img src={locationImg}
																							 alt=""/>
														<span
															style={{ color: item.SHZT === '1' ? '#1890ff' : item.SHZT === '2' ? 'green' : '' }}>{item ? (item.SHZTSTR || '') : ''}</span>
													</div> : <div className={styles.locationImg}><img src={locationImg}
																									  alt=""/> {item.DKDD ? (item.DKDD.length > 45 ? item.DKDD.substring(0, 45) + '...' : item.DKDD) : ''}
													</div>
											}
										</div>
									</div>
								</div>
							);
						}) : null}
					</div>
				}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { studentWorkStudy } = state;
	return {
		studentDkjlList: studentWorkStudy.studentDkjlList || [],
		studentCurrentMonthZgzl: studentWorkStudy.studentCurrentMonthZgzl || {},
		studentCurrentDateRecord: studentWorkStudy.studentCurrentDateRecord || {},
		currentDate: studentWorkStudy.currentDate,
	};
}

export default connect(mapStateToProps)(index);