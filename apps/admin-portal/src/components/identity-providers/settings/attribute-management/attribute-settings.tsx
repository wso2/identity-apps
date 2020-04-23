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
import { AdvanceAttributeSettings } from "./advance-attribute-settings";
import { AttributeSelection } from "./attribute-selection";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Button, Grid } from "semantic-ui-react";
import { getAllLocalClaims } from "../../../../api/";
import {
    Claim,
    IdentityProviderClaimInterface,
    IdentityProviderClaimMappingInterface,
    IdentityProviderClaimsInterface,
    IdentityProviderCommonClaimMappingInterface,
    IdentityProviderRoleMappingInterface
} from "../../../../models";
import { useDispatch } from "react-redux";
import _, { isEmpty } from "lodash";


export interface DropdownOptionsInterface {
    key: string;
    text: string;
    value: string;
}


interface AttributeSelectionPropsInterface {
    /**
     * Currently editing idp id.
     */
    idpId: string;

    /**
     * Claims of the IDP
     */
    initialClaims?: IdentityProviderClaimsInterface;

    /**
     * Roles of the IDP
     */
    initialRoleMappings?: IdentityProviderRoleMappingInterface[];

    /**
     * Outbound provisioning roles of the IDP
     */
    outboundProvisioningRoles?: string[];
}

export const getLocalDialectURI = (): string => {

    let localDialect = "http://wso2.org/claims";
    getAllLocalClaims(null)
        .then((response) => {
            // setClaims(response.slice(0, 10));
            const retrieved = response.slice(0, 1)[0].dialectURI;
            if (!isEmpty(retrieved)) {
                localDialect = retrieved;
            }
        });
    return localDialect;
};

export const LocalDialectURI = "http://wso2.org/claims";

export const AttributeSettings: FunctionComponent<AttributeSelectionPropsInterface> = (
    props
): ReactElement => {

    const {
        idpId,
        initialClaims,
        outboundProvisioningRoles,
        initialRoleMappings
    } = props;

    const dispatch = useDispatch();

    // Manage Local Dialect URI
    const [localDialectURI, setLocalDialectURI] = useState("");

    // Manage available local claims.
    const [availableLocalClaims, setAvailableLocalClaims] = useState<IdentityProviderClaimInterface[]>([]);

    // Selected local claims in claim mapping.
    const [selectedClaimsWithMapping, setSelectedClaimsWithMapping]
        = useState<IdentityProviderCommonClaimMappingInterface[]>([]);

    // Selected provisioning claims.
    const [selectedProvisioningClaimsWithDefaultValue, setSelectedProvisioningClaimsWithDefaultValue]
        = useState<IdentityProviderCommonClaimMappingInterface[]>([]);

    // Selected subject.
    const [subjectClaimUri, setSubjectClaimUri] = useState<string>();

    // Selected role.
    const [roleClaimUri, setRoleClaimUri] = useState<string>();

    const getClaims = () => {
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
                dispatch(addAlert({
                    description: "An error occurred while retrieving local claims.",
                    level: AlertLevels.ERROR,
                    message: "Get Error"
                }));
            });
    };

    // Set local claim URI and maintain it in a state
    const findLocalClaimDialectURI = () => {
        if (isEmpty(localDialectURI)) {
            setLocalDialectURI(getLocalDialectURI());
        }
    };

    const createDropdownOption = (): DropdownOptionsInterface[] => {
        return isEmpty(selectedClaimsWithMapping) ?
            availableLocalClaims.map((element: IdentityProviderClaimInterface): DropdownOptionsInterface => {
                return {
                    key: element.id,
                    text: element.uri,
                    value: element.uri
                } as DropdownOptionsInterface;
            })
            : selectedClaimsWithMapping.map((mapping: IdentityProviderCommonClaimMappingInterface):
            DropdownOptionsInterface => {
                    return {
                        key: mapping?.claim?.id,
                        text: mapping?.mappedValue,
                        value: mapping?.mappedValue
                    } as DropdownOptionsInterface;
            })
    };

    useEffect(() => {
        getClaims();
        findLocalClaimDialectURI();
    }, []);

    const setInitialValues = () => {
        setSubjectClaimUri(initialClaims?.userIdClaim?.uri);
        setRoleClaimUri(initialClaims?.roleClaim?.uri);

        if (isEmpty(initialClaims?.mappings)) {
            setSelectedClaimsWithMapping([]);
            return;
        }

        setSelectedClaimsWithMapping(
            initialClaims.mappings.map((element: IdentityProviderClaimMappingInterface) => {
                return {
                    claim: element.localClaim,
                    mappedValue: element.idpClaim
                } as IdentityProviderCommonClaimMappingInterface;
            })
        );
    };

    /**
     * Set initial value for claim mapping.
     */
    useEffect(() => {
        if (isEmpty(availableLocalClaims) || isEmpty(localDialectURI)) {
            return;
        }
        setInitialValues();
    }, [availableLocalClaims, localDialectURI]);


    const getIdPClaims = (claimMappings: IdentityProviderCommonClaimMappingInterface[]):
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

    useEffect(() => {
        if (!_.isEmpty(selectedClaimsWithMapping)) {
            setSelectedProvisioningClaimsWithDefaultValue(selectedProvisioningClaimsWithDefaultValue.filter(element =>
                selectedClaimsWithMapping.find(claimMapping => claimMapping.claim.uri === element.claim.uri)));
        } else {
            setSelectedProvisioningClaimsWithDefaultValue(selectedProvisioningClaimsWithDefaultValue.filter(element =>
                availableLocalClaims.find(claim => claim.uri === element.claim.uri)));
        }
    }, [selectedClaimsWithMapping]);

    return (
            <Grid className="claim-mapping">
                {/* Select attributes for mapping. */}
                {
                    selectedClaimsWithMapping &&
                    <AttributeSelection
                        attributeList={ availableLocalClaims }
                        selectedAttributesWithMapping={ selectedClaimsWithMapping }
                        setSelectedAttributesWithMapping={ setSelectedClaimsWithMapping }
                        hint={ "Add attributes supported by Identity Provider" }
                        attributeMapColumnHeader={ "Identity Provider Attribute" }
                        attributeMapInputPlaceholderPrefix={ "eg: IdP's attribute for " }
                        enablePrecedingDivider={ false }
                        componentHeading={ "Attribute Mapping" }
                    />
                }

                { selectedClaimsWithMapping &&
                    <AdvanceAttributeSettings
                        dropDownOptions={ createDropdownOption() }
                        initialRole={ initialClaims?.userIdClaim }
                        initialSubject={ initialClaims?.roleClaim }
                        claimMappingOn={ !isEmpty(selectedClaimsWithMapping) }
                        updateRole={ setRoleClaimUri }
                        updateSubject={ setSubjectClaimUri }
                    />
                }

                {/* Select attributes for provisioning. */}
                { selectedClaimsWithMapping && selectedProvisioningClaimsWithDefaultValue &&
                    <AttributeSelection
                        attributeList={ getIdPClaims(selectedClaimsWithMapping) }
                        selectedAttributesWithMapping={ selectedProvisioningClaimsWithDefaultValue }
                        setSelectedAttributesWithMapping={ setSelectedProvisioningClaimsWithDefaultValue }
                        hint={ "Specify required attributes for provisioning" }
                        attributeMapColumnHeader={ "Default Value" }
                        attributeMapInputPlaceholderPrefix={ "eg: a default value for the " }
                        enablePrecedingDivider={ true }
                        componentHeading={ "Provisioning Attributes" }
                    />
                }

                {/*<RoleMapping*/}
                {/*    submitState={ triggerAdvanceSettingFormSubmission }*/}
                {/*    onSubmit={ setRoleMapping }*/}
                {/*    initialMappings={ initialRoleMappings }*/}
                {/*/>*/}
                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 3 }>
                        <Button
                            primary
                            size="small"
                            onClick={ () => { console.log("fix here") } }
                        >
                            Update
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
    );
};
