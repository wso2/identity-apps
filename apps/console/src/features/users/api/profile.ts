/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { ProfileConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods, ProfileInfoInterface, ProfileSchemaInterface } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { store } from "../../core/store";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Retrieve the user profile details of the currently authenticated user.
 *
 * @param {string} endpoint - Me endpoint absolute path.
 * @param {string} clientOrigin - Tenant qualified client origin.
 * @param {() => void} onSCIMDisabled - Callback to be fired if SCIM is disabled for the user store.
 * @returns {Promise<ProfileInfoInterface>} Profile information as a Promise.
 * @throws {IdentityAppsApiException}
 */
export const getProfileInfo = (endpoint: string,
    clientOrigin: string,
    onSCIMDisabled?: () => void): Promise<ProfileInfoInterface> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/scim+json"
        },
        method: HttpMethods.GET,
        url: endpoint
    };

    return httpClient(requestConfig)
        .then(async (response: AxiosResponse) => {

            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ProfileConstants.PROFILE_INFO_FETCH_REQUEST_INVALID_RESPONSE_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            const profileResponse: ProfileInfoInterface = {
                emails: response.data.emails || "",
                name: response.data.name || { familyName: "", givenName: "" },
                phoneNumbers: response.data.phoneNumbers || [],
                profileUrl: response.data.profileUrl || "",
                responseStatus: response.status || null,
                roles: response.data.roles || [],
                // TODO: Validate if necessary.
                userImage: response.data.userImage || response.data.profileUrl,
                userName: response.data.userName || "",
                ...response.data
            };

            return Promise.resolve(profileResponse);
        })
        .catch((error: AxiosError) => {
            // Check if the API responds with a `500` error, if it does,
            // navigate the user to the login error page.
            if (error.response
                && error.response.data
                && error.response.data.status
                && error.response.data.status === "500") {

                // Fire `onSCIMDisabled` callback which will navigate the
                // user to the corresponding error page.
                onSCIMDisabled && onSCIMDisabled();
            }

            throw new IdentityAppsApiException(
                ProfileConstants.PROFILE_INFO_FETCH_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Update the required details of the user profile.
 *
 * @param {object} info - Information that needs to ber updated.
 * @return {Promise<ProfileInfoInterface>} Updated profile info as a Promise.
 * @throws {IdentityAppsApiException}
 */
export const updateProfileInfo = (info: Record<string, unknown>): Promise<ProfileInfoInterface> => {

    const requestConfig = {
        data: info,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/scim+json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.me
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ProfileConstants.PROFILE_INFO_UPDATE_REQUEST_INVALID_RESPONSE_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ProfileConstants.PROFILE_INFO_UPDATE_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Update the logged in user's profile image URL.
 *
 * @param {string} url - Image URL.
 * @return {Promise<ProfileInfoInterface>} Updated profile info as a Promise.
 * @throws {IdentityAppsApiException}
 */
export const updateProfileImageURL = (url: string): Promise<ProfileInfoInterface> => {
    const data = {
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

    return updateProfileInfo(data);
};

/**
 * Retrieve the profile schemas of the user claims of the currently authenticated user.
 *
 * @return {Promise<ProfileSchemaInterface[]>} Array of profile schemas as a Promise.
 * @throws {IdentityAppsApiException}
 */
export const getProfileSchemas = (): Promise<ProfileSchemaInterface[]> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.schemas
    };
    const schemaAttributes: ProfileSchemaInterface[] = [];

    return httpClient(requestConfig)
        .then((response) => {
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
            response.data.map((schema) => {
                schema.attributes.map((attribute) => {
                    if (schema.id !== ProfileConstants.SCIM2_CORE_USER_SCHEMA) {
                        const modifiedSubAttributes = [];

                        if(attribute.type === "COMPLEX") {
                            attribute.subAttributes.map((subAttribute) => {
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
        .catch((error) => {
            throw new IdentityAppsApiException(
                ProfileConstants.SCHEMA_FETCH_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
