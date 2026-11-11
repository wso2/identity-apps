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

import { CliSettingsNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
export const cliSettings: CliSettingsNS = {
    enablement: {
        description: "Khi bị vô hiệu hóa, mọi truy cập CLI vào tổ chức này đều bị chặn.",
        disableConfirmation: {
            content: "Bạn có thể bật lại bất cứ lúc nào mà không mất quyền truy cập hiện có của người dùng.",
            heading: "Vô hiệu hóa truy cập CLI?",
            message: "Các phiên CLI đang hoạt động sẽ bị kết thúc ngay lập tức, và người dùng sẽ không còn có thể đăng nhập qua CLI. Vui lòng tiếp tục một cách thận trọng."
        },
        notifications: {
            disabled: {
                description: "CLI đã được vô hiệu hóa thành công.",
                message: "Đã vô hiệu hóa CLI"
            },
            enabled: {
                description: "CLI đã được bật thành công.",
                message: "Đã bật CLI"
            },
            genericError: {
                disableDescription: "Không thể vô hiệu hóa CLI.",
                enableDescription: "Không thể bật CLI.",
                message: "Đã xảy ra lỗi"
            }
        },
        status: {
            disabled: "Đã vô hiệu hóa",
            enabled: "Đã bật"
        },
        title: "CLI",
        toggleAriaLabel: "Bật CLI"
    },
    notConfigured: {
        subtitle: "CLI {{productName}} chưa được cấu hình cho triển khai này.",
        title: "CLI {{productName}} không khả dụng"
    },
    page: {
        description: "Bật CLI để quản lý tổ chức của bạn từ dòng lệnh.",
        title: "Cài đặt CLI"
    },
    tabs: {
        users: "Người dùng"
    },
    users: {
        heading: "Người dùng có quyền truy cập CLI",
        list: {
            emptyPlaceholder: {
                action: "Gán người dùng",
                subtitles: "Chưa có người dùng nào có quyền truy cập CLI.",
                title: "Không có người dùng có quyền truy cập CLI"
            }
        },
        notifications: {
            pendingApproval: {
                description: "Cập nhật quyền truy cập CLI đã được chấp nhận và đang chờ phê duyệt.",
                message: "Cập nhật quyền truy cập CLI được chấp nhận để phê duyệt"
            },
            success: {
                description: "Quyền truy cập CLI đã được cập nhật thành công cho người dùng.",
                message: "Đã cập nhật quyền truy cập CLI"
            }
        },
        roleNotFound: {
            description: "Không thể tìm thấy vai trò có tên \"{{roleName}}\".",
            subtitle: "Tạo vai trò để quản lý quyền truy cập CLI.",
            title: "Không tìm thấy vai trò quản trị CLI"
        },
        subHeading: "Thêm hoặc xóa người dùng có thể truy cập CLI."
    }
};
