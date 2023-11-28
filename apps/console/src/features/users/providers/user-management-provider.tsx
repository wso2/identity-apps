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

import React, { FunctionComponent, PropsWithChildren, ReactElement, useState } from "react";
import UserManagementContext from "../context/user-management-context";

/**
 * Props interface for the User management provider.
 */
export type UserManagementProviderProps = PropsWithChildren;

/**
 * React context provider for the user management context.
 * This provider must be added at the root of the features to make the context available throughout the feature.
 *
 * @example
 * <UserManagementProvider>
 *    <Feature />
 * </UserManagementProvider>
 *
 * @param props - Props injected to the component.
 * @returns User management context instance.
 */
const UserManagementProvider: FunctionComponent<UserManagementProviderProps> = (
    props: UserManagementProviderProps
): ReactElement => {
    const { children } = props;
    const [ activeTab, setActiveTab ] = useState<number>(0);

    return (
        <UserManagementContext.Provider
            value={ {
                activeTab,
                updateActiveTab: setActiveTab
            } }
        >
            { children }
        </UserManagementContext.Provider>
    );
};

export default UserManagementProvider;
