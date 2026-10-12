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

import { validationNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
export const validation: validationNS = {
    description: "Tùy chỉnh quy tắc kiểm tra hợp lệ mật khẩu cho người dùng của bạn.",
    fetchValidationConfigData: {
        error: {
            description: "{{description}}",
            message: "Lỗi lấy dữ liệu"
        },
        genericError: {
            description: "Không thể lấy dữ liệu cấu hình kiểm tra hợp lệ.",
            message: "Đã xảy ra lỗi"
        }
    },
    goBackToApplication: "Quay lại ứng dụng",
    goBackToValidationConfig: "Quay lại Bảo mật tài khoản",
    notifications: {
        error: {
            description: "{{description}}",
            message: "Lỗi cập nhật"
        },
        genericError: {
            description: "Không thể cập nhật cấu hình kiểm tra hợp lệ mật khẩu.",
            message: "Đã xảy ra lỗi"
        },
        success: {
            description: "Đã cập nhật cấu hình kiểm tra hợp lệ mật khẩu thành công.",
            message: "Cập nhật thành công"
        }
    },
    pageTitle: "Kiểm tra hợp lệ mật khẩu",
    passwordExpiry: {
        enforcementScope: {
            appWithEnforcer: {
                hint: "Thời hạn mật khẩu sẽ chỉ được áp dụng trong các luồng đăng nhập có Password Reset " +
                    "Enforcer được thêm làm bước xác thực. " +
                    "Việc áp dụng trên toàn tổ chức sẽ bị vô hiệu hóa.",
                label: "Các luồng đăng nhập của ứng dụng đã chọn"
            },
            heading: "Áp dụng thời hạn mật khẩu cho",
            orgWide: {
                hint: "Thời hạn mật khẩu được áp dụng toàn cục khi đăng nhập trên tất cả ứng dụng. " +
                    "Nếu người dùng đăng nhập sau khi mật khẩu đã hết hạn, họ sẽ được yêu cầu " +
                    "đổi mật khẩu ở cuối luồng đăng nhập.",
                label: "Tất cả luồng đăng nhập của ứng dụng"
            }
        },
        heading: "Hết hạn mật khẩu",
        rules: {
            actions: {
                apply: "Áp dụng",
                skip: "Bỏ qua"
            },
            attributes: {
                groups: "Nhóm",
                roles: "Vai trò"
            },
            buttons: {
                addRule: "Thêm quy tắc",
                deleteRule: "Xóa quy tắc"
            },
            messages: {
                applyMessage: "ngày hết hạn mật khẩu.",
                defaultRuleApplyMessage: "ngày hết hạn mật khẩu nếu không có quy tắc nào khác khớp với người dùng.",
                defaultRuleSkipMessage: "thời hạn mật khẩu nếu không có quy tắc nào khác khớp với người dùng.",
                ifUserHas: "Nếu người dùng thuộc",
                info: "Các quy tắc sẽ được áp dụng theo thứ tự liệt kê bên dưới, từ trên xuống dưới. Dùng các mũi tên để điều chỉnh mức ưu tiên.",
                skipMessage: "thời hạn mật khẩu."
            }
        }
    },
    revertValidationConfigData: {
        error: {
            description: "Đã xảy ra lỗi khi hoàn tác cấu hình kiểm tra hợp lệ.",
            message: "Hoàn tác thất bại"
        },
        success: {
            description: "Đã hoàn tác cấu hình kiểm tra hợp lệ thành công.",
            message: "Hoàn tác thành công"
        }
    },
    validationError: {
        consecutiveChrMismatch: "Số ký tự liên tiếp phải nhỏ hơn độ dài tối thiểu " +
            "của mật khẩu.",
        invalidConfig: "Không thể tạo mật khẩu với các cấu hình trên.",
        maxLimitError: "Độ dài tối đa không được lớn hơn {{maxPasswordValue}}.",
        minLimitError: "Độ dài tối thiểu không được nhỏ hơn 8.",
        minMaxMismatch: "Độ dài tối thiểu phải nhỏ hơn độ dài tối đa.",
        uniqueChrMismatch: "Số ký tự khác nhau phải nhỏ hơn độ dài tối thiểu của " +
            "mật khẩu.",
        wrongCombination: "Tổ hợp không được phép"
    }
};
