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

import {
    ExtendedClaimInterface,
    ExtendedExternalClaimInterface,
    SelectedDialectInterface
} from "@wso2is/admin.applications.v1/components/settings/attribute-management/attribute-settings";
import {
    AdvancedConfigurationsInterface,
    ApplicationInterface,
    ApplicationTabTypes
} from "@wso2is/admin.applications.v1/models/application";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1";
import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { ResourceTabPaneInterface } from "@wso2is/react-components";
import { ReactElement, ReactNode } from "react";
import { Dispatch } from "redux";
import { OIDCSDKMeta } from "../../application-templates/templates/oidc-web-application/models";
import { SAMLSDKMeta } from "../../application-templates/templates/saml-web-application/models";
import { SDKMetaInterface } from "../../application-templates/templates/single-page-application/models";

export interface ApplicationConfig {
    advancedConfigurations: {
        showEnableAuthorization: boolean;
        showFapiFeatureStatusChip: boolean;
        showHybridFlowFeatureStatusChip: boolean;
        showMtlsAliases: boolean;
        showMyAccount: boolean;
        showMyAccountStatus: boolean;
        showSaaS: boolean;
        showReturnAuthenticatedIdPs: boolean;
        showTrustedAppConsentWarning: boolean;
    };
    allowedGrantTypes: Record<string, string[]>,
    generalSettings: {
        getFieldReadOnlyStatus: (application: ApplicationInterface, fieldName: string) => boolean;
    };
    hiddenGrantTypes: string[],
    attributeSettings: {
        advancedAttributeSettings: {
            isLinkedAccountsEnabled: (templateId: string) => boolean;
            showIncludeTenantDomain: boolean;
            showIncludeUserstoreDomainRole: boolean;
            showIncludeUserstoreDomainSubject: boolean;
            showMandateLinkedLocalAccount: boolean;
            showRoleAttribute: boolean;
            showRoleMapping: boolean;
            showValidateLinkedLocalAccount: boolean;
            showSubjectAttribute: boolean;
        };
        attributeSelection: {
            getClaims: (claims: ExtendedClaimInterface[]) => ExtendedClaimInterface[];
            getExternalClaims: (claims: ExtendedExternalClaimInterface[]) => ExtendedExternalClaimInterface[];
            showAttributePlaceholderTitle: boolean;
            showShareAttributesHint: (selectedDialect: SelectedDialectInterface) => boolean;
        };
        makeSubjectMandatory: boolean;
        roleMapping: boolean;
    };
    editApplication: {
        extendTabs: boolean; //should be true for cloud
        showProvisioningSettings: boolean;
        renderHelpPanelItems: () => ReactNode;
        showDangerZone: (application: ApplicationInterface) => boolean;
        showDeleteButton: (application: ApplicationInterface) => boolean;
        /**
         * Get the list of passible tab extensions.
         * @param props - Props for the component.
         * @returns Array of tab extensions.
         */
        getTabExtensions: (
            props: Record<string, unknown>,
            features: FeatureConfigInterface,
            isReadOnly?: boolean,
            tenantDomain?: string
        ) => ResourceTabPaneInterface[];
        getTabPanelReadOnlyStatus: (tabPanelName: string, application: ApplicationInterface) => boolean;
        isTabEnabledForApp: (clientId: string, tabType: ApplicationTabTypes, tenantDomain: string) => boolean;
        getActions: (
            clientId: string,
            tenant: string,
            testId: string
        ) => ReactElement;
        getOverriddenDescription: (
            clientId: string,
            tenantDomain: string,
            templateName: string
        ) => ReactElement,
        getOverriddenImage: (clientId: string, tenantDomain: string) => ReactElement;
        getOverriddenTab: (
            clientId: string,
            tabName: any,
            defaultComponent: ReactElement,
            application: ApplicationInterface,
            tenantDomain: string,
            onUpdate?:(id: string) => void,
            readOnly?:boolean
        ) => ReactNode;
        showApplicationShare: boolean;
        getStrongAuthenticationFlowTabIndex: (
            clientId: string,
            tenantDomain: string,
            templateId?: string,
            customApplicationTemplateId?: string
        ) => number
    };
    inboundOIDCForm: {
        shouldValidateCertificate: boolean;
        showClientSecretMessage: boolean;
        showFrontChannelLogout: boolean;
        showScopeValidators: boolean;
        showNativeClientSecretMessage: boolean;
        showIdTokenEncryption: boolean;
        showIdTokenResponseSigningAlgorithm: boolean;
        showBackChannelLogout: boolean;
        showRequestObjectConfigurations: boolean;
        showRequestObjectSignatureValidation: boolean;
        showCertificates: boolean;
        showReturnAuthenticatedIdPList: boolean;
        disabledGrantTypes: {
            "choreo-apim-application-oidc": string[];
            "custom-application": string[];
        };
    };
    inboundSAMLForm: {
        showApplicationQualifier: boolean;
        showAttributeConsumingServiceIndex: boolean;
        showQueryRequestProfile: boolean;
        artifactBindingAllowed: boolean;
    };
    marketingConsent: {
        getBannerComponent: () => ReactElement
    };
    signInMethod: {
        authenticatorSelection: {
            customAuthenticatorAdditionValidation ?: (
                authenticatorID: string,
                stepIndex: number,
                dispatch: Dispatch
            ) => boolean;
            messages: {
                secondFactorDisabled: ReactNode;
                secondFactorDisabledInFirstStep: ReactNode;
            };
        };
    };
    templates: {
        oidc: boolean;
        saml: boolean;
        spa: boolean;
        windows: boolean;
        custom: boolean;
        mobile: boolean;
        m2m: boolean;
        customProtocol: boolean;
    };
    customApplication: {
        allowedProtocolTypes: string[];
        defaultTabIndex: number;
    };
    excludeSubjectClaim: boolean;
    quickstart: {
        oidcWeb: OIDCSDKMeta;
        samlWeb: SAMLSDKMeta;
        spa: SDKMetaInterface
    };
}

/**
 * Unique identifiers for application edit tabs.
 */
export enum ApplicationTabIDs {
    QUICK_START = "quick-start",
    GENERAL = "general",
    PROTOCOL = "protocol",
    USER_ATTRIBUTES = "user-attributes",
    SIGN_IN_METHODS = "sign-in-method",
    PROVISIONING = "provisioning",
    ADVANCED = "advanced",
    SHARED_ACCESS = "shared-access",
    INFO = "info",
    API_AUTHORIZATION = "api-authorization",
    APPLICATION_ROLES = "application-roles"
}

/**
 * Proptypes for the form in advance settings tab override component.
 */
export interface AdvancedSettingsOverriddenFormPropsInterface
    extends SBACInterface<FeatureConfigInterface>,
        IdentifiableComponentInterface {
    /**
     * Current advanced configurations.
     */
    advancedConfigurations: AdvancedConfigurationsInterface;
    /**
     * Callback to update the application details.
     */
    onSubmit: (values: any) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Specifies if the form is submitting
     */
    isSubmitting?: boolean;
}
