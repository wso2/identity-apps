/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
 * Copilot panel constants.
 */
export const COPILOT_PANEL_CONSTANTS: {
    DEFAULT_WIDTH: number;
    MOBILE_BREAKPOINT: number;
    Z_INDEX: number;
} = {
    DEFAULT_WIDTH: 400,
    MOBILE_BREAKPOINT: 768,
    Z_INDEX: 1700 // Above header (1201), navbar, and all other elements
};

/**
 * Copilot feature flags.
 */
export const COPILOT_FEATURE_FLAGS: {
    CHAT_ENABLED: string;
    ENABLED: string;
    HELP_ENABLED: string;
} = {
    CHAT_ENABLED: "copilot.chat.enabled",
    ENABLED: "copilot.enabled",
    HELP_ENABLED: "copilot.help.enabled"
};
