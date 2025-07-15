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
import {
    AuthorizedAPIListItemInterface,
    AuthorizedPermissionListItemInterface
} from "../models/api-authorization";

/**
 * Props interface for ApplicationManagementContext.
 */
export interface ApplicationManagementContextProps {
    /**
     * API scopes for the application.
     */
    apiScopes: string;
    /**
     * User scopes for the application.
     */
    userScopes: string;
    /**
     * Update API scopes.
     * @param scopes - API scopes names.
     */
    updateApiScopes: (scopes: string) => void;
    /**
     * Update user scopes.
     * @param scopes - User scopes names.
     */
    updateUserScopes: (scopes: string) => void;
    /**
     * All authorized scopes from API authorization.
     */
    allAuthorizedScopes: AuthorizedPermissionListItemInterface[];
    /**
     * Subscribed API resources list data.
     */
    subscribedAPIResourcesListData: AuthorizedAPIListItemInterface[];
    /**
     * Loading state for subscribed API resources list.
     */
    isSubscribedAPIResourcesListLoading: boolean;
    /**
     * Error from subscribed API resources fetch request.
     */
    subscribedAPIResourcesFetchRequestError: any;
    /**
     * Mutate subscribed API resources list.
     */
    mutateSubscribedAPIResourcesList: () => void;
    /**
     * Bulk change all authorized scopes.
     * @param updatedScopes - Updated scopes.
     * @param removed - Whether scopes are being removed.
     */
    bulkChangeAllAuthorizedScopes: (updatedScopes: AuthorizedPermissionListItemInterface[], removed: boolean) => void;
}

/**
 * Context object for managing applications.
 */
const ApplicationManagementContext: Context<ApplicationManagementContextProps> =
    createContext< null | ApplicationManagementContextProps >(null);

/**
 * Display name for the ApplicationManagementContext.
 */
ApplicationManagementContext.displayName = "ApplicationManagementContext";

export default ApplicationManagementContext; 