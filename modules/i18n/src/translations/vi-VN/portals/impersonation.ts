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

import { ImpersonationNS } from "../../../models";

export const impersonation: ImpersonationNS = {
    description: "Cấu hình cài đặt mạo danh cho tổ chức.",
    form: {
        enableEmailNotification: {
            hint: "Nếu được bật, người dùng bị mạo danh sẽ nhận được thông báo email sau khi bắt đầu mạo danh.",
            label: "Bật thông báo email"
        }
    },
    notifications: {
        getConfiguration: {
            error: {
                description: "Đã xảy ra lỗi khi lấy cấu hình mạo danh.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy cấu hình mạo danh thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        revertConfiguration: {
            error: {
                description: "Đã xảy ra lỗi khi hoàn tác cấu hình mạo danh.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã hoàn tác cấu hình mạo danh thành công.",
                message: "Hoàn tác thành công"
            }
        },
        updateConfiguration: {
            error: {
                description: "Đã xảy ra lỗi khi cập nhật cấu hình mạo danh.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật cấu hình mạo danh thành công.",
                message: "Cập nhật thành công"
            }
        }
    },
    title: "Mạo danh"
};
