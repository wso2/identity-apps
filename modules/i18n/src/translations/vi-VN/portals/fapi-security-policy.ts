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

import { FapiSecurityPolicyNS } from "../../../models/namespaces/fapi-security-policy-ns";

export const fapiSecurityPolicy: FapiSecurityPolicyNS = {
    description: "Cấu hình hồ sơ bảo mật FAPI được áp dụng trên các ứng dụng của tổ chức bạn.",
    form: {
        buttons: {
            update: {
                ariaLabel: "Nút cập nhật biểu mẫu chính sách bảo mật FAPI"
            }
        },
        dcr: {
            fields: {
                mandate: {
                    hint: "Khi được bật, các ứng dụng được đăng ký thông qua endpoint DCR sẽ bị ràng buộc với hồ sơ FAPI đã chọn.",
                    label: "Bắt buộc FAPI cho các ứng dụng được đăng ký bằng DCR"
                },
                profile: {
                    label: "Áp dụng hồ sơ FAPI: "
                }
            },
            heading: "Dynamic Client Registration"
        },
        fields: {
            enableFapi: {
                hint: "Công tắc toàn cục để kích hoạt các yêu cầu bảo mật FAPI trên tất cả ứng dụng.",
                label: "Bật FAPI"
            }
        },
        profiles: {
            description: "Chọn các hồ sơ bảo mật FAPI cho toàn tổ chức. " +
                "Bật ít nhất một hồ sơ. Các ứng dụng có thể được đăng ký với bất kỳ hồ sơ nào được bật.",
            heading: "Các hồ sơ FAPI được hỗ trợ",
            options: {
                fapi1Advanced: {
                    hint: "Bảo vệ nâng cao cho việc chia sẻ dữ liệu an toàn và truy cập API.",
                    label: "FAPI 1.0 Advanced"
                },
                fapi2Security: {
                    hint: "Bảo vệ tăng cường cho các API quan trọng và dữ liệu nhạy cảm.",
                    label: "FAPI 2.0 Security"
                }
            },
            validations: {
                atLeastOne: "Phải chọn ít nhất một hồ sơ FAPI."
            }
        }
    },
    constraints: {
        grantTypes: {
            hint: "Loại grant này không được hồ sơ FAPI đang hoạt động cho phép."
        },
        tokenBindingType: {
            hint: "Loại ràng buộc token này không được hồ sơ FAPI đang hoạt động cho phép."
        },
        pkce: {
            hint: "PKCE với phương thức thách thức mã S256 được hồ sơ FAPI đang hoạt động yêu cầu."
        },
        pvtKeyJwt: {
            hint: "Việc tái sử dụng JWT khóa riêng không được hồ sơ FAPI đang hoạt động cho phép."
        },
        par: {
            hint: "Yêu cầu ủy quyền được đẩy (Pushed Authorization Requests) được hồ sơ FAPI đang hoạt động yêu cầu."
        },
        validateBinding: {
            hint: "Việc xác thực ràng buộc token được hồ sơ FAPI đang hoạt động yêu cầu."
        }
    },
    notifications: {
        getDcrConfig: {
            error: {
                description: "Đã xảy ra lỗi khi lấy cấu hình DCR FAPI.",
                message: "Đã xảy ra lỗi"
            }
        },
        getFapiConfig: {
            error: {
                description: "Đã xảy ra lỗi khi lấy cấu hình FAPI.",
                message: "Đã xảy ra lỗi"
            }
        },
        updateConfig: {
            error: {
                description: "Đã xảy ra lỗi khi cập nhật cấu hình chính sách bảo mật FAPI.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật cấu hình chính sách bảo mật FAPI thành công.",
                message: "Cập nhật thành công"
            }
        }
    },
    title: "Chính sách bảo mật FAPI"
};
