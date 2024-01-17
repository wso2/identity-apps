/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
 * Enum for Console Settings modes.
 */
export enum ConsoleSettingsModes {
    /**
     * Administrators tab mode.
     */
    ADMINISTRATORS = "administrators",
    /**
     * Roles tab mode.
     */
    ROLES = "roles",
    /**
     * Protocol tab mode.
     */
    PROTOCOL = "protocol",
    /**
     * Login flow tab mode.
     */
    LOGIN_FLOW = "login-flow"
}

/**
 * Enum for Console Settings tab IDs.
 */
export enum ConsoleSettingsTabIDs {
    /**
     * Administrators tab ID.
     */
    ADMINISTRATORS = 0,
    /**
     * Roles tab ID.
     */
    ROLES = 1,
    /**
     * Protocol tab ID.
     */
    PROTOCOL = 2,
    /**
     * Login flow tab ID.
     */
    LOGIN_FLOW = 3
}
