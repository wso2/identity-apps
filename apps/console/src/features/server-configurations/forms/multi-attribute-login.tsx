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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
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
            onSubmit={ (values: Record<string, unknown>) =>
                onSubmit(getUpdatedConfigurations(values))
            }
        >
            <Field.Input
                ariaLabel="account.multiattributelogin.handler.allowedattributes"
                inputType="text"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "account.multiattributelogin.handler.allowedattributes"
                ) }
                type="text"
                width={ 16 }
                required={ true }
                placeholder={ "Enter allowed attribute list" }
                labelPosition="top"
                minLength={ 3 }
                maxLength={ 100 }
                readOnly={ readOnly }
                initialValue={ initialFormValues?.[ "account.multiattributelogin.handler.allowedattributes" ] }
                data-componentid={ `${ componentId }-allowed-attribute-list` }
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "Account Management",
                    "account.multiattributelogin.handler.allowedattributes",
                    "Allowed Attribute List")
                }
                disabled={ !isConnectorEnabled }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "Account Management",
                    "account.multiattributelogin.handler.allowedattributes",
                    "Allowed claim list separated by commas.")
                }
            />
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
