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

import { Context, createContext } from "react";
import { RuntimeConfigInterface } from "../models/runtime-config";

/**
 * Props interface of {@link RuntimeConfigContext}
 */
export type RuntimeConfigContextProps<T = RuntimeConfigInterface> = {
    /**
     * Function to retrieve a runtime configuration value.
     * @param key - The key of the configuration to retrieve.
     * @returns The configuration value.
     */
    getRuntimeConfig: (key: string) => unknown;
    /**
     * Function to update runtime configuration.
     * @param configToUpdate - The new configuration to update.
     */
    setRuntimeConfig: (configToUpdate: Partial<T>) => void;
    /**
     * Function to get all runtime configuration.
     * @returns All runtime configuration.
     */
    getAllRuntimeConfig: () => T;
} & T;

/**
 * Context object for managing the Runtime Configuration.
 */
const RuntimeConfigContext: Context<RuntimeConfigContextProps<any>> =
    createContext<null | RuntimeConfigContextProps<any>>(null);

/**
 * Display name for the RuntimeConfigContext.
 */
RuntimeConfigContext.displayName = "RuntimeConfigContext";

export default RuntimeConfigContext;
