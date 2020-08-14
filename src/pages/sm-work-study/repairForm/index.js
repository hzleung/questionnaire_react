import React from 'react';
import { DatePicker, InputItem, List, TextareaItem, Toast } from 'antd-mobile';
import styles from './index.less';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import moment from 'moment';

const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
const dateFormat = 'YYYY-MM-DD HH:mm';

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

	//转换时间, 秒数设置为59,防止分钟数重叠时冲突,如[09:10~12:10, 12:10~14:10]
	convertDate = (date) => {
		const pad = n => n < 10 ? `0${n}` : n;
		const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
		const timeSecondsStr = `${pad(date.getHours())}:${pad(date.getMinutes())}:${'59'}`;
		return `${dateStr} ${timeSecondsStr}`;
	};

	handleRepairRecord() {
		const { handleRepairRecord, currentRepairRecord = [], } = this.props;
		this.props.form.validateFields({ force: true }, (err, values) => {
			if (err) {
				Toast.fail(this.getFormValidatorErrText(err));
				return;
			}

			let formData = this.props.form.getFieldsValue();
			let prevRecord = {}, afterRecord = {};
			if (currentRepairRecord && currentRepairRecord.length > 1) {
				prevRecord = currentRepairRecord[0] || {}, afterRecord = currentRepairRecord[1] || {};
			}

			if (handleRepairRecord && typeof handleRepairRecord === 'function') {
				const { repairClockDate } = this.props;
				let sbdksjStr = moment(repairClockDate).format("YYYY-MM-DD") + " " + moment(formData.sbdksj).format("HH:mm:ss");
				let xbdksjStr = moment(repairClockDate).format("YYYY-MM-DD") + " " + moment(formData.xbdksj).format("HH:mm:ss");

				let sbdksjDate = new Date(moment(sbdksjStr).format(dateTimeFormat).replace(/-/g,"/"));
				let xbdksjDate = new Date(moment(xbdksjStr).format(dateTimeFormat).replace(/-/g,"/"));
				if (new Date(moment(formData.xbdksj).format(dateFormat).replace(/-/g,"/")).getTime() <= new Date(moment(formData.sbdksj).format(dateFormat).replace(/-/g,"/")).getTime()) {
					Toast.fail('上班时间须小于下班时间');
					return;
				}

				formData.sbdksj = this.convertDate(sbdksjDate);
				formData.xbdksj = this.convertDate(xbdksjDate);
				let prevRecordKeysLength = Object.keys(prevRecord).length;
				let afterRecordKeysLength = Object.keys(afterRecord).length;
				if (prevRecordKeysLength > 0 && afterRecordKeysLength <= 0) {
					formData.type = '1'; //下班卡
				} else if (prevRecordKeysLength <= 0 && afterRecordKeysLength > 0) {
					formData.type = '0'; //上班卡
				} else if (prevRecordKeysLength <= 0 && afterRecordKeysLength <= 0) {
					formData.type = '2'; //上下班卡
				}
				handleRepairRecord(formData);
			}
		});
	}

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

	//校验时间
	validateDatePicker = (rule, date, callback) => {
		if (date && date.getMinutes() !== 15) {
			callback();
		} else {
			callback(new Error('日期格式错误'));
		}
	};

	render() {
		const { getFieldProps } = this.props.form;
		const { currentRepairRecord = [] } = this.props;
		let prevRecord = {}, afterRecord = {};
		if (currentRepairRecord && currentRepairRecord.length > 1) {
			prevRecord = currentRepairRecord[0] || {}, afterRecord = currentRepairRecord[1] || {};
		}

		return (
			<div>
				<style jsx="true">
					{/* antd-mobile 的自定义样式 */}
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
					.am-list-item{
					  height: 52px  !important;
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
				 .am-list-item .am-list-line{
				 	align-item:center !important;
				 }
				 .am-list-item.am-list-item-middle .am-list-line{
				 	align-item:center !important;
				 }
        `}
				</style>
				<DatePicker
					{...getFieldProps('sbdksj', {
						initialValue: Object.keys(prevRecord).length > 0 ? new Date(prevRecord.dksj.replace(/-/g,"/")) : '',
						rules: [
							{ required: true, message: '请选择上班时间！' },
							{ validator: this.validateDatePicker },
						],
					})}
					mode={'time'}
					disabled={Object.keys(prevRecord).length > 0}>
					<List.Item arrow="horizontal">上班时间</List.Item>
				</DatePicker>
				<DatePicker
					{...getFieldProps('xbdksj', {
						initialValue: Object.keys(afterRecord).length > 0 ? new Date(afterRecord.dksj.replace(/-/g,"/")) : '',
						rules: [
							{ required: true, message: '请选择下班时间！' },
							{ validator: this.validateDatePicker },
						],
					})}
					mode={'time'}
					disabled={Object.keys(afterRecord).length > 0}>
					<List.Item arrow="horizontal">下班时间</List.Item>
				</DatePicker>
				<TextareaItem
					{...getFieldProps('bkly', {
						initialValue: '',
						rules: [{
							max: 200,
							message: `补卡理由最大长度不能超过200`,
						}, { required: true, message: '请输入补卡理由' }],
					})}
					title="补卡理由"
					placeholder="请输入补卡理由"
					data-seed="logId"
					autoHeight
					rows={5}
					className='remarks'
					ref={el => this.customFocusInst = el}
				/>
				<div style={{ display: 'none' }}>
					<InputItem placeholder=""
							   {...getFieldProps('sbdkjlpkid', { initialValue: Object.keys(prevRecord).length > 0 ? (prevRecord.dkjlid ? prevRecord.dkjlid : '') : '' })}/>
				</div>
				<div style={{ display: 'none' }}>
					<InputItem placeholder=""
							   {...getFieldProps('xbdkjlpkid', { initialValue: Object.keys(afterRecord).length > 0 ? (afterRecord.dkjlid ? afterRecord.dkjlid : '') : '' })}/>
				</div>
				<div style={{ marginBottom: '10px' }}
					 onClick={() => this.handleRepairRecord()}
					 className={styles.botton}>提交申请
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { login, studentWorkStudy } = state;
	return {
		userId: login.user ? login.user.userId : '',
		repairClockFlag: studentWorkStudy.repairClockFlag,
		currentRepairRecord: studentWorkStudy.currentRepairRecord,
		repairClockDate: studentWorkStudy.repairClockDate,
	};
}

const app = connect(mapStateToProps)(createForm()(index));
export default app;



