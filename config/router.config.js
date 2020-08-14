/*
 * @Description: 路由配置
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: zengweijin
 * @LastEditTime: 2020-07-06 10:51:41
 */

export default [
	// 登录页面
	{
		path: '/user',
		component: '../layouts/userLayout',
		routes: [
			{ path: '/user', redirect: '/user/login' },
			{ path: '/user/login', component: './user/login' },
		],
	},
	// 综合测评
	{
		path: '/studentEvaluation',
		Routes: ['src/pages/Authorized'],
		authority: 'ly-sm-mobile-svc_evaluation_student',
		routes: [
			{
				path: '/studentEvaluation',
				redirect: '/studentEvaluation/evaluationMain/index',
			},
			{
				path: '/studentEvaluation/evaluationMain/index',
				title: '综合测评',
				component: './studentEvaluation/evaluationMain/index',
			},
			{
				path: '/studentEvaluation/evaluation/index',
				title: '综合测评',
				component: './studentEvaluation/evaluation/index',
			},
			{
				path: '/studentEvaluation/evaluationResult/index',
				title: '综合测评',
				component: './studentEvaluation/evaluationResult/index',
			},
		],
    },
    // 综合测评结果详情
    {
        path: '/teacher/evaluation/student/result',
        Routes: ['src/pages/Authorized'],
        authority: 'ly-sm-mobile-zhcp-teacher-menu',
        routes:[
            {
				path: '/teacher/evaluation/student/result',
				title: '综合测评',
				component: './studentEvaluation/evaluationResult/index',
			}
        ]
    },
    // 综合测评-教师
	{
        path: '/teacher/evaluation',
        component:'../layouts/basicLayout',
		Routes: ['src/pages/Authorized'],
		authority: 'ly-sm-mobile-zhcp-teacher-menu',
		routes: [
			{
				path: '/teacher/evaluation/index',
				title: '选择查看数据范围',
				component: './teacherEvaluation/index',
            },
            {
				path: '/teacher/evaluation/task',
				title: '综合测评',
				component: './teacherEvaluation/task',
            },
            {
				path: '/teacher/evaluation/school/index',
				title: '统测详情',
				component: './teacherEvaluation/school/index',
            },
            {
				path: '/teacher/evaluation/grade/index',
				title: '统测详情',
				component: './teacherEvaluation/grade/index',
            },
            {
				path: '/teacher/evaluation/class/index',
				title: '统测详情',
				component: './teacherEvaluation/class/index',
            },
            {
				path: '/teacher/evaluation/student/index',
				title: '统测详情',
				component: './teacherEvaluation/student/index',
            },
            // {
			// 	path: '/teacher/evaluation/student/result',
			// 	title: '综合测评',
			// 	component: './studentEvaluation/evaluationResult/index',
			// }
		],
    },
    // 奖学金-教师
    {
        path:'/scholarship/teacher',
        component:'../layouts/basicLayout',
        Routes: ['src/pages/Authorized'],
        authority: 'ly-sm-mobile-scholarship-teacher-menu',
        routes:[
            {
				path: '/scholarship/teacher/index',
				title: '选择查看数据范围',
				component: './scholarship/teacher/index',
            },
            {
				path: '/scholarship/teacher/pieStatistics/index',
				title: '奖学金',
				component: './scholarship/teacher/pieStatistics/index',
			},
            {
				path: '/scholarship/teacher/detail/index',
				title: '奖学金',
				component: './scholarship/teacher/detail/index',
			},
        ]
	},
	// 奖学金-学生
	{
		path:'/scholarship/student',
		component:'../layouts/basicLayout',
		Routes: ['src/pages/Authorized'],
		authority: 'ly-sm-mobile-scholarship-student-menu',
		routes:[
			{
				path: '/scholarship/student/index',
				title: '奖学金',
				component: './scholarship/student/index',
			},
			{
				path: '/scholarship/student/detail/index',
				title: '申请详情',
				component: './scholarship/student/detail/index',
			},
		]
	},
    // 助学金-教师
    {
        path:'/grant/teacher',
        component:'../layouts/basicLayout',
        Routes: ['src/pages/Authorized'],
        authority: 'ly-sm-mobile-grant-teacher-menu',
        routes:[
            {
				path: '/grant/teacher/index',
				title: '选择查看数据范围',
				component: './grant/teacher/index',
            },
            {
				path: '/grant/teacher/pieStatistics/index',
				title: '助学金',
				component: './grant/teacher/pieStatistics/index',
			},
            {
				path: '/grant/teacher/detail/index',
				title: '助学金',
				component: './grant/teacher/detail/index',
			},
        ]
	},
	// 助学金-学生
	{
		path:'/grant/student',
		component:'../layouts/basicLayout',
		Routes: ['src/pages/Authorized'],
		authority: 'ly-sm-mobile-grant-student-menu',
		routes:[
			{
				path: '/grant/student/index',
				title: '助学金',
				component: './grant/student/index',
			},
			{
				path: '/grant/student/detail/index',
				title: '申请详情',
				component: './grant/student/detail/index',
			},
		]
	},
    // 荣誉称号-教师
    {
        path:'/honorary/teacher',
        component:'../layouts/basicLayout',
        Routes: ['src/pages/Authorized'],
        authority: 'ly-sm-mobile-honorary-teacher-menu',
        routes:[
            {
				path: '/honorary/teacher/index',
				title: '选择查看数据范围',
				component: './honorary/teacher/index',
            },
            {
				path: '/honorary/teacher/pieStatistics/index',
				title: '荣誉称号',
				component: './honorary/teacher/pieStatistics/index',
			},
            {
				path: '/honorary/teacher/detail/index',
				title: '荣誉称号',
				component: './honorary/teacher/detail/index',
			},
        ]
	},
	// 荣誉称号-学生
	{
		path:'/honorary/student',
		component:'../layouts/basicLayout',
		Routes: ['src/pages/Authorized'],
		authority: 'ly-sm-mobile-honorary-student-menu',
		routes:[
			{
				path: '/honorary/student/index',
				title: '荣誉称号',
				component: './honorary/student/index',
			},
			{
				path: '/honorary/student/detail/index',
				title: '申请详情',
				component: './honorary/student/detail/index',
			},
		]
	},
	// 请假管理-教师
	{
		path: '/sm-holiday/teacher',
		component: '../layouts/basicLayout',
		Routes: ['src/pages/Authorized'],
		authority: 'ly-sm-mobile-svc_holiday_teacher',
		routes: [
			{
				path: '/sm-holiday/teacher',
				redirect: '/sm-holiday/teacher/index',
			},
			{
				path: '/sm-holiday/teacher/index',
				title: '选择查看数据范围',
				component: './sm-holiday/teacher/index',
			},
			{
				path: '/sm-holiday/teacher/pieStatistics',
				title: '请假统计',
				component: './sm-holiday/teacher/pieStatistics/index',
			},
			{
				path: '/sm-holiday/teacher/academyStatistics',
				title: '请假统计',
				component: './sm-holiday/teacher/academyStatistics/index',
			},
			{
				path: '/sm-holiday/teacher/gradeStatistics',
				title: '请假统计',
				component: './sm-holiday/teacher/gradeStatistics/index',
			},
			{
				path: '/sm-holiday/teacher/classStatistics',
				title: '请假统计',
				component: './sm-holiday/teacher/classStatistics/index',
			},
		],
	},
	// 请假管理-学生
	{
		path: '/sm-holiday/student',
		component: '../layouts/basicLayout',
		Routes: ['src/pages/Authorized'],
		authority: 'ly-sm-mobile-svc_holiday_student',
		routes: [
			{
				path: '/sm-holiday/student',
				redirect: '/sm-holiday/student/index',
			},
			{
				path: '/sm-holiday/student/index',
				title: '请假管理',
				component: './sm-holiday/student/index',
			},
			{
				path: '/sm-holiday/student/index/details',
				title: '请假管理',
				component: './sm-holiday/student/details/index',
			},
		],
	},
	//违纪处分-学生
	{
		path: '/sm-punish/student',
		component: '../layouts/basicLayout',
		authority:'ly-sm-mobile-svc_punish_student',
		routes: [
			//违纪处分-学生页面
			{
				path: '/sm-punish/student',
				redirect: '/sm-punish/student/index',
			},
			{
				path: '/sm-punish/student/index',
				title: '违纪处分',
				component: './sm-punish/student/index',
			},
			{
				path: '/sm-punish/student/violationDetial',
				title: '处分详情',
				component: './sm-punish/student/violationDetial/index',
			},
			{
				path: '/sm-punish/student/violationDetial/appealForm',
				title: '处分申诉',
				component: './sm-punish/student/violationDetial/appealForm/index',
			},

		],
	},

	//违纪处分-教师
	{
		path: '/sm-punish/teacher',
		component: '../layouts/basicLayout',
		authority:'ly-sm-mobile-svc_punish_teacher',
		routes: [
			//违纪处分-教师页面
			{
				path: '/sm-punish/teacher',
				redirect: '/sm-punish/teacher/index',
			},
			{
				path: '/sm-punish/teacher/index',
				title: '违纪处分',
				component: './sm-punish/teacher/index',
			},
			{
				path: '/sm-punish/teacher/leaveAdministrationDetial',
				title: '违纪处分详情',
				component: './sm-punish/teacher/leaveAdministrationDetial/index',
			},
		],
	},
	//发起申请
	{
		path: '/startApply',
		component: '../layouts/basicLayout',
		routes: [
			{
				path: '/startApply',
				redirect: '/startApply/index',
			},
			{
				path: '/startApply/index',
				title: '发起申请',
				component: './homePage/startApply/index',
			},
		],
	},
	//个人信息
	{
		path: '/personalInfo',
		component: '../layouts/basicLayout',
		routes: [
			{
				path: '/personalInfo',
				redirect: '/personalInfo/index',
			},
			{
				path: '/personalInfo/index',
				title: '个人信息',
				component: './homePage/personalInfo/index',
			},
		],
	},
	{
		path: '/process',
		component: '../layouts/basicLayout',
		routes: [
			{
				path: '/process/apply/:processId/:docUnid?',
				title: '流程申请',
				component: './process/apply/index',
            },
            {
				path: '/process/selector/student/index',
				title: '学生选择',
				component: './process/selector/student/index',
			},
		],
	},
	// 移动端bpm流程办理中心
	{
		path: '/processCenter',
		component: '../layouts/basicLayout',
		routes: [
			{
				path: '/processCenter/index',
				title: '事务待办',
				component: './processCenter/index',
			},
		],
	},

	// 移动端学生信息采集
	{
		path: '/studentInfoCollect',
		component: '../layouts/basicLayout',
		authority:'ly-sm-mobile-xsxxcj-student_menu',
		routes: [
			{
				path: '/studentInfoCollect',
				redirect: '/studentInfoCollect/record',
			},
			{
				path: '/studentInfoCollect/record',
				title: '信息采集',
				component: './studentInfoCollect/record/index',
			},
			{
				path:'/studentInfoCollect/form/:dtbdid/:xsid/:txid/:cjzt',
				title:'信息填写',
				component:'./studentInfoCollect/form/form',
			},
		],
	},

	// 移动端学生信息统计
	{
		path: '/studentInfoStatistics',
		component: '../layouts/basicLayout',
		authority:'ly-sm-mobile-xsxx-teacher_menu',
		routes: [
			{
				path: '/studentInfoStatistics',
				redirect: '/studentInfoStatistics/index',
			},
			{
				path: '/studentInfoStatistics/index',
				title: '学生信息统计',
				component: './studentInfoStatistics/index',
			},

		],
	},


	// 勤工助学-学生端
	{
		path: '/studentWorkStudy',
		Routes: ['src/pages/Authorized'],
		component: '../layouts/basicLayout',
		authority: 'ly-sm-work-study-svc-student-menu',
		routes: [
			{
				path: '/studentWorkStudy',
				redirect: '/studentWorkStudy/workStudyMain/index',
			},
			{
				path: '/studentWorkStudy/workStudyMain/index',
				title: '勤工助学',
				component: './sm-work-study/workStudyProgram/index',
			},
			{
				path: '/studentWorkStudy/stationDetail/index',
				title: '岗位详情',
				component: './sm-work-study/stationDetail/index',
			},
			{
				path: '/studentWorkStudy/workStudyClockRecord/index',
				title: '打卡记录',
				component: './sm-work-study/workStudyProgramClockRecord/index',
			},
			{
				path: '/studentWorkStudy/repairClockRecord/index',
				title: '补打卡',
				component: './sm-work-study/repairClockRecord/index',
			},
			{
				path: '/studentWorkStudy/repairClockRecord/success/index',
				title: '勤工助学',
				component: './sm-work-study/repairClockRecordSuccess/index',
			},
		],
	},
	//勤工助学-教师端
	{
		path: '/teacherWorkStudy',
		Routes: ['src/pages/Authorized'],
		authority: 'ly-sm-work-study-svc-teacher-menu',
		routes: [
			{
				path: '/teacherWorkStudy',
				redirect: '/teacherWorkStudy/workStudyMain/index',
			},
			{
				path: '/teacherWorkStudy/workStudyMain/index',
				title: '勤工助学',
				component: './sm-work-study-teacher/workStudyMain/index',
			},
			{
				path: '/teacherWorkStudy/workStudyApprove/index',
				title: '勤工助学',
				component: './sm-work-study-teacher/workStudyApprove/index',
			},
			{
				path: '/teacherWorkStudy/workStudyApproveDetail/index',
				title: '勤工助学',
				component: './sm-work-study-teacher/workStudyApproveDetail/index',
			}
		],
	},
    //困难生
    {
        path:'/difficultStudent/student',
        component: '../layouts/basicLayout',
        Routes: ['src/pages/Authorized'],
        routes: [
            {
                path: '/difficultStudent/student',
                redirect: '/difficultStudent/student/index',
            },
            {
                path: '/difficultStudent/student/index',
                title: '我的困难认定',
                component: './difficultStudent/student/index',
            }
        ]
    },
    //学生名单
    {
        path:'/roster/student',
        component: '../layouts/basicLayout',
        Routes: ['src/pages/Authorized'],
        authority:'ly-sm-mobile-roster-student-menu',
        routes: [
            {
                path: '/roster/student',
                title:'学生名单',
                component: './roster/student/index',
            },
            {
                path: '/roster/student/info',
                title:'学生信息详情',
                component: './roster/student/info/index',
            },
        ]
    },
    //在线答题
    {
        path:'/',
        component: '../layouts/userLayout',
        Routes: ['src/pages/Authorized'],
        authority:'ly-sm-mobile-roster-student-menu',
        routes: [
            {
				path: '/',
				redirect: '/questionnaire',
			},
			{
				title: '在线答题',
				path: '/questionnaire',
				component: './questionnaire/index',
			},
			{
                path: '/questionnaire/intro',
                title:'职业能力测试',
                component: './questionnaire/intro/index',
            },
			{
                path: '/questionnaire/answer',
                title:'职业能力测试',
                component: './questionnaire/answer/index',
            },
			{
                path: '/questionnaire/result',
                title:'问卷作答统计',
                component: './questionnaire/result/index',
            },
			{
				// 错误页面
				title: 'exception',
				path: '/exception',
				routes: [
					{
						path: '/exception/403',
						title: 'not-permission',
						component: './exception/403',
					},
					{
						path: '/exception/404',
						title: 'not-find',
						component: './exception/404',
					},
					{
						path: '/exception/500',
						title: 'server-error',
						component: './exception/500',
					},
				],
			},
			{ path: '404', title: '404', component: './exception/404' },
			{ path: '*', title: '404', component: './exception/404' },
        ]
    },
	// 基础页面
	// {
	// 	path: '/',
	// 	component: '../layouts/homePageLayout',
	// 	Routes: ['src/pages/Authorized'],
	// 	routes: [
	// 		{
	// 			path: '/',
	// 			redirect: '/homePage',
	// 		},
	// 		{
	// 			title: '移动学工',
	// 			path: '/homePage',
	// 			component: './homePage/index',
	// 		},
	// 		{
	// 			// 错误页面
	// 			title: 'exception',
	// 			path: '/exception',
	// 			routes: [
	// 				{
	// 					path: '/exception/403',
	// 					title: 'not-permission',
	// 					component: './exception/403',
	// 				},
	// 				{
	// 					path: '/exception/404',
	// 					title: 'not-find',
	// 					component: './exception/404',
	// 				},
	// 				{
	// 					path: '/exception/500',
	// 					title: 'server-error',
	// 					component: './exception/500',
	// 				},
	// 			],
	// 		},
	// 		{ path: '404', title: '404', component: './exception/404' },
	// 		{ path: '*', title: '404', component: './exception/404' },
	// 	],
	// },
];
