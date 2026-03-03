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

import { useAuthContext } from "@asgardeo/auth-react";
import React, { PropsWithChildren, ReactElement, useMemo } from "react";
import { useGetCompatibilitySettings } from "../api/use-get-compatibility-settings";
import { CompatibilitySettingsContext, CompatibilitySettingsContextInterface } from "../context/compatibility-settings-context";
import { CompatibilitySettingsInterface } from "../models/config";

/**
 * Normalizes raw API response. Preserves existing nested keys.
 * Does not set enableLegacyFlows when the API did not return it, so
 * useEnableLegacyFlows can fall back to deployment config.
 */
const normalizeCompatibilitySettings = (
    raw: CompatibilitySettingsInterface | null | undefined
): CompatibilitySettingsInterface => {
    if (!raw) {
        return { flowExecution: {} };
    }

    return {
        ...raw,
        flowExecution: {
            ...raw.flowExecution
        }
    };
};

// eslint-disable-next-line @typescript-eslint/ban-types
type CompatibilitySettingsProviderPropsInterface = {};

/**
 * Provider that fetches tenant/sub-org compatibility settings from the API
 * (after user is authenticated) and exposes them via React Context.
 * API call is delegated to useGetCompatibilitySettings; follows same pattern as other providers.
 */
const CompatibilitySettingsProvider = (
    props: PropsWithChildren<CompatibilitySettingsProviderPropsInterface>
): ReactElement => {
    const { children } = props;

    const { state: { isAuthenticated } } = useAuthContext();

    const { data, error, isLoading } = useGetCompatibilitySettings(isAuthenticated);

    const compatibilitySettings: CompatibilitySettingsInterface = useMemo(() => {
        if (error || data === undefined || data === null) {
            return normalizeCompatibilitySettings(null);
        }

        return normalizeCompatibilitySettings(data as CompatibilitySettingsInterface);
    }, [ data, error ]);

    const value: CompatibilitySettingsContextInterface = useMemo(
        () => ({
            compatibilitySettings,
            isLoading
        }),
        [ compatibilitySettings, isLoading ]
    );

    return (
        <CompatibilitySettingsContext.Provider value={ value }>
            { children }
        </CompatibilitySettingsContext.Provider>
    );
};

export default CompatibilitySettingsProvider;
