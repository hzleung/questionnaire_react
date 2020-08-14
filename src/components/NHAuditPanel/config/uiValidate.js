/**
 * 自定义校验
 */

// 正则表达式
const pattern = {
	integer: /^[+]?[1-9]+\d*$/i,
	phone: /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i,
	english: /^[A-Za-z]+$/i,
	email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	url: new RegExp(
		'^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
		'i'
	),
	intOrFloat: /^\d+(\.\d+)?$/i
};

// 验证信息提示
const message = {
	integer: '请输入整数',
	phone: '格式不正确,请使用下面格式:020-88888888',
	english: '请输入英文',
	email: '邮箱格式不正确',
	url: 'url格式不正确',
	intOrFloat: '请输入数字，并确保格式正确',
	equalTo: '两次输入值不相等',
	length: (min, max) => `请输入${min}~${max}个字符`
};

const uiValidate = {
	integer(rule, value, cb) {
		if (value && !pattern.integer.test(value)) {
			cb(message.integer);
		} else {
			cb();
		}
	},
	phone(rule, value, cb) {
		if (value && !pattern.phone.test(value)) {
			cb(message.phone);
		} else {
			cb();
		}
	},
	url(rule, value, cb) {
		if (value && !pattern.url.test(value)) {
			cb(message.url);
		}
	},
	equalTo(rule, value, cb, param) {
		if (value && value != param) {
			cb(message.equalTo);
		} else {
			cb();
		}
	},
	english(rule, value, cb) {
		if (value && !pattern.english.test(value)) {
			cb(message.english);
		} else {
			cb();
		}
	},
	length(rule, value, cb, param) {
		const min = param[0] * 1,
			max = param[1] * 1;
		if (value && (value.length < min || value.length > max)) {
			cb(message.length(min, max));
		} else {
			cb();
		}
	},
	email(rule, value, cb) {
		if (value && !pattern.email.test(value)) {
			cb(message.email);
		} else {
			cb();
		}
	},
	intOrFloat(rule, value, cb) {
		if (value && !pattern.intOrFloat.test(value)) {
			cb(message.intOrFloat);
		} else {
			cb();
		}
	}
};
export default uiValidate;
