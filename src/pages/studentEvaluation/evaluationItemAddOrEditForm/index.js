import React from 'react';
import { ImagePicker, InputItem, List, Picker, Stepper, TextareaItem, Toast, WhiteSpace } from 'antd-mobile';
import styles from './index.less';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import { createUuid, RegRules } from '../common/common';
import axios from 'axios';

/**
 * @Description: 测评勾选项 - 新增/编辑表单
 * @author weishihuai
 * @date 2020/4/21 10:08
 */
class index extends React.Component {
	constructor(props) {
		super(props);
		this.getFieldProps = this.props.form.getFieldProps;
		this.state = {
			files: [],
			fjMap: new Map(),
			uploadedFileList: [],
		};
	}

	componentDidMount() {
		const { currentGxxInfo } = this.props;
		let currentRecord = currentGxxInfo.currentRecord || {}, infoItem = currentGxxInfo.infoItem || {},
			gxxEditFlag = currentGxxInfo.gxxEditFlag;
		let cpxid = currentRecord.cpxid;
		if (cpxid) {
			//加载测评项对应的勾选项信息
			this.props.dispatch({
				type: 'studentEvaluation/getHookOptionsByCpxid',
				params: { cpxid: cpxid },
			});
		}

		if (gxxEditFlag) { 	//编辑加分项
			let xxpkid = infoItem.xxpkid;
			this.props.form.setFieldsValue({
				jxmc: xxpkid,
			});

			//回显附件
			let files = this.state.files;
			let fjMap = this.state.fjMap;
			let file = infoItem.file || [];
			if (file && file.length > 0) {
				for (let fileItem of file) {
					let fileId = fileItem.id, fileName = fileItem.name;
					let url = `zuul/docrepo/download/file?attachmentId=${fileId}`;
					files.push({
						url: url,
						id: fileId,
						fjmc: fileName,
						fjid: fileId,
					});
					fjMap.set(fileName, fileId);
				}
			}
		}
	}

	handleAddGxx() {
		const { handleAddGxx } = this.props;
		this.props.form.validateFields({ force: true }, (err, values) => {
			if (err) {
				Toast.fail(this.getFormValidatorErrText(err));
				return;
			}
			let fjzbid = createUuid();
			this.props.form.setFieldsValue({
				fj: fjzbid,
			});
			let formData = this.props.form.getFieldsValue();
			if (formData) {
				if (handleAddGxx && typeof handleAddGxx === 'function') {
					handleAddGxx(formData, this.state.uploadedFileList, fjzbid);
				}
				this.props.dispatch({
					type: 'studentEvaluation/changeCurrentGxxInfo',
					currentGxxInfo: {
						currentRecord: {}, gxxAddFlag: false,
					},
				});

				this.props.dispatch({
					type: 'studentEvaluation/changeHookOptionDetail',
					hookOptionDetail: {},
				});
			}
		});
	}

	handleEditGxx() {
		const { handleUpdateGxx } = this.props;
		this.props.form.validateFields({ force: true }, (err, values) => {
			if (err) {
				Toast.fail(this.getFormValidatorErrText(err));
				return;
			}

			let formData = this.props.form.getFieldsValue();
			if (formData) {
				if (handleUpdateGxx && typeof handleUpdateGxx === 'function') {
					handleUpdateGxx(formData, this.state.uploadedFileList, formData.fj);
				}
				this.props.dispatch({
					type: 'studentEvaluation/changeCurrentGxxInfo',
					currentGxxInfo: {
						currentRecord: {}, gxxEditFlag: false,
					},
				});

				this.props.dispatch({
					type: 'studentEvaluation/changeHookOptionDetail',
					hookOptionDetail: {},
				});
			}
		});
	}

	//奖项onChange事件
	onXxmcChange = (value) => {
		if (value && value.length > 0) {
			let cpxid = value[0];
			if (!cpxid) {
				Toast.fail('抱歉，当前测评项暂无可选勾选项信息！');
				return;
			}
			this.props.dispatch({
				type: 'studentEvaluation/getEvaluationHookOptionDetail',
				params: { cpxid: cpxid },
				callback: (data) => {
					if (data) {
						this.props.form.setFieldsValue({
							jxmc: [data.pkid],
							fs: data.xxfs,
						});
					}
				},
			});
		}
	};

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

	//检查文件格式
	checkFileTypeLimit = (name, list) => {
		let flag = false;
		list.map(item => {
			if (name.indexOf(item) !== -1) {
				flag = true;
			}
		});
		return flag;
	};

	onFjChange = (files, type, index) => {
		const { currentGxxInfo } = this.props;
		let currentRecord = currentGxxInfo.currentRecord || {};
		//上传文件类型/数量限制
		let fileTypeList = [], gsxz = currentRecord.gsxz || '';
		if (gsxz) {
			fileTypeList = gsxz.split(',');
		}
		this.setState({
			files,
		});

		let fjMap = this.state.fjMap, uploadedFileList = this.state.uploadedFileList;

		if (type === 'add') {
			let indexNum = (files.length) - 1, name = files[indexNum].file.name;
			//检查是否支持上传该文件类型
			if (fileTypeList && fileTypeList.length > 0) {
				if (!this.checkFileTypeLimit(name, fileTypeList)) {
					Toast.fail(`抱歉，只支持上传${fileTypeList.toString()}格式的文件`, 1, () => {
						this.state.files.splice(files.length - 1, 1);
						this.setState({
							files,
						});
					});
					return;
				}
			}

			let token = window.sessionStorage.getItem('access_token');
			let formData = new FormData();
			formData.append('file', this.state.files[indexNum].file);
			formData.append('uuid', createUuid());
			formData.append('type', '1');

			//保存附件到服务器中
			axios.post('zuul/docrepo/upload', formData,
				{
					headers: { 'token': token, 'loginUserId': this.props.userId },
				},
			).then(responseData => {
				fjMap.set(name, responseData.data.data.ssbh);
				let obj = {};
				obj['fjid'] = responseData.data.data.ssbh;
				obj['name'] = name;
				uploadedFileList.push(obj);
				this.setState({
					uploadedFileList,
				});
				if (fjMap && fjMap.size > 0) {
					let res = '', fieldValue;
					for (let [key, value] of fjMap) {
						fieldValue = value + ';' + key;
						res += ',' + fieldValue;
					}
					if (res) {
						res = res.substring(1);
					}
					this.props.form.setFieldsValue({
						fjxx: res,
					});
				} else {
					this.props.form.setFieldsValue({
						fjxx: '',
					});
				}
				Toast.success('附件上传成功');
			}).catch(() => {
				files.pop();
				Toast.fail('附件上传失败，请稍后重试');
			});
		} else if (type === 'remove') {
			const { fjMap, uploadedFileList } = this.state;
			let key = [...fjMap.keys()][index], value = fjMap.get([...fjMap.keys()][index]);
			uploadedFileList.splice(uploadedFileList.findIndex(item => item.fjid === value), 1);
			fjMap.delete(key);
		}
	};

	goBack = () => {
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

	render() {
		const { hookOptionsDataSource, currentGxxInfo, hookOptionDetail } = this.props;
		let currentRecord = currentGxxInfo.currentRecord || {}, infoItem = currentGxxInfo.infoItem || {},
			gxxEditFlag = currentGxxInfo.gxxEditFlag;
		const { files = [] } = this.state;
		//上传文件数量限制
		let fjsl = (currentRecord.fjsl === null || currentRecord.fjsl === undefined || currentRecord.fjsl === '') ? 5 : currentRecord.fjsl;

		let fileArr = infoItem.file || [], initFile = '', arr = [];
		if (fileArr && fileArr.length > 0) {
			for (let item of fileArr) {
				arr.push(`${item.id};${item.name}`);
			}
			initFile = arr.join(',');
		}
		let fjzbid = infoItem.fjzbid || '';

		return (
			<div>
				{/*<Header title={`${gxxEditFlag ? '编辑' : '新增'}${currentRecord.cpxlbdm === '1' ? '加分项' : '减分项'}`}
						goBack={this.goBack}/>*/}
				<style jsx="true" global="true">
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
				 // .am-image-picker-list .am-flexbox .am-flexbox-item{
				 // 	width:30px;
				 // 	height:30px;
				 // }
				 // .am-image-picker-list .am-image-picker-upload-btn{
				 // 	width:30px;
				 // 	height:30px;
				 // }
        `}
				</style>
				<List>
					<Picker data={hookOptionsDataSource} cols={1}
							{...this.getFieldProps('jxmc', { rules: [{ required: true, message: '请先选择奖项名称' }] })}
							className="forss"
							placeholder="请选择奖项名称"
							value={[hookOptionDetail.pkid ? hookOptionDetail.pkid : infoItem.xxpkid ? infoItem.xxpkid : '']}
							onChange={v => this.onXxmcChange(v)}>
						<List.Item arrow="horizontal">奖项名称</List.Item>
					</Picker>

					{currentRecord.sfxybtdm === '1' &&
					<InputItem
						{...this.getFieldProps('btmc', {
							initialValue: infoItem.grade || '',
							rules: [{
								max: 100,
								message: `${currentRecord.btmc || ''}最大长度不能超过100`,
							}],
						})}
						placeholder={`请输入${currentRecord.btmc || ''}`}
						clear
						moneyKeyboardAlign="left"
					>{currentRecord.btmc || ''}</InputItem>}
					<List.Item
						wrap
						extra={
							<Stepper
								{...this.getFieldProps('fs', {
									initialValue: hookOptionDetail.xxfs ? hookOptionDetail.xxfs : infoItem.fs ? infoItem.fs : 0,
									rules: [{
										pattern: RegRules.NEG_FS_REG_EXP_RULE,
										message: '请输入正确格式的分数',
									}],
								})}
								style={{ width: '100%', minWidth: '100px' }}
								showNumber
								max={100}
							/>}>
						分数
					</List.Item>
				</List>
				<WhiteSpace/><WhiteSpace/>
				{currentRecord.sfxybzdm === '1' && <TextareaItem
					{...this.getFieldProps('bz', {
						initialValue: infoItem.bz || '',
						rules: [{
							max: 100,
							message: `备注信息最大长度不能超过100`,
						}],
					})}
					title="备注"
					placeholder="请输入备注内容"
					data-seed="logId"
					autoHeight
					rows={5}
					className='remarks'
					ref={el => this.customFocusInst = el}
				/>}
				{/*{currentRecord.sfxyfjdm === '1' &&
				<div>
					<List.Item
						extra={
							<div>
								<ImagePicker
									style={{ width: '50px', height: '50px' }}
									{...this.getFieldProps('fj', { initialValue: fjzbid })}
									files={files}
									onChange={this.onFjChange}
									selectable={files.length < fjsl}
									multiple={false}
								/>
							</div>
						}
					>附件</List.Item>
				</div>}*/}

				{currentRecord.sfxyfjdm === '1' &&
				<div>
					<List.Item>附件</List.Item>
					<ImagePicker
						{...this.getFieldProps('fj', { initialValue: fjzbid })}
						files={files}
						onChange={this.onFjChange}
						selectable={files.length < fjsl}
						multiple={false}
					/>
				</div>}

				{currentRecord.sfxyfjdm === '1' &&
				<div style={{ display: 'none' }}>
					<List.Item>附件</List.Item>
					<ImagePicker
						files={files}
						onChange={this.onFjChange}
						selectable={files.length < fjsl}
						multiple={false}
					/>
				</div>}

				{/*隐藏域，用于form表单提交*/}
				<div style={{ display: 'none' }}>
					<InputItem placeholder=""
							   {...this.getFieldProps('xxpkid', { initialValue: hookOptionDetail.pkid ? hookOptionDetail.pkid : infoItem.xxpkid })}/>
				</div>
				<div style={{ display: 'none' }}>
					<InputItem placeholder=""
							   {...this.getFieldProps('gxxpkid', { initialValue: infoItem.gxxpkid ? infoItem.gxxpkid : createUuid() })}/>
				</div>
				<div style={{ display: 'none' }}>
					<InputItem placeholder=""
							   {...this.getFieldProps('xxmc', { initialValue: hookOptionDetail.xxmc ? hookOptionDetail.xxmc : infoItem.title_4 })}/>
				</div>
				<div style={{ display: 'none' }}>
					<InputItem placeholder=""
							   {...this.getFieldProps('cpxid', { initialValue: infoItem.cpxid ? infoItem.cpxid : currentRecord.cpxid })}/>
				</div>
				<div style={{ display: 'none' }}>
					<InputItem placeholder=""
							   {...this.getFieldProps('fjxx', { initialValue: initFile })}/>
				</div>
				<div style={{ marginBottom: '10px' }}
					 onClick={gxxEditFlag ? () => this.handleEditGxx() : () => this.handleAddGxx()}
					 className={styles.botton}>保存
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { login, studentEvaluation } = state;
	return {
		userId: login.user ? login.user.userId : '',
		evaluationInfo: studentEvaluation.evaluationInfo,
		formData: studentEvaluation.formData,
		currentGxxInfo: studentEvaluation.currentGxxInfo || {},
		hookOptionsDataSource: studentEvaluation.hookOptionsDataSource || [],
		hookOptionDetail: studentEvaluation.hookOptionDetail || {},
	};
}

const app = connect(mapStateToProps)(createForm()(index));
export default app;



