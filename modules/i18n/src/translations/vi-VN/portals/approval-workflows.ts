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
import { approvalWorkflowsNS } from "../../../models";

export const approvalWorkflows: approvalWorkflowsNS = {
    advancedSearch: {
        placeholder: "Tìm kiếm theo tên quy trình phê duyệt"
    },
    confirmation: {
        confirm: "Xác nhận",
        content:
            "Nếu bạn xóa quy trình phê duyệt này, tất cả dữ liệu trong quy trình phê duyệt này cũng sẽ bị xóa. " +
            "Vui lòng tiếp tục một cách thận trọng.",
        header: "Bạn có chắc không?",
        hint: "Vui lòng xác nhận thao tác của bạn.",
        message:
            "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn" +
            " quy trình phê duyệt đã chọn và dữ liệu trong đó."
    },
    form: {
        dangerZone: {
            delete: {
                actionTitle: "Xóa quy trình phê duyệt",
                header: "Xóa quy trình phê duyệt",
                subheader: "Sau khi bạn xóa một quy trình phê duyệt, không thể hoàn tác. " + "Vui lòng chắc chắn."
            }
        },
        fields: {
            description: {
                label: "Mô tả",
                placeholder: "Mô tả mục đích của quy trình phê duyệt này"
            },
            engine: {
                label: "Công cụ quy trình công việc",
                placeholder: "Chọn công cụ quy trình công việc phù hợp",
                validation: {
                    required: "Cần có công cụ quy trình công việc"
                }
            },
            name: {
                label: "Tên",
                placeholder: "Quy trình phê duyệt mẫu",
                validation: {
                    required: "Cần có tên"
                }
            }
        },
        placeholders: {
            ApprovalWorkflowError: {
                subtitles: {
                    0: "Không thể lấy các quy trình phê duyệt",
                    1: "Vui lòng thử lại"
                },
                title: "Đã xảy ra lỗi"
            },
            emptyList: {
                action: "Quy trình phê duyệt mới",
                subtitles: {
                    0: "Hiện tại không có quy trình phê duyệt nào khả dụng.",
                    1: "Bạn có thể thêm quy trình phê duyệt mới một cách dễ dàng bằng cách làm theo các bước trong trình hướng dẫn tạo quy trình phê duyệt."
                },
                title: "Thêm một quy trình phê duyệt mới"
            },
            emptyListReadOnly: {
                subtitles: {
                    0: "Hiện tại không có quy trình phê duyệt nào khả dụng."
                },
                title: "Không có quy trình phê duyệt"
            },
            emptySearch: {
                action: "Xóa truy vấn tìm kiếm",
                subtitles: {
                    0: "Chúng tôi không thể tìm thấy kết quả nào cho {{searchQuery}}. Vui lòng thử một từ khóa tìm kiếm khác."
                },
                title: "Không tìm thấy kết quả"
            }
        },
        sqlEditor: {
            create: "Tạo",
            darkMode: "Chế độ tối",
            delete: "Xóa",
            read: "Đọc",
            reset: "Đặt lại thay đổi",
            title: "Các loại truy vấn SQL",
            update: "Cập nhật"
        }
    },
    forms: {
        configurations: {
            template: {
                condition: "hoặc",
                label: "Thêm bước phê duyệt",
                placeholder: "Nhập vai trò để tìm và gán",
                roles: {
                    label: "Vai trò"
                },
                users: {
                    label: "Người dùng"
                }
            }
        },
        connection: {
            connectionErrorMessage:
            "Vui lòng đảm bảo rằng URL kết nối, tên, " + "mật khẩu và tên driver được cung cấp là chính xác",
            testButton: "Kiểm tra kết nối",
            updatePassword: "Cập nhật mật khẩu kết nối"
        },
        custom: {
            placeholder: "Nhập một {{name}}",
            requiredErrorMessage: "Cần có {{name}}"
        },
        general: {
            description: {
                label: "Mô tả",
                placeholder: "Mô tả mục đích của quy trình phê duyệt này",
                validationErrorMessages: {
                    allSymbolsErrorMessage: "Mô tả phải có sự kết hợp của " +
                    "ký tự chữ và số và ký tự đặc biệt. Vui lòng thử một tên khác.",
                    invalidInputErrorMessage: "Mô tả không được chứa mẫu {{invalidString}}.",
                    invalidSymbolsErrorMessage: "Tên bạn nhập chứa ký tự không được phép. Tên không được chứa '/' hoặc '_'."
                }
            },
            engine: {
                label: "Công cụ quy trình công việc",
                placeholder: "Chọn công cụ phù hợp",
                requiredErrorMessage: "Cần có công cụ quy trình công việc"
            },
            name: {
                label: "Tên",
                placeholder: "Quy trình phê duyệt",
                requiredErrorMessage: "Tên là trường bắt buộc",
                validationErrorMessages: {
                    allSymbolsErrorMessage: "Tên quy trình phê duyệt phải có sự kết hợp của " +
                    "ký tự chữ và số và ký tự đặc biệt. Vui lòng thử một tên khác.",
                    alreadyExistsErrorMessage: "Đã tồn tại một quy trình phê duyệt với tên này.",
                    invalidInputErrorMessage: "Tên quy trình phê duyệt không được chứa mẫu {{invalidString}}.",
                    invalidSymbolsErrorMessage: "Tên bạn nhập chứa ký tự không được phép. Tên không được chứa '/' hoặc '_'.",
                    maxCharLimitErrorMessage: "Tên quy trình phê duyệt không được vượt quá {{maxLength}} ký tự."
                }
            }
        },
        notifications: {
            approver: {
                hint: "Gửi thông báo đến những người phê duyệt được gán để xem xét yêu cầu.",
                label: "Thông báo cho người phê duyệt"
            },
            channels: {
                email: "Email",
                sms: "SMS"
            },
            initiator: {
                hint: "Gửi thông báo cho người dùng đã khởi tạo yêu cầu khi hoàn tất.",
                label: "Thông báo cho người khởi tạo khi hoàn tất"
            }
        },
        operations: {
            dropDown: {
                disabledHint: "Đã tồn tại một quy trình công việc cho tác vụ này",
                label: "Cấu hình tác vụ",
                nullValidationErrorMessage: "Vui lòng chọn ít nhất một tác vụ",
                placeholder: "Nhập tác vụ để tìm và gán"
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
        addApprovalWorkflow: {
            genericError: {
                description: "Đã xảy ra lỗi khi tạo quy trình phê duyệt.",
                message: "Đã xảy ra lỗi!"
            },
            success: {
                description: "Quy trình phê duyệt đã được thêm thành công!",
                message: "Thêm quy trình phê duyệt thành công!"
            }
        },
        addWorkflowAssociation: {
            genericError: {
                description: "Đã xảy ra lỗi khi thêm tác vụ quy trình công việc.",
                message: "Đã xảy ra lỗi!"
            },
            success: {
                description: "Tác vụ quy trình công việc đã được thêm thành công!",
                message: "Thêm tác vụ quy trình công việc thành công!"
            }
        },
        apiLimitReachedError: {
            error: {
                description: "Bạn đã đạt số lượng quy trình phê duyệt tối đa được phép.",
                message: "Không thể tạo quy trình phê duyệt"
            }
        },
        delay: {
            description:
            "Có thể mất một lúc để danh sách quy trình phê duyệt được cập nhật. " +
            "Làm mới sau vài giây để có danh sách quy trình phê duyệt đã cập nhật.",
            message: "Cập nhật danh sách quy trình phê duyệt mất thời gian"
        },
        deleteApprovalWorkflow: {
            genericError: {
                description: "Đã xảy ra lỗi khi xóa quy trình phê duyệt.",
                message: "Đã xảy ra lỗi!"
            },
            success: {
                description: "Quy trình phê duyệt đã được xóa thành công!",
                message: "Xóa quy trình phê duyệt thành công!"
            }
        },
        deleteWorkflowAssociation: {
            genericError: {
                description: "Đã xảy ra lỗi khi xóa tác vụ quy trình công việc.",
                message: "Đã xảy ra lỗi!"
            },
            noAssociationsSelectedError: {
                description: "Phải chọn ít nhất một tác vụ quy trình công việc.",
                message: "Chưa chọn tác vụ quy trình công việc nào"
            },
            success: {
                description: "Tác vụ quy trình công việc đã được xóa thành công!",
                message: "Xóa tác vụ quy trình công việc thành công!"
            }
        },
        fetchApprovalWorkflowTemplates: {
            genericError: {
                description: "Đã xảy ra lỗi khi lấy chi tiết loại quy trình phê duyệt.",
                message: "Đã xảy ra lỗi"
            }
        },
        fetchApprovalWorkflows: {
            genericError: {
                description: "Đã xảy ra lỗi khi lấy các quy trình phê duyệt.",
                message: "Đã xảy ra lỗi"
            }
        },
        fetchWorkflowAssociations: {
            genericError: {
                description: "Đã xảy ra lỗi khi lấy các tác vụ liên kết với quy trình công việc.",
                message: "Đã xảy ra lỗi"
            }
        },
        testConnection: {
            genericError: {
                description: "Đã xảy ra lỗi khi kiểm tra kết nối đến quy trình phê duyệt",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Kết nối đang hoạt động tốt.",
                message: "Kết nối thành công!"
            }
        },
        updateApprovalWorkflow: {
            error: {
                description: "{{description}}",
                message: "Đã xảy ra lỗi khi cập nhật quy trình phê duyệt."
            },
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật quy trình phê duyệt.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Quy trình phê duyệt này đã được cập nhật thành công!",
                message: "Cập nhật quy trình phê duyệt thành công!"
            }
        },
        updateDelay: {
            description: "Có thể mất một chút thời gian để các thuộc tính đã cập nhật xuất hiện.",
            message: "Cập nhật thuộc tính mất thời gian"
        },
        updateRuleConfiguration: {
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật cấu hình quy tắc.",
                message: "Cập nhật quy tắc thất bại"
            },
            success: {
                description: "Cấu hình quy tắc đã được cập nhật thành công.",
                message: "Cập nhật quy tắc thành công!"
            }
        }
    },
    pageLayout: {
        create: {
            back: "Quay lại quy trình phê duyệt",
            description: "Làm theo các bước để tạo quy trình phê duyệt mới.",
            ruleConditions: {
                addRule: "Thêm quy tắc",
                configured: "Đã cấu hình",
                confirmDelete: {
                    content: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn quy tắc.",
                    message: "Nếu bạn xóa quy tắc này, quy trình phê duyệt sẽ luôn được kích hoạt khi " +
                        "{{operation}} được kích hoạt. Vui lòng tiếp tục một cách thận trọng.",
                    title: "Xác nhận xóa quy tắc"
                },
                editRule: "Chỉnh sửa quy tắc",
                engagement: {
                    always: "Luôn luôn",
                    column: "Kích hoạt",
                    configured: "Có điều kiện"
                },
                fields: {
                    initiatorClaim: "claim người khởi tạo",
                    userClaim: "claim người dùng",
                    valueRequired: "Cần có một giá trị.",
                    workflowClaimSelector: "Chọn claim"
                },
                modal: {
                    subtitle: "Định nghĩa các điều kiện để xác định khi nào quy trình phê duyệt nên được kích hoạt cho tác vụ này.",
                    title: "Quy tắc kích hoạt cho {{operation}}"
                },
                table: {
                    operation: "Tác vụ",
                    rules: "Quy tắc"
                }
            },
            stepper: {
                step1: {
                    description: "Cung cấp thông tin cơ bản của quy trình phê duyệt bạn muốn tạo.",
                    title: "Chi tiết chung"
                },
                step2: {
                    description: "Chọn các tác vụ sẽ kích hoạt quy trình phê duyệt này và cấu hình điều kiện quy tắc.",
                    hint: "Quy trình phê duyệt này được kích hoạt cho các tác vụ đã chọn dựa trên các quy tắc đã cấu hình, và luôn kích hoạt nếu không có quy tắc nào được định nghĩa.",
                    title:  "Chi tiết tác vụ quy trình công việc"
                },
                step3: {
                    description: "Cấu hình các bước phê duyệt của quy trình công việc. Phê duyệt bởi bất kỳ người dùng hoặc thành viên vai trò nào được chọn sẽ hoàn thành mỗi bước.",
                    hint: "Bạn có thể thêm nhiều bước phê duyệt vào quy trình công việc. Mỗi bước có thể có những người phê duyệt khác nhau. Phê duyệt bởi bất kỳ người dùng hoặc thành viên vai trò nào được chọn sẽ hoàn thành mỗi bước.",
                    title: "Chi tiết bước phê duyệt"
                },
                step4: {
                    description: "Cấu hình các kênh thông báo cho người khởi tạo và người phê duyệt.",
                    hint: "Chọn cách người khởi tạo và người phê duyệt sẽ được thông báo trong quá trình quy trình công việc.",
                    title: "Cấu hình thông báo"
                }
            },
            title: "Tạo một quy trình phê duyệt"
        },
        edit: {
            back: "Quay lại quy trình phê duyệt",
            description: "Chỉnh sửa quy trình phê duyệt",
            title: "Chỉnh sửa quy trình phê duyệt"
        },
        list: {
            description: "Tạo và quản lý quy trình phê duyệt.",
            newApprovalWorkflowDropdown: {
                connectDirectly: "Kết nối trực tiếp",
                connectRemotely: "Kết nối qua agent"
            },
            popups: {
                delete: "Xóa quy trình phê duyệt",
                edit: "Chỉnh sửa quy trình phê duyệt"
            },
            primaryAction: "Quy trình phê duyệt mới",
            title: "Quy trình phê duyệt"
        }
    },
    sections: {
        approvalSteps: {
            heading: "Các bước phê duyệt"
        },
        operations: {
            heading: "Tác vụ"
        }
    }
};
