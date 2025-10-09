/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

import { AppState } from "@wso2is/admin.core.v1/store";
import { useSelector } from "react-redux";
import { ActionsConstants } from "../constants/actions-constants";

/**
 * Interface for action versioning information.
 */
export interface ActionVersionInfo {
    /**
     * The current version of the action.
     */
    currentVersion: string;
    /**
     * The latest available version.
     */
    latestVersion: string;
    /**
     * Whether the action is outdated.
     */
    isOutdated: boolean;
    /**
     * Formatted display version (e.g., "1.x" instead of "v1").
     */
    displayVersion: string;
    /**
     * Formatted latest display version.
     */
    latestDisplayVersion: string;
}

/**
 * Custom hook for managing action versioning.
 *
 * @param actionType - The action type from the URL path
 * @param actionVersion - The current action version (optional, for specific actions)
 * @returns Action versioning information and utilities
 */
export const useActionVersioning = (
    actionType: string,
    actionVersion?: string
): ActionVersionInfo => {
    const actionsConfig: any = useSelector((state: AppState) => state?.config?.ui?.actions);

    /**
     * Formats version string from 'v1' format to '1.x' format.
     *
     * @param version - The version string to format
     * @returns The formatted version string
     */
    const formatVersionForDisplay = (version: string): string => {
        if (!version) {
            return version;
        }

        return version.replace(/^v(\d+)$/, "$1.x");
    };

    /**
     * Compares two version strings to determine if the first is outdated.
     *
     * @param currentVersion - The current version
     * @param latestVersion - The latest available version
     * @returns True if current version is outdated
     */
    const isVersionOutdated = (currentVersion: string, latestVersion: string): boolean => {
        if (!currentVersion || !latestVersion) {
            return false;
        }

        // Extract numeric part from version strings (e.g., "v1" -> "1")
        const currentVersionNum: string = currentVersion.replace(/^v/, "");
        const latestVersionNum: string = latestVersion.replace(/^v/, "");

        return parseInt(currentVersionNum, 10) < parseInt(latestVersionNum, 10);
    };

    const actionConfigPath: string = ActionsConstants.ACTIONS_CONFIG_PATHS[actionType];

    const latestVersion: string = actionsConfig?.types?.[actionConfigPath]?.version?.latest;
    const currentVersion: string = actionVersion || latestVersion; // Use provided version or default to latest

    const isOutdated: boolean = isVersionOutdated(currentVersion, latestVersion);
    const displayVersion: string = formatVersionForDisplay(currentVersion);
    const latestDisplayVersion: string = formatVersionForDisplay(latestVersion);

    return {
        currentVersion,
        displayVersion,
        isOutdated,
        latestDisplayVersion,
        latestVersion
    };
};
