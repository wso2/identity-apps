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

import { OpenID4VPConfigNS } from "../../../models/namespaces/openid4vp-ns";

export const openid4vp: OpenID4VPConfigNS = {
    description: "Quản lý cách tổ chức của bạn yêu cầu và xác minh thông tin xác thực từ ví kỹ thuật số.",
    goBack: "Quay lại Định nghĩa trình bày",
    form: {
        clientIdScheme: {
            hint:
                "Chỉ định cách trình xác minh tự nhận diện với ví trong một yêu cầu VP. Mặc định là lược đồ client ID x509_hash.",
            label: "Lược đồ Client ID",
            placeholder: "Chọn một lược đồ client ID"
        },
        responseMode: {
            directPost: {
                hint: "Gửi thông tin xác thực có thể xác minh dưới dạng JSON thuần qua HTTPS POST. Không mã hóa phản hồi."
            },
            directPostJwt: {
                hint: "Gửi thông tin xác thực có thể xác minh dưới dạng JWT được mã hóa qua HTTPS POST. " +
                    "Cung cấp tính bảo mật cho nội dung phản hồi."
            },
            hint:
                "Cách ví gửi thông tin xác thực có thể xác minh. Dùng direct_post.jwt để " +
                "mã hóa phản hồi; direct_post cho JSON thuần.",
            label: "Chế độ phản hồi"
        }
    },
    notifications: {
        getConfiguration: {
            error: {
                description: "Đã xảy ra lỗi khi lấy cấu hình trình bày có thể xác minh.",
                message: "Lỗi lấy dữ liệu"
            }
        },
        updateConfiguration: {
            error: {
                description: "Đã xảy ra lỗi khi cập nhật cấu hình trình bày có thể xác minh.",
                message: "Lỗi cập nhật"
            },
            success: {
                description: "Đã cập nhật cấu hình trình bày có thể xác minh thành công.",
                message: "Cập nhật thành công"
            }
        }
    },
    title: "Cài đặt trình bày có thể xác minh"
};
