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

import { DocumentationConstants } from "./documentation-constants";

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

    /**
     * Doc key for the IDP overview page.
     * @constant
     * @type {string}
     */
    public static readonly IDP_OVERVIEW_DOCS_KEY = `${
        DocumentationConstants.PORTAL_DOCS_KEY }["Identity Providers"]["Overview"]`;

    /**
     * Doc key for the IDP edit page.
     * @constant
     * @type {string}
     */
    public static readonly IDP_EDIT_OVERVIEW_DOCS_KEY = `${
        DocumentationConstants.PORTAL_DOCS_KEY }["Identity Providers"]["Edit Identity Provider"]["Overview"]`;

    /**
     * Set of internal idps which are forbidden from deleting.
     * // TODO: Remove this once validating is available from the backend level.
     * @type {string[]}
     */
    public static readonly DELETING_FORBIDDEN_IDPS: string[] = [];

    /**
     * Key for the URL search param for IDP state.
     * @constant
     * @type {string}
     */
    public static readonly IDP_STATE_URL_SEARCH_PARAM_KEY = "state";

    /**
     * URL Search param for newly created IDPs.
     * @constant
     * @type {string}
     */
    public static readonly NEW_IDP__URL_SEARCH_PARAM = `?${
        IdentityProviderManagementConstants.IDP_STATE_URL_SEARCH_PARAM_KEY }=new`;

    /**
     * Doc key for the IDP create page.
     * @constant
     * @type {string}
     */
    public static readonly IDP_TEMPLATES_CREATE_DOCS_KEY = `${
        DocumentationConstants.PORTAL_DOCS_KEY }["Identity Providers"]["Create New Identity Provider"]`;

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
    public static readonly BASIC_AUTH_REQUEST_PATH_AUTHENTICATOR: string = "BasicAuthRequestPathAuthenticator";
    public static readonly OAUTH_REQUEST_PATH_AUTHENTICATOR: string = "OAuthRequestPathAuthenticator";
    public static readonly PROVISIONING_CONNECTOR_DISPLAY_NAME: string = "displayName";
    public static readonly PROVISIONING_CONNECTOR_GOOGLE: string = "googleapps";
}
