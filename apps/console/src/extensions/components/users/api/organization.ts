/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosRequestConfig } from "axios";
import useRequest, { 
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface,
    SWRConfig 
} from "../../../../features/core/hooks/use-request";
import { store } from "../../../../features/core/store";
import { OrganizationInterface } from "../../users/models/organization";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Hook to get enterprise login enable config.
 *
 * @param {string} organization - Organization name.
 * @param {boolean} revalidateIfStale - Revalidate if stale.
 *
 * @returns {RequestResultInterface<Data, Error>}
 */
export const useOrganizationConfig =
    <Data = OrganizationInterface, Error = RequestErrorInterface> 
    (organization: string, requestOptions: SWRConfig<Data, Error>): RequestResultInterface<Data, Error> => {

        const requestConfig: RequestConfigInterface = {
            headers: {
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            url: store.getState().config.endpoints.organizationEndpoint.replace("{organization}", organization)
        };

        const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig, requestOptions);

        return {
            data,
            error: error,
            isLoading: !error && !data,
            isValidating,
            mutate: mutate
        };
    };

/**
 * Hook to update enterprise login enable config.
 *
 * @param {OrganizationInterface} isEnterpriseLoginEnabled - Enterpriselogin is enabled/disabled.
 * 
 * @return {Promise<any>} A promise containing the response.
 */
export const updateOrganizationConfig = (isEnterpriseLoginEnabled: OrganizationInterface): Promise<any> => {
    
    const requestConfig: AxiosRequestConfig = {
        data: isEnterpriseLoginEnabled,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.organizationPatchEndpoint
    };

    return httpClient(requestConfig).then((response) => {
        return Promise.resolve(response);
    }).catch((error) => {
        return Promise.reject(error);
    });
};
