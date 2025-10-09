/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Chip from "@oxygen-ui/react/Chip";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { getAllLocalClaims } from "@wso2is/admin.claims.v1/api";
import { Claim, IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface } from "../models/governance-connectors";
import { GovernanceConnectorUtils } from "../utils";

/**
 * Interface for multi attribute login form props.
 */
interface MultiAttributeLoginFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Connector's initial values.
     */
    initialValues: GovernanceConnectorInterface;
    /**
     * Callback for form submit.
     * @param values - Resolved Form Values.
     */
    onSubmit: (values) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * Whether the connector is enabled using the toggle button.
     */
    isConnectorEnabled?: boolean;
    /**
     * Specifies if the form is submitting
     */
    isSubmitting?: boolean;
}

const FORM_ID: string = "governance-connectors-multi-attribute-login-form";

/**
 * Multi Attribute Login Form.
 *
 * @param props - Props injected to the component.
 * @returns Multi Attribute Login Form component.
 */
export const MultiAttributeLoginForm: FunctionComponent<MultiAttributeLoginFormPropsInterface> = (
    props: MultiAttributeLoginFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        onSubmit,
        readOnly,
        isConnectorEnabled,
        isSubmitting,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const [ initialConnectorValues, setInitialConnectorValues ]
        = useState<Map<string, ConnectorPropertyInterface>>(undefined);
    const [ initialFormValues, setInitialFormValues ]
        = useState<any>(undefined);
    const [ availableClaims, setAvailableClaims ] = useState<Claim[]>([]);
    const [ selectedClaims, setSelectedClaims ] = useState<Claim[]>([]);
    const [ isLoadingClaims, setIsLoadingClaims ] = useState<boolean>(false);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(initialValues?.properties)) {
            return;
        }

        const resolvedInitialValues: Map<string, ConnectorPropertyInterface>
            = new Map<string, ConnectorPropertyInterface>();
        let resolvedInitialFormValues: any
            = null;

        initialValues.properties.map((property: ConnectorPropertyInterface) => {

            resolvedInitialValues.set(property.name, property);
            resolvedInitialFormValues = {
                ...resolvedInitialFormValues,
                [ property.name ]: property.value
            };
        });

        setInitialConnectorValues(resolvedInitialValues);
        setInitialFormValues(resolvedInitialFormValues);
    }, [ initialValues ]);

    /**
     * Fetch all local claims from the API.
     */
    useEffect(() => {
        setIsLoadingClaims(true);
        getAllLocalClaims(null)
            .then((claims: Claim[]) => {
                setAvailableClaims(claims);
            })
            .catch(() => {
                setAvailableClaims([]);
            })
            .finally(() => {
                setIsLoadingClaims(false);
            });
    }, []);

    /**
     * Parse initial comma-separated claim URIs and set selected claims.
     */
    useEffect(() => {
        if (!initialFormValues || !availableClaims.length) {
            return;
        }

        const allowedAttributesValue: string =
            initialFormValues["account.multiattributelogin.handler.allowedattributes"];

        if (allowedAttributesValue) {
            const claimUris: string[] = allowedAttributesValue
                .split(",")
                .map((uri: string) => uri.trim())
                .filter((uri: string) => uri);

            const selected: Claim[] = availableClaims.filter((claim: Claim) =>
                claimUris.includes(claim.claimURI)
            );

            setSelectedClaims(selected);
        }
    }, [ initialFormValues, availableClaims ]);

    /**
     * Handle claim selection changes.
     *
     * @param event - The event.
     * @param newValue - The new selected claims.
     */
    const handleClaimSelectionChange = (event: SyntheticEvent, newValue: Claim[]) => {
        setSelectedClaims(newValue);
    };

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: Record<string, unknown>) => {
        let data: { [key: string]: unknown } = {};

        for (const key in values) {
            if (Object.prototype.hasOwnProperty.call(values, key)
            && key !== ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_ENABLE) {
                data = {
                    ...data,
                    [ GovernanceConnectorUtils.decodeConnectorPropertyName(key) ]: values[ key ]
                };
            }
        }

        return data;
    };

    if (!initialConnectorValues) {
        return null;
    }

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ true }
            initialValues={ initialFormValues }
            onSubmit={ (values: Record<string, unknown>) => {
                // Convert selected claims to comma-separated URIs
                const claimUris: string = selectedClaims
                    .map((claim: Claim) => claim.claimURI)
                    .join(",");

                // Add the claim URIs to form values
                const updatedValues: Record<string, unknown> = {
                    ...values,
                    "account.multiattributelogin.handler.allowedattributes": claimUris
                };

                onSubmit(getUpdatedConfigurations(updatedValues));
            } }
        >
            <div style={ { marginBottom: "16px" } }>
                <label style={ { display: "block", fontWeight: 500, marginBottom: "8px" } }>
                    { GovernanceConnectorUtils.resolveFieldLabel(
                        "Account Management",
                        "account.multiattributelogin.handler.allowedattributes",
                        "Allowed Attribute List"
                    ) }
                    <span style={ { color: "red" } }> *</span>
                </label>
                <Autocomplete
                    multiple
                    options={ availableClaims }
                    value={ selectedClaims }
                    onChange={ handleClaimSelectionChange }
                    getOptionLabel={ (option: Claim) => option.displayName || option.claimURI }
                    isOptionEqualToValue={ (option: Claim, value: Claim) =>
                        option.claimURI === value.claimURI
                    }
                    disabled={ !isConnectorEnabled || readOnly }
                    loading={ isLoadingClaims }
                    renderInput={ (params: AutocompleteRenderInputParams) => (
                        <TextField
                            { ...params }
                            placeholder={ selectedClaims.length === 0 ? "Select allowed attributes" : "" }
                            data-componentid={ `${ componentId }-allowed-attribute-list` }
                        />
                    ) }
                    renderTags={ (value: Claim[], getTagProps: (arg: { index: number }) => object) =>
                        value.map((option: Claim, index: number) => (
                            <Tooltip
                                key={ option.claimURI }
                                title={ option.claimURI }
                                placement="top"
                            >
                                <Chip
                                    { ...getTagProps({ index }) }
                                    label={ option.displayName || option.claimURI }
                                    size="small"
                                />
                            </Tooltip>
                        ))
                    }
                    data-componentid={ `${ componentId }-allowed-attribute-autocomplete` }
                />
                <div style={ { color: "#666", fontSize: "12px", marginTop: "4px" } }>
                    { GovernanceConnectorUtils.resolveFieldHint(
                        "Account Management",
                        "account.multiattributelogin.handler.allowedattributes",
                        "Select the claims that can be used for multi-attribute login."
                    ) }
                </div>
            </div>
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="Self registration update button"
                name="update-button"
                data-componentid={ `${ componentId }-submit-button` }
                disabled={ !isConnectorEnabled || isSubmitting }
                loading={ isSubmitting }
                label={ t("common:update") }
                hidden={ !isConnectorEnabled || readOnly }
            />
        </Form>
    );
};

/**
 * Default props for the component.
 */
MultiAttributeLoginForm.defaultProps = {
    "data-componentid": "multi-attribute-login-form"
};
