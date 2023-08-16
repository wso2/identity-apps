/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { HttpMethods } from "@wso2is/core/models";
import { useSelector } from "react-redux";
import useRequest, {
    RequestErrorInterface,
    RequestResultInterface
} from "../../../../features/core/hooks/use-request";
import { AppState, store } from "../../../../features/core/store";
import { AllFeatureInterface } from "../models/feature-gate";

/**
 * Hook to get the all features of the organization.
 *
 * @param org_id - Organization ID.
 * @param isAuthenticated - Is user authenticated.
 * @returns The response of all features.
 */
export const useGetAllFeatures = <Data = AllFeatureInterface[], Error = RequestErrorInterface>(
    org_id: string,
    isAuthenticated: boolean
): RequestResultInterface<Data, Error> => {

    // TODO: Remove this config once the deployment issues are sorted out.
    const isFeatureGateEnabled: boolean = useSelector((state: AppState) => state?.config?.ui?.isFeatureGateEnabled);
    const shouldSendRequest : string = isAuthenticated && isFeatureGateEnabled && org_id;

    const requestConfig: any = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: shouldSendRequest ? `${store.getState().config.endpoints.allFeatures.replace("{org-uuid}", org_id)}` : ""
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
