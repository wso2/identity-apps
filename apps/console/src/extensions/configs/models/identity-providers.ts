/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ResourceTabPaneInterface } from "@wso2is/react-components";
import { FunctionComponent, ReactElement, ReactNode, SVGProps } from "react";
import {
    AuthenticatorInterface,
    GenericIdentityProviderCreateWizardPropsInterface,
    IdentityProviderTabTypes
} from "../../../features/identity-providers/models";

export interface IdentityProviderConfig {
    /**
     * To extend the Authenticators API response.
     */
    authenticatorResponseExtension: AuthenticatorInterface[];
    /**
     * Config for the Authenticators.
     */
    authenticators: {
        [key: string]: AuthenticatorExtensionsConfigInterface;
    };
    createIdentityProvider: {
        /**
         * Used to the IDP create wizard of a certain IDP template type.
         * @param templateId - The IDP Template Type.
         * @param templateId - Props for the component.
         */
        getOverriddenCreateWizard: (
            templateId: string,
            props: GenericIdentityProviderCreateWizardPropsInterface & IdentifiableComponentInterface
        ) => ReactElement | null;
    },
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
        isTabEnabledForIdP: (templateId: string, tabType: IdentityProviderTabTypes) => boolean | undefined;
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
        /**
         * Certain IDP templates can have different settings for Certificate options.
         */
        getCertificateOptionsForTemplate: (templateId: string) => { JWKS: boolean; PEM: boolean } | undefined;
    };
    getIconExtensions: () => Record<string, string | FunctionComponent<SVGProps<SVGSVGElement>>>;
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
    generalDetailsForm: {
        showCertificate: boolean;
    };
    utils: {
        isAuthenticatorAllowed: (name: string) => boolean;
        isProvisioningAttributesEnabled: (authenticatorId: string) => boolean;
        hideIdentityClaimAttributes?: (authenticatorId: string) => boolean;
        /**
         * If returned `false` it will hide both uri mapping for role and
         * external mappings component entirely.
         * @param authenticatorId - Authenticator id.
         * @returns enabled or not.
         */
        isRoleMappingsEnabled?: (authenticatorId: string) => boolean;
        hideLogoInputFieldInIdPGeneralSettingsForm?: (authenticatorId: string) => boolean;
    };
    /**
     * Local authenticators + Federated authenticators will be shown in one grid view as connections.
     * If set to falls, the generic list view with only IDPs will be displayed.
     */
    useNewConnectionsView: boolean;
    templates: {
        apple: boolean;
        expertMode: boolean;
        facebook: boolean;
        google: boolean;
        github: boolean;
        hypr: boolean;
        microsoft: boolean;
        enterprise: boolean;
        saml: boolean;
        oidc: boolean;
        organizationEnterprise: boolean;
        trustedTokenIssuer: boolean;
    };
    fidoTags: string[];
    filterFidoTags: (tags: string[]) => string[];
    getOverriddenAuthenticatorDisplayName: (authenticatorId: string, value: string) => string;
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
