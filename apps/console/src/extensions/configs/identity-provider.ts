/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { IdentityProviderConfig } from "./models";
import { IdentityProviderManagementConstants } from "../../features/identity-providers";

export const identityProviderConfig: IdentityProviderConfig = {
    editIdentityProvider: {
        showAdvancedSettings: true,
        showJitProvisioning: true,
        showOutboundProvisioning: true,
        attributesSettings: true
    },
    generalDetailsForm: {
        showCertificate: true
    },
    templates: {
        enterprise: true,
        facebook: false,
        github: false,
        google: true,
        saml: true,
        oidc: true,
    },
    utils: {
        isAuthenticatorAllowed: (name: string): boolean => {
            return [
                IdentityProviderManagementConstants.BASIC_AUTH_REQUEST_PATH_AUTHENTICATOR,
                IdentityProviderManagementConstants.OAUTH_REQUEST_PATH_AUTHENTICATOR,
                IdentityProviderManagementConstants.X509_AUTHENTICATOR,
                IdentityProviderManagementConstants.SESSION_EXECUTOR_AUTHENTICATOR
            ].includes(name);
        },
        /**
         * If the {@param authenticatorId} is not in the excluded set we
         * can say the provisioning attributes is enabled for authenticator.
         *
         * As an example:-
         *      const excludedAuthenticators = new Set([
         *          IdentityProviderManagementConstants.BASIC_AUTH_REQUEST_PATH_AUTHENTICATOR,
         *      ]);
         *      return !excludedAuthenticators.has(authenticatorId);
         */
        isProvisioningAttributesEnabled(authenticatorId: string): boolean {
            return true;
        },
        /**
         * As an example you can implement this method like the
         * following:-
         *
         *      const identityClaimsHiddenAuthenticators = new Set([
         *          IdentityProviderManagementConstants.BASIC_AUTH_REQUEST_PATH_AUTHENTICATOR,
         *      ]);
         *      return identityClaimsHiddenAuthenticators.has(authenticatorId);
         *
         * @param authenticatorId
         */
        hideIdentityClaimAttributes(authenticatorId: string): boolean {
            return false;
        }
    }
};
