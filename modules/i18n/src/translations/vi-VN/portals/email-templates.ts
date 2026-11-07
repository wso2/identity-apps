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
import { emailTemplatesNS } from "../../../models";

export const emailTemplates: emailTemplatesNS = {
    advancedSearch: {
        error: "Định dạng truy vấn lọc không đúng",
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: "Ví dụ: Name, v.v."
                },
                filterCondition: {
                    placeholder: "Ví dụ: Starts with, v.v."
                },
                filterValue: {
                    placeholder: "Ví dụ: TOTP, passwordResetSuccess, v.v."
                }
            }
        },
        placeholder: "Tìm kiếm theo loại template email"
    },
    buttons: {
        createTemplateType: "Tạo loại template",
        deleteTemplate: "Xóa template",
        editTemplate: "Chỉnh sửa template",
        newTemplate: "Template mới",
        newType: "Loại template mới",
        viewTemplate: "Xem template"

    },
    confirmations: {
        deleteTemplate: {
            assertionHint: "Vui lòng nhập <1>{{ id }}</1> để xác nhận.",
            content: "Nếu bạn xóa template email này, tất cả luồng công việc liên kết sẽ không còn " +
                "có template email hợp lệ để hoạt động. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn template email đã chọn."
        },
        deleteTemplateType: {
            assertionHint: "Vui lòng nhập <1>{{ id }}</1> để xác nhận.",
            content: "Nếu bạn xóa loại template email này, tất cả luồng công việc liên kết sẽ không còn " +
                "có template email hợp lệ để hoạt động và thao tác này sẽ xóa tất cả template ngôn ngữ " +
                "liên kết với loại template này. Vui lòng tiếp tục một cách thận trọng.",
            header: "Bạn có chắc không?",
            message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn loại template email " +
                "đã chọn."
        }
    },
    editor: {
        tabs: {
            code: {
                tabName: "Mã HTML"
            },
            preview: {
                tabName: "Xem trước"
            }
        }
    },
    forms: {
        addTemplateType: {
            fields: {
                type: {
                    label: "Tên loại template",
                    placeholder: "Nhập tên loại template",
                    validations: {
                        empty: "Cần có tên loại template để tiếp tục."
                    }
                }
            }
        }
    },
    list: {
        actions: "Hành động",
        name: "Tên"
    },
    notifications: {
        createTemplate: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi tạo template email."
            },
            genericError: {
                description: "Không thể tạo template email.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã tạo template email thành công.",
                message: "Tạo template email thành công"
            }
        },
        createTemplateType: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi tạo loại template email."
            },
            genericError: {
                description: "Không thể tạo loại template email.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã tạo loại template email thành công.",
                message: "Tạo loại template email thành công"
            }
        },
        deleteTemplate: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi xóa template email."
            },
            genericError: {
                description: "Không thể xóa template email.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã xóa template email thành công.",
                message: "Xóa template email thành công"
            }
        },
        deleteTemplateType: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi xóa loại template email."
            },
            genericError: {
                description: "Không thể xóa loại template email.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã xóa loại template email thành công.",
                message: "Xóa loại template email thành công"
            }
        },
        getTemplateDetails: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Không thể lấy chi tiết template email.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy chi tiết template email thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        getTemplateTypes: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Không thể lấy các loại template email.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy các loại template email thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        getTemplates: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Không thể lấy các template email.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy các template email thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        iframeUnsupported: {
            genericError: {
                description: "Trình duyệt của bạn không hỗ trợ iframe.",
                message: "Không được hỗ trợ"
            }
        },
        updateTemplate: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi cập nhật template email."
            },
            genericError: {
                description: "Không thể cập nhật template email.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật template email thành công.",
                message: "Cập nhật template email thành công"
            }
        },
        updateTemplateType: {
            error: {
                description: "{{description}}",
                message: "Lỗi khi cập nhật loại template email."
            },
            genericError: {
                description: "Không thể cập nhật loại template email.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật loại template email thành công.",
                message: "Cập nhật loại template email thành công"
            }
        }
    },
    placeholders: {
        emptyList: {
            action: "Template mới",
            subtitles: {
                0: "Hiện tại không có template nào khả dụng cho loại template",
                1: "email đã chọn. Bạn có thể thêm template mới bằng cách ",
                2: "nhấn vào nút bên dưới."
            },
            title: "Thêm template"
        },
        emptySearch: {
            action: "Xóa truy vấn tìm kiếm",
            subtitles: "Chúng tôi không thể tìm thấy kết quả nào cho {{searchQuery}}. "
                + "Vui lòng thử một từ khóa tìm kiếm khác.",
            title: "Không tìm thấy kết quả"
        }
    },
    updateTemplate: {
        tags: {
            premium: {
                info: "Tùy chỉnh template email chỉ khả dụng cho các tổ chức trong gói doanh nghiệp. <1>Liên hệ với chúng tôi</1> để nâng cấp."
            }
        }
    },
    viewTemplate: {
        heading: "Xem trước template email"
    },
    wizards: {
        addTemplateType: {
            heading: "Tạo loại template email",
            steps: {
                templateType: {
                    heading: "Loại template"
                }
            },
            subHeading: "Tạo loại template mới để liên kết với các yêu cầu email."
        }
    }
};
