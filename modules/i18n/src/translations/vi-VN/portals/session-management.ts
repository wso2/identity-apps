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
import { SessionManagementNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const sessionManagement: SessionManagementNS = {
    description: "Quản lý các cài đặt liên quan đến phiên của người dùng.",
    title: "Quản lý phiên",
    form: {
        idleSessionTimeout: {
            hint: "Người dùng sẽ tự động bị đăng xuất sau thời gian đã cấu hình.",
            label: "Thời gian chờ phiên không hoạt động",
            placeholder: "Nhập thời gian chờ phiên không hoạt động tính bằng phút"
        },
        rememberMePeriod: {
            hint: "Người dùng sẽ được nhắc đăng nhập lại sau thời gian đã cấu hình.",
            label: "Khoảng thời gian ghi nhớ đăng nhập",
            placeholder: "Nhập khoảng thời gian ghi nhớ đăng nhập tính bằng phút"
        },
        enableMaximumSessionTimeout: {
            hint: "Bật thời gian sống tối đa cho các phiên người dùng.",
            label: "Bật thời gian chờ phiên tối đa"
        },
        maximumSessionTimeout: {
            hint: "Người dùng sẽ được yêu cầu xác thực lại sau thời gian đã cấu hình, bất kể hoạt động.",
            label: "Thời gian chờ phiên tối đa",
            placeholder: "Nhập thời gian chờ phiên tối đa tính bằng phút"
        },
        preserveCurrentSessionAtPasswordUpdate: {
            hint: "Nếu được bật, phiên và token hiện tại sẽ KHÔNG bị kết thúc hoặc thu hồi khi người dùng cập nhật mật khẩu.",
            label: "Bỏ qua kết thúc phiên và token hiện tại khi cập nhật mật khẩu"
        },
        validation: {
            idleSessionTimeout: "Thời gian chờ phiên không hoạt động phải là một số nguyên dương.",
            rememberMePeriod: "Khoảng thời gian ghi nhớ đăng nhập phải là một số nguyên dương.",
            maximumSessionTimeout: "Thời gian chờ phiên tối đa phải là một số nguyên dương."
        }
    },
    notifications: {
        getConfiguration: {
            error: {
                description: "Đã xảy ra lỗi khi lấy cài đặt quản lý phiên.",
                message: "Đã xảy ra lỗi"
            }
        },
        revertConfiguration: {
            error: {
                message: "Đã xảy ra lỗi",
                description: "Đã xảy ra lỗi khi hoàn tác cài đặt quản lý phiên."
            },
            success: {
                message: "Hoàn tác thành công",
                description: "Đã hoàn tác cài đặt quản lý phiên thành công."
            }
        },
        updateConfiguration: {
            error: {
                description: "Đã xảy ra lỗi khi cập nhật cài đặt quản lý phiên.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật cài đặt quản lý phiên thành công.",
                message: "Cập nhật thành công"
            }
        }
    }
};
