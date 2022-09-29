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

import { Claim, ClaimDialect, ExternalClaim } from "@wso2is/core/models";
import { I18n } from "@wso2is/i18n";
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";
import { AttributeConfig } from "./models";

export const attributeConfig: AttributeConfig = {
    addAttributeMapping: true,
    attributeMappings: {
        deleteAction: true,
        editAttributeMappingDetails: true,
        getExternalAttributes: (attributeType: string, response: ExternalClaim[]): ExternalClaim[] => {
            return response;
        },
        showDangerZone: true,
        showSCIMCore1: true
    },
    attributes: {
        addAttribute: true,
        deleteAction: true,
        description: "console:manage.features.claims.local.pageLayout.local.description",
        excludeIdentityClaims: false,
        showEditTabs: true,
        showUserstoreMappingWarningIcon: true
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attributesPlaceholderAddButton: (attributeType: string): boolean => {
        return true;
    },
    editAttributeMappings: {
        /**
         * Disables and marks the dialect add new attribute button as a
         * coming soon feature.
         * - @param dialectID: string
         */
        markAddExternalAttributeButtonAsAComingSoonFeature() {
            return false;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        showAddExternalAttributeButton: (dialectID: string): boolean => {
            return true;
        }
    },
    editAttributes: {
        getDisplayOrder: (existingDisplayOrder: number, newDisplayOrder: string): number => {
            return newDisplayOrder ? parseInt(newDisplayOrder) : existingDisplayOrder;
        },
        showDangerZone: true,
        showDisplayOrderInput: true,
        showRequiredCheckBox: true
    },
    externalAttributes: {
        deleteCustomExternalDialect: () => {
            return Promise.resolve(true);
        },
        editAttribute: (claim: ExternalClaim, editClaimID: string, callback: (claimID: string) => void): void => {
            callback(editClaimID ? "" : claim?.id);
        },
        getEditIcon: (claim: ExternalClaim, editClaimID: string): SemanticICONS => {
            return editClaimID === claim?.id
                ? "times"
                : "pencil alternate";
        },
        getEditPopupText: (claim: ExternalClaim, editClaimID: string): string => {
            if (editClaimID === claim?.id) {
                return I18n.instance.t("common:cancel");
            }
            return I18n.instance.t("common:edit");
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hideDeleteIcon: (claim: ExternalClaim): boolean => {
            return false;
        },
        isAttributeEditable: true,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        isEditActionClickable: (claim: ExternalClaim): boolean => {
            return true;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        isRowClickable: (dialectID: string, item: any): boolean => {
            return true;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        showActions: (dialectID: string): boolean => {
            return true;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        showDeleteIcon: (dialectID: string, claimsList: ExternalClaim[]): boolean => {
            return true;
        }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isRowSelectable: (claim: Claim | ExternalClaim | ClaimDialect): boolean => {
        return true;
    },
    isSCIMEditable: true,
    localAttributes: {
        checkAttributeNameAvailability: () => { return Promise.resolve(new Map()); },
        createCustomDialect: false,
        createWizard: {
            checkOIDCAvailability: false,
            checkSCIMAvailability: false,
            customWIzard: false,
            identifyAsCustomAttrib: false,
            showDisplayOrder: true,
            showOnlyMandatory: false,
            showPrimaryUserStore: true,
            showReadOnlyAttribute: true,
            showRegularExpression: true,
            showSummary: true
        },
        customDialectURI: "",
        oidcDialectURI: "",
        getDialect: (dialectURI: string) => { return Promise.resolve(dialectURI); },
        isSCIMCustomDialectAvailable: () =>  { return Promise.resolve(""); },
        isUserStoresHidden: () =>  { return Promise.resolve([]); },
        mapClaimToCustomDialect: false
    },
    systemClaims: [],
    defaultScimMapping: {},
    showCustomDialectInSCIM: false
};
