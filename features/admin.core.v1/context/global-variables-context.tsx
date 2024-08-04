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

import { Context, createContext } from "react";

/**
 * Interface representing the shape of the global variables context.
 */
export interface GlobalVariablesContextInterface {
  /** Indicates whether adaptive authentication is available. */
  isAdaptiveAuthenticationAvailable: boolean;
  /** Indicates whether organization management is enabled. */
  isOrganizationManagementEnabled: boolean;
}

/**
 * Default values for the global variables context.
 */
export const defaultValues: GlobalVariablesContextInterface = {
    isAdaptiveAuthenticationAvailable: true,
    isOrganizationManagementEnabled: true
};

/**
 * Context for managing global variables.
 */
const GlobalVariablesContext: Context<GlobalVariablesContextInterface> =
  createContext<GlobalVariablesContextInterface>(defaultValues);

export default GlobalVariablesContext;
