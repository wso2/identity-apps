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

import { RequestErrorInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import useSWR, { KeyedMutator } from "swr";
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
     * CDS configuration data
     */
    data: CDSConfig;

    /**
     * Is the config being fetched
     */
    isLoading: boolean;

    /**
     * Is the config being revalidated
     */
    isValidating: boolean;

    /**
     * Error if any
     */
    error: RequestErrorInterface;

    /**
     * Mutate/refetch the config
     */
    mutate: KeyedMutator<CDSConfig>;
}

/**
 * Hook to fetch CDS configuration.
 *
 * @param shouldFetch - Should fetch the data.
 * @returns Hook return object containing data, error, isLoading, isValidating, mutate.
 */
const useCDSConfig = (shouldFetch: boolean = true): UseCDSConfigReturn => {

    const { data, error, isLoading, isValidating, mutate } = useSWR<CDSConfig, RequestErrorInterface>(
        shouldFetch ? "cds-config" : null,
        () => fetchCDSConfig(),
        { shouldRetryOnError: false }
    );

    console.log("CDS config data: ", data);
    
    return {
        data: data ?? DEFAULT_CDS_CONFIG,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useCDSConfig;
