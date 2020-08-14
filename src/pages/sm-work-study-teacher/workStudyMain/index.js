import React from 'react';
import 'moment/locale/zh-cn';
import { connect } from 'dva';
import { List } from 'antd-mobile';
import createHashHistory from 'history/createHashHistory';
import Header from '../Header/index';
const Item = List.Item;

const hashHistory = createHashHistory();

/**
 * @Description: 勤工助学 - 教师端
 * @author weishihuai
 * @date 2020/5/20 14:07
 */
class index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	//后退事件
	goBack = () => {
		history.back();
	};

	render() {
		return (
			<div location={location} style={{ background: 'rgba(242,244,247,1)', paddingBottom: '55px' }}>
				<Header title={'补卡申请审核'} goBack={this.goBack}/>
				<List className="my-list">
					<Item arrow="horizontal" onClick={() => {
						hashHistory.push({
							pathname: '/teacherWorkStudy/workStudyApprove/index',
						});
					}}>补卡申请审核</Item>
				</List>
			</div>
		);
	}
}


function mapStateToProps(state) {
	const { teacherWorkStudy } = state;
	return {};
}

export default connect(mapStateToProps)(index);
