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

import { DropdownOptionsInterface } from "@wso2is/admin.applications.v1/components/settings";
import { getExternalClaims } from "@wso2is/admin.claims.v1/api";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { Claim } from "@wso2is/core/src/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { Hint, Message } from "@wso2is/react-components";
import React, { Dispatch, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { ConnectionManagementConstants } from "../../../constants/connection-constants";
import { ImplicitAssociaionConfigInterface } from "../../../models/connection";
import { SubjectAttributeListItem } from "../settings";

const FORM_ID: string = "idp-implicit-association-form";

interface TrustedTokenIssuerAdvanceConfigurationsFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Callback to update the idp details.
     */
    onSubmit: (values: any) => void;
    /**
     * Specifies if the form is being submitted.
     */
    isSubmitting?: boolean;
    /**
     * connection implicit association configuration details.
     */
    config: ImplicitAssociaionConfigInterface

}

export const TrustedTokenIssuerAdvanceConfigurationsForm:
FunctionComponent<TrustedTokenIssuerAdvanceConfigurationsFormPropsInterface> = (
    props: TrustedTokenIssuerAdvanceConfigurationsFormPropsInterface
): ReactElement => {

    const {
        onSubmit,
        isSubmitting,
        config,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();
    const [ implicitAssociationEnabled, setImplicitAssociationEnabled ] = useState<boolean>(config.isEnabled);
    const [ filteredClaimList, setFilteredClaimList ] = useState<DropdownOptionsInterface[]>([]);
    const [ primaryClaimList, setPrimaryClaimList ] = useState<DropdownOptionsInterface[]>([]);
    const [ secondaryClaimList, setSecondaryClaimList ] = useState<DropdownOptionsInterface[]>([]);
    const [ primaryLookupAttribute, setPrimaryLookupAttribute ] =
        useState<string>(config.lookupAttribute.length > 0 ? config.lookupAttribute[0] : "");
    const [ secondaryLookupAttribute, setSecondaryLookupAttribute ] =
        useState<string>(config.lookupAttribute.length > 1 ? config.lookupAttribute[1] : "");

    /**
     * This function process the form values and returns the request body of the API call to update the
     * implicit association configuration.
     *
     * @param values - Form values.
     */
    const updateConfiguration = (values: ImplicitAssociaionConfigInterface): any => {
        const selectedClaims: string[] = [];

        if ( primaryLookupAttribute.length > 0 ) {
            selectedClaims.push(primaryLookupAttribute);
        }

        if ( secondaryLookupAttribute.length > 0 ) {
            selectedClaims.push(secondaryLookupAttribute);
        }

        return {
            isEnabled: values.isEnabled,
            lookupAttribute: selectedClaims.length > 0 ? selectedClaims : [ "" ]
        };
    };

    useEffect(() => {
        // Remove the selected primary lookup attribute from the secondary lookup attribute list.
        const secondaryAttributes: DropdownOptionsInterface[] =
            filteredClaimList.filter((claim: DropdownOptionsInterface) => {
                return claim.value !== primaryLookupAttribute;
            });

        // Remove the selected secondary lookup attribute from the primary lookup attribute list.
        const primaryAttributes: DropdownOptionsInterface[] =
            filteredClaimList.filter((claim: DropdownOptionsInterface) => {
                return claim.value !== secondaryLookupAttribute;
            });

        setSecondaryClaimList(secondaryAttributes);
        setPrimaryClaimList(primaryAttributes);

    }, [ primaryLookupAttribute, secondaryLookupAttribute, filteredClaimList ]);

    useEffect(() => {
        const filteredAttributes: DropdownOptionsInterface[] = [];

        getExternalClaims(ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("LOCAL"))
            .then(( response: Claim[] ) => {
                response.forEach((claim: Claim) => {
                    if (ConnectionManagementConstants.IMPLICIT_ACCOUNT_LINKING_ATTRIBUTES.includes(claim.claimURI)) {
                        filteredAttributes.push({
                            key: claim.id,
                            text: <SubjectAttributeListItem
                                key={ claim.id }
                                displayName={ claim.displayName }
                                claimURI={ claim.claimURI }
                                value={ claim.claimURI }
                            />,
                            value: claim.claimURI
                        });
                    }
                });
                setFilteredClaimList(filteredAttributes);
            })
            .catch((error: IdentityAppsApiException) => {
                dispatch(
                    addAlert({
                        description:
                            error?.response?.data?.description ||
                            t(
                                "claims:dialects.notifications." +
                                "fetchADialect.genericError.description"
                            ),
                        level: AlertLevels.ERROR,
                        message:
                            error?.message ||
                            t(
                                "claims:dialects.notifications." +
                                "fetchADialect.genericError.message"
                            )
                    })
                );
            });
    }, []);

    const primaryAttributeChangeListener = (fieldValue: string): void => {
        setPrimaryLookupAttribute(fieldValue);
    };

    const secondaryAttributeChangeListener = (fieldValue: string): void => {
        setSecondaryLookupAttribute(fieldValue);
    };

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            onSubmit={ (values: ImplicitAssociaionConfigInterface) => onSubmit(updateConfiguration(values)) }
            data-testid={ componentId }
        >
            <Field.Checkbox
                ariaLabel="implicitAccountLinking"
                name="isEnabled"
                label={ t("idp:forms.advancedConfigs." +
                    "implicitAssociation.enable.label") }
                required={ false }
                disabled={ false }
                hint={ t("idp:forms.advancedConfigs." +
                    "implicitAssociation.enable.hint") }
                width={ 16 }
                listen={ (value: boolean) => setImplicitAssociationEnabled(value) }
                data-testid={ `${ componentId }-enable-checkbox` }
                defaultValue={ config.isEnabled }
            />
            <Field.Dropdown
                disabled={ !implicitAssociationEnabled }
                ariaLabel="Primary Lookup Attribute"
                name="primaryLookupAttribute"
                label={
                    t("idp:forms.advancedConfigs." +
                        "implicitAssociation.primaryAttribute.label")
                }
                required={ true }
                value={ primaryLookupAttribute }
                options={ primaryClaimList }
                data-componentid={ `${componentId}-primary-lookup-attribute` }
                listen={ primaryAttributeChangeListener }
                placeholder={ t("console:develop.features.idp.forms.advancedConfigs." +
                    "implicitAssociation.primaryAttribute.placeholder") }
                enableReinitialize={ true }
                hint={ (<Hint disabled={ !implicitAssociationEnabled }>
                    { t("idp:forms.advancedConfigs." +
                    "implicitAssociation.primaryAttribute.hint") }
                </Hint>) }
            />
            <Field.Dropdown
                disabled={ !implicitAssociationEnabled || primaryLookupAttribute?.length === 0 }
                ariaLabel="Secondary Lookup Attribute"
                name="secondaryLookupAttribute"
                label={
                    t("idp:forms.advancedConfigs." +
                        "implicitAssociation.secondaryAttribute.label")
                }
                required={ false }
                value={ secondaryLookupAttribute }
                options={ secondaryClaimList }
                data-componentid={ `${componentId}-secondary-lookup-attribute` }
                listen={ secondaryAttributeChangeListener }
                enableReinitialize={ true }
                placeholder={ t("console:develop.features.idp.forms.advancedConfigs." +
                    "implicitAssociation.secondaryAttribute.placeholder") }
                clearable={ true }
                hint={ (<Hint disabled={ !implicitAssociationEnabled }>
                    { t("idp:forms.advancedConfigs." +
                    "implicitAssociation.secondaryAttribute.hint") }
                </Hint>) }
            />
            <Message
                type="warning"
                content={ t("idp:forms.advancedConfigs." +
                "implicitAssociation.warning") }
                hidden={ !implicitAssociationEnabled }
            />
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="Update button"
                name="update-button"
                hidden={ false }
                loading={ isSubmitting }
                disabled={ implicitAssociationEnabled && primaryLookupAttribute?.length === 0 }
                data-componentid={ `${componentId}-submit-button` }
                label={   t("common:update")  }
            />
        </Form>
    );
};

/**
 * Default proptypes for the trusted token issuer advance settings form component.
 */
TrustedTokenIssuerAdvanceConfigurationsForm.defaultProps = {
    "data-componentid": "trusted-token-issuer-advanced-settings"
};
