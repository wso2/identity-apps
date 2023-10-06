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
import { Label } from "semantic-ui-react";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    ServerConfigurationsConstants
} from "../../../../features/server-configurations";
import { GovernanceConnectorConstants } from "../constants/governance-connector-constants";
import {
    IdleAccountSuspendAPIRequestInterface,
    IdleAccountSuspendFormValuesInterface
} from "../models/idle-account-suspend";

/**
 * Interface for Password Recovery Configuration Form props.
 */
interface IdleAccountSuspendConfigurationFormPropsInterface extends IdentifiableComponentInterface {
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

const FORM_ID: string = "governance-connectors-idle-account-suspend-form";

/**
 * Consent Information Controller Configuration Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const IdleAccountSuspendConfigurationForm: FunctionComponent<
IdleAccountSuspendConfigurationFormPropsInterface> = (
    props: IdleAccountSuspendConfigurationFormPropsInterface
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
        = useState<IdleAccountSuspendFormValuesInterface>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {
        if (isEmpty(initialValues?.properties)) {
            return;
        }

        let resolvedInitialValues: IdleAccountSuspendFormValuesInterface = null;

        initialValues.properties.map((property: ConnectorPropertyInterface) => {
            switch (property.name) {
                case ServerConfigurationsConstants.ALLOWED_IDLE_TIME_SPAN_IN_DAYS:
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        idleAccountSuspendDelay: parseInt(property.value)
                    };

                    break;
                case ServerConfigurationsConstants.ALERT_SENDING_TIME_PERIODS_IN_DAYS:
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        idleAccountSuspendDelayAlerts: property.value
                    };
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
    const getUpdatedConfigurations = (values: IdleAccountSuspendFormValuesInterface)
    : IdleAccountSuspendAPIRequestInterface => {
        const data: IdleAccountSuspendAPIRequestInterface = {
            "suspension.notification.account.disable.delay": values?.idleAccountSuspendDelay?.toString(),
            "suspension.notification.delays": values?.idleAccountSuspendDelayAlerts
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
                    min={ GovernanceConnectorConstants.ANALYTICS_FORM_FIELD_CONSTRAINTS
                        .TIMEOUT_MIN_LENGTH }
                    ariaLabel={ 
                        getPropertyByName(ServerConfigurationsConstants.ALLOWED_IDLE_TIME_SPAN_IN_DAYS)?.description }
                    inputType="number"
                    key={ getPropertyByName(ServerConfigurationsConstants.ALLOWED_IDLE_TIME_SPAN_IN_DAYS)?.name }
                    name="idleAccountSuspendDelay"
                    label={
                        getPropertyByName(ServerConfigurationsConstants.ALLOWED_IDLE_TIME_SPAN_IN_DAYS)?.displayName }
                    required={ true }
                    maxLength={ null }
                    minLength={ GovernanceConnectorConstants.ANALYTICS_FORM_FIELD_CONSTRAINTS
                        .TIMEOUT_MIN_LENGTH }
                    readOnly={ readOnly }
                    width={ 12 }
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${componentId}-
                        ${getPropertyByName(ServerConfigurationsConstants.ALLOWED_IDLE_TIME_SPAN_IN_DAYS)?.name}` }
                    labelPosition="right"
                >
                    <input/>
                    <Label
                        content={ "days" }
                    />
                </Field.Input>
                <Hint className={ "mb-5" }>
                    {
                        getPropertyByName(ServerConfigurationsConstants.ALLOWED_IDLE_TIME_SPAN_IN_DAYS)?.description
                    }
                </Hint>
                <Field.Input
                    min={ GovernanceConnectorConstants.ANALYTICS_FORM_FIELD_CONSTRAINTS
                        .TIMEOUT_MIN_LENGTH }
                    ariaLabel={ 
                        getPropertyByName(ServerConfigurationsConstants.ALERT_SENDING_TIME_PERIODS_IN_DAYS)
                            ?.description }
                    inputType="default"
                    key={ getPropertyByName(ServerConfigurationsConstants.ALERT_SENDING_TIME_PERIODS_IN_DAYS)?.name }
                    name="idleAccountSuspendDelayAlerts"
                    label={
                        getPropertyByName(ServerConfigurationsConstants.ALERT_SENDING_TIME_PERIODS_IN_DAYS)
                            ?.displayName }
                    required={ true }
                    maxLength={ null }
                    minLength={ GovernanceConnectorConstants.ANALYTICS_FORM_FIELD_CONSTRAINTS
                        .TIMEOUT_MIN_LENGTH }
                    readOnly={ readOnly }
                    width={ 12 }
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${componentId}-
                        ${getPropertyByName(ServerConfigurationsConstants.ALERT_SENDING_TIME_PERIODS_IN_DAYS)?.name}` }
                    labelPosition="right"
                >
                    <input/>
                    <Label
                        content={ "days" }
                    />
                </Field.Input>
                <Hint className={ "mb-5" }>
                    {
                        getPropertyByName(ServerConfigurationsConstants.ALERT_SENDING_TIME_PERIODS_IN_DAYS)?.description
                    }
                </Hint>
                <Field.Button
                    form={ FORM_ID }
                    size="small"
                    buttonType="primary_btn"
                    ariaLabel="Idle account suspend config update button"
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
IdleAccountSuspendConfigurationForm.defaultProps = {
    "data-componentid": "idle-account-suspend-edit-form"
};
