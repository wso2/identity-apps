/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { useSelector } from "react-redux";
import useCompatibilitySettings from "./use-compatibility-settings";
import type { AppState } from "../store";

/**
 * Returns the effective enableLegacyFlows flag (boolean).
 * Compatibility settings (tenant/sub-org, from context) override deployment.config.json (Redux).
 *
 * @returns Effective enableLegacyFlows
 */
export const useEnableLegacyFlows = (): boolean => {
    const { compatibilitySettings } = useCompatibilitySettings();
    const deploymentValue: boolean | undefined =
        useSelector((state: AppState) => state?.config?.ui?.flowExecution?.enableLegacyFlows);

    const fromCompatibility: string | undefined =
        compatibilitySettings?.flowExecution?.enableLegacyFlows;

    if (fromCompatibility !== undefined && fromCompatibility !== null) {
        return fromCompatibility === "true";
    }

    return deploymentValue ?? true;
};

export default useEnableLegacyFlows;
