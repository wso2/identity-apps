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
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface
} from "../models/governance-connectors";
import { GovernanceConnectorUtils } from "../utils/governance-connector-utils";

/**
 * Interface for Username Recovery Configuration Form props.
 */
interface UsernameRecoveryConfigurationFormPropsInterface extends IdentifiableComponentInterface {
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
}

/**
 * Proptypes for the Username Recovery Form error messages.
 */
export interface UsernameRecoveryFormErrorValidationsInterface {
    /**
     * Recovery link expiry time field.
     */
    expiryTime: string;
}

const FORM_ID: string = "governance-connectors-username-recovery-form";

/**
 * Username Recovery Configuration Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const UsernameRecoveryConfigurationForm: FunctionComponent<UsernameRecoveryConfigurationFormPropsInterface> = (
    props: UsernameRecoveryConfigurationFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        onSubmit,
        readOnly,
        ["data-componentid"]: testId
    } = props;

    const [ initialValue, setInitialValue ]
        = useState<string>("");

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(initialValues?.properties)) {
            return;
        }

        initialValues.properties.map((property: ConnectorPropertyInterface) => {
            if (property.name === ServerConfigurationsConstants.USERNAME_RECOVERY_ENABLE) {
                setInitialValue(property.value);
            }
        });
    }, [ initialValues ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (value: boolean) => {
        const data: { [ key: string ]: unknown } = {
            [ GovernanceConnectorUtils.decodeConnectorPropertyName(
                ServerConfigurationsConstants.USERNAME_RECOVERY_ENABLE) ]: value.toString()
        };

        return data;
    };

    return (
        <div className={ "connector-form" }>
            <Form
                id={ FORM_ID }
                onSubmit={ null }
                uncontrolledForm={ false }
            >
                <Field.Checkbox
                    className="mb-3"
                    ariaLabel="notifyRecoverySuccess"
                    name={ ServerConfigurationsConstants.USERNAME_RECOVERY_ENABLE }
                    label="Enable username recovery"
                    required={ false }
                    readOnly={ readOnly }
                    width={ 10 }
                    data-testid={ `${testId}-notify-success` }
                    toggle
                    listen={ (value: boolean) => onSubmit(getUpdatedConfigurations(value)) }
                    checked={ initialValue === "true" }
                />
            </Form>
        </div>
    );
};

/**
 * Default props for the component.
 */
UsernameRecoveryConfigurationForm.defaultProps = {
    "data-componentid": "username-recovery-edit-form"
};
