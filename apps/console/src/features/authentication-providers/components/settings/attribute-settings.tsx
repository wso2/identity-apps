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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { ContentLoader, EmphasizedSegment } from "@wso2is/react-components";
import _, { isEmpty } from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
} from "../../models";
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


interface AttributeSelectionPropsInterface extends TestableComponentInterface {
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
        onUpdate,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

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

    // Sets if the form is submitting.
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    // Sets role URI error.
    const [ roleError, setRoleError ] = useState<boolean>(false);

    // Sets subject URI error.
    const [ subjectError, setSubjectError ] = useState<boolean>(false);

    // Selected role mapping.
    const [roleMapping, setRoleMapping] = useState<IdentityProviderRoleMappingInterface[]>(undefined);

    // Trigger role mapping field to submission.
    const [triggerSubmission, setTriggerSubmission] = useTrigger();

    useEffect(() => {
        updateAvailableLocalClaims(setAvailableLocalClaims);
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

        setIsSubmitting(true);

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
            setSubjectError(true);
            canSubmit = false;
        } else {
            setSubjectError(false);
        }

        const matchingLocalClaim = availableLocalClaims.find(element => element.uri === subjectClaimUri);
        claimConfigurations["userIdClaim"] = matchingLocalClaim ? matchingLocalClaim : { uri: subjectClaimUri } as
            IdentityProviderClaimInterface;

        // Prepare role for submission.
        if (!_.isEmpty(selectedClaimsWithMapping)) {
            if (_.isEmpty(roleClaimUri)) {
                // Trigger form field validation on the empty subject uri.
                setRoleError(true);
                canSubmit = false;
            } else {
                setRoleError(false);
            }
            const matchingLocalClaim = availableLocalClaims.find(element => element.uri === roleClaimUri);
            claimConfigurations["roleClaim"] = matchingLocalClaim ? matchingLocalClaim : { uri: roleClaimUri } as
                IdentityProviderClaimInterface;
        }

        if (canSubmit) {
            setIsSubmitting(false);
            handleAttributeSettingsFormSubmit(idpId, claimConfigurations, roleMapping, onUpdate);
        } else {
            dispatch(addAlert(
                {
                    description: t("console:develop.features.idp.notifications." +
                        "submitAttributeSettings.error.description"),
                    level: AlertLevels.WARNING,
                    message: t("console:develop.features.idp.notifications.submitAttributeSettings.error.message")
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
        !isLoading
            ? (
                <EmphasizedSegment>
                    <Grid className="attributes-settings">
                        {/* Select attributes for mapping. */ }
                        { selectedClaimsWithMapping &&
                        <AttributeSelection
                            attributeList={ availableLocalClaims }
                            selectedAttributesWithMapping={ selectedClaimsWithMapping }
                            setSelectedAttributesWithMapping={ setSelectedClaimsWithMapping }
                            uiProps={ {
                                attributeColumnHeader: t("console:develop.features.idp.forms.attributeSettings." +
                                    "attributeMapping.attributeColumnHeader"),
                                attributeMapColumnHeader: t("console:develop.features.idp.forms.attributeSettings." +
                                    "attributeMapping.attributeMapColumnHeader"),
                                attributeMapInputPlaceholderPrefix: t("console:develop.features.idp.forms" +
                                    ".attributeSettings.attributeMapping.attributeMapInputPlaceholderPrefix"),
                                componentHeading: t("console:develop.features.idp.forms.attributeSettings." +
                                    "attributeMapping.componentHeading"),
                                enablePrecedingDivider: false,
                                hint: t("console:develop.features.idp.forms.attributeSettings.attributeMapping.hint")
                            } }
                            data-testid={ `${ testId }-claim-attribute-selection` }
                        /> }

                        { selectedClaimsWithMapping &&
                        <UriAttributesSettings
                            dropDownOptions={
                                createDropdownOption(selectedClaimsWithMapping, availableLocalClaims)
                                    .filter(element => !_.isEmpty(element)) }
                            initialRoleUri={ roleClaimUri }
                            initialSubjectUri={ subjectClaimUri }
                            claimMappingOn={ !isEmpty(selectedClaimsWithMapping) }
                            updateRole={ setRoleClaimUri }
                            updateSubject={ setSubjectClaimUri }
                            data-testid={ `${ testId }-uri-attribute-settings` }
                            roleError={ isSubmitting && roleError && !roleClaimUri }
                            subjectError={ isSubmitting && subjectError && !subjectClaimUri }
                        /> }

                        {/* Select attributes for provisioning. */ }
                        { selectedProvisioningClaimsWithDefaultValue &&
                        <AttributeSelection
                            attributeList={
                                buildProvisioningClaimList(selectedClaimsWithMapping, availableLocalClaims)
                                    .filter(element => !_.isEmpty(element?.uri)) }
                            selectedAttributesWithMapping={ selectedProvisioningClaimsWithDefaultValue }
                            setSelectedAttributesWithMapping={ setSelectedProvisioningClaimsWithDefaultValue }
                            uiProps={ {
                                attributeColumnHeader: _.isEmpty(selectedClaimsWithMapping) ?
                                    t("console:develop.features.idp.forms.attributeSettings.attributeProvisioning." +
                                        "attributeColumnHeader.0") :
                                    t("console:develop.features.idp.forms.attributeSettings.attributeProvisioning." +
                                        "attributeColumnHeader.1"),
                                attributeMapColumnHeader: t("console:develop.features.idp.forms.attributeSettings." +
                                    "attributeProvisioning.attributeMapColumnHeader"),
                                attributeMapInputPlaceholderPrefix: t("console:develop.features.idp.forms" +
                                    ".attributeSettings.attributeProvisioning.attributeMapInputPlaceholderPrefix"),
                                componentHeading: t("console:develop.features.idp.forms.attributeSettings." +
                                    "attributeProvisioning.componentHeading"),
                                enablePrecedingDivider: false,
                                hint: t("console:develop.features.idp.forms.attributeSettings." + 
                                    "attributeProvisioning.hint")
                            } }
                            data-testid={ `${ testId }-provisioning-attribute-selection` }
                        /> }

                        {/* Set role mappings. */ }
                        <RoleMappingSettings
                            triggerSubmit={ triggerSubmission }
                            initialRoleMappings={ initialRoleMappings }
                            onSubmit={ setRoleMapping }
                            data-testid={ `${ testId }-role-mapping` }
                        />

                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 3 }>
                                <Button
                                    primary
                                    size="small"
                                    onClick={ setTriggerSubmission }
                                    data-testid={ `${ testId }-update-button` }
                                >
                                    { t("common:update") }
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </EmphasizedSegment>
            )
            : <ContentLoader/>
    );
};

/**
 * Default proptypes for the IDP attribute settings component.
 */
AttributeSettings.defaultProps = {
    "data-testid": "idp-edit-attribute-settings"
};
