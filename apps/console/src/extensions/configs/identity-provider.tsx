/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com).
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
import { I18n } from "@wso2is/i18n";
import { ResourceTabPaneInterface } from "@wso2is/react-components";
import React, { ElementType, FunctionComponent, ReactElement, SVGProps, lazy } from "react";
import { IdentityProviderConfig } from "./models";
import { ConnectionTabTypes } from "../../features/connections";
import { IdentityProviderManagementConstants } from "../../features/identity-providers/constants";
import {
    AuthenticatorLabels,
    GenericIdentityProviderCreateWizardPropsInterface,
    IdentityProviderTabTypes
} from "../../features/identity-providers/models";
import {
    SmsOTPAuthenticator
} from "../components/authenticators/sms-otp/sms-otp-authenticator";
import QuickStartTab from "../components/component-extensions/application/quick-start-tab";
import { getIdPIcons } from "../components/identity-providers/configs/ui";
import { SIWEAuthenticatorForm } from "../identity-provider-templates/templates/swe/swe-authenticator-form";
import SIWEIdPTemplate from "../identity-provider-templates/templates/swe/swe.json";
import { SIWEAuthenticationProviderCreateWizard } from "../identity-provider-templates/templates/swe/wizards";

/**
 * A class to hold authenticator constants that get overidden.
 */
export class IdentityProviderExtensionConstants {

    public static readonly FIDO_AUTHENTICATOR_DISPLAY_NAME: string = "Passkey";
}

export const identityProviderConfig: IdentityProviderConfig = {
    authenticatorResponseExtension: [],
    // TODO: Refactor authenticators out of IdentityProviderConfigs to AuthenticatorConfig
    authenticators: {
        [ IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: {
            content: {
                quickStart: lazy(() => import("../components/authenticators/email-otp/quick-start"))
            },
            isComingSoon: false,
            isEnabled: true,
            useAuthenticatorsAPI: false
        },
        [ IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: {
            content: {
                quickStart: lazy(() => import("../components/authenticators/sms-otp/quick-start"))
            },
            isComingSoon: false,
            isEnabled: true,
            useAuthenticatorsAPI: false
        },
        [ IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID ]: {
            content: {
                quickStart: lazy(() => import("../components/authenticators/totp/quick-start"))
            },
            isComingSoon: false,
            isEnabled: true,
            useAuthenticatorsAPI: true
        },
        [ IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID ]: {
            content: {
                quickStart: lazy(() => import("../components/authenticators/fido/quick-start"))
            },
            isComingSoon: false,
            isEnabled: true,
            useAuthenticatorsAPI: false
        },
        [ IdentityProviderManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID ]: {
            content: {
                quickStart: lazy(() => import("../components/authenticators/magic-link/quick-start"))
            },
            isComingSoon: false,
            isEnabled: true,
            useAuthenticatorsAPI: true
        }
    },
    createIdentityProvider: {
        getOverriddenCreateWizard: (
            templateId: string,
            props: GenericIdentityProviderCreateWizardPropsInterface & IdentifiableComponentInterface
        ): ReactElement => {

            const {
                "data-componentid": componentId,
                title,
                subTitle,
                onWizardClose,
                template,
                ...rest
            } = props;

            if (templateId === SIWEIdPTemplate.templateId) {
                return (
                    <SIWEAuthenticationProviderCreateWizard
                        title={ title }
                        subTitle={ subTitle }
                        onWizardClose={ onWizardClose }
                        template={ template }
                        data-componentid={ componentId }
                        { ...rest }
                    />
                );
            }

            return null;
        }
    },
    disableSMSOTPInSubOrgs: false,
    editIdentityProvider: {
        attributesSettings: true,
        getCertificateOptionsForTemplate: (templateId: string): { JWKS: boolean; PEM: boolean } | undefined => {
            if (templateId === SIWEIdPTemplate.templateId) {
                return {
                    JWKS: false,
                    PEM: false
                };
            }

            return undefined;
        },
        getOverriddenAuthenticatorForm: (
            type: string,
            templateId: string,
            props: Record<string, any>
        ): ReactElement | null => {

            const {
                "data-componentid": componentId,
                enableSubmitButton,
                initialValues,
                isSubmitting,
                metadata,
                onSubmit,
                readOnly,
                showCustomProperties,
                triggerSubmit,
                ...rest
            } = props;

            if (templateId === SIWEIdPTemplate.templateId) {
                return (
                    <SIWEAuthenticatorForm
                        data-componentid={ componentId }
                        enableSubmitButton={ enableSubmitButton }
                        initialValues={ initialValues }
                        isSubmitting={ isSubmitting }
                        metadata={ metadata }
                        onSubmit={ onSubmit }
                        readOnly={ readOnly }
                        showCustomProperties={ showCustomProperties }
                        triggerSubmit={ triggerSubmit }
                        { ...rest }
                    />
                );
            }

            if( type === IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID ) {
                return (
                    <SmsOTPAuthenticator
                        initialValues={ initialValues }
                        metadata={ metadata }
                        onSubmit={ onSubmit }
                        triggerSubmit={ triggerSubmit }
                        enableSubmitButton={ enableSubmitButton }
                        showCustomProperties={ showCustomProperties }
                        isSubmitting={ isSubmitting }
                        { ...rest }
                    />
                );
            }

            return null;
        },
        getTabExtensions: (props: Record<string, unknown>): ResourceTabPaneInterface[] => {
            const { content, ...rest } = props;

            return [
                {
                    componentId: "quick-start",
                    menuItem: I18n.instance.t(
                        "console:develop.componentExtensions.component.application.quickStart.title"
                    ),
                    render: () => <QuickStartTab content={ content as ElementType } { ...rest } />
                }
            ];
        },
        isTabEnabledForIdP: (templateType: string, tabType: ConnectionTabTypes): boolean | undefined => {

            const templateMapping: Map<string, Set<string>> = new Map<string, Set<string>>([
                [
                    IdentityProviderTabTypes.USER_ATTRIBUTES, new Set([
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.FACEBOOK,
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE,
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GITHUB,
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.OIDC,
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.MICROSOFT,
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.HYPR,
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.APPLE,
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER,
                        SIWEIdPTemplate.templateId
                    ])
                ],
                [
                    IdentityProviderTabTypes.SETTINGS, new Set([
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER
                    ])
                ],
                [
                    IdentityProviderTabTypes.ATTRIBUTES, new Set([
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER
                    ])
                ],
                [
                    IdentityProviderTabTypes.CONNECTED_APPS, new Set([
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER
                    ])
                ],
                [
                    IdentityProviderTabTypes.CONNECTED_APPS, new Set([
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER
                    ])
                ],
                [
                    IdentityProviderTabTypes.IDENTITY_PROVIDER_GROUPS, new Set([
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER
                    ])
                ],
                [
                    IdentityProviderTabTypes.OUTBOUND_PROVISIONING, new Set([
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER
                    ])
                ],
                [
                    IdentityProviderTabTypes.JIT_PROVISIONING, new Set([
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER
                    ])
                ],
                [
                    IdentityProviderTabTypes.ADVANCED, new Set([
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER
                    ])
                ]
            ]);

            if (templateMapping.get(tabType)?.has(templateType)) {
                return false;
            }

            return undefined;
        },
        showAdvancedSettings: true,
        showIssuerSettings: true,
        showJitProvisioning: true,
        showOutboundProvisioning: true
    },
    extendedSamlConfig: {
        attributeConsumingServiceIndexEnabled: true,
        authContextComparisonLevelEnabled: true,
        enableAssertionSigningEnabled: true,
        forceAuthenticationEnabled: true,
        includeAuthenticationContextEnabled: true,
        includeNameIDPolicyEnabled: true,
        includePublicCertEnabled: true,
        isArtifactBindingEnabled: true,
        isAssertionEncryptionEnabled: true,
        responseAuthenticationContextClassEnabled: true,
        saml2WebSSOUserIdLocationEnabled: true
    },
    fidoTags: [
        AuthenticatorLabels.PASSWORDLESS,
        AuthenticatorLabels.PASSKEY
    ],
    filterFidoTags: (tags: string[]): string[] => {
        return tags.filter((tag: string) =>
            tag === AuthenticatorLabels.PASSWORDLESS || tag === AuthenticatorLabels.PASSKEY);
    },
    generalDetailsForm: {
        showCertificate: true
    },
    getIconExtensions: (): Record<string, string | FunctionComponent<SVGProps<SVGSVGElement>>>  => {
        return {
            ...getIdPIcons()
        };
    },
    getOverriddenAuthenticatorDisplayName: (authenticatorId: string, value: string): string => {
        if (authenticatorId === IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID) {
            return IdentityProviderExtensionConstants.FIDO_AUTHENTICATOR_DISPLAY_NAME;
        }

        return value;
    },
    jitProvisioningSettings: {
        enableAssociateLocalUserField: {
            show: true
        },
        enableJitProvisioningField: {
            show: true
        },
        menuItemName: "Just-in-Time Provisioning",
        provisioningSchemeField: {
            show: true
        },
        userstoreDomainField: {
            show: true
        }
    },
    templates: {
        apple: true,
        enterprise: true,
        expertMode: true,
        facebook: true,
        github: true,
        google: true,
        hypr: true,
        microsoft: true,
        oidc: true,
        organizationEnterprise: true,
        saml: true,
        trustedTokenIssuer: false,
        useTemplateExtensions: false
    },
    // Handles backward compatibility with the legacy IDP view & new connections view.
    // TODO: Remove this usage once https://github.com/wso2/product-is/issues/12052 is addressed.
    useNewConnectionsView: true,
    utils: {
        hideIdentityClaimAttributes(authenticatorId: string): boolean {
            const identityClaimsHiddenAuthenticators: Set<string> = new Set([
                IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID
            ]);

            return identityClaimsHiddenAuthenticators.has(authenticatorId);
        },
        hideLogoInputFieldInIdPGeneralSettingsForm(): boolean {
            return true;
        },
        isAuthenticatorAllowed: (name: string): boolean => {
            return [
                IdentityProviderManagementConstants.BASIC_AUTH_REQUEST_PATH_AUTHENTICATOR,
                IdentityProviderManagementConstants.OAUTH_REQUEST_PATH_AUTHENTICATOR,
                IdentityProviderManagementConstants.X509_AUTHENTICATOR
            ].includes(name);
        },
        isProvisioningAttributesEnabled(authenticatorId: string): boolean {
            const excludedAuthenticators: Set<string> = new Set([
                IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID
            ]);
            /**
             * If the authenticatorId is not in the excluded set we
             * can say the provisioning attributes is enabled for authenticator.
             */

            return !excludedAuthenticators.has(authenticatorId);
        },

        /**
         * Enable or disable role mappings form elements from the UI.
         * @param authenticatorId - authenticator ID value
         * @returns enabled or not
         */
        isRoleMappingsEnabled(authenticatorId: string): boolean {
            return IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID !== authenticatorId;
        }
        /**
         * This method will either show or hide logo edit field. Provide true
         * to render the form input field for it.
         *
         * @see IdentityProviderConfig
         * - @param authenticatorId - authenticator ID value
         */
    }
};
