/**
 * @Description: 全局校验的正则表达式
 * @author weishihuai
 * @date 2020/4/22 9:57
 */
export const RegRules = {
	//校验分值(最多支持两位正小数)
	FS_REG_EXP_RULE: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
	//校验分值(最多支持正负两位小数)
	NEG_FS_REG_EXP_RULE: /^[\-\+]?(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
};

//生成UUID
export const createUuid = () => {
	let s = [];
	let hexDigits = '0123456789abcdef';
	for (let i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = '-';
	let uuid = s.join('');
	return uuid;
};

export const getTreeToList = tree => {
	const _tree = JSON.parse(JSON.stringify(tree));
	let res = [];
	// 遍历数据,合并对象
	const getList = (arr, obj) => {
		// 没有子集的时候把整个对象添加到数组（添加id，以便于进行单选操作）
		// type 是添加的类型的，多添加一条数据
		if (!arr[0] || obj.type == 'add') {
			res.push({
				...obj,
				id: `${obj.id_4}-${obj.id_3}-${obj.id_2}-${obj.id_1}`,
			});
		}
		for (let index = 0; index < arr.length; index++) {
			const item = arr[index];
			item.children = item.children || [];
			const _children = JSON.parse(JSON.stringify(item.children));
			// 如果是可以添加子集的类型，直接把数据全部添加
			delete item.children;
			getList(_children, { ...obj, ...item });
		}
	};

	for (let index = 0; index < _tree.length; index++) {
		const element = _tree[index];
		element.children = element.children || [];
		const _children = JSON.parse(JSON.stringify(element.children));
		delete element.children;
		// 第一级特殊处理，多添加一条数据
		if (element.type == 'batch') {
			// 审批意见直接添加
			res.push(element);
		} else {
			res.push({
				type: 'title',
				...element,
			});
			getList(_children, element);
		}
	}
	return res;
};