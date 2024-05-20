/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { store } from "@wso2is/admin.core.v1";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import { AxiosError } from "axios";
import find from "lodash-es/find";
import isEmpty from "lodash-es/isEmpty";
import { Dispatch, SetStateAction } from "react";
import { handleUpdateIDPRoleMappingsError } from "./connection-utils";
import { updateClaimsConfigs, updateConnectionRoleMappings } from "../api/connections";
import {
    ConnectionClaimInterface,
    ConnectionClaimMappingInterface,
    ConnectionClaimsInterface,
    ConnectionCommonClaimMappingInterface,
    ConnectionProvisioningClaimInterface,
    ConnectionRoleMappingInterface,
    ConnectionRolesInterface
} from "../models/connection";

/**
 * Interface for the dropdown options.
 */
export interface DropdownOptionsInterface {
    key: string;
    text: string;
    value: string;
}

/**
 * Build the claim list for the attribute settings form.
 */
export const buildProvisioningClaimList = (claimMappings: ConnectionCommonClaimMappingInterface[],
    availableLocalClaims: ConnectionClaimInterface[]): ConnectionClaimInterface[] => {

    return isEmpty(claimMappings)
        ? availableLocalClaims
        : claimMappings?.map(
            (claimMapping: ConnectionCommonClaimMappingInterface): ConnectionClaimInterface => {
                if (claimMapping?.claim?.id && claimMapping?.mappedValue) {
                    return {
                        displayName: claimMapping.mappedValue,
                        id: claimMapping.claim.id,
                        uri: claimMapping.mappedValue
                    } as ConnectionClaimInterface;
                }
            });
};

/**
 * Create dropdown options for the attribute settings form.
 */
export const createDropdownOption = (selectedClaimsWithMapping: ConnectionCommonClaimMappingInterface[],
    availableLocalClaims: ConnectionClaimInterface[]):
    DropdownOptionsInterface[] => {
    return isEmpty(selectedClaimsWithMapping) ?
        availableLocalClaims.map((element: ConnectionClaimInterface): DropdownOptionsInterface => {
            if (element?.uri) {
                return {
                    key: element.id,
                    text: element.uri,
                    value: element.uri
                } as DropdownOptionsInterface;
            }
        })
        : selectedClaimsWithMapping.map(
            (mapping: ConnectionCommonClaimMappingInterface): DropdownOptionsInterface => {
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

/**
 * Handle attribute settings form submit.
 */
export const handleAttributeSettingsFormSubmit = (connectionId: string, values: ConnectionClaimsInterface,
    roleMapping: ConnectionRoleMappingInterface[],
    onUpdate: (connectionId: string) => void): Promise<void> => {

    return updateClaimsConfigs(connectionId, values)
        .then(() => {
            onUpdate(connectionId);
            // Update Connection Role Mappings on Successful Claim Config Update.
            updateConnectionRoleMappings(connectionId, {
                mappings: roleMapping,
                outboundProvisioningRoles: [ "" ]
            } as ConnectionRolesInterface
            ).then(() => {
                onUpdate(connectionId);
                // Show single alert message when both requests are successfully completed.
                store.dispatch(addAlert({
                    description: I18n.instance.t("authenticationProvider:" +
                            "notifications.updateAttributes.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: I18n.instance.t("authenticationProvider:" +
                            "notifications.updateAttributes." +
                            "success.message")
                }));
            }).catch((error: AxiosError) => {
                handleUpdateIDPRoleMappingsError(error);
            });
        })
        .catch((error: IdentityAppsApiException) => {
            if (error.response && error.response.data && error.response.data.description) {
                store.dispatch(addAlert({
                    description: I18n.instance.t("authenticationProvider:notifications." +
                        "updateClaimsConfigs.error.description",
                    { description: error.response.data.description }),
                    level: AlertLevels.ERROR,
                    message: I18n.instance.t("authenticationProvider:" +
                        "notifications.updateClaimsConfigs." +
                        "error.message")
                }));
            }

            store.dispatch(addAlert({
                description: I18n.instance.t("authenticationProvider:notifications." +
                    "updateClaimsConfigs.genericError.description"),
                level: AlertLevels.ERROR,
                message: I18n.instance.t("authenticationProvider:notifications." +
                    "updateClaimsConfigs.genericError.message")
            }));
        });
};

/**
 * Function to handle error scenarios of get all local claims.
 */
export const handleGetAllLocalClaimsError = (error: IdentityAppsApiException): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(addAlert({
            description: I18n.instance.t("authenticationProvider:" +
                "notifications.getAllLocalClaims." +
                "error.description",
            { description: error.response.data.description }),
            level: AlertLevels.ERROR,
            message: I18n.instance.t("authenticationProvider:" +
                "notifications.getAllLocalClaims.error.message")
        }));
    }

    store.dispatch(addAlert({
        description: I18n.instance.t("authenticationProvider:" +
            "notifications.getAllLocalClaims." +
            "genericError.description"),
        level: AlertLevels.ERROR,
        message: I18n.instance.t("authenticationProvider:notifications." +
            "getAllLocalClaims.genericError.message")
    }));
};

/**
 * Function to initialize selected claims with mapping.
 */
export const initSelectedClaimMappings = (
    initialClaims: ConnectionClaimsInterface,
    setSelectedClaimsWithMapping: Dispatch<SetStateAction<ConnectionCommonClaimMappingInterface[]>>
): void => {
    setSelectedClaimsWithMapping(
        initialClaims?.mappings?.map((element: ConnectionClaimMappingInterface) => {
            return {
                claim: element.localClaim,
                mappedValue: element.idpClaim
            } as ConnectionCommonClaimMappingInterface;
        })
    );
};

/**
 * Function to initialize selected provisioning claims with default values.
 */
export const initSelectedProvisioningClaimsWithDefaultValues = (
    initialClaims: ConnectionClaimsInterface,
    setSelectedProvisioningClaimsWithDefaultValue:
        Dispatch<SetStateAction<ConnectionCommonClaimMappingInterface[]>>
): void => {
    setSelectedProvisioningClaimsWithDefaultValue(
        initialClaims?.provisioningClaims?.map((element: ConnectionProvisioningClaimInterface) => {
            return {
                claim: {
                    displayName: element?.claim?.uri,
                    id: element?.claim?.uri,
                    uri: element?.claim?.uri
                },
                mappedValue: element.defaultValue
            } as ConnectionCommonClaimMappingInterface;
        })
    );
};

/**
 * Function to initialize subject and role URIs.
 */
export const initSubjectAndRoleURIs = (
    initialClaims: ConnectionClaimsInterface,
    setSubjectClaimUri: Dispatch<SetStateAction<string>>,
    setRoleClaimUri: Dispatch<SetStateAction<string>>
): void => {
    setSubjectClaimUri(initialClaims?.userIdClaim?.uri);
    setRoleClaimUri(initialClaims?.roleClaim?.uri);
};

/**
 * Function to check if the claim exists in the selected claims with mapping.
 */
export const isClaimExistsInConnectionClaims = (mapping: ConnectionCommonClaimMappingInterface,
    selectedClaimsWithMapping: ConnectionCommonClaimMappingInterface[]): boolean => {
    // Mapped value of the selectedClaim is non-other than IdP's claim uri.
    return find(selectedClaimsWithMapping,
        (element: ConnectionCommonClaimMappingInterface) =>
            element.mappedValue === mapping.claim.uri) !== undefined;
};

/**
 * Given a local claim it will test whether it
 * contains `identity` in the claim attribute.
 */
export const isLocalIdentityClaim = (claim: string): boolean => {
    return /identity/.test(claim);
};
