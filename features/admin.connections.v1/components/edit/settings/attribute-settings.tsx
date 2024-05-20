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

import { Show } from "@wso2is/access-control";
import { getAllLocalClaims } from "@wso2is/admin.claims.v1/api";
import { AppState, FeatureConfigInterface } from "@wso2is/admin.core.v1";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, Claim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, Message } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Button, Divider, Grid } from "semantic-ui-react";
import { AttributeSelection, UriAttributesSettings } from "./attribute-management";
import { AttributesSelectionV2 } from "./attribute-management/attribute-selection-v2";
import {
    ConnectionClaimInterface,
    ConnectionClaimMappingInterface,
    ConnectionClaimsInterface,
    ConnectionCommonClaimMappingInterface,
    ConnectionProvisioningClaimInterface,
    ConnectionRoleMappingInterface
} from "../../../models/connection";
import {
    buildProvisioningClaimList,
    createDropdownOption,
    handleAttributeSettingsFormSubmit,
    handleGetAllLocalClaimsError,
    initSelectedClaimMappings,
    initSelectedProvisioningClaimsWithDefaultValues,
    initSubjectAndRoleURIs,
    isClaimExistsInConnectionClaims,
    isLocalIdentityClaim
} from "../../../utils/attribute-utils";

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
    initialClaims?: ConnectionClaimsInterface;

    /**
     * Roles of the IDP
     */
    initialRoleMappings?: ConnectionRoleMappingInterface[];

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
     * prop and the component itself defaults this to `true`. Please
     * see {@link AttributeSettings.defaultProps}.
     */
    provisioningAttributesEnabled?: boolean;
    /**
     * This boolean attribute specifies whether local identity claims
     * should be hidden or not. By default we will show these attributes
     * see {@link AttributeSettings.defaultProps}.
     *
     * For an example, setting this to `true` will hide:-
     *  - http://wso2.org/claims/identity/accountLocked
     *  - http://wso2.org/claims/identity/isExistingLiteUser
     *  - etc...
     */
    hideIdentityClaimAttributes?: boolean;
    /**
     * If enabled with `true` this component will render both uri
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
     * Is the IdP type OIDC
     */
    isOIDC: boolean;
    /**
     * Is the IdP type SAML
     */
    isSaml: boolean;
}

export const LocalDialectURI: string = "http://wso2.org/claims";

export const AttributeSettings: FunctionComponent<AttributeSelectionPropsInterface> = (
    props: AttributeSelectionPropsInterface
): ReactElement => {

    const {
        idpId,
        initialClaims,
        isLoading,
        onUpdate,
        provisioningAttributesEnabled,
        hideIdentityClaimAttributes,
        isReadOnly,
        isRoleMappingsEnabled,
        loader: Loader,
        isOIDC,
        isSaml,
        [ "data-testid" ]: testId
    } = props;

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const { UIConfig } = useUIConfig();

    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    // Manage available local claims.
    const [ availableLocalClaims, setAvailableLocalClaims ] = useState<ConnectionClaimInterface[]>([]);

    // Selected local claims in claim mapping.
    const [ selectedClaimsWithMapping, setSelectedClaimsWithMapping ]
        = useState<ConnectionCommonClaimMappingInterface[]>([]);

    // Selected provisioning claims.
    const [ selectedProvisioningClaimsWithDefaultValue, setSelectedProvisioningClaimsWithDefaultValue ]
        = useState<ConnectionCommonClaimMappingInterface[]>([]);

    // Selected subject.
    const [ subjectClaimUri, setSubjectClaimUri ] = useState<string>();

    // Selected role.
    const [ roleClaimUri, setRoleClaimUri ] = useState<string>();

    // Sets if the form is submitting.
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    // Selected role mapping.
    const [ roleMapping ] = useState<ConnectionRoleMappingInterface[]>(undefined);
    const [ isSubmissionLoading, setIsSubmissionLoading ] = useState<boolean>(false);


    /**
     * When IdP loads, this component is responsible for fetching the
     * available claims. So, to to indicate a network call is happening
     * we need this to hide the form. if `!isLocalClaimsLoading`
     * and `!isLoading` will load the form.
     */
    const [ isLocalClaimsLoading, setIsLocalClaimsLoading ] = useState<boolean>(true);

    useEffect(() => {
        setIsLocalClaimsLoading(true);
        getAllLocalClaims(null)
            .then((response: Claim[]) => {
                setAvailableLocalClaims(response?.map((claim: Claim) => {
                    return {
                        displayName: claim.displayName,
                        id: claim.id,
                        uri: claim.claimURI
                    } as ConnectionClaimInterface;
                }));
                setIsLocalClaimsLoading(false);
            })
            .catch((error: IdentityAppsApiException) => {
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
    }, [ availableLocalClaims ]);

    useEffect(() => {
        // Provisioning claims, subject URI and role UR depend on the IdP claim mapping unless there are no claim
        // mappings configured. In this case, they need to fall back to local claims.
        if (isEmpty(selectedClaimsWithMapping)) {
            // Set provisioning claims.
            setSelectedProvisioningClaimsWithDefaultValue(selectedProvisioningClaimsWithDefaultValue.filter(
                (element: ConnectionCommonClaimMappingInterface) =>
                    availableLocalClaims.find(
                        (claim: ConnectionClaimInterface) => claim.uri === element.claim.uri
                    )
            ));

            // Set subject URI.
            if (isEmpty(availableLocalClaims?.find(
                (element: ConnectionClaimInterface) => element.uri === subjectClaimUri))
            ) {
                setSubjectClaimUri("");
            }
        } else {
            setSelectedProvisioningClaimsWithDefaultValue(selectedProvisioningClaimsWithDefaultValue.filter(
                (claimWithDefaultValue: ConnectionCommonClaimMappingInterface) => isClaimExistsInConnectionClaims(
                    claimWithDefaultValue, selectedClaimsWithMapping
                ))
            );

            // Set role URI.
            if (isEmpty(selectedClaimsWithMapping?.find(
                (element: ConnectionCommonClaimMappingInterface) => element.mappedValue === roleClaimUri))
            ) {
                setRoleClaimUri("");
            }

            // Set subject URI.
            if (isEmpty(selectedClaimsWithMapping?.find(
                (element: ConnectionCommonClaimMappingInterface) => element.mappedValue === subjectClaimUri))
            ) {
                setSubjectClaimUri("");
            }
        }
    }, [ selectedClaimsWithMapping ]);

    const handleAttributesUpdate = (): void => {

        setIsSubmitting(true);

        let canSubmit: boolean = true;
        const claimConfigurations: ConnectionClaimsInterface = { ...initialClaims };

        // Prepare claim mapping for submission.
        if (!isEmpty(selectedClaimsWithMapping?.filter(
            (element: ConnectionCommonClaimMappingInterface) => isEmpty(element.mappedValue)))
        ) {
            canSubmit = false;
        }
        claimConfigurations["mappings"] = selectedClaimsWithMapping.map(
            (element: ConnectionCommonClaimMappingInterface) => {
                return {
                    idpClaim: element.mappedValue,
                    localClaim: element.claim
                } as ConnectionClaimMappingInterface;
            }
        );

        if (provisioningAttributesEnabled) {
            // Prepare provisioning claims for submission.
            if (!isEmpty(selectedProvisioningClaimsWithDefaultValue?.filter(
                (element: ConnectionCommonClaimMappingInterface) => isEmpty(element.mappedValue)))
            ) {
                canSubmit = false;
            }
            claimConfigurations.provisioningClaims = selectedProvisioningClaimsWithDefaultValue.map(
                (element: ConnectionCommonClaimMappingInterface) => {
                    return {
                        claim: element.claim,
                        defaultValue: element.mappedValue
                    } as ConnectionProvisioningClaimInterface;
                }
            );
        }

        const matchingLocalClaim: ConnectionClaimInterface = availableLocalClaims.find(
            (element: ConnectionClaimInterface) => element.uri === subjectClaimUri
        );

        claimConfigurations["userIdClaim"] = matchingLocalClaim ? matchingLocalClaim : { uri: subjectClaimUri } as
            ConnectionClaimInterface;

        if (isRoleMappingsEnabled) {
            // Prepare role for submission.
            if (!isEmpty(selectedClaimsWithMapping)) {
                const matchingLocalClaim: ConnectionClaimInterface = availableLocalClaims.find(
                    (element: ConnectionClaimInterface) => element.uri === roleClaimUri
                );

                claimConfigurations[ "roleClaim" ] = matchingLocalClaim ? matchingLocalClaim : { uri: roleClaimUri } as
                    ConnectionClaimInterface;
            } else {
                claimConfigurations[ "roleClaim" ] = { uri: "" } as ConnectionClaimInterface;
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
                    description: t("idp:notifications." +
                        "submitAttributeSettings.error.description"),
                    level: AlertLevels.WARNING,
                    message: t("idp:notifications.submitAttributeSettings.error.message")
                }
            ));
        }
    };

    useEffect(() => {
        if (roleMapping == undefined) {
            return;
        }
        handleAttributesUpdate();
    }, [ roleMapping ]);

    if (isLoading || isLocalClaimsLoading) {
        return <Loader />;
    }

    return (
        <EmphasizedSegment padded="very">
            <Grid className="attributes-settings">
                <div className="form-container with-max-width">
                    {
                        !UIConfig?.isCustomClaimMappingEnabled && (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column>
                                    <Message
                                        type="warning"
                                        content={
                                            (
                                                <Trans>
                                                    <strong>Custom Attribute Mapping</strong> is disabled in
                                                    your system configuration. This might affect certain flows related
                                                    to the connection. Proceed with caution.
                                                </Trans>
                                            )
                                        }
                                    />
                                    <Divider hidden/>
                                </Grid.Column>
                            </Grid.Row>
                        )
                    }
                    <Grid.Row columns={ 1 }>
                        <Grid.Column>
                            <AttributesSelectionV2
                                onAttributesSelected={
                                    (mappingsToBeAdded : ConnectionCommonClaimMappingInterface[]) => {
                                        setSelectedClaimsWithMapping([ ...mappingsToBeAdded ]);
                                    }
                                }
                                attributeList={
                                    hideIdentityClaimAttributes
                                        ? availableLocalClaims.filter(
                                            ({ uri }: ConnectionClaimInterface) => !isLocalIdentityClaim(uri)
                                        ) : availableLocalClaims
                                }
                                mappedAttributesList={ [ ...selectedClaimsWithMapping ] }
                                isReadOnly = { isReadOnly }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Divider hidden/>

                    {
                        selectedClaimsWithMapping && (
                            <UriAttributesSettings
                                dropDownOptions={
                                    createDropdownOption(selectedClaimsWithMapping, availableLocalClaims).filter(
                                        (element: DropdownOptionsInterface) => !isEmpty(element)
                                    )
                                }
                                initialRoleUri={ roleClaimUri }
                                initialSubjectUri={ subjectClaimUri }
                                claimMappingOn={ isRoleMappingsEnabled && !isEmpty(selectedClaimsWithMapping) }
                                updateRole={ setRoleClaimUri }
                                updateSubject={ setSubjectClaimUri }
                                data-testid={ `${ testId }-uri-attribute-settings` }
                                roleError={ isSubmitting && !roleClaimUri }
                                subjectError={ isSubmitting && !subjectClaimUri }
                                isReadOnly={ isReadOnly }
                                isMappingEmpty={ isEmpty(selectedClaimsWithMapping) }
                                isOIDC={ isOIDC }
                                isSaml={ isSaml }
                                selectedClaimMappings={ selectedClaimsWithMapping }
                            />
                        )
                    }
                    <Divider hidden/>

                    { /* Select attributes for provisioning. */ }
                    { provisioningAttributesEnabled
                        && selectedProvisioningClaimsWithDefaultValue &&
                    (<AttributeSelection
                        attributeList={
                            buildProvisioningClaimList(selectedClaimsWithMapping, availableLocalClaims)
                                .filter((element: ConnectionClaimInterface) => !isEmpty(element?.uri)) }
                        selectedAttributesWithMapping={ selectedProvisioningClaimsWithDefaultValue }
                        setSelectedAttributesWithMapping={ setSelectedProvisioningClaimsWithDefaultValue }
                        uiProps={ {
                            attributeColumnHeader: isEmpty(selectedClaimsWithMapping) ?
                                t("authenticationProvider:forms.attributeSettings." +
                                    "attributeProvisioning.attributeColumnHeader.0") :
                                t("authenticationProvider:forms.attributeSettings." +
                                    "attributeProvisioning.attributeColumnHeader.1"),
                            attributeMapColumnHeader: t("authenticationProvider:" +
                                "forms.attributeSettings." +
                                "attributeProvisioning.attributeMapColumnHeader"),
                            attributeMapInputPlaceholderPrefix: t("authenticationProvider:forms" +
                                ".attributeSettings.attributeProvisioning.attributeMapInputPlaceholderPrefix"),
                            componentHeading: t("authenticationProvider:" +
                                "forms.attributeSettings." +
                                "attributeProvisioning.componentHeading"),
                            enablePrecedingDivider: false,
                            hint: t("authenticationProvider:forms.attributeSettings." +
                                "attributeProvisioning.hint")
                        } }
                        data-testid={ `${ testId }-provisioning-attribute-selection` }
                        isReadOnly={ isReadOnly }
                    />) }
                    <Divider hidden/>
                    <Grid.Row>
                        <Grid.Column>
                            <Show when={ featureConfig?.identityProviders?.scopes?.update }>
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
