/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

export interface validationNS {
    fetchValidationConfigData: {
        error: {
            description: string;
            message: string;
        };
        genericError: {
            description: string;
            message: string;
        };
    };
    revertValidationConfigData: {
        error: {
            description: string;
            message: string;
        };
        success: {
            description: string;
            message: string;
        };
    };
    validationError: {
        minMaxMismatch: string;
        uniqueChrMismatch: string;
        consecutiveChrMismatch: string;
        invalidConfig: string;
        minLimitError: string;
        maxLimitError: string;
        wrongCombination: string;
    };
    notifications: {
        error: {
            description: string;
            message: string;
        };
        genericError: {
            description: string;
            message: string;
        };
        success: {
            description: string;
            message: string;
        };
    };
    pageTitle: string;
    description: string;
    goBackToApplication: string;
    goBackToValidationConfig: string;
    passwordExpiry: {
        heading: string;
        rules: {
            buttons: {
                addRule: string;
                deleteRule: string;
            },
            actions: {
                apply: string;
                skip: string;
            },
            attributes: {
                roles: string;
                groups: string;
            },
            messages: {
                info: string;
                applyMessage: string;
                skipMessage: string;
                ifUserHas: string;
                defaultRuleApplyMessage: string;
                defaultRuleSkipMessage: string;
            }
        }
    }
}
