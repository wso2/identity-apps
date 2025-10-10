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

import get from "lodash-es/get";
import merge from "lodash-es/merge";
import React, { PropsWithChildren, ReactElement, useEffect, useState } from "react";
import RuntimeConfigContext from "../contexts/runtime-config-context";

/**
 * Props interface of {@link RuntimeConfigProvider}
 */
export interface RuntimeConfigProviderProps<T> {
    /**
     * Initial runtime configuration.
     */
    initialRuntimeConfig?: T;
}

/**
 * Provider for the Application runtime configuration.
 * This provider reads configuration from the window.__WSO2_IS_RUNTIME_CONFIG__ object.
 * The type of the configuration should be passed as a generic type.
 *
 * @example
 * `<RuntimeConfigProvider<RuntimeConfig> initialRuntimeConfig={ { "updateLevel": "BETA" } }>`
 *
 * @param props - Props for the provider.
 * @returns Runtime config provider.
 */
const RuntimeConfigProvider = <T,>({
    children,
    initialRuntimeConfig
}: PropsWithChildren<RuntimeConfigProviderProps<T>>): ReactElement => {
    const [ runtimeConfigInContext, setRuntimeConfigInContext ] = useState<T>(null);

    /**
     * Set the initial runtime configuration.
     * Load from the window object.
     */
    useEffect(() => {
        const config: T = (window.__WSO2_IS_RUNTIME_CONFIG__ as T) || initialRuntimeConfig || {} as T;

        setRuntimeConfigInContext(config);
    }, [ initialRuntimeConfig ]);

    /**
     * Set the runtime configuration in window object.
     *
     * @example
     * `setRuntimeConfig({ "updateLevel": "STABLE" })`
     *
     * @param configToUpdate - The new configuration to update.
     */
    const setRuntimeConfig = (configToUpdate: Partial<T>): void => {
        const updatedConfig: T = merge({}, runtimeConfigInContext, configToUpdate);

        setRuntimeConfigInContext(updatedConfig);
        window.__WSO2_IS_RUNTIME_CONFIG__ = updatedConfig as typeof window.__WSO2_IS_RUNTIME_CONFIG__;
    };

    /**
     * Get a specific runtime configuration value.
     *
     * @example
     * `getRuntimeConfig("updateLevel")`
     * `getRuntimeConfig("nested.key")`
     *
     * @param key - The key of the configuration to retrieve.
     * @returns The configuration value.
     */
    const getRuntimeConfig = (key: string): unknown => {
        return get(runtimeConfigInContext, key, null);
    };

    /**
     * Get all runtime configuration.
     *
     * @returns All runtime configuration.
     */
    const getAllRuntimeConfig = (): T => runtimeConfigInContext || {} as T;

    return (
        <RuntimeConfigContext.Provider
            value={ {
                getAllRuntimeConfig,
                getRuntimeConfig,
                setRuntimeConfig,
                ...getAllRuntimeConfig()
            } }
        >
            { children }
        </RuntimeConfigContext.Provider>
    );
};

export default RuntimeConfigProvider;
