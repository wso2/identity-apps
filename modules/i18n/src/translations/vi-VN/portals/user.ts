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
import { userNS } from "../../../models";

/**
 * NOTE: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
export const user: userNS = {
    deleteJITUser: {
        confirmationModal: {
            content: "Nếu bạn xóa người dùng này, người dùng sẽ không thể đăng nhập vào My Account hoặc bất kỳ " +
                "ứng dụng nào khác mà người dùng đã đăng ký cho đến lần tiếp theo người dùng " +
                "đăng nhập bằng tùy chọn đăng nhập mạng xã hội."
        }
    },
    deleteUser: {
        confirmationModal: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn xóa người dùng này, người dùng sẽ không thể đăng nhập vào My Account hoặc " +
                "bất kỳ ứng dụng nào khác mà người dùng đã đăng ký trước đó. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn người dùng."
        }
    },
    disableUser: {
        confirmationModal: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn vô hiệu hóa người dùng này, người dùng sẽ không thể đăng nhập vào My Account hoặc " +
                "bất kỳ ứng dụng nào khác mà người dùng đã đăng ký trước đó.",
            header: "Bạn có chắc không?",
            message: "Hãy đảm bảo rằng người dùng không còn cần quyền truy cập vào hệ thống."
        }
    },
    editUser: {
        dangerZoneGroup: {
            deleteAdminPriviledgeZone: {
                actionTitle: "Thu hồi quyền",
                header: "Thu hồi quyền quản trị",
                subheader: "Thao tác này sẽ gỡ quyền quản trị của người dùng, " +
                    "nhưng người dùng vẫn tiếp tục thuộc tổ chức."
            },
            deleteUserZone: {
                actionTitle: "Xóa người dùng",
                buttonDisableHint: "Tùy chọn xóa bị vô hiệu hóa vì người dùng này được quản lý trong một kho người dùng Chỉ đọc.",
                header: "Xóa người dùng",
                subheader: "Thao tác này sẽ xóa vĩnh viễn người dùng khỏi tổ chức. Vui lòng " +
                    "chắc chắn trước khi tiếp tục."
            },
            disableUserZone: {
                actionTitle: "Vô hiệu hóa người dùng",
                header: "Vô hiệu hóa người dùng",
                subheader: "Sau khi bạn vô hiệu hóa một tài khoản, người dùng không thể truy cập hệ thống."
            },
            header: "Vùng nguy hiểm",
            lockUserZone: {
                actionTitle: "Khóa người dùng",
                disabledHint: "Để khóa/mở khóa tài khoản người dùng, vui lòng bật tài khoản trước.",
                header: "Khóa người dùng",
                subheader: "Sau khi bạn khóa tài khoản, người dùng không còn có thể đăng nhập vào hệ thống."
            },
            passwordResetZone: {
                actionTitle: "Đặt lại mật khẩu",
                buttonHint: "Tài khoản người dùng này cần được mở khóa để đặt lại mật khẩu.",
                header: "Đặt lại mật khẩu",
                subheader: "Sau khi bạn đổi mật khẩu, người dùng sẽ không còn có thể đăng nhập vào " +
                    "bất kỳ ứng dụng nào bằng mật khẩu hiện tại."
            },
            passwordSetZone: {
                actionTitle: "Đặt mật khẩu",
                header: "Đặt mật khẩu",
                subheader: "Sau khi bạn đặt mật khẩu, người dùng sẽ không còn có thể tự đặt mật khẩu bằng liên kết thiết lập."
            }
        },
        dateOfBirth: {
            placeholder: {
                part1:"Nhập",
                part2: "theo định dạng YYYY-MM-DD"
            }
        },
        sections: {
            shareUser: {
                addAsyncSharingNotification: {
                    description: "Quá trình chia sẻ người dùng đã bắt đầu. Bạn sẽ được thông báo khi quá trình hoàn tất.",
                    message: "Đang chia sẻ người dùng"
                },
                getSharedOrganizations: {
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy các tổ chức được chia sẻ.",
                        message: "Đã xảy ra lỗi khi lấy các tổ chức được chia sẻ"
                    }
                }
            },
            sharedAccess: {
                allRolesAndOrgsSharingMessage: "Tất cả vai trò sẽ được gán cho tất cả tổ chức hiện có và tương lai.",
                allUserRolesSharingMessage: "Tất cả vai trò của người dùng trong tổ chức hiện tại sẽ được gán.",
                assignedRolesLabel: "Vai trò chính sách",
                commonRoleSharingHint: "Cấu hình tập hợp các vai trò sẽ được gán cho người dùng được chia sẻ trong tất cả tổ chức hiện có và tương lai.",
                commonRoleSharingLabel: "Vai trò được gán",
                currentlyAssignedRolesLabel: "Vai trò hiện được gán",
                doNotShareUser: "Không chia sẻ người dùng với bất kỳ tổ chức nào",
                individualRoleSharingHint: "Cấu hình gán vai trò cho từng tổ chức cụ thể một cách riêng lẻ.",
                individualRoleSharingLabel: "Vai trò được gán riêng lẻ",
                noRolesAndOrgsSharingMessage: "Không có vai trò nào sẽ được gán cho người dùng được chia sẻ trong tất cả tổ chức hiện có và tương lai.",
                nonResidentUserPlaceholder: {
                    description: "Việc chia sẻ người dùng chỉ áp dụng cho người dùng được quản lý bởi tổ chức này. " +
                        "Người dùng này được quản lý bởi một tổ chức cha, vì vậy cấu hình chia sẻ " +
                        "không áp dụng tại đây."
                },
                notifications: {
                    fetchOrganizations: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy các tổ chức.",
                            message: "Đã xảy ra lỗi khi lấy các tổ chức"
                        }
                    },
                    fetchUserRoles: {
                        genericError: {
                            description: "Đã xảy ra lỗi khi lấy các vai trò của người dùng.",
                            message: "Đã xảy ra lỗi khi lấy các vai trò của người dùng"
                        }
                    },
                    noOrganizationsSelected: {
                        description: "Vui lòng chọn ít nhất một tổ chức để chia sẻ người dùng.",
                        message: "Chưa chọn tổ chức nào"
                    },
                    share: {
                        error: {
                            description: "Đã xảy ra lỗi khi chia sẻ người dùng. {{error}}",
                            message: "Đã xảy ra lỗi khi chia sẻ người dùng"
                        },
                        success: {
                            description: "Đã chia sẻ người dùng với tất cả tổ chức thành công.",
                            message: "Chia sẻ thành công"
                        }
                    },
                    unshare: {
                        error: {
                            description: "Đã xảy ra lỗi khi hủy chia sẻ người dùng. {{error}}",
                            message: "Đã xảy ra lỗi khi hủy chia sẻ người dùng"
                        },
                        success: {
                            description: "Đã hủy chia sẻ người dùng thành công.",
                            message: "Hủy chia sẻ thành công"
                        }
                    }
                },
                roleAudience: {
                    application: "application/{{appName}}",
                    organization: "organization"
                },
                roleAvailabilityInfo: "Chỉ những vai trò đã có sẵn trong các tổ chức con mới được gán cho người dùng được chia sẻ.",
                searchAvailableRolesPlaceholder: "Tìm kiếm vai trò khả dụng",
                shareAllRoles: "Gán tất cả vai trò",
                shareAllUser: "Chia sẻ người dùng với tất cả tổ chức",
                shareRoleSubsetWithAllOrgs: "Chỉ gán một tập hợp con vai trò cho người dùng trong tất cả tổ chức",
                shareSelectedRoles: "Gán các vai trò được chọn",
                shareSelectedUser: "Chia sẻ người dùng với các tổ chức được chọn",
                shareTypeSwitchModal: {
                    description: "Chọn cách bạn muốn tiếp tục:",
                    header: "Chuyển sang chia sẻ có chọn lọc",
                    message: "Bạn sắp chuyển từ chia sẻ với tất cả tổ chức sang chia sẻ có chọn lọc.",
                    preserveStateLabel1: "Giữ nguyên chia sẻ hiện tại",
                    preserveStateLabel2: "Giữ người dùng được chia sẻ với các tổ chức hiện có và chuyển sang chế độ chọn lọc.",
                    resetToDefaultLabel1: "Đặt lại về mặc định",
                    resetToDefaultLabel2: "Hủy chia sẻ người dùng khỏi tất cả tổ chức và bắt đầu lại với chia sẻ chọn lọc."
                },
                shareUserWithFutureChildOrgs: "Chia sẻ người dùng với các vai trò đã chọn trên các tổ chức con trong tương lai",
                sharingSettingsLabel: "Cài đặt gán vai trò cho",
                showShareAllWarningModal: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    description: "Thao tác này sẽ chia sẻ người dùng với các vai trò đã chọn trên TẤT CẢ tổ chức hiện có và tương lai. Thao tác này sẽ ảnh hưởng đến tất cả tổ chức hiện tại và tương lai trong hệ thống của bạn.",
                    header: "Chia sẻ với tất cả tổ chức",
                    message: "Bạn sắp chia sẻ người dùng này, cùng với các vai trò được gán của họ, trên tất cả tổ chức."
                },
                subTitle: "Cấu hình cách người dùng này nên được chia sẻ giữa các tổ chức",
                title: "Chính sách chia sẻ"
            }
        },
        userActionZoneGroup: {
            impersonateUserZone: {
                actionTitle: "Mạo danh người dùng",
                buttonDisableHints: {
                    insufficientPermissions: "Người dùng đang đăng nhập phải được gán vai trò ứng dụng Impersonator My Account.",
                    myAccountDisabled: "Ứng dụng My Account phải được bật để mạo danh người dùng.",
                    myAccountLoginFlowIncompatible: "Luồng đăng nhập My Account không tương thích.",
                    userAccountDisabled: "Tài khoản người dùng phải được bật để mạo danh người dùng.",
                    userAccountLocked: "Tài khoản người dùng phải được mở khóa để mạo danh người dùng."
                },
                header: "Mạo danh người dùng",
                subheader: "Sau khi bắt đầu mạo danh người dùng, người khởi tạo sẽ không còn có thể đăng nhập bằng danh tính của chính họ cho đến khi phiên hiện tại kết thúc."
            }
        }
    },
    forms: {
        addUserForm: {
            buttons: {
                radioButton: {
                    label: "Chọn phương thức đặt mật khẩu người dùng",
                    options: {
                        askPassword: "Mời người dùng tự đặt mật khẩu",
                        createPassword: "Đặt mật khẩu cho người dùng"

                    }
                }
            },
            inputs: {
                confirmPassword: {
                    label: "Xác nhận mật khẩu",
                    placeholder: "Nhập mật khẩu mới",
                    validations: {
                        empty: "Xác nhận mật khẩu là trường bắt buộc",
                        mismatch: "Mật khẩu xác nhận không khớp"
                    }
                },
                domain: {
                    label: "Kho người dùng",
                    placeholder: "Chọn kho người dùng",
                    validations: {
                        empty: "Tên kho người dùng không được để trống."
                    }
                },
                email: {
                    label: "Địa chỉ email",
                    placeholder: "Nhập địa chỉ email",
                    validations: {
                        empty: "Địa chỉ email không được để trống",
                        invalid: "Vui lòng nhập một địa chỉ email hợp lệ. Bạn có thể sử dụng ký tự " +
                            "chữ và số, ký tự unicode, dấu gạch dưới (_), dấu gạch ngang (-), dấu chấm (.), " +
                            "và ký tự a còng (@)."
                    }
                },
                firstName: {
                    label: "Tên",
                    placeholder: "Nhập tên",
                    validations: {
                        empty: "Tên là trường bắt buộc"
                    }
                },
                generic: {
                    placeholder: "Nhập {{label}}",
                    validations: {
                        empty: "{{label}} là trường bắt buộc"
                    }
                },
                lastName: {
                    label: "Họ",
                    placeholder: "Nhập họ",
                    validations: {
                        empty: "Họ là trường bắt buộc"
                    }
                },
                newPassword: {
                    label: "Mật khẩu",
                    placeholder: "Nhập mật khẩu",
                    validations: {
                        empty: "Mật khẩu là trường bắt buộc",
                        regExViolation: "Vui lòng nhập một mật khẩu hợp lệ"
                    }
                },
                username: {
                    hint: {
                        defaultRegex: "Phải là chuỗi 3-50 ký tự không chứa dấu cách, '*', '?', hoặc '%', và có thể bao gồm chữ cái, số và các ký hiệu khác."
                    },
                    label: "Tên đăng nhập",
                    placeholder: "Nhập tên đăng nhập",
                    validations: {
                        customRegex: "Tên đăng nhập phải khớp với biểu thức chính quy sau: {{regex}}",
                        defaultRegex: "Tên đăng nhập phải dài 3-50 ký tự và không được chứa dấu cách, '*', '?', hoặc '%'.",
                        empty: "Tên đăng nhập là trường bắt buộc",
                        invalid: "Đã tồn tại một người dùng với tên đăng nhập này.",
                        invalidCharacters: "Tên đăng nhập có vẻ chứa ký tự không hợp lệ.",
                        regExViolation: "Vui lòng nhập một tên đăng nhập hợp lệ."
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
                submitError: {
                    description: "{{description}}",
                    message: "Lỗi đổi mật khẩu"
                },
                submitSuccess: {
                    description: "Mật khẩu đã được đổi thành công.",
                    message: "Đặt lại mật khẩu thành công"
                }
            }
        }
    },
    lockUser: {
        confirmationModal: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn khóa tài khoản này, người dùng sẽ không thể đăng nhập vào " +
                "bất kỳ ứng dụng doanh nghiệp nào. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này khóa tài khoản người dùng."
        }
    },
    modals: {
        addUserWarnModal: {
            heading: "Cảnh báo",
            message: "Xin lưu ý rằng người dùng được tạo này sẽ không được gán vai trò. Nếu bạn " +
                "muốn gán vai trò cho người dùng này, vui lòng nhấn vào nút bên dưới."
        },
        addUserWizard: {
            askPassword: {
                alphanumericUsernameEnabled: "Để mời người dùng đặt mật khẩu, hãy tắt " +
                    "tính năng tên đăng nhập chữ và số.",
                emailInvalid: "Để mời người dùng đặt mật khẩu, vui lòng nhập một địa chỉ email hợp lệ.",
                emailVerificationDisabled: "Để mời người dùng đặt mật khẩu, hãy bật lời mời qua email " +
                    "để thiết lập mật khẩu người dùng từ <1>Cài đặt đăng nhập & đăng ký</1>.",
                emailVerificationDisabledWithFlows: "Để mời người dùng đặt mật khẩu, hãy bật cài đặt luồng mời " +
                    "từ <1>Trình xây dựng luồng đăng ký người dùng được mời</1>.",
                inviteOffline: "Mời ngoại tuyến",
                inviteViaEmail: "Mời qua email",
                inviteViaSMS: "Mời qua SMS",
                mobileNumberAlreadyExists: "Số điện thoại là bắt buộc cho SMS OTP, hãy bật thuộc tính số điện thoại từ <1>Thuộc tính</1>.",
                offlineInviteUnavailableWithWorkflow: "Việc mời người dùng ngoại tuyến bị vô hiệu hóa vì cần phê duyệt quy trình công việc để tạo người dùng."
            },
            buttons: {
                next: "Tiếp theo",
                previous: "Trước",
                saveAndContinue: "Lưu & Tiếp tục"
            },
            steps: {
                basicDetails: "Chi tiết cơ bản",
                groups: "Nhóm người dùng",
                invitation: "Lời mời",
                method: "Phương thức",
                roles: "Vai trò người dùng"
            },
            subTitle: "Thực hiện theo các bước để tạo người dùng mới",
            title: "Tạo người dùng",
            wizardSummary: {
                domain: "Kho người dùng",
                groups: "Nhóm",
                name: "Tên",
                passwordOption: {
                    label: "Tùy chọn mật khẩu",
                    message: {
                        0: "Một email sẽ được gửi đến {{email}} kèm liên kết để đặt mật khẩu.",
                        1: "Mật khẩu đã được quản trị viên đặt."
                    }
                },
                roles: "Vai trò",
                username: "Tên đăng nhập"
            }
        },
        bulkImportUserWizard: {
            buttons: {
                import: "Nhập"
            },
            sidePanel: {
                fileBased: "Dựa trên tệp",
                fileFormatContent: "Tiêu đề của tệp CSV phải là các thuộc tính người dùng được " +
                "ánh xạ tới <1>thuộc tính cục bộ</1>.",
                fileFormatSampleHeading: "Định dạng tệp CSV mẫu:",
                fileFormatTitle: "Định dạng tệp CSV",
                manual: "Thủ công"
            },
            subTitle: "Thêm nhiều người dùng thủ công hoặc bằng tệp CSV.",
            title: "Thêm nhiều người dùng",
            wizardSummary: {
                advanceSearch: {
                    roleGroupFilterAttributePlaceHolder: "Tên nhóm",
                    searchByGroup: "Tìm kiếm theo nhóm",
                    searchByUsername: "Tìm kiếm theo tên đăng nhập"
                },
                alerts: {
                    importFailed: {
                        groupAssignment: "Gặp vấn đề trong <1>{{failedUserAssignmentCount}} thao tác gán " +
                            "nhóm</1>. Người dùng trong các nhóm bị ảnh hưởng đã được tạo nhưng chưa được gán. " +
                            "Vui lòng điều hướng đến phần Quản lý người dùng để xem xét và gán nhóm cho " +
                            "người dùng.",
                        message: "Cần xem xét",
                        userCreation: "Gặp vấn đề trong <1>{{failedUserCreationCount}} thao tác tạo " +
                            "người dùng</1>"
                    },
                    importSuccess: {
                        description: "Các tài khoản người dùng đã được nhập thành công.",
                        message: "Nhập thành công"
                    }
                },
                failedCount: "Nhập thất bại",
                fileBased: {
                    hint: "Mời hàng loạt nhiều người dùng bằng tệp CSV."
                },
                inviteEmailInfo: "Một email kèm liên kết xác nhận sẽ được " +
                    "gửi đến địa chỉ email đã cung cấp để người dùng tự đặt mật khẩu.",
                manualCreation: {
                    alerts: {
                        creationSuccess: {
                            description: "Các tài khoản người dùng đã được tạo thành công.",
                            message: "Tạo người dùng thành công"
                        }
                    },
                    disabledHint: "Tùy chọn thủ công bị vô hiệu hóa do việc sử dụng " +
                        "tên đăng nhập chữ và số trong tổ chức của bạn.",
                    emailsLabel: "Email",
                    emailsPlaceholder: "Nhập địa chỉ email",
                    groupsLabel: "Nhóm",
                    groupsPlaceholder: "Nhập nhóm",
                    hint: "Thêm địa chỉ email của người dùng bạn muốn mời và nhấn enter.",
                    primaryButton: "Thêm",
                    upload: {
                        buttonText: "Tải lên tệp CSV",
                        description: "Kéo và thả tệp CSV vào đây."
                    },
                    warningMessage: "Tùy chọn này chỉ có thể được sử dụng khi địa chỉ email được cấu hình " +
                        "làm tên đăng nhập."
                },
                responseOperationType: {
                    roleAssignment: "Gán nhóm",
                    userCreation: "Tạo người dùng"
                },
                successCount: "Nhập thành công",
                tableHeaders: {
                    message: "Thông báo",
                    status: "Trạng thái",
                    username: "Tên đăng nhập"
                },
                tableMessages: {
                    internalErrorMessage: "Đã xảy ra lỗi khi nhập người dùng",
                    invalidDataMessage: "Dữ liệu cung cấp không hợp lệ",
                    invalidUserNameFormatMessage: "Tên đăng nhập không khớp với định dạng đã chỉ định",
                    userAlreadyExistsMessage: "Người dùng đã tồn tại",
                    userAssignmentFailedMessage: "Gán người dùng vào {{resource}} thất bại",
                    userAssignmentInternalErrorMessage: "Đã xảy ra lỗi khi gán người dùng vào " +
                        "{{resource}}",
                    userAssignmentSuccessMessage: "Người dùng đã được gán thành công vào {{resource}}",
                    userCreatedMessage: "Nhập người dùng thành công",
                    userCreationAcceptedMessage: "Đã chấp nhận tạo người dùng"
                },
                tableStatus: {
                    failed: "Thất bại",
                    success: "Thành công",
                    warning: "Cảnh báo"
                },
                totalUserAssignmentCount: "Tổng số lượt gán nhóm ",
                totalUserCreationCount: "Tổng số người dùng đã tạo",
                userstoreMessage: "Những người dùng được tạo sẽ được thêm vào kho người dùng <1>{{ userstore }}</1>."
            }
        },
        changePasswordModal: {
            button: "Đặt lại mật khẩu",
            header: "Đặt lại mật khẩu người dùng",
            hint: {
                forceReset: "CẢNH BÁO: Xin lưu ý rằng sau khi mời người dùng đổi mật khẩu, " +
                    "người dùng sẽ không còn có thể đăng nhập vào bất kỳ ứng dụng nào bằng mật khẩu " +
                    "hiện tại. Liên kết đặt lại mật khẩu sẽ có hiệu lực trong {{codeValidityPeriod}} phút.",
                setPassword: "CẢNH BÁO: Xin lưu ý rằng sau khi đổi mật khẩu, người dùng sẽ " +
                    "không còn có thể đăng nhập vào bất kỳ ứng dụng nào bằng mật khẩu hiện tại."
            },
            message: "CẢNH BÁO: Xin lưu ý rằng sau khi đổi mật khẩu, người dùng sẽ không còn " +
                "có thể đăng nhập vào bất kỳ ứng dụng nào bằng mật khẩu hiện tại.",
            passwordOptions: {
                forceReset: "Mời người dùng đặt lại mật khẩu",
                setPassword: "Đặt mật khẩu mới cho người dùng"
            }
        },
        inviteParentUserWizard: {
            errorAlert: {
                description: "Đã xảy ra lỗi khi mời {{ failedCount }} người dùng.",
                message: "Cần xem xét"
            },
            successAlert: {
                description: "Đã mời (các) người dùng thành công.",
                message: "Đã gửi lời mời"
            },
            tableMessages: {
                activeInvitationExists: "Đã tồn tại một lời mời đang hoạt động cho người dùng",
                userAlreadyExist: "Người dùng đã tồn tại",
                userEmailNotFound: "Không thể tìm thấy email của người dùng được mời",
                userNotFound: "Không tìm thấy người dùng"
            },
            totalInvitations: "Tổng số lời mời"
        },
        setPasswordModal: {
            button: "Đặt mật khẩu",
            header: "Đặt mật khẩu người dùng",
            message: "Sau khi đặt mật khẩu, người dùng sẽ " +
                "không còn có thể tự đặt mật khẩu bằng liên kết thiết lập ban đầu."
        }
    },
    profile: {
        accountDisabled: "Tài khoản đã bị vô hiệu hóa bởi quản trị viên.",
        accountLockReason: {
            adminInitiated: "Tài khoản đã bị khóa thủ công bởi quản trị viên.",
            default: "Tài khoản đã bị khóa.",
            maxAttemptsExceeded: "Tài khoản bị khóa do nhiều lần đăng nhập thất bại.",
            pendingAdminForcedUserPasswordReset: "Tài khoản bị khóa cho đến khi người dùng hoàn thành " +
                "việc đặt lại mật khẩu do quản trị viên khởi tạo.",
            pendingAskPassword: "Tài khoản bị khóa cho đến khi người dùng tạo mật khẩu qua email thiết lập đã gửi.",
            pendingEmailVerification: "Tài khoản bị khóa và cần xác minh email từ " +
                "người dùng để được kích hoạt.",
            pendingSelfRegistration: "Tài khoản bị khóa đang chờ người dùng xác minh qua email tự đăng ký."
        },
        accountState: {
            pendingAskPassword: "Người dùng chưa hoàn thành đăng ký bằng email thiết lập đã gửi.",
            pendingAskPasswordEmailOTP: "Người dùng chưa hoàn thành đăng ký bằng Email OTP đã gửi.",
            pendingAskPasswordSMSOTP: "Người dùng chưa hoàn thành đăng ký bằng SMS OTP đã gửi."
        },
        confirmationModals: {
            deleteAttributeConfirmation: {
                assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                content: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn {{attributeDisplayName}}.",
                description: "Nếu bạn xóa {{attributeDisplayName}} này, nó sẽ bị xóa vĩnh viễn khỏi hồ sơ người dùng.",
                heading: "Bạn có chắc không?"
            }
        },
        fields: {
            createdDate: "Ngày tạo",
            emails: "Email",
            generic: {
                default: "Thêm {{fieldName}}"
            },
            modifiedDate: "Ngày sửa đổi",
            name_familyName: "Họ",
            name_givenName: "Tên",
            oneTimePassword: "Mật khẩu dùng một lần",
            phoneNumbers: "Số điện thoại",
            photos: "Ảnh",
            profileUrl: "URL",
            userId: "ID người dùng",
            userName: "Tên đăng nhập"
        },
        forms: {
            email: {
                primaryEmail: {
                    validations: {
                        empty: "Cần có địa chỉ email chính"
                    }
                }
            },
            emailChangeForm: {
                inputs: {
                    email: {
                        label: "Email",
                        note: "LƯU Ý: Thao tác này sẽ thay đổi địa chỉ email trong hồ sơ của bạn",
                        placeholder: "Nhập địa chỉ email của bạn",
                        validations: {
                            empty: "Địa chỉ email là trường bắt buộc",
                            invalidFormat: "Địa chỉ email không đúng định dạng"
                        }
                    }
                }
            },
            generic: {
                inputs: {
                    dropdownPlaceholder: "Chọn {{fieldName}} của bạn",
                    placeholder: "Nhập {{fieldName}} của bạn",
                    validations: {
                        empty: "{{fieldName}} là trường bắt buộc",
                        invalidFormat: "{{fieldName}} không đúng định dạng",
                        required: "Cần có {{fieldName}}"
                    }
                }
            },
            mobile: {
                primaryMobile: {
                    validations: {
                        empty: "Cần có số điện thoại chính"
                    }
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
                            invalidFormat: "Số điện thoại không đúng định dạng"
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
        notifications: {
            changeUserPassword: {
                error: {
                    description: "{{description}}",
                    message: "Lỗi khi đổi mật khẩu người dùng."
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi đổi mật khẩu người dùng.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Mật khẩu của người dùng đã được đổi thành công.",
                    message: "Đổi mật khẩu thành công"
                }
            },
            disableUserAccount: {
                error: {
                    description: "{{description}}",
                    message: "Đã xảy ra lỗi khi vô hiệu hóa tài khoản người dùng."
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi vô hiệu hóa tài khoản người dùng.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Tài khoản người dùng đã được vô hiệu hóa thành công.",
                    genericMessage: "Tài khoản đã bị vô hiệu hóa",
                    message: "Tài khoản của {{name}} đã bị vô hiệu hóa"
                }
            },
            enableUserAccount: {
                error: {
                    description: "{{description}}",
                    message: "Đã xảy ra lỗi khi bật tài khoản người dùng."
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi bật tài khoản người dùng.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Tài khoản người dùng đã được bật thành công.",
                    genericMessage: "Tài khoản đã được bật",
                    message: "Tài khoản của {{name}} đã được bật"
                }
            },
            forcePasswordReset: {
                error: {
                    description: "{{description}}",
                    message: "Đã xảy ra lỗi khi kích hoạt luồng đặt lại mật khẩu."
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi kích hoạt luồng đặt lại mật khẩu.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Đặt lại mật khẩu đã được khởi tạo thành công cho tài khoản người dùng.",
                    message: "Đã khởi tạo đặt lại mật khẩu"
                }
            },
            getProfileInfo: {
                error: {
                    description: "{{description}}",
                    message: "Đã xảy ra lỗi khi lấy chi tiết hồ sơ"
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy chi tiết hồ sơ.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Các chi tiết hồ sơ người dùng yêu cầu đã được lấy thành công.",
                    message: "Lấy hồ sơ người dùng thành công"
                }
            },
            lockUserAccount: {
                error: {
                    description: "{{description}}",
                    message: "Đã xảy ra lỗi khi khóa tài khoản người dùng."
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi khóa tài khoản người dùng.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Tài khoản người dùng đã được khóa thành công.",
                    genericMessage: "Tài khoản đã bị khóa",
                    message: "Tài khoản của {{name}} đã bị khóa"
                }
            },
            noPasswordResetOptions: {
                error: {
                    description: "Không có tùy chọn buộc đặt lại mật khẩu nào được bật.",
                    message: "Không thể kích hoạt buộc đặt lại mật khẩu"
                }
            },
            resendCode: {
                genericError: {
                    description: "Đã xảy ra lỗi khi gửi lại {{recoveryOption}} khôi phục.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "{{recoveryOption}} khôi phục đã được gửi lại thành công.",
                    message: "Gửi lại thành công."
                }
            },
            setUserPassword: {
                error: {
                    description: "{{description}}",
                    message: "Lỗi khi đặt mật khẩu người dùng."
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi đặt mật khẩu người dùng.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Mật khẩu cho người dùng đã được đặt thành công.",
                    message: "Đặt mật khẩu thành công"
                }
            },
            unlockUserAccount: {
                error: {
                    description: "{{description}}",
                    message: "Đã xảy ra lỗi khi mở khóa tài khoản người dùng."
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi mở khóa tài khoản người dùng.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Tài khoản người dùng đã được mở khóa thành công.",
                    genericMessage: "Tài khoản đã được mở khóa",
                    message: "Tài khoản của {{name}} đã được mở khóa"
                }
            },
            updateProfileInfo: {
                error: {
                    description: "{{description}}",
                    message: "Cập nhật hồ sơ thất bại"
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi cập nhật chi tiết hồ sơ.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Các chi tiết hồ sơ người dùng yêu cầu đã được cập nhật thành công.",
                    message: "Cập nhật hồ sơ người dùng thành công"
                }
            },
            verifyEmail: {
                error: {
                    description: "{{description}}",
                    message: "Đã xảy ra lỗi khi gửi email xác minh."
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi gửi email xác minh.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Email xác minh đã được gửi thành công.",
                    message: "Gửi email xác minh thành công"
                }
            },
            verifyMobile: {
                error: {
                    description: "{{description}}",
                    message: "Đã xảy ra lỗi khi gửi mã xác minh."
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi gửi mã xác minh.",
                    message: "Đã xảy ra lỗi"
                },
                success: {
                    description: "Mã xác minh đã được gửi thành công.",
                    message: "Gửi mã xác minh thành công"
                }
            }
        },
        placeholders: {
            SCIMDisabled: {
                heading: "Tính năng này không khả dụng cho tài khoản của bạn"
            },
            userProfile: {
                emptyListPlaceholder: {
                    subtitles: "Thông tin hồ sơ không khả dụng cho người dùng này.",
                    title: "Không có thông tin hồ sơ"
                }
            }
        },
        tooltips: {
            confirmationPending: "Đang chờ xác nhận!"
        }
    },
    resendCode:{
        resend: "Gửi lại"
    },
    revokeAdmin: {
        confirmationModal: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn thu hồi quyền quản trị của người dùng này, người dùng sẽ không thể " +
                "đăng nhập vào console Asgardeo và " +
                "sẽ không thể thực hiện các tác vụ quản trị. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này sẽ thu hồi quyền quản trị của người dùng."
        }
    },
    updateUser: {
        groups: {
            addGroupsModal: {
                heading: "Cập nhật nhóm người dùng",
                subHeading: "Thêm nhóm mới hoặc xóa nhóm hiện có được gán cho người dùng."
            },
            editGroups: {
                groupList: {
                    emptyListPlaceholder: {
                        subTitle: {
                            0: "Hiện tại không có nhóm nào được gán cho người dùng.",
                            1: "Điều này có thể hạn chế người dùng thực hiện một số",
                            2: "tác vụ như truy cập một số ứng dụng."
                        },
                        title: "Không có nhóm nào được gán"
                    },
                    headers: {
                        0: "Miền",
                        1: "Tên"
                    }
                },
                heading: "Nhóm được gán",
                popups: {
                    viewPermissions: "Xem quyền"
                },
                searchPlaceholder: "Tìm kiếm nhóm",
                subHeading: "Thêm hoặc xóa các nhóm mà người dùng được gán và lưu ý rằng điều này sẽ " +
                    "ảnh hưởng đến việc thực hiện một số tác vụ."
            },
            notifications: {
                addUserGroups: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi cập nhật nhóm người dùng"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi cập nhật nhóm người dùng.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Gán nhóm mới cho người dùng thành công.",
                        message: "Cập nhật nhóm người dùng thành công"
                    }
                },
                fetchUserGroups: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi lấy danh sách nhóm"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy danh sách nhóm.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Danh sách nhóm đã được lấy thành công.",
                        message: "Lấy danh sách nhóm người dùng thành công"
                    }
                },
                removeUserGroups: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi cập nhật nhóm của người dùng"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi cập nhật nhóm người dùng.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Xóa nhóm được gán cho người dùng thành công.",
                        message: "Cập nhật nhóm người dùng thành công"
                    }
                },
                updateUserGroups: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi cập nhật nhóm người dùng"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi cập nhật nhóm người dùng.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Cập nhật nhóm được gán cho người dùng thành công.",
                        message: "Cập nhật nhóm người dùng thành công"
                    }
                }
            }
        },
        roles: {
            addRolesModal: {
                heading: "Cập nhật vai trò người dùng",
                subHeading: "Thêm vai trò mới hoặc xóa vai trò hiện có được gán cho người dùng."
            },
            editRoles: {
                confirmationModal: {
                    assertionHint: "Vui lòng xác nhận thao tác của bạn.",
                    content: "Việc sửa đổi vai trò sẽ khiến người dùng mất " +
                        "hoặc có thêm quyền truy cập vào một số tính năng. Vui lòng tiếp tục một cách thận trọng.",
                    header: "Bạn có chắc không?",
                    message: "Thao tác này sẽ sửa đổi vai trò của người dùng này."
                },
                heading: "Vai trò được gán",
                infoMessage: "Các vai trò được kế thừa qua nhóm không được hiển thị tại đây.",
                placeholders: {
                    emptyPlaceholder: {
                        subtitles: "Hiện tại không có vai trò nào được gán cho người dùng.",
                        title: "Không có vai trò nào được gán"
                    }
                },
                popups: {
                    viewPermissions: "Xem quyền"
                },
                roleList: {
                    emptyListPlaceholder: {
                        subTitle: {
                            0: "Hiện tại không có vai trò nào được gán cho người dùng.",
                            1: "Điều này có thể hạn chế người dùng thực hiện một số",
                            2: "tác vụ như truy cập một số ứng dụng."
                        },
                        title: "Không có vai trò nào được gán"
                    },
                    headers: {
                        0: "Miền",
                        1: "Tên"
                    }
                },
                searchPlaceholder: "Tìm kiếm vai trò",
                subHeading: "Xem các vai trò được gán trực tiếp cho người dùng."
            },
            notifications: {
                addUserRoles: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi cập nhật vai trò người dùng"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi cập nhật vai trò người dùng.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Gán vai trò mới cho người dùng thành công.",
                        message: "Cập nhật vai trò người dùng thành công"
                    }
                },
                fetchUserRoles: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi lấy danh sách vai trò"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi lấy danh sách vai trò.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Danh sách vai trò đã được lấy thành công.",
                        message: "Lấy danh sách vai trò người dùng thành công"
                    }
                },
                removeUserRoles: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi cập nhật vai trò của người dùng"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi cập nhật vai trò người dùng.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Xóa vai trò được gán cho người dùng thành công.",
                        message: "Cập nhật vai trò người dùng thành công"
                    }
                },
                updateUserRoles: {
                    error: {
                        description: "{{description}}",
                        message: "Đã xảy ra lỗi khi cập nhật vai trò của người dùng"
                    },
                    genericError: {
                        description: "Đã xảy ra lỗi khi cập nhật vai trò người dùng.",
                        message: "Đã xảy ra lỗi"
                    },
                    success: {
                        description: "Cập nhật vai trò được gán cho người dùng thành công.",
                        message: "Cập nhật vai trò người dùng thành công"
                    }
                }
            },
            viewPermissionModal: {
                backButton: "Quay lại danh sách",
                editButton: "Chỉnh sửa quyền",
                heading: "Quyền cho {{role}}"
            }
        }
    }
};
