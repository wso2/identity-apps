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
import { applicationTemplatesNS } from "../../../models";

export const applicationTemplates: applicationTemplatesNS = {
    categories: {
        default: {
            description: "Chọn kiến trúc ứng dụng phù hợp để cấu hình dễ dàng.",
            displayName: "Chọn loại ứng dụng"
        },
        ssoIntegration: {
            description: "Cấu hình Single-Sign-On cho các dịch vụ SaaS của bạn.",
            displayName: "Chọn tích hợp SSO"
        },
        technology: {
            description: "Chọn công nghệ ứng dụng phù hợp để cấu hình dễ dàng."
        }
    },
    notifications: {
        fetchTemplate: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy dữ liệu template ứng dụng.",
                message: "Đã xảy ra lỗi"
            }
        },
        fetchTemplateMetadata: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Đã xảy ra lỗi khi lấy siêu dữ liệu template ứng dụng.",
                message: "Đã xảy ra lỗi"
            }
        }
    },
    placeholders: {
        emptyApplicationTypeList: {
            subtitles: {
                0: "Hiện tại không có loại ứng dụng nào khả dụng.",
                1: "để cấu hình."
            },
            title: "Không tìm thấy loại ứng dụng nào"
        }
    }
};
