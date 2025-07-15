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

import React, { FunctionComponent, PropsWithChildren, ReactElement, useState } from "react";
import ApplicationManagementContext from "../context/application-management-context";
import { useAPIAuthorization } from "../hooks/use-application-api-authorization";

/**
 * Props interface for the Application management provider.
 */
export interface ApplicationManagementProviderProps extends PropsWithChildren {
    /**
     * Application ID for API authorization.
     */
    appId: string;
}

/**
 * React context provider for the application management context.
 * This provider must be added at the root of the features to make the context available throughout the feature.
 *
 * @example
 * <ApplicationManagementProvider appId="app-123">
 *    <Feature />
 * </ApplicationManagementProvider>
 *
 * @param props - Props injected to the component.
 * @returns Application management context instance.
 */
const ApplicationManagementProvider: FunctionComponent<ApplicationManagementProviderProps> = (
    props: ApplicationManagementProviderProps
): ReactElement => {
    const { children, appId } = props;
    const [ apiScopes, setApiScopes ] = useState<string>("");
    const [ userScopes, setUserScopes ] = useState<string>("");

    const updateApiScopes = (scopes: string): void => {
        setApiScopes(scopes);
    };

    // Use the API authorization hook
    const {
        allAuthorizedScopes,
        subscribedAPIResourcesListData,
        isSubscribedAPIResourcesListLoading,
        subscribedAPIResourcesFetchRequestError,
        mutateSubscribedAPIResourcesList,
        bulkChangeAllAuthorizedScopes
    } = useAPIAuthorization(appId, updateApiScopes);

    const updateUserScopes = (scopes: string): void => {
        setUserScopes(scopes);
    };

    return (
        <ApplicationManagementContext.Provider
            value={ {
                apiScopes,
                userScopes,
                updateApiScopes,
                updateUserScopes,
                allAuthorizedScopes,
                subscribedAPIResourcesListData,
                isSubscribedAPIResourcesListLoading,
                subscribedAPIResourcesFetchRequestError,
                mutateSubscribedAPIResourcesList,
                bulkChangeAllAuthorizedScopes
            } }
        >
            { children }
        </ApplicationManagementContext.Provider>
    );
};

export default ApplicationManagementProvider;
