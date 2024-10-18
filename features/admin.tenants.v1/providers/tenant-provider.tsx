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

import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import React, { PropsWithChildren, ReactElement, useEffect, useState } from "react";
import useGetTenants from "../api/use-get-tenants";
import TenantContext from "../context/tenant-context";

/**
 * Props interface of {@link TenantProvider}
 */
export type TenantProviderProps = unknown;

/**
 * This component provides tenant-related context to its children.
 *
 * @param props - Props injected to the component.
 * @returns The TenantProvider component.
 */
const TenantProvider = (props: PropsWithChildren<TenantProviderProps>): ReactElement => {
    const { children } = props;

    const [ isInitialRenderingComplete, setIsInitialRenderingComplete ] = useState<boolean>(false);
    const [ tenantListLimit, setTenantListLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_GRID_ITEM_LIMIT);

    const { data: tenantList, isLoading: isTenantListLoading, mutate: mutateTenantList } = useGetTenants({
        limit: tenantListLimit,
        offset: 0,
        sortBy: "domainName",
        sortOrder: "asc"
    });

    useEffect(() => {
        if (tenantList && tenantList.tenants.length > 0) {
            setIsInitialRenderingComplete(true);
        }
    }, [ tenantList ]);

    return (
        <TenantContext.Provider
            value={ {
                isInitialRenderingComplete,
                isTenantListLoading,
                mutateTenantList,
                setTenantListLimit,
                tenantList,
                tenantListLimit
            } }
        >
            { children }
        </TenantContext.Provider>
    );
};

export default TenantProvider;
