/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../../../../features/core";
import { ApplicationRoleInterface, GroupRoleAssignPayloadInterface } from "../models/application-roles";

/**
 * Initialize an axios Http client.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Get the application roles assigned to the group.
 *
 * @param group - Group name.
 * 
 * @returns A promise containing the response.
 */
export const getAssignedApplicationRolesList = (group: string):Promise<ApplicationRoleInterface[]> => {
    const requestConfig: AxiosRequestConfig = {
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.authzEndpoint }/groups/${ group }/role-mapping`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data.app_roles as ApplicationRoleInterface[]);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Get all the application roles in the organization.
 *
 * @returns A promise containing the response.
 */
export const getAllApplicationRolesList = ():Promise<ApplicationRoleInterface[]> => {
    const requestConfig: AxiosRequestConfig = {
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.authzEndpoint }/roles`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data.app_roles as ApplicationRoleInterface[]);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Update the application roles assigned to the group.
 *
 * @param group - Group name.
 * @param payload - Group role assign payload.
 * 
 * @returns A promise containing the response.
 */
export const updateGroupRoleMapping = (group: string, payload: GroupRoleAssignPayloadInterface):Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        data: payload,
        method: HttpMethods.PATCH,
        url: `${ store.getState().config.endpoints.authzEndpoint }/groups/${ group }/role-mapping`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};
