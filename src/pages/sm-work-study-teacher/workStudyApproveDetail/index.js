import React from 'react';
import { InputItem, List, Radio, TextareaItem, Toast } from 'antd-mobile';
import styles from './index.less';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import Header from '../Header/index';
import createHashHistory from 'history/createHashHistory';

const hashHistory = createHashHistory();
const RadioItem = Radio.RadioItem;

/**
 * @Description: 补卡弹窗
 * @author weishihuai
 * @date 2020/5/18 11:59
 */
class index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		const { query } = this.props.location;
		let prevRecordId = query.prevRecordId, afterRecordId = query.afterRecordId;
		//查询打卡详情信息
		let params = {};
		params['prevRecordId'] = prevRecordId;
		params['afterRecordId'] = afterRecordId;
		this.props.dispatch({
			type: 'teacherWorkStudy/getApproveRecordInfo',
			params: params,
		});
	}

	handleApprove() {
		this.props.form.validateFields({ force: true }, (err, values) => {
			if (err) {
				Toast.fail(this.getFormValidatorErrText(err));
				return;
			}

			let formData = this.props.form.getFieldsValue();
			if (formData) {
				const { approveInfoList = [] } = this.props;
				let prevDkjl = {}, afterDkjl = {};
				if (approveInfoList && approveInfoList.length > 1) {
					prevDkjl = approveInfoList[0] || {}, afterDkjl = approveInfoList[1] || {};
				}
				const pad = n => n < 10 ? `0${n}` : n;
				let date = new Date(prevDkjl.dksj.replace(/-/g, '/'));
				const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
				let prevDkjlid = prevDkjl.dkjlid, afterDkjlid = afterDkjl.dkjlid;
				formData['xsid'] = prevDkjl.xsid;
				formData['rzgwid'] = prevDkjl.rzgwid;
				formData['gzrq'] = dateStr;
				formData['prevDkjlid'] = prevDkjlid;
				formData['afterDkjlid'] = afterDkjlid;
				formData['type'] = formData.type ? '1' : '2';  //1:审核通过  2:审核不通过
				this.handleApproveSubmit(formData);
			}
		});
	}

	//审核补卡提交
	handleApproveSubmit = (formData) => {
		const { currentGwxx = {} } = this.props;
		//审核补卡记录并计算工作量
		this.props.dispatch({
			type: 'teacherWorkStudy/approveStudentDkjl',
			params: formData,
			callback: data => {
				if (data && data === 1) {
					Toast.success('审核成功！');
					hashHistory.push({
						pathname: '/teacherWorkStudy/workStudyApprove/index',
					});
				}
			},
		});
	};

	//返回校验不通过的字段错误信息
	getFormValidatorErrText = (error = {}) => {
		for (let key in error) {
			let errorObj = error[key];
			if (errorObj) {
				let errorsArray = errorObj['errors'];
				if (errorsArray && errorsArray.length > 0) {
					//返回第一个校验不通过的字段错误信息
					return errorsArray[0].message;
				}
			}
		}
		return '请完善表单信息';
	};

	onChange = (value) => {
		this.setState({
			value,
		});
		this.props.form.setFieldsValue({
			type: value === '1',
		});
	};

	convertDateToString = (date) => {
		const pad = n => n < 10 ? `0${n}` : n;
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
	};

	//后退事件
	goBack = () => {
		history.back();
	};

	render() {
		const { getFieldProps } = this.props.form;
		const { approveInfoList = [] } = this.props;
		let prevRecord = {}, afterRecord = {};
		if (approveInfoList && approveInfoList.length > 1) {
			prevRecord = approveInfoList[0] || {}, afterRecord = approveInfoList[1] || {};
		}

		let flag = prevRecord.shzt === '0' || afterRecord.shzt === '0';

		return (
			<div>
				<Header title={'补卡申请审核'} goBack={this.goBack}/>
				<style jsx="true">
					{`
					  body{background: rgba(242,244,247,1)}
					 .ant-radio-group {
					  padding: 18px !important;
					  margin-left: 27% !important;

					  color:rgba(153,153,153,1);
					}
					.ant-radio-wrapper{
					  font-size:17px !important;
					}
					.am-list-content{
					  width: 92px !important;
					  flex:none  !important;
					  font-size:17px !important;
					  color:rgba(51,51,51,1) !important;
					}
					.am-list-extra{
					  flex-basis: initial !important;
					  font-size:17px !important;
					  color:rgba(153,153,153,1) !important;
					}
					.am-list-arrow{
					  position: absolute !important;
					  right: 15px !important;
					}

				   .remarks{
					 height: fit-content !important;
				   }

				  .am-drawer-sidebar{
					width: 100%  !important;
					background: white;
					transform: translateX(0%) !important;
				 }

				 .am-list-body div:not(:last-child) .am-list-line {
					 border-bottom : 0PX solid #ddd;
				 }
				 .am-list-body{
					margin-top : 44px;
				}

				 .my-radio .am-radio {
				  padding: 2.5px;
				  border: 1px solid #ccc;
				  border-radius: 50%;
				  margin-right: 5px;
				}
				.page-header{
					height:0 !important;
				}
				.am-modal-body{
					height: ${window.screen.height-667 + 570}px !important;
				}
				.am-list-body .am-textarea-item .am-textarea-control{

				}
				.am-modal-content{
					padding-bottom: 45px;
					height: ${window.screen.height-45}px !important;
				}
        `}
				</style>

				<List>
					<InputItem value={`${prevRecord.xm || ''} (${prevRecord.xh || ''})`} editable={false}>姓名</InputItem>
					<InputItem value={prevRecord.bmmc || ''} editable={false}>学院</InputItem>
					<InputItem value={prevRecord.zymc || ''} editable={false}>专业</InputItem>
					<InputItem value={prevRecord.bjmc || ''} editable={false}>班级</InputItem>
					<InputItem
						value={`${prevRecord.dksj ? this.convertDateToString(new Date(prevRecord.dksj.replace(/-/g, '/'))) : ''} ${prevRecord.sfbk === '1' ? ' (补)' : ''}`}
						editable={false}>上班时间</InputItem>
					<InputItem
						value={`${afterRecord.dksj ? this.convertDateToString(new Date(afterRecord.dksj.replace(/-/g, '/'))) : ''} ${afterRecord.sfbk === '1' ? ' (补)' : ''}`}
						editable={false}>下班时间</InputItem>
					<TextareaItem
						{...getFieldProps('bkly', {
							initialValue: `${prevRecord.bkly || ''}`,
						})}
						title="补卡理由"
						data-seed="logId"
						// autoHeight
						editable={false}
						rows={4}
						className='remarks'
						ref={el => this.customFocusInst2 = el}
					/>

					<List renderHeader={() => '审核意见'}>
						<RadioItem key={'1'}
								   disabled={!flag}
								   onChange={() => this.onChange('1')}
								   checked={this.state.value ? this.state.value === '1' : (!flag ? (prevRecord.shzt === '1' || afterRecord.shzt === '1') : true)}>
							审核通过
						</RadioItem>
						<RadioItem key={'2'}
								   onChange={() => this.onChange('2')}
								   disabled={!flag}
								   checked={this.state.value ? this.state.value === '2' : (!flag ? (prevRecord.shzt === '2' || afterRecord.shzt === '2') : false)}>
							审核不通过
						</RadioItem>
					</List>

					<div style={{ display: 'none' }}>
						<InputItem placeholder=""
								   {...getFieldProps('type', { initialValue: flag ? true : (prevRecord.shzt === '1' ? true : afterRecord.shzt === '2' ? false : false) })}/>
					</div>

					<TextareaItem
						{...getFieldProps('shyj', {
							initialValue: flag ? '' : (prevRecord.sfbk === '1' ? prevRecord.shyj : afterRecord.sfbk === '1' ? afterRecord.shyj : ''),
							rules: [{
								max: 200,
								message: `审核意见最大长度不能超过200`,
							},
								{ required: true, message: '请输入审核意见' }],
						})}
						title="审核意见"
						placeholder="请输入审核意见"
						data-seed="logId"
						autoHeight
						editable={flag}
						rows={4}
						className='remarks'
						ref={el => this.customFocusInst = el}
					/>
				</List>
				{flag && <div onClick={() => this.handleApprove()}
							  className={styles.botton}>审核
				</div>}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { teacherWorkStudy } = state;
	return {
		approveInfoList: teacherWorkStudy.approveInfoList,
		currentGwxx: teacherWorkStudy.currentGwxx,
	};
}

const app = connect(mapStateToProps)(createForm()(index));
export default app;



