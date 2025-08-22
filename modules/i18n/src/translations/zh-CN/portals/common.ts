/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { CommonNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
export const common: CommonNS = {
    "access": "使用权",
    "actions": "动作",
    "activate": "启用",
    "active": "积极的",
    "add": "添加",
    "addKey": "添加秘密",
    "addURL": "添加URL",
    "all": "全部",
    "applicationName": "应用名称",
    "applications": "申请",
    "approvalStatus": "批准状态",
    "approvals": "批准",
    "approvalsPage": {
        "list": {
            "columns": {
                "actions": "操作",
                "name": "名称"
            }
        },
        "modals": {
            "description": "查看需要您批准的操作任务",
            "header": "批准",
            "subHeader": "查看需要您批准的操作任务"
        },
        "notifications": {
            "fetchApprovalDetails": {
                "error": {
                    "description": "{{description}}",
                    "message": "获取批准详细信息时出错"
                },
                "genericError": {
                    "description": "无法检索批准详细信息。",
                    "message": "出现了问题"
                }
            },
            "fetchPendingApprovals": {
                "error": {
                    "description": "{{description}}",
                    "message": "获取待处理批准时出错"
                },
                "genericError": {
                    "description": "无法检索待处理批准。",
                    "message": "出现了问题"
                }
            },
            "updatePendingApprovals": {
                "error": {
                    "description": "{{description}}",
                    "message": "更新批准时出错"
                },
                "genericError": {
                    "description": "无法更新待处理批准。",
                    "message": "出现了问题"
                },
                "success": {
                    "description": "成功更新批准。",
                    "message": "更新成功"
                }
            }
        },
        "placeholders": {
            "emptyApprovalFilter": {
                "action": "查看全部",
                "subtitles": {
                    0: "当前没有处于 {{status}} 状态的批准。",
                    1: "请检查您是否有任何处于 {{status}} 状态的任务",
                    2: "在这里查看它们。"
                },
                "title": "未找到结果"
            },
            "emptyApprovalList": {
                "action": "",
                "subtitles": {
                    0: "当前没有待审核的批准。",
                    1: "请检查您是否已添加工作流以控制系统中的操作。",
                    2: ""
                },
                "title": "没有批准"
            },
            "emptySearchResults": {
                "action": "查看全部",
                "subtitles": {
                    0: "我们找不到您搜索的工作流。",
                    1: "请检查您是否在",
                    2: "系统中有该名称的工作流。"
                },
                "title": "没有批准"
            },
            "searchApprovals": "按工作流名称搜索"
        },
        propertyMessages: {
            assignedUsersDeleted: "分配的用户已被删除。",
            roleDeleted: "角色已被删除。",
            selfRegistration: "自助注册",
            unassignedUsersDeleted: "未分配的用户已被删除。"
        },
        "subTitle": "查看需要您批准的操作任务",
        "title": "批准"
    },
    "approve": "批准",
    "approved": "已批准",
    "apps": "应用",
    "assignee": "受让人",
    "assignees": "受让人",
    "asyncOperationErrorMessage": {
        "description": "出了點問題",
        "message": "發生了意外錯誤。請稍後再查看。"
    },
    "authentication": "验证",
    "authenticator": "身份验证者",
    "authenticator_plural": "身份验证者",
    "back": "后退",
    "beta": "beta",
    "browser": "浏览器",
    "cancel": "取消",
    "challengeQuestionNumber": "挑战问题 {{number}}",
    "change": "改变",
    "chunkLoadErrorMessage": {
        "description": "服务请求的申请时发生错误。请尝试重新加载该应用程序。",
        "heading": "出了些问题",
        "primaryActionText": "重新加载应用程序"
    },
    "claim": "宣称",
    "clear": "清除",
    "clientId": "客户 ID",
    "close": "关闭",
    "comingSoon": "即将推出",
    "completed": "完全的",
    "configure": "配置",
    "confirm": "确认",
    "contains": "包含",
    "continue": "继续",
    "copyToClipboard": "复制到剪贴板",
    "create": "创造",
    "createdOn": "创建于",
    "dangerZone": "危险区",
    "darkMode": "黑暗模式",
    "delete": "删除",
    "deprecated": "此配置已弃用，并将在未来的版本中删除。",
    "description": "描述",
    "deviceModel": "设备型号",
    "disable": "禁用",
    "disabled": "禁用",
    "docs": "文档",
    "documentation": "文档",
    "done": "完毕",
    "download": "下载",
    "drag": "拖",
    "duplicateURLError": "这个值已经添加",
    "edit": "编辑",
    "enable": "使能够",
    "enabled": "启用",
    "endsWith": "以。。结束",
    "equals": "等于",
    "exitFullScreen": "出口全屏",
    "experimental": "实验性的",
    "explore": "探索",
    "export": "出口",
    "featureAvailable": "此功能即将提供！",
    "filter": "筛选",
    "finish": "结束",
    "generatePassword": "生成密码",
    "goBackHome": "回家",
    "goFullScreen": "全屏",
    "good": "好的",
    "help": "帮助",
    "hide": "隐藏",
    "hidePassword": "隐藏密码",
    "identityProviders": "身份提供者",
    "import": "进口",
    "initiator": "发起人",
    "ipAddress": "IP地址",
    "issuer": "发行人",
    "lastAccessed": "最后访问",
    "lastModified": "上一次更改",
    "lastSeen": "最后一次露面",
    "lastUpdatedOn": "最后更新",
    "learnMore": "了解更多",
    "lightMode": "光模式",
    "loading": "加载",
    "loginTime": "登录时间",
    "logout": "登出",
    "makePrimary": "使主要",
    "maxValidation": "此值应小于或等于{{max}}。",
    "maximize": "最大化",
    "metaAttributes": "元属性",
    "minValidation": "该值应大于或等于{{min}}。",
    "minimize": "最小化",
    "minutes": "分钟",
    "more": "更多的",
    "myAccount": "我的账户",
    "name": "姓名",
    "networkErrorMessage": {
        "description": "请尝试再次登录。",
        "heading": "您的会议已经过期",
        "primaryActionText": "登入"
    },
    "new": "新的",
    "next": "下一个",
    "noResultsFound": "未找到结果",
    "okay": "好的",
    "operatingSystem": "操作系统",
    "operations": "操作",
    "organizationName": "{{orgName}} 组织",
    "overview": "概述",
    "personalInfo": "个人信息",
    "pin": "别针",
    "pinned": "固定",
    "premium": "优质的",
    "pressEnterPrompt": "按<1>Enter</1>键选择",
    "preview": "预览",
    "previous": "以前的",
    "primary": "基本的",
    "priority": "优先事项",
    "privacy": "隐私",
    "properties": "特性",
    "publish": "发布",
    "ready": "准备好",
    "regenerate": "再生",
    "register": "登记",
    "reject": "拒绝",
    "rejected": "已拒绝",
    "release": "发布",
    "remove": "消除",
    "removeAll": "移除所有",
    "required": "这是必需的。",
    "reserved": "预订的",
    "resetFilters": "重置过滤器",
    "retry": "重试",
    "revoke": "撤销",
    "revokeAll": "撤销所有",
    "samples": "样品",
    "save": "节省",
    "saveDraft": "保存草稿",
    "sdks": "SDKs",
    "search": "搜索",
    "searching": "搜索",
    "security": "安全",
    "selectAll": "选择全部",
    "selectNone": "选择无",
    "services": "服务",
    "settings": "设置",
    "setup": "设置",
    "show": "展示",
    "showAll": "显示所有",
    "showLess": "显示较少",
    "showMore": "展示更多",
    "showPassword": "显示密码",
    "skip": "跳过",
    "startsWith": "以。。开始",
    "step": "步",
    "strong": "强的",
    "submit": "提交",
    "switch": "转变",
    "technologies": "技术",
    "terminate": "终止",
    "terminateAll": "终止所有",
    "terminateSession": "终止会话",
    "tooShort": "过短",
    "type": "类型",
    "unpin": "商品",
    "unpinned": "未损坏",
    "update": "更新",
    "user": "用户",
    "verified": "已验证",
    "verify": "核实",
    "view": "看法",
    "weak": "虚弱的",
    "weakPassword": "密码强度至少应该很好。"
};
