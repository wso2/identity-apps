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
import { ApplicationConfig } from "./models";
import {
    ExtendedClaimInterface,
    ExtendedExternalClaimInterface,
    SelectedDialectInterface
} from "../../features/applications/components/settings";

export const applicationConfig: ApplicationConfig = {
    advancedConfigurations: {
        showEnableAuthorization: true,
        showReturnAuthenticatedIdPs: true,
        showSaaS: true
    },
    attributeSettings: {
        advancedAttributeSettings: {
            showIncludeTenantDomain: true,
            showIncludeUserstoreDomainRole: true,
            showIncludeUserstoreDomainSubject: true,
            showRoleAttribute: true,
            showRoleMapping: true,
            showSubjectAttribute: false,
            showUseMappedLocalSubject: true
        },
        attributeSelection: {
            getClaims: (claims: ExtendedClaimInterface[]): ExtendedClaimInterface[] => {
                return claims;
            },
            getExternalClaims: (claims: ExtendedExternalClaimInterface[]): ExtendedExternalClaimInterface[] => {
                return claims;
            },
            showAttributePlaceholderTitle: false,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            showShareAttributesHint: (selectedDialect: SelectedDialectInterface): boolean => {
                return true;
            }
        },
        makeSubjectMandatory: true,
        roleMapping: true
    },
    customApplication: {
        allowedProtocolTypes: []
    },
    editApplication: {
        extendTabs: false,
        renderHelpPanelItems: (): ReactNode => {
            return null;
        },
        showProvisioningSettings: true
    },
    excludeIdentityClaims: false,
    inboundOIDCForm: {
        disabledGrantTypes: [],
        shouldValidateCertificate: true,
        showBackChannelLogout: true,
        showCertificates: true,
        showClientSecretMessage: true,
        showFrontChannelLogout: true,
        showIdTokenEncryption: true,
        showNativeClientSecretMessage: true,
        showRequestObjectSignatureValidation: true,
        showReturnAuthenticatedIdPList: true,
        showScopeValidators: true
    },
    inboundSAMLForm: {
        artifactBindingAllowed: true,
        showApplicationQualifier: true,
        showAttributeConsumingServiceIndex: true,
        showQueryRequestProfile: true
    },
    signInMethod: {
        authenticatorSelection: {
            customAuthenticatorAdditionValidation: (): boolean => {
                return true;
            },
            messages: {
                secondFactorDisabled: null,
                secondFactorDisabledInFirstStep: null
            }
        }
    },
    templates: {
        android: true,
        custom: true,
        oidc: true,
        saml: true,
        spa: true,
        windows: true
    }
};
