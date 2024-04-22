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

import { DecodedIDTokenPayload, useAuthContext } from "@asgardeo/auth-react";
import { AllFeatureInterface } from "@wso2is/access-control";
import { HttpMethods } from "@wso2is/core/models";
import { OrganizationType } from "features/admin.organizations.v1/constants";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useRequest, {
    RequestErrorInterface,
    RequestResultInterface
} from "../../../../admin.core.v1/hooks/use-request";
import { AppState, store } from "../../../../admin.core.v1/store";

/**
 * Hook to get the all features of the organization.
 *
 * @returns The response of all features.
 */
export const useGetAllFeatures = <
    Data = AllFeatureInterface[],
    Error = RequestErrorInterface
>(): RequestResultInterface<Data, Error> => {
    const [ orgIdentifier, setOrgIdentifier ] = useState<string>();
    const { getDecodedIDToken } = useAuthContext();

    const organizationType: OrganizationType = useSelector(
        (state: AppState) => state.organization.organizationType
    );

    // TODO: Remove this config once the deployment issues are sorted out.
    const isFeatureGateEnabled: boolean = useSelector((state: AppState) => state?.config?.ui?.isFeatureGateEnabled);
    const shouldSendRequest : string = isFeatureGateEnabled && orgIdentifier;

    useEffect(() => {
        if (
            organizationType === OrganizationType.SUPER_ORGANIZATION
            || organizationType === OrganizationType.FIRST_LEVEL_ORGANIZATION
        ) {
            getDecodedIDToken().then((response: DecodedIDTokenPayload)=>{
                const orgName: string = response.org_name;
                // Set org_name instead of org_uuid as the API expects org_name
                // as it resolves tenant uuid from it.

                if (orgName !== orgIdentifier) {
                    setOrgIdentifier(orgName);
                }

            });
        } else {
            // Using the organization id, if the current organization is a suborganization.
            if (orgIdentifier !== store.getState().organization.organization.id) {
                setOrgIdentifier(store.getState().organization.organization.id);
            }
        }
    }, [ organizationType ]);

    const requestConfig: any = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: shouldSendRequest
            ? `${store?.getState()?.config?.endpoints?.allFeatures?.replace("{org-uuid}", orgIdentifier)}`
            : ""
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig, {
        shouldRetryOnError: false
    });

    return {
        data,
        error: error,
        isLoading: !data && !error,
        isValidating,
        mutate
    };
};
