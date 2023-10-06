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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import { Hint } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    ServerConfigurationsConstants
} from "../../../../features/server-configurations";
import {
    MultiAttributeLoginAPIRequestInterface,
    MultiAttributeLoginFormValuesInterface
} from "../models/multi-attribute-login";

/**
 * Interface for Multi Attribute Login Configuration Form props.
 */
interface MultiAttributeLoginConfigurationFormPropsInterface extends IdentifiableComponentInterface {
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
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

const FORM_ID: string = "governance-connectors-multi-attribute-login-form";

/**
 * Multi Attribute Login Configuration Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const MultiAttributeLoginConfigurationForm: FunctionComponent<
MultiAttributeLoginConfigurationFormPropsInterface> = (
    props: MultiAttributeLoginConfigurationFormPropsInterface
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
        = useState<MultiAttributeLoginFormValuesInterface>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {
        if (isEmpty(initialValues?.properties)) {
            return;
        }

        let resolvedInitialValues: MultiAttributeLoginFormValuesInterface = null;

        initialValues.properties.map((property: ConnectorPropertyInterface) => {
            switch (property.name) {
                case ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_ALLOWED_CLAIM_LIST:
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        multiAttributeLoginAllowedAttributes: property.value
                    };

                    break;
            }
        });
        
        setInitialConnectorValues(resolvedInitialValues);        
    }, [ initialValues ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: MultiAttributeLoginFormValuesInterface)
    : MultiAttributeLoginAPIRequestInterface => {
        const data: MultiAttributeLoginAPIRequestInterface = {
            "account.multiattributelogin.handler.allowedattributes": values
                ?.multiAttributeLoginAllowedAttributes
        };

        return data;
    };

    const getPropertyByName = (name: string): ConnectorPropertyInterface => {
        return initialValues?.properties?.find((property: ConnectorPropertyInterface) => property.name === name);
    };

    return (
        <div className={ "connector-form" }>
            <Form
                id={ FORM_ID }
                initialValues={ initialConnectorValues }
                onSubmit={ (values: any) => onSubmit(getUpdatedConfigurations(values)) }
                uncontrolledForm={ false }
            >
                <Field.Input
                    ariaLabel={ 
                        getPropertyByName(ServerConfigurationsConstants
                            .MULTI_ATTRIBUTE_LOGIN_ALLOWED_CLAIM_LIST).description }
                    key={ getPropertyByName(ServerConfigurationsConstants
                        .MULTI_ATTRIBUTE_LOGIN_ALLOWED_CLAIM_LIST)?.name }
                    name="multiAttributeLoginAllowedAttributes"
                    inputType="default"
                    label={
                        getPropertyByName(ServerConfigurationsConstants
                            .MULTI_ATTRIBUTE_LOGIN_ALLOWED_CLAIM_LIST)?.displayName }
                    required={ true }
                    minLength={ null }
                    maxLength={ null }
                    readOnly={ readOnly }
                    width={ 12 }
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${componentId}-${getPropertyByName(ServerConfigurationsConstants
                        .MULTI_ATTRIBUTE_LOGIN_ALLOWED_CLAIM_LIST)?.name}` }
                />
                <Hint className={ "mb-5" }>
                    {
                        getPropertyByName(ServerConfigurationsConstants
                            .MULTI_ATTRIBUTE_LOGIN_ALLOWED_CLAIM_LIST)?.description
                    }
                </Hint>
                <Field.Button
                    form={ FORM_ID }
                    size="small"
                    buttonType="primary_btn"
                    ariaLabel="Multi Attribute login config update button"
                    name="update-button"
                    data-testid={ `${componentId}-submit-button` }
                    disabled={ isSubmitting }
                    loading={ isSubmitting }
                    label={ t("common:update") }
                    hidden={ !isConnectorEnabled || readOnly }
                />
            </Form>
        </div>
    );
};

/**
 * Default props for the component.
 */
MultiAttributeLoginConfigurationForm.defaultProps = {
    "data-componentid": "multi-attribute-login-edit-form"
};
