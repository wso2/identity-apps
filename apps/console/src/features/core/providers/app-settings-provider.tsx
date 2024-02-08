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

import { LocalStorageUtils } from "@wso2is/core/utils";
import React, { PropsWithChildren, ReactElement } from "react";
import AppSettingsContext from "../context/app-settings-context";

/**
 * Props interface of {@link AppSettingsProvider}
 */
export type AppSettingsProviderProps = unknown;

/**
 * Provider for the Application local settings.
 *
 * @param props - Props for the client.
 * @returns App settings provider.
 */
const AppSettingsProvider = (props: PropsWithChildren<AppSettingsProviderProps>): ReactElement => {
    const { children } = props;

    /**
     * Set a value in the local storage.
     * @param key - Key of the setting.
     */
    const setLocalStorageSetting = (key: string, value: string): void => {
        LocalStorageUtils.setValueInLocalStorage(key, value);
    };

    /**
     * Get a value from the local storage.
     * @param key - Key of the setting.
     * @returns Value of the setting.
     */
    const getLocalStorageSetting = (key: string): string => {
        return LocalStorageUtils.getValueFromLocalStorage(key);
    };

    /**
     * Remove a value from the local storage.
     * @param key - Key of the setting.
     */
    const removeLocalStorageSetting = (key: string): void => {
        LocalStorageUtils.clearItemFromLocalStorage(key);
    };

    return (
        <AppSettingsContext.Provider
            value={ {
                getLocalStorageSetting,
                removeLocalStorageSetting,
                setLocalStorageSetting
            } }
        >
            { children }
        </AppSettingsContext.Provider>
    );
};

export default AppSettingsProvider;
