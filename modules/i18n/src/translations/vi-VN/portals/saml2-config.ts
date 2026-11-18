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
import { Saml2ConfigNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const saml2Config: Saml2ConfigNS = {
    title: "Cấu hình SAML2 Web SSO",
    description: "Cấu hình SAML2 Web SSO cho các ứng dụng của bạn.",
    form: {
        metadataValidityPeriod: {
            hint: "Đặt thời hạn hiệu lực của metadata SAML tính bằng phút.",
            label: "Thời hạn hiệu lực metadata"
        },
        destinationUrl: {
            hint: "Vị trí để gửi Phản hồi SAML, như được định nghĩa trong assertion SAML.",
            label: "URL đích"
        },
        enableMetadataSigning: {
            label: "Bật ký metadata"
        },
        validation: {
            metadataValidityPeriod: "Thời hạn hiệu lực metadata phải là một số nguyên dương.",
            destinationURLs: "URL đích phải là một URL hợp lệ."
        }
    },
    notifications: {
        getConfiguration: {
            error: {
                description: "Đã xảy ra lỗi khi lấy cấu hình saml2.",
                message: "Đã xảy ra lỗi"
            }
        },
        revertConfiguration: {
            error: {
                message: "Đã xảy ra lỗi",
                description: "Đã xảy ra lỗi khi hoàn tác cấu hình saml2."
            },
            success: {
                message: "Hoàn tác thành công",
                description: "Đã hoàn tác cấu hình saml2 thành công."
            }
        },
        updateConfiguration: {
            error: {
                description: "Đã xảy ra lỗi khi cập nhật cấu hình saml2.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật cấu hình saml2 thành công.",
                message: "Cập nhật thành công"
            }
        }
    }
};
