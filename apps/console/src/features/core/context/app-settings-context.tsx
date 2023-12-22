/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
 * Props interface of {@link AppSettingsContext}
 */
export interface AppSettingsContextProps {
  /**
   * Get the local storage setting value.
   * @param key - Key of the setting.
   * @returns Value of the setting.
   */
  getLocalStorageSetting: (key: string) => string;
  /**
   * Remove a value from the local storage.
   * @param key - Key of the setting.
   */
  removeLocalStorageSetting: (key: string) => void;
  /**
   * Get the local storage setting value.
   * @param key - Key of the setting.
   * @param value - Value of the setting.
   */
  setLocalStorageSetting: (key: string, value: string) => void;
}

/**
 * Context object for managing the Application local settings.
 */
const AppSettingsContext: Context<AppSettingsContextProps> =
  createContext<null | AppSettingsContextProps>(null);

/**
 * Display name for the AppSettingsContext.
 */
AppSettingsContext.displayName = "AppSettingsContext";

export default AppSettingsContext;
