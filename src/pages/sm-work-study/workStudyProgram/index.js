import React from 'react';
import styles from './index.less';
import { List, Modal, Picker, Toast } from 'antd-mobile';
import { connect } from 'dva';
import Link from 'umi/link';

const arrow_black = require('../../../assets/images/studentSutffMobile/arrow_black.png'),
	up = require('../../../assets/images/workstudy/up.png'),
	calendar = require('../../../assets/images/workstudy/calendar.png'),
	donw_gray = require('../../../assets/images/workstudy/donw_gray.png'),
	down = require('../../../assets/images/workstudy/down.png'),
	locationImg = require('../../../assets/images/workstudy/location.png'),
	tick = require('../../../assets/images/workstudy/tick.png'),
	time = require('../../../assets/images/workstudy/time.png'),
	close = require('../../../assets/images/workstudy/close.png'),
	succeed = require('../../../assets/images/workstudy/succeed.png');
const defaultAddress = '正在定位中...';

/**
 * @Description: 勤工助学 - 上班打卡页面
 * @author weishihuai
 * @date 2020/5/13 13:39
 */
class index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		let props = this.props;
		//查询当前系统管理设置的定位地图类型 1:腾讯地图  2:高德地图(高德需配置HTTPS,比腾讯地图准确)
		props.dispatch({
			type: 'studentWorkStudy/getCurrentMapType',
			callback: data => {
				if (data) {
					if (data.currentMapType === '1') {  	//1:腾讯地图
						this.initTencentMap(data.mapSecret);
					} else if (data.currentMapType === '2') {  //2:高德地图(高德需配置HTTPS)
						this.initGdMap();
					}
				} else {
					Toast.fail('请到系统管理设置定位地图类型');
				}
			},
		});

		//查询当前登录人所有的在职岗位信息
		const { userId } = props;
		props.dispatch({
			type: 'studentWorkStudy/getStudentRzgwxx',
			params: { xh: userId },
			callback: data => {
				if (data && data.length > 0) {
					let oldGwxx = this.props.currentGwxx || {};
					if (oldGwxx && Object.keys(oldGwxx).length > 0) {
						props.dispatch({
							type: 'studentWorkStudy/changeCurrentGwxx',
							currentGwxx: oldGwxx,
						});

						//查询当天所有打卡记录
						props.dispatch({
							type: 'studentWorkStudy/getCurrentDateStudentDkjlList',
							params: {
								xsid: oldGwxx.XSID,
								rzgwid: oldGwxx.RZGWID,
								dqrq: this.formatDate(new Date(), '1'),
							},
						});
					} else {
						//默认展示第一个岗位信息
						let currentGwxx = data[0] || {};
						props.dispatch({
							type: 'studentWorkStudy/changeCurrentGwxx',
							currentGwxx: currentGwxx,
						});

						//查询当天所有打卡记录
						props.dispatch({
							type: 'studentWorkStudy/getCurrentDateStudentDkjlList',
							params: {
								xsid: currentGwxx.XSID,
								rzgwid: currentGwxx.RZGWID,
								dqrq: this.formatDate(new Date(), '1'),
							},
						});
					}
				}
			},
		});
	}

	//初始化腾讯地图定位
	initTencentMap = (mapSecret = '') => {
		if (!mapSecret) {
			Toast.fail('请到系统管理设置地图秘钥');
			return;
		}
		let props = this.props;
		//初始化腾讯地图定位
		let geolocation = new qq.maps.Geolocation(mapSecret, 'ly-sm-mobile-ui');
		let options = { timeout: 8000 };
		geolocation.getLocation((position) => {
			//稍微修正腾讯地图的经纬度偏差
			let latitude = position.lat + 0.00134;
			let longitude = position.lng + 0.01191;
			props.dispatch({
				type: 'studentWorkStudy/getAddressList',
				params: {
					location: `${latitude},${longitude}`,
				},
				callback: data => {
					if (data) {
						let dataMap = JSON.parse(data);
						//地址描述
						// let address = dataMap.result.address || '';
						// 经过腾讯地图优化过的描述方式
						let recommendAddress = dataMap.result.formatted_addresses.recommend || '';
						//更多参数可参考：https://lbs.qq.com/service/webService/webServiceGuide/webServiceGcoder
						props.dispatch({
							type: 'studentWorkStudy/changeCurrentAddress',
							currentAddress: recommendAddress,
						});
					}
				},
			});
		}, () => {
			Toast.fail('定位失败', 1, () => {
				props.dispatch({
					type: 'studentWorkStudy/changeCurrentAddress',
					currentAddress: '定位失败',
				});
			});
		}, options);
	};

	//初始化高德地图定位
	initGdMap = () => {
		let mapObj = new AMap.Map('iCenter');
		mapObj.plugin('AMap.Geolocation', function() {
			let geolocation = new AMap.Geolocation({
				enableHighAccuracy: true, // 是否使用高精度定位，默认:true
				timeout: 10000,           // 超过10秒后停止定位，默认：无穷大
				maximumAge: 0,            // 定位结果缓存0毫秒，默认：0
				convert: true,            // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
				showButton: true,         // 显示定位按钮，默认：true
				buttonPosition: 'LB',     // 定位按钮停靠位置，默认：'LB'，左下角
				buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
				showMarker: true,         // 定位成功后在定位到的位置显示点标记，默认：true
				showCircle: true,         // 定位成功后用圆圈表示定位精度范围，默认：true
				panToLocation: true,      // 定位成功后将定位到的位置作为地图中心点，默认：true
				zoomToAccuracy: true,       // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
			});
			mapObj.addControl(geolocation);
			geolocation.getCurrentPosition((status, result) => {
				if (status === 'complete') {
					//缩减地址   result.formattedAddress为详细地址(省市县)
					let currentAddress = result.addressComponent.building;
					if (currentAddress) {
						props.dispatch({
							type: 'studentWorkStudy/changeCurrentAddress',
							currentAddress: currentAddress,
						});
					}
				} else {
					Toast.fail('定位失败', 1, () => {
						props.dispatch({
							type: 'studentWorkStudy/changeCurrentAddress',
							currentAddress: '定位失败',
						});
					});
				}
			});
		});
	};

	onClose = () => {
		const { currentGwxx = {} } = this.props;
		this.props.dispatch({
			type: 'studentWorkStudy/changeSbdkSuccessStatus',
			sbdkSuccessStatus: false,
			dkcgsjTime: '',
		});

		this.props.dispatch({
			type: 'studentWorkStudy/changeXbdkSuccessStatus',
			xbdkSuccessStatus: false,
			dkcgsjTime: '',
		});

		//查询当天所有打卡记录
		this.props.dispatch({
			type: 'studentWorkStudy/getCurrentDateStudentDkjlList',
			params: {
				xsid: currentGwxx.XSID,
				rzgwid: currentGwxx.RZGWID,
				dqrq: this.formatDate(new Date(), '1'),
			},
		});
	};

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
			type: 'studentWorkStudy/changeCurrentGwxx',
			currentGwxx: currentGwxx,
		});

		//查询当天所有打卡记录
		this.props.dispatch({
			type: 'studentWorkStudy/getCurrentDateStudentDkjlList',
			params: {
				xsid: currentGwxx.XSID,
				rzgwid: currentGwxx.RZGWID,
				dqrq: this.formatDate(new Date(), '1'),
			},
		});
	};

	formatDate = (date, type) => {
		const pad = n => n < 10 ? `0${n}` : n;
		const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
		const timeSecondsStr = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
		const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
		return type === '1' ? `${dateStr} ${timeSecondsStr}` : `${timeStr}`;
	};

	//上班打卡
	sbdkClickListener = (latestDklx) => {
		const { currentGwxx = {}, currentAddress = '' } = this.props;
		if (!currentAddress) {
			Toast.info('正在定位中,请稍后...');
			return;
		}

		let nowDate = new Date();
		let dksjFullTime = this.formatDate(nowDate, '1');
		let dkcgsjTime = this.formatDate(nowDate, '2');

		//保存打卡记录
		let formData = {};
		formData['rzgwid'] = currentGwxx.RZGWID;
		formData['xsid'] = currentGwxx.XSID;
		formData['dksj'] = dksjFullTime;
		formData['dklx'] = latestDklx === '0' ? '1' : '0';
		formData['dkdd'] = currentAddress;
		formData['gwxxid'] = currentGwxx.GWXXID;
		this.props.dispatch({
			type: 'studentWorkStudy/saveStudentDkjl',
			params: formData,
			callback: data => {
				if (data && data === 1) {
					if (formData.dklx === '0') {
						this.props.dispatch({
							type: 'studentWorkStudy/changeSbdkSuccessStatus',
							sbdkSuccessStatus: true,
							dkcgsjTime: dkcgsjTime,
						});
					} else {
						this.props.dispatch({
							type: 'studentWorkStudy/changeXbdkSuccessStatus',
							xbdkSuccessStatus: true,
							dkcgsjTime: dkcgsjTime,
						});
					}
				}
			},
		});
	};

	checkLatestDkLx = (studentDkjlList = []) => {
		let dklx = '1';
		if (studentDkjlList && studentDkjlList.length > 0) {
			let latestDkjlObj = studentDkjlList[studentDkjlList.length - 1];
			dklx = latestDkjlObj.DKLX;
		}
		return dklx;
	};

	//重新定位
	reLocation = () => {
		let props = this.props;
		//查询当前系统管理设置的定位地图类型 1:腾讯地图  2:高德地图(高德需配置HTTPS,比腾讯地图准确)
		props.dispatch({
			type: 'studentWorkStudy/getCurrentMapType',
			callback: data => {
				if (data) {
					if (data.currentMapType === '1') {  	//1:腾讯地图
						this.initTencentMap(data.mapSecret);
					} else if (data === '2') {  //2:高德地图(高德需配置HTTPS)
						this.initGdMap();
					}
				} else {
					Toast.fail('请到系统管理设置定位地图类型');
				}
			},
		});
	};

	render() {
		const { currentAddress = '', gwxxList = [], studentDkjlList = [], xbdkSuccessStatus = false, currentGwxx = {}, sbdkSuccessStatus = false, dkcgsjTime = '' } = this.props;
		return (
			<div location={location} style={{ background: 'rgba(242,244,247,1);', marginBottom: '90px' }}>
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
                height: 212px !important;
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
						{Object.keys(currentGwxx).length > 0 && <div className={styles.positionPickerBox}>
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
								{(`${currentGwxx.XM || ''}-${currentGwxx.GWLBMC || ''}-${currentGwxx.RZZTMC || ''}`)}
							</div>
						</div>}

						{/*岗位详情*/}
						{Object.keys(currentGwxx).length > 0 ? <Link to={{
							pathname: '/studentWorkStudy/stationDetail/index',
							query: {
								rzgwid: currentGwxx.RZGWID,
								xsid: currentGwxx.XSID,
							},
						}}>
							<div className={styles.detial}>
								详情
								<img src={arrow_black} alt=""/>
							</div>
						</Link> : null}
					</div>
				</div>

				{studentDkjlList && studentDkjlList.length > 0 && <div>
					{studentDkjlList.map((item) => {
						return (
							<div>
								<div className={styles.endBox}>
									<div className={styles.title}><img src={item.DKLX === '0' ? up : down}
																	   alt=""/>{item.DKLX === '0' ? (item.SFBK === '1' ? '上班打卡 (补)' : '上班打卡') : (item.SFBK === '1' ? '下班打卡 (补)' : '下班打卡')}
									</div>
									<div className={styles.timeBox}>
										<div className={styles.time}><img src={time} alt=""/>打卡时间 {item.DKSJ || ''}
										</div>
										{
											item.SFBK === '1' ?
												<div className={styles.locationImg}><img src={locationImg}
																						 alt=""/> <span
													style={{ color: item.SHZT === '1' ? '#1890ff' : item.SHZT === '2' ? 'green' : '' }}>{item ? (item.SHZTSTR || '') : ''}</span>
												</div> : <div className={styles.locationImg}><img src={locationImg}
																								  alt=""/> {item.DKDD ? (item.DKDD.length > 45 ? item.DKDD.substring(0, 45) + '...' : item.DKDD) : ''}
												</div>
										}
									</div>
								</div>
							</div>
						);
					})}
				</div>
				}

				{(gwxxList && gwxxList.length <= 0) ? <div className={styles.quit}>
					暂无在职岗位信息&nbsp; &nbsp;无需打卡
				</div> : <div>
					<div className={styles.startBox}>
						<div className={styles.title}><img
							src={this.checkLatestDkLx(studentDkjlList) === '0' ? donw_gray : up}
							alt=""/> {this.checkLatestDkLx(studentDkjlList) === '0' ? '下班打卡' : '上班打卡'}
						</div>
						<div className={styles.clockBotton}
							 onClick={() => this.sbdkClickListener(this.checkLatestDkLx(studentDkjlList))}>
							{this.checkLatestDkLx(studentDkjlList) === '0' ? '下班打卡' : '上班打卡'}
						</div>
						<div className={styles.lcoationbBox}><img src={locationImg} alt=""/>
							{currentAddress ? (currentAddress.length > 45 ? currentAddress.substring(0, 45) + '...' : currentAddress) : defaultAddress}
							<span style={{ color: '#1890ff', fontSize: '13px' }} onClick={this.reLocation}> 重新定位></span>
						</div>
					</div>
					{this.checkLatestDkLx(studentDkjlList) === '1' && <div className={styles.endBox}>
						<div className={styles.title}><img src={donw_gray} alt=""/> 下班打卡</div>
						<div className={styles.textBox}>
							<div className={styles.scape}/>
							<div>请先打卡上班</div>
							<div className={styles.scape}/>
						</div>
					</div>}
				</div>}


				{Object.keys(currentGwxx).length > 0 &&
				<div className={styles.bottomBox}>
					<div>
						<img src={calendar} alt=""/>
						<Link to={{
							pathname: '/studentWorkStudy/workStudyClockRecord/index',
							query: {
								rzgwid: currentGwxx.RZGWID,
								xsid: currentGwxx.XSID,
							},
						}}>
							<span style={{ color: '#1a1a1a' }}>打卡记录</span>
						</Link>
					</div>
					<div className={styles.scale}/>
					<div><img src={tick} alt=""/> <Link to={{
						pathname: '/studentWorkStudy/repairClockRecord/index',
						query: {
							rzgwid: currentGwxx.RZGWID,
							xsid: currentGwxx.XSID,
						},
					}}>
						<span style={{ color: '#1a1a1a' }}>补打卡</span>
					</Link></div>
				</div>}


				<Modal
					visible={sbdkSuccessStatus}
					transparent
					maskClosable={false}
					onClose={this.onClose}>
					<div>
						<img onClick={this.onClose} className={styles.closeBotton} src={close} alt=""/>
						<img className={styles.succeed} src={succeed} alt=""/>
						<div className={styles.text1}>上班打卡成功</div>
						<div className={styles.text2}>打卡时间 {dkcgsjTime || ''}</div>
						<div className={styles.text3}>下班时记得打卡哦~</div>
					</div>
				</Modal>

				<Modal
					visible={xbdkSuccessStatus}
					transparent
					maskClosable={false}
					onClose={this.onClose}>
					<div>
						<img onClick={this.onClose} className={styles.closeBotton} src={close} alt=""/>
						<img className={styles.succeed} src={succeed} alt=""/>
						<div className={styles.text1}>下班打卡成功</div>
						<div className={styles.text2}>打卡时间 {dkcgsjTime || ''}</div>
						<div className={styles.text3}>上班时记得打卡哦~</div>
					</div>
				</Modal>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { login, studentWorkStudy } = state;
	return {
		userId: login.user ? login.user.userId : '',
		currentAddress: studentWorkStudy.currentAddress || '',
		gwxxList: studentWorkStudy.gwxxList || [],
		currentGwxx: studentWorkStudy.currentGwxx || {},
		sbdkSuccessStatus: studentWorkStudy.sbdkSuccessStatus || false,
		xbdkSuccessStatus: studentWorkStudy.xbdkSuccessStatus || false,
		dkcgsjTime: studentWorkStudy.dkcgsjTime || '',
		studentDkjlList: studentWorkStudy.studentDkjlList || [],
	};
}

export default connect(mapStateToProps)(index);