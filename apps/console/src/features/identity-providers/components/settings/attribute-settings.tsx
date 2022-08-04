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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { getAllLocalClaims } from "@wso2is/core/api";
import { AlertLevels, Claim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { EmphasizedSegment } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Divider, Grid } from "semantic-ui-react";
import { AttributeSelection, RoleMappingSettings, UriAttributesSettings } from "./attribute-management";
import { AttributesSelectionV2 } from "./attribute-management/attribute-selection-v2";
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
    handleGetAllLocalClaimsError,
    initSelectedClaimMappings,
    initSelectedProvisioningClaimsWithDefaultValues,
    initSubjectAndRoleURIs,
    isClaimExistsInIdPClaims,
    isLocalIdentityClaim
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
    /**
     * This boolean attribute specifies whether provisioning attributes
     * section should be enabled or not. By default this is not a required
     * prop and the component itself defaults this to {@code true}. Please
     * see {@link AttributeSettings.defaultProps}.
     */
    provisioningAttributesEnabled?: boolean;
    /**
     * This boolean attribute specifies whether local identity claims
     * should be hidden or not. By default we will show these attributes
     * see {@link AttributeSettings.defaultProps}.
     *
     * For an example, setting this to {@code true} will hide:-
     *  - http://wso2.org/claims/identity/accountLocked
     *  - http://wso2.org/claims/identity/isExistingLiteUser
     *  - etc...
     */
    hideIdentityClaimAttributes?: boolean;
    /**
     * If enabled with {@code true} this component will render both uri
     * mapping and the external claim mappings table.
     */
    isRoleMappingsEnabled: boolean;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Loading Component.
     */
    loader: () => ReactElement;
    /**
     * Is the IdP type SAML
     */
    isSaml: boolean;
}

export const LocalDialectURI = "http://wso2.org/claims";

export const AttributeSettings: FunctionComponent<AttributeSelectionPropsInterface> = (
    props: AttributeSelectionPropsInterface
): ReactElement => {

    const {
        idpId,
        initialClaims,
        initialRoleMappings,
        isLoading,
        onUpdate,
        provisioningAttributesEnabled,
        hideIdentityClaimAttributes,
        isReadOnly,
        isRoleMappingsEnabled,
        loader: Loader,
        isSaml,
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

    // Selected role mapping.
    const [roleMapping, setRoleMapping] = useState<IdentityProviderRoleMappingInterface[]>(undefined);
    const [ isSubmissionLoading, setIsSubmissionLoading ] = useState<boolean>(false);

    // Trigger role mapping field to submission.
    const [triggerSubmission, setTriggerSubmission] = useTrigger();

    /**
     * When IdP loads, this component is responsible for fetching the
     * available claims. So, to to indicate a network call is happening
     * we need this to hide the form. iff {@code !isLocalClaimsLoading}
     * and {@code !isLoading} will load the form.
     */
    const [ isLocalClaimsLoading, setIsLocalClaimsLoading ] = useState<boolean>(true);

    useEffect(() => {
        setIsLocalClaimsLoading(true);
        getAllLocalClaims(null)
            .then((response: Claim[]) => {
                setAvailableLocalClaims(response?.map(claim => {
                    return {
                        displayName: claim.displayName,
                        id: claim.id,
                        uri: claim.claimURI
                    } as IdentityProviderClaimInterface;
                }));
                setIsLocalClaimsLoading(false);
            })
            .catch((error) => {
                setIsLocalClaimsLoading(false);
                handleGetAllLocalClaimsError(error);
            });
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
        if (isEmpty(selectedClaimsWithMapping)) {
            // Set provisioning claims.
            setSelectedProvisioningClaimsWithDefaultValue(selectedProvisioningClaimsWithDefaultValue.filter(element =>
                availableLocalClaims.find(claim => claim.uri === element.claim.uri)));

            // Set subject URI.
            if (isEmpty(availableLocalClaims?.find(element => element.uri === subjectClaimUri))) {
                setSubjectClaimUri("");
            }
        } else {
            setSelectedProvisioningClaimsWithDefaultValue(selectedProvisioningClaimsWithDefaultValue.filter(
                claimWithDefaultValue => isClaimExistsInIdPClaims(claimWithDefaultValue, selectedClaimsWithMapping)));

            // Set role URI.
            if (isEmpty(selectedClaimsWithMapping?.find(element => element.mappedValue === roleClaimUri))) {
                setRoleClaimUri("");
            }

            // Set subject URI.
            if (isEmpty(selectedClaimsWithMapping?.find(element => element.mappedValue === subjectClaimUri))) {
                setSubjectClaimUri("");
            }
        }
    }, [selectedClaimsWithMapping]);

    const handleAttributesUpdate = () => {

        setIsSubmitting(true);

        let canSubmit = true;
        const claimConfigurations: IdentityProviderClaimsInterface = { ...initialClaims };

        // Prepare claim mapping for submission.
        if (!isEmpty(selectedClaimsWithMapping?.filter(element => isEmpty(element.mappedValue)))) {
            canSubmit = false;
        }
        claimConfigurations["mappings"] = selectedClaimsWithMapping.map(element => {
            return {
                idpClaim: element.mappedValue,
                localClaim: element.claim
            } as IdentityProviderClaimMappingInterface;
        });

        if (provisioningAttributesEnabled) {
            // Prepare provisioning claims for submission.
            if (!isEmpty(selectedProvisioningClaimsWithDefaultValue?.filter(element => isEmpty(element.mappedValue)))) {
                canSubmit = false;
            }
            claimConfigurations[ "provisioningClaims" ] = selectedProvisioningClaimsWithDefaultValue.map(element => {
                return {
                    claim: element.claim,
                    defaultValue: element.mappedValue
                } as IdentityProviderProvisioningClaimInterface;
            });
        }

        const matchingLocalClaim = availableLocalClaims.find(element => element.uri === subjectClaimUri);
        claimConfigurations["userIdClaim"] = matchingLocalClaim ? matchingLocalClaim : { uri: subjectClaimUri } as
            IdentityProviderClaimInterface;

        if (isRoleMappingsEnabled) {
            // Prepare role for submission.
            if (!isEmpty(selectedClaimsWithMapping)) {
                if (isEmpty(roleClaimUri)) {
                    // Trigger form field validation on the empty subject uri.
                    setRoleError(true);
                    canSubmit = false;
                } else {
                    setRoleError(false);
                }
                const matchingLocalClaim = availableLocalClaims.find(element => element.uri === roleClaimUri);
                claimConfigurations[ "roleClaim" ] = matchingLocalClaim ? matchingLocalClaim : { uri: roleClaimUri } as
                    IdentityProviderClaimInterface;
            } else {
                claimConfigurations[ "roleClaim" ] = { uri: "" } as IdentityProviderClaimInterface;
            }
        }

        if (canSubmit) {
            setIsSubmitting(false);
            setIsSubmissionLoading(true);
            handleAttributeSettingsFormSubmit(idpId, claimConfigurations, roleMapping, onUpdate)
                .finally(() => {
                    setIsSubmissionLoading(false);
                });
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

    if (isLoading || isLocalClaimsLoading) {
        return <Loader />;
    }

    return (
        <EmphasizedSegment padded="very">
            <Grid className="attributes-settings">
                <div className="form-container with-max-width">
                    <Grid.Row columns={ 1 }>
                        <Grid.Column>
                            <AttributesSelectionV2
                                onAttributesSelected={ (mappingsToBeAdded) => {
                                    setSelectedClaimsWithMapping([ ...mappingsToBeAdded ]);
                                } }
                                attributeList={
                                    hideIdentityClaimAttributes
                                        ? availableLocalClaims.filter(({ uri }) => !isLocalIdentityClaim(uri))
                                        : availableLocalClaims
                                }
                                mappedAttributesList={ [ ...selectedClaimsWithMapping ] }
                                isReadOnly = { isReadOnly }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Divider hidden/>

                    { selectedClaimsWithMapping &&
                    <UriAttributesSettings
                        dropDownOptions={
                            createDropdownOption(selectedClaimsWithMapping, availableLocalClaims)
                                .filter(element => !isEmpty(element))
                                .filter(hideIdentityClaimAttributes
                                    ? ({ value }) => !isLocalIdentityClaim(value)
                                    : (_) => true
                                )
                        }
                        initialRoleUri={ roleClaimUri }
                        initialSubjectUri={ subjectClaimUri }
                        claimMappingOn={ isRoleMappingsEnabled && !isEmpty(selectedClaimsWithMapping) }
                        updateRole={ setRoleClaimUri }
                        updateSubject={ setSubjectClaimUri }
                        data-testid={ `${ testId }-uri-attribute-settings` }
                        roleError={ isSubmitting && roleError && !roleClaimUri }
                        subjectError={ isSubmitting && !subjectClaimUri }
                        isReadOnly={ isReadOnly }
                        isMappingEmpty={ isEmpty(selectedClaimsWithMapping) }
                        isSaml= { isSaml }
                    /> }
                    <Divider hidden/>

                    { /* Select attributes for provisioning. */ }
                    { provisioningAttributesEnabled
                        && selectedProvisioningClaimsWithDefaultValue &&
                    <AttributeSelection
                        attributeList={
                            buildProvisioningClaimList(selectedClaimsWithMapping, availableLocalClaims)
                                .filter(element => !isEmpty(element?.uri)) }
                        selectedAttributesWithMapping={ selectedProvisioningClaimsWithDefaultValue }
                        setSelectedAttributesWithMapping={ setSelectedProvisioningClaimsWithDefaultValue }
                        uiProps={ {
                            attributeColumnHeader: isEmpty(selectedClaimsWithMapping) ?
                                t("console:develop.features.authenticationProvider.forms.attributeSettings." +
                                    "attributeProvisioning.attributeColumnHeader.0") :
                                t("console:develop.features.authenticationProvider.forms.attributeSettings." +
                                    "attributeProvisioning.attributeColumnHeader.1"),
                            attributeMapColumnHeader: t("console:develop.features.authenticationProvider." +
                                "forms.attributeSettings." +
                                "attributeProvisioning.attributeMapColumnHeader"),
                            attributeMapInputPlaceholderPrefix: t("console:develop.features." +
                                "authenticationProvider.forms" +
                                ".attributeSettings.attributeProvisioning.attributeMapInputPlaceholderPrefix"),
                            componentHeading: t("console:develop.features.authenticationProvider." +
                                "forms.attributeSettings." +
                                "attributeProvisioning.componentHeading"),
                            enablePrecedingDivider: false,
                            hint: t("console:develop.features.authenticationProvider.forms.attributeSettings." +
                                "attributeProvisioning.hint")
                        } }
                        data-testid={ `${ testId }-provisioning-attribute-selection` }
                        isReadOnly={ isReadOnly }
                    /> }
                    <Divider hidden/>

                    { /* Set role mappings. */ }
                    { isRoleMappingsEnabled && <RoleMappingSettings
                        triggerSubmit={ triggerSubmission }
                        initialRoleMappings={ initialRoleMappings }
                        onSubmit={ setRoleMapping }
                        data-testid={ `${ testId }-role-mapping` }
                        isReadOnly={ isReadOnly }
                    /> }
                    <Divider hidden/>

                    <Grid.Row>
                        <Grid.Column>
                            <Show when={ AccessControlConstants.IDP_EDIT }>
                                <Button
                                    primary
                                    size="small"
                                    loading={ isSubmissionLoading }
                                    disabled={ isSubmissionLoading }
                                    onClick={ handleAttributesUpdate }
                                    data-testid={ `${ testId }-update-button` }
                                >
                                    { t("common:update") }
                                </Button>
                            </Show>
                        </Grid.Column>
                    </Grid.Row>
                </div>
            </Grid>
        </EmphasizedSegment>
    );
};

/**
 * Default proptypes for the IDP attribute settings component.
 */
AttributeSettings.defaultProps = {
    "data-testid": "idp-edit-attribute-settings",
    hideIdentityClaimAttributes: false,
    provisioningAttributesEnabled: true
};
