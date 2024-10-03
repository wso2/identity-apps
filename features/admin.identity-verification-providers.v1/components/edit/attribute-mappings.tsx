/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import {
    IdVPClaimMappingInterface,
    IdVPClaimsInterface,
    IdentityVerificationProviderInterface
} from "../../models/identity-verification-providers";
import { AttributeSettings } from "../edit/attribute-mapping/attribute-settings";

interface AttributeMappingsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Editing IdVP.
     */
    identityVerificationProvider: IdentityVerificationProviderInterface;
    /**
     * Callback to handle IdVP update.
     *
     * @param data - Updated data.
     */
    handleUpdate: (data: IdentityVerificationProviderInterface, callback: () => void) => void;
    /**
     * List of mandatory claims.
     */
    mandatoryClaims: IdVPClaimsInterface[];
    /**
     * Whether data is loading or not.
     */
    isLoading?: boolean;
    /**
     * Whether the view is read only or not.
     */
    isReadOnly?: boolean;
}

const AttributeMappings: FunctionComponent<AttributeMappingsPropsInterface> = (
    {
        identityVerificationProvider,
        handleUpdate,
        mandatoryClaims,
        isLoading = false,
        isReadOnly = false,
        ["data-componentid"]: componentId = "idvp-edit-attribute-mappings"
    }: AttributeMappingsPropsInterface
): ReactElement => {

    const initialClaims: IdVPClaimMappingInterface[] = useMemo(() => {
        if (!identityVerificationProvider) {
            return [];
        }

        return identityVerificationProvider.claims.map(
            (claim: IdVPClaimsInterface) => {
                return {
                    idvpClaim: claim.idvpClaim,
                    localClaim: { uri: claim.localClaim }
                };
            });
    }, [ identityVerificationProvider ]);

    return (
        <AttributeSettings
            idvp={ identityVerificationProvider }
            initialClaims={ initialClaims }
            isLoading={ isLoading }
            handleUpdate={ handleUpdate }
            hideIdentityClaimAttributes={ true }
            data-componentid={ componentId }
            isReadOnly={ isReadOnly }
            mandatoryClaims={ mandatoryClaims }
        />
    );
};

export default AttributeMappings;
