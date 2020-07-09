module.exports = {
	"root": true,
	"env": {
		"node": true,
		"browser": true
	},
	"extends": [
		"airbnb-base",
		"plugin:vue/essential"
	],
	"rules": {
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
		"no-console": process.env.NODE_ENV === "production" ? "error" : "off",
		"no-alert": process.env.NODE_ENV === "production" ? "error" : "off",
		'max-len': [
			'error',
			{
				code: 200,
			},
		],
		"vue/html-self-closing": "off", //自动闭合vue标签
		"vue/no-unused-components": "off", // 检测未使用的components
		"import/no-unresolved": "off",
		"import/extensions": "off",
		"arrow-body-style": "off",
		"arrow-parens": "off",
		"no-plusplus": "off", //不允许使用“++”运算符
		"no-underscore-dangle": "off", //不允许使用“_”作为变量的开头
		"no-else-return": "off", //如果if有return 不允许else if、else中含return
		"prefer-template": "error", //不允许使用 + 连接字符串
		"no-restricted-syntax": "off", //不允许使用指定语法
		"prefer-destructuring": "off", //推荐使用解构赋值，不允许访问对象成员赋值
		"operator-assignment": "off", //要求或不允许赋值运算符速记
		"no-param-reassign": "off", // 禁止对参数重新赋值
		"no-self-import": "off",
		"no-nested-ternary": "off", // 禁止嵌套的三目运算符
		"no-prototype-builtins": "off", // 禁止直接调用 Object.prototypes 的内置属性
		"no-unused-expressions": "off",
		"linebreak-style": "off",// 统一换行符
	},
	"parserOptions": {
		"parser": "babel-eslint"
	},
};