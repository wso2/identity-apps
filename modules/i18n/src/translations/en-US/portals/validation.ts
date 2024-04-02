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
import { validationNS } from "../../../models";

export const validation: validationNS = {
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
    validationError: {
        minMaxMismatch: "Minimum length should be less than maximum length.",
        uniqueChrMismatch: "Number of unique characters should be less than tha minimum length of " +
            "the password.",
        consecutiveChrMismatch: "Number of consecutive characters should be less than tha minimum " +
            "length of the password.",
        invalidConfig: "Unable to create password with the above configurations.",
        minLimitError: "The minimum length cannot be less than 8.",
        maxLimitError: "The maximum length cannot be more than 30.",
        wrongCombination: "The combination is not allowed"
    },
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
    description: "Customize password validation rules for your users.",
    goBackToApplication: "Go back to application",
    goBackToValidationConfig: "Go back to Account Security"
};
