/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

export const emailLocale: emailLocaleNS ={
    buttons: {
        addLocaleTemplate: "Add Locale Template",
        saveChanges: "Save Changes"
    },
    forms: {
        addLocale: {
            fields: {
                bodyEditor: {
                    label: "Body",
                    validations: {
                        empty: "The email body cannot be empty."
                    }
                },
                locale: {
                    label: "Locale",
                    placeholder: "Select Locale",
                    validations: {
                        empty: "Select locale"
                    }
                },
                signatureEditor: {
                    label: "Mail signature",
                    validations: {
                        empty: "The email signature cannot be empty."
                    }
                },
                subject: {
                    label: "Subject",
                    placeholder: "Enter your email subject",
                    validations: {
                        empty: "Email Subject is required"
                    }
                }
            }
        }
    }
};
