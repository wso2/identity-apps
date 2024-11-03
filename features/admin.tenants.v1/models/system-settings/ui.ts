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
 * Enum for System Settings modes.
 */
export enum SystemSettingsModes {
    /**
     * Remote log publishing feature.
     */
    REMOTE_LOG_PUBLISHING = "remote-log-publishing",
    /**
     * Admin advisory banner feature.
     */
    ADMIN_ADVISORY_BANNER = "admin-advisory-banner"
}

/**
 * Enum for System Settings tab IDs.
 */
export enum SystemSettingsTabIDs {
    /**
     * Remote log publishing tab ID.
     */
    REMOTE_LOG_PUBLISHING = 0,
    /**
     * Admin advisory banner tab ID.
     */
    ADMIN_ADVISORY_BANNER = 1
}
