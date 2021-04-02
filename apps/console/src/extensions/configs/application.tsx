/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
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
        showSaaS: true
    },
    attributeSettings: {
        advancedAttributeSettings: {
            showIncludeTenantDomain: true,
            showIncludeUserstoreDomainRole: true,
            showIncludeUserstoreDomainSubject: true,
            showRoleAttribute: true,
            showRoleMapping: true,
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
    editApplication: {
        extendTabs: false,
        renderHelpPanelItems: (): ReactNode => {
            return null;
        },
        showProvisioningSettings: true
    },
    inboundOIDCForm: {
        shouldValidateCertificate: true,
        showClientSecretMessage: true,
        showFrontChannelLogout: true,
        showNativeClientSecretMessage: true,
        showScopeValidators: true
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
