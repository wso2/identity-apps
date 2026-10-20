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

import { MyAccountNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
export const myAccount: MyAccountNS = {
    components: {
        accountRecovery: {
            SMSRecovery: {
                descriptions: {
                    add: "Thêm hoặc cập nhật số điện thoại khôi phục.",
                    emptyMobile: "Bạn cần cấu hình số điện thoại của mình để tiếp tục khôi phục bằng SMS-OTP.",
                    update: "Cập nhật số điện thoại khôi phục ({{mobile}})",
                    view: "Xem số điện thoại khôi phục ({{mobile}})"
                },
                forms: {
                    mobileResetForm: {
                        inputs: {
                            mobile: {
                                label: "Số điện thoại",
                                placeholder: "Nhập số điện thoại khôi phục.",
                                validations: {
                                    empty: "Nhập số điện thoại.",
                                    invalidFormat: "Số điện thoại không đúng định dạng."
                                }
                            }
                        }
                    }
                },
                heading: "Khôi phục bằng SMS",
                notifications: {
                    updateMobile: {
                        error: {
                            description: "{{description}}",
                            message: "Lỗi khi cập nhật số điện thoại khôi phục."
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi cập nhật số điện thoại khôi phục",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Số điện thoại trong hồ sơ người dùng đã được cập nhật thành công",
                            message: "Cập nhật số điện thoại thành công"
                        }
                    }
                }
            },
            codeRecovery: {
                descriptions: {
                    add: "Thêm hoặc cập nhật tùy chọn khôi phục bằng mã"
                },
                heading: "Khôi phục bằng mã"
            },
            emailRecovery: {
                descriptions: {
                    add: "Thêm hoặc cập nhật địa chỉ email khôi phục",
                    emptyEmail: "Bạn cần cấu hình địa chỉ email của mình để tiếp tục khôi phục bằng email.",
                    update: "Cập nhật địa chỉ email khôi phục ({{email}})",
                    view: "Xem địa chỉ email khôi phục ({{email}})"
                },
                forms: {
                    emailResetForm: {
                        inputs: {
                            email: {
                                label: "Địa chỉ email",
                                placeholder: "Nhập địa chỉ email khôi phục",
                                validations: {
                                    empty: "Nhập địa chỉ email",
                                    invalidFormat: "Địa chỉ email không đúng định dạng"
                                }
                            }
                        }
                    }
                },
                heading: "Khôi phục bằng email",
                notifications: {
                    updateEmail: {
                        error: {
                            description: "{{description}}",
                            message: "Lỗi khi cập nhật email khôi phục"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi cập nhật email khôi phục",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Địa chỉ email trong hồ sơ người dùng đã được cập nhật thành công",
                            message: "Cập nhật địa chỉ email thành công"
                        }
                    }
                }
            },
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi lấy tùy chọn khôi phục"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy tùy chọn khôi phục",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã lấy tùy chọn khôi phục thành công",
                        message: "Lấy tùy chọn khôi phục thành công"
                    }
                }
            },
            questionRecovery: {
                descriptions: {
                    add: "Thêm hoặc cập nhật câu hỏi bảo mật để khôi phục tài khoản"
                },
                forms: {
                    securityQuestionsForm: {
                        inputs: {
                            answer: {
                                label: "Câu trả lời",
                                placeholder: "Nhập câu trả lời của bạn",
                                validations: {
                                    empty: "Câu trả lời là trường bắt buộc"
                                }
                            },
                            question: {
                                label: "Câu hỏi",
                                placeholder: "Chọn một câu hỏi bảo mật",
                                validations: {
                                    empty: "Phải chọn ít nhất một câu hỏi bảo mật"
                                }
                            }
                        }
                    }
                },
                heading: "Câu hỏi bảo mật",
                notifications: {
                    addQuestions: {
                        error: {
                            description: "{{description}}",
                            message: "Đã xảy ra lỗi khi thêm câu hỏi bảo mật"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi thêm câu hỏi bảo mật",
                            message: "Đã xảy ra lỗi."
                        },
                        success: {
                            description: "Các câu hỏi bảo mật yêu cầu đã được thêm thành công",
                            message: "Đã thêm câu hỏi bảo mật thành công"
                        }
                    },
                    updateQuestions: {
                        error: {
                            description: "{{description}}",
                            message: "Lỗi khi cập nhật câu hỏi bảo mật"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi cập nhật câu hỏi bảo mật",
                            message: "Đã xảy ra lỗi."
                        },
                        success: {
                            description: "Các câu hỏi bảo mật yêu cầu đã được cập nhật thành công",
                            message: "Đã cập nhật câu hỏi bảo mật thành công"
                        }
                    }
                }
            }
        },
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        label: "Thuộc tính lọc",
                        placeholder: "Ví dụ: Name, Description, v.v.",
                        validations: {
                            empty: "Thuộc tính lọc là trường bắt buộc."
                        }
                    },
                    filterCondition: {
                        label: "Điều kiện lọc",
                        placeholder: "Ví dụ: Starts with, v.v.",
                        validations: {
                            empty: "Điều kiện lọc là trường bắt buộc."
                        }
                    },
                    filterValue: {
                        label: "Giá trị lọc",
                        placeholder: "Ví dụ: admin, wso2, v.v.",
                        validations: {
                            empty: "Giá trị lọc là trường bắt buộc."
                        }
                    }
                }
            },
            hints: {
                querySearch: {
                    actionKeys: "Shift + Enter",
                    label: "Để tìm kiếm dưới dạng truy vấn"
                }
            },
            options: {
                header: "Tìm kiếm nâng cao"
            },
            placeholder: "Tìm kiếm theo {{attribute}}",
            popups: {
                clear: "xóa tìm kiếm",
                dropdown: "Hiện tùy chọn"
            },
            resultsIndicator: "Đang hiển thị kết quả cho truy vấn \"{{query}}\""
        },
        applications: {
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "Ví dụ: Name, Description, v.v."
                        },
                        filterCondition: {
                            placeholder: "Ví dụ: Starts with, v.v."
                        },
                        filterValue: {
                            placeholder: "Nhập giá trị để tìm kiếm"
                        }
                    }
                },
                placeholder: "Tìm kiếm theo tên ứng dụng"
            },
            all: {
                heading: "Tất cả ứng dụng"
            },
            favourite: {
                heading: "Yêu thích"
            },
            notifications: {
                fetchApplications: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi lấy danh sách ứng dụng"
                    },
                    genericError: {
                        description: "Không thể lấy danh sách ứng dụng",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã lấy danh sách ứng dụng thành công.",
                        message: "Lấy danh sách ứng dụng thành công"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "Làm mới danh sách",
                    subtitles: {
                        0: "Danh sách ứng dụng trả về rỗng.",
                        1: "Điều này có thể do không có ứng dụng nào được phép hiển thị.",
                        2: "Vui lòng yêu cầu quản trị viên bật khả năng hiển thị cho các ứng dụng."
                    },
                    title: "Không có ứng dụng"
                }
            },
            recent: {
                heading: "Ứng dụng gần đây"
            }
        },
        changePassword: {
            forms: {
                passwordResetForm: {
                    inputs: {
                        confirmPassword: {
                            label: "Xác nhận mật khẩu",
                            placeholder: "Nhập mật khẩu mới",
                            validations: {
                                empty: "Xác nhận mật khẩu là trường bắt buộc",
                                mismatch: "Mật khẩu xác nhận không khớp"
                            }
                        },
                        currentPassword: {
                            label: "Mật khẩu hiện tại",
                            placeholder: "Nhập mật khẩu hiện tại",
                            validations: {
                                empty: "Mật khẩu hiện tại là trường bắt buộc",
                                invalid: "Mật khẩu hiện tại không hợp lệ"
                            }
                        },
                        newPassword: {
                            label: "Mật khẩu mới",
                            placeholder: "Nhập mật khẩu mới",
                            validations: {
                                empty: "Mật khẩu mới là trường bắt buộc"
                            }
                        }
                    },
                    validations: {

                        genericError: {
                            description: "Đã xảy ra lỗi. Vui lòng thử lại",
                            message: "Lỗi đổi mật khẩu"
                        },
                        invalidCurrentPassword: {
                            description: "Mật khẩu hiện tại bạn nhập có vẻ không hợp lệ. Vui lòng thử lại",
                            message: "Lỗi đổi mật khẩu"
                        },
                        invalidNewPassword: {
                            description: "Mật khẩu không thỏa mãn các ràng buộc yêu cầu.",
                            message: "Mật khẩu không hợp lệ"
                        },
                        passwordCaseRequirement: "Cần ít nhất {{minUpperCase}} chữ in hoa và {{minLowerCase}} " +
                            "chữ in thường",
                        passwordCharRequirement: "Cần ít nhất {{minSpecialChr}} ký tự đặc biệt",
                        passwordLengthRequirement: "Phải có độ dài từ {{min}} đến {{max}} ký tự",
                        passwordLowerCaseRequirement: "Cần ít nhất {{minLowerCase}} chữ in thường",
                        passwordNumRequirement: "Cần ít nhất {{min}} chữ số",
                        passwordRepeatedChrRequirement: "Không được lặp ký tự quá {{repeatedChr}} lần",
                        passwordUniqueChrRequirement: "Cần ít nhất {{uniqueChr}} ký tự khác nhau",
                        passwordUpperCaseRequirement: "Cần ít nhất {{minUpperCase}} chữ in hoa",
                        submitError: {
                            description: "{{description}}",
                            message: "Lỗi đổi mật khẩu"
                        },
                        submitSuccess: {
                            description: "Mật khẩu đã được đổi thành công",
                            message: "Đặt lại mật khẩu thành công"
                        },
                        validationConfig: {
                            error: {
                                description: "{{description}}",
                                message: "Lỗi khi lấy dữ liệu"
                            },
                            genericError: {
                                description: "Không thể lấy dữ liệu cấu hình kiểm tra hợp lệ.",
                                message: "Đã xảy ra lỗi"
                            }
                        }
                    }
                }
            },
            modals: {
                confirmationModal: {
                    heading: "Xác nhận",
                    message: "Việc cập nhật mật khẩu có thể đăng xuất bạn khỏi tất cả ứng dụng. Nếu bị đăng xuất, " +
                        "vui lòng đăng nhập lại bằng mật khẩu mới. Bạn có muốn tiếp tục không?"
                }
            }
        },
        consentManagement: {
            editConsent: {
                collectionMethod: "Phương thức thu thập",
                dangerZones: {
                    revoke: {
                        actionTitle: "Thu hồi",
                        header: "Thu hồi chấp thuận",
                        subheader: "Bạn sẽ phải cấp lại chấp thuận cho ứng dụng này."
                    }
                },
                description: "Mô tả",
                piiCategoryHeading: "Quản lý việc chấp thuận cho việc thu thập và chia sẻ thông tin cá nhân của bạn với ứng dụng. Bỏ chọn các thuộc tính bạn cần thu hồi và nhấn nút cập nhật để lưu thay đổi, hoặc nhấn nút thu hồi để xóa chấp thuận cho tất cả thuộc tính.",
                state: "Trạng thái",
                version: "Phiên bản"
            },
            modals: {
                consentRevokeModal: {
                    heading: "Bạn có chắc không?",
                    message: "Thao tác này không thể hoàn tác. Việc này sẽ thu hồi vĩnh viễn chấp thuận cho tất cả các thuộc tính. Bạn có chắc muốn tiếp tục?",
                    warning: "Xin lưu ý rằng bạn sẽ được chuyển đến trang chấp thuận khi đăng nhập"
                }
            },
            notifications: {
                consentReceiptFetch: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi"
                    },
                    genericError: {
                        description: "Không thể tải thông tin về ứng dụng đã chọn",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã lấy biên lai chấp thuận thành công",
                        message: "Lấy dữ liệu thành công"
                    }
                },
                consentedAppsFetch: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi"
                    },
                    genericError: {
                        description: "Không thể tải danh sách các ứng dụng đã được chấp thuận",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã lấy danh sách ứng dụng đã được chấp thuận thành công",
                        message: "Lấy dữ liệu thành công"
                    }
                },
                revokeConsentedApp: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi thu hồi chấp thuận"
                    },
                    genericError: {
                        description: "Không thể thu hồi chấp thuận cho ứng dụng",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Chấp thuận đã được thu hồi thành công cho ứng dụng",
                        message: "Thu hồi chấp thuận thành công"
                    }
                },
                updateConsentedClaims: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi"
                    },
                    genericError: {
                        description: "Cập nhật các claim đã chấp thuận cho ứng dụng không thành công",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Các claim đã chấp thuận đã được cập nhật thành công cho ứng dụng",
                        message: "Cập nhật claim đã chấp thuận thành công"
                    }
                }
            }
        },
        policyConsentManagement: {
            consentedOnLabel: "Chấp thuận ngày",
            dangerZones: {
                revoke: {
                    actionTitle: "Thu hồi",
                    header: "Thu hồi chấp thuận chính sách",
                    subheader: "Thao tác này sẽ thu hồi chấp thuận của bạn đối với chính sách này. Bạn có thể được yêu cầu chấp thuận lại trong lần truy cập dịch vụ tiếp theo."
                }
            },
            notifications: {
                fetch: {
                    error: {
                        description: "Đã xảy ra lỗi khi lấy các chấp thuận chính sách của bạn.",
                        message: "Lấy dữ liệu thất bại"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy các chấp thuận chính sách của bạn.",
                        message: "Lấy dữ liệu thất bại"
                    },
                    success: {
                        description: "Các chấp thuận chính sách của bạn đã được lấy thành công.",
                        message: "Lấy dữ liệu thành công"
                    }
                },
                revoke: {
                    error: {
                        description: "Đã xảy ra lỗi khi thu hồi chấp thuận chính sách.",
                        message: "Thu hồi thất bại"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi thu hồi chấp thuận chính sách.",
                        message: "Thu hồi thất bại"
                    },
                    success: {
                        description: "Chấp thuận chính sách đã được thu hồi thành công.",
                        message: "Đã thu hồi chấp thuận"
                    }
                }
            },
            policyUrlLabel: "Xem chính sách",
            versionLabel: "Phiên bản {{version}}"
        },
        preferenceManagement: {
            consentedOnLabel: "Chấp thuận ngày",
            elementsHeading: "Quản lý tùy chọn liên lạc của bạn. Bỏ chọn các thuộc tính bạn cần thu hồi và nhấn nút cập nhật để lưu thay đổi, hoặc nhấn nút thu hồi để xóa chấp thuận cho tất cả thuộc tính.",
            dangerZones: {
                revoke: {
                    actionTitle: "Thu hồi",
                    header: "Thu hồi tùy chọn liên lạc",
                    subheader: "Thao tác này sẽ thu hồi chấp thuận của bạn đối với tùy chọn liên lạc này."
                }
            },
            notifications: {
                fetch: {
                    error: {
                        description: "Đã xảy ra lỗi khi lấy các tùy chọn liên lạc của bạn.",
                        message: "Lấy dữ liệu thất bại"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy các tùy chọn liên lạc của bạn.",
                        message: "Lấy dữ liệu thất bại"
                    },
                    success: {
                        description: "Các tùy chọn liên lạc của bạn đã được lấy thành công.",
                        message: "Lấy dữ liệu thành công"
                    }
                },
                revoke: {
                    error: {
                        description: "Đã xảy ra lỗi khi thu hồi tùy chọn liên lạc.",
                        message: "Thu hồi thất bại"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi thu hồi tùy chọn liên lạc.",
                        message: "Thu hồi thất bại"
                    },
                    success: {
                        description: "Tùy chọn liên lạc đã được thu hồi thành công.",
                        message: "Đã thu hồi tùy chọn"
                    }
                },
                update: {
                    error: {
                        description: "Đã xảy ra lỗi khi cập nhật tùy chọn liên lạc.",
                        message: "Cập nhật thất bại"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi cập nhật tùy chọn liên lạc.",
                        message: "Cập nhật thất bại"
                    },
                    success: {
                        description: "Các tùy chọn liên lạc của bạn đã được cập nhật thành công.",
                        message: "Đã cập nhật tùy chọn"
                    }
                }
            },
            policyUrlLabel: "Xem chính sách",
            versionLabel: "Phiên bản {{version}}"
        },
        cookieConsent: {
            confirmButton: "Đã hiểu",
            content: "Chúng tôi sử dụng cookie để đảm bảo bạn có trải nghiệm tổng thể tốt nhất. Những cookie này được dùng để " +
                "duy trì một phiên liên tục không bị ngắt quãng đồng thời cung cấp các dịch vụ mượt mà và được cá nhân hóa. Để " +
                "tìm hiểu thêm về cách chúng tôi sử dụng cookie, vui lòng tham khảo <1>Chính sách Cookie</1> của chúng tôi."
        },
        federatedAssociations: {
            deleteConfirmation: "Thao tác này sẽ xóa tài khoản mạng xã hội đã liên kết khỏi tài khoản cục bộ của bạn. " +
                "Bạn có muốn tiếp tục xóa không?",
            notifications: {
                getFederatedAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi"
                    },
                    genericError: {
                        description: "Không thể lấy các tài khoản mạng xã hội đã liên kết",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Các tài khoản mạng xã hội đã liên kết đã được lấy thành công",
                        message: "Lấy tài khoản mạng xã hội đã liên kết thành công"
                    }
                },
                removeAllFederatedAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi"
                    },
                    genericError: {
                        description: "Không thể xóa các tài khoản mạng xã hội đã liên kết",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Tất cả tài khoản mạng xã hội đã liên kết đã được xóa thành công",
                        message: "Xóa tài khoản mạng xã hội đã liên kết thành công"
                    }
                },
                removeFederatedAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi"
                    },
                    genericError: {
                        description: "Không thể xóa tài khoản mạng xã hội đã liên kết",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Tài khoản mạng xã hội đã liên kết đã được xóa thành công",
                        message: "Xóa tài khoản mạng xã hội đã liên kết thành công"
                    }
                }
            }
        },
        footer: {
            copyright: "WSO2 Identity Server © {{year}}"
        },
        header: {
            appSwitch: {
                console: {
                    description: "Quản lý với vai trò nhà phát triển hoặc quản trị viên",
                    name: "Console"
                },
                myAccount: {
                    description: "Quản lý tài khoản của chính bạn",
                    name: "My Account"
                },
                tooltip: "Ứng dụng"
            },
            dropdown: {
                footer: {
                    cookiePolicy: "Cookie",
                    privacyPolicy: "Quyền riêng tư",
                    termsOfService: "Điều khoản"
                }
            },
            organizationLabel: "Tài khoản này được quản lý bởi"
        },
        linkedAccounts: {
            accountTypes: {
                local: {
                    label: "Thêm tài khoản người dùng cục bộ"
                }
            },
            deleteConfirmation: "Thao tác này sẽ xóa tài khoản đã liên kết khỏi tài khoản của bạn. Bạn có muốn tiếp tục " +
                "xóa không?",
            forms: {
                addAccountForm: {
                    inputs: {
                        password: {
                            label: "Mật khẩu",
                            placeholder: "Nhập mật khẩu",
                            validations: {
                                empty: "Mật khẩu là trường bắt buộc"
                            }
                        },
                        username: {
                            label: "Tên đăng nhập",
                            placeholder: "Nhập tên đăng nhập",
                            validations: {
                                empty: "Tên đăng nhập là trường bắt buộc"
                            }
                        }
                    }
                }
            },
            notifications: {
                addAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi lấy các tài khoản người dùng đã liên kết"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi thêm tài khoản đã liên kết",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Tài khoản người dùng đã liên kết yêu cầu đã được thêm thành công",
                        message: "Thêm tài khoản người dùng đã liên kết thành công"
                    }
                },
                getAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi lấy các tài khoản người dùng đã liên kết"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy các tài khoản người dùng đã liên kết",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Các chi tiết hồ sơ người dùng yêu cầu đã được lấy thành công",
                        message: "Lấy tài khoản người dùng đã liên kết thành công"
                    }
                },
                removeAllAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi xóa các tài khoản người dùng đã liên kết"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi xóa các tài khoản người dùng đã liên kết",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Tất cả tài khoản người dùng đã liên kết đã bị xóa",
                        message: "Xóa tài khoản đã liên kết thành công"
                    }
                },
                removeAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi xóa tài khoản người dùng đã liên kết"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi xóa tài khoản người dùng đã liên kết",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Các tài khoản người dùng đã liên kết đã bị xóa",
                        message: "Xóa tài khoản đã liên kết thành công"
                    }
                },
                switchAccount: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi chuyển tài khoản"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi chuyển tài khoản",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Tài khoản đã được chuyển thành công",
                        message: "Chuyển tài khoản thành công"
                    }
                }
            }
        },
        loginVerifyData: {
            description: "Dữ liệu này được dùng để xác minh thêm danh tính của bạn khi đăng nhập",
            heading: "Dữ liệu dùng để xác minh đăng nhập",
            modals: {
                clearTypingPatternsModal: {
                    heading: "Xác nhận",
                    message: "Thao tác này sẽ xóa các mẫu gõ phím của bạn đã lưu trong TypingDNA. " +
                        "Bạn có muốn tiếp tục không?"
                }
            },
            notifications: {
                clearTypingPatterns: {
                    error: {
                        description: "Không thể xóa các mẫu gõ phím. Vui lòng liên hệ quản trị viên hệ thống",
                        message: "Xóa mẫu gõ phím thất bại"
                    },
                    success: {
                        description: "Các mẫu gõ phím của bạn trong TypingDNA đã được xóa thành công",
                        message: "Xóa mẫu gõ phím thành công"
                    }
                }
            },
            typingdna: {
                description: "Bạn có thể xóa các mẫu gõ phím của mình tại đây",
                heading: "Mẫu gõ phím TypingDNA"
            }
        },
        mfa: {
            authenticatorApp: {
                addHint:"Cấu hình",
                configuredDescription: "Bạn có thể sử dụng mã TOTP từ ứng dụng xác thực đã cấu hình " +
                    "để xác thực hai yếu tố. Nếu bạn không có " +
                    "quyền truy cập ứng dụng, bạn có thể thiết lập một ứng dụng xác thực mới tại đây.",
                deleteHint: "Xóa bỏ",
                description: "Bạn có thể sử dụng ứng dụng xác thực để lấy mã xác minh cho " +
                    "xác thực hai yếu tố.",
                enableHint: "Bật/Tắt xác thực TOTP",
                heading: "Xác thực TOTP",
                hint: "Xem",
                modals: {
                    delete : {
                        heading: "Xác nhận",
                        message: "Thao tác này sẽ xóa mã QR đã thêm vào hồ sơ của bạn. Bạn có muốn tiếp tục không? "
                    },
                    done: "Thành công! Giờ bạn có thể sử dụng ứng dụng xác thực của mình cho xác thực hai yếu tố",
                    heading: "Thiết lập ứng dụng xác thực",
                    scan: {
                        additionNote: "Mã QR đã được thêm thành công vào hồ sơ của bạn!",
                        authenticatorApps: "Ứng dụng xác thực",
                        copiedToClipboard: "Đã sao chép!",
                        copyToClipboard: "Sao chép",
                        generate: "Tạo mã mới",
                        heading: "Quét mã QR bên dưới bằng ứng dụng xác thực",
                        hideSecretKey: "Ẩn khóa bí mật",
                        manualEntryLabel: "Nhập mã thủ công",
                        messageBody: "Bạn có thể tìm danh sách các ứng dụng xác thực khả dụng tại đây.",
                        messageHeading: "Chưa cài đặt ứng dụng xác thực?",
                        regenerateConfirmLabel: "Xác nhận tạo lại mã QR mới",
                        regenerateWarning: {
                            extended: "Khi bạn tạo lại mã QR mới, bạn phải quét mã đó và thiết lập lại ứng dụng xác thực. Bạn sẽ không thể đăng nhập bằng mã QR trước đó nữa.",
                            generic: "Khi bạn tạo lại mã QR mới, bạn phải quét mã đó và thiết lập lại ứng dụng xác thực. Thiết lập trước đó của bạn sẽ không còn hoạt động."
                        },
                        showSecretKey: "Hiện khóa bí mật"
                    },
                    toolTip: "Chưa có ứng dụng xác thực? Tải một ứng dụng xác thực như " +
                        "Google Authenticator từ <1>App Store</1> hoặc <3>Google Play</3>",
                    verify: {
                        error: "Xác minh thất bại. Vui lòng thử lại.",
                        heading: "Nhập mã đã tạo để xác minh",
                        label: "Mã xác minh",
                        placeholder: "Nhập mã xác minh của bạn",
                        reScan: "Quét lại",
                        reScanQuestion: "Muốn quét lại mã QR?",
                        requiredError: "Nhập mã xác minh"
                    }
                },
                notifications: {
                    deleteError: {
                        error: {
                            description: "{{error}}",
                            message: "Đã xảy ra lỗi"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi xóa mã QR",
                            message: "Đã xảy ra lỗi"
                        }
                    },
                    deleteSuccess: {
                        genericMessage: "Đã xóa thành công",
                        message: "Đã xóa cấu hình TOTP thành công."
                    },
                    initError: {
                        error: {
                            description: "{{error}}",
                            message: "Đã xảy ra lỗi"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy mã QR",
                            message: "Đã xảy ra lỗi"
                        }
                    },
                    refreshError: {
                        error: {
                            description: "{{error}}",
                            message: "Đã xảy ra lỗi"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi cố lấy mã QR mới",
                            message: "Đã xảy ra lỗi"
                        }
                    },
                    updateAuthenticatorError: {
                        error: {
                            description: "{{error}}",
                            message: "Đã xảy ra lỗi"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi cố cập nhật danh sách xác thực đã bật",
                            message: "Đã xảy ra lỗi"
                        }
                    }
                },
                regenerate: "Tạo lại"
            },
            backupCode: {
                actions: {
                    add: "Thêm mã dự phòng",
                    delete: "Xóa mã dự phòng"
                },
                description: "Sử dụng mã dự phòng để truy cập tài khoản của bạn trong trường hợp bạn không thể nhận mã " +
                    "xác thực đa yếu tố. Bạn có thể tạo lại mã mới nếu cần.",
                download: {
                    heading: "Mã dự phòng cho {{productName}}",
                    info1: "Mỗi mã dự phòng chỉ có thể dùng một lần.",
                    info2: "Các mã này được tạo ngày ",
                    subHeading: "Bạn có thể sử dụng các mã dự phòng này để đăng nhập vào {{productName}} khi bạn " +
                        "không có điện thoại bên mình. Hãy cất giữ các mã dự phòng này ở nơi an toàn nhưng dễ truy cập."
                },
                heading: "Mã dự phòng",
                messages: {
                    disabledMessage: "Cần cấu hình ít nhất một phương thức xác thực bổ sung để bật mã dự phòng."
                },
                modals: {
                    actions: {
                        copied: "Đã sao chép",
                        copy: "Sao chép mã",
                        download: "Tải mã",
                        regenerate: "Tạo lại"
                    },
                    delete: {
                        description: "Thao tác này sẽ xóa mã dự phòng và bạn sẽ không thể sử dụng chúng nữa. " +
                            "Bạn có muốn tiếp tục không?",
                        heading: "Xác nhận"
                    },
                    description: "Sử dụng mã dự phòng để đăng nhập khi bạn không có điện thoại bên mình.",
                    generate: {
                        description: "Tất cả mã dự phòng của bạn đã được sử dụng. Hãy tạo một bộ mã dự phòng mới",
                        heading: "Tạo"
                    },
                    heading: "Mã dự phòng",
                    info: "Mỗi mã chỉ có thể dùng một lần. Bạn có thể tạo mã mới bất cứ lúc nào để thay thế các mã này.",
                    regenerate: {
                        description: "Sau khi bạn tạo mã mới, các mã cũ sẽ không còn hoạt động. "
                            + "Hãy đảm bảo lưu các mã mới sau khi chúng được tạo.",
                        heading: "Xác nhận"
                    },
                    subHeading: "Mã dùng một lần mà bạn có thể dùng để đăng nhập",
                    warn: "Các mã này sẽ chỉ hiển thị một lần. Hãy đảm bảo lưu chúng ngay bây giờ và cất giữ "
                        + "ở nơi an toàn nhưng dễ truy cập."
                },
                mutedHeader: "Tùy chọn khôi phục",
                notifications: {
                    deleteError: {
                        error: {
                            description: "{{error}}",
                            message: "Đã xảy ra lỗi"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi xóa mã dự phòng",
                            message: "Đã xảy ra lỗi"
                        }
                    },
                    deleteSuccess: {
                        genericMessage: "Đã xóa thành công",
                        message: "Đã xóa mã dự phòng thành công."
                    },
                    downloadError: {
                        error: {
                            description: "{{error}}",
                            message: "Đã xảy ra lỗi"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi cố tải mã dự phòng",
                            message: "Đã xảy ra lỗi"
                        }
                    },
                    downloadSuccess: {
                        genericMessage: {
                            description: "Các mã dự phòng đã được tải xuống thành công.",
                            message: "Tải mã dự phòng thành công."
                        },
                        message: {
                            description: "{{message}}",
                            message: "Tải mã dự phòng thành công."
                        }
                    },
                    refreshError: {
                        error: {
                            description: "{{error}}",
                            message: "Đã xảy ra lỗi"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi cố tạo mã dự phòng mới",
                            message: "Đã xảy ra lỗi"
                        }
                    },
                    retrieveAuthenticatorError: {
                        error: {
                            description: "{{error}}",
                            message: "Đã xảy ra lỗi"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi cố lấy danh sách xác thực đã bật",
                            message: "Đã xảy ra lỗi"
                        }
                    },
                    retrieveError: {
                        error: {
                            description: "{{error}}",
                            message: "Đã xảy ra lỗi"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy mã dự phòng",
                            message: "Đã xảy ra lỗi"
                        }
                    },
                    updateAuthenticatorError: {
                        error: {
                            description: "{{error}}",
                            message: "Đã xảy ra lỗi"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi cố cập nhật danh sách xác thực đã bật",
                            message: "Đã xảy ra lỗi"
                        }
                    }
                },
                remaining: "còn lại"
            },
            fido: {
                description: "Bạn có thể sử dụng <1>passkey</1>, <1>khóa bảo mật FIDO</1> hoặc <1>sinh trắc học</1> trên " +
                    "thiết bị của mình để đăng nhập vào tài khoản.",
                form: {
                    label: "Passkey",
                    placeholder: "Nhập tên cho passkey",
                    remove: "Xóa passkey",
                    required: "Vui lòng nhập tên cho passkey của bạn"
                },
                heading: "Passkey",
                modals: {
                    deleteConfirmation: {
                        assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                        content: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn passkey.",
                        description: "Nếu bạn xóa passkey này, bạn có thể sẽ không " +
                            "thể đăng nhập lại vào tài khoản. Vui lòng tiếp tục một cách thận trọng.",
                        heading: "Bạn có chắc không?"
                    },
                    deviceRegistrationErrorModal: {
                        description: "Quá trình đăng ký passkey đã bị gián đoạn. "
                            + "Nếu đây không phải là chủ ý của bạn, bạn "
                            + "có thể thử lại quy trình.",
                        heading: "Đăng ký passkey thất bại",
                        tryWithOlderDevice: "Bạn cũng có thể thử lại với một passkey cũ hơn."
                    }
                },
                noPassKeyMessage: "Bạn chưa đăng ký passkey nào.",
                notifications: {
                    removeDevice: {
                        error: {
                            description: "{{description}}",
                            message: "Đã xảy ra lỗi khi xóa passkey"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi xóa passkey",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Passkey đã được xóa thành công khỏi danh sách",
                            message: "Đã xóa passkey thành công"
                        }
                    },
                    startFidoFlow: {
                        error: {
                            description: "{{description}}",
                            message: "Đã xảy ra lỗi khi lấy passkey"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy passkey",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Passkey đã được đăng ký thành công và giờ bạn " +
                                "có thể sử dụng nó để xác thực.",
                            message: "Đăng ký passkey thành công"
                        }
                    },
                    updateDeviceName: {
                        error: {
                            description: "{{description}}",
                            message: "Đã xảy ra lỗi khi cập nhật tên passkey"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi cập nhật tên passkey",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Tên passkey của bạn đã được cập nhật thành công",
                            message: "Cập nhật tên passkey thành công"
                        }
                    }
                },
                tryButton: "Thử với passkey cũ hơn"
            },
            pushAuthenticatorApp: {
                addHint:"Cấu hình",
                configuredDescription: "Bạn có thể sử dụng các lời nhắc đăng nhập được tạo từ ứng dụng xác thực " +
                    "push đã cấu hình để xác thực hai yếu tố. Nếu bạn không có " +
                    "quyền truy cập ứng dụng, bạn có thể thiết lập một ứng dụng xác thực mới tại đây.",
                deleteHint: "Xóa bỏ",
                description: "Bạn có thể sử dụng ứng dụng xác thực push để nhận lời nhắc đăng nhập dưới dạng thông báo đẩy cho " +
                    "xác thực hai yếu tố.",
                deviceLimitReachedHint: "Đã đạt giới hạn số thiết bị tối đa là {{limit}}",
                heading: "Xác thực Push",
                hint: "Xem",
                modals: {
                    deviceDeleteConfirmation: {
                        assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                        content: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn thiết bị.",
                        description: "Nếu bạn xóa thiết bị này, bạn có thể sẽ không thể đăng nhập lại vào tài khoản. Vui lòng tiếp tục một cách thận trọng.",
                        heading: "Bạn có chắc không?"
                    },
                    scan: {
                        additionNote: "Mã QR đã được thêm thành công vào hồ sơ của bạn!",
                        done: "Thành công! Giờ bạn có thể sử dụng ứng dụng xác thực Push của mình cho xác thực hai yếu tố",
                        heading: "Thiết lập ứng dụng xác thực Push",
                        messageBody: "Bạn có thể tìm danh sách các ứng dụng xác thực khả dụng tại đây.",
                        subHeading: "Quét mã QR bên dưới bằng ứng dụng xác thực push"
                    }
                },
                notifications: {
                    configFetchError: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy cấu hình xác thực push.",
                            message: "Đã xảy ra lỗi"
                        }
                    },
                    delete: {
                        error: {
                            description: "{{error}}",
                            message: "Đã xảy ra lỗi"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi xóa thiết bị đã đăng ký",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Đã xóa thiết bị đã đăng ký thành công",
                            message: "Xóa thiết bị thành công"
                        }
                    },
                    deviceListFetchError: {
                        error: {
                            description: "Đã xảy ra lỗi khi lấy danh sách thiết bị đã đăng ký cho xác thực push",
                            message: "Đã xảy ra lỗi"
                        }
                    },
                    initError: {
                        error: {
                            description: "{{error}}",
                            message: "Đã xảy ra lỗi"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy mã QR",
                            message: "Đã xảy ra lỗi"
                        }
                    }
                }
            },
            smsOtp: {
                descriptions: {
                    hint: "Bạn sẽ nhận được tin nhắn văn bản chứa mã xác minh dùng một lần"
                },
                heading: "Số điện thoại",
                notifications: {
                    updateMobile: {
                        error: {
                            description: "{{description}}",
                            message: "Đã xảy ra lỗi khi cập nhật số điện thoại"
                        },
                        genericError: {
                            description: "Đã xảy ra lỗi khi cập nhật số điện thoại",
                            message: "Đã xảy ra lỗi"
                        },
                        success: {
                            description: "Số điện thoại trong hồ sơ người dùng đã được cập nhật thành công",
                            message: "Cập nhật số điện thoại thành công"
                        }
                    }
                }
            }
        },
        mobileUpdateWizard: {
            done: "Thành công! Số điện thoại của bạn đã được xác minh thành công.",
            notifications: {
                resendError: {
                    error: {
                        description: "{{error}}",
                        message: "Đã xảy ra lỗi"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi cố lấy mã xác minh mới",
                        message: "Đã xảy ra lỗi"
                    }
                },
                resendSuccess: {
                    message: "Yêu cầu gửi lại mã đã được gửi thành công"
                }
            },
            submitMobile: {
                heading: "Nhập số điện thoại mới của bạn"
            },
            verificationSent: {
                heading: "Bạn sẽ sớm nhận được OTP đến số điện thoại của mình để xác minh"
            },
            verifySmsOtp: {
                didNotReceive: "Không nhận được mã?",
                error: "Xác minh thất bại. Vui lòng thử lại.",
                heading: "Xác minh số điện thoại của bạn",
                label: "Nhập mã xác minh đã gửi đến số điện thoại của bạn",
                placeholder: "Nhập mã xác minh của bạn",
                requiredError: "Nhập mã xác minh",
                resend: "Gửi lại"
            }
        },
        overview: {
            widgets: {
                accountActivity: {
                    actionTitles: {
                        update: "Quản lý hoạt động tài khoản"
                    },
                    description: "Bạn hiện đang đăng nhập từ thiết bị sau",
                    header: "Phiên đang hoạt động"
                },
                accountSecurity: {
                    actionTitles: {
                        update: "Cập nhật bảo mật tài khoản"
                    },
                    description: "Cài đặt và khuyến nghị giúp bạn giữ tài khoản an toàn",
                    header: "Bảo mật tài khoản"
                },
                accountStatus: {
                    complete: "Hồ sơ của bạn đã hoàn tất",
                    completedFields: "Các trường đã hoàn thành",
                    completionPercentage: "Hồ sơ của bạn đã hoàn thành {{percentage}}%",
                    inComplete: "Hoàn tất hồ sơ của bạn",
                    inCompleteFields: "Các trường chưa hoàn thành",
                    mandatoryFieldsCompletion: "Đã hoàn thành {{completed}} trên {{total}} trường bắt buộc",
                    optionalFieldsCompletion: "Đã hoàn thành {{completed}} trên {{total}} trường tùy chọn"
                },
                consentManagement: {
                    actionTitles: {
                        manage: "Quản lý chấp thuận"
                    },
                    description: "Kiểm soát dữ liệu bạn muốn chia sẻ với các ứng dụng",
                    header: "Kiểm soát chấp thuận"
                },
                profileStatus: {
                    completionPercentage: "Hồ sơ của bạn đã hoàn thành {{percentage}}%",
                    description: "Quản lý hồ sơ của bạn",
                    header: "Hồ sơ của bạn",
                    profileText: "Chi tiết hồ sơ cá nhân của bạn",
                    readOnlyDescription: "Xem hồ sơ của bạn",
                    userSourceText: "(Đăng ký qua {{source}})"
                }
            }
        },
        profile: {
            actions: {
                "deleteEmail": "Xóa địa chỉ email",
                "deleteMobile": "Xóa số điện thoại",
                "verifyEmail": "Xác minh địa chỉ email",
                "verifyMobile": "Xác minh số điện thoại"
            },
            fields: {
                "Account Confirmed Time": "Thời gian xác nhận tài khoản",
                "Account Disabled": "Tài khoản bị vô hiệu hóa",
                "Account Locked": "Tài khoản bị khóa",
                "Account State": "Trạng thái tài khoản",
                "Active": "Đang hoạt động",
                "Address - Street": "Địa chỉ - Đường",
                "Ask Password": "Yêu cầu đặt mật khẩu",
                "Backup Code Enabled": "Đã bật mã dự phòng",
                "Backup Codes": "Mã dự phòng",
                "Birth Date": "Ngày sinh",
                "Country": "Quốc gia",
                "Created Time": "Thời gian tạo",
                "Disable EmailOTP": "Tắt EmailOTP",
                "Disable SMSOTP": "Tắt SMSOTP",
                "Display Name": "Tên hiển thị",
                "Email": "Email",
                "Email Addresses": "Địa chỉ email",
                "Email Verified": "Email đã xác minh",
                "Enabled Authenticators": "Phương thức xác thực đã bật",
                "Existing Lite User": "Người dùng rút gọn hiện có",
                "External ID": "ID ngoài",
                "Failed Attempts Before Success": "Số lần thử thất bại trước khi thành công",
                "Failed Backup Code Attempts": "Số lần thử mã dự phòng thất bại",
                "Failed Email OTP Attempts": "Số lần thử Email OTP thất bại",
                "Failed Lockout Count": "Số lần khóa do thất bại",
                "Failed Login Attempts": "Số lần đăng nhập thất bại",
                "Failed Password Recovery Attempts": "Số lần khôi phục mật khẩu thất bại",
                "Failed SMS OTP Attempts": "Số lần thử SMS OTP thất bại",
                "Failed TOTP Attempts": "Số lần thử TOTP thất bại",
                "First Name": "Tên",
                "Force Password Reset": "Buộc đặt lại mật khẩu",
                "Full Name": "Họ và tên",
                "Gender": "Giới tính",
                "Groups": "Nhóm",
                "Identity Provider Type": "Loại nhà cung cấp danh tính",
                "Last Logon": "Đăng nhập lần cuối",
                "Last Modified Time": "Thời gian sửa đổi lần cuối",
                "Last Name": "Họ",
                "Last Password Update": "Cập nhật mật khẩu lần cuối",
                "Lite User": "Người dùng rút gọn",
                "Lite User ID": "ID người dùng rút gọn",
                "Local": "Cục bộ",
                "Local Credential Exists": "Tồn tại thông tin xác thực cục bộ",
                "Locality": "Địa phương",
                "Location": "Vị trí",
                "Locked Reason": "Lý do khóa",
                "Manager - Name": "Quản lý - Tên",
                "Middle Name": "Tên đệm",
                "Mobile": "Số điện thoại",
                "Mobile Numbers": "Số điện thoại",
                "Nick Name": "Biệt danh",
                "Phone Verified": "Số điện thoại đã xác minh",
                "Photo - Thumbnail": "Ảnh - Hình thu nhỏ",
                "Photo URL": "URL ảnh",
                "Postal Code": "Mã bưu chính",
                "Preferred Channel": "Kênh ưu tiên",
                "Read Only User": "Người dùng chỉ đọc",
                "Region": "Vùng",
                "Resource Type": "Loại tài nguyên",
                "Roles": "Vai trò",
                "Secret Key": "Khóa bí mật",
                "TOTP Enabled": "Đã bật TOTP",
                "Time Zone": "Múi giờ",
                "URL": "URL",
                "Unlock Time": "Thời gian mở khóa",
                "User Account Type": "Loại tài khoản người dùng",
                "User ID": "ID người dùng",
                "User Metadata - Version": "Siêu dữ liệu người dùng - Phiên bản",
                "User Source": "Nguồn người dùng",
                "User Source ID": "ID nguồn người dùng",
                "Username": "Tên đăng nhập",
                "Verification Pending Email": "Email đang chờ xác minh",
                "Verification Pending Mobile Number": "Số điện thoại đang chờ xác minh",
                "Verified Email Addresses": "Địa chỉ email đã xác minh",
                "Verified Mobile Numbers": "Số điện thoại đã xác minh",
                "Verify Email": "Xác minh email",
                "Verify Mobile": "Xác minh số điện thoại",
                "Verify Secret Key": "Xác minh khóa bí mật",
                "Website URL": "URL website",
                emails: "Email",
                generic: {
                    default: "Thêm {{fieldName}}"
                },
                nameFamilyName: "Họ",
                nameGivenName: "Tên",
                phoneNumbers: "Số điện thoại",
                profileImage: "Ảnh hồ sơ",
                profileUrl: "URL",
                userName: "Tên đăng nhập"
            },
            forms: {
                countryChangeForm: {
                    inputs: {
                        country: {
                            placeholder: "Chọn quốc gia của bạn"
                        }
                    }
                },
                dateChangeForm: {
                    inputs: {
                        date: {
                            validations: {
                                futureDateError: "Ngày bạn nhập cho trường {{field}} không hợp lệ.",
                                invalidFormat: "Vui lòng nhập {{fieldName}} hợp lệ theo định dạng YYYY-MM-DD."
                            }
                        }
                    }
                },
                emailChangeForm: {
                    inputs: {
                        email: {
                            label: "Email",
                            note: "LƯU Ý: Việc chỉnh sửa này sẽ thay đổi địa chỉ email gắn với tài khoản này. Địa chỉ " +
                                "email này cũng được dùng để khôi phục tài khoản.",
                            placeholder: "Nhập địa chỉ email của bạn",
                            validations: {
                                empty: "Địa chỉ email là trường bắt buộc",
                                invalidFormat: "Vui lòng nhập một địa chỉ email hợp lệ. Bạn có thể sử dụng ký tự " +
                                    "chữ và số, ký tự unicode, dấu gạch dưới (_), dấu gạch ngang (-), dấu chấm (.), " +
                                    "và ký tự a còng (@)."
                            }
                        }
                    }
                },
                generic: {
                    dropdown: {
                        placeholder: "Chọn {{fieldName}} của bạn"
                    },
                    inputs: {
                        placeholder: "Nhập {{fieldName}} của bạn",
                        readonly: {
                            placeholder: "Giá trị này đang trống",
                            popup: "Liên hệ quản trị viên để cập nhật {{fieldName}} của bạn"
                        },
                        validations: {
                            duplicate: "{{fieldName}} không được có giá trị trùng lặp",
                            empty: "{{fieldName}} là trường bắt buộc",
                            invalidFormat: "Định dạng của {{fieldName}} đã nhập không hợp lệ"
                        }
                    },
                    radioGroup: {
                        optionNone: "Không có"
                    }
                },
                mobileChangeForm: {
                    inputs: {
                        mobile: {
                            label: "Số điện thoại",
                            note: "LƯU Ý: Thao tác này sẽ thay đổi số điện thoại trong hồ sơ của bạn",
                            placeholder: "Nhập số điện thoại của bạn",
                            validations: {
                                empty: "Số điện thoại là trường bắt buộc",
                                invalidFormat: "Vui lòng nhập số điện thoại hợp lệ theo định dạng [+][mã quốc gia]"+
                                    "[mã vùng][số điện thoại cục bộ]."
                            }
                        }
                    }
                },
                nameChangeForm: {
                    inputs: {
                        firstName: {
                            label: "Tên",
                            placeholder: "Nhập tên",
                            validations: {
                                empty: "Tên là trường bắt buộc"
                            }
                        },
                        lastName: {
                            label: "Họ",
                            placeholder: "Nhập họ",
                            validations: {
                                empty: "Họ là trường bắt buộc"
                            }
                        }
                    }
                },
                organizationChangeForm: {
                    inputs: {
                        organization: {
                            label: "Tổ chức",
                            placeholder: "Nhập tổ chức của bạn",
                            validations: {
                                empty: "Tổ chức là trường bắt buộc"
                            }
                        }
                    }
                }
            },
            messages: {
                emailConfirmation: {
                    content: "Vui lòng xác nhận cập nhật địa chỉ email để thêm email mới vào hồ sơ của bạn.",
                    header: "Đang chờ xác nhận!"
                },
                emailVerification: {
                    content: "Địa chỉ email này được dùng để gửi email xác minh khi xác thực yếu tố thứ hai " +
                        "được bật và để gửi mã khôi phục trong trường hợp khôi phục tên đăng nhập/mật khẩu. " +
                        "Để cập nhật email này, bạn phải xác minh email mới bằng cách nhập mã xác minh đã gửi đến email mới của bạn. Nhấn cập nhật nếu bạn muốn tiếp tục."
                },
                mobileVerification: {
                    content: "Số điện thoại này được dùng để gửi SMS OTP khi xác thực yếu tố thứ hai " +
                        "được bật và để gửi mã khôi phục trong trường hợp khôi phục tên đăng nhập/mật khẩu. " +
                        "Để cập nhật số này, bạn phải xác minh số mới bằng cách nhập mã xác minh " +
                        "đã gửi đến số mới của bạn. Nhấn cập nhật nếu bạn muốn tiếp tục."
                }
            },
            modals: {
                customMultiAttributeDeleteConfirmation: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    content: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn giá trị đã chọn.",
                    description: "Nếu bạn xóa giá trị đã chọn này, nó sẽ bị xóa vĩnh viễn khỏi hồ sơ của bạn.",
                    heading: "Bạn có chắc không?"
                },
                emailAddressDeleteConfirmation: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    content: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn địa chỉ email.",
                    description: "Nếu bạn xóa địa chỉ email này, nó sẽ bị xóa vĩnh viễn khỏi hồ sơ của bạn.",
                    heading: "Bạn có chắc không?"
                },
                mobileNumberDeleteConfirmation: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    content: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn số điện thoại.",
                    description: "Nếu bạn xóa số điện thoại này, nó sẽ bị xóa vĩnh viễn khỏi hồ sơ của bạn.",
                    heading: "Bạn có chắc không?"
                }
            },
            notifications: {
                getProfileCompletion: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi đánh giá mức độ hoàn thành hồ sơ",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Mức độ hoàn thành hồ sơ đã được đánh giá thành công",
                        message: "Tính toán thành công"
                    }
                },
                getProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi lấy chi tiết hồ sơ"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy chi tiết hồ sơ",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Các chi tiết hồ sơ người dùng yêu cầu đã được lấy thành công",
                        message: "Lấy hồ sơ người dùng thành công"
                    }
                },
                getUserReadOnlyStatus: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy trạng thái chỉ đọc của người dùng",
                        message: "Đã xảy ra lỗi"
                    }
                },
                updateProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "Cập nhật hồ sơ thất bại"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi cập nhật chi tiết hồ sơ",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Các chi tiết hồ sơ người dùng yêu cầu đã được cập nhật thành công",
                        message: "Cập nhật hồ sơ người dùng thành công"
                    }
                },
                verifyEmail: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi gửi email xác minh"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi gửi email xác minh",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Email xác minh đã được gửi thành công. Vui lòng kiểm tra hộp thư của bạn",
                        message: "Gửi email xác minh thành công"
                    }
                },
                verifyMobile: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi gửi mã xác minh"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi gửi mã xác minh",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Mã xác minh đã được gửi thành công. Vui lòng kiểm tra điện thoại của bạn",
                        message: "Gửi mã xác minh thành công"
                    }
                }
            },
            placeholders: {
                SCIMDisabled: {
                    heading: "Tính năng này không khả dụng cho tài khoản của bạn"
                }
            }
        },
        profileExport: {
            notifications: {
                downloadProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi tải chi tiết hồ sơ người dùng"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi tải chi tiết hồ sơ người dùng",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Tệp chứa chi tiết hồ sơ người dùng yêu cầu đã bắt đầu tải xuống",
                        message: "Đã bắt đầu tải chi tiết hồ sơ người dùng"
                    }
                }
            }
        },
        selfSignUp: {
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}.",
                        message: "Lỗi khi lấy tùy chọn tự đăng ký"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy tùy chọn tự đăng ký.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã lấy tùy chọn tự đăng ký thành công.",
                        message: "Lấy tùy chọn tự đăng ký thành công"
                    }
                }
            }
        },
        systemNotificationAlert: {
            resend: "Gửi lại",
            selfSignUp: {
                awaitingAccountConfirmation: "Tài khoản của bạn chưa được kích hoạt. Chúng tôi đã gửi " +
                    "liên kết kích hoạt đến địa chỉ email đã đăng ký của bạn. Cần liên kết mới?",
                notifications: {
                    resendError: {
                        description: "Đã xảy ra lỗi khi gửi lại email xác nhận tài khoản.",
                        message: "Đã xảy ra lỗi"
                    },
                    resendSuccess: {
                        description: "Đã gửi lại email xác nhận tài khoản thành công.",
                        message: "Gửi lại email xác nhận tài khoản thành công"
                    }
                }
            }
        },
        userAvatar: {
            infoPopover: "Hình ảnh này được lấy từ dịch vụ <1>Gravatar</1>.",
            urlUpdateHeader: "Nhập URL hình ảnh để đặt ảnh hồ sơ của bạn"
        },
        userSessions: {
            browserAndOS: "{{browser}} trên {{os}} {{version}}",
            dangerZones: {
                terminate: {
                    actionTitle: "Kết thúc",
                    header: "Kết thúc phiên",
                    subheader: "Bạn sẽ bị đăng xuất khỏi phiên trên thiết bị cụ thể đó."
                }
            },
            lastAccessed: "Truy cập lần cuối {{date}}",
            modals: {
                terminateActiveUserSessionModal: {
                    heading: "Kết thúc các phiên đang hoạt động hiện tại",
                    message:
                        "Các thay đổi tùy chọn xác thực yếu tố thứ hai (2FA) sẽ không được áp dụng cho các phiên đang hoạt động của bạn. Chúng tôi khuyến nghị " +
                        "bạn kết thúc chúng.",
                    primaryAction: "Kết thúc tất cả",
                    secondaryAction: "Xem xét và kết thúc"

                },
                terminateAllUserSessionsModal: {
                    heading: "Xác nhận",
                    message:
                        "Thao tác này sẽ đăng xuất bạn khỏi phiên hiện tại và tất cả các phiên khác trên mọi thiết bị. " +
                        "Bạn có muốn tiếp tục không?"
                },
                terminateUserSessionModal: {
                    heading: "Xác nhận",
                    message:
                        "Thao tác này sẽ đăng xuất bạn khỏi phiên trên thiết bị cụ thể đó. Bạn có muốn " +
                        "tiếp tục không?"
                }
            },
            notifications: {
                fetchSessions: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi lấy các phiên đang hoạt động"
                    },
                    genericError: {
                        description: "Không thể lấy bất kỳ phiên đang hoạt động nào",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã lấy các phiên đang hoạt động thành công",
                        message: "Lấy phiên đang hoạt động thành công"
                    }
                },
                terminateAllUserSessions: {
                    error: {
                        description: "{{description}}",
                        message: "Không thể kết thúc các phiên đang hoạt động"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi kết thúc các phiên đang hoạt động",
                        message: "Không thể kết thúc các phiên đang hoạt động"
                    },
                    success: {
                        description: "Đã kết thúc tất cả các phiên đang hoạt động thành công",
                        message: "Đã kết thúc tất cả các phiên đang hoạt động"
                    }
                },
                terminateUserSession: {
                    error: {
                        description: "{{description}}",
                        message: "Không thể kết thúc phiên đang hoạt động"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi kết thúc phiên đang hoạt động",
                        message: "Không thể kết thúc phiên đang hoạt động"
                    },
                    success: {
                        description: "Đã kết thúc phiên đang hoạt động thành công",
                        message: "Kết thúc phiên thành công"
                    }
                }
            }
        },
        verificationOnUpdate: {
            modal: {
                common: {
                    step2: {
                        hint: "Không nhận được mã?",
                        resend: "Gửi lại",
                        resendSuccess: "Yêu cầu gửi lại mã đã được gửi thành công",
                        validation: {
                            otpRequired: "Nhập mã xác minh"
                        },
                        verificationFailure: "Xác minh thất bại. Vui lòng thử lại."
                    }
                },
                email: {
                    step1: {
                        content: {
                            label: "Nhập địa chỉ email mới của bạn"
                        },
                        heading: "Xác minh địa chỉ email của bạn",
                        validation: {
                            invalidFormat: "Vui lòng nhập một địa chỉ email hợp lệ",
                            required: "Cần có địa chỉ email"
                        }
                    },
                    step2: {
                        content: {
                            label: "Một mã xác minh đã được gửi đến email của bạn. Vui lòng nhập mã bên dưới để xác minh địa chỉ email của bạn."
                        },
                        heading: "Xác minh địa chỉ email của bạn"
                    },
                    step3: {
                        content: "Thành công! Địa chỉ email của bạn đã được xác minh thành công."
                    }
                },
                notifications: {
                    resendError: {
                        description: "Đã xảy ra lỗi khi gửi lại mã xác minh",
                        message: "Đã xảy ra lỗi"
                    }
                },
                sms: {
                    step1: {
                        content: {
                            label: "Nhập số điện thoại mới của bạn"
                        },
                        heading: "Xác minh số điện thoại của bạn",
                        validation: {
                            invalidFormat: "Vui lòng nhập một số điện thoại hợp lệ",
                            required: "Cần có số điện thoại"
                        }
                    },
                    step2: {
                        content: {
                            label: "Một mã xác minh đã được gửi đến số điện thoại của bạn. Vui lòng nhập mã bên dưới để xác minh số điện thoại của bạn."
                        },
                        heading: "Xác minh số điện thoại của bạn"
                    },
                    step3: {
                        content: "Thành công! Số điện thoại của bạn đã được xác minh thành công."
                    }
                }
            },
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "Lỗi khi lấy tùy chọn xác minh khi cập nhật"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy tùy chọn xác minh khi cập nhật",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Đã lấy tùy chọn xác minh khi cập nhật thành công",
                        message: "Lấy tùy chọn xác minh khi cập nhật thành công"
                    }
                }
            }
        }
    },
    modals: {
        editAvatarModal: {
            content: {
                gravatar: {
                    errors: {
                        noAssociation: {
                            content: "Có vẻ như email đã chọn chưa được đăng ký trên Gravatar. " +
                            "Hãy đăng ký tài khoản Gravatar bằng cách truy cập <1>website chính thức của Gravatar</1> hoặc sử dụng " +
                                "một trong các tùy chọn sau.",
                            header: "Không tìm thấy hình ảnh Gravatar phù hợp!"
                        }
                    },
                    heading: "Gravatar dựa trên "
                },
                hostedAvatar: {
                    heading: "Hình ảnh được lưu trữ",
                    input: {
                        errors: {
                            http: {
                                content: "URL đã chọn trỏ đến một hình ảnh không an toàn được phục vụ qua HTTP. " +
                                    "Vui lòng tiếp tục một cách thận trọng.",
                                header: "Nội dung không an toàn!"
                            },
                            invalid: {
                                content: "Vui lòng nhập một URL hình ảnh hợp lệ"
                            }
                        },
                        hint: "Nhập một URL hình ảnh hợp lệ được lưu trữ tại vị trí của bên thứ ba.",
                        placeholder: "Nhập URL cho hình ảnh.",
                        warnings: {
                            dataURL: {
                                content: "Việc sử dụng Data URL với số lượng ký tự lớn có thể gây ra vấn đề " +
                                    "với cơ sở dữ liệu. Hãy tiếp tục một cách thận trọng.",
                                header: "Kiểm tra kỹ Data URL đã nhập!"
                            }
                        }
                    }
                },
                systemGenAvatars: {
                    heading: "Ảnh đại diện do hệ thống tạo",
                    types: {
                        initials: "Chữ cái đầu"
                    }
                }
            },
            description: null,
            heading: "Cập nhật ảnh hồ sơ",
            primaryButton: "Lưu",
            secondaryButton: "Hủy"
        },
        sessionTimeoutModal: {
            description: "Khi bạn nhấn vào <1>Quay lại</1>, chúng tôi sẽ cố khôi phục phiên nếu " +
                "phiên đó tồn tại. Nếu bạn không có phiên đang hoạt động, bạn sẽ được chuyển đến trang đăng nhập.",
            heading: "Có vẻ như bạn đã không hoạt động trong một thời gian dài.",
            loginAgainButton: "Đăng nhập lại",
            primaryButton: "Quay lại",
            secondaryButton: "Đăng xuất",
            sessionTimedOutDescription: "Vui lòng đăng nhập lại để tiếp tục từ nơi bạn đã dừng lại.",
            sessionTimedOutHeading: "Phiên người dùng đã hết hạn do không hoạt động."
        }
    },
    pages: {
        applications: {
            subTitle: "Khám phá và truy cập các ứng dụng của bạn",
            title: "Ứng dụng"
        },
        consents: {
            subTitle: "Xem và quản lý chấp thuận cho các ứng dụng và chính sách bạn đã chấp nhận",
            title: "Chấp thuận"
        },
        overview: {
            subTitle: "Quản lý thông tin cá nhân, bảo mật tài khoản và cài đặt quyền riêng tư của bạn",
            title: "Chào mừng, {{firstName}}"
        },
        personalInfo: {
            subTitle: "Chỉnh sửa hoặc xuất hồ sơ cá nhân của bạn và quản lý các tài khoản đã liên kết",
            title: "Thông tin cá nhân"
        },
        personalInfoWithoutExportProfile: {
            subTitle: "Xem và quản lý thông tin cá nhân của bạn",
            title: "Thông tin cá nhân"
        },
        personalInfoWithoutLinkedAccounts: {
            subTitle: "Chỉnh sửa hoặc xuất hồ sơ cá nhân của bạn",
            title: "Thông tin cá nhân"
        },
        privacy: {
            subTitle: "",
            title: "Chính sách quyền riêng tư của WSO2 Identity Server"
        },
        readOnlyProfileBanner: "Hồ sơ của bạn không thể được chỉnh sửa từ cổng này. " +
            "Vui lòng liên hệ quản trị viên để biết thêm chi tiết.",
        security: {
            subTitle: "Bảo vệ tài khoản của bạn bằng cách quản lý chấp thuận, phiên và cài đặt bảo mật",
            title: "Bảo mật"
        }
    },
    placeholders: {
        404: {
            action: "Về trang chủ",
            subtitles: {
                0: "Chúng tôi không thể tìm thấy trang bạn đang tìm.",
                1: "Vui lòng kiểm tra URL hoặc nhấn vào nút bên dưới để được chuyển về trang chủ."
            },
            title: "Không tìm thấy trang"
        },
        accessDeniedError: {
            action: "Về trang chủ",
            subtitles: {
                0: "Có vẻ như bạn không được phép truy cập trang này.",
                1: "Vui lòng thử đăng nhập bằng một tài khoản khác."
            },
            title: "Không được cấp quyền truy cập"
        },
        emptySearchResult: {
            action: "Xóa truy vấn tìm kiếm",
            subtitles: {
                0: "Chúng tôi không thể tìm thấy kết quả nào cho \"{{query}}\"",
                1: "Vui lòng thử một từ khóa tìm kiếm khác."
            },
            title: "Không tìm thấy kết quả"
        },
        genericError: {
            action: "Làm mới trang",
            subtitles: {
                0: "Đã xảy ra lỗi khi hiển thị trang này.",
                1: "Xem console của trình duyệt để biết chi tiết kỹ thuật."
            },
            title: "Đã xảy ra lỗi"
        },
        loginError: {
            action: "Tiếp tục đăng xuất",
            subtitles: {
                0: "Có vẻ như bạn không có quyền sử dụng cổng này.",
                1: "Vui lòng đăng nhập bằng một tài khoản khác."
            },
            title: "Bạn không được cấp quyền"
        },
        sessionStorageDisabled: {
            subtitles: {
                0: "Để sử dụng ứng dụng này, bạn phải bật cookie trong cài đặt trình duyệt web của mình.",
                1: "Để biết thêm thông tin về cách bật cookie, hãy xem phần trợ giúp của trình duyệt web của bạn."
            },
            title: "Cookie đã bị tắt trong trình duyệt của bạn."
        }
    },
    sections: {
        accountRecovery: {
            description: "Quản lý thông tin khôi phục mà chúng tôi có thể dùng để giúp bạn khôi phục mật khẩu",
            emptyPlaceholderText: "Không có tùy chọn khôi phục tài khoản nào",
            heading: "Khôi phục tài khoản"
        },
        changePassword: {
            actionTitles: {
                change: "Đổi mật khẩu của bạn"
            },
            description: "Cập nhật mật khẩu của bạn thường xuyên và đảm bảo nó khác biệt với các mật khẩu khác bạn dùng.",
            heading: "Đổi mật khẩu"
        },
        consentManagement: {
            actionTitles: {
                empty: "Bạn chưa cấp chấp thuận cho ứng dụng nào"
            },
            description:
                "Xem xét các chấp thuận đã cấp cho từng ứng dụng và thu hồi khi cần.",
            heading: "Quản lý chấp thuận",
            placeholders: {
                emptyConsentList: {
                    heading: "Bạn chưa cấp chấp thuận cho ứng dụng nào"
                }
            }
        },
        preferenceManagement: {
            description: "Xem xét và quản lý các tùy chọn liên lạc của bạn.",
            heading: "Tùy chọn liên lạc",
            placeholders: {
                emptyConsentList: {
                    heading: "Bạn chưa thiết lập tùy chọn liên lạc nào"
                }
            }
        },
        policyConsentManagement: {
            description: "Xem xét các chính sách bạn đã đồng ý.",
            heading: "Chấp thuận chính sách",
            placeholders: {
                emptyConsentList: {
                    heading: "Bạn chưa chấp nhận chấp thuận chính sách nào"
                }
            }
        },
        createPassword: {
            actionTitles: {
                create: "Tạo mật khẩu"
            },
            description: "Tạo mật khẩu trong {{productName}}. " +
                "Bạn có thể sử dụng mật khẩu này để đăng nhập vào {{productName}} ngoài " +
                "đăng nhập mạng xã hội.",
            heading: "Tạo mật khẩu"
        },
        federatedAssociations: {
            description: "Xem các tài khoản của bạn từ các kết nối khác được liên kết với tài khoản này",
            heading: "Tài khoản mạng xã hội đã liên kết"
        },
        linkedAccounts: {
            actionTitles: {
                add: "Thêm tài khoản"
            },
            description: "Liên kết/kết nối các tài khoản khác của bạn và truy cập chúng liền mạch mà không cần đăng nhập lại",
            heading: "Tài khoản đã liên kết"
        },
        mfa: {
            description:
                "Cấu hình các phương thức xác thực bổ sung để đăng nhập dễ dàng hơn hoặc " +
                "để thêm một lớp bảo mật cho tài khoản của bạn.",
            heading: "Xác thực bổ sung"
        },
        profile: {
            description: "Quản lý hồ sơ cá nhân của bạn",
            heading: "Hồ sơ"
        },
        profileExport: {
            actionTitles: {
                export: "Tải hồ sơ"
            },
            description: "Tải tất cả dữ liệu hồ sơ của bạn bao gồm dữ liệu cá nhân và các tài khoản đã liên kết",
            heading: "Xuất hồ sơ"
        },
        userSessions: {
            actionTitles: {
                empty: "Không có phiên đang hoạt động",
                terminateAll: "Kết thúc tất cả phiên"
            },
            description: "Xem xét tất cả các phiên người dùng đang hoạt động cho tài khoản của bạn",
            heading: "Phiên đang hoạt động",
            placeholders: {
                emptySessionList: {
                    heading: "Không có phiên đang hoạt động cho người dùng này"
                }
            }
        }
    }
};
