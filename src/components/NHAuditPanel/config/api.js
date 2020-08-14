import { query, post, postForm } from './Axios';

// let base = 'api/restfulbpm/bpm/rest',
// let base = 'bpm/rest';
const base = 'bpm/rest';
    const authc = 'api/authc';
    const file = 'zuul/docrepo';
    const zhxg='api/sm-bpm-expansion';

// 公共接口
export const reqGetCommon = params => { return query(`${base}/common/execute`, params); };
// 共用接口--获取数据的公用接口
export const reqCommonGetData = params => { return query(`${base}/common/execute`, params); };

// 文档库http://192.168.35.105:1430/swagger-ui.html#!/file45upload45controller/uploadFileUsingPOST
// export const uploadApi = `${file}/upload`; // 上传附件
// 文档库--上传附件
export const reqPostAttachmentUpload = params => {return post(`${file}/upload`, params);};
export const uploadApi = `${file}/upload`;
// 文档库--分页查询附件列表(ssbh)
export const reqGetAttachmentList = params => { return query(`${file}/attachment`, params); };
// 文档库--根据编号删除附件(bh)
export const reqPostAttachmentDelete = attachmentId => { return post(`${file}/attachment/${attachmentId}/delete`); };
// 文档库--下载附件(bh)
export const downloadApi = `${file}/download`;
// 文档库--下载图片附件
export const downloadImageApi = `${file}/download/file`;

// 登录
export const reqPostLogin = params => { return postForm('login', params); };
// 退出
export const reqPostLogout = params => { return query('logout', params); };
// 尝试获取已登录用户信息
export const reqTryLoginUserInfo = params => { return postForm('tryLoginUserInfo', params); };

/** ******************* 管理--开始 ******************** */
// 流程管理
// 流程管理--流程清单-获取列表
export const reqGetProcessList = params => { return query(`${base}/processes`, params); };
// 流程管理--流程清单-获取类型树列表
export const reqGetProcessTypeTree = params => { return query(`${base}/types/tree`, params); };
// 流程管理--流程清单-删除
export const reqPostProcessDel = params => { return postForm(`${base}/processes/delete`, params); };
// 流程管理--流程清单-拷贝
export const reqPostProcessCopy = params => { return postForm(`${base}/processes/copy`, params); };
// 流程管理--流程清单-发布
export const reqPostProcessIssue = params => { return postForm(`${base}/processes/issue`, params); };
// 流程管理--流程清单-导入
export const reqPostImportProcess = (datas, params) => { return post(`${base}/elements/import`, datas, params); };
// 流程管理--流程类别-新增
export const reqPostProcessTypeAdd = params => { return postForm(`${base}/types`, params); };
// 流程管理--流程类别-删除
export const reqPostProcessTypeDel = params => { return postForm(`${base}/types/delete`, params); };
// 流程管理--流程类别-更新
export const reqPostProcessTypeUpdate = params => { return postForm(`${base}/types/update`, params); };

// 表单管理
// 表单管理--表单清单-获取列表
export const reqGetFormList = params => { return query(`${base}/forms`, params); };
// 表单管理--表单清单-删除
export const reqPostFormDel = params => { return postForm(`${base}/forms/delete`, params); };
// 表单管理--表单清单-拷贝
export const reqPostFormCopy = params => { return postForm(`${base}/forms/copy`, params); };
// 表单管理--表单清单-获取类型树
export const reqGetFormTypeTree = params => { return query(`${base}/types/tree`, params); };
// 表单管理--更新保存表单
export const reqUpdateForms = params => { return postForm(`${base}/forms`, params); };
// 表单管理--表单清单-导入
export const reqPostImportForm = (datas, params) => { return post(`${base}/elements/import`,datas, params); };
// 表单管理--表单类别-新增
export const reqPostFormTypeAdd = params => { return postForm(`${base}/types`, params); };
// 表单管理--表单类别-删除
export const reqPostFormTypeDel = params => { return postForm(`${base}/types/delete`, params); };
// 表单管理--表单类别-更新
export const reqPostFormTypeUpdate = params => { return postForm(`${base}/types/update`, params); };

// 规则管理
// 规则管理--规则清单-获取列表
export const reqGetRulesList = params => { return query(`${base}/rules`, params); };
// 规则管理--规则清单-删除
export const reqPostRulesDel = params => { return postForm(`${base}/rules/delete`, params); };
// 规则管理--规则清单-拷贝
export const reqPostRulesCopy = params => { return postForm(`${base}/rules/copy`, params); };
// 规则管理--规则清单-获取类型树
export const reqGetRulesTypeTree = params => { return query(`${base}/types/tree`, params); };
// 规则管理--规则清单-导入
export const reqPostImportRules = params => { return post(`${base}/elements/import`, params); };
// 规则管理--规则清单-更新保存规则
export const reqUpdateRules = params => { return postForm(`${base}/rules`, params); };
// 规则管理--规则类别-新增
export const reqPostRulesTypeAdd = params => { return postForm(`${base}/types`, params); };
// 规则管理--规则类别-删除
export const reqPostRulesTypeDel = params => { return postForm(`${base}/types/delete`, params); };
// 规则管理--规则类别-更新
export const reqPostRulesTypeUpdate = params => { return postForm(`${base}/types/update`, params); };
// 规则管理--规则运行
export const reqRulesRun = params => { return query(`${base}/rules/execute`, params); };
// 规则管理--规则详情
export const reqRulesDetail = params => { return query(`${base}/rules/config`, params); };

// 监控管理
// 流程监控--流程监控清单-获取监控列表
export const reqGetProcessTasksList = params => { return query(`${base}/processes/tasks`, params); };
// 流程监控--流程实例信息-获取文档
export const reqGetProcessTasksInstance = (taskId,params) => { return query(`${base}/processes/tasks/${taskId}`, params); };
// 流程监控--流程实例信息-解锁/锁定文档
export const reqProcessTasksLock = (params) => { return postForm(`${base}/processes/tasks/lock`, params); };
// 流程监控--流程实例信息-获取用户实例
export const reqProcessTasksUserInstance = (params) => { return query(`${base}/processes/tasks/users`, params); };
// 流程监控--流程实例信息-修改用户实例信息
export const reqProcessTasksUserInstanceUpdate = (datas, params) => { return postForm(`${base}/processes/tasks/users/update`,datas, params);};
// 流程监控--流程实例信息-新增用户实例信息
export const reqProcessTasksUserInstanceAdd = (datas, params) => { return postForm(`${base}/processes/tasks/users`,datas, params);};
// 流程监控--流程实例信息-删除用户实例信息
export const reqProcessTasksUserInstanceDelete = (params) => { return postForm(`${base}/processes/tasks/users/delete`, params);};
// 流程监控--流程实例信息-获取环节实例
export const reqProcessTasksLinkInstance = (params) => { return query(`${base}/processes/tasks/nodes`, params); };
// 流程监控--流程实例信息-修改环节实例信息
export const reqProcessTasksLinkInstanceUpdate = (params) => { return postForm(`${base}/processes/tasks/nodes/update`, params);};
// 流程监控--流程实例信息-新增环节实例信息
export const reqProcessTasksLinkInstanceAdd = (params) => { return postForm(`${base}/processes/tasks/nodes`, params);};
// 流程监控--流程实例信息-删除环节实例信息
export const reqProcessTasksLinkInstanceDelete = (params) => { return postForm(`${base}/processes/tasks/nodes/delete`, params);};
// 流程监控--流程实例信息-获取文档附件信息
export const reqProcessTasksAttachements = (params) => { return query(`${base}/processes/tasks/attachements`, params);};
// 流程监控--流程实例信息-删除文档附件信息
export const reqProcessTasksAttachementsDelete = (params) => { return postForm(`${base}/processes/tasks/attachements/delete`, params);};
// 流程监控--流程实例信息-获取流程流转记录
export const reqProcessTasksTrace = (params) => { return query(`${base}/processes/tasks/trace`, params);};
// 流程监控--流程实例信息-修改流程文档字段数据
export const reqProcessTasksUpdate = (datas,params) => { return post(`${base}/processes/tasks/formdata/update`,datas,params);};
// 流程监控--流程实例信息-流程归档
export const reqProcessTasksArchived = (params) => { return postForm(`${base}/processes/tasks/archived`, params);};
// 流程监控--流程实例信息-删除流程文档
export const reqProcessTasksDelete = (params) => { return postForm(`${base}/processes/tasks/delete`, params);};
// 流程监控--流程实例的流转记录
export const reqGetProcessTrace = params => { return query(`${base}/processes/tasks/trace`, params); };

// 选择器
// 选择器--获取左侧部门树
export const reqGetDepartmentsTree = params => { return query(`${authc}/departments/commonDepartmentsTree`, params); };
// 选择器--分页查询部门列表
export const reqGetDepartmentsList = params => { return query(`${authc}/departments`, params); };
// 选择器--分页查询用户
export const reqGetUserList = params => { return query(`${authc}/users/selector`, params); };
// 选择器--分页查询角色列表
export const reqGetRoleList = params => { return query(`${authc}/roles`, params); };
// 选择器--分页查询岗位列表
export const reqGetPostsList = params => { return query(`${authc}/posts`, params); };

// 表单设计
// 表单设计--获取表单配置
export const reqGetFormConfig = params => { return query(`${base}/forms/config`, params); };
// 表单设计--应用列表 // 流程也用这个
export const reqGetApps = params => { return query(`${base}/apps`, params); };
// 表单设计--字段选择器
export const reqGetFieldSelector = params => { return query(`${base}/forms/fields/selector`, params); };
// 表单设计--获取规则，例如校验规则、后端规则
export const reqGetRulesByType = params => { return query(`${base}/rules`, params); };
// 表单设计--字段JS检验规则列表
export const reqGetFieldValidation = params => { return query(`${base}/forms/fields/validation`, params); };
// 表单设计--JSON数据源列表
export const reqGetDataSources = params => { return query(`${base}/dataSources`, params); };
// 表单设计--预览
export const reqGetPreviewData = params => { return query(`${base}/form/preview`, params); };

// 流程流转--获得流程实例当前的表单数据
export const reqGetFormData = params => { return query(`${base}/processes/tasks/form/json`, params); };
/** ******************* 管理--结束 ******************** */

/** ******************* 用户接口--开始 ******************** */
// 常用意见
// 常用意见--获得常用处理意见列表
export const reqGetCommonRemark = params => { return query(`${base}/setting/opinion`, params); };

// 我的关注
// 我的关注--关注
export const reqPostFollows = params => { return postForm(`${base}/processes/tasks/follows`, params); };
// 我的关注--取消关注
export const reqPostCancelFollows = params => { return postForm(`${base}/processes/tasks/follows/delete`, params); };
// 我的关注--检查流程实例是否已关注
export const reqGetFollowsStatus = params => { return query(`${base}/processes/tasks/follow/status`, params); };


// 流程办理
// 流程办理--办理
export const reqPostEndUserTask = params => { return postForm(`${base}/processes/tasks/route/goto/run`, params); };
/** ******************* 用户接口--结束 ******************** */

/** ******************* 流程--开始 ******************** */
// 获取流程过程属性
export const reqGetFlowProcessesAttr = params => { return query(`${base}/processes/attributes`, params); };
// 保存流程过程属性
export const reqSaveFlowProcessesAttr = params => { return postForm(`${base}/processes/attributes/update`, params); };


// 更新事件
export const reqUpdateEvent = params => { return postForm(`${base}/process/nodeevent/update`, params); };
// 删除事件
export const reqDeleteEvent = params => { return postForm(`${base}/process/nodeevent/delete`, params); };

// 获得任务节点配置
export const reqGetFlowNodeConfig = params => { return query(`${base}/process/node/config`, params); };
// 保存任务节点配置
export const reqGetFlowNodeSave= params => { return postForm(`${base}/processes/tasknodes/update`, params); };

// 根据id查询邮件配置信息
export const reqGetFlowMailConfig = params => { return query(`${base}/process/mail/config`, params); };
// 保存或者更新邮件信息
export const reqGetFlowMailUpdate = params => { return postForm(`${base}/process/mail/update`, params); };
// 删除邮件信息
export const reqGetFlowMailDelete= params => { return postForm(`${base}/process/mail/delete`, params); };
// 获取事件配置
export const reqEventConfig = params => { return query(`${base}/process/nodeevent/config`, params); };

// 获取网关节点配置gateways
export const reqGatewaysAttr = params => { return query(`${base}/processes/gateways`, params); };
// 保存网关节点配置gateways
export const reqGatewaysSave = params => { return postForm(`${base}/processes/gateways/update`, params); };

// 查询路由线属性
export const reqLineAttr = params => { return query(`${base}/process/routes`, params); };
// 保存路由线属性
export const reqLineSave = params => { return postForm(`${base}/process/routes/update`, params); };

// 查询事件节点
export const reqEventAttr = params => { return query(`${base}/processes/eventnodes`, params); };
// 保存事件节点属性
export const reqEventSave = params => { return postForm(`${base}/processes/eventnodes/update`, params); };

// 查询子流程节点
export const reqSubnodeAttr = params => { return query(`${base}/processes/subnodes`, params); };
// 保存子流程节点属性
export const reqSubnodeSave = params => { return postForm(`${base}/processes/subnodes/update`, params); };

// 删除任务节点
export const reqGetFlowNodeDelete= params => { return postForm(`${base}/processes/tasknodes/delete`, params); };
// 删除事件节点
export const reqGetEventNodeDelete= params => { return postForm(`${base}/processes/eventnodes/delete`, params); };
// 删除网关节点
export const reqGatewaysDelete= params => { return postForm(`${base}/processes/gateways/delete`, params); };
// 删除路由节点
export const reqLineDelete= params => { return postForm(`${base}/process/routes/delete`, params); };
// 删除子流程节点
export const reqSubnodeDelete= params => { return postForm(`${base}/processes/subnodes/delete`, params); };

// 流程展示流转记录接口
export const reqProcessesTasksUser = params => { return query(`${base}/processes/tasks/users`, params); };
// 查询节点已审批过的用户
export const reqProcessesNodeUser = params => { return query(`${base}/processes/tasks/node/users`, params); };
// 强制启动指定的用户和节点
export const reqProcessesNodeStart= params => { return postForm(`${base}/processes/tasks/node/start`, params); };
// 强制启动指定的用户和节点
export const reqProcessesNodeStop= params => { return postForm(`${base}/processes/tasks/node/stop`, params); };
// 修改节点参与用户
export const reqProcessesNodeUpdate= params => { return postForm(`${base}/processes/tasks/node/users/update`, params); };
// 查询流程实例节点审批状态
export const reqProcessesTaskStatus = params => { return query(`${base}/processes/tasks/status`, params); };



/** ******************* 流程--结束 ******************** */

/** ******************* 获取综合学工流程信息 ******************** */
// 或者节点信息
export const getZhxgBpmNodeInfo=params=>{return query(`${zhxg}/flowSet/getNodeInfo`,params);};
// 获取下一节点审核人
export const getNextNodeShrList=params=>{return query(`${zhxg}/processdefine/getNextNodeInfo`,params);};
