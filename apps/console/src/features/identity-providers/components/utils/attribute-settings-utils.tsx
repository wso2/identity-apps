/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { getAllLocalClaims } from "@wso2is/core/api";
import { AlertLevels, Claim } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import find from "lodash-es/find";
import isEmpty from "lodash-es/isEmpty";
import { handleUpdateIDPRoleMappingsError } from "./common-utils";
import { store } from "../../../core";
import { updateClaimsConfigs, updateIDPRoleMappings } from "../../api";
import {
    IdentityProviderClaimInterface,
    IdentityProviderClaimMappingInterface,
    IdentityProviderClaimsInterface,
    IdentityProviderCommonClaimMappingInterface,
    IdentityProviderProvisioningClaimInterface,
    IdentityProviderRoleMappingInterface,
    IdentityProviderRolesInterface
} from "../../models";

export interface DropdownOptionsInterface {
    key: string;
    text: string;
    value: string;
}

export const LocalDialectURI = "http://wso2.org/claims";

export const getLocalDialectURI = (): string => {

    let localDialect = "http://wso2.org/claims";

    getAllLocalClaims(null)
        .then((response) => {
            const retrieved = response.slice(0, 1)[0].dialectURI;

            if (!isEmpty(retrieved)) {
                localDialect = retrieved;
            }
        })
        .catch((error) => {
            handleGetAllLocalClaimsError(error);
        });

    return localDialect;
};

/**
 * Given a local claim it will test whether it
 * contains `identity` in the claim attribute.
 */
export const isLocalIdentityClaim = (claim: string): boolean => {
    return /identity/.test(claim);
};

export const createDropdownOption = (selectedClaimsWithMapping: IdentityProviderCommonClaimMappingInterface[],
    availableLocalClaims: IdentityProviderClaimInterface[]):
    DropdownOptionsInterface[] => {
    return isEmpty(selectedClaimsWithMapping) ?
        availableLocalClaims.map((element: IdentityProviderClaimInterface): DropdownOptionsInterface => {
            if (element?.uri) {
                return {
                    key: element.id,
                    text: element.uri,
                    value: element.uri
                } as DropdownOptionsInterface;
            }
        })
        : selectedClaimsWithMapping.map(
            (mapping: IdentityProviderCommonClaimMappingInterface): DropdownOptionsInterface => {
                if (mapping?.mappedValue) {
                    return {
                        key: mapping?.claim?.id,
                        text: mapping?.mappedValue,
                        value: mapping?.mappedValue
                    } as DropdownOptionsInterface;
                }
            }
        );
};

export const buildProvisioningClaimList = (claimMappings: IdentityProviderCommonClaimMappingInterface[],
    availableLocalClaims: IdentityProviderClaimInterface[]):
    IdentityProviderClaimInterface[] => {
    return isEmpty(claimMappings) ? availableLocalClaims : claimMappings?.map(
        (claimMapping: IdentityProviderCommonClaimMappingInterface): IdentityProviderClaimInterface => {
            return {
                displayName: claimMapping.mappedValue,
                id: claimMapping.claim.id,
                uri: claimMapping.mappedValue
            } as IdentityProviderClaimInterface;
        });
};

export const isClaimExistsInIdPClaims = (mapping: IdentityProviderCommonClaimMappingInterface,
    selectedClaimsWithMapping: IdentityProviderCommonClaimMappingInterface[]): boolean => {
    // Mapped value of the selectedClaim is non-other than IdP's claim uri.
    return find(selectedClaimsWithMapping, element => element.mappedValue === mapping.claim.uri) !== undefined;
};

export const updateAvailableLocalClaims = (setAvailableLocalClaims): void => {
    getAllLocalClaims(null)
        .then((response: Claim[]) => {
            setAvailableLocalClaims(response?.map(claim => {
                return {
                    displayName: claim.displayName,
                    id: claim.id,
                    uri: claim.claimURI
                } as IdentityProviderClaimInterface;
            }));
        })
        .catch((error) => {
            handleGetAllLocalClaimsError(error);
        });
};

export const initSelectedClaimMappings = (initialClaims, setSelectedClaimsWithMapping) => {
    setSelectedClaimsWithMapping(
        initialClaims?.mappings?.map((element: IdentityProviderClaimMappingInterface) => {
            return {
                claim: element.localClaim,
                mappedValue: element.idpClaim
            } as IdentityProviderCommonClaimMappingInterface;
        })
    );
};

export const initSelectedProvisioningClaimsWithDefaultValues = (initialClaims,
    setSelectedProvisioningClaimsWithDefaultValue) => {
    setSelectedProvisioningClaimsWithDefaultValue(
        initialClaims?.provisioningClaims?.map((element: IdentityProviderProvisioningClaimInterface) => {
            return {
                claim: {
                    displayName: element?.claim?.uri,
                    id: element?.claim?.uri,
                    uri: element?.claim?.uri
                },
                mappedValue: element.defaultValue
            } as IdentityProviderCommonClaimMappingInterface;
        })
    );
};

export const initSubjectAndRoleURIs = (initialClaims, setSubjectClaimUri, setRoleClaimUri) => {
    setSubjectClaimUri(initialClaims?.userIdClaim?.uri);
    setRoleClaimUri(initialClaims?.roleClaim?.uri);
};

export const handleAttributeSettingsFormSubmit = (idpId: string, values: IdentityProviderClaimsInterface,
    roleMapping: IdentityProviderRoleMappingInterface[],
    onUpdate: (idpId: string) => void): Promise<void> => {

    return updateClaimsConfigs(idpId, values)
        .then(() => {
            onUpdate(idpId);
            // Update IDP Role Mappings on Successful Claim Config Update.
            updateIDPRoleMappings(idpId, {
                mappings: roleMapping,
                outboundProvisioningRoles: [ "" ]
            } as IdentityProviderRolesInterface
            ).then(() => {
                onUpdate(idpId);
                // Show single alert message when both requests are successfully completed.
                store.dispatch(addAlert({
                    description: I18n.instance.t("console:develop.features.authenticationProvider." +
                            "notifications.updateAttributes.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: I18n.instance.t("console:develop.features.authenticationProvider." +
                            "notifications.updateAttributes." +
                            "success.message")
                }));
            }).catch(error => {
                handleUpdateIDPRoleMappingsError(error);
            });
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.description) {
                store.dispatch(addAlert({
                    description: I18n.instance.t("console:develop.features.authenticationProvider.notifications." +
                        "updateClaimsConfigs.error.description",
                    { description: error.response.data.description }),
                    level: AlertLevels.ERROR,
                    message: I18n.instance.t("console:develop.features.authenticationProvider" +
                        ".notifications.updateClaimsConfigs." +
                        "error.message")
                }));
            }

            store.dispatch(addAlert({
                description: I18n.instance.t("console:develop.features.authenticationProvider.notifications." +
                    "updateClaimsConfigs.genericError.description"),
                level: AlertLevels.ERROR,
                message: I18n.instance.t("console:develop.features.authenticationProvider.notifications." +
                    "updateClaimsConfigs.genericError.message")
            }));
        });
};

export const handleGetAllLocalClaimsError = (error) => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(addAlert({
            description: I18n.instance.t("console:develop.features.authenticationProvider" +
                ".notifications.getAllLocalClaims." +
                "error.description",
            { description: error.response.data.description }),
            level: AlertLevels.ERROR,
            message: I18n.instance.t("console:develop.features.authenticationProvider" +
                ".notifications.getAllLocalClaims.error.message")
        }));
    }

    store.dispatch(addAlert({
        description: I18n.instance.t("console:develop.features.authenticationProvider." +
            "notifications.getAllLocalClaims." +
            "genericError.description"),
        level: AlertLevels.ERROR,
        message: I18n.instance.t("console:develop.features.authenticationProvider.notifications." +
            "getAllLocalClaims.genericError.message")
    }));
};
