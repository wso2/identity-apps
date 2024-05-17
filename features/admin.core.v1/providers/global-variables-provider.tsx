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

import React from "react";
import GlobalVariablesContext, { GlobalVariablesContextInterface, defaultValues }
    from "../context/global-variables-context";

/**
 * Properties for the GlobalVariablesProvider component.
 */
interface GlobalProviderProps {
  /** Partial values to override the default global variables. */
  value?: Partial<GlobalVariablesContextInterface>;
  /** The child components to be wrapped by the provider. */
  children: React.ReactNode;
}

/**
 * Provides a context provider for global variables.
 *
 * @param value - Partial values to override the default global variables.
 * @param children - The child components to be wrapped by the provider.
 */
const GlobalVariablesProvider: React.FC<GlobalProviderProps> = ({ children, value = {} }: GlobalProviderProps) => {
    const mergedValues: GlobalVariablesContextInterface = {
        ...defaultValues,
        ...value
    };

    return <GlobalVariablesContext.Provider value={ mergedValues }>{ children }</GlobalVariablesContext.Provider>;
};

export default GlobalVariablesProvider;
