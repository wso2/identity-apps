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
import { AuthenticationFlowNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */

export const authenticationFlow: AuthenticationFlowNS = {
    adaptiveLoginFlowSelectConfirmationModal: {
        content: "Template đã chọn sẽ thay thế script hiện có trong trình chỉnh sửa cũng như các bước đăng nhập bạn đã cấu hình. Nhấn <1>Xác nhận</1> để tiếp tục.",
        heading: "Bạn có chắc không?",
        message: "Thao tác này không thể hoàn tác."
    },
    basicLoginFlowSelectConfirmationModal: {
        content: "Template đã chọn sẽ thay thế các bước đăng nhập hiện có bạn đã cấu hình. Nhấn <1>Xác nhận</1> để tiếp tục.",
        heading: "Bạn có chắc không?",
        message: "Thao tác này không thể hoàn tác."
    },
    options: {
        apiAuthenticatorNotSupported: "Vì xác thực dựa trên API được bật, phương thức xác thực này không được hỗ trợ",
        controls: {
            remove: "Xóa"
        },
        displayName: "Đăng nhập bằng {{displayName}}",
        divider: "HOẶC",
        warningTitle: "Cảnh báo"
    },
    modes: {
        legacy: {
            label: "Trình chỉnh sửa cổ điển"
        },
        visual: {
            label: "Trình chỉnh sửa trực quan"
        },
        switchConfirmationModal: {
            assertionHint: "Có, tôi hiểu. Tôi muốn chuyển đổi.",
            content: "Thao tác này không thể hoàn tác và bạn sẽ mất vĩnh viễn các thay đổi chưa lưu trong luồng hiện tại.",
            primaryActionButtonText: "Xác nhận",
            secondaryActionButtonText: "Hủy",
            title: "Bạn có chắc không?",
            warningMessage: "Nếu bạn chuyển sang <1>{{mode}}</1>, bạn sẽ mất các thay đổi chưa lưu trong luồng hiện tại. Vui lòng tiếp tục một cách thận trọng."
        }
    },
    nodes: {
        controls: {
            attributeSelector: {
                label: "Chọn thuộc tính từ bước này"
            },
            enableBackupCodes: {
                label: "Bật mã dự phòng"
            },
            userAttributeSelector: {
                label: "Chọn định danh người dùng từ bước này"
            }
        },
        emailOTP: {
            controls: {
                optionRemoveTooltipContent: "Xóa"
            },
            form: {
                actions: {
                    primary: "Tiếp tục",
                    secondary: "Gửi lại mã"
                },
                fields: {
                    code: {
                        label: "Nhập mã đã gửi đến ID email của bạn (john*****@gmail.com)",
                        placeholder: ""
                    }
                }
            },
            header: "Xác minh OTP"
        },
        identifierFirst: {
            controls: {
                optionRemoveTooltipContent: "Xóa",
                optionSwitchTooltipContent: "Chuyển sang Tên đăng nhập & Mật khẩu"
            },
            form: {
                actions: {
                    primary: "Đăng nhập"
                },
                fields: {
                    rememberMe: {
                        label: "Ghi nhớ đăng nhập trên máy tính này"
                    },
                    username: {
                        label: "Tên đăng nhập",
                        placeholder: "Nhập tên đăng nhập của bạn"
                    }
                }
            },
            header: "Đăng nhập"
        },
        sharedUserIdentifier: {
            controls: {
                optionRemoveTooltipContent: "Xóa",
                optionSwitchTooltipContent: "Chuyển sang Tên đăng nhập & Mật khẩu"
            },
            form: {
                actions: {
                    primary: "Đăng nhập"
                },
                fields: {
                    rememberMe: {
                        label: "Ghi nhớ đăng nhập trên máy tính này"
                    },
                    username: {
                        label: "Tên đăng nhập",
                        placeholder: "Nhập tên đăng nhập của bạn"
                    }
                }
            },
            header: "Đăng nhập"
        },
        push: {
            controls: {
                optionRemoveTooltipContent: "Xóa"
            },
            form: {
                actions: {
                    primary: "01:00"
                },
                fields: {
                    code: {
                        label: "Một thông báo đẩy đã được gửi đến thiết bị của bạn. Vui lòng phản hồi yêu cầu để tiếp tục.",
                        placeholder: ""
                    }
                }
            },
            header: "Xác minh yêu cầu của bạn"
        },
        signIn: {
            controls: {
                optionRemoveTooltipContent: "Xóa",
                optionSwitchTooltipContent: "Chuyển sang Định danh trước"
            },
            form: {
                actions: {
                    primary: "Đăng nhập"
                },
                fields: {
                    password: {
                        label: "Mật khẩu",
                        placeholder: "Nhập mật khẩu của bạn"
                    },
                    rememberMe: {
                        label: "Ghi nhớ đăng nhập trên máy tính này"
                    },
                    username: {
                        label: "Tên đăng nhập",
                        placeholder: "Nhập tên đăng nhập của bạn"
                    }
                }
            },
            header: "Đăng nhập"
        },
        smsOTP: {
            controls: {
                optionRemoveTooltipContent: "Xóa"
            },
            form: {
                actions: {
                    primary: "Tiếp tục",
                    secondary: "Gửi lại mã"
                },
                fields: {
                    code: {
                        label: "Nhập mã đã gửi đến điện thoại của bạn (******3830)",
                        placeholder: ""
                    }
                }
            },
            header: "Xác minh OTP"
        },
        totp: {
            controls: {
                optionRemoveTooltipContent: "Xóa"
            },
            form: {
                actions: {
                    primary: "Tiếp tục"
                },
                fields: {
                    code: {
                        label: "Nhập mã xác minh được tạo bởi ứng dụng xác thực của bạn.",
                        placeholder: ""
                    }
                },
                help: "Chưa thiết lập phương thức xác thực TOTP của bạn? Liên hệ bộ phận hỗ trợ"
            },
            header: "Xác minh danh tính của bạn"
        },
        activeSessionsLimit: {
            controls: {
                optionRemoveTooltipContent: "Xóa"
            },
            form: {
                sessions: {
                    browserLabel: "Trình duyệt",
                    lastAccessedLabel: "Truy cập lần cuối"
                },
                help: "Kết thúc các phiên đang hoạt động để tiếp tục."
            },
            header: "Phát hiện nhiều phiên đang hoạt động"
        },
        passwordResetEnforcer: {
            form: {
                actionButton: "Đổi mật khẩu",
                fields: {
                    currentPassword: {
                        label: "Mật khẩu hiện tại",
                        placeholder: "Mật khẩu hiện tại"
                    },
                    newPassword: {
                        label: "Mật khẩu mới",
                        placeholder: "Mật khẩu mới"
                    },
                    repeatPassword: {
                        label: "Nhập lại mật khẩu",
                        placeholder: "Nhập lại mật khẩu"
                    }
                },
                matchHint: "Cả hai mật khẩu phải khớp",
                validationHints: [
                    "Phải có độ dài từ 8 đến 64 ký tự",
                    "Cần ít nhất 1 chữ in hoa và 1 chữ in thường",
                    "Cần ít nhất 1 chữ số"
                ]
            },
            header: "Đổi mật khẩu của bạn"
        }
    },
    revertConfirmationModal: {
        assertionHint: "Có, tôi hiểu. Tôi muốn hoàn tác.",
        content: "Thao tác này không thể hoàn tác và bạn sẽ mất vĩnh viễn tiến trình bạn đã thực hiện.",
        primaryActionButtonText: "Xác nhận",
        secondaryActionButtonText: "Hủy",
        title: "Bạn có chắc không?",
        warningMessage: "Nếu bạn hoàn tác về mặc định, bạn sẽ không thể khôi phục lại tiến trình. Vui lòng tiếp tục một cách thận trọng."
    },
    updateConfirmationModal: {
        errorMessage: "Các vấn đề sau phải được giải quyết trước khi cập nhật luồng xác thực.",
        errorTitle: "Không thể cập nhật luồng",
        primaryActionButtonText: "Vẫn cập nhật",
        secondaryActionButtonText: "Hủy",
        warningMessage: "Luồng xác thực có các vấn đề sau. Bạn vẫn có thể tiếp tục cập nhật, nhưng người dùng có thể gặp vấn đề trong quá trình xác thực.",
        warningTitle: "Cập nhật kèm cảnh báo?"
    },
    steps: {
        controls: {
            addOption: "Thêm tùy chọn đăng nhập",
            remove: "Xóa",
            signUp: {
                hint: "Chưa có tài khoản?",
                label: "Đăng ký"
            }
        }
    },
    predefinedFlows: {
        adaptive: {
            actions: {
                add: "THÊM"
            },
            header: "Luồng đăng nhập có điều kiện"
        },
        authenticators: {
            apple: {
                displayName: "Apple"
            },
            facebook: {
                displayName: "Facebook"
            },
            github: {
                displayName: "GitHub"
            },
            google: {
                displayName: "Google"
            },
            microsoft: {
                displayName: "Microsoft"
            }
        },
        basic: {
            header: "Luồng đăng nhập cơ bản"
        },
        categories: {
            basic: {
                label: "Thêm đăng nhập cơ bản"
            },
            mfa: {
                label: "Thêm đăng nhập đa yếu tố"
            },
            passwordless: {
                label: "Thêm đăng nhập không mật khẩu"
            },
            social: {
                label: "Thêm đăng nhập mạng xã hội"
            }
        },
        header: "Luồng định nghĩa sẵn",
        panelHeader: "Luồng định nghĩa sẵn"
    },
    scriptEditor: {
        panelHeader: "Trình chỉnh sửa script",
        secretSelector: {
            actions: {
                create: {
                    label: "Tạo Secret mới"
                }
            },
            emptyPlaceholder: {
                header: "Không có secret nào khả dụng.",
                description: "Bạn có thể lưu trữ an toàn thông tin nhạy cảm, như khóa API và các secret khác, để sử dụng trong các script xác thực có điều kiện. Sau khi lưu, các secret này có thể được tham chiếu trong script của bạn bằng cú pháp <1>secrets.{tên secret}</1>."
            },
            label: "Thêm Secret"
        },
        themes: {
            dark: {
                label: "Tối (Visual Studio)"
            },
            highContrast: {
                label: "Độ tương phản cao"
            },
            light: {
                label: "Sáng (Visual Studio)"
            }
        }
    },
    visualEditor: {
        actions: {
            revert: {
                label: "Hoàn tác về mặc định"
            },
            update: {
                label: "Cập nhật"
            }
        }
    }
};
