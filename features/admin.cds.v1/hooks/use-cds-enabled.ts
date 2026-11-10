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

import { isCDSServerConfigEnabled } from "../utils/ui-mode-utils";
import useCDSConfig from "./use-config";
import useCDSServerConfig from "./use-server-config";

/**
 * Return type of the useCDSEnabled hook.
 */
export interface UseCDSEnabledReturnInterface {
    /**
     * Whether CDS is enabled for the organization.
     */
    isEnabled: boolean;

    /**
     * Whether the CDS status request is in flight.
     */
    isLoading: boolean;

    /**
     * Gets the CDS status again.
     */
    mutate: () => void;
}

/**
 * Hook to get the CDS status of the organization.
 *
 * When the server configuration API is enabled, the status comes from the Identity Server. An error response
 * (for example, the CDS feature is not enabled in the Identity Server) gives `false`. Else, the status is the
 * `cds_enabled` field of the CDS configuration.
 *
 * @param shouldFetch - Should fetch the data.
 * @returns The CDS status, its loading state, and a function to get it again.
 */
const useCDSEnabled = (shouldFetch: boolean = true): UseCDSEnabledReturnInterface => {

    const isServerConfigEnabled: boolean = isCDSServerConfigEnabled();

    const {
        data: serverConfig,
        isLoading: isServerConfigLoading,
        mutate: mutateServerConfig
    } = useCDSServerConfig(shouldFetch && isServerConfigEnabled);

    const {
        data: cdsConfig,
        isLoading: isCDSConfigLoading,
        mutate: mutateCDSConfig
    } = useCDSConfig(shouldFetch && !isServerConfigEnabled);

    if (isServerConfigEnabled) {
        return {
            isEnabled: serverConfig?.enabled ?? false,
            isLoading: isServerConfigLoading,
            mutate: () => {
                mutateServerConfig();
            }
        };
    }

    return {
        isEnabled: cdsConfig?.cds_enabled ?? false,
        isLoading: isCDSConfigLoading,
        mutate: () => {
            mutateCDSConfig();
        }
    };
};

export default useCDSEnabled;
