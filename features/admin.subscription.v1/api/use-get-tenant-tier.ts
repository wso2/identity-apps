/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { Config } from "@wso2is/admin.core.v1/configs/app";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { AppState, store } from "@wso2is/admin.core.v1/store";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { HttpMethods } from "@wso2is/core/models";
import { useSelector } from "react-redux";
import { TenantTierRequestResponse } from "../models/tenant-tier";

/**
 * Hook to get the tier of a tenant.
 *
 * @returns SWR response object containing the data, error, isValidating, mutate.
 */
const useGetTenantTier = <Data = TenantTierRequestResponse,
    Error = RequestErrorInterface> (): RequestResultInterface<Data, Error> => {

    const organizationType: OrganizationType = useSelector((state: AppState) => state.organization.organizationType);
    const tenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.tenantSubscriptionApi }/tier?domain=${ tenantDomain }`
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(
        organizationType === OrganizationType.FIRST_LEVEL_ORGANIZATION
        && Config.getDeploymentConfig().extensions?.subscriptionApiPath
            ? requestConfig
            : null,
        {
            shouldRetryOnError: false
        }
    );

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate: mutate
    };
};

export default useGetTenantTier;
