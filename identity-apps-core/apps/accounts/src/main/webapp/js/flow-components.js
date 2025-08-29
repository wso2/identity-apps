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
 * Default components configuration for flow completion
 */
window.FlowComponents = window.FlowComponents || {};

/**
 * Get default components for successful registration completion
 * @param {string} contextPath - The application context path
 * @returns {Array} Array of default component configurations
 */
window.FlowComponents.getDefaultSuccessComponents = function(contextPath) {
    return [
        {
            "id": "display_heading_rich_text",
            "category": "DISPLAY",
            "type": "RICH_TEXT",
            "config": {
                "text": "<h1 class=\"rich-text-heading-h1 rich-text-align-center\"><span class=\"rich-text-pre-wrap\">Almost there!</span></h1>"
            }
        },
        {
            "id": "display_image",
            "category": "DISPLAY",
            "type": "IMAGE",
            "variant": "IMAGE_BLOCK",
            "config": {
                "src": contextPath + "/libs/themes/wso2is/assets/images/illustrations/account-creation-success.svg"
            }
        },
        {
            "id": "display_body_rich_text",
            "category": "DISPLAY",
            "type": "RICH_TEXT",
            "config": {
                "text": "<h4 class=\"rich-text-heading-h4 rich-text-align-center\"><span class=\"rich-text-pre-wrap\">Check your inbox to activate your account and get started.</span></h4>"
            }
        }
    ];
};

/**
 * Get default components for different flow types
 * @param {string} flowType - The type of flow (REGISTRATION, PASSWORD_RECOVERY, etc.)
 * @param {string} contextPath - The application context path
 * @returns {Array} Array of default component configurations
 */
window.FlowComponents.getDefaultComponentsForFlowType = function(flowType, contextPath) {
    switch(flowType) {
        case "REGISTRATION":
            return window.FlowComponents.getDefaultSuccessComponents(contextPath);
    }
};
