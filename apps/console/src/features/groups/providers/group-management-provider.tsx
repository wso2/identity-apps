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
import GroupManagementContext from "../context/group-management-context";

/**
 * Props interface for the Group management provider.
 */
export type GroupManagementProviderProps = PropsWithChildren;

/**
 * React context provider for the group management context.
 * This provider must be added at the root of the features to make the context available throughout the feature.
 *
 * @example
 * <GroupManagementProvider>
 *    <Feature />
 * </GroupManagementProvider>
 *
 * @param props - Props injected to the component.
 * @returns Group management context instance.
 */
const GroupManagementProvider: FunctionComponent<GroupManagementProviderProps> = (
    props: GroupManagementProviderProps
): ReactElement => {
    const { children } = props;
    const [ activeTab, setActiveTab ] = useState<number>(0);

    return (
        <GroupManagementContext.Provider
            value={ {
                activeTab,
                updateActiveTab: setActiveTab
            } }
        >
            { children }
        </GroupManagementContext.Provider>
    );
};

export default GroupManagementProvider;
