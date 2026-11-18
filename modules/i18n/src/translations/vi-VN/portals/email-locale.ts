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
import { emailLocaleNS } from "../../../models";

export const emailLocale: emailLocaleNS = {
    buttons: {
        addLocaleTemplate: "Thêm template ngôn ngữ",
        saveChanges: "Lưu thay đổi"
    },
    forms: {
        addLocale: {
            fields: {
                bodyEditor: {
                    label: "Nội dung",
                    validations: {
                        empty: "Nội dung email không được để trống."
                    }
                },
                locale: {
                    label: "Ngôn ngữ",
                    placeholder: "Chọn ngôn ngữ",
                    validations: {
                        empty: "Chọn ngôn ngữ"
                    }
                },
                signatureEditor: {
                    label: "Chữ ký thư",
                    validations: {
                        empty: "Chữ ký email không được để trống."
                    }
                },
                subject: {
                    label: "Tiêu đề",
                    placeholder: "Nhập tiêu đề email của bạn",
                    validations: {
                        empty: "Cần có tiêu đề email"
                    }
                }
            }
        }
    }
};
