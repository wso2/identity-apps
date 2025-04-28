/*
 * Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com).
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

"use strict";

/**
 * Returns the i18n keys for the given error code.
 *
 * @param {string} errorCode - The error code (e.g., "60001")
 * @returns {object} The i18n keys for the given error code.
 */
function getI18nKeyForError(errorCode) {
    switch (errorCode) {
        case "RFE-60001":

            return {
                message: "sign.up.error.invalid.flow.id.message",
                description: "sign.up.error.invalid.flow.id.description"
            };

        case "RFE-60002":

            return {
                message: "sign.up.error.username.not.provided.message",
                description: "sign.up.error.username.not.provided.description"
            };

        case "RFE-60003":

            return {
                message: "sign.up.error.username.already.exists.message",
                description: "sign.up.error.username.already.exists.description"
            };

        case "RFE-60004":

            return {
                message: "sign.up.error.undefined.flow.id.message",
                description: "sign.up.error.undefined.flow.id.description"
            };

        case "RFE-60005":

            return {
                message: "sign.up.error.invalid.username.message", 
                description: "sign.up.error.invalid.username.description" 
            };

        case "RFE-60006":

            return {
                message: "sign.up.error.registration.failed.message",
                description: "sign.up.error.registration.failed.description"
            };

        case "RFE-60007":

            return {
                message: "sign.up.error.request.processing.failed.message",
                description: "sign.up.error.request.processing.failed.description"
            };

        default:

            return {
                message: "sign.up.error.registration.failed.message",
                description: "sign.up.error.registration.failed.description"
            };
    }
}
