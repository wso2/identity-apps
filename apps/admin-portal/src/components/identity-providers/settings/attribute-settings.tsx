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
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Grid } from "semantic-ui-react";
import { AttributeSelection, RoleMappingSettings, UriAttributesSettings } from "./attribute-management";
import {
    IdentityProviderClaimInterface,
    IdentityProviderClaimMappingInterface,
    IdentityProviderClaimsInterface,
    IdentityProviderCommonClaimMappingInterface,
    IdentityProviderProvisioningClaimInterface,
    IdentityProviderRoleMappingInterface
} from "../../../models";
import {
    buildProvisioningClaimList,
    createDropdownOption,
    handleAttributeSettingsFormSubmit,
    initSelectedClaimMappings,
    initSelectedProvisioningClaimsWithDefaultValues,
    initSubjectAndRoleURIs,
    isClaimExistsInIdPClaims,
    updateAvailableLocalClaims
} from "../utils";


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

    // Selected role mapping.
    const [roleMapping, setRoleMapping] = useState<IdentityProviderRoleMappingInterface[]>(undefined);

    // Trigger uri settings fields to enforce validations.
    const [triggerUriOptionsValidations, setTriggerUriOptionsValidations] = useTrigger();

    // Trigger role mapping field to submission.
    const [triggerSubmission, setTriggerSubmission] = useTrigger();

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
        // Provisioning claims, subject URI and role UR depend on the IdP claim mapping unless there are no claim
        // mappings configured. In this case, they need to fall back to local claims.
        if (_.isEmpty(selectedClaimsWithMapping)) {
            // Set provisioning claims.
            setSelectedProvisioningClaimsWithDefaultValue(selectedProvisioningClaimsWithDefaultValue.filter(element =>
                availableLocalClaims.find(claim => claim.uri === element.claim.uri)));

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

    const handleAttributesUpdate = () => {

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
            setTriggerUriOptionsValidations();
            canSubmit = false;
        }
        const matchingLocalClaim = availableLocalClaims.find(element => element.uri === subjectClaimUri);
        claimConfigurations["userIdClaim"] = matchingLocalClaim ? matchingLocalClaim : { uri: subjectClaimUri } as
            IdentityProviderClaimInterface;

        // Prepare role for submission.
        if (!_.isEmpty(selectedClaimsWithMapping)) {
            if (_.isEmpty(roleClaimUri)) {
                // Trigger form field validation on the empty subject uri.
                setTriggerUriOptionsValidations();
                canSubmit = false;
            }
            const matchingLocalClaim = availableLocalClaims.find(element => element.uri === roleClaimUri);
            claimConfigurations["roleClaim"] = matchingLocalClaim ? matchingLocalClaim : { uri: roleClaimUri } as
                IdentityProviderClaimInterface;
        }

        if (canSubmit) {
            handleAttributeSettingsFormSubmit(idpId, claimConfigurations, roleMapping, onUpdate, dispatch);
        } else {
            dispatch(addAlert(
                {
                    description: "Need to configure all the mandatory properties.",
                    level: AlertLevels.WARNING,
                    message: "Cannot perform update"
                }
            ));
        }
    };

    useEffect(() => {
        if (roleMapping == undefined) {
            return;
        }
        handleAttributesUpdate();
    }, [roleMapping]);

    return (
        !isLoading ?
            <Grid className="attributes-settings">
                {/* Select attributes for mapping. */}
                { selectedClaimsWithMapping &&
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
                /> }

                { selectedClaimsWithMapping &&
                <UriAttributesSettings
                    dropDownOptions={ createDropdownOption(selectedClaimsWithMapping, availableLocalClaims).filter(
                        element => !_.isEmpty(element)) }
                    initialRoleUri={ roleClaimUri }
                    initialSubjectUri={ subjectClaimUri }
                    claimMappingOn={ !isEmpty(selectedClaimsWithMapping) }
                    updateRole={ setRoleClaimUri }
                    updateSubject={ setSubjectClaimUri }
                    triggerSubmit={ triggerUriOptionsValidations }
                /> }

                {/* Select attributes for provisioning. */}
                { selectedProvisioningClaimsWithDefaultValue &&
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
                /> }

                {/* Set role mappings. */}
                <RoleMappingSettings
                    triggerSubmit={ triggerSubmission }
                    initialRoleMappings={ initialRoleMappings }
                    onSubmit={ setRoleMapping }
                />

                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 3 }>
                        <Button
                            primary
                            size="small"
                            onClick={ setTriggerSubmission }
                        >
                            Update
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid> : <ContentLoader/>
    );
};
