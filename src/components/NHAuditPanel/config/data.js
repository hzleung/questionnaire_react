// 控件菜单
export const menuData = [
	{
		key: 'base',
		title: '基础控件',
		children: [
			{
				key: 'MergeTable',
				type: 'MergeTable',
				title: '表格布局'
			},
			{
				key: 'div',
				type: 'div',
				title: 'div 通用布局块'
			},
			{
				key: 'p',
				type: 'p',
				title: '块状文本'
			},
			{
				key: 'Row',
				type: 'Row',
				title: '栅格布局'
			},
			{
				key: 'Input',
				type: 'Input',
				title: 'Input 输入框'
			},
			{
				key: 'Select',
				type: 'Select',
				title: 'Select 选择器'
			},
			{
				key: 'TreeSelect',
				type: 'TreeSelect',
				title: 'TreeSelect 树选择'
			},
			{
				key: 'Checkbox',
				type: 'Checkbox',
				title: 'Checkbox 复选框'
			},
			{
				key: 'Radio',
				type: 'Radio',
				title: 'Radio 单选框'
			},
			{
				key: 'Button',
				type: 'Button',
				title: 'Button 按钮'
			},
			{
				key: 'DatePicker',
				type: 'DatePicker',
				title: '日期选择框'
			},
			{
				key: 'RangePicker',
				type: 'RangePicker',
				title: '日期范围选择框'
			},
			{
				key: 'Upload',
				type: 'Upload',
				title: 'Upload 上传'
			},
			{
				key: 'Tabs',
				type: 'Tabs',
				title: 'Tabs 标签'
			},
			{
				key: 'DynamicTable',
				type: 'DynamicTable',
				title: '动态表格'
			},
			{
				key: 'XField',
				type: 'XField',
				title: '计算域'
			}
		]
	},
	{
		key: 'flow',
		title: '流程相关控件',
		children: [
			{
				key: 'SelWenHao',
				type: 'SelWenHao',
				title: '选择文号'
			},
			{
				key: 'Remark',
				type: 'Remark',
				title: '流转记录'
			},
			{
				key: 'WordZengWen',
				type: 'WordZengWen',
				title: 'Word 正文'
			}
		]
	}
];

// 表格布局--右键菜单
export const contextmenu = [
	{
		key: 'mergeCells',
		name: '合并单元格'
	},
	{
		key: 'insertRowBefore',
		name: '前插入行'
	},
	{
		key: 'insertRowAfter',
		name: '后插入行'
	},
	{
		key: 'insertColumnBefore',
		name: '左插入列'
	},
	{
		key: 'insertColumnAfter',
		name: '右插入列'
	},
	{
		key: 'deleteRow',
		name: '删除行'
	},
	{
		key: 'deleteColumn',
		name: '删除列'
	},
	{
		key: 'setBgColor',
		name: '设置背景颜色'
	}
];

// 流程节点--处理单按钮配置
// 包括以下功能:
// GoToNextParallelUser(提交下一会签用户),
// Undo(收回文档)
// GoToFirstNode(回退首环节),
// GoToPrevNode(回退上一环节) ,
// Pause(暂停),
// EndCopyTo(标记为阅),
// EndUserTask(办理完成),
// GoToOthers(转他人处理),
// GoToArchived(归档),
// GoToAnyNode(提交任意环节),
// GoToPrevUser(回退上一用户),
// ReturnToAnyNode(回退任意环节),
// BackToDeliver(返回给转交者),
// UnPause(恢复),
// GoToNextSerialUser(提交下一串行用户),
// BackToReturnUser(返回给回退者),
// CopyTo(传阅用户)
export const btnActionIdMap = {
	BU1001: 'EndUserTask',
	BU1002: 'GoToOthers',
	BU1003: 'GoToPrevUser',
	BU1004: 'GoToPrevNode',
	BU1005: 'GoToFirstNode',
	BU1006: 'BackToDeliver',
	BU1007: 'BackToReturnUser',
	BU1008: 'ReturnToAnyNode',
	BU1009: '', //提交下一审批用户
	BU1010: '', //完成会签
	BU1011: '', // 完成会签(不同意)
	BU1012: '', // 完成会签(同意)
	BU1022: '', //暂存文档
	BU1024: '', // 拷贝到草稿箱
	BU1025: '', // 自定义按扭
	BU1026: 'GoToArchived'
};

