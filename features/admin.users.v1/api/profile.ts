/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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
import { Config } from "@wso2is/admin.core.v1/configs/app";
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { ProfileConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import {
    HttpMethods,
    ProfileInfoInterface,
    ProfileSchemaInterface,
    SchemaResponseInterface
} from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { AttributeDataType } from "../constants";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Retrieve the user profile details of the currently authenticated user.
 *
 * @param endpoint - Me endpoint absolute path.
 * @param clientOrigin - Tenant qualified client origin.
 * @param onSCIMDisabled - Callback to be fired if SCIM is disabled for the user store.
 * @returns  Profile information as a Promise.
 * @throws IdentityAppsApiException - If an error occurs while retrieving the profile information.
 */
export const getProfileInfo = (endpoint: string,
    clientOrigin: string,
    onSCIMDisabled?: () => void): Promise<ProfileInfoInterface> => {

    const requestConfig: RequestConfigInterface = {
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
 * @param info - Information that needs to ber updated.
 * @returns  Updated profile info as a Promise.
 * @throws IdentityAppsApiException - If an error occurs while updating the profile info.
 */
export const updateProfileInfo = (info: Record<string, unknown>): Promise<ProfileInfoInterface> => {

    const requestConfig: RequestConfigInterface = {
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
 * @param url - Image URL.
 * @returns Updated profile info as a Promise.
 * @throws IdentityAppsApiException - If an error occurs while updating the profile image URL.
 */
export const updateProfileImageURL = (url: string): Promise<ProfileInfoInterface> => {
    const data: Record<string, unknown> = {
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
 * @returns Array of profile schemas as a Promise.
 * @throws IdentityAppsApiException - If an error occurs while retrieving the profile schemas.
 */
export const getProfileSchemas = (): Promise<ProfileSchemaInterface[]> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json"
        },
        method: HttpMethods.GET,
        url: Config.getServiceResourceEndpoints().schemas
    };
    const schemaAttributes: ProfileSchemaInterface[] = [];

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
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
            response.data.map((schema: SchemaResponseInterface) => {
                schema.attributes.map((attribute: ProfileSchemaInterface) => {
                    const isExtended: boolean = schema.id !== ProfileConstants.SCIM2_CORE_USER_SCHEMA &&
                        schema.id !== ProfileConstants.SCIM2_CORE_SCHEMA;
                    const schemaUri: string = `${schema.id}:${attribute.name}`;

                    if (isExtended) {
                        const modifiedSubAttributes: ProfileSchemaInterface[] = [];

                        if (attribute.type === AttributeDataType.COMPLEX) {
                            attribute.subAttributes.map((subAttribute: ProfileSchemaInterface) => {
                                modifiedSubAttributes.push({
                                    ...subAttribute,
                                    extended: true,
                                    schemaId: schema.id,
                                    schemaUri: `${schemaUri}.${subAttribute.name}`
                                });
                            });
                            attribute.subAttributes = modifiedSubAttributes;
                        }
                        schemaAttributes.push({ ...attribute, extended: true, schemaId: schema.id, schemaUri });

                        return;
                    }

                    schemaAttributes.push({
                        ...attribute,
                        schemaId: schema.id,
                        schemaUri
                    });
                });
            });

            return Promise.resolve(schemaAttributes as ProfileSchemaInterface[]);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ProfileConstants.SCHEMA_FETCH_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
