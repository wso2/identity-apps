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

import { validationNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
export const validation: validationNS = {
    description: "Customize password validation rules for your users.",
    fetchValidationConfigData: {
        error: {
            description: "{{description}}",
            message: "Retrieval error"
        },
        genericError: {
            description: "Couldn't retrieve validation configuration data.",
            message: "Something went wrong"
        }
    },
    goBackToApplication: "Go back to application",
    goBackToValidationConfig: "Go back to Account Security",
    notifications: {
        error: {
            description: "{{description}}",
            message: "Update error"
        },
        genericError: {
            description: "Failed to update password validation configuration.",
            message: "Something went wrong"
        },
        success: {
            description: "Successfully updated password validation configuration.",
            message: "Update successful"
        }
    },
    pageTitle: "Password Validation",
    passwordExpiry: {
        heading: "Password Expiration",
        rules: {
            actions: {
                apply: "Apply",
                skip: "Skip"
            },
            attributes: {
                groups: "Groups",
                roles: "Roles"
            },
            buttons: {
                addRule: "Add Rule",
                deleteRule: "Delete Rule"
            },
            messages: {
                applyMessage: "days password expiry.",
                defaultRuleApplyMessage: "days password expiry if no other rules match to the user.",
                defaultRuleSkipMessage: "password expiry if no other rules match to the user.",
                ifUserHas: "If user belongs to",
                info: "Rules will be applied in the order listed below, from top to bottom. Use the arrows to adjust the priority.",
                skipMessage: "password expiry."
            }
        }
    },
    revertValidationConfigData: {
        error: {
            description: "Error occurred while reverting validation configurations.",
            message: "Revert failed"
        },
        success: {
            description: "Successfully reverted validation configurations.",
            message: "Revert successful"
        }
    },
    validationError: {
        consecutiveChrMismatch: "Number of consecutive characters should be less than tha minimum " +
            "length of the password.",
        invalidConfig: "Unable to create password with the above configurations.",
        maxLimitError: "The maximum length cannot be more than {{maxPasswordValue}}.",
        minLimitError: "The minimum length cannot be less than 8.",
        minMaxMismatch: "Minimum length should be less than maximum length.",
        uniqueChrMismatch: "Number of unique characters should be less than tha minimum length of " +
            "the password.",
        wrongCombination: "The combination is not allowed"
    }
};
