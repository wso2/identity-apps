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

export interface IdentityProviderConfig {
    editIdentityProvider: {
        showAdvancedSettings: boolean;
        showJitProvisioning: boolean;
        showOutboundProvisioning: boolean;
        /**
         * {@link enabled} means the entire feature tab is enabled
         * or not. If this value is set to false the rest of the
         * variable values is pointless.
         */
        attributesSettings: boolean;
    };
    generalDetailsForm: {
        showCertificate: boolean;
    };
    identityProviderList: {
        /**
         * Display IDPs only in the ordinary list view.
         * If set to falls, local authenticators + federated will be shown in one grid view.
         */
        useLegacyListing: boolean;
    };
    utils: {
        isAuthenticatorAllowed: (name: string) => boolean;
        /**
         * Is authenticator configurable.
         *
         * Only these authenticators will be listed on the connections view.
         * @remarks This configuration is not applicable if `identityProviderList.useLegacyListing` is set to true.
         *
         * @param {string} id - Authenticator ID.
         * @return {boolean}
         */
        isConfigurableAuthenticator: (id: string) => boolean;
        /**
         * Is authenticator configurations are available.
         *
         * If configurations are not available, the authenticator will be listed as coming soon.
         * @remarks This configuration is not applicable if `identityProviderList.useLegacyListing` is set to true.
         *
         * @param {string} id - Authenticator ID.
         * @return {boolean}
         */
        isAuthenticatorConfigurationsAvailable: (id: string) => boolean;
        isProvisioningAttributesEnabled: (authenticatorId: string) => boolean;
        hideIdentityClaimAttributes?: (authenticatorId: string) => boolean;
    };
    templates: {
        facebook: boolean;
        google: boolean;
        github: boolean;
        enterprise: boolean;
        /**
         * Adding `saml` and `oidc` template enabled property to this
         * config under the group `enterprise-protocols`.
         */
        saml: boolean;
        oidc: boolean;
    }
}
