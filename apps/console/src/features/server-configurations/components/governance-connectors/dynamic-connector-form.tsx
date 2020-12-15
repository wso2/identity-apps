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

import { I18n } from "@wso2is/i18n";
import { Hint, PrimaryButton, RenderInput, RenderToggle } from "@wso2is/react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Divider, Form, Grid } from "semantic-ui-react";
import { AppState } from "../../../core";
import { ServerConfigurationsConstants } from "../../constants";
import { ConnectorPropertyInterface } from "../../models";
import { GovernanceConnectorUtils } from "../../utils";

/**
 * Determine the matching Form component based on the property attributes.
 *
 * @param property
 */
const getFieldComponent = (property: ConnectorPropertyInterface) => {
    if (property.value === "true" || property.value === "false") {
        return RenderToggle;
    } else {
        return RenderInput;
    }
};

/**
 * Returns if teh connector property is a toggle or not.
 *
 * @param {ConnectorPropertyInterface} property Connector property.
 */
const isToggle = (property: ConnectorPropertyInterface) => {
    return property.value === "true" || property.value === "false";
};

const getFieldType = (property: ConnectorPropertyInterface) => {
    if (property.name.startsWith("__secret__")) {
        return "password";
    } else {
        return "text";
    }
};

const required =
    (value: string) => value ? undefined : I18n.instance.t("common:required");

/**
 * Dynamically render governance connector forms.
 *
 * @param props
 * @constructor
 */
const DynamicConnectorForm = (props) => {
    const { handleSubmit, [ "data-testid" ]: testId } = props;
    const properties: ConnectorPropertyInterface[] = props.props.properties;

    const formValues = useSelector((state: AppState) => state.form[ props.form ].values);

    const { t } = useTranslation();

    return (
        <Form onSubmit={ handleSubmit }>
            { <Grid padded={ true }>
                { properties?.map((property, index) => {
                    return (
                        <Grid.Row columns={ 2 } className="pl-3" key={ index }>
                            <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 10 }>
                                { !isToggle(property) ? (
                                    <Field
                                        name={ GovernanceConnectorUtils.encodeConnectorPropertyName(property.name) }
                                        component={ getFieldComponent(property) }
                                        type={ getFieldType(property) }
                                        required={ true }
                                        width={ 12 }
                                        placeholder={ property.value }
                                        data-testid={ `${ testId }-${ property.name }` }
                                        label={ property.displayName }
                                        validate={ [
                                            required
                                        ] }
                                    />
                                ) : (
                                        <label>{ property.displayName }</label>
                                    ) }
                                { property.description !== "" && <Hint>{ property.description }</Hint> }
                            </Grid.Column>
                            <Grid.Column mobile={ 4 } tablet={ 4 } computer={ 6 }>
                                { isToggle(property) && (
                                    <Field
                                        name={ GovernanceConnectorUtils.encodeConnectorPropertyName(property.name) }
                                        component={ RenderToggle }
                                        type={ getFieldType(property) }
                                        width={ 10 }
                                        placeholder={ property.value }
                                        data-testid={ `${ testId }-${ property.name }` }
                                        label={
                                            formValues[
                                                GovernanceConnectorUtils.encodeConnectorPropertyName(property.name)
                                            ]
                                                ? t("console:manage.features.governanceConnectors.enabled")
                                                : t("console:manage.features.governanceConnectors.disabled")
                                        }
                                        onChange={ (event: any, newValue: boolean) => {
                                            if (
                                                property.name ===
                                                ServerConfigurationsConstants.RE_CAPTCHA_ALWAYS_ENABLE &&
                                                newValue
                                            ) {
                                                props.change(
                                                    GovernanceConnectorUtils.encodeConnectorPropertyName(
                                                        ServerConfigurationsConstants
                                                            .RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE
                                                    ),
                                                    false
                                                );
                                            }

                                            if (
                                                property.name ===
                                                ServerConfigurationsConstants
                                                    .RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE &&
                                                newValue
                                            ) {
                                                props.change(
                                                    GovernanceConnectorUtils.encodeConnectorPropertyName(
                                                        ServerConfigurationsConstants.RE_CAPTCHA_ALWAYS_ENABLE
                                                    ),
                                                    false
                                                );
                                            }
                                        } }
                                    />
                                ) }
                            </Grid.Column>
                            <Divider hidden />
                        </Grid.Row>
                    );
                }) }
                <Grid.Row columns={ 1 } className="pl-3">
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                        <PrimaryButton type="submit">{ t("common:update") }</PrimaryButton>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            }
        </Form>
    );
};

const validate = (values) => {
    const errors = {};

    const allowedIdleTimeSpanName = GovernanceConnectorUtils.encodeConnectorPropertyName(
        ServerConfigurationsConstants.ALLOWED_IDLE_TIME_SPAN_IN_DAYS
    );

    const allowedIdleTimeSpan = parseInt(values[ allowedIdleTimeSpanName ]);

    if (allowedIdleTimeSpan < 0) {
        errors[ allowedIdleTimeSpanName ]
            = I18n.instance.t("console:manage.features.governanceConnectors.form.errors.positiveIntegers");
    }

    if (
        !RegExp(/^(?:\d+,)+\d+$/).test(
            values[
                GovernanceConnectorUtils.encodeConnectorPropertyName(
                    ServerConfigurationsConstants.ALERT_SENDING_TIME_PERIODS_IN_DAYS
                )
            ]
        )
    ) {
        errors[
            GovernanceConnectorUtils.encodeConnectorPropertyName(
                ServerConfigurationsConstants.ALERT_SENDING_TIME_PERIODS_IN_DAYS
            )
        ] = I18n.instance.t("console:manage.features.governanceConnectors.form.errors.format");

    }

    return errors;
};

export default reduxForm({
    enableReinitialize: true,
    validate
})(DynamicConnectorForm);

/**
 * Default props for the component.
 */
DynamicConnectorForm.defaultProps = {
    "data-testid": "dynamic-connector-form"
};
