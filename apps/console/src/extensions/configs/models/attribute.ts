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

import { Claim, ClaimDialect, ExternalClaim } from "@wso2is/core/models";
import { SemanticICONS } from "semantic-ui-react";

export interface AttributeConfig {
    addAttributeMapping: boolean;
    showCustomAttributeMapping: boolean;
    attributeMappings: {
        deleteAction: boolean;
        editAttributeMappingDetails: boolean;
        getExternalAttributes: (attributeType: string, response: ExternalClaim[]) => ExternalClaim[];
        showDangerZone: boolean;
        showSCIMCore1: boolean;
    };
    attributes: {
        addAttribute: boolean;
        deleteAction: boolean;
        description: string;
        showEditTabs: boolean;
        showUserstoreMappingWarningIcon: boolean;
    };
    attributesPlaceholderAddButton: (attributeType: string) => boolean;
    editAttributeMappings: {
        showAddExternalAttributeButton: (dialectID: string) => boolean;
        markAddExternalAttributeButtonAsAComingSoonFeature: (dialectID: string) => boolean;
    };
    editAttributes: {
        getDisplayOrder: (existingDisplayOrder: number, newDisplayOrder: string) => number;
        showDangerZone: boolean;
        showDisplayOrderInput: boolean;
        showRequiredCheckBox: boolean;
    };
    externalAttributes: {
        isAttributeEditable: boolean,
        editAttribute: (claim: ExternalClaim, editClaimID: string, callback: (claimID: string) => void) => void;
        getEditIcon: (claim: ExternalClaim, editClaimID: string) => SemanticICONS;
        getEditPopupText: (claim: ExternalClaim, editClaimID: string) => string;
        hideDeleteIcon: (claim: ExternalClaim) => boolean;
        isEditActionClickable: (claim: ExternalClaim) => boolean;
        isRowClickable: (dialectID: string, item: any) => boolean;
        showActions: (dialectID: string) => boolean;
        showDeleteIcon: (dialectID: string, claimsList: ExternalClaim[]) => boolean;
        deleteCustomExternalDialect: () => Promise<boolean>;
    };
    localAttributes: {
        createWizard: {
            showPrimaryUserStore: boolean;
            showOnlyMandatory: boolean;
            customWIzard: boolean;
            checkOIDCAvailability: boolean;
            checkSCIMAvailability: boolean;
            showDisplayOrder: boolean;
            showRegularExpression: boolean;
            showReadOnlyAttribute: boolean;
            showSummary: boolean;
            identifyAsCustomAttrib: boolean;
        }
        oidcDialectURI: string;
        createCustomDialect: boolean;
        mapClaimToCustomDialect: boolean;
        checkAttributeNameAvailability: (attributeName: string, protocol: string) => Promise<Map<string, boolean>>;
        getDialect: (dialectURI: string) => Promise<any>;
        isSCIMCustomDialectAvailable: () => Promise<string>;
        isUserStoresHidden: (hiddenUserStores: string[]) => Promise<any[]>;
    }
    defaultScimMapping: {
        "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": Map<string, string>;
        "urn:ietf:params:scim:schemas:core:2.0:User": Map<string, string>;
        "urn:ietf:params:scim:schemas:core:2.0": Map<string, string>;
    },
    systemClaims: string[];
    showCustomDialectInSCIM: boolean;
    isRowSelectable: (claim: Claim | ExternalClaim | ClaimDialect) => boolean;
    isSCIMEditable: boolean;
}
