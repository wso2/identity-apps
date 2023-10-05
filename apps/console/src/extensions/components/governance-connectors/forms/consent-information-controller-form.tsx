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
import { useTranslation } from "react-i18next";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface
} from "../../../../features/server-configurations";
import { ConsentInformationControllerFormValuesInterface } from "../models/consent-information-controller";

/**
 * Interface for Password Recovery Configuration Form props.
 */
interface ConsentInformationControllerConfigurationFormPropsInterface extends IdentifiableComponentInterface {
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

const FORM_ID: string = "governance-connectors-consent-information-controller-form";

/**
 * Consent Information Controller Configuration Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const ConsentInformationControllerConfigurationForm: FunctionComponent<
ConsentInformationControllerConfigurationFormPropsInterface> = (
    props: ConsentInformationControllerConfigurationFormPropsInterface
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
        = useState<ConsentInformationControllerFormValuesInterface>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {
        if (isEmpty(initialValues?.properties)) {
            return;
        }

        let resolvedInitialValues: ConsentInformationControllerFormValuesInterface = null;

        initialValues.properties.map((property: ConnectorPropertyInterface) => {
            resolvedInitialValues = {
                ...resolvedInitialValues,
                [property.name]: property.value
            };
        });        
        setInitialConnectorValues(resolvedInitialValues);        
    }, [ initialValues ]);


    return (
        <div className={ "connector-form" }>
            <Form
                id={ FORM_ID }
                initialValues={ initialConnectorValues }
                onSubmit={ (values: any) => onSubmit(values) }
                uncontrolledForm={ false }
            >
                {
                    initialValues?.properties?.map((property: ConnectorPropertyInterface, index: number) => {
                        if (property.name === "enable") {
                            return null;
                        }

                        return (
                            <Field.Input
                                ariaLabel={ property.name }
                                inputType="default"
                                key={ index }
                                name={ property.name }
                                label={ property.displayName }
                                required={ true }
                                maxLength={ null }
                                minLength={ null }
                                readOnly={ readOnly }
                                width={ 12 }
                                disabled={ !isConnectorEnabled }
                                data-testid={ `${componentId}-${property.name}` }
                                hint={ property.description }
                                className="mt-5"
                            />
                        );
                    })
                }
                <Field.Button
                    form={ FORM_ID }
                    size="small"
                    className="mt-5"
                    buttonType="primary_btn"
                    ariaLabel="Consent information controller config update button"
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
ConsentInformationControllerConfigurationForm.defaultProps = {
    "data-componentid": "consent-information-controller-edit-form"
};
