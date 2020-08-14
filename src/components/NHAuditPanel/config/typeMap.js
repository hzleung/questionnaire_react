import { message } from 'antd';
import { guid } from 'utils/globalUtil';
import { reqGetFieldSelector, reqGetRulesByType, reqGetFieldValidation } from 'utils/api';

// 获取选择器列表
let selectorList = [];
const getFieldSelector = () => {
	reqGetFieldSelector().then((res) => {
		const { meta, data } = res;
		if (meta.success) {
			if (data) {
				selectorList = data.map((item) => ({
					name: item.selectorName,
					value: item.selectorId,
					isSingle: item.SIGNLE
				}));
			}
		} else {
			message.error(meta.message);
		}
	});
};
getFieldSelector();

// 获取后端规则
let rules = [];
const getRules = () => {
	reqGetRulesByType({ ruleType: '4' }).then((res) => {
		const { meta, data } = res;
		if (meta.success) {
			if (data) {
				rules = data.list.map((item) => ({
					name: item.ruleName,
					value: item.ruleNum
				}));
			}
		} else {
			message.error(meta.message);
		}
	});
};
getRules();

// 获取验证规则
let validTypeList = [];
const GetFieldValidation = () => {
	reqGetFieldValidation().then((res) => {
		const { meta, data } = res;
		if (meta.success) {
			if (data) {
				validTypeList = data.map((item) => ({
					name: item.validTypeName,
					value: item.validType
				}));
			}
		} else {
			message.error(meta.message);
		}
	});
};
GetFieldValidation();

export const getTypeMap = (type) => {
	const typeMap = {
		MergeTable: {
			title: '表格布局',
			row: 4,
			col: 4,
			config: {
				borderColor: {
					name: '边框颜色',
					type: 'colorPicker'
				},
				style: {
					name: 'style',
					type: 'textarea'
				}
			},
			props: { data: [] },
			children: []
		},
		div: {
			title: '通用布局块',
			is_native: true,
			config: {
				backgroundColor: {
					name: '背景颜色',
					type: 'colorPicker'
				},
				borderWidth: {
					name: '边框宽度',
					type: 'number'
				},
				borderColor: {
					name: '边框颜色',
					type: 'colorPicker'
				},
				borderStyle: {
					name: '边框类型',
					type: 'selection',
					options: [ { name: '实线', value: 'solid' }, { name: '虚线', value: 'dashed' } ]
				},
				style: {
					name: 'style',
					type: 'textarea'
				}
			},
			props: {},
			children: []
		},
		p: {
			title: '块状文本',
			is_native: true,
			config: {
				content: {
					name: '文本内容',
					type: 'textarea'
				},
				fontSize: {
					name: '字体大小',
					type: 'selection',
					options: [
						{ name: '10px', value: '10px' },
						{ name: '12px', value: '12px' },
						{ name: '14px', value: '14px' },
						{ name: '16px', value: '16px' },
						{ name: '18px', value: '18px' },
						{ name: '20px', value: '20px' },
						{ name: '24px', value: '24px' },
						{ name: '36px', value: '36px' }
					]
				},
				lineHeight: {
					name: '行高',
					type: 'text'
				},
				textAlign: {
					name: '对齐方式',
					type: 'selection',
					options: [
						{ name: '居左', value: 'left' },
						{ name: '居中', value: 'center' },
						{ name: '居右', value: 'right' }
					]
				},
				fontWeight: {
					name: '加粗',
					type: 'boolean'
				},
				fontStyle: {
					name: '斜体',
					type: 'boolean'
				},
				color: {
					name: '字体颜色',
					type: 'colorPicker'
				},
				backgroundColor: {
					name: '背景颜色',
					type: 'colorPicker'
				},
				style: {
					name: 'style',
					type: 'textarea'
				}
			},
			props: {
				content: '文本内容',
				fontSize: '14px',
				textAlign: 'left',
				fontWeight: false,
				fontStyle: false
			}
		},
		Button: {
			title: '按钮',
			config: {
				name: {
					name: '字段名(name)',
					type: 'text'
				},
				id: {
					name: '字段(id)',
					type: 'text'
				},
				remark: {
					name: '备注',
					type: 'text'
				},
				content: {
					name: '按钮文字',
					type: 'text'
				},
				disabled: {
					name: '禁用',
					type: 'boolean'
				},
				href: {
					name: 'href',
					type: 'text'
				},
				target: {
					name: 'target',
					type: 'text'
				},
				icon: {
					name: '图标',
					type: 'text'
				},
				shape: {
					name: '形状',
					type: 'text'
				},
				size: {
					name: '大小',
					type: 'selection',
					options: [
						{ name: 'small', value: 'small' },
						{ name: 'large', value: 'large' },
						{ name: 'default', value: '' }
					]
				},
				type: {
					name: '类型',
					type: 'selection',
					options: [
						{ name: 'primary', value: 'primary' },
						{ name: 'dashed', value: 'dashed' },
						{ name: 'danger', value: 'danger' },
						{ name: 'default', value: '' }
					]
				},
				hiddenType: {
					name: '隐藏模式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: 'NEW(新建时隐藏)', value: 'NEW' },
						{ name: 'EDIT(编辑时隐藏)', value: 'EDIT' },
						{ name: 'READ(阅读时隐藏)', value: 'READ' },
						{ name: '不隐藏(默认)', value: '' }
					]
				},
				jsEvent: {
					name: 'JS事件',
					type: 'selection',
					options: [ { name: 'onClick', value: 'onClick' } ]
				},
				jsFun: {
					name: 'JS事件函数',
					type: 'text'
				},
				className: {
					name: 'class',
					type: 'text'
				},
				style: {
					name: 'style',
					type: 'textarea'
				}
			},
			props: {
				name: '',
				id: '',
				content: '按钮一只',
				disabled: false
			}
		},
		Row: {
			title: '栅格布局',
			config: {
				gutter: {
					name: '栅格间隔',
					type: 'number'
				},
				column: {
					name: '列配置项',
					type: 'grid'
				},
				align: {
					name: '垂直对齐方式',
					type: 'selection',
					options: [
						{ name: '顶部对齐', value: 'top' },
						{ name: '居中', value: 'middle' },
						{ name: '底部对齐', value: 'bottom' }
					]
				},
				justify: {
					name: '水平排列方式',
					type: 'selection',
					options: [
						{ name: '左对齐', value: 'start' },
						{ name: '右对齐', value: 'end' },
						{ name: '居中', value: 'center' },
						{ name: '两侧间隔相等', value: 'space-around' },
						{ name: '两端对齐', value: 'space-between' }
					]
				}
			},
			props: {
				gutter: 0,
				column: [ { key: guid(), span: 12 }, { key: guid(), span: 12 } ],
				align: 'middle',
				justify: 'start'
			},
			children: []
		},
		Input: {
			title: 'Input 输入框',
			config: {
				label: {
					name: '标题',
					type: 'text'
				},
				name: {
					name: '字段名(name)',
					type: 'text'
				},
				id: {
					name: '字段(id)',
					type: 'text'
				},
				type: {
					name: '类型',
					type: 'selection',
					options: [ { name: 'text', value: '文本框' }, { name: 'password', value: '密码框' } ]
				},
				remark: {
					name: '备注',
					type: 'text'
				},
				initialValue: {
					name: '默认值',
					type: 'text'
				},
				isTextarea: {
					name: '多行文本框',
					type: 'boolean'
				},
				editorType: {
					name: '编辑器类型(多行文本)',
					type: 'selection',
					options: [ { name: '纯文本', value: '1' }, { name: '富文本', value: '2' } ]
				},
				required: {
					name: '不允许为空',
					type: 'boolean'
				},
				validMsg: {
					name: '为空提示消息',
					type: 'text'
				},
				validType: {
					name: '验证规则',
					type: 'autoComplete',
					options: validTypeList
				},
				selector: {
					name: '绑定选择器',
					type: 'selection',
					options: selectorList
				},
				hiddenType: {
					name: '隐藏模式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: 'NEW(新建时隐藏)', value: 'NEW' },
						{ name: 'EDIT(编辑时隐藏)', value: 'EDIT' },
						{ name: 'READ(阅读时隐藏)', value: 'READ' },
						{ name: '不隐藏(默认)', value: '' }
					]
				},
				readonlyMode: {
					name: '只读模式',
					type: 'selection',
					options: [
						{ name: '新建时只读(不保存数据)', value: 'NEW' },
						{ name: '新建时只读(需保存数据)', value: 'NEWSAVE' },
						{ name: '编辑时只读(不保存数据)', value: 'EDIT' },
						{ name: '编辑时只读(需保存数据)', value: 'EDITSAVE' },
						{ name: '全部只读(不保存数据)', value: 'ALL' },
						{ name: '全部只读(需保存数据)', value: 'ALLSAVE' },
						{ name: '可编辑(默认)', value: '' }
					]
				},
				jsEvent: {
					name: 'JS事件',
					type: 'selection',
					options: [
						{ name: 'onChange', value: 'onChange' },
						{ name: 'onPressEnter', value: 'onPressEnter' }
					]
				},
				jsFun: {
					name: 'JS事件函数',
					type: 'text'
				},
				rule: {
					name: '绑定后端规则',
					type: 'selection',
					options: rules
				},
				ruleOption: {
					name: '规则绑定方式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: '新建（默认）', value: 'NEW' },
						{ name: '编辑', value: 'EDIT' },
						{ name: '阅读', value: 'READ' }
					]
				},
				maxLength: {
					name: '长度',
					type: 'number'
				},
				className: {
					name: 'class',
					type: 'text'
				},
				style: {
					name: 'style',
					type: 'textarea'
				}
			},
			props: {
				name: '',
				id: '',
				type: 'text',
				isTextarea: false,
				editorType: '1',
				required: false,
				validMsg: ''
			}
		},
		DatePicker: {
			title: '日期选择器',
			config: {
				label: {
					name: '标题',
					type: 'text'
				},
				name: {
					name: '字段名(name)',
					type: 'text'
				},
				id: {
					name: '字段(id)',
					type: 'text'
				},
				format: {
					name: '日期格式',
					type: 'selection',
					options: [
						{ name: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
						{ name: 'YYYY-MM-DD HH', value: 'YYYY-MM-DD HH' },
						{ name: 'YYYY-MM-DD HH:mm', value: 'YYYY-MM-DD HH:mm' },
						{ name: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
						{ name: 'YYYY/MM/DD', value: 'YYYY/MM/DD' },
						{ name: 'YYYY/MM/DD HH', value: 'YYYY/MM/DD HH' },
						{ name: 'YYYY/MM/DD HH:mm', value: 'YYYY/MM/DD HH:mm' },
						{ name: 'YYYY/MM/DD HH:mm:ss', value: 'YYYY/MM/DD HH:mm:ss' }
					]
				},
				remark: {
					name: '备注',
					type: 'text'
				},
				initialValue: {
					name: '默认值',
					type: 'datePicker'
				},
				required: {
					name: '不允许为空',
					type: 'boolean'
				},
				validMsg: {
					name: '为空提示消息',
					type: 'text'
				},
				hiddenType: {
					name: '隐藏模式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: 'NEW(新建时隐藏)', value: 'NEW' },
						{ name: 'EDIT(编辑时隐藏)', value: 'EDIT' },
						{ name: 'READ(阅读时隐藏)', value: 'READ' },
						{ name: '不隐藏(默认)', value: '' }
					]
				},
				readonlyMode: {
					name: '只读模式',
					type: 'selection',
					options: [
						{ name: '新建时只读(不保存数据)', value: 'NEW' },
						{ name: '编辑时只读(不保存数据)', value: 'EDIT' },
						{ name: '全部只读(不保存数据)', value: 'ALL' },
						{ name: '可编辑(默认)', value: '' }
					]
				},
				rule: {
					name: '绑定后端规则',
					type: 'selection',
					options: rules
				},
				ruleOption: {
					name: '规则绑定方式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: '新建（默认）', value: '' },
						{ name: '编辑', value: 'EDIT' },
						{ name: '阅读', value: 'READ' }
					]
				},
				className: {
					name: 'class',
					type: 'text'
				},
				style: {
					name: 'style',
					type: 'textarea'
				}
			},
			props: {
				name: '',
				id: '',
				format: 'YYYY-MM-DD',
				required: false
			}
		},
		RangePicker: {
			title: '日期范围选择器',
			config: {
				label: {
					name: '标题',
					type: 'text'
				},
				name: {
					name: '字段名(name)',
					type: 'text'
				},
				id: {
					name: '字段(id)',
					type: 'text'
				},
				format: {
					name: '日期格式',
					type: 'selection',
					options: [
						{ name: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
						{ name: 'YYYY-MM-DD HH', value: 'YYYY-MM-DD HH' },
						{ name: 'YYYY-MM-DD HH:mm', value: 'YYYY-MM-DD HH:mm' },
						{ name: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
						{ name: 'YYYY/MM/DD', value: 'YYYY/MM/DD' },
						{ name: 'YYYY/MM/DD HH', value: 'YYYY/MM/DD HH' },
						{ name: 'YYYY/MM/DD HH:mm', value: 'YYYY/MM/DD HH:mm' },
						{ name: 'YYYY/MM/DD HH:mm:ss', value: 'YYYY/MM/DD HH:mm:ss' }
					]
				},
				remark: {
					name: '备注',
					type: 'text'
				},
				initialValue: {
					name: '默认值',
					type: 'rangePicker'
				},
				required: {
					name: '不允许为空',
					type: 'boolean'
				},
				validMsg: {
					name: '为空提示消息',
					type: 'text'
				},
				hiddenType: {
					name: '隐藏模式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: 'NEW(新建时隐藏)', value: 'NEW' },
						{ name: 'EDIT(编辑时隐藏)', value: 'EDIT' },
						{ name: 'READ(阅读时隐藏)', value: 'READ' },
						{ name: '不隐藏(默认)', value: '' }
					]
				},
				readonlyMode: {
					name: '只读模式',
					type: 'selection',
					options: [
						{ name: '新建时只读(不保存数据)', value: 'NEW' },
						{ name: '编辑时只读(不保存数据)', value: 'EDIT' },
						{ name: '全部只读(不保存数据)', value: 'ALL' },
						{ name: '可编辑(默认)', value: '' }
					]
				},
				rule: {
					name: '绑定后端规则',
					type: 'selection',
					options: rules
				},
				ruleOption: {
					name: '规则绑定方式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: '新建（默认）', value: 'NEW' },
						{ name: '编辑', value: 'EDIT' },
						{ name: '阅读', value: 'READ' }
					]
				},
				className: {
					name: 'class',
					type: 'text'
				},
				style: {
					name: 'style',
					type: 'textarea'
				}
			},
			props: {
				name: '',
				id: '',
				format: 'YYYY-MM-DD',
				initialValue: [],
				required: false
			}
		},
		Select: {
			title: '下拉列表',
			config: {
				label: {
					name: '标题',
					type: 'text'
				},
				name: {
					name: '字段名(name)',
					type: 'text'
				},
				id: {
					name: '字段(id)',
					type: 'text'
				},
				remark: {
					name: '备注',
					type: 'text'
				},
				placeholder: {
					name: '占位符',
					type: 'text'
				},
				required: {
					name: '不允许为空',
					type: 'boolean'
				},
				validMsg: {
					name: '为空提示消息',
					type: 'text'
				},
				hiddenType: {
					name: '隐藏模式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: 'NEW(新建时隐藏)', value: 'NEW' },
						{ name: 'EDIT(编辑时隐藏)', value: 'EDIT' },
						{ name: 'READ(阅读时隐藏)', value: 'READ' },
						{ name: '不隐藏(默认)', value: '' }
					]
				},
				readonlyMode: {
					name: '只读模式',
					type: 'selection',
					options: [
						{ name: '新建时只读(不保存数据)', value: 'NEW' },
						{ name: '编辑时只读(不保存数据)', value: 'EDIT' },
						{ name: '全部只读(不保存数据)', value: 'ALL' },
						{ name: '可编辑(默认)', value: '' }
					]
				},
				jsEvent: {
					name: 'JS事件',
					type: 'selection',
					options: [
						{ name: 'onBlur', value: 'onBlur' },
						{ name: 'onChange', value: 'onChange' },
						{ name: 'onFocus', value: 'onFocus' },
						{ name: 'onMouseEnter', value: 'onMouseEnter' },
						{ name: 'onMouseLeave', value: 'onMouseLeave' },
						{ name: 'onSearch', value: 'onSearch' },
						{ name: 'onSelect', value: 'onSelect' },
						{ name: 'onDropdownVisibleChange', value: 'onDropdownVisibleChange' }
					]
				},
				jsFun: {
					name: 'JS事件函数',
					type: 'text'
				},
				rule: {
					name: '绑定后端规则',
					type: 'selection',
					options: rules
				},
				ruleOption: {
					name: '规则绑定方式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: '新建（默认）', value: 'NEW' },
						{ name: '编辑', value: 'EDIT' },
						{ name: '阅读', value: 'READ' }
					]
				},
				options: {
					name: '可选项',
					type: 'editOptions'
				},
				defaultValue: {
					name: '默认值',
					type: 'hidden'
				},
				dropdownClassName: {
					name: 'class',
					type: 'text'
				},
				dropdownStyle: {
					name: 'style',
					type: 'textarea'
				},
				url: {
					group_title: '远程数据',
					name: 'JSON数据源',
					type: 'selectDataSource'
				},
				valueField: {
					group_title: '远程数据',
					name: 'valueField',
					type: 'text'
				},
				textField: {
					group_title: '远程数据',
					name: 'textField',
					type: 'text'
				},
				groupField: {
					group_title: '远程数据',
					name: 'groupField',
					type: 'text'
				}
			},
			props: {
				name: '',
				id: '',
				placeholder: '请选择',
				required: false,
				options: [],
				valueField: 'id',
				textField: 'text'
			}
		},
		Upload: {
			title: '附件上载框',
			config: {
				label: {
					name: '标题',
					type: 'text'
				},
				name: {
					name: '字段名(name)',
					type: 'text'
				},
				id: {
					name: '字段(id)',
					type: 'text'
				},
				remark: {
					name: '备注',
					type: 'text'
				},
				readonlyMode: {
					name: '只读模式',
					type: 'selection',
					options: [
						{ name: '新建时只读(不保存数据)', value: 'NEW' },
						{ name: '编辑时只读(不保存数据)', value: 'EDIT' },
						{ name: '全部只读(不保存数据)', value: 'ALL' },
						{ name: '可编辑(默认)', value: '' }
					]
				}
			},
			props: {
				name: '',
				id: ''
			}
		},
		Radio: {
			title: '单选框',
			config: {
				label: {
					name: '标题',
					type: 'text'
				},
				name: {
					name: '字段名(name)',
					type: 'text'
				},
				id: {
					name: '字段(id)',
					type: 'text'
				},
				remark: {
					name: '备注',
					type: 'text'
				},
				required: {
					name: '不允许为空',
					type: 'boolean'
				},
				validMsg: {
					name: '为空提示消息',
					type: 'text'
				},
				hiddenType: {
					name: '隐藏模式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: 'NEW(新建时隐藏)', value: 'NEW' },
						{ name: 'EDIT(编辑时隐藏)', value: 'EDIT' },
						{ name: 'READ(阅读时隐藏)', value: 'READ' },
						{ name: '不隐藏(默认)', value: '' }
					]
				},
				readonlyMode: {
					name: '只读模式',
					type: 'selection',
					options: [
						{ name: '新建时只读(不保存数据)', value: 'NEW' },
						{ name: '编辑时只读(不保存数据)', value: 'EDIT' },
						{ name: '全部只读(不保存数据)', value: 'ALL' },
						{ name: '可编辑(默认)', value: '' }
					]
				},
				jsEvent: {
					name: 'JS事件',
					type: 'selection',
					options: [ { name: 'onChange', value: 'onChange' } ]
				},
				jsFun: {
					name: 'JS事件函数',
					type: 'text'
				},
				rule: {
					name: '绑定后端规则',
					type: 'selection',
					options: rules
				},
				ruleOption: {
					name: '规则绑定方式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: '新建（默认）', value: 'NEW' },
						{ name: '编辑', value: 'EDIT' },
						{ name: '阅读', value: 'READ' }
					]
				},
				options: {
					name: '可选项',
					type: 'editOptions'
				},
				defaultValue: {
					name: '默认值',
					type: 'hidden'
				},
				className: {
					name: 'class',
					type: 'text'
				},
				style: {
					name: 'style',
					type: 'textarea'
				}
			},
			props: {
				name: '',
				id: '',
				required: false,
				options: [ { key: 'A', label: 'A', value: 'A' }, { key: 'B', label: 'B', value: 'B' } ]
			}
		},
		Checkbox: {
			title: '复选框',
			config: {
				label: {
					name: '标题',
					type: 'text'
				},
				name: {
					name: '字段名(name)',
					type: 'text'
				},
				id: {
					name: '字段(id)',
					type: 'text'
				},
				remark: {
					name: '备注',
					type: 'text'
				},
				required: {
					name: '不允许为空',
					type: 'boolean'
				},
				validMsg: {
					name: '为空提示消息',
					type: 'text'
				},
				hiddenType: {
					name: '隐藏模式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: 'NEW(新建时隐藏)', value: 'NEW' },
						{ name: 'EDIT(编辑时隐藏)', value: 'EDIT' },
						{ name: 'READ(阅读时隐藏)', value: 'READ' },
						{ name: '不隐藏(默认)', value: '' }
					]
				},
				readonlyMode: {
					name: '只读模式',
					type: 'selection',
					options: [
						{ name: '新建时只读(不保存数据)', value: 'NEW' },
						{ name: '编辑时只读(不保存数据)', value: 'EDIT' },
						{ name: '全部只读(不保存数据)', value: 'ALL' },
						{ name: '可编辑(默认)', value: '' }
					]
				},
				jsEvent: {
					name: 'JS事件',
					type: 'selection',
					options: [ { name: 'onChange', value: 'onChange' } ]
				},
				jsFun: {
					name: 'JS事件函数',
					type: 'text'
				},
				rule: {
					name: '绑定后端规则',
					type: 'selection',
					options: rules
				},
				ruleOption: {
					name: '规则绑定方式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: '新建（默认）', value: 'NEW' },
						{ name: '编辑', value: 'EDIT' },
						{ name: '阅读', value: 'READ' }
					]
				},
				options: {
					name: '可选项',
					type: 'editOptions'
				},
				defaultValue: {
					name: '默认值',
					type: 'hidden'
				},
				className: {
					name: 'class',
					type: 'text'
				},
				style: {
					name: 'style',
					type: 'textarea'
				}
			},
			props: {
				name: '',
				id: '',
				required: false,
				options: [ { key: 'A', label: 'A', value: 'A' }, { key: 'B', label: 'B', value: 'B' } ]
			}
		},
		TreeSelect: {
			title: '树选择',
			config: {
				label: {
					name: '标题',
					type: 'text'
				},
				name: {
					name: '字段名(name)',
					type: 'text'
				},
				id: {
					name: '字段(id)',
					type: 'text'
				},
				remark: {
					name: '备注',
					type: 'text'
				},
				initialValue: {
					name: '默认值',
					type: 'text'
				},
				required: {
					name: '不允许为空',
					type: 'boolean'
				},
				validMsg: {
					name: '为空提示消息',
					type: 'text'
				},
				showCheckedStrategy: {
					name: '选中项回填方式',
					type: 'selection',
					options: [
						{ name: '子节点', value: 'SHOW_CHILD' },
						{ name: '父节点', value: 'SHOW_PARENT' },
						{ name: '所有节点(包括父节点)', value: 'SHOW_ALL' }
					]
				},
				treeCheckable: {
					name: '多选',
					type: 'boolean'
				},
				hiddenType: {
					name: '隐藏模式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: 'NEW(新建时隐藏)', value: 'NEW' },
						{ name: 'EDIT(编辑时隐藏)', value: 'EDIT' },
						{ name: 'READ(阅读时隐藏)', value: 'READ' },
						{ name: '不隐藏(默认)', value: '' }
					]
				},
				readonlyMode: {
					name: '只读模式',
					type: 'selection',
					options: [
						{ name: '新建时只读(不保存数据)', value: 'NEW' },
						{ name: '编辑时只读(不保存数据)', value: 'EDIT' },
						{ name: '全部只读(不保存数据)', value: 'ALL' },
						{ name: '可编辑(默认)', value: '' }
					]
				},
				rule: {
					name: '绑定后端规则',
					type: 'selection',
					options: rules
				},
				ruleOption: {
					name: '规则绑定方式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: '新建（默认）', value: 'NEW' },
						{ name: '编辑', value: 'EDIT' },
						{ name: '阅读', value: 'READ' }
					]
				},
				className: {
					name: 'class',
					type: 'text'
				},
				style: {
					name: 'style',
					type: 'textarea'
				},
				url: {
					group_title: '远程数据',
					name: 'TreeJson Url',
					type: 'selectDataSource'
				},
				valueField: {
					group_title: '远程数据',
					name: 'valueField',
					type: 'text'
				},
				textField: {
					group_title: '远程数据',
					name: 'textField',
					type: 'text'
				},
				groupField: {
					group_title: '远程数据',
					name: 'groupField',
					type: 'text'
				}
			},
			props: {
				name: '',
				id: '',
				required: false,
				showCheckedStrategy: 'SHOW_CHILD',
				treeCheckable: false,
				valueField: 'id',
				textField: 'text'
			}
		},
		Tabs: {
			title: 'Tabs',
			config: {
				options: {
					name: '页签',
					type: 'editOptions'
				},
				tabPosition: {
					name: '页签位置',
					type: 'selection',
					options: [
						{ name: 'top', value: 'top' },
						{ name: 'right', value: 'right' },
						{ name: 'bottom', value: 'bottom' },
						{ name: 'left', value: 'left' }
					]
				},
				type: {
					name: '页签的基本样式',
					type: 'selection',
					options: [ { name: 'line', value: 'line' }, { name: 'card', value: 'card' } ]
				},
				defaultValue: {
					name: '默认值',
					type: 'hidden'
				}
			},
			props: {
				options: [
					{ key: guid(), label: '选项卡1', value: guid() },
					{ key: guid(), label: '选项卡2', value: guid() },
					{ key: guid(), label: '选项卡3', value: guid() }
				],
				tabPosition: 'top',
				type: 'line'
			},
			children: []
		},
		DynamicTable: {
			title: '表格',
			config: {
				name: { name: '字段名(name)', type: 'text' },
				id: { name: '字段(id)', type: 'text' },
				title: { name: '表格标题', type: 'text' },
				columns: {
					name: '表头配置',
					type: 'table'
				},
				dataSource: {
					name: '',
					type: 'hidden'
				},
				operations: {
					name: '表格操作',
					type: 'selection',
					mode: 'multiple',
					options: [ { name: '添加', value: '添加' }, { name: '删除', value: '删除' } ]
				},
				showRowSelection: { name: '显示选择框', type: 'boolean' },
				pagination: { name: '显示分页', type: 'boolean' },
				readonlyMode: { name: '只读模式', type: 'boolean' },
				tableName: { name: '保存的数据表', type: 'text' }
			},
			props: {
				name: '',
				id: '',
				title: '',
				columns: [
					{ title: '姓名', dataIndex: 'name', key: 'name', is_container: true },
					{ title: '年龄', dataIndex: 'age', key: 'age' }
				],
				dataSource: [
					{
						key: '1',
						name: '111',
						age: 32
					},
					{
						key: '2',
						name: '222',
						age: 32
					}
				],
				operations: [],
				showRowSelection: false,
				pagination: false,
				readonlyMode: false
			},
			children: []
		},
		XField: {
			title: '计算域',
			config: {
				name: {
					name: '字段名(name)',
					type: 'text'
				},
				id: {
					name: '字段(id)',
					type: 'text'
				},
				remark: {
					name: '备注',
					type: 'text'
				},
				// dictionary: {
				// 	name: '绑定数据字典',
				// 	type: 'selection',
				// 	options: [],
				// 	value: []
				// },
				rule: {
					name: '绑定后端规则',
					type: 'selection',
					options: rules
				},
				ruleOption: {
					name: '规则绑定方式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: '新建（默认）', value: 'NEW' },
						{ name: '编辑', value: 'EDIT' },
						{ name: '阅读', value: 'READ' }
					]
				}
			},
			props: {
				name: '',
				id: '',
				remark: '{xfield}'
			}
		},
		SelWenHao: {
			title: '选择文号',
			config: {
				label: {
					name: '标题',
					type: 'text'
				},
				name: {
					name: '字段名(name)',
					type: 'text'
				},
				id: {
					name: '字段(id)',
					type: 'text'
				},
				remark: {
					name: '备注',
					type: 'text'
				},
				initialValue: {
					name: '默认值',
					type: 'text'
				},
				required: {
					name: '不允许为空',
					type: 'boolean'
				},
				validMsg: {
					name: '为空提示消息',
					type: 'text'
				},
				selector: {
					name: '绑定选择器',
					type: 'selection',
					options: selectorList
				},
				hiddenType: {
					name: '隐藏模式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: 'NEW(新建时隐藏)', value: 'NEW' },
						{ name: 'EDIT(编辑时隐藏)', value: 'EDIT' },
						{ name: 'READ(阅读时隐藏)', value: 'READ' },
						{ name: '不隐藏(默认)', value: '' }
					]
				},
				readonlyMode: {
					name: '只读模式',
					type: 'selection',
					options: [
						{ name: '新建时只读(不保存数据)', value: 'NEW' },
						{ name: '新建时只读(需保存数据)', value: 'NEWSAVE' },
						{ name: '编辑时只读(不保存数据)', value: 'EDIT' },
						{ name: '编辑时只读(需保存数据)', value: 'EDITSAVE' },
						{ name: '全部只读(不保存数据)', value: 'ALL' },
						{ name: '全部只读(需保存数据)', value: 'ALLSAVE' },
						{ name: '可编辑(默认)', value: '' }
					]
				},
				jsEvent: {
					name: 'JS事件',
					type: 'selection',
					options: [ { name: 'onClick', value: 'onClick' } ]
				},
				jsFun: {
					name: 'JS事件函数',
					type: 'text'
				},
				rule: {
					name: '绑定后端规则',
					type: 'selection',
					options: rules
				},
				ruleOption: {
					name: '规则绑定方式',
					type: 'selection',
					mode: 'multiple',
					options: [
						{ name: '新建（默认）', value: 'NEW' },
						{ name: '编辑', value: 'EDIT' },
						{ name: '阅读', value: 'READ' }
					]
				},
				maxLength: {
					name: '长度',
					type: 'text'
				},
				className: {
					name: 'class',
					type: 'text'
				},
				style: {
					name: 'style',
					type: 'textarea'
				}
			},
			props: {
				name: 'WenHao',
				id: 'WenHao',
				remark: '文号',
				required: false
			}
		},
		WordZengWen: {
			title: 'Word正文',
			config: {
				name: {
					name: '字段名(name)',
					type: 'text'
				},
				id: {
					name: '字段(id)',
					type: 'text'
				},
				remark: {
					name: '备注',
					type: 'text'
				},
				content: {
					name: '按钮文字',
					type: 'text'
				},
				icon: {
					name: '图标',
					type: 'text'
				},
				jsEvent: {
					name: 'JS事件',
					type: 'selection',
					options: [ { name: 'onClick', value: 'onClick' } ]
				},
				jsFun: {
					name: 'JS事件函数',
					type: 'text'
				},
				className: {
					name: 'class',
					type: 'text'
				},
				style: {
					name: 'style',
					type: 'textarea'
				}
			},
			props: {
				name: 'WordZengWen',
				id: 'WordZengWen',
				content: 'Word正文',
				icon: 'file-word',
				jsFun: 'OpenWordDoc'
			}
		},
		Remark: {
			title: '流转记录',
			config: {
				name: {
					name: '字段名(name)',
					type: 'text'
				},
				id: {
					name: '字段(id)',
					type: 'text'
				},
				remark: {
					name: '备注',
					type: 'text'
				},
				type: {
					name: '意见类型',
					type: 'text'
				}
			},
			props: {
				name: 'remark',
				id: 'remark',
				remark: '{流转记录}',
				type: 'ALL'
			}
		}
	};
	return typeMap[type];
};
