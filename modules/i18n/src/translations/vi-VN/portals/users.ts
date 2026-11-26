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
import { usersNS } from "../../../models";

export const users: usersNS = {
    addUserDropDown: {
        addNewUser:  "Một người dùng",
        bulkImport: "Nhiều người dùng"
    },
    addUserType: {
        createUser: {
            description: "Tạo một người dùng trong tổ chức của bạn.",
            title: "Tạo người dùng"
        },
        inviteParentUser: {
            description: "Mời người dùng từ tổ chức cha.",
            title: "Mời người dùng tổ chức cha"
        }
    },
    advancedSearch: {
        accountStatusFilter: {
            label: "Trạng thái tài khoản",
            options: {
                disabled: "Đã vô hiệu hóa",
                locked: "Đã khóa",
                pendingInitialPasswordSetup: "Đang chờ thiết lập tài khoản ban đầu",
                pendingPasswordReset: "Đang chờ đặt lại mật khẩu",
                pendingPrimaryEmailVerification: "Đang chờ xác minh email",
                pendingPrimaryMobileVerification: "Đang chờ xác minh số điện thoại"
            }
        },
        form: {
            dropdown: {
                filterAttributeOptions: {
                    email: "Email",
                    username: "Tên đăng nhập"
                }
            },
            inputs: {
                filterAttribute: {
                    placeholder: "Ví dụ: Tên đăng nhập, Email, v.v."
                },
                filterCondition: {
                    placeholder: "Ví dụ: Starts with, v.v."
                },
                filterValue: {
                    placeholder: "Nhập giá trị để tìm kiếm"
                }
            }
        },
        placeholder: "Tìm kiếm theo tên đăng nhập"
    },
    all: {
        heading: "Người dùng",
        subHeading: "Thêm và quản lý tài khoản người dùng, gán vai trò cho người dùng và duy trì danh tính người dùng."
    },
    buttons: {
        addNewUserBtn: "Người dùng mới",
        assignUserRoleBtn: "Gán vai trò",
        metaColumnBtn: "Cột"
    },
    confirmations: {
        addMultipleUser: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Tùy chọn Mời người dùng đặt mật khẩu phải được bật để thêm nhiều người dùng. " +
                "Vui lòng bật lời mời thiết lập mật khẩu người dùng từ " +
                "<1>Trình xây dựng luồng đăng ký người dùng được mời</1>.",
            header: "Trước khi bạn tiếp tục",
            legacyContent: "Tùy chọn Mời người dùng đặt mật khẩu phải được bật để thêm nhiều người dùng. " +
                "Vui lòng bật lời mời qua email để thiết lập mật khẩu người dùng từ <1>Cài đặt đăng nhập & đăng ký</1>.",
            message: "Tùy chọn mời người dùng bị vô hiệu hóa"
        },
        terminateAllSessions: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn tiếp tục thao tác này, người dùng sẽ bị đăng xuất khỏi tất cả các phiên " +
                "đang hoạt động. Họ sẽ mất tiến trình của bất kỳ tác vụ nào đang thực hiện. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ kết thúc vĩnh viễn tất cả các phiên đang hoạt động."
        },
        terminateSession: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn tiếp tục thao tác này, người dùng sẽ bị đăng xuất khỏi phiên " +
                "đã chọn. Họ sẽ mất tiến trình của bất kỳ tác vụ nào đang thực hiện. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ kết thúc vĩnh viễn phiên."
        },
        unassignGroup: {
            assertionHint: "Vui lòng xác nhận thao tác của bạn.",
            content: "Nếu bạn tiếp tục thao tác này, người dùng sẽ bị bỏ gán khỏi nhóm đã chọn. " +
                "Lưu ý rằng điều này có thể ảnh hưởng đến người dùng khi thực hiện một số tác vụ.",
            header: "Bạn có chắc không?"
        }
    },
    consumerUsers: {
        fields: {
            username: {
                label: "Tên đăng nhập",
                placeholder: "Nhập tên đăng nhập",
                validations: {
                    empty: "Tên đăng nhập là trường bắt buộc",
                    invalid: "Đã tồn tại một người dùng với tên đăng nhập này.",
                    invalidCharacters: "Tên đăng nhập có vẻ chứa ký tự không hợp lệ.",
                    regExViolation: "Vui lòng nhập một địa chỉ email hợp lệ."
                }
            }
        }
    },
    editUser: {
        placeholders: {
            undefinedUser: {
                action: "Quay lại danh sách người dùng",
                subtitles: "Có vẻ như người dùng được yêu cầu không tồn tại.",
                title: "Không tìm thấy người dùng"
            }
        },
        tab: {
            menuItems: {
                0: "Hồ sơ",
                1: "Nhóm",
                2: "Vai trò",
                3: "Phiên đang hoạt động",
                4: "Truy cập được chia sẻ"
            }
        }
    },
    forms: {
        validation: {
            dateFormatError: "Định dạng của {{field}} đã nhập không đúng. Định dạng hợp lệ là " +
                "YYYY-MM-DD.",
            duplicateError: "{{field}} không được có giá trị trùng lặp.",
            formatError: "Định dạng của {{field}} đã nhập không đúng.",
            futureDateError: "Ngày bạn nhập cho trường {{field}} không hợp lệ.",
            mobileFormatError: "Định dạng của {{field}} đã nhập không đúng. Định dạng hợp lệ là " +
                "[+][mã quốc gia][mã vùng][số điện thoại cục bộ]."
        }
    },
    guestUsers: {
        fields: {
            username: {
                label: "Tên đăng nhập",
                placeholder: "Nhập tên đăng nhập",
                validations: {
                    empty: "Tên đăng nhập là trường bắt buộc",
                    invalid: "Đã tồn tại một người dùng với tên đăng nhập này.",
                    invalidCharacters: "Tên đăng nhập có vẻ chứa ký tự không hợp lệ.",
                    regExViolation: "Vui lòng nhập một địa chỉ email hợp lệ."
                }
            }
        }
    },
    list: {
        columns: {
            actions: "Hành động",
            name: "Tên"
        }
    },
    notifications: {
        addUser: {
            badRequestError: {
                description: "{{description}}",
                message: "Lỗi khi thêm người dùng mới"
            },
            error: {
                description: "Đã xảy ra lỗi khi thêm người dùng.",
                message: "Lỗi khi thêm người dùng mới"
            },
            genericError: {
                description: "Không thể thêm người dùng mới",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Người dùng mới đã được thêm thành công.",
                message: "Thêm người dùng thành công"
            }
        },
        addUserPendingApproval: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi thêm người dùng mới"
            },
            genericError: {
                description: "Không thể thêm người dùng mới",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Người dùng mới đã được chấp nhận và đang chờ phê duyệt.",
                message: "Người dùng đã được chấp nhận để tạo"
            }
        },
        bulkImportUser: {
            submit: {
                error: {
                    description: "{{description}}",
                    message: "Đã xảy ra lỗi khi nhập người dùng"
                },
                genericError: {
                    description: "Không thể nhập người dùng",
                    message: "Đã xảy ra lỗi khi nhập người dùng"
                },
                success: {
                    description: "Người dùng đã được nhập thành công.",
                    message: "Nhập người dùng thành công"
                }
            },
            timeOut: {
                description: "Một số người dùng có thể chưa được tạo.",
                message: "Yêu cầu đã hết thời gian chờ"
            },validation: {
                blockedHeaderError: {
                    description: "Các tiêu đề sau không được phép: {{headers}}.",
                    message: "Tiêu đề cột bị chặn"
                },
                columnMismatchError: {
                    description: "Một số hàng dữ liệu của tệp không khớp với số cột yêu cầu. " +
                        "Vui lòng xem xét và sửa lại dữ liệu.",
                    message: "Số cột không khớp"
                },
                duplicateHeaderError: {
                    description: "Các tiêu đề sau bị trùng lặp: {{headers}}.",
                    message: "Tiêu đề cột trùng lặp"
                },
                emptyDataField: {
                    description: "Trường dữ liệu '{{dataField}}' không được để trống.",
                    message: "Trường dữ liệu trống"
                },
                emptyHeaderError: {
                    description: "Hãy đảm bảo rằng hàng đầu tiên chứa tiêu đề cho mỗi cột.",
                    message: "Thiếu tiêu đề cột"
                },
                emptyRowError: {
                    description: "Tệp đã chọn không chứa dữ liệu.",
                    message: "Tệp trống"
                },
                invalidGroup: {
                    description: "{{group}} không tồn tại.",
                    message: "Không tìm thấy nhóm"
                },
                invalidHeaderError: {
                    description: "Các tiêu đề sau không hợp lệ: {{headers}}.",
                    message: "Tiêu đề cột không hợp lệ"
                },

                invalidRole: {
                    description: "{{role}} không tồn tại.",
                    message: "Không tìm thấy vai trò"
                },
                missingRequiredHeaderError: {
                    description: "Các tiêu đề sau là bắt buộc nhưng bị thiếu trong tệp CSV: " +
                    "{{ headers }}.",
                    message: "Thiếu tiêu đề cột bắt buộc"
                }
            }
        },
        deleteUser: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi xóa người dùng"
            },
            genericError: {
                description: "Không thể xóa người dùng",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Người dùng đã được xóa thành công.",
                message: "Xóa người dùng thành công"
            }
        },
        deleteUserPendingApproval: {
            success: {
                description: "Xóa người dùng đã được chấp nhận và đang chờ phê duyệt.",
                message: "Người dùng được chấp nhận để xóa"
            }
        },
        fetchUsers: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi lấy danh sách người dùng"
            },
            genericError: {
                description: "Không thể lấy danh sách người dùng",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy danh sách người dùng thành công.",
                message: "Lấy danh sách người dùng thành công"
            }
        },
        getAdminRole: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi lấy vai trò quản trị"
            },
            genericError: {
                description: "Không thể lấy vai trò quản trị.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy vai trò quản trị thành công.",
                message: "Lấy vai trò thành công"
            }
        },
        impersonateUser: {
            error: {
                description: "Không thể mạo danh người dùng.",
                message: "Lỗi khi mạo danh người dùng"
            },
            genericError: {
                description: "Không thể mạo danh người dùng.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Bắt đầu mạo danh người dùng thành công.",
                message: "Mạo danh người dùng thành công"
            }
        },
        revokeAdmin: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi thu hồi quyền quản trị"
            },
            genericError: {
                description: "Không thể thu hồi quyền quản trị.",
                message: "Đã xảy ra lỗi"
            },
            pendingApproval: {
                description: "Việc thu hồi quyền quản trị đã được chấp nhận và đang chờ phê duyệt.",
                message: "Thu hồi quyền quản trị đang chờ phê duyệt"
            },
            success: {
                description: "Đã thu hồi quyền quản trị thành công.",
                message: "Thu hồi quyền thành công"
            }
        }
    },
    placeholders: {
        emptyList: {
            action: "Làm mới danh sách",
            subtitles: {
                0: "Danh sách người dùng trả về rỗng.",
                1: "Đã xảy ra lỗi khi lấy danh sách người dùng"
            },
            title: "Không tìm thấy người dùng nào"
        },
        userstoreError: {
            subtitles: {
                0: "Không thể lấy người dùng từ kho người dùng",
                1: "Vui lòng thử lại"
            },
            title: "Đã xảy ra lỗi"
        }
    },
    userSessions: {
        components: {
            sessionDetails: {
                actions: {
                    terminateAllSessions: "Kết thúc tất cả",
                    terminateSession: "Kết thúc phiên"
                },
                labels: {
                    activeApplication: "Ứng dụng đang hoạt động",
                    browser: "Trình duyệt",
                    deviceModel: "Model thiết bị",
                    ip: "Địa chỉ IP",
                    lastAccessed: "Truy cập lần cuối {{ date }}",
                    loggedInAs: "Đã đăng nhập trên <1>{{ app }}</1> với tư cách <3>{{ user }}</3>",
                    loginTime: "Thời gian đăng nhập",
                    os: "Hệ điều hành",
                    recentActivity: "Hoạt động gần đây"
                }
            }
        },
        dangerZones: {
            terminate: {
                actionTitle: "Kết thúc",
                header: "Kết thúc phiên",
                subheader: "Bạn sẽ bị đăng xuất khỏi phiên trên thiết bị cụ thể đó."
            }
        },
        notifications: {
            getAdminUser: {
                error: {
                    description: "{{ description }}",
                    message: "Lỗi lấy dữ liệu"
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy loại người dùng hiện tại.",
                    message: "Lỗi lấy dữ liệu"
                }
            },
            getUserSessions: {
                error: {
                    description: "{{ description }}",
                    message: "Lỗi lấy dữ liệu"
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi lấy các phiên người dùng.",
                    message: "Lỗi lấy dữ liệu"
                },
                success: {
                    description: "Đã lấy các phiên người dùng thành công.",
                    message: "Lấy dữ liệu thành công"
                }
            },
            terminateAllUserSessions: {
                error: {
                    description: "{{ description }}",
                    message: "Lỗi kết thúc"
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi kết thúc các phiên người dùng.",
                    message: "Lỗi kết thúc"
                },
                success: {
                    description: "Đã kết thúc tất cả các phiên người dùng thành công.",
                    message: "Kết thúc thành công"
                }
            },
            terminateUserSession: {
                error: {
                    description: "{{ description }}",
                    message: "Lỗi kết thúc"
                },
                genericError: {
                    description: "Đã xảy ra lỗi khi kết thúc phiên người dùng.",
                    message: "Lỗi kết thúc"
                },
                success: {
                    description: "Đã kết thúc phiên người dùng thành công.",
                    message: "Kết thúc thành công"
                }
            }
        },
        placeholders: {
            emptyListPlaceholder: {
                subtitles: "Không có phiên đang hoạt động nào cho người dùng này.",
                title: "Không có phiên đang hoạt động"
            }
        }
    },
    usersList: {
        list: {
            emptyResultPlaceholder: {
                addButton: "Người dùng mới",
                emptyUsers: "Không tìm thấy người dùng nào",
                subTitle: {
                    0: "Hiện tại không có người dùng nào khả dụng.",
                    1: "Bạn có thể thêm người dùng mới một cách dễ dàng bằng cách làm theo",
                    2: "các bước trong trình hướng dẫn tạo người dùng."
                },
                title: "Thêm một người dùng mới"
            },
            iconPopups: {
                delete: "Xóa",
                edit: "Chỉnh sửa"
            }
        },
        metaOptions: {
            columns: {
                emails: "Email",
                id: "ID người dùng",
                lastModified: "Sửa đổi lần cuối",
                name: "Tên",
                userName: "Tên đăng nhập"
            },
            heading: "Hiển thị cột"
        },
        search: {
            emptyResultPlaceholder: {
                clearButton: "Xóa truy vấn tìm kiếm",
                subTitle: {
                    0: "Chúng tôi không thể tìm thấy kết quả nào cho {{query}}",
                    1: "Vui lòng thử một truy vấn tìm kiếm khác.",
                    2: "Chúng tôi không thể tìm thấy kết quả nào."
                },
                title: "Không tìm thấy kết quả"
            }
        }
    },
    userstores: {
        userstoreOptions: {
            all: "Tất cả kho người dùng",
            primary: "Chính"
        }
    }
};
