/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { HttpMethods } from "@wso2is/core/models";
import { store } from "../../../../core/store";
import useRequest, { RequestErrorInterface, RequestResultInterface } from "../../../../core/hooks/use-request";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance());
 
/**
  * Interface to store data for create group api.
  */
 export interface UserInviteInterface {
     id?: string;
     roles?: string[];
     email?: string;
     status?: InviteUserStatus;
     expiredAt?: string;
     username?: string;
 }
 
 /**
  * Interface to store invitations list.
  */
 export interface InvitationsInterface {
     invitations?: UserInviteInterface[];
 }

 /**
 * Enum for Invite User Status.
 *
 * @readonly
 */
export enum InviteUserStatus {
    PENDING = "PENDING",
    EXPIRED = "EXPIRED"
}

/* Enum for invitation status types.
*
* @readonly
*/
export enum InvitationStatus {
   ACCEPTED = "Accepted",
   PENDING = "Pending",
   EXPIRED = "Expired"
}

/**
 * Hook to get the parent org user invites list.
 */
export const useParentOrgUserInvitesList = <Data = InvitationsInterface,
    Error = RequestErrorInterface>(): RequestResultInterface<Data, Error> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.guestsList
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate: mutate
    };
};

export const sendParentOrgUserInvite = (userInvite: UserInviteInterface): Promise<any> => {
    debugger;
    const requestConfig: AxiosRequestConfig = {
        data: userInvite,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.guests  
    };

    return httpClient(requestConfig).then((response: AxiosResponse) => {
        console.log("Response", response)
        return Promise.resolve(response);
    }).catch((error: AxiosError) => {
        debugger;
        console.log("error", error);
        return Promise.reject(error);
    });
};

/**
 * Delete the parent org user invites list.
 */
export const deleteParentOrgInvite = (traceID: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.guestsList + "/" + traceID
    };

    return httpClient(requestConfig).then((response: AxiosResponse) => {
        return Promise.resolve(response);
    }).catch((error: AxiosError) => {
        return Promise.reject(error);
    });
};
