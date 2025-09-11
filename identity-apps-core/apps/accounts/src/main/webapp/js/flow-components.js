/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Get default components for successful registration completion
 * @param {string} accountStatus - The status of the account (e.g., ACCOUNT_LOCKED, PENDING_APPROVAL, etc.)
 * @param {string} contextPath - The application context path
 * @returns {Array} Array of default component configurations
 */
function getDefaultSuccessComponents(accountStatus, contextPath) {
    switch (accountStatus) {
        case "ACCOUNT_LOCKED":
            return [
                {
                    "id": "display_heading_rich_text",
                    "category": "DISPLAY",
                    "type": "RICH_TEXT",
                    "config": {
                        "text": "<h2 class=\"rich-text-heading-h2 rich-text-align-center\"><span class=\"rich-text-pre-wrap\">You're almost there!</span></h2><p class=\"rich-text-paragraph\"><br></p><h5 class=\"rich-text-heading-h5 rich-text-align-center\"><br><span class=\"rich-text-pre-wrap\">Check your inbox for the activation link to unlock your account and get started.</span></h5>"
                    }
                }
            ];
        case "PENDING_APPROVAL":
            return [
                {
                    "id": "display_heading_rich_text",
                    "category": "DISPLAY",
                    "type": "RICH_TEXT",
                    "config": {
                        "text": "<h2 class=\"rich-text-heading-h2 rich-text-align-center\"><span class=\"rich-text-pre-wrap\">Registration Submitted!</span></h2><p class=\"rich-text-paragraph\"><br></p><h5 class=\"rich-text-heading-h5 rich-text-align-center\"><br><span class=\"rich-text-pre-wrap\">Your account is pending approval. You'll be notified once an administrator reviews your request.</span></h5>"
                    }
                }
            ];
        default:
            return [
                {
                    "id": "display_heading_rich_text",
                    "category": "DISPLAY",
                    "type": "RICH_TEXT",
                    "config": {
                        "text": "<h2 class=\"rich-text-heading-h2 rich-text-align-center\"><span class=\"rich-text-pre-wrap\">Registration Successful!</span></h2><p class=\"rich-text-paragraph\"><br></p><h5 class=\"rich-text-heading-h5 rich-text-align-center\"><br><span class=\"rich-text-pre-wrap\">You can now sign in with your new account.</span></h5>"
                    }
                }
            ];
    }
};

/**
 * Get default components for different flow types
 * @param {string} flowType - The type of flow (REGISTRATION, PASSWORD_RECOVERY, etc.)
 * @param {string} accountStatus - The status of the account (e.g., ACCOUNT_LOCKED, PENDING_APPROVAL, etc.)
 * @param {string} contextPath - The application context path
 * @returns {Array} Array of default component configurations
 */
function getDefaultComponentsForFlowType(flowType, accountStatus, contextPath) {

    switch (flowType) {
        case "REGISTRATION":
            return getDefaultSuccessComponents(accountStatus, contextPath);
        default:
            return [];
    }
};
