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
import Autocomplete from "@oxygen-ui/react/Autocomplete";
import Chip from "@oxygen-ui/react/Chip";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { Claim, ClaimsGetParams, IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllLocalClaims from "../../admin.claims.v1/api/use-get-all-local-claims";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface
} from "../models/governance-connectors";
import { GovernanceConnectorUtils } from "../utils/governance-connector-utils";

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
    const containerStyle: React.CSSProperties = { marginBottom: "1rem" };
    const labelStyle: React.CSSProperties = {
        display: "block",
        fontSize: "0.875rem",
        fontWeight: 500,
        marginBottom: "0.5rem"
    };
    const spanStyle: React.CSSProperties = {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    };
    const helperTextStyle: React.CSSProperties = {
        color: "rgba(0, 0, 0, 0.6)",
        fontSize: "0.75rem",
        marginTop: "0.25rem"
    };

    const [ initialConnectorValues, setInitialConnectorValues ]
        = useState<Map<string, ConnectorPropertyInterface>>(undefined);
    const [ selectedClaims, setSelectedClaims ] = useState<string[]>([]);
    const [ claimURIs, setClaimURIs ] = useState<string[]>([]);
    const [ claimMap, setClaimMap ] = useState<Map<string, string>>(new Map());

    const claimsParams: ClaimsGetParams = {
        filter: "",
        limit: 1000,
        offset: 0,
        sort: ""
    };
    const {
        data: claimsData,
        isLoading: isClaimsLoading
    } = useGetAllLocalClaims<Claim[]>(claimsParams, isConnectorEnabled);

    useEffect(() => {
        if (claimsData && !isClaimsLoading) {
            const uris: string[] = getClaimURIs(claimsData);
            const map: Map<string, string> = createClaimMap(claimsData);

            setClaimURIs(uris);
            setClaimMap(map);
        }
    }, [ claimsData, isClaimsLoading ]);

    const getClaimURIs = (claims: Claim[]): string[] => {
        if (!claims || claims.length === 0) {
            return [];
        }

        return claims
            .map((claim: Claim) => claim?.claimURI)
            .filter((uri: string) => typeof uri === "string" && uri.length > 0);
    };
    const createClaimMap = (claims: Claim[]): Map<string, string> => {
        const map: Map<string, string> = new Map<string, string>();

        if (!claims || claims.length === 0) {
            return map;
        }
        claims.forEach((claim: Claim) => {
            if (claim?.claimURI && claim?.displayName) {
                map.set(claim.claimURI, claim.displayName);
            }
        });

        return map;
    };

    const getDisplayName = (uri:string): string => {
        return claimMap.get(uri) ||uri;
    };

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
                [property.name]: property.value
            };
        });

        setInitialConnectorValues(resolvedInitialValues);

        const allowedAttrs: string =
            resolvedInitialFormValues?.["account.multiattributelogin.handler.allowedattributes"];

        if (allowedAttrs) {
            const attrsArray: string[] = allowedAttrs.split(",").map((attr: string) => attr.trim());

            setSelectedClaims(attrsArray);
        }
    }, [ initialValues ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (_values: Record<string, unknown>) => {
        let data: { [key: string]: unknown } = {};
        const claimsValue: string = selectedClaims.join(",");

        data = {
            "account.multiattributelogin.handler.allowedattributes": claimsValue
        };

        return data;
    };
    /**
 * Handle autocomplete change.
 *
 * @param event - Change event.
 * @param newValue - New selected values.
 */
    const handleClaimChange = (event: React.SyntheticEvent, newValue: string[]): void => {
        setSelectedClaims(newValue);
    };

    if (!initialConnectorValues) {
        return null;
    }

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            onSubmit={ (values: Record<string, unknown>) =>
                onSubmit(getUpdatedConfigurations(values))
            }
        >
            <div style={ containerStyle }>
                <label style={ labelStyle }>
                    { GovernanceConnectorUtils.resolveFieldLabel(
                        "Account Management",
                        "account.multiattributelogin.handler.allowedattributes",
                        "Allowed Attribute List"
                    ) }
                </label>
                <Autocomplete
                    multiple
                    options={ claimURIs }
                    value={ selectedClaims }
                    onChange={ handleClaimChange }
                    disabled={ !isConnectorEnabled || readOnly || isClaimsLoading }
                    loading={ isClaimsLoading }
                    renderInput={ (params: any) => (
                        <TextField
                            { ...params }
                            placeholder={ isClaimsLoading ? "Loading claims..." : "Select claim URIs" }
                            size="small"
                            data-componentid={ `${componentId}-allowed-attribute-list` }
                        />
                    ) }
                    renderOption={ (props: React.HTMLAttributes<HTMLLIElement>, option: string) => (
                        <li { ...props } key={ option }>
                            <Tooltip title={ option } placement="right">
                                <span style={ spanStyle }>
                                    { getDisplayName(option) }
                                </span>
                            </Tooltip>
                        </li>
                    ) }
                    renderTags={ (value: string[], getTagProps: (args: { index: number }) => any) =>
                        value.map((option: string, index: number) => (
                            <Tooltip title={ option } key={ option } placement="top">
                                <Chip
                                    { ...getTagProps({ index }) }
                                    label={ getDisplayName(option) }
                                    size="small"
                                    key={ option }
                                />
                            </Tooltip>
                        ))
                    }
                    freeSolo={ false }
                    disableCloseOnSelect
                    data-componentid={ `${componentId}-autocomplete` }
                />
                <div style={ helperTextStyle }>
                    { GovernanceConnectorUtils.resolveFieldHint(
                        "Account Management",
                        "account.multiattributelogin.handler.allowedattributes",
                        "Select one or more claim URIs from the list."
                    ) }
                </div>
            </div>

            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="Self registration update button"
                name="update-button"
                data-componentid={ `${componentId}-submit-button` }
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
