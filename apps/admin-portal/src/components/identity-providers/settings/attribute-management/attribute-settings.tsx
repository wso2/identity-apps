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
import { useTrigger } from "@wso2is/forms";
import { ContentLoader } from "@wso2is/react-components";
import _, { isEmpty } from "lodash";
import {bool, element} from "prop-types";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Grid } from "semantic-ui-react";
import { AdvanceAttributeSettings } from "./advance-attribute-settings";
import { AttributeSelection } from "./attribute-selection";
import { updateClaimsConfigs, updateJITProvisioningConfigs } from "../../../../api";
import {
    IdentityProviderClaimInterface,
    IdentityProviderClaimMappingInterface,
    IdentityProviderClaimsInterface,
    IdentityProviderCommonClaimMappingInterface,
    IdentityProviderProvisioningClaimInterface,
    IdentityProviderRoleMappingInterface
} from "../../../../models";
import {
    buildProvisioningClaimList,
    createDropdownOption,
    initSelectedClaimMappings,
    initSelectedProvisioningClaimsWithDefaultValues,
    initSubjectAndRoleURIs,
    isClaimExistsInIdPClaims,
    updateAvailableLocalClaims
} from "../../utils";


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

    /**
     * Is the idp info request loading.
     */
    isLoading?: boolean;

    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string) => void;
}

export const LocalDialectURI = "http://wso2.org/claims";

export const AttributeSettings: FunctionComponent<AttributeSelectionPropsInterface> = (
    props
): ReactElement => {

    const {
        idpId,
        initialClaims,
        outboundProvisioningRoles,
        initialRoleMappings,
        isLoading,
        onUpdate
    } = props;

    const dispatch = useDispatch();

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

    // Trigger advanced settings field to enforce validations.
    const [triggerAdvanceOptionsValidations, setTriggerAdvanceOptionsValidations] = useTrigger();

    useEffect(() => {
        updateAvailableLocalClaims(setAvailableLocalClaims, dispatch);
    }, []);

    const setInitialValues = () => {
        // Initial values for subject and role.
        initSubjectAndRoleURIs(initialClaims, setSubjectClaimUri, setRoleClaimUri);

        // Initial values for selected claim mappings.
        initSelectedClaimMappings(initialClaims, setSelectedClaimsWithMapping);

        // Initial values for selected provisioning claims and it's default values.
        initSelectedProvisioningClaimsWithDefaultValues(initialClaims, setSelectedProvisioningClaimsWithDefaultValue);
    };

    /**
     * Set initial value for claim mapping.
     */
    useEffect(() => {
        if (isEmpty(availableLocalClaims)) {
            return;
        }
        setInitialValues();
    }, [availableLocalClaims]);

    useEffect(() => {
        // Provisioning claims depend on the IdP claim mapping since they exists in the namespace of mapped values. The
        // only exception occur when there are no claim mappings. In this case, provisioning claims needs to fall back
        // to local claims.
        if (_.isEmpty(selectedClaimsWithMapping)) {
            // Set provisioning claims.
            setSelectedProvisioningClaimsWithDefaultValue(selectedProvisioningClaimsWithDefaultValue.filter(element =>
                availableLocalClaims.find(claim => claim.id === element.claim.id)));

            // Set subject URI.
            if (_.isEmpty(availableLocalClaims?.find(element => element.uri === subjectClaimUri))) {
                setSubjectClaimUri("");
            }
        } else {
            setSelectedProvisioningClaimsWithDefaultValue(selectedProvisioningClaimsWithDefaultValue.filter(
                claimWithDefaultValue => isClaimExistsInIdPClaims(claimWithDefaultValue, selectedClaimsWithMapping)));

            // Set role URI.
            if (_.isEmpty(selectedClaimsWithMapping?.find(element => element.mappedValue === roleClaimUri))) {
                setRoleClaimUri("");
            }

            // Set subject URI.
            if (_.isEmpty(selectedClaimsWithMapping?.find(element => element.mappedValue === subjectClaimUri))) {
                setSubjectClaimUri("");
            }
        }
    }, [selectedClaimsWithMapping]);

    const handleUpdateButton = () => {

        let canSubmit = true;
        const claimConfigurations: IdentityProviderClaimsInterface = { ...initialClaims };

        // Prepare claim mapping for submission.
        if (!_.isEmpty(selectedClaimsWithMapping?.filter(element => _.isEmpty(element.mappedValue)))) {
            canSubmit = false;
        }
        claimConfigurations["mappings"] = selectedClaimsWithMapping.map(element => {
            return {
                idpClaim: element.mappedValue,
                localClaim: element.claim
            } as IdentityProviderClaimMappingInterface;
        });

        // Prepare provisioning claims for submission.
        if (!_.isEmpty(selectedProvisioningClaimsWithDefaultValue?.filter(element => _.isEmpty(element.mappedValue)))) {
            canSubmit = false;
        }
        claimConfigurations["provisioningClaims"] = selectedProvisioningClaimsWithDefaultValue.map(element => {
            return {
                claim: element.claim,
                defaultValue: element.mappedValue
            } as IdentityProviderProvisioningClaimInterface;
        });

        // Prepare subject for submission.
        if (_.isEmpty(subjectClaimUri)) {
            // Trigger form field validation on the empty subject uri.
            setTriggerAdvanceOptionsValidations();
            canSubmit = false;
        }
        const matchingLocalClaim = availableLocalClaims.find(element => element.uri === subjectClaimUri);
        claimConfigurations["userIdClaim"] = matchingLocalClaim ? matchingLocalClaim : { uri: subjectClaimUri } as
            IdentityProviderClaimInterface;

        // Prepare role for submission.
        if (!_.isEmpty(selectedClaimsWithMapping)) {
            if (_.isEmpty(roleClaimUri)) {
                // Trigger form field validation on the empty subject uri.
                setTriggerAdvanceOptionsValidations();
                canSubmit = false;
            }
            const matchingLocalClaim = availableLocalClaims.find(element => element.uri === roleClaimUri);
            claimConfigurations["roleClaim"] = matchingLocalClaim ? matchingLocalClaim : { uri: roleClaimUri } as
                IdentityProviderClaimInterface;
        }

        if (canSubmit) {
            handleAttributeSettingsFormSubmit(claimConfigurations);
        }
    };

    const handleAttributeSettingsFormSubmit = (values: IdentityProviderClaimsInterface): void => {
        updateClaimsConfigs(idpId, values)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated claims configurations.",
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
    };

    return (
        !isLoading ?
        <Grid className="attributes-settings">
            {/* Select attributes for mapping. */}
            {selectedClaimsWithMapping &&
            <AttributeSelection
                attributeList={ availableLocalClaims }
                selectedAttributesWithMapping={ selectedClaimsWithMapping }
                setSelectedAttributesWithMapping={ setSelectedClaimsWithMapping }
                uiProps={ {
                    attributeColumnHeader: "Attribute",
                    attributeMapColumnHeader: "Identity provider attribute",
                    attributeMapInputPlaceholderPrefix: "eg: IdP's attribute for ",
                    componentHeading: "Attributes Mapping",
                    enablePrecedingDivider: false,
                    hint: "Add attributes supported by Identity Provider"
                } }
            />
            }

            { selectedClaimsWithMapping &&
            <AdvanceAttributeSettings
                dropDownOptions={ createDropdownOption(selectedClaimsWithMapping, availableLocalClaims).filter(
                    element => !_.isEmpty(element)) }
                initialRoleUri={ roleClaimUri }
                initialSubjectUri={ subjectClaimUri }
                claimMappingOn={ !isEmpty(selectedClaimsWithMapping) }
                updateRole={ setRoleClaimUri }
                updateSubject={ setSubjectClaimUri }
                triggerSubmit={ triggerAdvanceOptionsValidations }
            />
            }

            {/* Select attributes for provisioning. */}
            {selectedProvisioningClaimsWithDefaultValue &&
            <AttributeSelection
                attributeList={ buildProvisioningClaimList(selectedClaimsWithMapping, availableLocalClaims).filter(
                    element => !_.isEmpty(element?.uri)) }
                selectedAttributesWithMapping={ selectedProvisioningClaimsWithDefaultValue }
                setSelectedAttributesWithMapping={ setSelectedProvisioningClaimsWithDefaultValue }
                uiProps={ {
                    attributeColumnHeader: _.isEmpty(selectedClaimsWithMapping) ? "Attribute" : "Identity " +
                        "provider attribute",
                    attributeMapColumnHeader: "Default value",
                    attributeMapInputPlaceholderPrefix: "eg: a default value for the ",
                    componentHeading: "Provisioning Attributes Selection",
                    enablePrecedingDivider: true,
                    hint: "Specify required attributes for provisioning"
                } }
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
                        onClick={ handleUpdateButton }
                    >
                        Update
                    </Button>
                </Grid.Column>
            </Grid.Row>
        </Grid> : <ContentLoader/>
    );
};
