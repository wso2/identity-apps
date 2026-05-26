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
 * The i18n key prefix for flow extension error messages.
 */
const FLOW_EXTENSION_KEY_PREFIX: string = "flow.extension.";

/**
 * The branding screen name for flow extension custom text.
 */
export const FLOW_EXTENSION_SCREEN: string = "flow-extension";

/**
 * Sanitize a connection name to be used as a segment in i18n keys.
 * Converts to lowercase, replaces non-alphanumeric characters with dots,
 * collapses consecutive dots, and trims leading/trailing dots.
 *
 * This mirrors the Java `FlowExtensionExecutor.sanitizeConnectionName()`.
 *
 * @param name - The display name of the connection.
 * @returns The sanitized dot-separated lowercase name.
 */
const sanitizeConnectionName = (name: string | null | undefined): string => {

    if (!name) {
        return "";
    }

    return name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ".")
        .replace(/\.{2,}/g, ".")
        .replace(/^\.+|\.+$/g, "");
};

/**
 * Build the full i18n key prefix for a specific connection.
 *
 * @param connectionName - The display name of the connection.
 * @returns The prefix string, e.g. "flow.extension.risk.assessment.extension."
 */
export const getConnectionKeyPrefix = (connectionName: string): string => {

    const sanitized: string = sanitizeConnectionName(connectionName);

    return `${FLOW_EXTENSION_KEY_PREFIX}${sanitized}.`;
};
