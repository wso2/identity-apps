/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { AuthenticatorManagementConstants } from "@wso2is/admin.connections.v1/constants/autheticator-constants";
import { store } from "@wso2is/admin.core.v1/store";
import { GenericAuthenticatorInterface } from "@wso2is/admin.identity-providers.v1/models";
import { OrganizationManagementConstants, OrganizationType } from "../constants/organization-constants";
import { GenericOrganization } from "../models";

export class OrganizationUtils {
    /**
     * Private constructor to prevent object instantiation.
     */
    private constructor() { }

    /**
     * Checks if the selected organization is the Super organization.
     *
     * @param organization - Organization object.
     *
     * @returns if selected organization is the Super organization
     */
    public static isSuperOrganization(organization: GenericOrganization): boolean {
        return !organization || organization.id === OrganizationManagementConstants.SUPER_ORGANIZATION_ID;
    }

    /**
     * Get the type of the current organization.
     *
     * @returns The type of the current organization.
     */
    public static getOrganizationType(): OrganizationType{
        return store.getState().organization?.organizationType;
    }

    /**
     * Get the Organization Authenticator.
     *
     * @returns The Organization Authenticator.
     */
    public static getOrganizationAuthenticator(): GenericAuthenticatorInterface {
        return {
            authenticators: [
                {
                    authenticatorId: AuthenticatorManagementConstants.ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID,
                    isEnabled: true,
                    name: AuthenticatorManagementConstants.ORGANIZATION_SSO_AUTHENTICATOR_NAME,
                    tags: [ "APIAuth" ]
                }
            ],
            defaultAuthenticator: {
                authenticatorId: AuthenticatorManagementConstants.ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID,
                isEnabled: true,
                name: AuthenticatorManagementConstants.ORGANIZATION_SSO_AUTHENTICATOR_NAME,
                tags: [ "APIAuth" ]
            },
            description: "Identity provider for Organization SSO.",
            displayName: "SSO",
            id: "sso",
            idp: "SSO",
            image: "assets/images/logos/sso.svg",
            isEnabled: true,
            name: "SSO"
        };
    }
}
