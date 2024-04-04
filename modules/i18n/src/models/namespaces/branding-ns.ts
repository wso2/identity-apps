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
export interface BrandingNS {
    brandingCustomText: {
        revertScreenConfirmationModal: {
            content: string;
            heading: string;
            message: string;
        };
        revertUnsavedConfirmationModal: {
            content: string;
            heading: string;
            message: string;
        };
        form: {
            genericFieldResetTooltip: string;
            genericFieldPlaceholder: string;
            fields: {
                copyright: {
                    hint: string;
                };
                "privacy.policy": {
                    hint: string;
                };
                "site.title": {
                    hint: string;
                };
                "terms.of.service": {
                    hint: string;
                };
                "login.button": {
                    hint: string;
                };
                "login.heading": {
                    hint: string;
                };
                "login.identifier.input.label": {
                    hint: string;
                    warning?: string;
                };
                "sms.otp.heading": {
                    hint: string;
                };
                "email.otp.heading": {
                    hint: string;
                };
                "totp.heading": {
                    hint: string;
                };
                "sign.up.button": {
                    hint: string;
                };
                "sign.up.heading": {
                    hint: string;
                };
                "password.recovery.body": {
                    hint: string;
                };
                "password.recovery.identifier.input.placeholder": {
                    hint: string;
                    warning?: string;
                };
                "password.recovery.button": {
                    hint: string;
                };
                "password.recovery.heading": {
                    hint: string;
                };
                "password.reset.button": {
                    hint: string;
                };
                "password.reset.heading": {
                    hint: string;
                };
                "password.reset.success.action": {
                    hint: string;
                };
                "password.reset.success.body": {
                    hint: string;
                };
                "password.reset.success.heading": {
                    hint: string;
                };
            };
        };
        localeSelectDropdown: {
            label: string;
            placeholder: string;
        };
        modes: {
            text: {
                label: string;
            };
            json: {
                label: string;
            };
        };
        notifications: {
            getPreferenceError: {
                description: string;
                message: string;
            };
            revertError: {
                description: string;
                message: string;
            };
            resetSuccess: {
                description: string;
                message: string;
            };
            updateError: {
                description: string;
                message: string;
            };
            updateSuccess: {
                description: string;
                message: string;
            };
        };
        screenSelectDropdown: {
            label: string;
            placeholder: string;
        };
    };
    connectors: {
        multiAttributeLogin: string;
        alternativeLoginIdentifier: string;
    };
    form: {
        actions: {
            save: string;
            resetAll: string;
        };
    };
    tabs: {
        text: {
            label: string;
        };
        preview: {
            label: string;
        };
    };
    screens: {
        common: string;
        login: string;
        "sms-otp": string;
        "email-otp": string;
        "email-template": string;
        "sign-up": string;
        totp: string;
        myaccount: string;
        "password-recovery": string;
        "password-reset": string;
        "password-reset-success": string;
    };
}
