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
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import _ from "lodash";
import { Dispatch } from "redux";
import { getAllLocalClaims, updateClaimsConfigs, updateIDPRoleMappings } from "../../../api";
import {
    Claim,
    IdentityProviderClaimInterface,
    IdentityProviderClaimMappingInterface,
    IdentityProviderClaimsInterface,
    IdentityProviderCommonClaimMappingInterface,
    IdentityProviderProvisioningClaimInterface,
    IdentityProviderRoleMappingInterface,
    IdentityProviderRolesInterface
} from "../../../models";

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
            if (!_.isEmpty(retrieved)) {
                localDialect = retrieved;
            }
        });
    return localDialect;
};

export const createDropdownOption = (selectedClaimsWithMapping: IdentityProviderCommonClaimMappingInterface[],
                                     availableLocalClaims: IdentityProviderClaimInterface[]):
    DropdownOptionsInterface[] => {
    return _.isEmpty(selectedClaimsWithMapping) ?
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
        )
};

export const buildProvisioningClaimList = (claimMappings: IdentityProviderCommonClaimMappingInterface[],
                                           availableLocalClaims: IdentityProviderClaimInterface[]):
    IdentityProviderClaimInterface[] => {
    return _.isEmpty(claimMappings) ? availableLocalClaims : claimMappings?.map(
        (claimMapping: IdentityProviderCommonClaimMappingInterface): IdentityProviderClaimInterface => {
            return {
                displayName: claimMapping.mappedValue,
                id: claimMapping.claim.id,
                uri: claimMapping.mappedValue
            } as IdentityProviderClaimInterface;
        });
};

export const isClaimExistsInIdPClaims = (mapping: IdentityProviderCommonClaimMappingInterface,
                                         selectedClaimsWithMapping: IdentityProviderCommonClaimMappingInterface[]) => {
    // Mapped value of the selectedClaim is non-other than IdP's claim uri.
    return _.find(selectedClaimsWithMapping, element => element.mappedValue === mapping.claim.uri) !== undefined;
}

export const updateAvailableLocalClaims = (setAvailableLocalClaims, dispatch) => {
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
        .catch(() => {
            dispatch(addAlert({
                description: "An error occurred while retrieving local claims.",
                level: AlertLevels.ERROR,
                message: "Get Error"
            }));
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
}

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
}

export const initSubjectAndRoleURIs = (initialClaims, setSubjectClaimUri, setRoleClaimUri) => {
    setSubjectClaimUri(initialClaims?.userIdClaim?.uri);
    setRoleClaimUri(initialClaims?.roleClaim?.uri);
}

export const handleAttributeSettingsFormSubmit = (idpId: string, values: IdentityProviderClaimsInterface,
                                                  roleMapping: IdentityProviderRoleMappingInterface[],
                                                  onUpdate: (idpId: string) => void, dispatch: Dispatch<any>): void => {
    updateClaimsConfigs(idpId, values)
        .then(() => {
            dispatch(addAlert({
                description: "Successfully updated attribute configurations.",
                level: AlertLevels.SUCCESS,
                message: "Update successful"
            }));
            onUpdate(idpId);
        })
        .catch(() => {
            dispatch(addAlert({
                description: "An error occurred while the updating claims configurations.",
                level: AlertLevels.ERROR,
                message: "Update error"
            }));
        });

    updateIDPRoleMappings(idpId, {
            mappings: roleMapping,
            outboundProvisioningRoles: [""]
        } as IdentityProviderRolesInterface
    ).then(() => {
        dispatch(addAlert(
            {
                description: "Successfully updated role mapping configurations.",
                level: AlertLevels.SUCCESS,
                message: "Update successful"
            }
        ));
        onUpdate(idpId);
    }).catch(error => {
        dispatch(addAlert(
            {
                description: error?.description || "There was an error while updating role configurations",
                level: AlertLevels.ERROR,
                message: "Update error"
            }
        ));
    })
};
