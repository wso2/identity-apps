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

import React, { ReactNode, useEffect, useState } from "react";
import { getAppUtils } from "../hooks/get-app-utils";

/**
 * Props for the AppUtilsProvider component.
 */
interface AppUtilsProviderProps {
  accountAppOrigin: string;
  contextPath: string;
  isAdaptiveAuthenticationAvailable: boolean;
  isOrganizationManagementEnabled: boolean;
  serverOrigin: string;
  superTenant: string;
  tenantPrefix: string;
  children: ReactNode;
}

/**
 * Initializes AppUtils and provides the children components once the configuration is loaded.
 *
 * @param props - The props for the AppUtilsProvider component.
 * @returns The AppUtilsProvider component.
 */
export const AppUtilsProvider: React.FC<AppUtilsProviderProps> = ({
    accountAppOrigin,
    contextPath,
    isAdaptiveAuthenticationAvailable,
    isOrganizationManagementEnabled,
    serverOrigin,
    superTenant,
    tenantPrefix,
    children
}: AppUtilsProviderProps) => {
    const [ isConfigLoaded, setIsConfigLoaded ] = useState<boolean>(false);

    useEffect(() => {
        const loadConfig = async (): Promise<void> => {
            try {
                window["AppUtils"] = getAppUtils({
                    accountAppOrigin,
                    contextPath,
                    isAdaptiveAuthenticationAvailable,
                    isOrganizationManagementEnabled,
                    serverOrigin,
                    superTenant,
                    tenantPrefix
                });
                setIsConfigLoaded(true);
            } catch (error) {
                throw new Error("Deployment config not found in public folder");
            }
        };

        loadConfig();
    }, [ contextPath ]);

    if (!isConfigLoaded) {
        return <div>Loading configuration...</div>;
    }

    return (
        <>{ children }</>
    );
};
