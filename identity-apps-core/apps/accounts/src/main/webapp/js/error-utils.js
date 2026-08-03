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
 * Strips surrounding double curly braces from a string (e.g. "{{key}}" → "key").
 *
 * @param {string} s - The string to strip.
 * @returns {string} The stripped string, or the original value if no braces are present.
 */
function stripBraces(s) {
    return s && s.startsWith("{{") && s.endsWith("}}") ? s.slice(2, -2) : s;
}

/**
 * Returns the i18n keys for the given error code.
 *
 * @param {string} errorCode - The error code (e.g., "60001")
 * @returns {object} The i18n keys for the given error code.
 */
function getI18nKeyForError(errorCode, flowType, errorMessage, errorDescription) {
    // Daon server-side failures (DAON-65xxx) are a whole band rather than a handful of codes, and none of
    // them is actionable by the user, so they share one message. The specific code is in the server log.
    // Checked before the switch since a case label cannot match a prefix.
    if (errorCode && errorCode.indexOf("DAON-65") === 0) {

        return {
            message: "daon.verification.server.error.message",
            description: "daon.verification.server.error.description"
        };
    }

    switch (errorCode) {
        case "FE-60001":

            return {
                message: "orchestration.flow.error.invalid.flow.id.message",
                description: "orchestration.flow.error.invalid.flow.id.description"
            };

        case "FE-60002":

            return {
                message: "sign.up.error.username.not.provided.message",
                description: "sign.up.error.username.not.provided.description",
                portalUrlStatus: "true"
            };

        case "FEE-60001":
        case "FE-60003":

            return {
                message: "sign.up.error.username.already.exists.message",
                description: "sign.up.error.username.already.exists.description",
                portalUrlStatus: "true"
            };

        case "FE-60004":

            if( flowType === "USER_REGISTRATION") {
                return {
                    message: "sign.up.flow.error.undefined.flow.id.message",
                    description: "sign.up.flow.error.undefined.flow.id.description"
                };
            } else if (flowType === "INVITED_USER_REGISTRATION") {
                return {
                    message: "invited.user.registration.flow.error.undefined.flow.id.message",
                    description: "invited.user.registration.flow.error.undefined.flow.id.description"
                };
            } else if( flowType === "PASSWORD_RECOVERY") {
                return {
                    message: "password.reset.flow.error.undefined.flow.id.message",
                    description: "password.reset.flow.error.undefined.flow.id.description"
                };
            }
            return {
                message: "orchestration.flow.error.undefined.flow.id.message",
                description: "orchestration.flow.error.undefined.flow.id.description"
            };

        case "FEE-60002":
        case "FE-60005":

            return {
                message: "sign.up.error.invalid.username.message",
                description: "sign.up.error.invalid.username.description",
                portalUrlStatus: "true"
            };

        case "FE-60006":

            if( flowType === "USER_REGISTRATION") {
                return {
                    message: "sign.up.error.failed.message",
                    description: "sign.up.error.failed.description",
                    portalUrlStatus: "true"
                };
            } else if (flowType === "INVITED_USER_REGISTRATION") {
                if (errorDescription && errorDescription.startsWith("Invalid Code")) {
                    return {
                        message: "invited.user.registration.flow.error.invalid.code.message",
                        description: "invited.user.registration.flow.error.invalid.code.description"
                    };
                }
                return {
                    message: "invited.user.registration.failed.message",
                    description: "invited.user.registration.failed.description",
                    portalUrlStatus: "true"
                };
            } else if( flowType === "PASSWORD_RECOVERY") {
                return {
                    message: "password.reset.failed.message",
                    description: "password.reset.failed.description",
                    portalUrlStatus: "true"
                };
            }
            return {
                message: "orchestration.flow.error.failed.message",
                description: "orchestration.flow.error.failed.description",
                portalUrlStatus: "true"
            };

        case "FE-60007":

            if( flowType === "USER_REGISTRATION") {
                return {
                    message: "sign.up.error.request.processing.failed.message",
                    description: "sign.up.error.request.processing.failed.description",
                    portalUrlStatus: "true"
                };
            } else if (flowType === "INVITED_USER_REGISTRATION") {
                return {
                    message: "invited.user.registration.error.request.processing.failed.message",
                    description: "invited.user.registration.error.request.processing.failed.description",
                    portalUrlStatus: "true"
                };
            } else if( flowType === "PASSWORD_RECOVERY") {
                return {
                    message: "password.reset.error.request.processing.failed.message",
                    description: "password.reset.error.request.processing.failed.description",
                    portalUrlStatus: "true"
                };
            }
            return {
                message: "orchestration.flow.error.request.processing.failed.message",
                description: "orchestration.flow.error.request.processing.failed.description",
                portalUrlStatus: "true"
            };

        case "FE-60008":

            return {
                message: "orchestration.flow.error.invalid.user.input.message",
                description: "orchestration.flow.error.invalid.user.input.description",
                portalUrlStatus: "true"
            };

        case "FE-60009":

            return {
                message: "orchestration.flow.error.invalid.actionId.message",
                description: "orchestration.flow.error.invalid.actionId.description"
            };

        case "FE-60010":

            return {
                message: "orchestration.flow.error.invalid.captcha.message",
                description: "orchestration.flow.error.invalid.captcha.description",
                portalUrlStatus: "true"
            };

        case "FE-60011":

            return {
                message: "orchestration.flow.error.no.flowType.message",
                description: "orchestration.flow.error.no.flowType.description",
                portalUrlStatus: "true"
            };

        case "FE-60101":

            return {
                message: "orchestration.flow.error.dynamic.portal.not.enabled.message",
                description: "orchestration.flow.error.dynamic.portal.not.enabled.description",
                portalUrlStatus: "true"
            };

        case "FE-60102":

            return {
                message: "orchestration.flow.error.self.registration.not.enabled.message",
                description: "orchestration.flow.error.self.registration.not.enabled.description",
                portalUrlStatus: "true"
            };

        case "FE-60103":

            return {
                message: "orchestration.flow.error.invalid.flowType.message",
                description: "orchestration.flow.error.invalid.flowType.description"
            };

        case "FE-60104":

            return {
                message: "orchestration.flow.error.disabled.flow.message",
                description: "orchestration.flow.error.disabled.flow.description",
                portalUrlStatus: "true"
            };

        case "FEE-60003":
        case "FE-60012":

            return {
                message: "orchestration.flow.error.preUpdatePassword.action.failure.message",
                description: "orchestration.flow.error.preUpdatePassword.action.failure.description",
                portalUrlStatus: "true"
            };

        case "FE-65034":
        case "FE-60017":

            return {
                message: stripBraces(errorMessage) || "orchestration.flow.error.failed.message",
                description: stripBraces(errorDescription) || "orchestration.flow.error.failed.description",
                portalUrlStatus: "true"
            };

        case "DAON-60001":

            // Daon TrustX identity-verification failure: the user is not enrolled. Retrying won't help,
            // so no portal "try again" button is shown.
            return {
                message: "daon.user.not.enrolled.message",
                description: "daon.user.not.enrolled.description"
            };

        // None of the Daon cases below sets portalUrlStatus, so no "try again" button is rendered: by the
        // time the connector reports a failure the flow's confirmation code has already been consumed, so
        // restarting the portal flow would only fail again.

        case "DAON-60002":

            // The user cancelled or abandoned the verification (OAuth2 access_denied from Daon).
            return {
                message: "daon.verification.cancelled.message",
                description: "daon.verification.cancelled.description"
            };

        case "DAON-60003":

            // The details submitted did not match the identity document.
            return {
                message: "daon.claims.mismatch.message",
                description: "daon.claims.mismatch.description"
            };

        case "DAON-60004":

            return {
                message: "daon.identity.verification.failed.message",
                description: "daon.identity.verification.failed.description"
            };

        case "DAON-60005":

            return {
                message: "daon.verification.not.completed.message",
                description: "daon.verification.not.completed.description"
            };

        case "DAON-60006":

            // Password recovery: Daon verified someone other than the account holder being recovered.
            return {
                message: "daon.recovery.identity.mismatch.message",
                description: "daon.recovery.identity.mismatch.description"
            };

        default:

            return {
                message: "orchestration.flow.error.failed.message",
                description: "orchestration.flow.error.failed.description",
                portalUrlStatus: "true"
            };
    }
}
