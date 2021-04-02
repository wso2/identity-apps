/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
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
        description: I18n.instance.t("console:manage.features.claims.local.pageLayout.local.description"),
        excludeIdentityClaims: false,
        showEditTabs: true,
        showUserstoreMappingWarningIcon: true
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attributesPlaceholderAddButton: (attributeType: string): boolean => {
        return true;
    },
    editAttributeMappings: {
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
        showDeleteIcon: (dialectID: string): boolean => {
            return true;
        }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isRowSelectable: (claim: Claim | ExternalClaim | ClaimDialect): boolean => {
        return true;
    },
    isSCIMEditable: true
};
