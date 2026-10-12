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
import { WsFederationConfigNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const wsFederationConfig: WsFederationConfigNS = {
    title: "Cấu hình WS-Federation",
    description: "Cấu hình giao thức WS-Federation cho các ứng dụng của bạn.",
    form: {
        enableRequestSigning: {
            label: "Bật ký yêu cầu xác thực"
        }
    },
    notifications: {
        getConfiguration: {
            error: {
                description: "Đã xảy ra lỗi khi lấy cấu hình WS-Federation.",
                message: "Đã xảy ra lỗi"
            }
        },
        revertConfiguration: {
            error: {
                description: "Đã xảy ra lỗi khi hoàn tác cấu hình WS-Federation.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã hoàn tác cấu hình WS-Federation thành công.",
                message: "Hoàn tác thành công"
            }
        },
        updateConfiguration: {
            error: {
                description: "Đã xảy ra lỗi khi cập nhật cấu hình WS-Federation.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật cấu hình WS-Federation thành công.",
                message: "Cập nhật thành công"
            }
        }
    }
};
