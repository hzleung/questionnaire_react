import React from 'react';
import styles from './index.less';
import { connect } from 'dva';

let time = require('../../../assets/images/workstudy/time.png'),
	nodata = require('../../../assets/images/studentSutffMobile/nodata.png');

/**
 * @Description: 移动学工 - 勤工助学 - 岗位详情
 * @author weishihuai
 * @date 2020/5/13 15:39
 */
class index extends React.Component {

	componentDidMount() {
		const { query } = this.props.location;
		let rzgwid = query.rzgwid, xsid = query.xsid;
		let params = {};
		params['rzgwid'] = rzgwid;
		params['xsid'] = xsid;

		//根据岗位ID查询对应的工作量、薪资明细
		this.props.dispatch({
			type: 'studentWorkStudy/getGwxqAndXcmx',
			params: params,
		});
	}

	render() {
		const { gwxqXcmxMap = {} } = this.props;
		let gwxqxxObj = gwxqXcmxMap.gwxqxxMap || {};
		let xcmxList = gwxqXcmxMap.xcmxList || [];

		return (
			<div location={location} style={{ background: 'rgba(242,244,247,1)' }}>
				<div className={styles.titleBox}>
					<div className={styles.title}>
						<div className={styles.name}>{gwxqxxObj.GWMC || ''}</div>
						<div className={styles.salary}>{gwxqxxObj.XCZTMC || ''}</div>
					</div>
					<div
						className={styles.hint}>{gwxqxxObj.BMMC || ''} | {gwxqxxObj.GWLBMC || ''} | {gwxqxxObj.RZZTMC || ''}</div>
					<div className={styles.detialBox}>
						<div>
							<div>有效工作总量(时）</div>
							<div>{gwxqxxObj.ZGZL}</div>
						</div>
						<div>
							<div>薪资发放总数(元)</div>
							<div>{gwxqxxObj.ZXCJE}</div>
						</div>
					</div>
				</div>
				<div className={styles.hint2}>薪资明细</div>
				{(xcmxList && xcmxList.length > 0) ? xcmxList.map((item) => {
					return (
						<div className={styles.detialGroup}>
							<div className={styles.titleLine}>
								<img src={time} alt=""/>
								<div>{item.KSSJ || ''} - {item.JSSJ || ''}</div>
							</div>
							<div className={styles.scale}/>
							<div className={styles.detialLine}>
								<div>
									<span className={styles.text1}>工时：</span>
									<span className={styles.text2}>{item.ZGL || '0'}</span>
									<span className={styles.text3}> 小时</span>
								</div>
								<div>
									<span className={styles.text1}>薪资：</span>
									<span className={styles.text2}>{item.XCJE || '0'}</span>
									<span className={styles.text3}> 元</span>
								</div>
							</div>
						</div>
					);
				}) : <div className={styles.imgBox}>
					<img className={styles.nodata} src={nodata} alt=""/>
					<div>暂无薪资明细</div>
				</div>}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { studentWorkStudy } = state;
	return {
		currentAddress: studentWorkStudy.currentAddress || '',
		gwxxList: studentWorkStudy.gwxxList || [],
		currentGwxx: studentWorkStudy.currentGwxx || {},
		gwxqXcmxMap: studentWorkStudy.gwxqXcmxMap || {},
	};
}

export default connect(mapStateToProps)(index);

