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
import { templateCoreNS } from "../../../models";

export const templateCore: templateCoreNS = {
    categories: {
        other: {
            description: "Các loại tích hợp chưa được phân loại khác.",
            displayName: "Khác"
        }
    },
    forms: {
        resourceCreateWizard: {
            common: {
                validations: {
                    required: "Đây là trường bắt buộc."
                }
            },
            url: {
                validations: {
                    invalid: "URL không hợp lệ. Vui lòng nhập một URL hợp lệ."
                }
            }
        }
    },
    notifications: {
        fetchTemplates: {
            error: {
                description: "{{description}}",
                message: "Lỗi lấy dữ liệu"
            },
            genericError: {
                description: "Không thể lấy template {{type}}.",
                message: "Đã xảy ra lỗi"
            },
            success: {
                description: "Đã lấy template {{type}} thành công.",
                message: "Lấy dữ liệu thành công"
            }
        }
    }
};
