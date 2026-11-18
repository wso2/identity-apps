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

import { IssuerUsageScopeNS } from "../../../models/namespaces/issuer-usage-scope-ns";

export const issuerUsageScope: IssuerUsageScopeNS = {
    description: "Kiểm soát việc issuer của tổ chức gốc có được phép sử dụng bởi các tổ chức con hay không.",
    form: {
        issuer: {
            label: "Issuer của tổ chức {{organizationName}}",
            placeholder: "Đang tải issuer..."
        },
        options: {
            allExistingAndFutureOrgs: {
                hint: "Các ứng dụng được tạo trong các tổ chức thuộc tổ chức" +
                " {{organizationName}}, có thể dùng issuer của tổ chức {{organizationName}} làm nhà phát hành token.",
                label: "Cho phép issuer được sử dụng trong tất cả tổ chức."
            },
            none: {
                hint: "Không cho phép issuer của tổ chức này được sử dụng trong bất kỳ tổ chức nào được tạo dưới tổ chức này.",
                label: "Không cho phép issuer được sử dụng trong bất kỳ tổ chức nào."
            }
        },
        updateButton: {
            ariaLabel: "Nút cập nhật biểu mẫu phạm vi sử dụng issuer"
        }
    },
    notifications: {
        getConfiguration: {
            error: {
                description: "Đã xảy ra lỗi khi lấy cấu hình phạm vi sử dụng issuer.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy cấu hình phạm vi sử dụng issuer thành công.",
                message: "Lấy dữ liệu thành công"
            }
        },
        updateConfiguration: {
            defaultError: {
                description: "Đã xảy ra lỗi khi cập nhật cấu hình phạm vi sử dụng issuer.",
                message: "Đã xảy ra lỗi"
            },
            issuerUsedInOrgsError: {
                description: "Issuer của tổ chức này hiện đang được sử dụng trong các ứng dụng của tổ chức con.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã cập nhật cấu hình phạm vi sử dụng issuer thành công.",
                message: "Cập nhật thành công"
            }
        }
    },
    title: "Phạm vi sử dụng issuer"
};
