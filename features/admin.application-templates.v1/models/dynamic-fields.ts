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

/**
 * Supported custom validation handlers for application templates.
 */
export enum ApplicationTemplateValidationHandlers {
    APPLICATION_NAME = "applicationName",
}

/**
 * Supported custom initialize handlers for application templates.
 */
export enum ApplicationTemplateInitializeHandlers {
    UNIQUE_APPLICATION_NAME = "uniqueApplicationName",
}

/**
 * Supported custom submission handlers for application templates.
 */
export enum ApplicationTemplateSubmissionHandlers {
    BUILD_CALLBACK_URLS_WITH_REGEXP = "buildCallbackURLsWithRegexp",
}
