/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { MyAccountNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
export const myAccount: MyAccountNS = {
    components: {
        "accountRecovery": {
            SMSRecovery: {
                descriptions: {
                    add: "添加或更新恢复手机号码。",
                    emptyMobile: "您需要配置您的手机号码才能进行 SMS-OTP 恢复。",
                    update: "更新恢复手机号码 ({{mobile}})",
                    view: "查看恢复手机号码 ({{mobile}})"
                },
                forms: {
                    mobileResetForm: {
                        inputs: {
                            mobile: {
                                label: "手机号码",
                                placeholder: "输入恢复手机号码。",
                                validations: {
                                    empty: "请输入手机号码。",
                                    invalidFormat: "手机号码格式不正确。"
                                }
                            }
                        }
                    }
                },
                heading: "SMS 恢复",
                notifications: {
                    updateMobile: {
                        error: {
                            description: "{{description}}",
                            message: "更新恢复手机号码时出错。"
                        },
                        genericError: {
                            description: "更新恢复手机号码时发生错误",
                            message: "出现了一些问题"
                        },
                        success: {
                            description: "用户资料中的手机号码已成功更新",
                            message: "手机号码更新成功"
                        }
                    }
                }
            },
            "codeRecovery": {
                "descriptions": {
                    "add": "添加或更新代码恢复选项"
                },
                "heading": "代码恢复"
            },
            "emailRecovery": {
                "descriptions": {
                    "add": "添加或更新恢复电子邮件地址",
                    "emptyEmail": "您需要配置您的电子邮件地址才能继续进行电子邮件恢复。",
                    "update": "更新恢复电子邮件地址（{{email}}）",
                    "view": "查看恢复电子邮件地址（{{email}}）"
                },
                "forms": {
                    "emailResetForm": {
                        "inputs": {
                            "email": {
                                "label": "电子邮件地址",
                                "placeholder": "输入恢复电子邮件地址",
                                "validations": {
                                    "empty": "输入电子邮件地址",
                                    "invalidFormat": "电子邮件地址不是正确的格式"
                                }
                            }
                        }
                    }
                },
                "heading": "电子邮件恢复",
                "notifications": {
                    "updateEmail": {
                        "error": {
                            "description": "{{description}}",
                            "message": "错误更新恢复电子邮件"
                        },
                        "genericError": {
                            "description": "更新恢复电子邮件时发生错误",
                            "message": "出了些问题"
                        },
                        "success": {
                            "description": "用户配置文件中的电子邮件地址已成功更新",
                            "message": "电子邮件地址成功更新"
                        }
                    }
                }
            },
            "preference": {
                "notifications": {
                    "error": {
                        "description": "{{description}}",
                        "message": "错误获得恢复偏好"
                    },
                    "genericError": {
                        "description": "获得恢复偏好时发生错误",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "成功检索了恢复偏好",
                        "message": "恢复优先检索成功"
                    }
                }
            },
            "questionRecovery": {
                "descriptions": {
                    "add": "添加或更新帐户恢复挑战问题"
                },
                "forms": {
                    "securityQuestionsForm": {
                        "inputs": {
                            "answer": {
                                "label": "回答",
                                "placeholder": "输入您的答案",
                                "validations": {
                                    "empty": "答案是必需的字段"
                                }
                            },
                            "question": {
                                "label": "问题",
                                "placeholder": "请选择一个安全问题",
                                "validations": {
                                    "empty": "至少必须选择一个安全问题"
                                }
                            }
                        }
                    }
                },
                "heading": "安全问题",
                "notifications": {
                    "addQuestions": {
                        "error": {
                            "description": "{{description}}",
                            "message": "添加安全性问题时发生错误"
                        },
                        "genericError": {
                            "description": "添加安全性问题时发生错误",
                            "message": "出了些问题。"
                        },
                        "success": {
                            "description": "所需的安全问题成功添加了",
                            "message": "安全问题已成功添加"
                        }
                    },
                    "updateQuestions": {
                        "error": {
                            "description": "{{description}}",
                            "message": "错误更新安全问题"
                        },
                        "genericError": {
                            "description": "更新安全问题时发生错误",
                            "message": "出了些问题。"
                        },
                        "success": {
                            "description": "所需的安全问题已成功更新",
                            "message": "安全问题已成功更新"
                        }
                    }
                }
            }
        },
        "advancedSearch": {
            "form": {
                "inputs": {
                    "filterAttribute": {
                        "label": "过滤器属性",
                        "placeholder": "例如。名称，描述等",
                        "validations": {
                            "empty": "过滤器属性是必需的字段。"
                        }
                    },
                    "filterCondition": {
                        "label": "过滤条件",
                        "placeholder": "例如。从等等开始",
                        "validations": {
                            "empty": "滤波器条件是必需的字段。"
                        }
                    },
                    "filterValue": {
                        "label": "滤波器值",
                        "placeholder": "例如。管理员，WSO2等",
                        "validations": {
                            "empty": "滤波器值是必需的字段。"
                        }
                    }
                }
            },
            "hints": {
                "querySearch": {
                    "actionKeys": "Shift + Enter",
                    "label": "搜索查询"
                }
            },
            "options": {
                "header": "高级搜索"
            },
            "placeholder": "{{attribute}}搜索",
            "popups": {
                "clear": "清除搜索",
                "dropdown": "显示选项"
            },
            "resultsIndicator": "显示查询“ {{query}}”的结果"
        },
        "applications": {
            "advancedSearch": {
                "form": {
                    "inputs": {
                        "filterAttribute": {
                            "placeholder": "例如。名称，描述等"
                        },
                        "filterCondition": {
                            "placeholder": "例如。从等等开始"
                        },
                        "filterValue": {
                            "placeholder": "输入值搜索"
                        }
                    }
                },
                "placeholder": "按应用程序名称搜索"
            },
            "all": {
                "heading": "所有应用程序"
            },
            "favourite": {
                "heading": "最爱"
            },
            "notifications": {
                "fetchApplications": {
                    "error": {
                        "description": "{{description}}",
                        "message": "错误检索应用程序"
                    },
                    "genericError": {
                        "description": "无法检索应用程序",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "成功检索了应用程序。",
                        "message": "应用程序取回成功"
                    }
                }
            },
            "placeholders": {
                "emptyList": {
                    "action": "刷新列表",
                    "subtitles": {
                        "0": "应用列表返回空。",
                        "1": "这可能是由于没有可发现的应用程序。",
                        "2": "请询问管理员以启用应用程序可发现性。"
                    },
                    "title": "没有申请"
                }
            },
            "recent": {
                "heading": "最新应用"
            }
        },
        "changePassword": {
            "forms": {
                "passwordResetForm": {
                    "inputs": {
                        "confirmPassword": {
                            "label": "确认密码",
                            "placeholder": "输入新密码",
                            "validations": {
                                "empty": "确认密码是必需的字段",
                                "mismatch": "密码确认不匹配"
                            }
                        },
                        "currentPassword": {
                            "label": "当前密码",
                            "placeholder": "输入当前密码",
                            "validations": {
                                "empty": "当前密码是必需的字段",
                                "invalid": "当前密码无效"
                            }
                        },
                        "newPassword": {
                            "label": "新密码",
                            "placeholder": "输入新密码",
                            "validations": {
                                "empty": "新密码是必需的字段"
                            }
                        }
                    },
                    "validations": {
                        "genericError": {
                            "description": "出了些问题。 请再试一次",
                            "message": "更改密码错误"
                        },
                        "invalidCurrentPassword": {
                            "description": "您输入的当前密码似乎无效。请再试一次",
                            "message": "更改密码错误"
                        },
                        "invalidNewPassword": {
                            "description": "密码无法满足所需的约束。",
                            "message": "无效的密码"
                        },
                        "passwordCaseRequirement": "至少{{minUpperCase}}大写和{{minLowerCase}}小写字母",
                        "passwordCharRequirement": "至少{{minSpecialChr}}特殊字符的",
                        "passwordLengthRequirement": "必须在{{min}}和{{max}}字符之间",
                        "passwordLowerCaseRequirement": "至少{{minLowerCase}}小写字母（s）",
                        "passwordNumRequirement": "至少{{min}}数字（s）",
                        "passwordRepeatedChrRequirement": "不超过{{repeatedChr}}重复字符（s）",
                        "passwordUniqueChrRequirement": "至少{{uniqueChr}}唯一字符（s）",
                        "passwordUpperCaseRequirement": "至少{{minUpperCase}}大写字母",
                        "submitError": {
                            "description": "{{description}}",
                            "message": "更改密码错误"
                        },
                        "submitSuccess": {
                            "description": "密码已成功更改",
                            "message": "密码重置成功"
                        },
                        "validationConfig": {
                            "error": {
                                "description": "{{description}}",
                                "message": "检索错误"
                            },
                            "genericError": {
                                "description": "无法检索验证配置数据。",
                                "message": "出了些问题"
                            }
                        }
                    }
                }
            },
            "modals": {
                "confirmationModal": {
                    "heading": "确认",
                    "message": "更改密码将导致当前会话的终止。您将必须使用新更改的密码登录。你想继续吗？"
                }
            }
        },
        "consentManagement": {
            "editConsent": {
                "collectionMethod": "收集方法",
                "dangerZones": {
                    "revoke": {
                        "actionTitle": "撤销",
                        "header": "撤销同意",
                        "subheader": "您将必须再次提供此应用程序的同意。"
                    }
                },
                "description": "描述",
                "piiCategoryHeading": "管理与应用程序收集和共享您的个人信息的同意。取消选中您需要撤销的属性，然后按“更新”按钮以保存更改或按吊销按钮以删除所有属性的同意。",
                "state": "状态",
                "version": "版本"
            },
            "modals": {
                "consentRevokeModal": {
                    "heading": "你确定吗？",
                    "message": "此操作不是可逆的。这将永久撤销所有属性的同意。您确定要继续吗？",
                    "warning": "请注意，您将被重定向到登录同意页面"
                }
            },
            "notifications": {
                "consentReceiptFetch": {
                    "error": {
                        "description": "{{description}}",
                        "message": "出了些问题"
                    },
                    "genericError": {
                        "description": "无法在所选应用程序上加载信息",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "成功检索了同意书",
                        "message": "成功检索"
                    }
                },
                "consentedAppsFetch": {
                    "error": {
                        "description": "{{description}}",
                        "message": "出了些问题"
                    },
                    "genericError": {
                        "description": "无法加载同意申请的列表",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "成功检索了同意的应用程序列表",
                        "message": "成功检索"
                    }
                },
                "revokeConsentedApp": {
                    "error": {
                        "description": "{{description}}",
                        "message": "同意撤销错误"
                    },
                    "genericError": {
                        "description": "无法撤销该申请的同意",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "该申请已成功撤销了同意",
                        "message": "同意撤销成功"
                    }
                },
                "updateConsentedClaims": {
                    "error": {
                        "description": "{{description}}",
                        "message": "出了些问题"
                    },
                    "genericError": {
                        "description": "同意索赔未能更新该应用程序",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "该申请已成功更新了同意索赔",
                        "message": "成功更新的同意索赔"
                    }
                }
            }
        },
        "cookieConsent": {
            "confirmButton": "知道了",
            "content": "我们使用cookie来确保您获得最佳的整体体验。这些cookie用于在提供流畅和个性化的服务的同时保持不间断的连续会话。要了解有关我们如何使用cookie的更多信息，请参阅我们的<1> cookie策略。"
        },
        "federatedAssociations": {
            "deleteConfirmation": "这将从您的本地帐户中删除链接的社交帐户。您想继续删除吗？",
            "notifications": {
                "getFederatedAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "出了些问题"
                    },
                    "genericError": {
                        "description": "无法检索链接的社会帐户",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "链接的社会帐户已成功检索",
                        "message": "链接的社会帐户成功检索了"
                    }
                },
                "removeAllFederatedAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "出了些问题"
                    },
                    "genericError": {
                        "description": "链接的社会帐户无法删除",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "所有链接的社会帐户已成功删除",
                        "message": "链接的社会帐户成功删除了"
                    }
                },
                "removeFederatedAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "出了些问题"
                    },
                    "genericError": {
                        "description": "链接的社会帐户无法删除",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "链接的社会帐户已成功删除",
                        "message": "链接的社会帐户成功删除了"
                    }
                }
            }
        },
        "footer": {
            "copyright": "WSO2身份服务器©{{year}}"
        },
        "header": {
            "appSwitch": {
                "console": {
                    "description": "作为开发人员或管理员进行管理",
                    "name": "安慰"
                },
                "myAccount": {
                    "description": "管理自己的帐户",
                    "name": "我的账户"
                },
                "tooltip": "应用"
            },
            "organizationLabel": "此帐户由"
        },
        "linkedAccounts": {
            "accountTypes": {
                "local": {
                    "label": "添加本地用户帐户"
                }
            },
            "deleteConfirmation": "这将从您的帐户中删除链接帐户。您想继续删除吗？",
            "forms": {
                "addAccountForm": {
                    "inputs": {
                        "password": {
                            "label": "密码",
                            "placeholder": "输入密码",
                            "validations": {
                                "empty": "密码是必需的字段"
                            }
                        },
                        "username": {
                            "label": "用户名",
                            "placeholder": "输入用户名",
                            "validations": {
                                "empty": "用户名是必需的字段"
                            }
                        }
                    }
                }
            },
            "notifications": {
                "addAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "错误检索链接的用户帐户"
                    },
                    "genericError": {
                        "description": "添加链接帐户时发生错误",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "成功添加了所需的链接用户帐户",
                        "message": "链接的用户帐户成功添加了"
                    }
                },
                "getAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "错误检索链接的用户帐户"
                    },
                    "genericError": {
                        "description": "检索链接的用户帐户时发生错误",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "成功检索了所需的用户资料详细信息",
                        "message": "成功检索的链接用户帐户"
                    }
                },
                "removeAllAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "删除链接用户帐户的错误"
                    },
                    "genericError": {
                        "description": "删除链接的用户帐户时发生错误",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "所有链接的用户帐户已删除",
                        "message": "链接的帐户成功删除了"
                    }
                },
                "removeAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "删除链接用户帐户的错误"
                    },
                    "genericError": {
                        "description": "删除链接的用户帐户时发生错误",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "链接的用户帐户已删除",
                        "message": "链接的帐户成功删除了"
                    }
                },
                "switchAccount": {
                    "error": {
                        "description": "{{description}}",
                        "message": "切换帐户时发生错误"
                    },
                    "genericError": {
                        "description": "切换帐户时发生错误",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "该帐户已成功切换",
                        "message": "帐户成功切换"
                    }
                }
            }
        },
        "loginVerifyData": {
            "description": "这些数据用于在登录过程中进一步验证您的身份",
            "heading": "用于验证您的登录的数据",
            "modals": {
                "clearTypingPatternsModal": {
                    "heading": "确认",
                    "message": "此操作将清除您保存在TypingDNA中的打字模式。你想继续吗？"
                }
            },
            "notifications": {
                "clearTypingPatterns": {
                    "error": {
                        "description": "打字模式无法清除。请联系您的网站管理员",
                        "message": "无法清除键入模式"
                    },
                    "success": {
                        "description": "您在TypingDNA中的打字模式已成功清除",
                        "message": "打字模式成功清除了"
                    }
                }
            },
            "typingdna": {
                "description": "您的打字模式可以从这里清除",
                "heading": "TypingDNA键入模式"
            }
        },
        "mfa": {
            "authenticatorApp": {
                "addHint": "配置",
                "configuredDescription": "您可以使用已配置的Authenticator应用程序中的TOTP代码进行两因素身份验证。如果您无法访问该应用程序，则可以从此处设置一个新的Authenticator应用程序。",
                "deleteHint": "消除",
                "description": "您可以使用Authenticator应用程序获取两因素身份验证的验证代码。",
                "enableHint": "启用/禁用TOTP身份验证器",
                "heading": "身份验证器应用程序",
                "hint": "看法",
                "modals": {
                    "delete": {
                        "heading": "确认",
                        "message": "此操作将删除添加到您的个人资料中的QR码。你想继续吗 ？"
                    },
                    "done": "成功！现在，您可以将Authenticator应用程序用于两因素身份验证",
                    "heading": "设置一个身份验证器应用程序",
                    "scan": {
                        "additionNote": "QR码已成功添加到您的个人资料中！",
                        "authenticatorApps": "身份验证器应用程序",
                        "generate": "生成新代码",
                        "heading": "使用Authenticator应用扫描下面的QR码",
                        "messageBody": "您可以在此处找到可用的身份验证应用程序列表。",
                        "messageHeading": "没有安装Authenticator应用程序？",
                        "regenerateConfirmLabel": "确认再生新的QR码",
                        "regenerateWarning": {
                            "extended": "当您重新生成新的QR码时，必须扫描并重新设置Authenticator应用程序。您将无法使用以前的QR码登录。",
                            "generic": "当您重新生成新的QR码时，必须扫描并重新设置Authenticator应用程序。您以前的设置将不再起作用。"
                        }
                    },
                    "toolTip": "没有身份验证器应用程序？从<1> App Store或Google Play下载诸如Google Authenticator之类的身份验证器应用程序",
                    "verify": {
                        "error": "验证失败。 请再试一次。",
                        "heading": "输入生成的代码进行验证",
                        "label": "验证码",
                        "placeholder": "输入您的验证代码",
                        "reScan": "重新扫描",
                        "reScanQuestion": "想再次扫描QR码吗？",
                        "requiredError": "输入验证码"
                    }
                },
                "notifications": {
                    "deleteError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "出了些问题"
                        },
                        "genericError": {
                            "description": "删除QR代码时发生错误",
                            "message": "出了些问题"
                        }
                    },
                    "deleteSuccess": {
                        "genericMessage": "成功删除",
                        "message": "成功删除了TOTP配置。"
                    },
                    "initError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "出了些问题"
                        },
                        "genericError": {
                            "description": "检索QR码时发生错误",
                            "message": "出了些问题"
                        }
                    },
                    "refreshError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "出了些问题"
                        },
                        "genericError": {
                            "description": "尝试获取新的QR代码时发生了错误",
                            "message": "出了些问题"
                        }
                    },
                    "updateAuthenticatorError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "出了些问题"
                        },
                        "genericError": {
                            "description": "试图更新启用的身份验证列表时发生了错误",
                            "message": "出了些问题"
                        }
                    }
                },
                "regenerate": "再生"
            },
            "backupCode": {
                "actions": {
                    "add": "添加备份代码",
                    "delete": "删除备份代码"
                },
                "description": "如果您无法接收多因素身份验证代码，请使用备份代码访问您的帐户。如果需要，您可以再生新代码。",
                "download": {
                    "heading": "{{productName}}的备份代码",
                    "info1": "您只能使用一次每个备份代码。",
                    "info2": "这些代码是生成的",
                    "subHeading": "当您离开手机时，您可以使用这些备份代码登录{{productName}}。将这些备份代码保留在安全的地方，但可以访问。"
                },
                "heading": "备份代码",
                "messages": {
                    "disabledMessage": "应将至少一个附加的身份验证器配置为启用备份代码。"
                },
                "modals": {
                    "actions": {
                        "copied": "复制",
                        "copy": "复制代码",
                        "download": "下载代码",
                        "regenerate": "再生"
                    },
                    "delete": {
                        "description": "此操作将删除备份代码，您将无法使用它们。你想继续吗？",
                        "heading": "确认"
                    },
                    "description": "当您离开手机时，请使用备份代码登录。",
                    "generate": {
                        "description": "使用了所有备份代码。让我们生成一组新的备份代码",
                        "heading": "产生"
                    },
                    "heading": "备份代码",
                    "info": "每个代码只能使用一次。您可以随时生成新的代码来替换这些代码。",
                    "regenerate": {
                        "description": "生成新代码后，您的旧代码将不再起作用。生成新的代码后，请确保保存它们。",
                        "heading": "确认"
                    },
                    "subHeading": "您可以用来登录的一次性密码",
                    "warn": "这些代码只会出现一次。确保立即保存它们，并将它们存储在安全但易于访问的地方。"
                },
                "mutedHeader": "恢复选项",
                "notifications": {
                    "deleteError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "出了些问题"
                        },
                        "genericError": {
                            "description": "删除备份代码时发生错误",
                            "message": "出了些问题"
                        }
                    },
                    "deleteSuccess": {
                        "genericMessage": "成功删除",
                        "message": "成功删除了备份代码。"
                    },
                    "downloadError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "出了些问题"
                        },
                        "genericError": {
                            "description": "尝试下载备份代码时发生了错误",
                            "message": "出了些问题"
                        }
                    },
                    "downloadSuccess": {
                        "genericMessage": {
                            "description": "备份代码已成功下载。",
                            "message": "备份代码成功下载。"
                        },
                        "message": {
                            "description": "{{信息}}",
                            "message": "备份代码成功下载。"
                        }
                    },
                    "refreshError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "出了些问题"
                        },
                        "genericError": {
                            "description": "尝试生成新的备份代码时发生了错误",
                            "message": "出了些问题"
                        }
                    },
                    "retrieveAuthenticatorError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "出了些问题"
                        },
                        "genericError": {
                            "description": "尝试获取已启用的身份验证列表时发生了错误",
                            "message": "出了些问题"
                        }
                    },
                    "retrieveError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "出了些问题"
                        },
                        "genericError": {
                            "description": "检索备份代码时发生错误",
                            "message": "出了些问题"
                        }
                    },
                    "updateAuthenticatorError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "出了些问题"
                        },
                        "genericError": {
                            "description": "试图更新启用的身份验证列表时发生了错误",
                            "message": "出了些问题"
                        }
                    }
                },
                "remaining": "其余的"
            },
            "fido": {
                "description": "您可以使用设备中的<1>密钥</1>、<1>FIDO 安全密钥</1>或<1>生物识别</1>来登录您的帐户。",
                "form": {
                    "label": "万能钥匙",
                    "placeholder": "输入密钥的名称",
                    "remove": "删除密钥",
                    "required": "请输入您的密钥名称"
                },
                "heading": "万能钥匙",
                "modals": {
                    "deleteConfirmation": {
                        "assertionHint": "请确认您的操作。",
                        "content": "此操作不可逆转，并且将永久删除密钥。",
                        "description": "如果删除此密钥，您可能无法再次登录您的帐户。 请谨慎行事。",
                        "heading": "你确定吗？"
                    },
                    "deviceRegistrationErrorModal": {
                        "description": "密钥注册被中断。 如果这不是故意的，您可以重试该流程。",
                        "heading": "密钥注册失败",
                        "tryWithOlderDevice": "您也可以使用旧的密钥重试。"
                    }
                },
                "notifications": {
                    "removeDevice": {
                        "error": {
                            "description": "{{description}}",
                            "message": "删除密钥时发生错误"
                        },
                        "genericError": {
                            "description": "删除密钥时发生错误",
                            "message": "出了些问题"
                        },
                        "success": {
                            "description": "密钥已成功从列表中删除",
                            "message": "您的密钥已成功删除"
                        }
                    },
                    "startFidoFlow": {
                        "error": {
                            "description": "{{description}}",
                            "message": "检索密钥时发生错误"
                        },
                        "genericError": {
                            "description": "检索密钥时发生错误",
                            "message": "出了些问题"
                        },
                        "success": {
                            "description": "密钥已成功注册，现在您可以使用它进行身份验证。",
                            "message": "您的密码已成功注册"
                        }
                    },
                    "updateDeviceName": {
                        "error": {
                            "description": "{{description}}",
                            "message": "更新密钥名称时出错"
                        },
                        "genericError": {
                            "description": "更新密钥名称时出错",
                            "message": "出了些问题"
                        },
                        "success": {
                            "description": "您的密钥名称已成功更新",
                            "message": "密钥名称更新成功"
                        }
                    }
                },
                "tryButton": "尝试使用较旧的密钥"
            },
            "smsOtp": {
                "descriptions": {
                    "hint": "您将收到包含一次性验证代码的短信"
                },
                "heading": "手机号码",
                "notifications": {
                    "updateMobile": {
                        "error": {
                            "description": "{{description}}",
                            "message": "更新手机号码时发生错误"
                        },
                        "genericError": {
                            "description": "更新手机号码时发生错误",
                            "message": "出了些问题"
                        },
                        "success": {
                            "description": "用户配置文件中的手机号已成功更新",
                            "message": "手机号码成功更新"
                        }
                    }
                }
            }
        },
        "mobileUpdateWizard": {
            "done": "成功！您的手机号码已成功验证。",
            "notifications": {
                "resendError": {
                    "error": {
                        "description": "{{error}}",
                        "message": "出了些问题"
                    },
                    "genericError": {
                        "description": "尝试获取新的验证代码时发生了错误",
                        "message": "出了些问题"
                    }
                },
                "resendSuccess": {
                    "message": "重新发送代码请求已成功发送"
                }
            },
            "submitMobile": {
                "heading": "输入您的新手机号码"
            },
            "verifySmsOtp": {
                "error": "验证失败。 请再试一次。",
                "generate": "重新发送新的验证代码",
                "heading": "输入发送到您的手机号码的验证代码",
                "label": "验证码",
                "placeholder": "输入您的验证代码",
                "requiredError": "输入验证码"
            }
        },
        "overview": {
            "widgets": {
                "accountActivity": {
                    "actionTitles": {
                        "update": "管理帐户活动"
                    },
                    "description": "您目前正在以下设备登录",
                    "header": "活跃期"
                },
                "accountSecurity": {
                    "actionTitles": {
                        "update": "更新帐户安全性"
                    },
                    "description": "设置和建议，以帮助您确保帐户安全",
                    "header": "帐户安全"
                },
                "accountStatus": {
                    "complete": "您的个人资料已经完成",
                    "completedFields": "完成的字段",
                    "completionPercentage": "您的个人资料完成为{{percentage}}％",
                    "inComplete": "完成您的个人资料",
                    "inCompleteFields": "不完整的字段",
                    "mandatoryFieldsCompletion": "{{completed}} {{total}}强制性字段已完成",
                    "optionalFieldsCompletion": "{{completed}} {{total}}可选字段完成"
                },
                "consentManagement": {
                    "actionTitles": {
                        "manage": "管理同意"
                    },
                    "description": "控制要与应用程序共享的数据",
                    "header": "控制同意"
                },
                "profileStatus": {
                    "completionPercentage": "您的个人资料完成为{{percentage}}％",
                    "description": "管理您的个人资料",
                    "header": "您的{{productName}}个人资料",
                    "profileText": "您个人资料的详细信息",
                    "readOnlyDescription": "查看您的个人资料",
                    "userSourceText": "（通过{{source}}注册）"
                }
            }
        },
        "privacy": {
            "about": {
                "description": "WSO2 Identity Server（在此策略中称为“ WSO2是”）是基于开放标准和规格的开源身份管理和权利服务器。",
                "heading": "关于WSO2身份服务器"
            },
            "privacyPolicy": {
                "collectionOfPersonalInfo": {
                    "description": {
                        "list1": {
                            "0": "WSO2使用您的IP地址来检测到您帐户的任何可疑登录尝试。",
                            "1": "WSO2是使用诸如您的名字，姓氏等的属性，可提供丰富而个性化的用户体验。",
                            "2": "WSO2仅使用您的安全问题和答案来允许帐户恢复。"
                        },
                        "para1": "WSO2仅收集您的信息只是为了满足您的访问要求。例如："
                    },
                    "heading": "收集个人信息",
                    "trackingTechnologies": {
                        "description": {
                            "list1": {
                                "0": "从输入个人数据的“用户配置文件”页面收集信息。",
                                "1": "使用HTTP请求，HTTP标头和TCP/IP跟踪IP地址。",
                                "2": "使用IP地址跟踪您的地理信息。",
                                "3": "使用浏览器cookie跟踪您的登录历史记录。有关更多信息，请参阅我们的{{cookiePolicyLink}}。"
                            },
                            "para1": "WSO2通过以下方式收集您的信息："
                        },
                        "heading": "跟踪技术"
                    }
                },
                "description": {
                    "para1": "该政策描述了WSO2是如何捕获您的个人信息，收集目的以及有关保留个人信息的信息的。",
                    "para2": "请注意，此策略仅供参考，并且适用于该软件作为产品。WSO2 LLC。而且其开发人员无法访问WSO2中持有的信息。请参阅<1>免责声明部分以获取更多信息。",
                    "para3": "控制WSO2使用和管理的实体，组织或个人应制定自己的隐私政策，以阐明各自实体，组织或个人控制或处理数据的方式。"
                },
                "disclaimer": {
                    "description": {
                        "list1": {
                            "0": "WSO2，其员工，合作伙伴和分支机构无需访问，不需要，存储，处理或控制任何数据，包括WSO2中包含的个人数据。所有数据（包括个人数据）均由实体或运行WSO2的个人控制和处理。WSO2，其员工合作伙伴和分支机构不是任何数据隐私法规含义所在的数据处理器或数据控制器。WSO2不提供任何与此类实体或个人使用WSO2的合法性或方式和目的有关的保证或承担任何责任或责任。",
                            "1": "本隐私政策是出于实体或运行WSO2的人员的信息目的，并列出了WSO2中包含的过程和功能与个人数据保护有关。运行WSO2的实体和人员的责任是创建和管理其自己的规则和流程，以管理用户的个人数据，并且此类规则和流程可能会改变此处包含的使用，存储和披露策略。因此，用户应咨询运行WSO2的实体或人员，是为了自己的隐私政策，以获取有关用户个人数据的详细信息。"
                        }
                    },
                    "heading": "免责声明"
                },
                "disclosureOfPersonalInfo": {
                    "description": "WSO2仅向使用WSO2注册的相关应用程序（也称为服务提供商）披露个人信息。这些应用程序由您的实体或组织的身份管理员注册。个人信息仅出于收集的目的（或与该目的一致的用途）披露，除非您已同意另有同意或法律要求。",
                    "heading": "披露个人信息",
                    "legalProcess": {
                        "description": "请注意，当法律要求在适当的和合法的过程中，在法律要求时，组织，实体或个人运行WSO2可能会在您同意的情况下披露您的个人信息。",
                        "heading": "法律程序"
                    }
                },
                "heading": "隐私政策",
                "moreInfo": {
                    "changesToPolicy": {
                        "description": {
                            "para1": "WSO2 IS的升级版本可能包含对本政策的更改，并且将在此类升级中包装对本政策的修订。此类更改仅适用于选择使用升级版本的用户。",
                            "para2": "运行WSO2的组织可能会不时修改隐私政策。您可以找到最新的管理策略，其中包括运行WSO2的组织提供的相应链接。该组织将通过我们的官方公共渠道通知隐私政策的任何更改。"
                        },
                        "heading": "更改此政策"
                    },
                    "contactUs": {
                        "description": {
                            "para1": "如果您对本隐私政策有任何疑问或疑虑，请联系WSO2。"
                        },
                        "heading": "联系我们"
                    },
                    "heading": "更多信息",
                    "yourChoices": {
                        "description": {
                            "para1": "如果您已经拥有WSO2中的用户帐户，那么如果您发现本隐私政策对您来说是不可接受的，则有权停用帐户。",
                            "para2": "如果您没有帐户，并且不同意我们的隐私政策，则可以选择不创建一个。"
                        },
                        "heading": "您的选择"
                    }
                },
                "storageOfPersonalInfo": {
                    "heading": "个人信息存储",
                    "howLong": {
                        "description": {
                            "list1": {
                                "0": "当前密码",
                                "1": "先前使用的密码"
                            },
                            "para1": "只要您是我们系统的活跃用户，WSO2就是保留您的个人数据。您可以随时使用给定的自我保健用户门户更新您的个人数据。",
                            "para2": "WSO2可能会保留秘密的秘密，以为您提供更高的安全性。这包括："
                        },
                        "heading": "您的个人信息保留了多长时间"
                    },
                    "requestRemoval": {
                        "description": {
                            "para1": "您可以要求管理员删除您的帐户。如果您不使用组织功能，则管理员是您注册的组织的管理员或超级管理员。",
                            "para2": "此外，您可以请求匿名WSO2可能保留在日志，数据库或分析存储中的所有活动的所有痕迹。"
                        },
                        "heading": "如何要求删除您的个人信息"
                    },
                    "where": {
                        "description": {
                            "para1": "WSO2是将您的个人信息存储在有担保数据库中。WSO2是练习适当的行业公认的安全措施，以保护持有个人信息的数据库。WSO2作为产品不将数据传输或与任何第三方或位置共享您的数据。",
                            "para2": "WSO2可能会使用加密来保持您的个人数据的增加级别。"
                        },
                        "heading": "您的个人信息存储的位置"
                    }
                },
                "useOfPersonalInfo": {
                    "description": {
                        "list1": {
                            "0": "为您提供个性化的用户体验。为此，WSO2使用您的姓名和上传的配置文件图片。",
                            "1": "保护您的帐户免受未经授权的访问或潜在的黑客尝试。为此，WSO2是使用HTTP或TCP/IP标头。",
                            "2": "在系统性能改进方面得出用于分析目的的统计数据。WSO2在统计计算后不会保留任何个人信息。因此，统计报告无需识别个人。"
                        },
                        "para1": "WSO2仅将您的个人信息用于收集的目的（或与该目的一致的用途）。",
                        "para2": "WSO2仅用于以下目的使用您的个人信息。",
                        "subList1": {
                            "heading": "这包括：",
                            "list": {
                                "0": "IP地址",
                                "1": "浏览器指纹",
                                "2": "饼干"
                            }
                        },
                        "subList2": {
                            "heading": "WSO2可能使用：",
                            "list": {
                                "0": "IP地址以获取地理信息",
                                "1": "浏览器指纹识别以确定浏览器技术或/和版本"
                            }
                        }
                    },
                    "heading": "使用个人信息"
                },
                "whatIsPersonalInfo": {
                    "description": {
                        "list1": {
                            "0": "您的用户名（除了您的雇主创建的用户名未根据合同而创建的情况）",
                            "1": "您的出生日期/年龄",
                            "2": "用于登录的IP地址",
                            "3": "如果您使用设备（例如，电话或平板电脑）登录的设备ID"
                        },
                        "list2": {
                            "0": "您起源于TCP/IP连接的城市/国家/地区",
                            "1": "您登录的一天中的时间（年，月，周，小时或分钟）",
                            "2": "您用来登录的设备类型（例如，电话或平板电脑）",
                            "3": "操作系统和通用浏览器信息"
                        },
                        "para1": "WSO2认为与您相关的任何事物，并且可以将其确定为您的个人信息。这包括但不限于：",
                        "para2": "但是，WSO2还收集了以下不被视为个人信息的信息，但仅用于<1>统计目的。这样做的原因是该信息不能用于跟踪您。"
                    },
                    "heading": "什么是个人信息？"
                }
            }
        },
        "profile": {
            "fields": {
                "Account Confirmed Time": "帐户确认时间",
                "Account Disabled": "帐户已禁用",
                "Account Locked": "帐户被锁定",
                "Account State": "帐户状态",
                "Active": "积极的",
                "Address - Street": "街道地址",
                "Ask Password": "询问密码",
                "Backup Code Enabled": "启用备份代码",
                "Backup Codes": "备份代码",
                "Birth Date": "出生日期",
                "Country": "国家",
                "Created Time": "创建的时间",
                "Disable EmailOTP": "禁用EmailOTP",
                "Disable SMSOTP": "禁用SMSOTP",
                "Display Name": "显示名称",
                "Email": "电子邮件",
                "Email Verified": "电子邮件已验证",
                "Enabled Authenticators": "启用了身份验证者",
                "Existing Lite User": "现有的Lite用户",
                "External ID": "外部ID",
                "Failed Attempts Before Success": "成功之前的尝试失败",
                "Failed Backup Code Attempts": "备份代码尝试失败",
                "Failed Email OTP Attempts": "电子邮件OTP尝试失败",
                "Failed Lockout Count": "锁定计数失败",
                "Failed Login Attempts": "登录尝试失败",
                "Failed Password Recovery Attempts": "密码恢复尝试失败",
                "Failed SMS OTP Attempts": "失败的SMS OTP尝试",
                "Failed TOTP Attempts": "失败的TOTP尝试",
                "First Name": "名",
                "Force Password Reset": "强制密码重置",
                "Full Name": "全名",
                "Gender": "性别",
                "Groups": "组",
                "Identity Provider Type": "身份提供商类型",
                "Last Logon": "最后登录",
                "Last Modified Time": "最后修改时间",
                "Last Name": "姓",
                "Last Password Update": "最后一个密码更新",
                "Lite User": "Lite用户",
                "Lite User ID": "Lite用户ID",
                "Local": "当地的",
                "Local Credential Exists": "存在本地证书",
                "Locality": "地区",
                "Location": "地点",
                "Locked Reason": "锁定原因",
                "Manager - Name": "经理 - 名称",
                "Middle Name": "中间名字",
                "Mobile": "移动的",
                "Nick Name": "昵称",
                "Phone Verified": "电话已验证",
                "Photo - Thumbnail": "照片 - 缩略图",
                "Photo URL": "照片URL",
                "Postal Code": "邮政编码",
                "Preferred Channel": "首选通道",
                "Read Only User": "仅阅读用户",
                "Region": "地区",
                "Resource Type": "资源类型",
                "Roles": "角色",
                "Secret Key": "密钥",
                "TOTP Enabled": "启用TOTP",
                "Time Zone": "时区",
                "URL": "URL",
                "Unlock Time": "解锁时间",
                "User Account Type": "用户帐户类型",
                "User ID": "用户身份",
                "User Metadata - Version": "用户元数据 - 版本",
                "User Source": "用户来源",
                "User Source ID": "用户源ID",
                "Username": "用户名",
                "Verification Pending Email": "验证等待电子邮件",
                "Verification Pending Mobile Number": "验证待处理电话号码",
                "Verify Email": "验证邮件",
                "Verify Mobile": "验证手机",
                "Verify Secret Key": "验证秘密键",
                "Website URL": "网址",
                "emails": "电子邮件",
                "generic": {
                    "default": "添加{{fieldName}}"
                },
                "nameFamilyName": "姓",
                "nameGivenName": "名",
                "phoneNumbers": "电话号码",
                "profileImage": "个人资料图像",
                "profileUrl": "URL",
                "userName": "用户名"
            },
            "forms": {
                "countryChangeForm": {
                    "inputs": {
                        "country": {
                            "placeholder": "选择您的国家"
                        }
                    }
                },
                "dateChangeForm": {
                    "inputs": {
                        "date": {
                            "validations": {
                                "futureDateError": "您输入的{{field}}字段的日期无效。",
                                "invalidFormat": "请在格式yyyy-mm-dd中输入有效{{fieldName}}。"
                            }
                        }
                    }
                },
                "emailChangeForm": {
                    "inputs": {
                        "email": {
                            "label": "电子邮件",
                            "note": "注意：编辑此更改与此帐户关联的电子邮件地址。此电子邮件地址也用于帐户恢复。",
                            "placeholder": "输入你的电子邮箱地址",
                            "validations": {
                                "empty": "电子邮件地址是必需的字段",
                                "invalidFormat": "请输入有效的电子邮件地址。您可以使用字母数字字符，Unicode字符，下划线（_），dashes（ - ），周期（。）和AT符号（@）。"
                            }
                        }
                    }
                },
                "generic": {
                    "inputs": {
                        "placeholder": "输入您的{{fieldName}}",
                        "readonly": {
                            "placeholder": "这个值是空的",
                            "popup": "联系管理员以更新您的{{fieldName}}"
                        },
                        "validations": {
                            "empty": "{{fieldName}}是必需的字段",
                            "invalidFormat": "输入的{{fieldName}}的格式不正确"
                        }
                    }
                },
                "mobileChangeForm": {
                    "inputs": {
                        "mobile": {
                            "label": "手机号码",
                            "note": "注意：这将更改您的个人资料中的手机号码",
                            "placeholder": "输入你的手机号码",
                            "validations": {
                                "empty": "手机号码是必需的字段",
                                "invalidFormat": "请以格式[+] [country Code] [区域代码] [本地电话号码]输入有效的手机号码。"
                            }
                        }
                    }
                },
                "nameChangeForm": {
                    "inputs": {
                        "firstName": {
                            "label": "名",
                            "placeholder": "输入名字",
                            "validations": {
                                "empty": "名字是必需的字段"
                            }
                        },
                        "lastName": {
                            "label": "姓",
                            "placeholder": "输入姓氏",
                            "validations": {
                                "empty": "姓是必需的字段"
                            }
                        }
                    }
                },
                "organizationChangeForm": {
                    "inputs": {
                        "organization": {
                            "label": "组织",
                            "placeholder": "输入您的组织",
                            "validations": {
                                "empty": "组织是必需的领域"
                            }
                        }
                    }
                }
            },
            "messages": {
                "emailConfirmation": {
                    "content": "请确认电子邮件地址更新，以便将新电子邮件添加到您的个人资料中。",
                    "header": "确认待定！"
                },
                "mobileVerification": {
                    "content": "当启用第二个因子身份验证并在用户名/密码恢复时发送恢复代码时，该手机号码用于发送SMS OTP。要更新此数字，您必须通过输入发送到您的新号码的验证代码来验证新号码。如果您愿意，请单击更新。"
                }
            },
            "notifications": {
                "getProfileCompletion": {
                    "error": {
                        "description": "{{description}}",
                        "message": "发生了错误"
                    },
                    "genericError": {
                        "description": "评估配置文件完成时发生错误",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "个人资料完成成功评估",
                        "message": "计算成功"
                    }
                },
                "getProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "检索个人资料详细信息时发生错误"
                    },
                    "genericError": {
                        "description": "检索个人资料详细信息时发生错误",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "成功检索了所需的用户资料详细信息",
                        "message": "成功检索了用户配置文件"
                    }
                },
                "getUserReadOnlyStatus": {
                    "genericError": {
                        "description": "检索用户仅阅读状态时发生错误",
                        "message": "出了些问题"
                    }
                },
                "updateProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "更新配置文件详细信息时发生了错误"
                    },
                    "genericError": {
                        "description": "更新配置文件详细信息时发生了错误",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "所需的用户个人资料详细信息已成功更新",
                        "message": "用户个人资料成功更新了"
                    }
                }
            },
            "placeholders": {
                "SCIMDisabled": {
                    "heading": "此功能不适合您的帐户"
                }
            }
        },
        "profileExport": {
            "notifications": {
                "downloadProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "下载用户个人资料详细信息时发生错误"
                    },
                    "genericError": {
                        "description": "下载用户个人资料详细信息时发生错误",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "包含所需用户个人资料详细信息的文件已开始下载",
                        "message": "用户个人资料详细信息开始下载"
                    }
                }
            }
        },
        "userAvatar": {
            "infoPopover": "该图像已从<1> Gravatar服务中检索。",
            "urlUpdateHeader": "输入图像URL设置您的个人资料图片"
        },
        "userSessions": {
            "browserAndOS": "{{{browser}} on {{os}}} {{version}}}",
            "dangerZones": {
                "terminate": {
                    "actionTitle": "终止",
                    "header": "终止会话",
                    "subheader": "您将在特定设备上登录会话。"
                }
            },
            "lastAccessed": "最后访问{{date}}",
            "modals": {
                "terminateActiveUserSessionModal": {
                    "heading": "终止电流活动会话",
                    "message": "第二因素身份验证（2FA）选项更改将不会应用于您的活动会议。我们建议您终止它们。",
                    "primaryAction": "终止所有",
                    "secondaryAction": "审查和终止"
                },
                "terminateAllUserSessionsModal": {
                    "heading": "确认",
                    "message": "该操作将使您从本会话中记录下来，以及每个设备上的所有其他会话。你想继续吗？"
                },
                "terminateUserSessionModal": {
                    "heading": "确认",
                    "message": "此操作将在特定设备上将您的会话记录在会话中。你想继续吗？"
                }
            },
            "notifications": {
                "fetchSessions": {
                    "error": {
                        "description": "{{description}}",
                        "message": "错误检索活动会话"
                    },
                    "genericError": {
                        "description": "无法检索任何活动会议",
                        "message": "出了些问题"
                    },
                    "success": {
                        "description": "成功检索了主动会议",
                        "message": "积极的会话检索成功"
                    }
                },
                "terminateAllUserSessions": {
                    "error": {
                        "description": "{{description}}",
                        "message": "无法终止主动会议"
                    },
                    "genericError": {
                        "description": "终止主动会议时出了问题",
                        "message": "无法终止主动会议"
                    },
                    "success": {
                        "description": "成功终止了所有主动会议",
                        "message": "终止所有活动会议"
                    }
                },
                "terminateUserSession": {
                    "error": {
                        "description": "{{description}}",
                        "message": "无法终止活动会话"
                    },
                    "genericError": {
                        "description": "终止活动会话时出了问题",
                        "message": "无法终止活动会话"
                    },
                    "success": {
                        "description": "成功终止了活动会话",
                        "message": "会话终止成功"
                    }
                }
            }
        },
        verificationOnUpdate: {
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "验证更新首选项时出错"
                    },
                    genericError: {
                        description: "验证更新首选项时发生错误",
                        message: "出了些问题"
                    },
                    success: {
                        description: "已成功检索更新首选项的验证",
                        message: "验证更新偏好检索成功"
                    }
                }
            }
        }
    },
    "modals": {
        "editAvatarModal": {
            "content": {
                "gravatar": {
                    "errors": {
                        "noAssociation": {
                            "content": "似乎所选的电子邮件未在Gravatar上注册。<1>通过访问Gravatar</1>官方网站或使用以下一个，注册Gravatar帐户。",
                            "header": "找不到匹配的Gravatar图像！"
                        }
                    },
                    "heading": "基于Gravatar"
                },
                "hostedAvatar": {
                    "heading": "托管图像",
                    "input": {
                        "errors": {
                            "http": {
                                "content": "选定的URL指向HTTP上提供的不安全图像。请谨慎行事。",
                                "header": "不安全的内容！"
                            },
                            "invalid": {
                                "content": "请输入有效的图像URL"
                            }
                        },
                        "hint": "输入有效的图像URL，该图像URL托管在第三方位置。",
                        "placeholder": "输入图像的URL。",
                        "warnings": {
                            "dataURL": {
                                "content": "使用具有大量字符数的数据URL可能会导致数据库问题。谨慎行事。",
                                "header": "仔细检查输入的数据URL！"
                            }
                        }
                    }
                },
                "systemGenAvatars": {
                    "heading": "系统生成的头像",
                    "types": {
                        "initials": "缩写"
                    }
                }
            },
            "description": null,
            "heading": "更新个人资料图片",
            "primaryButton": "节省",
            "secondaryButton": "取消"
        },
        "sessionTimeoutModal": {
            "description": "当您单击<1>返回时，如果存在，我们将尝试恢复会话。如果您没有活动的会话，则将重定向到登录页面。",
            "heading": "看来您已经无活跃了很长时间。",
            "loginAgainButton": "再次登录",
            "primaryButton": "回去",
            "secondaryButton": "登出",
            "sessionTimedOutDescription": "请再次登录以继续从您离开的地方继续。",
            "sessionTimedOutHeading": "用户会话由于不活动而过期。"
        }
    },
    "pages": {
        "applications": {
            "subTitle": "发现并访问您的应用程序",
            "title": "申请"
        },
        "overview": {
            "subTitle": "管理您的个人信息，帐户安全和隐私设置",
            "title": "欢迎，{{firstName}}"
        },
        "personalInfo": {
            "subTitle": "编辑或导出您的个人资料并管理链接帐户",
            "title": "个人信息"
        },
        "personalInfoWithoutExportProfile": {
            "subTitle": "查看和管理您的个人信息",
            "title": "个人信息"
        },
        "personalInfoWithoutLinkedAccounts": {
            "subTitle": "编辑或导出您的个人资料",
            "title": "个人信息"
        },
        "privacy": {
            "subTitle": "",
            "title": "WSO2身份服务器隐私政策"
        },
        "readOnlyProfileBanner": "您的个人资料无法从此门户网站修改。请联系您的管理员以获取更多详细信息。",
        "security": {
            "subTitle": "通过管理同意，会议和安全设置来保护您的帐户",
            "title": "安全"
        }
    },
    "placeholders": {
        "404": {
            "action": "回到家",
            "subtitles": {
                "0": "我们找不到您要寻找的页面。",
                "1": "请检查URL或单击下面的按钮以重定向回主页。"
            },
            "title": "找不到网页"
        },
        "accessDeniedError": {
            "action": "回到家",
            "subtitles": {
                "0": "似乎您不允许您访问此页面。",
                "1": "请尝试使用其他帐户登录。"
            },
            "title": "未授予访问"
        },
        "emptySearchResult": {
            "action": "清除搜索查询",
            "subtitles": {
                "0": "我们找不到“ {{query}}”的任何结果",
                "1": "请尝试其他搜索词。"
            },
            "title": "未找到结果"
        },
        "genericError": {
            "action": "刷新页面",
            "subtitles": {
                "0": "显示此页面时出现问题。",
                "1": "有关技术细节，请参见浏览器控制台。"
            },
            "title": "出了些问题"
        },
        "loginError": {
            "action": "继续注销",
            "subtitles": {
                "0": "似乎您没有使用此门户的权限。",
                "1": "请用不同的帐户登录。"
            },
            "title": "您没有权限"
        },
        "sessionStorageDisabled": {
            "subtitles": {
                "0": "要使用此应用程序，您必须在Web浏览器设置中启用Cookie。",
                "1": "有关如何启用cookie的更多信息，请参见Web浏览器的“帮助”部分。"
            },
            "title": "cookie在您的浏览器中被禁用。"
        }
    },
    "sections": {
        "accountRecovery": {
            "description": "管理我们可以用来帮助您恢复密码的恢复信息",
            "emptyPlaceholderText": "没有帐户恢复选项",
            "heading": "帐户恢复"
        },
        "changePassword": {
            "actionTitles": {
                "change": "更改您的密码"
            },
            "description": "定期更新密码，并确保您使用的其他密码是唯一的。",
            "heading": "更改密码"
        },
        "consentManagement": {
            "actionTitles": {
                "empty": "您尚未同意任何申请"
            },
            "description": "查看您为每个申请提供的同意。另外，您可以根据需要撤销其中一个或许多。",
            "heading": "管理同意",
            "placeholders": {
                "emptyConsentList": {
                    "heading": "您尚未同意任何申请"
                }
            }
        },
        "createPassword": {
            "actionTitles": {
                "create": "创建密码"
            },
            "description": "在{{productName}}中创建密码。您还可以使用此密码登录到{{productName}}外，除了社交登录外。",
            "heading": "创建密码"
        },
        "federatedAssociations": {
            "description": "通过与此帐户关联的其他连接查看您的帐户",
            "heading": "链接的社会帐户"
        },
        "linkedAccounts": {
            "actionTitles": {
                "add": "新增帐户"
            },
            "description": "链接/关联您的其他帐户，并无需重新连接而无缝访问它们",
            "heading": "关联账户"
        },
        "mfa": {
            "description": "配置其他身份验证以轻松登录或在您的帐户中添加额外的安全层。",
            "heading": "其他身份验证"
        },
        "profile": {
            "description": "管理您的个人资料",
            "heading": "轮廓"
        },
        "profileExport": {
            "actionTitles": {
                "export": "下载个人资料"
            },
            "description": "下载您的所有个人资料数据，包括个人数据和链接帐户",
            "heading": "导出资料"
        },
        "userSessions": {
            "actionTitles": {
                "empty": "没有主动会议",
                "terminateAll": "终止所有会议"
            },
            "description": "查看您帐户的所有活动用户会议",
            "heading": "活跃期",
            "placeholders": {
                "emptySessionList": {
                    "heading": "该用户没有主动会议"
                }
            }
        }
    }
};
