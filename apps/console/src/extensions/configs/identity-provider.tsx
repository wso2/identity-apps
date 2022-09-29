/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FunctionComponent, ReactElement, SVGProps } from "react";
import { IdentityProviderConfig } from "./models";
import { IdentityProviderManagementConstants } from "../../features/identity-providers/constants";
import {
    AuthenticatorLabels,
    GenericIdentityProviderCreateWizardPropsInterface,
    IdentityProviderTabTypes
} from "../../features/identity-providers/models";

export const identityProviderConfig: IdentityProviderConfig = {
    authenticatorResponseExtension: [],
    authenticators: {},
    createIdentityProvider: {
        getOverriddenCreateWizard: (
            _templateId: string,
            _props: GenericIdentityProviderCreateWizardPropsInterface & IdentifiableComponentInterface
        ): ReactElement | null => {
            return null;
        }
    },
    editIdentityProvider: {
        attributesSettings: true,
        getCertificateOptionsForTemplate: (_templateId: string): { JWKS: boolean; PEM: boolean; } | undefined => {
            return undefined;
        },
        getOverriddenAuthenticatorForm: (
            _type: string,
            _templateId: string,
            _props: Record<string, any>
        ): ReactElement | null => {
            return null;
        },
        isTabEnabledForIdP: (templateType: string, tabType: IdentityProviderTabTypes): boolean | undefined => {

            const templateMapping = new Map<string, Set<string>>([
                [
                    IdentityProviderTabTypes.USER_ATTRIBUTES, new Set([
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.FACEBOOK,
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE,
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GITHUB,
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.MICROSOFT,
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.OIDC
                    ])
                ]
            ]);

            if (templateMapping.get(tabType)?.has(templateType)) {
                return true;
            }

            return true;
        },
        showAdvancedSettings: true,
        showJitProvisioning: true,
        showOutboundProvisioning: true
    },
    getIconExtensions: (): Record<string, string | FunctionComponent<SVGProps<SVGSVGElement>>> => {
        return {};
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
        expertMode: true,
        facebook: true,
        github: true,
        google: true,
        microsoft: true,
        oidc: true,
        organizationEnterprise: true,
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
