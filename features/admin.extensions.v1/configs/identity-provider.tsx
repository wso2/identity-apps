/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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

import { ConnectionTabTypes } from "@wso2is/admin.connections.v1";
import {
    SmsOTPAuthenticator
} from "@wso2is/admin.connections.v1/components/authenticators/sms-otp/sms-otp-authenticator";
import {
    CommonAuthenticatorConstants
} from "@wso2is/admin.connections.v1/constants/common-authenticator-constants";
import {
    FederatedAuthenticatorConstants
} from "@wso2is/admin.connections.v1/constants/federated-authenticator-constants";
import { LocalAuthenticatorConstants } from "@wso2is/admin.connections.v1/constants/local-authenticator-constants";
import { IdentityProviderTabTypes } from "@wso2is/admin.identity-providers.v1/models";
import { I18n } from "@wso2is/i18n";
import { ResourceTabPaneInterface } from "@wso2is/react-components";
import React, { ElementType, ReactElement } from "react";
import { IdentityProviderConfig } from "./models";
import QuickStartTab from "../components/component-extensions/application/quick-start-tab";
import { SIWEAuthenticatorForm } from "../identity-provider-templates/templates/swe/swe-authenticator-form";
import SIWEIdPTemplate from "../identity-provider-templates/templates/swe/swe.json";

export const identityProviderConfig: IdentityProviderConfig = {
    editIdentityProvider: {
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

            if( type === LocalAuthenticatorConstants.AUTHENTICATOR_IDS.SMS_OTP_AUTHENTICATOR_ID ) {
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
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.FACEBOOK,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.GOOGLE,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.GITHUB,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.MICROSOFT,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.HYPR,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.IPROOV,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.APPLE,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER,
                        SIWEIdPTemplate.templateId
                    ])
                ],
                [
                    IdentityProviderTabTypes.SETTINGS, new Set([
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER
                    ])
                ],
                [
                    IdentityProviderTabTypes.ATTRIBUTES, new Set([
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.IPROOV
                    ])
                ],
                [
                    IdentityProviderTabTypes.CONNECTED_APPS, new Set([
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER
                    ])
                ],
                [
                    IdentityProviderTabTypes.CONNECTED_APPS, new Set([
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER
                    ])
                ],
                [
                    IdentityProviderTabTypes.IDENTITY_PROVIDER_GROUPS, new Set([
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.FACEBOOK,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.GOOGLE,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.GITHUB,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.MICROSOFT,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.HYPR,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.APPLE,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.IPROOV
                    ])
                ],
                [
                    IdentityProviderTabTypes.OUTBOUND_PROVISIONING, new Set([
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.IPROOV
                    ])
                ],
                [
                    IdentityProviderTabTypes.JIT_PROVISIONING, new Set([
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.IPROOV
                    ])
                ],
                [
                    IdentityProviderTabTypes.ADVANCED, new Set([
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER,
                        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.IPROOV
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
        iproov: true,
        microsoft: true,
        oidc: true,
        organizationEnterprise: true,
        saml: true,
        trustedTokenIssuer: false,
        useTemplateExtensions: false
    },
    utils: {
        hideIdentityClaimAttributes(authenticatorId: string): boolean {
            const identityClaimsHiddenAuthenticators: Set<string> = new Set([
                FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.SAML_AUTHENTICATOR_ID
            ]);

            return identityClaimsHiddenAuthenticators.has(authenticatorId);
        },
        hideLogoInputFieldInIdPGeneralSettingsForm(templateId: string): boolean {
            // show if the idp is enterprise idp, otherwise don't
            const allowedTemplates: string[] = [
                CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.OIDC,
                CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.SAML
            ];

            return !allowedTemplates.includes(templateId);
        }
    }
};
