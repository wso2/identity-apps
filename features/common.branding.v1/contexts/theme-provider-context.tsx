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
import { BrandingPreferenceAPIResponseInterface } from "../models/branding-preferences";

/**
 * Props interface for ThemeProviderContext.
 */
export type ThemeProviderContextProps = {
  /**
   * The theme preferences to be stored in the context.
   */
  themePreference: BrandingPreferenceAPIResponseInterface;
};

/**
* Context object for managing theme preferences.
*/
export const ThemeProviderContext: Context<ThemeProviderContextProps> =
createContext<ThemeProviderContextProps>(undefined);

/**
* Display name for the ThemeProviderContext.
*/
ThemeProviderContext.displayName = "ThemeProviderContext";
