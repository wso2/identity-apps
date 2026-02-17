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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { fetchCDSConfig } from "../api/config";
import type { CDSConfig } from "../models/config";

/**
 * Default CDS configuration
 */
const DEFAULT_CDS_CONFIG: CDSConfig = {
    cds_enabled: false,
    system_applications: []
};

/**
 * Hook return type
 */
export interface UseCDSConfigReturn {
    /**
     * CDS configuration data (always non-null, defaults to cds_enabled: false)
     */
    config: CDSConfig;

    /**
     * Is the config being fetched
     */
    isLoading: boolean;

    /**
     * Error if any
     */
    error: string | null;

    /**
     * Fetch the config
     */
    fetchConfig: () => Promise<void>;

    /**
     * Refetch the config
     */
    refetch: () => Promise<void>;
}

/**
 * Hook options
 */
export interface UseCDSConfigOptions {
    /**
     * Should fetch on mount
     */
    fetchOnMount?: boolean;

    /**
     * Success callback
     */
    onSuccess?: (config: CDSConfig) => void;

    /**
     * Error callback
     */
    onError?: (error: string) => void;

    /**
     * Show alerts on error
     */
    showAlerts?: boolean;
}

/**
 * Hook to fetch CDS configuration
 *
 * @param options - Hook options
 * @returns Hook return object
 */
export const useCDSConfig = (options?: UseCDSConfigOptions): UseCDSConfigReturn => {
    const {
        fetchOnMount = true,
        onSuccess,
        onError,
        showAlerts = true
    } = options ?? {};

    const dispatch: Dispatch = useDispatch();

    const [ config, setConfig ] = useState<CDSConfig>(DEFAULT_CDS_CONFIG);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | null>(null);

    /**
     * Fetch the CDS config
     */
    const fetchConfig: () => Promise<void> = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const response: CDSConfig = await fetchCDSConfig();

            setConfig(response);
            onSuccess?.(response);
        } catch (err) {
            const errorMessage: string = err instanceof IdentityAppsApiException
                ? err.message
                : "An error occurred while fetching the CDS configuration";

            setError(errorMessage);
            onError?.(errorMessage);

            // Set default config on error to ensure routes work
            setConfig(DEFAULT_CDS_CONFIG);

            if (showAlerts) {
                dispatch(
                    addAlert({
                        description: errorMessage,
                        level: AlertLevels.ERROR,
                        message: "Error fetching CDS configuration"
                    })
                );
            }
        } finally {
            setIsLoading(false);
        }
    }, [ dispatch, onSuccess, onError, showAlerts ]);

    /**
     * Fetch config on mount if enabled
     */
    useEffect(() => {
        if (fetchOnMount) {
            fetchConfig();
        }
    }, [ fetchOnMount, fetchConfig ]);

    return {
        config,
        error,
        fetchConfig,
        isLoading,
        refetch: fetchConfig
    };
};
