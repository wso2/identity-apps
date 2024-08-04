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
import { deleteADialect } from "@wso2is/admin.claims.v1/api/claims";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants/claim-management-constants";
import { getUserStoreList } from "@wso2is/admin.userstores.v1/api";
import { UserStoreListItem } from "@wso2is/admin.userstores.v1/models";
import { Claim, ClaimDialect, ExternalClaim } from "@wso2is/core/models";
import { I18n } from "@wso2is/i18n";
import { AxiosResponse } from "axios";
import { SemanticICONS } from "semantic-ui-react";
import { AttributeConfig } from "./models";
import { getClaimsForDialect, getDialects } from "../components/claims/api";

/**
 * Check whether claims is  identity claims or not.
 *
 * @param claim - claim
 */
const isIdentityClaims = (claim: ExternalClaim): boolean => {
    const enableIdentityClaims: boolean = window[ "AppUtils" ]?.getConfig()?.ui?.enableIdentityClaims;

    if (enableIdentityClaims) {
        return false;
    }

    const identityRegex: RegExp = new RegExp("wso2.org/claims/identity");

    return identityRegex.test(claim.mappedLocalClaimURI);
};

export const attributeConfig: AttributeConfig = {
    addAttributeMapping: true,
    attributeMappings: {
        deleteAction: false,
        editAttributeMappingDetails: false,
        getExternalAttributes: (attributeType: string, response: ExternalClaim[]): ExternalClaim[] => {
            const claims: ExternalClaim[] = [];

            if (attributeType == ClaimManagementConstants.SCIM) {
                response.forEach((claim: ExternalClaim) => {
                    if (!isIdentityClaims(claim)) {
                        claims.push(claim);
                    }
                });
            } else {
                claims.push(...response);
            }

            return claims;
        },
        showDangerZone: true,
        showSCIMCore1: false
    },
    attributes: {
        addAttribute: true,
        deleteAction: false,
        description: "extensions:manage.attributes.attributes.description",
        showEditTabs: true,
        showUserstoreMappingWarningIcon: true
    },
    attributesPlaceholderAddButton: (attributeType: string): boolean => {
        return attributeType !== ClaimManagementConstants.SCIM;
    },
    defaultScimMapping: {
        "urn:ietf:params:scim:schemas:core:2.0": new Map()
            .set("urn:ietf:params:scim:schemas:core:2.0:externalId","http://wso2.org/claims/externalid")
            .set("urn:ietf:params:scim:schemas:core:2.0:id","http://wso2.org/claims/userid")
            .set("urn:ietf:params:scim:schemas:core:2.0:meta.created","http://wso2.org/claims/created")
            .set("urn:ietf:params:scim:schemas:core:2.0:meta.lastModified","http://wso2.org/claims/modified")
            .set("urn:ietf:params:scim:schemas:core:2.0:meta.location","http://wso2.org/claims/location")
            .set("urn:ietf:params:scim:schemas:core:2.0:meta.resourceType","http://wso2.org/claims/resourceType")
            .set("urn:ietf:params:scim:schemas:core:2.0:meta.version","http://wso2.org/claims/metadata.version"),
        "urn:ietf:params:scim:schemas:core:2.0:User": new Map()
            .set("urn:ietf:params:scim:schemas:core:2.0:User:active","http://wso2.org/claims/active")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:addresses#home.locality",
                "http://wso2.org/claims/locality")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:addresses#home.postalCode",
                "http://wso2.org/claims/postalcode")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:addresses#home.region",
                "http://wso2.org/claims/region")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:addresses#home.streetAddress",
                "http://wso2.org/claims/streetaddress")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:displayName","http://wso2.org/claims/displayName")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:emails","http://wso2.org/claims/emailaddress")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:groups","http://wso2.org/claims/groups")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:locale","http://wso2.org/claims/local")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:name.familyName","http://wso2.org/claims/lastname")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:name.formatted","http://wso2.org/claims/fullname")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:name.givenName","http://wso2.org/claims/givenname")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:name.middleName","http://wso2.org/claims/middleName")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:nickName","http://wso2.org/claims/nickname")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:phoneNumbers.mobile","http://wso2.org/claims/mobile")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:photos.thumbnail","http://wso2.org/claims/thumbnail")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:profileUrl","http://wso2.org/claims/url")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:roles.default","http://wso2.org/claims/roles")
            .set("urn:ietf:params:scim:schemas:core:2.0:User:userName","http://wso2.org/claims/username"),
        "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": new Map()
            .set("urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager.displayName",
                "http://wso2.org/claims/manager.displayName")
    },
    editAttributeMappings: {
        /**
         * Disables and marks the dialect add new attribute button as a
         * coming soon feature.
         * @param dialectID - Dialect ID
         */
        markAddExternalAttributeButtonAsAComingSoonFeature(dialectID: string) {
            const excludingSet: Set<string> = new Set([
                ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_EXT_ENT_USER"),
                ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_CORE_USER"),
                ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_CORE")
            ]);

            return excludingSet.has(dialectID);
        },
        showAddExternalAttributeButton: (_dialectID: string): boolean => {
            return true;
        }
    },
    editAttributes: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getDisplayOrder: (existingDisplayOrder: number, newDisplayOrder: string): number => {
            const DEFAULT_ATTRIBUTE_DISPLAY_ORDER: number = 20;

            return existingDisplayOrder > 0 ? existingDisplayOrder : DEFAULT_ATTRIBUTE_DISPLAY_ORDER;
        },
        showDangerZone: true,
        showDisplayOrderInput: false,
        showRequiredCheckBox: true
    },
    externalAttributes: {
        deleteCustomExternalDialect: async (): Promise<boolean> => {
            let dialectID: string = "";
            let noCustomClaims: boolean = false;

            await getDialects()
                .then((response: Claim[] | ClaimDialect[]) => {
                    response.map((dialect: Claim | ClaimDialect) => {
                        if (dialect.dialectURI === "urn:scim:wso2:schema") {
                            dialectID = dialect.id;
                        }
                    });
                });

            await getClaimsForDialect(dialectID)
                .then((response: Claim[] | ClaimDialect[]) => {
                    if (response.length === 0) {
                        noCustomClaims = true;
                    }
                });

            if (noCustomClaims) {
                deleteADialect(dialectID);
            }

            return Promise.resolve(true);
        },
        editAttribute: (claim: ExternalClaim, editClaimID: string, callback: (claimID: string) => void): void => {
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
        isAttributeEditable: true,
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
        showDeleteIcon: (_dialectID: string, _claimsList: ExternalClaim[]): boolean => {
            return true;
        }
    },
    isRowSelectable: (claim: Claim | ExternalClaim | ClaimDialect): boolean => {
        if (isIdentityClaims(claim as ExternalClaim)) {
            return false;
        }

        return true;
    },
    isSCIMEditable: true,
    localAttributes: {
        checkAttributeNameAvailability: async (
            attributeName: string, protocol: string
        ): Promise<Map<string, boolean>> => {
            let dialectID: string = "";
            const availability: Map<string, boolean> = new Map()
                .set("SCIM", true)
                .set("OIDC", true);

            if (protocol === "OIDC" || protocol === "BOTH" ) {
                await getClaimsForDialect(ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OIDC"))
                    .then((response: Claim[] | ExternalClaim[]) => {
                        response.map((attrib: Claim | ExternalClaim) => {
                            if (attrib.claimURI === attributeName) {
                                availability.set("OIDC", false);
                            }
                        });
                    });
            }

            if (protocol === "SCIM" || protocol === "BOTH" ) {
                await getDialects()
                    .then((response: Claim[] | ClaimDialect[]) => {
                        response.map((dialect: Claim | ClaimDialect) => {
                            if (dialect.dialectURI === "urn:scim:wso2:schema") {
                                dialectID = dialect.id;
                            }
                        });
                    });

                if (dialectID !== "") {
                    await getClaimsForDialect(dialectID)
                        .then((response: Claim[] | ExternalClaim[]) => {
                            response.map((attrib: Claim | ExternalClaim) => {
                                if (attrib.claimURI === "urn:scim:wso2:schema:" + attributeName) {
                                    availability.set("SCIM", false);
                                }
                            });
                        });
                }
            }

            return availability;
        },
        createCustomDialect: true,
        createWizard: {
            checkOIDCAvailability: true,
            checkSCIMAvailability: true,
            customWIzard: true,
            identifyAsCustomAttrib: true,
            showDisplayOrder: false,
            showOnlyMandatory: true,
            showPrimaryUserStore: false,
            showReadOnlyAttribute: false,
            showRegularExpression: false,
            showSummary: false
        },
        customDialectURI: "urn:scim:wso2:schema",
        getDialect: async (dialectURI: string): Promise<Claim | ClaimDialect> => {
            let dialectObject: Claim | ClaimDialect;

            await getDialects()
                .then((response: Claim[] | ClaimDialect[]) => {
                    response.map((dialect: Claim | ClaimDialect) => {
                        if (dialect.dialectURI === dialectURI) {
                            dialectObject = dialect;
                        }
                    });
                });

            return Promise.resolve(dialectObject);
        },
        isSCIMCustomDialectAvailable: async (): Promise<string> => {
            let dialectID: string = "";

            await getDialects()
                .then((response: Claim[] | ClaimDialect[]) => {
                    response.map((dialect: Claim | ClaimDialect) => {
                        if (dialect.dialectURI === "urn:scim:wso2:schema") {
                            dialectID = dialect.id;
                        }
                    });
                });

            return Promise.resolve(dialectID);
        },
        isUserStoresHidden: async (hiddenUserStores: string[]): Promise<UserStoreListItem[]> => {
            const userStores: UserStoreListItem[] = [];

            await getUserStoreList().then((response: AxiosResponse) => {

                response.data.map((store: UserStoreListItem) => {
                    if (!hiddenUserStores.includes(store.name)) {
                        userStores.push(store);
                    }
                });

            });

            return Promise.resolve(userStores);
        },
        mapClaimToCustomDialect: true,
        oidcDialectURI: "http://wso2.org/oidc/claim"
    },
    showCustomAttributeMapping: true,
    showCustomDialectInSCIM: true,
    systemClaims: [
        "http://wso2.org/claims/externalid",
        "http://wso2.org/claims/userid",
        "http://wso2.org/claims/created",
        "http://wso2.org/claims/modified",
        "http://wso2.org/claims/location",
        "http://wso2.org/claims/resourceType",
        "http://wso2.org/claims/metadata.version",
        "http://wso2.org/claims/username",
        "http://wso2.org/claims/emailaddress"
    ]
};
