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

import { HttpMethods } from "@wso2is/core/models";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../admin.core.v1/hooks/use-request";
import { store } from "../../admin.core.v1/store";
import { OrganizationDiscoveryConfigConstants } from "../constants/organization-discovery-config-constants";
import {
    OrganizationDiscoveryConfigInterface,
    OrganizationDiscoveryConfigPropertyInterface
} from "../models/organization-discovery";

/**
 * Hook to get the organization discovery config.
 *
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isValidating, mutate.
 */
const useGetOrganizationDiscoveryConfig = <
    Data = OrganizationDiscoveryConfigInterface & { isOrganizationDiscoveryEnabled: boolean },
    Error = RequestErrorInterface
>(shouldFetch: boolean = true): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.organizations}/organization-configs/discovery`
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldFetch ? requestConfig : null, {
        shouldRetryOnError: false
    });

    let isOrganizationDiscoveryEnabled: boolean = false;

    if ((data as OrganizationDiscoveryConfigInterface)?.properties) {
        (data as OrganizationDiscoveryConfigInterface).properties?.forEach(
            (property: OrganizationDiscoveryConfigPropertyInterface) => {
                if (property.key === "emailDomain.enable") {
                    isOrganizationDiscoveryEnabled = true;
                }
            }
        );
    }

    if ((error?.response?.data as any)?.code
        === OrganizationDiscoveryConfigConstants.ORGANIZATION_DISCOVERY_DOMAINS_NOT_CONFIGURED_ERROR_CODE) {

        isOrganizationDiscoveryEnabled = false;

        return {
            data: {
                isOrganizationDiscoveryEnabled,
                ...data
            },
            error,
            isLoading: !error && !data,
            isValidating,
            mutate
        };
    }

    return {
        data: {
            isOrganizationDiscoveryEnabled,
            ...data
        },
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

export default useGetOrganizationDiscoveryConfig;
