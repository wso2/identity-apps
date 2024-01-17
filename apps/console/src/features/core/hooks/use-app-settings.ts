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

import { useContext } from "react";
import AppSettingsContext, { AppSettingsContextProps } from "../context/app-settings-context";

/**
 * Props interface of {@link UseAppSettings}
 */
export type UseAppSettingsInterface = AppSettingsContextProps;

/**
 * Hook that provides access to the local App settings context.
 * @returns An object containing the context values of {@link AppSettingsContext}.
 */
const useAppSettings = (): UseAppSettingsInterface => {
    const context: AppSettingsContextProps = useContext(AppSettingsContext);

    if (context === undefined) {
        throw new Error("useAppSettings must be used within a AppSettingsProvider");
    }

    return context;
};

export default useAppSettings;
