/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { governanceConnectorsNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const governanceConnectors: governanceConnectorsNS = {
    goBackLoginAndRegistration: "Quay lại đăng nhập & đăng ký",
    categories: "Danh mục",
    connectorSubHeading: "Cấu hình cài đặt {{ name }}.",
    connectorCategories: {
        passwordPolicies : {
            name: "Chính sách mật khẩu",
            description: "Cấu hình chính sách mật khẩu để tăng cường độ mạnh mật khẩu người dùng.",
            connectors: {
                passwordExpiry: {
                    friendlyName: "Hết hạn mật khẩu"
                },
                passwordHistory: {
                    friendlyName: "Lịch sử mật khẩu",
                    properties: {
                        passwordHistoryEnable: {
                            hint: "Người dùng sẽ không được phép sử dụng lại các mật khẩu đã dùng trước đó.",
                            label: "Kiểm tra lịch sử mật khẩu"
                        },
                        passwordHistoryCount: {
                            hint: "Hạn chế sử dụng số lượng mật khẩu dùng gần nhất này khi cập nhật mật khẩu.",
                            label: "Số lượng mật khẩu kiểm tra trong lịch sử"
                        }
                    }
                },
                passwordPolicy: {
                    friendlyName: "Mẫu mật khẩu",
                    properties: {
                        passwordPolicyEnable: {
                            hint: "Kiểm tra mật khẩu người dùng theo một chính sách",
                            label: "Kiểm tra mật khẩu dựa trên một mẫu chính sách"
                        },
                        passwordPolicyMinLength: {
                            hint: "Số ký tự tối thiểu trong mật khẩu.",
                            label: "Số ký tự tối thiểu"
                        },
                        passwordPolicyMaxLength: {
                            hint: "Số ký tự tối đa trong mật khẩu.",
                            label: "Số ký tự tối đa"
                        },
                        passwordPolicyPattern: {
                            hint: "Mẫu biểu thức chính quy để kiểm tra mật khẩu.",
                            label: "Regex mẫu mật khẩu"
                        },
                        passwordPolicyErrorMsg: {
                            hint: "Thông báo lỗi này sẽ được hiển thị khi phát hiện vi phạm mẫu.",
                            label: "Thông báo lỗi khi vi phạm mẫu"
                        }
                    }
                }
            }
        },
        userOnboarding : {
            name: "Onboarding người dùng",
            description: "Cấu hình cài đặt onboarding người dùng.",
            connectors: {
                askPassword: {
                    friendlyName: "Mời người dùng đặt mật khẩu"
                },
                selfSignUp: {
                    friendlyName: "Tự đăng ký",
                    properties: {
                        selfRegistrationEnable: {
                            hint: "Cho phép người dùng tự đăng ký vào hệ thống.",
                            label: "Tự đăng ký của người dùng"
                        },
                        selfRegistrationLockOnCreation: {
                            hint: "Khóa tài khoản người dùng tự đăng ký cho đến khi xác minh email.",
                            label: "Khóa tài khoản người dùng khi tạo"
                        },
                        selfRegistrationSendConfirmationOnCreation: {
                            hint: "Bật xác nhận tài khoản người dùng khi tài khoản người dùng không bị khóa khi tạo",
                            label: "Bật xác nhận tài khoản khi tạo"
                        },
                        selfRegistrationNotificationInternallyManage: {
                            hint: "Tắt nếu ứng dụng khách tự xử lý việc gửi thông báo",
                            label: "Quản lý việc gửi thông báo nội bộ"
                        },
                        selfRegistrationReCaptcha: {
                            hint: "Bật xác minh reCaptcha trong quá trình tự đăng ký.",
                            label: "Nhắc reCaptcha"
                        },
                        selfRegistrationVerificationCodeExpiryTime: {
                            hint: "Chỉ định thời gian hết hạn tính bằng phút cho liên kết xác minh.",
                            label: "Thời gian hết hạn liên kết xác minh tự đăng ký của người dùng"
                        },
                        selfRegistrationVerificationCodeSmsotpExpiryTime: {
                            hint: "Chỉ định thời gian hết hạn tính bằng phút cho SMS OTP.",
                            label: "Thời gian hết hạn SMS OTP tự đăng ký của người dùng"
                        },
                        selfRegistrationSmsotpRegex: {
                            hint: "Regex cho SMS OTP ở định dạng [ký tự được phép]{độ dài}. Các dải ký tự được hỗ trợ là a-z, A-Z, 0-9. Độ dài OTP tối thiểu là 4",
                            label: "Regex SMS OTP tự đăng ký của người dùng"
                        },
                        selfRegistrationCallbackRegex: {
                            hint: "Tiền tố này sẽ được dùng để kiểm tra URL callback.",
                            label: "Regex URL callback tự đăng ký của người dùng"
                        },
                        urlListPurposeSelfSignUp: {
                            hint: "Nhấn vào đây để quản lý các mục đích Tự đăng ký",
                            label: "Quản lý các mục đích Tự đăng ký"
                        },
                        selfRegistrationNotifyAccountConfirmation: {
                            hint: "Bật gửi thông báo cho xác nhận tự đăng ký.",
                            label: "Gửi email xác nhận đăng ký"
                        },
                        selfRegistrationResendConfirmationReCaptcha: {
                            hint: "Nhắc xác minh reCaptcha khi gửi lại xác nhận",
                            label: "Nhắc reCaptcha khi gửi lại xác nhận"
                        },
                        selfRegistrationAutoLoginEnable: {
                            hint: "Người dùng sẽ được đăng nhập tự động sau khi hoàn thành Xác nhận tài khoản",
                            label: "Bật tự động đăng nhập sau khi xác nhận tài khoản"
                        },
                        selfRegistrationAutoLoginAliasName: {
                            hint: "Alias của khóa dùng để ký cookie. Khóa công khai phải được nhập vào keystore.",
                            label: "Alias của khóa dùng để ký cookie"
                        }
                    }
                },
                liteUserSignUp: {
                    friendlyName: "Đăng ký người dùng rút gọn",
                    properties: {
                        liteRegistrationEnable: {
                            hint: "Cho phép người dùng tự đăng ký vào hệ thống mà không cần mật khẩu.",
                            label: "Đăng ký người dùng rút gọn"
                        },
                        liteRegistrationLockOnCreation: {
                            hint: "Khóa tài khoản người dùng tự đăng ký cho đến khi xác minh email.",
                            label: "Khóa tài khoản người dùng khi tạo"
                        },
                        liteRegistrationNotificationInternallyManage: {
                            hint: "Tắt nếu ứng dụng khách tự xử lý việc gửi thông báo",
                            label: "Quản lý việc gửi thông báo nội bộ"
                        },
                        liteRegistrationReCaptcha: {
                            hint: "Bật xác minh reCaptcha trong quá trình tự đăng ký.",
                            label: "Nhắc reCaptcha"
                        },
                        liteRegistrationVerificationCodeExpiryTime: {
                            hint: "Chỉ định thời gian hết hạn tính bằng phút cho liên kết xác minh.",
                            label: "Thời gian hết hạn liên kết xác minh đăng ký người dùng rút gọn"
                        },
                        liteRegistrationVerificationCodeSmsotpExpiryTime: {
                            hint: "Chỉ định thời gian hết hạn tính bằng phút cho SMS OTP.",
                            label: "Thời gian hết hạn SMS OTP đăng ký người dùng rút gọn"
                        },
                        liteRegistrationSmsotpRegex: {
                            hint: "Regex cho SMS OTP ở định dạng [ký tự được phép]{độ dài}. Các dải ký tự được hỗ trợ là a-z, A-Z, 0-9. Độ dài OTP tối thiểu là 4",
                            label: "Regex SMS OTP đăng ký người dùng rút gọn"
                        },
                        liteRegistrationCallbackRegex: {
                            hint: "Tiền tố này sẽ được dùng để kiểm tra URL callback.",
                            label: "Regex URL callback đăng ký người dùng rút gọn"
                        },
                        urlListPurposeLiteUserSignUp: {
                            hint: "Nhấn vào đây để quản lý các mục đích Đăng ký rút gọn",
                            label: "Quản lý các mục đích Đăng ký rút gọn"
                        }
                    }
                },
                userEmailVerification: {
                    friendlyName: "Yêu cầu đặt mật khẩu",
                    properties: {
                        emailVerificationEnable: {
                            hint: "Một email sẽ được gửi đến người dùng để đặt mật khẩu sau khi tạo người dùng.",
                            label: "Bật lời mời qua email để thiết lập mật khẩu người dùng"
                        },
                        emailVerificationLockOnCreation: {
                            hint: "Tài khoản người dùng sẽ bị khóa trong quá trình tạo người dùng.",
                            label: "Bật khóa tài khoản khi tạo"
                        },
                        emailVerificationNotificationInternallyManage: {
                            hint: "Tắt nếu ứng dụng khách tự xử lý việc gửi thông báo.",
                            label: "Quản lý việc gửi thông báo nội bộ"
                        },
                        emailVerificationExpiryTime: {
                            hint: "Đặt khoảng thời gian email xác minh còn hiệu lực, tính bằng phút. (Để thời hạn vô hạn, đặt -1)",
                            label: "Thời gian hết hạn mã xác minh email"
                        },
                        emailVerificationAskPasswordExpiryTime: {
                            hint: "Đặt khoảng thời gian email yêu cầu mật khẩu còn hiệu lực, tính bằng phút. (Để thời hạn vô hạn, đặt -1)",
                            label: "Thời gian hết hạn mã yêu cầu mật khẩu"
                        },
                        emailVerificationAskPasswordPasswordGenerator: {
                            hint: "Điểm mở rộng tạo mật khẩu tạm thời trong tính năng yêu cầu mật khẩu.",
                            label: "Lớp mở rộng tạo mật khẩu tạm thời"
                        },
                        urlListPurposeJitProvisioning: {
                            hint: "Nhấn vào đây để quản lý các mục đích cấp phát just in time.",
                            label: "Quản lý các mục đích cấp phát JIT"
                        }
                    }
                },
                registrationFlowBuilder: {
                    friendlyName: "Luồng đăng ký",
                    description: "Thiết kế và tùy chỉnh hành trình đăng ký người dùng với trình biên soạn luồng " +
                        "linh hoạt, không cần mã."
                }
            }
        },
        loginAttemptsSecurity : {
            name: "Bảo mật lần đăng nhập",
            description: "Cấu hình cài đặt bảo mật cho các lần đăng nhập.",
            connectors: {
                accountLockHandler: {
                    friendlyName: "Khóa tài khoản",
                    properties: {
                        accountLockHandlerLockOnMaxFailedAttemptsEnable: {
                            hint: "Khóa tài khoản người dùng khi đăng nhập thất bại",
                            label: "Khóa tài khoản người dùng khi đạt số lần thất bại tối đa"
                        },
                        accountLockHandlerOnFailureMaxAttempts: {
                            hint: "Số lần đăng nhập thất bại được phép trước khi khóa tài khoản.",
                            label: "Số lần đăng nhập thất bại tối đa"
                        },
                        accountLockHandlerTime: {
                            hint: "Thời gian khóa tài khoản ban đầu tính bằng phút. Tài khoản sẽ tự động được mở khóa sau khoảng thời gian này.",
                            label: "Thời gian khóa tài khoản ban đầu"
                        },
                        accountLockHandlerLoginFailTimeoutRatio: {
                            hint: "Thời gian khóa tài khoản sẽ được tăng theo hệ số này. Ví dụ: Thời gian ban đầu: 5 phút; Hệ số tăng: 2; Thời gian khóa tiếp theo: 5 x 2 = 10 phút",
                            label: "Hệ số tăng thời gian khóa tài khoản"
                        },
                        accountLockHandlerNotificationManageInternally: {
                            hint: "Tắt nếu ứng dụng khách tự xử lý việc gửi thông báo",
                            label: "Quản lý việc gửi thông báo nội bộ"
                        },
                        accountLockHandlerNotificationNotifyOnLockIncrement: {
                            hint: "Thông báo cho người dùng khi thời gian khóa tài khoản tăng do đăng nhập thất bại liên tục.",
                            label: "Thông báo cho người dùng khi thời gian khóa tăng"
                        }
                    }
                },
                ssoLoginRecaptcha: {
                    friendlyName: "reCaptcha cho đăng nhập SSO",
                    properties: {
                        ssoLoginRecaptchaEnableAlways: {
                            hint: "Luôn nhắc xác minh reCaptcha trong luồng đăng nhập SSO.",
                            label: "Luôn nhắc reCaptcha"
                        },
                        ssoLoginRecaptchaEnable: {
                            hint: "Chỉ nhắc xác minh reCaptcha trong luồng đăng nhập SSO sau khi vượt quá số lần thất bại tối đa.",
                            label: "Nhắc reCaptcha sau số lần thất bại tối đa"
                        },
                        ssoLoginRecaptchaOnMaxFailedAttempts: {
                            hint: "Số lần thất bại được phép mà không nhắc xác minh reCaptcha.",
                            label: "Số lần thất bại tối đa cho reCaptcha"
                        }
                    }
                },
                siftConnector: {
                    title: "Tích hợp Sift",
                    eventPublishing: {
                        title: "Cấu hình xuất bản sự kiện",
                        subtitle: "Chọn những hoạt động người dùng sẽ được xuất bản đến Sift và dữ liệu nào sẽ được đưa vào payload.",
                        eventProperties: {
                            title: "Sự kiện sẽ xuất bản",
                            subtitle: "Chọn các sự kiện bạn muốn xuất bản đến Sift để phân tích.",
                            piiPublishingWarning: "Bạn đã bật gửi cả dữ liệu hồ sơ người dùng và thiết bị (ví dụ: email, tên, địa chỉ IP) đến Sift. " +
                                "Hãy đảm bảo điều này tuân thủ chính sách quyền riêng tư của tổ chức bạn.",
                            publishDeviceMetadata: {
                                label: "Bao gồm siêu dữ liệu thiết bị người dùng trong payload sự kiện",
                                description: "Xuất bản siêu dữ liệu thiết bị người dùng như địa chỉ IP và user agent.",
                                warning: "Thao tác này sẽ gửi địa chỉ IP và user agent, có thể được coi là dữ liệu cá nhân. " +
                                    "Hãy đảm bảo điều này tuân thủ chính sách quyền riêng tư và các thỏa thuận chia sẻ dữ liệu của tổ chức bạn."
                            },
                            publishUserInfo: {
                                label: "Bao gồm thông tin hồ sơ người dùng trong payload sự kiện",
                                description: "Xuất bản các thuộc tính người dùng như tên đăng nhập, email, số điện thoại, v.v.",
                                warning: "Thao tác này sẽ gửi các định danh người dùng trực tiếp, nhạy cảm đến Sift. " +
                                    "Hãy đảm bảo điều này tuân thủ chính sách quyền riêng tư và các thỏa thuận chia sẻ dữ liệu của tổ chức bạn."
                            },
                            events: {
                                logins: {
                                    label: "Đăng nhập",
                                    hint: "Xuất bản các sự kiện đăng nhập của người dùng."
                                },
                                logouts: {
                                    label: "Đăng xuất",
                                    hint: "Xuất bản các sự kiện đăng xuất của người dùng."
                                },
                                registrations: {
                                    label: "Đăng ký",
                                    hint: "Xuất bản các sự kiện đăng ký của người dùng."
                                },
                                credentialUpdates: {
                                    label: "Cập nhật thông tin xác thực",
                                    hint: "Xuất bản các sự kiện cập nhật thông tin xác thực của người dùng."
                                },
                                userProfileUpdates: {
                                    label: "Cập nhật hồ sơ người dùng",
                                    hint: "Xuất bản các sự kiện cập nhật hồ sơ người dùng."
                                },
                                userVerifications: {
                                    label: "Xác minh người dùng",
                                    hint: "Xuất bản các sự kiện xác minh người dùng dựa trên thông báo."
                                }
                            }
                        },
                        eventDiagnostics: {
                            title: "Ghi log chẩn đoán",
                            logRequestPayload: {
                                label: "Ghi log payload sự kiện cục bộ",
                                description: "Lưu một bản sao của mỗi payload sự kiện vào log chẩn đoán cục bộ cho mục đích gỡ lỗi."
                            }
                        }
                    },
                    properties: {
                        name: "Phát hiện gian lận",
                        description: "Tích hợp Sift để phát hiện và ngăn chặn các lần đăng nhập tài khoản gian lận.",
                        siftConnectorApiKey: {
                            label: "Sift API Key",
                            placeholder: "Nhập Sift API Key"
                        }
                    },
                    notifications: {
                        configurationUpdate: {
                            error: {
                                description: "Đã xảy ra lỗi khi cập nhật cấu hình Sift.",
                                message: "Lỗi cập nhật"
                            },
                            success: {
                                description: "Đã cập nhật cấu hình Sift thành công.",
                                message: "Cập nhật thành công"
                            }
                        },
                        eventPropertiesUpdate: {
                            error: {
                                description: "Đã xảy ra lỗi khi cập nhật cấu hình xuất bản sự kiện.",
                                message: "Lỗi cập nhật cấu hình sự kiện"
                            }
                        }
                    }
                }
            }
        },
        accountManagement : {
            name: "Quản lý tài khoản",
            description: "Cấu hình cài đặt quản lý tài khoản.",
            connectors: {
                suspensionNotification: {
                    friendlyName: "Tạm ngưng tài khoản không hoạt động",
                    properties: {
                        suspensionNotificationEnable: {
                            hint: "Khóa tài khoản người dùng sau một khoảng thời gian không hoạt động.",
                            label: "Tạm ngưng tài khoản người dùng không hoạt động"
                        },
                        suspensionNotificationAccountDisableDelay: {
                            hint: "Khoảng thời gian tính bằng ngày trước khi khóa tài khoản người dùng.",
                            label: "Thời gian không hoạt động được phép tính bằng ngày"
                        },
                        suspensionNotificationDelays: {
                            hint: "Gửi cảnh báo cho người dùng trước khi khóa tài khoản, sau mỗi khoảng thời gian. Chấp nhận nhiều giá trị phân tách bằng dấu phẩy.",
                            label: "Các khoảng thời gian gửi cảnh báo tính bằng ngày"
                        }
                    }
                },
                accountDisableHandler: {
                    friendlyName: "Vô hiệu hóa tài khoản",
                    description: "Cấu hình cài đặt vô hiệu hóa tài khoản.",
                    properties: {
                        accountDisableHandlerEnable: {
                            hint: "Cho phép người dùng quản trị vô hiệu hóa tài khoản người dùng",
                            label: "Bật vô hiệu hóa tài khoản"
                        },
                        accountDisableHandlerNotificationManageInternally: {
                            hint: "Tắt, nếu ứng dụng khách tự xử lý việc gửi thông báo",
                            label: "Quản lý việc gửi thông báo nội bộ"
                        }
                    },
                    notifications: {
                        configurationUpdate: {
                            error: {
                                description: "Đã xảy ra lỗi khi cập nhật cấu hình vô hiệu hóa tài khoản.",
                                message: "Lỗi cập nhật"
                            },
                            success: {
                                description: "Đã cập nhật cấu hình vô hiệu hóa tài khoản thành công.",
                                message: "Cập nhật thành công"
                            }
                        },
                        revertConfiguration: {
                            success: {
                                description: "Đã hoàn tác cấu hình vô hiệu hóa tài khoản thành công.",
                                message: "Hoàn tác thành công"
                            },
                            error: {
                                description: "Đã xảy ra lỗi khi hoàn tác cấu hình vô hiệu hóa tài khoản.",
                                message: "Lỗi hoàn tác"
                            }
                        }
                    }
                },
                multiattributeLoginHandler: {
                    friendlyName: "Đăng nhập đa thuộc tính",
                    description: "Cấu hình các định danh đăng nhập thay thế và cho phép người dùng sử dụng tên đăng nhập hoặc định danh đăng nhập đã cấu hình trong các luồng đăng nhập và khôi phục.",
                    properties: {
                        accountMultiattributeloginHandlerEnable: {
                            hint: "Bật sử dụng nhiều thuộc tính làm định danh đăng nhập",
                            label: "Bật đăng nhập đa thuộc tính"
                        },
                        accountMultiattributeloginHandlerAllowedattributes: {
                            hint: "Danh sách claim được phép phân tách bằng dấu phẩy",
                            label: "Danh sách claim thuộc tính được phép"
                        }
                    }
                },
                accountRecovery: {
                    friendlyName: "Quản lý tài khoản",
                    properties: {
                        recoveryNotificationPasswordEnable: {
                            label: "Khôi phục mật khẩu dựa trên thông báo"
                        },
                        recoveryReCaptchaPasswordEnable: {
                            label: "Bật reCaptcha cho khôi phục mật khẩu"
                        },
                        recoveryQuestionPasswordEnable: {
                            label: "Khôi phục mật khẩu dựa trên câu hỏi bảo mật"
                        },
                        recoveryQuestionPasswordMinAnswers: {
                            label: "Số câu hỏi cần thiết cho khôi phục mật khẩu"
                        },
                        recoveryQuestionAnswerRegex: {
                            hint: "Regex cho câu trả lời câu hỏi bảo mật",
                            label: "Regex cho câu trả lời câu hỏi bảo mật"
                        },
                        recoveryQuestionAnswerUniqueness: {
                            hint: "Bắt buộc tính duy nhất của câu trả lời câu hỏi bảo mật",
                            label: "Bắt buộc tính duy nhất của câu trả lời câu hỏi bảo mật"
                        },
                        recoveryQuestionPasswordReCaptchaEnable: {
                            hint: "Nhắc reCaptcha cho khôi phục mật khẩu dựa trên câu hỏi bảo mật",
                            label: "Bật reCaptcha cho khôi phục mật khẩu dựa trên câu hỏi bảo mật"
                        },
                        recoveryQuestionPasswordReCaptchaMaxFailedAttempts: {
                            label: "Số lần thất bại tối đa cho reCaptcha"
                        },
                        recoveryNotificationUsernameEnable: {
                            label: "Khôi phục tên đăng nhập"
                        },
                        recoveryReCaptchaUsernameEnable: {
                            label: "Bật reCaptcha cho khôi phục tên đăng nhập"
                        },
                        recoveryNotificationInternallyManage: {
                            hint: "Tắt nếu ứng dụng khách tự xử lý việc gửi thông báo",
                            label: "Quản lý việc gửi thông báo nội bộ"
                        },
                        recoveryNotifySuccess: {
                            label: "Thông báo khi khôi phục thành công"
                        },
                        recoveryQuestionPasswordNotifyStart: {
                            label: "Thông báo khi bắt đầu khôi phục dựa trên câu hỏi bảo mật"
                        },
                        recoveryExpiryTime: {
                            label: "Thời gian hết hạn liên kết khôi phục tính bằng phút"
                        },
                        recoveryNotificationPasswordExpiryTimeSmsOtp: {
                            hint: "Thời gian hết hạn của mã SMS OTP cho khôi phục mật khẩu",
                            label: "Thời gian hết hạn SMS OTP"
                        },
                        recoveryNotificationPasswordSmsOtpRegex: {
                            hint: "Regex cho SMS OTP ở định dạng [ký tự được phép]{độ dài}. Các dải ký tự được hỗ trợ là a-z, A-Z, 0-9. Độ dài OTP tối thiểu là 4",
                            label: "Regex SMS OTP"
                        },
                        recoveryQuestionPasswordForcedEnable: {
                            hint: "Buộc người dùng cung cấp câu trả lời cho câu hỏi bảo mật khi đăng nhập",
                            label: "Bật câu hỏi bảo mật bắt buộc"
                        },
                        recoveryQuestionMinQuestionsToAnswer: {
                            hint: "Buộc người dùng cung cấp câu trả lời cho câu hỏi bảo mật khi đăng nhập nếu người dùng đã trả lời ít hơn giá trị này",
                            label: "Số câu hỏi bảo mật bắt buộc tối thiểu phải trả lời"
                        },
                        recoveryCallbackRegex: {
                            hint: "Regex URL callback khôi phục",
                            label: "Regex URL callback khôi phục"
                        },
                        recoveryAutoLoginEnable: {
                            hint: "Người dùng sẽ được đăng nhập tự động sau khi hoàn thành trình hướng dẫn Đặt lại mật khẩu",
                            label: "Bật tự động đăng nhập sau khi đặt lại mật khẩu"
                        }
                    }
                },
                adminForcedPasswordReset: {
                    friendlyName: "Đặt lại mật khẩu",
                    description: "Cho phép quản trị viên khởi tạo quá trình đặt lại mật khẩu cho người dùng.",
                    properties: {
                        recoveryAdminPasswordResetRecoveryLink: {
                            hint: "Người dùng được thông báo bằng một liên kết để đặt lại mật khẩu",
                            label: "Bật đặt lại mật khẩu qua email khôi phục"
                        },
                        recoveryAdminPasswordResetOtp: {
                            hint: "Người dùng được thông báo bằng mật khẩu dùng một lần để thử đăng nhập SSO",
                            label: "Bật đặt lại mật khẩu qua OTP"
                        },
                        recoveryAdminPasswordResetOffline: {
                            hint: "Một OTP được tạo và lưu trong claim của người dùng",
                            label: "Bật đặt lại mật khẩu ngoại tuyến"
                        },
                        recoveryAdminPasswordResetExpiryTime: {
                            hint: "Thời gian hiệu lực của mã đặt lại mật khẩu do quản trị viên buộc, tính bằng phút",
                            label: "Thời gian hết hạn mã đặt lại mật khẩu do quản trị viên buộc"
                        }
                    }
                }
            }
        },
        otherSettings : {
            name: "Cài đặt khác",
            description: "Cấu hình các cài đặt khác.",
            connectors: {
                piiController: {
                    friendlyName: "Bộ điều khiển thông tin chấp thuận",
                    properties: {
                        piiController: {
                            hint: "Tên của Bộ điều khiển đầu tiên thu thập dữ liệu",
                            label: "Tên bộ điều khiển"
                        },
                        contact: {
                            hint: "Tên liên hệ của Bộ điều khiển",
                            label: "Tên liên hệ"
                        },
                        email: {
                            hint: "Địa chỉ email liên hệ của Bộ điều khiển",
                            label: "Địa chỉ email"
                        },
                        phone: {
                            hint: "Số điện thoại liên hệ của Bộ điều khiển",
                            label: "Số điện thoại"
                        },
                        onBehalf: {
                            hint: "Một Bộ xử lý thông tin người dùng (PII) hành động thay mặt cho Bộ điều khiển hoặc Bộ xử lý PII",
                            label: "Thay mặt"
                        },
                        piiControllerUrl: {
                            hint: "URL để liên hệ với Bộ điều khiển",
                            label: "Url"
                        },
                        addressCountry: {
                            hint: "Quốc gia của Bộ điều khiển",
                            label: "Quốc gia"
                        },
                        addressLocality: {
                            hint: "Địa phương của Bộ điều khiển",
                            label: "Địa phương"
                        },
                        addressRegion: {
                            hint: "Vùng của Bộ điều khiển",
                            label: "Vùng"
                        },
                        postOfficeBoxNumber: {
                            hint: "Số hộp thư bưu điện của Bộ điều khiển",
                            label: "Số hộp thư bưu điện"
                        },
                        postalCode: {
                            hint: "Mã bưu chính của Bộ điều khiển",
                            label: "Mã bưu chính"
                        },
                        streetAddress: {
                            hint: "Địa chỉ đường phố của Bộ điều khiển",
                            label: "Địa chỉ đường phố"
                        }
                    }
                },
                analyticsEngine: {
                    friendlyName: "[Không còn dùng] Identity Server Analytics",
                    messages: {
                        deprecation: {
                            description: "WSO2 Identity Server Analytics hiện không còn được dùng. Hãy dùng <1>ELK Analytics</1> thay thế.",
                            heading: "Không còn được dùng"
                        }
                    },
                    properties: {
                        adaptiveAuthenticationAnalyticsReceiver: {
                            hint: "Máy chủ đích",
                            label: "Máy chủ đích"
                        },
                        adaptiveAuthenticationAnalyticsBasicAuthEnabled: {
                            hint: "Bật xác thực cơ bản",
                            label: "Bật xác thực cơ bản"
                        },
                        adaptiveAuthenticationAnalyticsBasicAuthUsername: {
                            hint: "ID người dùng được bảo vệ của máy chủ đích",
                            label: "ID người dùng"
                        },
                        secretAdaptiveAuthenticationAnalyticsBasicAuthPassword: {
                            hint: "Secret được bảo vệ của máy chủ đích",
                            label: "Secret"
                        },
                        adaptiveAuthenticationAnalyticsHttpConnectionTimeout: {
                            hint: "Thời gian chờ kết nối HTTP tính bằng mili giây",
                            label: "Thời gian chờ kết nối HTTP"
                        },
                        adaptiveAuthenticationAnalyticsHttpReadTimeout: {
                            hint: "Thời gian chờ đọc HTTP tính bằng mili giây",
                            label: "Thời gian chờ đọc HTTP"
                        },
                        adaptiveAuthenticationAnalyticsHttpConnectionRequestTimeout: {
                            hint: "Thời gian chờ yêu cầu kết nối HTTP tính bằng mili giây",
                            label: "Thời gian chờ yêu cầu kết nối HTTP"
                        },
                        adaptiveAuthenticationAnalyticsHostnameVerfier: {
                            hint: "Xác minh tên máy chủ. (STRICT, ALLOW_ALL)",
                            label: "Xác minh tên máy chủ"
                        }
                    }
                },
                elasticAnalyticsEngine: {
                    friendlyName: "ELK Analytics",
                    warningModal: {
                        configure: "<1>Cấu hình</1> cài đặt ELK Analytics để hoạt động đúng.",
                        reassure: "Bạn có thể cập nhật cài đặt của mình bất cứ lúc nào."
                    },
                    properties: {
                        adaptiveAuthenticationElasticReceiver: {
                            hint: "Máy chủ Elasticsearch",
                            label: "Máy chủ Elasticsearch"
                        },
                        adaptiveAuthenticationElasticBasicAuthEnabled: {
                            hint: "Bật xác thực cơ bản",
                            label: "Bật xác thực cơ bản"
                        },
                        adaptiveAuthenticationElasticBasicAuthUsername: {
                            hint: "Tên đăng nhập Elasticsearch",
                            label: "Tên đăng nhập Elasticsearch"
                        },
                        secretAdaptiveAuthenticationElasticBasicAuthPassword: {
                            hint: "Mật khẩu người dùng Elasticsearch",
                            label: "Mật khẩu Elasticsearch"
                        },
                        adaptiveAuthenticationElasticHttpConnectionTimeout: {
                            hint: "Thời gian chờ kết nối HTTP tính bằng mili giây",
                            label: "Thời gian chờ kết nối HTTP"
                        },
                        adaptiveAuthenticationElasticHttpReadTimeout: {
                            hint: "Thời gian chờ đọc HTTP tính bằng mili giây",
                            label: "Thời gian chờ đọc HTTP"
                        },
                        adaptiveAuthenticationElasticHttpConnectionRequestTimeout: {
                            hint: "Thời gian chờ yêu cầu kết nối HTTP tính bằng mili giây",
                            label: "Thời gian chờ yêu cầu kết nối HTTP"
                        },
                        adaptiveAuthenticationElasticHostnameVerfier: {
                            hint: "Xác minh tên máy chủ. (STRICT, ALLOW_ALL)",
                            label: "Xác minh tên máy chủ"
                        }
                    }
                },
                userClaimUpdate: {
                    friendlyName: "Cài đặt xác minh cập nhật thuộc tính",
                    subTitle: "Cấu hình cài đặt xác minh & thông báo khi cập nhật thuộc tính người dùng.",
                    properties: {
                        userClaimUpdateEmailEnableVerification: {
                            hint: "Gửi email xác minh kèm liên kết/OTP đến địa chỉ mới khi thuộc tính email được cập nhật.",
                            label: "Bật xác minh email người dùng",
                            recoveryMethods: {
                                emailLink: "Liên kết email",
                                emailOTP: "Email OTP",
                                label: "Chọn phương thức xác minh email"
                            }
                        },
                        userClaimUpdateEmailVerificationCodeExpiryTime: {
                            hint: "Thời gian hiệu lực của liên kết/OTP xác nhận email tính bằng phút.",
                            label: "Thời gian hết hạn liên kết/OTP xác minh email"
                        },
                        userClaimUpdateEmailEnableNotification: {
                            hint: "Gửi thông báo đến địa chỉ email hiện tại khi người dùng cố thay đổi thuộc tính email.",
                            label: "Bật thông báo cập nhật email"
                        },
                        userClaimUpdateMobileNumberEnableVerification: {
                            hint: "Gửi SMS OTP xác minh đến số điện thoại mới khi thuộc tính số điện thoại được cập nhật.",
                            label: "Bật xác minh số điện thoại người dùng"
                        },
                        userClaimUpdateMobileNumberVerificationCodeExpiryTime: {
                            hint: "Thời gian hiệu lực của OTP xác nhận số điện thoại tính bằng phút.",
                            label: "Thời gian hết hạn SMS OTP xác minh số điện thoại"
                        },
                        userClaimUpdateMobileNumberEnableVerificationByPrivilegedUser: {
                            hint: "Cho phép người dùng có đặc quyền khởi tạo xác minh số điện thoại khi cập nhật.",
                            label: "Bật xác minh số điện thoại bởi người dùng có đặc quyền"
                        }
                    },
                    update: {
                        error: {
                            description: "{{ description }}",
                            message: "Lỗi cập nhật"
                        },
                        genericError: {
                            description:
                                "Đã xảy ra lỗi khi cập nhật cấu hình xác minh thuộc tính.",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Cấu hình xác minh thuộc tính đã được cập nhật thành công.",
                            message: "Cập nhật thành công."
                        }
                    },
                    subHeadings: {
                        emailConfiguration: "Cấu hình email",
                        mobileConfiguration: "Cấu hình số điện thoại"
                    }
                }
            }
        },
        multiFactorAuthenticators : {
            name: "Phương thức xác thực đa yếu tố",
            friendlyName: "Cài đặt phương thức xác thực",
            description: "Cấu hình cài đặt phương thức xác thực đa yếu tố.",
            connectors: {
                backupCodeAuthenticator: {
                    friendlyName: "Phương thức xác thực mã dự phòng",
                    properties: {
                        backupCodeBackupCodeLength: {
                            hint: "Độ dài của một mã dự phòng",
                            label: "Độ dài mã dự phòng"
                        },
                        backupCodeBackupCodeSize: {
                            hint: "Số lượng mã dự phòng tối đa",
                            label: "Số lượng mã dự phòng"
                        }
                    }
                }
            }
        },
        consentManagement: {
            categoryTitle: "Quản lý chính sách & tùy chọn",
            connectors: {
                preferenceManagement: {
                    description: "Quản lý các tùy chọn liên lạc cho tổ chức của bạn.",
                    friendlyName: "Quản lý tùy chọn",
                    header: "Quản lý tùy chọn"
                },
                policyConsents: {
                    description: "Quản lý các chính sách cho tổ chức của bạn.",
                    friendlyName: "Quản lý chính sách",
                    header: "Quản lý chính sách"
                }
            }
        },
        sessionManagement: {
            description: "Quản lý các cài đặt liên quan đến phiên của người dùng."
        },
        saml2WebSsoConfiguration: {
            description: "Cấu hình SAML2 Web SSO cho các ứng dụng của bạn."
        },
        wsFederationConfiguration: {
            description: "Cấu hình giao thức WS-Federation cho các ứng dụng của bạn."
        },
        internalNotificationSending: {
            categoryTitle: "Cài đặt thông báo",
            connector: {
                description: "Quản lý việc gửi thông báo nội bộ.",
                title: "Gửi thông báo nội bộ"
            }
        }
    },
    dangerZone: {
        actionTitle: "Hoàn tác",
        heading: "Hoàn tác về mặc định",
        subHeading: "Thao tác này sẽ hủy tất cả cấu hình tùy chỉnh trên trang này và khôi phục cài đặt mặc định."
    },
    disabled: "Đã vô hiệu hóa",
    enabled: "Đã bật",
    form: {
        errors: {
            format: "Định dạng không đúng.",
            positiveIntegers: "Số không được nhỏ hơn 0."
        }
    },
    genericDescription: "Cấu hình cài đặt liên quan đến connector {{ name }}.",
    notifications: {
        getConnector: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy governance connector.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getConnectorCategories: {
            error: {
                description: "{{ description }}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy danh mục governance connector.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "",
                message: ""
            }
        },
        updateConnector: {
            error: {
                description: "{{ description }}",
                message: "Lỗi cập nhật"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật governance connector.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Cấu hình {{ name }} đã được cập nhật thành công.",
                message: "Cập nhật thành công."
            }
        },
        revertConnector: {
            error: {
                description: "Đã xảy ra lỗi khi hoàn tác thuộc tính governance connector.",
                message: "Lỗi hoàn tác"
            },
            success: {
                description: "Đã hoàn tác cấu hình về mặc định thành công.",
                message: "Hoàn tác thành công."
            }
        }
    },
    pageSubHeading: "Cấu hình và quản lý {{ name }}."
};
