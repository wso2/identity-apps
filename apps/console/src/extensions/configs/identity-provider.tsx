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
import { AuthenticatorLabels, IdentityProviderManagementConstants } from "../../features/identity-providers";

export const identityProviderConfig: IdentityProviderConfig = {
    authenticatorResponseExtension: [],
    authenticators: {},
    editIdentityProvider: {
        attributesSettings: true,
        showAdvancedSettings: true,
        showJitProvisioning: true,
        showOutboundProvisioning: true
    },
    jitProvisioningSettings: {
        menuItemName: "Just-in-Time Provisioning",
        enableJitProvisioningField: {
            show: true
        },
        userstoreDomainField: {
            show: true,
        },
        provisioningSchemeField: {
            show: true
        }
    },
    generalDetailsForm: {
        showCertificate: true
    },
    identityProviderList: {
        useLegacyListing: true
    },
    templates: {
        enterprise: true,
        facebook: true,
        github: true,
        google: true,
        oidc: true,
        saml: true
    },
    fidoTags: [
        AuthenticatorLabels.SECOND_FACTOR,
        AuthenticatorLabels.PASSWORDLESS,
        AuthenticatorLabels.MULTI_FACTOR
    ],
    filterFidoTags:(tags: string[]): string[] => {
        return tags;
    },
    // Handles backward compatibility with the legacy IDP view & new connections view.
    // TODO: Remove this usage once https://github.com/wso2/product-is/issues/12052 is addressed.
    useNewConnectionsView: false,
    utils: {
        /**
         * As an example you can implement this method like the
         * following:-
         *
         *      const identityClaimsHiddenAuthenticators = new Set([
         *          IdentityProviderManagementConstants.BASIC_AUTH_REQUEST_PATH_AUTHENTICATOR,
         *      ]);
         *      return identityClaimsHiddenAuthenticators.has(authenticatorId);
         *
         * @see IdentityProviderConfig
         * - @param <ignored> authenticatorId {string}
         */
        hideIdentityClaimAttributes(): boolean {
            return false;
        },
        /**
         * This method will either show or hide logo edit field. Provide {@code true}
         * to render the form input field for it.
         *
         * @see IdentityProviderConfig
         * - @param {string} <ignored> authenticatorId {string}
         */
        hideLogoInputFieldInIdPGeneralSettingsForm(): boolean {
            return false;
        },
        isAuthenticatorAllowed: (name: string): boolean => {
            return [
                IdentityProviderManagementConstants.BASIC_AUTH_REQUEST_PATH_AUTHENTICATOR,
                IdentityProviderManagementConstants.OAUTH_REQUEST_PATH_AUTHENTICATOR,
                IdentityProviderManagementConstants.X509_AUTHENTICATOR,
                IdentityProviderManagementConstants.SESSION_EXECUTOR_AUTHENTICATOR
            ].includes(name);
        },
        /**
         * If the {-@param authenticatorId} is not in the excluded set we
         * can say the provisioning attributes is enabled for authenticator.
         *
         * As an example:-
         *      const excludedAuthenticators = new Set([
         *          IdentityProviderManagementConstants.BASIC_AUTH_REQUEST_PATH_AUTHENTICATOR,
         *      ]);
         *      return !excludedAuthenticators.has(authenticatorId);
         *
         * - @param <ignored> authenticatorId {string}
         */
        isProvisioningAttributesEnabled(): boolean {
            return true;
        },
        /**
         * Enable or disable role mappings form elements from the UI.
         * - @param <ignored> authenticatorId {string}
         */
        isRoleMappingsEnabled(): boolean {
            return true;
        }
    }
};
