/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { Claim, ClaimDialect, ExternalClaim } from "@wso2is/core/models";
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";
import { ClaimManagementConstants } from "../../features/claims";
import { I18n } from "@wso2is/i18n";

/**
 * Check whether claims is  identity claims or not.
 *
 * @param claim claim
 */
const isIdentityClaims = (claim: ExternalClaim): boolean => {
    const identityRegex = new RegExp("wso2.org/claims/identity");
    return identityRegex.test(claim.mappedLocalClaimURI);
};

export const claimsConfig = {
           addAttributeMapping: false,
           attributeMappings: {
               deleteAction: false,
               showSCIMCore1: false,
               getExternalAttributes: (attributeType: string, response: ExternalClaim[]): ExternalClaim[] => {
                   const claims: ExternalClaim[] = [];
                   if (attributeType == ClaimManagementConstants.SCIM) {
                       response.forEach((claim: ExternalClaim) => {
                           if (!claim.mappedLocalClaimURI.match(/\/identity\//)) {
                               claims.push(claim);
                           }
                       });
                   } else {
                       claims.push(...response);
                   }

                   return claims;
               },
               editAttributeMappingDetails: false,
               showDangerZone: false
           },
           attributes: {
               deleteAction: false,
               showUserstoreMappingWarningIcon: false,
               excludeIdentityClaims: true,
               addAttribute: false,
               description: I18n.instance.t("extensions:manage.attributes.attributes.description"),
               //I18n.instance.t("console:manage.features.claims.local.pageLayout.local.description"),
               showEditTabs: false
           },
           attributesPlaceholderAddButton: (attributeType: string): boolean => {
               return attributeType !== ClaimManagementConstants.SCIM;
           },
           editAttributeMappings: {
               showAddExternalAttributeButton: (dialectID: string): boolean => {
                   return dialectID === ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OIDC");
               }
           },
           editAttributes: {
               getDisplayOrder: (existingDisplayOrder: number, newDisplayOrder: string): number => {
                   const DEFAULT_ATTRIBUTE_DISPLAY_ORDER = 20;
                   return existingDisplayOrder > 0 ? existingDisplayOrder : DEFAULT_ATTRIBUTE_DISPLAY_ORDER;
                   // newDisplayOrder ? parseInt(newDisplayOrder) : existingDisplayOrder;
               },
               showDangerZone: false,
               showDisplayOrderInput: false,
               showRequiredCheckBox: false
           },
           externalAttributes: {
               editClaim: (claim: ExternalClaim, editClaimID: string, callback: (claimID: string) => void): void => {
                   if (!isIdentityClaims(claim)) {
                       callback(editClaimID ? "" : claim?.id);
                   }
               },
               getEditIcon: (claim: ExternalClaim, editClaimID: string): SemanticICONS => {
                   if (isIdentityClaims(claim)) {
                       return "eye";
                   }
                   if (editClaimID === claim?.id) {
                       return "times";
                   }
                   return "pencil alternate";
                   /*  editClaim === claim?.id
                    ? "times"
                    : "pencil alternate", */
               },
               getEditPopupText: (claim: ExternalClaim, editClaimID: string): string => {
                   if (isIdentityClaims(claim)) {
                       return I18n.instance.t("common:view");
                   }
                   if (editClaimID === claim?.id) {
                       return I18n.instance.t("common:cancel");
                   }
                   return I18n.instance.t("common:edit");
               },
               hideDeleteIcon: (claim: ExternalClaim): boolean => {
                   return claim?.claimURI === "sub" || isIdentityClaims(claim);
               },
               isEditActionClickable: (claim: ExternalClaim): boolean => {
                   if (isIdentityClaims(claim)) {
                       return false;
                   }

                   return true;
               },
               isRowClickable: (dialectID: string, item: any): boolean => {
                   return (
                       dialectID === ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OIDC") &&
                       !isIdentityClaims(item) &&
                       item?.claimURI !== "sub"
                   );
               },
               showActions: (dialectID: string): boolean => {
                   return dialectID === ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OIDC");
               },
               showDeleteIcon: (dialectID: string): boolean => {
                   return dialectID === ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OIDC");
               }
           },
           isRowSelectable: (claim: Claim | ExternalClaim | ClaimDialect): boolean => {
               if (isIdentityClaims(claim as ExternalClaim)) {
                   return false;
               }

               return true;
           },
           isSCIMEditable: false
       };
