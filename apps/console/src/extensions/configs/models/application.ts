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

import { ReactElement, ReactNode } from "react";
import { Dispatch } from "redux";
import {
    ExtendedClaimInterface,
    ExtendedExternalClaimInterface,
    SelectedDialectInterface
} from "../../../features/applications/components/settings";
import { ApplicationInterface, ApplicationTabTypes } from "../../../features/applications/models";

export interface ApplicationConfig {
    advancedConfigurations: {
        showEnableAuthorization: boolean;
        showMyAccount: boolean;
        showSaaS: boolean;
        showReturnAuthenticatedIdPs: boolean;
    };
    generalSettings: {
        getFieldReadOnlyStatus: (application: ApplicationInterface, fieldName: string) => boolean ;
    };
    attributeSettings: {
        advancedAttributeSettings: {
            showIncludeTenantDomain: boolean;
            showIncludeUserstoreDomainRole: boolean;
            showIncludeUserstoreDomainSubject: boolean;
            showRoleAttribute: boolean;
            showRoleMapping: boolean;
            showUseMappedLocalSubject: boolean;
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
        getOveriddenTab: (
            clientId: string,
            tabName: any,
            defaultComponent: ReactElement,
            appName: string,
            appId: string,
            tenantDomain: string
        ) => ReactNode,
        getOverriddenImage: (clientId: string, tenantDomain: string) => ReactElement;
        showApplicationShare: boolean;
    };
    inboundOIDCForm: {
        shouldValidateCertificate: boolean;
        showClientSecretMessage: boolean;
        showFrontChannelLogout: boolean;
        showScopeValidators: boolean;
        showNativeClientSecretMessage: boolean;
        showIdTokenEncryption: boolean;
        showBackChannelLogout: boolean;
        showRequestObjectSignatureValidation: boolean;
        showCertificates: boolean;
        showReturnAuthenticatedIdPList: boolean;
        disabledGrantTypes: {
            "custom-application": string[]
        };
    };
    inboundSAMLForm: {
        showApplicationQualifier: boolean;
        showAttributeConsumingServiceIndex: boolean;
        showQueryRequestProfile: boolean;
        artifactBindingAllowed: boolean;
    };
    signInMethod: {
        authenticatorSelection: {
            messages: {
                secondFactorDisabled: ReactNode;
                secondFactorDisabledInFirstStep: ReactNode;
            };
            customAuthenticatorAdditionValidation(
                authenticatorID: string,
                stepIndex: number,
                dispatch: Dispatch
            ): boolean;
        };
        identifierFirstWarning: boolean;
    };
    templates: {
        android: boolean;
        oidc: boolean;
        saml: boolean;
        spa: boolean;
        windows: boolean;
        custom: boolean;
    };
    customApplication: {
        allowedProtocolTypes: string[];
        defaultTabIndex: number;
    };
    excludeIdentityClaims: boolean;
    excludeSubjectClaim: boolean;
}
