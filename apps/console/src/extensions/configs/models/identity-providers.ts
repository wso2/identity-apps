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

import { ReactNode } from "react";
import { AuthenticatorInterface } from "../../../features/identity-providers/models";

export interface IdentityProviderConfig {
    /**
     * To extend the Authenticators API response.
     */
    authenticatorResponseExtension: AuthenticatorInterface[];
    /**
     * Config for the Authenticators.
     */
    authenticators: {
        [ key: string ]: AuthenticatorExtensionsConfigInterface;
    };
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
    jitProvisioningSettings: {
        menuItemName: string;
        enableJitProvisioningField: {
            show: boolean;
        },
        userstoreDomainField: {
            show: boolean;
        },
        provisioningSchemeField: {
            show: boolean;
        }
    },
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
        hideIdentityClaimAttributes?: (authenticatorId: string) => boolean;
        hideLogoInputFieldInIdPGeneralSettingsForm?: (authenticatorId: string) => boolean;
        /**
         * If returned {@code false} the provisioning claims section is hidden
         * entirely. Update operations will fallback to defaults.
         * @param authenticatorId
         */
        isProvisioningAttributesEnabled: (authenticatorId: string) => boolean;
        /**
         * If returned {@code false} it will hide both uri mapping for role and
         * external mappings component entirely.
         * @param authenticatorId
         */
        isRoleMappingsEnabled?: (authenticatorId: string) => boolean;
    };
    /**
     * Local authenticators + Federated authenticators will be shown in one grid view as connections.
     * If set to falls, the generic list view with only IDPs will be displayed.
     */
    useNewConnectionsView: boolean;
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
    fidoTags: string[];
    filterFidoTags: (tags: string[]) => string[];
}

/**
 * Interface for Authenticator extensions config.
 */
export interface AuthenticatorExtensionsConfigInterface {
    content?: {
        quickStart: ReactNode;
    };
    /**
     * Show authenticator as a coming soon feature.
     * @remarks This configuration is not applicable if `identityProviderList.useLegacyListing` is set to true.
     */
    isComingSoon: boolean;
    /**
     * Is authenticator enabled. Only these authenticators will be shown on the grid.
     * @remarks This configuration is not applicable if `identityProviderList.useLegacyListing` is set to true.
     */
    isEnabled: boolean;
    /**
     * Flag to decide whether the details of the authenticator should be fetched from the authenticators API.
     */
    useAuthenticatorsAPI?: boolean;
}
