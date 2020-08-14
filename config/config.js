/*
 * @Description: umi配置【https://umijs.org/config/】
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: zengweijin
 * @LastEditTime: 2020-07-15 15:00:19
 */
import pageRoutes from './router.config';
import theme from '../src/theme';
import webpackPlugin from './plugin.config';
import PxToRem from 'postcss-pxtorem';

// 插件
const plugins = [
	[
		'umi-plugin-react',
		{
			antd: true,
			dva: {
				hmr: true,
			},
			dynamicImport: {
				loadingComponent: './components/PageLoading/index',
				webpackChunkName: true,
			},
			pwa: false,
			title: {
				defaultTitle: '移动学工',
			},
			dll: false,
			hd: false,
			fastClick: false,
			routes: {
				exclude: [],
			},
			hardSource: false,
		},
	],
];

export default {
	// add for transfer to umi
	base: '',
	publicPath: './',
	outputPath: './dist',
	cssPublicPath: '../../',
	define: {
		APP_TYPE: process.env.APP_TYPE || '',
	},
	history: 'hash', // 默认是 browser
	plugins,
	//   exportStatic: {},
	// 路由配置
	routes: pageRoutes,
	// Theme for antd-mobile
	// https://mobile.ant.design/docs/react/customize-theme-cn
	theme: {
		'brand-primary': theme.primaryColor,
		'brand-primary-tap': theme.brandPrimaryTap,
	},
	extraPostCSSPlugins: [
		PxToRem({
			rootValue: 50,
			propWhiteList: [],
		}),
	],
	copy: [
		{
			from: 'src/assets/js',
			to: 'assets/js',
		},
	],
	externals: {},
	lessLoaderOptions: {
		javascriptEnabled: true,
	},
	cssModulesExcludes: ['src\\assets\\css\\global.less', 'src\\assets\\css\\animation.less'],
	cssnano: {
		mergeRules: false,
	},
	targets: {
		android: 5,
		chrome: 58,
		edge: 13,
		firefox: 45,
		ie: 9,
		ios: 7,
		safari: 10,
	},
	hash: true,
	alias: {},
	// 代理配置，开发调试时放开target和pathRewrite即可，无新增代理配置时不要提交此文件
	proxy: {
		'/login': {
			target: 'http://192.168.35.105:1101',
			secure: false,
			changeOrigin: true,
		},
		'/logout': {
			target: 'http://192.168.35.105:1101',
			secure: false,
			changeOrigin: true,
		},
		'/api/authc': {
			target: 'http://192.168.35.105:1101',
			secure: false,
			changeOrigin: true,
		},
		'/api/sm-mobile': {
			target: 'http://192.168.35.105:1101',
			// target: 'http://127.0.0.1:6552',
			secure: false,
			changeOrigin: true,
			// pathRewrite: { '^/api/sm-mobile': '' },
		},
		'/api/zhxg-xtgl': {
			target: 'http://192.168.35.105:1101',
			// target: 'http://127.0.0.1:6022',
			secure: false,
			changeOrigin: true,
			// pathRewrite: { '^/api/zhxg-xtgl': '' },
		},
		'/api/zhxg-xgdw': {
			target: 'http://192.168.35.105:1101',
			// target: 'http://127.0.0.1:6032',
			secure: false,
			changeOrigin: true,
			// pathRewrite: { '^/api/zhxg-xgdw': '' },
		},
		'/api/sm-student': {
			target: 'http://192.168.35.105:1101',
			// target: 'http://127.0.0.1:6042',
			secure: false,
			changeOrigin: true,
			// pathRewrite: { '^/api/sm-student': '' },
		},
		'/api/sm-holiday': {
			target: 'http://192.168.35.105:1101',
			// target: 'http://127.0.0.1:6182',
			secure: false,
			changeOrigin: true,
			// pathRewrite: { '^/api/sm-holiday': '' },
		},
		'/api/sm-punish': {
			target: 'http://192.168.35.105:1101',
			//target: 'http://127.0.0.1:6192',
			secure: false,
			changeOrigin: true,
			//pathRewrite: { '^/api/sm-punish': '' },
		},
		'/api/sm-work-study': {
			target: 'http://192.168.35.105:1101',
			// target: 'http://127.0.0.1:6272',
			secure: false,
			changeOrigin: true,
			// pathRewrite: { '^/api/sm-work-study': '' },
		},
		'/api/sm-comprehensive-evaluation': {
			target: 'http://192.168.35.105:1101',
			// target: 'http://127.0.0.1:6222',
			secure: false,
			changeOrigin: true,
			// pathRewrite: { '^/api/sm-comprehensive-evaluation': '' },
		},
		'/api/sm-scholarship': {
			target: 'http://192.168.35.105:1101',
            // target: "http://127.0.0.1:6232",
            secure: false,
            changeOrigin: true,
            // pathRewrite:{'^/api/sm-scholarship':''}
        },
        '/api/sm-student-grant': {
			target: 'http://192.168.35.105:1101',
            // target: "http://127.0.0.1:6252",
            secure: false,
            changeOrigin: true,
            // pathRewrite:{'^/api/sm-student-grant':''}
        },
        '/api/sm-honorary-title': {
            target: "http://192.168.35.105:1101",
            secure: false, // 接受 运行在 https 上的服务
            changeOrigin: true,
           // pathRewrite:{'^/api/sm-honorary-title':''}
        },
		'/front/zhxg-unauth': {
			target: 'http://192.168.35.105:1101',
			// target: 'http://127.0.0.1:6062',
			secure: false,
			changeOrigin: true,
			// pathRewrite: { '^/front/zhxg-unauth': '' },
		},
		'/api/sm-difficult-student': {
			target: 'http://192.168.35.105:1101',
			// target: 'http://127.0.0.1:6062',
			secure: false,
			changeOrigin: true,
			// pathRewrite: { '^/front/zhxg-unauth': '' },
		},
		'/api/sm-bpm-expansion': {
			target: 'http://192.168.35.105:1101',
			//target: 'http://127.0.0.1:6932',
			secure: false,
			changeOrigin: true,
			//pathRewrite: { '^/api/sm-bpm-expansion': '' },
		},
		'/api/sm-dynamic-form': {
			target: 'http://192.168.35.105:1101',
			// target: 'http://127.0.0.1:6922',
			secure: false,
			changeOrigin: true,
			// pathRewrite: { '^/api/sm-dynamic-form': '' },
		},
		'/api/sm-qualification': {
			target: 'http://192.168.35.105:1101',
			// target: 'http://127.0.0.1:6912',
			secure: false,
			changeOrigin: true,
			// pathRewrite: { '^/api/sm-dynamic-form': '' },
		},
		'/zuul/docrepo/*': {
			target: 'http://192.168.35.105:1101',
			secure: false,
			changeOrigin: true,
		},
		'/bpm': {
			target: "http://192.168.35.106:7777",
			secure: false, // 接受 运行在 https 上的服务
			changeOrigin: true
        },
        '/tryLoginUserInfo':{
            target: "http://192.168.35.105:1101",
			secure: false, // 接受 运行在 https 上的服务
			changeOrigin: true
        }
	},
	ignoreMomentLocale: true,
	//   manifest: {
	//     basePath: './',
	//   },
	chainWebpack: webpackPlugin,
};
