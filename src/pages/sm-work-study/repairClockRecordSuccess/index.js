import React from 'react';
import styles from './index.less';
import createHashHistory from 'history/createHashHistory';
import { connect } from 'dva';

const hashHistory = createHashHistory();
const icon_succeed = require('../../../assets/images/studentSutffMobile/apply/icon_succeed.png');

/**
 * @Description: 移动学工 - 勤工助学 - 提交补卡申请成功
 * @author weishihuai
 * @date 2020/5/20 10:54
 */
class index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		setTimeout(
			() => hashHistory.push({
				pathname: '/',
			})
			, 2000);
	}

	render() {
		return (
			<div location={location} style={{ background: 'rgba(242,244,247,1)' }}>
				<div className={styles.contentBox}>
					<img src={icon_succeed} alt=""/>
					<div className={styles.text1}>提交成功</div>
					<div className={styles.text2}>请等待老师审核</div>
					<div
						onClick={e => hashHistory.push({
							pathname: '/',
						})}
						className={styles.botton}>正在返回首页...
					</div>
				</div>

			</div>
		);
	}
}

function mapStateToProps(state) {
	const { studentWorkStudy } = state;
	return {};
}

export default connect(mapStateToProps)(index);
