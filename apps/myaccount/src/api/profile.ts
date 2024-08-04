/**
 * Copyright (c) 2019-2024, WSO2 LLC. (https://www.wso2.com).
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

import { AsgardeoSPAClient, HttpError, HttpInstance, HttpRequestConfig, HttpResponse } from "@asgardeo/auth-react";
import { ProfileConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { PatchOperationRequest, ProfileInfoInterface, ProfileSchemaInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import axios, { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import { Config } from "../configs";
import { AppConstants } from "../constants";
import { history } from "../helpers";
import { BasicProfileInterface, HttpMethods, ReadOnlyUserStatus } from "../models";
import { store } from "../store";
import { toggleSCIMEnabled } from "../store/actions";

/**
 * Get an axios instance.
 */
const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Retrieve the user information of the currently authenticated user.
 *
 * @returns - a promise containing the response.
 */
export const getUserInfo = (): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.user
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error(`Failed get user info from:
                ${store.getState().config.endpoints.user}`));
            }

            return Promise.resolve(response);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieve the user read only status of the currently authenticated user.
 *
 * @returns - a promise containing the response.
 */
export const getUserReadOnlyStatus = (): Promise<ReadOnlyUserStatus> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: Config.getServiceResourceEndpoints().isReadOnlyUser
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(`Failed get user read only status from:
                ${store.getState().config.endpoints.user}`)
                );
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Get gravatar image using email address.
 *
 * @param email - Email address.
 */
export const getGravatarImage = (email: string): Promise<string> => {
    if (isEmpty(email)) {
        return Promise.reject("Email is null");
    } else {
        const url: string = CommonUtils.getGravatar(email);

        return new Promise((resolve: (value: string | PromiseLike<string>) => void, reject: (reason?: any) => void) => {
            axios
                .get(url)
                .then(() => {
                    resolve(url.split("?")[0]);
                })
                .catch((error: HttpError) => {
                    reject(error);
                });
        });
    }
};

/**
 * Retrieve the user profile details of the currently authenticated user.
 *
 * @returns - a promise containing the user profile details.
 */
export const getProfileInfo = (): Promise<BasicProfileInterface> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/scim+json"
        },
        method: HttpMethods.GET,
        url: store.getState().config?.endpoints?.me
    };

    return httpClient(requestConfig)
        .then(async (response: HttpResponse) => {

            if (response.status !== 200) {
                return Promise.reject(new Error(`Failed get user profile info from:
                ${store.getState().config.endpoints.me}`));
            }

            const profileResponse: BasicProfileInterface = {
                emails: response.data.emails || "",
                name: response.data.name || { familyName: "", givenName: "" },
                pendingEmails: response.data[ProfileConstants.SCIM2_ENT_USER_SCHEMA]
                    ? response.data[ProfileConstants.SCIM2_ENT_USER_SCHEMA].pendingEmails
                    : [],
                phoneNumbers: response.data.phoneNumbers || [],
                profileUrl: response.data.profileUrl || "",
                responseStatus: response.status || null,
                roles: response.data.roles || [],
                // TODO: Validate if necessary.
                userImage: response.data.userImage || response.data.profileUrl || "",
                ...response.data,
                userName: response.data.userName || ""
            };

            return Promise.resolve(profileResponse);
        })
        .catch((error: HttpError) => {
            // Check if the API responds with a `500` error, if it does,
            // navigate the user to the login error page.
            if (
                error.response &&
                error.response.data &&
                error.response.data.status &&
                error.response.data.status === "500"
            ) {
                store.dispatch(toggleSCIMEnabled(false));

                // Navigate to login error page.
                history.push(AppConstants.getPaths().get("LOGIN_ERROR"));
            }

            return Promise.reject(error);
        });
};

/**
 * Update the required details of the user profile.
 *
 * @param info - The user profile details to be updated.
 *
 * @returns - a promise containing the response.
 */
export const updateProfileInfo = (info: Record<string, unknown>): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        data: info,
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.me
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(`Failed update user profile info with: ${store.getState().config.endpoints.me}`)
                );
            }

            return Promise.resolve(response);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Update the logged in user's profile image URL.
 *
 * @param url - Image URL.
 *
 * @returns - Updated profile info as a Promise.
 */
export const updateProfileImageURL = (url: string): Promise<ProfileInfoInterface> => {
    const data: PatchOperationRequest<{profileUrl: string}> = {
        Operations: [
            {
                op: "replace",
                value: {
                    profileUrl: url
                }
            }
        ],
        schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
    };

    return updateProfileInfo(data as Record <string, any>);
};

/**
 * Retrieve the profile schemas of the user claims of the currently authenticated user.
 *
 * @returns - Array of profile schemas as a Promise.
 */
export const getProfileSchemas = (): Promise<ProfileSchemaInterface[]> => {

    const requestConfig: HttpRequestConfig = {
        headers: {
            "Accept": "application/json"
        },
        method: HttpMethods.GET,
        url: Config.getServiceResourceEndpoints().profileSchemas
    };
    const schemaAttributes: ProfileSchemaInterface[] = [];

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ProfileConstants.SCHEMA_FETCH_REQUEST_INVALID_RESPONSE_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            // Retrieve the attributes from all the available resources, and if the
            // attribute belongs to an schema extension the boolean extended will be
            // appended to the attribute object.
            response.data.map((schema:{attributes: ProfileSchemaInterface[], id: string}) => {
                schema.attributes.map((attribute: ProfileSchemaInterface) => {
                    if (schema.id !== ProfileConstants.SCIM2_CORE_USER_SCHEMA) {
                        const modifiedSubAttributes: ProfileSchemaInterface[] = [];

                        if(attribute.type === "COMPLEX") {
                            attribute.subAttributes.map((subAttribute: ProfileSchemaInterface) => {
                                modifiedSubAttributes.push({ ...subAttribute,  extended: true, schemaId: schema.id });
                            }
                            );
                            attribute.subAttributes = modifiedSubAttributes;
                        }
                        schemaAttributes.push({ ...attribute, extended: true, schemaId: schema.id });

                        return;
                    }
                    schemaAttributes.push(attribute);
                });
            });

            return Promise.resolve(schemaAttributes as ProfileSchemaInterface[]);
        })
        .catch((error: HttpError) => {
            throw new IdentityAppsApiException(
                ProfileConstants.SCHEMA_FETCH_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
