/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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

import { ConnectionTabTypes } from "@wso2is/admin.connections.v1/models/connection";
import { ResourceTabPaneInterface } from "@wso2is/react-components";
import { ReactElement, ReactNode } from "react";

export interface ExtendedSamlConfigInterface {
    isArtifactBindingEnabled: boolean;
    attributeConsumingServiceIndexEnabled: boolean;
    saml2WebSSOUserIdLocationEnabled: boolean;
    authContextComparisonLevelEnabled: boolean;
    responseAuthenticationContextClassEnabled: boolean;
    forceAuthenticationEnabled: boolean;
    includeAuthenticationContextEnabled: boolean;
    isAssertionEncryptionEnabled: boolean;
    includeNameIDPolicyEnabled: boolean;
    enableAssertionSigningEnabled: boolean;
    includePublicCertEnabled: boolean;
}

export interface IdentityProviderConfig {
    editIdentityProvider: {
        showAdvancedSettings: boolean;
        showIssuerSettings: boolean;
        showJitProvisioning: boolean;
        showOutboundProvisioning: boolean;
        /**
         * Get the list of passible tab extensions.
         * @param props - Props for the component.
         * @returns Array of tab extensions.
         */
        getTabExtensions: (props: Record<string, unknown>) => ResourceTabPaneInterface[];
        /**
         * Used enable/disable certain tabs for certain IDP template type.
         * @param templateId - The IDP Template Type.
         * @param tabType - Tab Type.
         */
        isTabEnabledForIdP: (templateId: string, tabType: ConnectionTabTypes) => boolean | undefined;
        /**
         * Used to the IDP settings form of a certain IDP template type.
         * @param type - The IDP Authenticator ID.
         * @param templateId - The IDP Template Type.
         * @param templateId - Props for the component.
         */
        getOverriddenAuthenticatorForm: (
            type: string,
            templateId: string,
            props: Record<string, any>
        ) => ReactElement | null;
    };
    jitProvisioningSettings: {
        menuItemName: string;
        enableAssociateLocalUserField: {
            show: boolean;
        },
        enableJitProvisioningField: {
            show: boolean;
        };
        userstoreDomainField: {
            show: boolean;
        };
        provisioningSchemeField: {
            show: boolean;
        };
    };
    utils: {
        hideIdentityClaimAttributes?: (authenticatorId: string) => boolean;
        /**
         * This config will be cleaned up via https://github.com/wso2/identity-apps/pull/6440.
         *
         * If returned `false` it will hide both uri mapping for role and
         * external mappings component entirely.
         * @param authenticatorId - Authenticator id.
         * @returns enabled or not.
         */
        hideLogoInputFieldInIdPGeneralSettingsForm: (authenticatorId: string) => boolean;
    };
    templates: {
        apple: boolean;
        expertMode: boolean;
        facebook: boolean;
        google: boolean;
        github: boolean;
        hypr: boolean;
        iproov: boolean;
        microsoft: boolean;
        enterprise: boolean;
        saml: boolean;
        oidc: boolean;
        organizationEnterprise: boolean;
        trustedTokenIssuer: boolean;
        useTemplateExtensions: boolean;
    };
    extendedSamlConfig: ExtendedSamlConfigInterface;
}

/**
 * Interface for Authenticator extensions config.
 */
export interface AuthenticatorExtensionsConfigInterface {
    content?: {
        quickStart: ReactNode | any;
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
