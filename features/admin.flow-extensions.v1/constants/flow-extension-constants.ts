/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import {
    AuthenticationType as ActionAuthenticationType,
    AuthenticationTypeDropdownOption as ActionAuthenticationTypeDropdownOption
} from "@wso2is/admin.actions.v1/models/actions";

/**
 * Class containing Flow Extension UI constants.
 */
export class FlowExtensionConstants {

    /**
     * Private constructor to avoid object instantiation.
     */
    private constructor() { }

    /**
     * Authentication types exposed in the Flow Extension endpoint configuration.
     * Typed with the admin.actions.v1 authentication types since the shared
     * `ActionEndpointConfigForm` consumes this list. Excludes Password Credential,
     * which is not supported for flow extensions.
     */
    public static readonly FLOW_EXTENSION_AUTH_TYPES: ActionAuthenticationTypeDropdownOption[] = [
        {
            key: ActionAuthenticationType.NONE,
            text: "actions:fields.authentication.types.none.name",
            value: ActionAuthenticationType.NONE
        },
        {
            key: ActionAuthenticationType.BASIC,
            text: "actions:fields.authentication.types.basic.name",
            value: ActionAuthenticationType.BASIC
        },
        {
            key: ActionAuthenticationType.BEARER,
            text: "actions:fields.authentication.types.bearer.name",
            value: ActionAuthenticationType.BEARER
        },
        {
            key: ActionAuthenticationType.API_KEY,
            text: "actions:fields.authentication.types.apiKey.name",
            value: ActionAuthenticationType.API_KEY
        },
        {
            key: ActionAuthenticationType.CLIENT_CREDENTIAL,
            text: "actions:fields.authentication.types.clientCredential.name",
            value: ActionAuthenticationType.CLIENT_CREDENTIAL
        }
    ];

    /**
     * Validation regex for a Flow Extension name. Must start with an alphanumeric character and
     * may contain letters, numbers, spaces, hyphens and underscores (max 255 characters).
     */
    public static readonly FLOW_EXTENSION_NAME_REGEX: RegExp = /^[a-zA-Z0-9][a-zA-Z0-9 _-]{0,254}$/;

    /**
     * Maximum length of a Flow Extension description.
     */
    public static readonly FLOW_EXTENSION_MAX_DESCRIPTION_LENGTH: number = 255;

    /**
     * Default description sent on create when the user does not provide one. Persisted to the
     * backend so the connection list card renders a meaningful description instead of empty space.
     */
    public static readonly FLOW_EXTENSION_DEFAULT_DESCRIPTION: string =
        "Extend flows with external services.";
}
