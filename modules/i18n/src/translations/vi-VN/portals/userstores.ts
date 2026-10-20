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
import { userstoresNS } from "../../../models";

export const userstores: userstoresNS = {
    advancedSearch: {
        error: "Định dạng truy vấn lọc không đúng",
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: "Ví dụ: Name, Description, v.v."
                },
                filterCondition: {
                    placeholder: "Ví dụ: Starts with, v.v."
                },
                filterValue: {
                    placeholder: "Ví dụ: PRIMARY, SECONDARY, v.v."
                }
            }
        },
        placeholder: "Tìm kiếm theo tên kho người dùng"
    },
    confirmation: {
        confirm: "Xác nhận",
        content: "Nếu bạn xóa kho người dùng này, dữ liệu người dùng trong kho người dùng này cũng sẽ bị xóa. "
            + "Vui lòng tiếp tục một cách thận trọng.",
        header: "Bạn có chắc không?",
        hint: "Vui lòng xác nhận thao tác của bạn.",
        message: "Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn"
            + " kho người dùng đã chọn và dữ liệu trong đó."
    },
    dangerZone: {
        delete: {
            actionTitle: "Xóa kho người dùng",
            header: "Xóa kho người dùng",
            subheader: "Sau khi bạn xóa một kho người dùng, không thể hoàn tác. "
                + "Vui lòng chắc chắn."
        },
        disable: {
            actionTitle: "Bật kho người dùng",
            header: "Bật kho người dùng",
            subheader: "Vô hiệu hóa một kho người dùng có thể khiến bạn mất quyền truy cập vào người dùng trong kho người dùng đó. " +
                "Hãy tiếp tục một cách thận trọng."
        }
    },
    forms: {
        connection: {
            connectionErrorMessage: "Vui lòng đảm bảo rằng URL kết nối, tên, "
                + "mật khẩu và tên driver được cung cấp là chính xác",
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
                placeholder: "Nhập một mô tả",
                validationErrorMessages: {
                    invalidInputErrorMessage: "Mô tả không được chứa mẫu {{invalidString}}."
                }
            },
            name: {
                label: "Tên",
                placeholder: "Nhập một tên",
                requiredErrorMessage: "Tên là trường bắt buộc",
                validationErrorMessages: {
                    alreadyExistsErrorMessage: "Đã tồn tại một kho người dùng với tên này.",
                    invalidInputErrorMessage: "Tên kho người dùng không được chứa mẫu {{invalidString}}.",
                    maxCharLimitErrorMessage: "Tên kho người dùng không được vượt quá {{maxLength}} ký tự."
                }
            },
            type: {
                label: "Loại",
                requiredErrorMessage: "Chọn một loại"
            }
        }
    },
    notifications: {
        addUserstore: {
            genericError: {
                description: "Đã xảy ra lỗi khi tạo kho người dùng.",
                message: "Đã xảy ra lỗi!"
            },
            success: {
                description: "Kho người dùng đã được thêm thành công!",
                message: "Thêm kho người dùng thành công!"
            }
        },
        apiLimitReachedError: {
            error: {
                description: "Bạn đã đạt số lượng kho người dùng tối đa được phép.",
                message: "Không thể tạo kho người dùng"
            }
        },
        delay: {
            description: "Có thể mất một lúc để danh sách kho người dùng được cập nhật. "
                + "Làm mới sau vài giây để có danh sách kho người dùng đã cập nhật.",
            message: "Cập nhật danh sách kho người dùng mất thời gian"
        },
        deleteUserstore: {
            genericError: {
                description: "Đã xảy ra lỗi khi xóa kho người dùng.",
                message: "Đã xảy ra lỗi!"
            },
            success: {
                description: "Kho người dùng đã được xóa thành công!",
                message: "Xóa kho người dùng thành công!"
            }
        },
        fetchUserstoreMetadata: {
            genericError: {
                description: "Đã xảy ra lỗi khi lấy siêu dữ liệu loại.",
                message: "Đã xảy ra lỗi"
            }
        },
        fetchUserstoreTemplates: {
            genericError: {
                description: "Đã xảy ra lỗi khi lấy chi tiết loại kho người dùng.",
                message: "Đã xảy ra lỗi"
            }
        },
        fetchUserstoreTypes: {
            genericError: {
                description: "Đã xảy ra lỗi khi lấy các loại kho người dùng.",
                message: "Đã xảy ra lỗi"
            }
        },
        fetchUserstores: {
            genericError: {
                description: "Đã xảy ra lỗi khi lấy danh sách kho người dùng.",
                message: "Đã xảy ra lỗi"
            }
        },
        testConnection: {
            genericError: {
                description: "Đã xảy ra lỗi khi kiểm tra kết nối đến kho người dùng",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Kết nối đang hoạt động tốt.",
                message: "Kết nối thành công!"
            }
        },
        updateDelay: {
            description: "Có thể mất một chút thời gian để các thuộc tính đã cập nhật xuất hiện.",
            message: "Cập nhật thuộc tính mất thời gian"
        },
        updateUserstore: {
            genericError: {
                description: "Đã xảy ra lỗi khi cập nhật kho người dùng.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Kho người dùng này đã được cập nhật thành công!",
                message: "Cập nhật kho người dùng thành công!"
            }
        }
    },
    pageLayout: {
        edit: {
            back: "Quay lại kho người dùng",
            description: "Chỉnh sửa kho người dùng",
            tabs: {
                connection: "Kết nối",
                general: "Chung",
                group: "Nhóm",
                user: "Người dùng"
            }
        },
        list: {
            description: "Tạo và quản lý kho người dùng.",
            newUserStoreDropdown: {
                connectDirectly: "Kết nối trực tiếp",
                connectRemotely: "Kết nối qua agent"
            },
            primaryAction: "Kho người dùng mới",
            title: "Kho người dùng"
        },
        templates: {
            back: "Quay lại kho người dùng",
            description: "Vui lòng chọn một trong các loại kho người dùng sau.",
            templateHeading: "Thiết lập nhanh",
            templateSubHeading: "Bộ template định nghĩa sẵn giúp tăng tốc việc tạo kho người dùng.",
            title: "Chọn loại kho người dùng"
        }
    },
    placeholders: {
        emptyList: {
            action: "Kho người dùng mới",
            subtitles: "Hiện tại không có kho người dùng nào khả dụng. "
                + "Bạn có thể thêm kho người dùng mới một cách dễ dàng bằng cách làm theo "
                + "các bước trong trình hướng dẫn tạo kho người dùng.",
            title: "Thêm một kho người dùng mới"
        },
        emptyListReadOnly: {
            subtitles: "Hiện tại không có kho người dùng nào khả dụng.",
            title: "Không có kho người dùng"
        },
        emptySearch: {
            action: "Xóa truy vấn tìm kiếm",
            subtitles: "Chúng tôi không thể tìm thấy kết quả nào cho {{searchQuery}}. "
                + "Vui lòng thử một từ khóa tìm kiếm khác.",
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
    },
    wizard: {
        header: "Thêm kho người dùng {{type}}",
        steps: {
            general: "Chung",
            group: "Nhóm",
            summary: "Tóm tắt",
            user: "Người dùng"
        }
    }
};
