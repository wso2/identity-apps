/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

/**
 * Class containing identity provider management constants.
 */
export class IdentityProviderManagementConstants {

    /**
     * Identifier for the local IDP.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly LOCAL_IDP_IDENTIFIER: string = "LOCAL";

    public static readonly IDENTITY_PROVIDER_TEMPLATE_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while fetching identity provider template.";
    public static readonly IDENTITY_PROVIDER_TEMPLATE_FETCH_ERROR: string = "An error occurred while fetching " +
        "the required identity provider template.";
    public static readonly IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while fetching identity provider templates list.";
    public static readonly IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_ERROR: string = "An error occurred while fetching " +
        "the required identity provider templates list.";
    public static readonly IDENTITY_PROVIDER_JIT_PROVISIONING_UPDATE_ERROR: string = "An error occurred while" +
        " updating the JIT provisioning configurations of the identity provider.";
    public static readonly LOCAL_AUTHENTICATOR_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while fetching local authenticators.";
    public static readonly LOCAL_AUTHENTICATOR_FETCH_ERROR: string = "An error occurred while fetching the local" +
        "authenticators.";
    public static readonly COMBINED_AUTHENTICATOR_FETCH_ERROR: string = "An error occurred while fetching the local" +
        "and federated authenticators.";
    public static readonly IDENTITY_PROVIDER_CLAIMS_UPDATE_ERROR: string = "An error occurred while updating claims " +
        "configurations of the identity provider.";
    public static readonly IDENTITY_PROVIDER_CERTIFICATE_UPDATE_ERROR: string = "An error occurred while updating " +
        "the certificate of the identity provider.";
}
