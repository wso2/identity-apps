/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import {
    AppState,
    FeatureConfigInterface
} from "@wso2is/admin.core.v1";
import { serverConfigurationConfig } from "@wso2is/admin.extensions.v1";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { I18n } from "@wso2is/i18n";
import {
    Hint,
    PrimaryButton,
    RenderInput,
    RenderToggle
} from "@wso2is/react-components";
import camelCase from "lodash-es/camelCase";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
    Field,
    reduxForm
} from "redux-form";
import {
    Divider,
    Form,
    Grid
} from "semantic-ui-react";
import { ServerConfigurationsConstants } from "../../constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface
} from "../../models";
import { GovernanceConnectorUtils } from "../../utils";

/**
 * Determine the matching Form component based on the property attributes.
 *
 * @param property - Connector property.
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
 * @param property - Connector property.
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

interface DynamicConnectorFormPropsInterface {
    isSubmitting: boolean;
    handleSubmit: (values: any) => void;
    [ "data-testid" ]: string;
    props?: any;
    form: string;
    change: any;
    connector: GovernanceConnectorInterface;
}

/**
 * Dynamically render governance connector forms.
 *
 * @param props - Dynamic connector form properties.
 */
const DynamicConnectorForm = (props: DynamicConnectorFormPropsInterface) => {
    const { connector, isSubmitting, handleSubmit, [ "data-testid" ]: testId } = props;
    const properties: ConnectorPropertyInterface[] = props.props.properties;

    const formValues: Record<string, string | boolean>
        = useSelector((state: AppState) => state.form[ props.form ].values);

    const { t, i18n } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const isReadOnly: boolean = useMemo(() => (
        !hasRequiredScopes(
            featureConfig?.attributeDialects, featureConfig?.attributeDialects?.scopes?.update, allowedScopes)
    ), [ featureConfig, allowedScopes ]);

    return (
        <Form onSubmit={ handleSubmit }>
            { <Grid padded={ true }>
                { properties?.map((property: ConnectorPropertyInterface, index: number) => {
                    const fieldLabelKey: string = "governanceConnectors:connectorCategories." +
                        camelCase(connector?.category) + ".connectors."+camelCase(connector?.name) +
                        ".properties."+camelCase(property?.name)+".label";
                    let fieldLabel: string = property?.displayName;

                    if (i18n.exists(fieldLabelKey)) {
                        fieldLabel = t(fieldLabelKey);
                    }

                    const fieldHintKey: string = "governanceConnectors:connectorCategories." +
                        camelCase(connector?.category)+".connectors."+camelCase(connector?.name) +
                        ".properties."+camelCase(property?.name)+".hint";
                    let fieldHint: string = property?.description;

                    if (i18n.exists(fieldHintKey)) {
                        fieldHint = t(fieldHintKey);
                    }

                    return (
                        <Grid.Row
                            columns={ 2 }
                            className={ serverConfigurationConfig.intendSettings && "pl-3" }
                            key={ index }
                        >
                            <Grid.Column
                                mobile={ 12 }
                                tablet={ 12 }
                                computer={ 10 }
                                className={ !serverConfigurationConfig.intendSettings && "pl-0" }
                            >
                                { !isToggle(property) ? (
                                    <Field
                                        name={ GovernanceConnectorUtils.encodeConnectorPropertyName(property.name) }
                                        component={ getFieldComponent(property) }
                                        type={ getFieldType(property) }
                                        required={ true }
                                        width={ 12 }
                                        placeholder={ property.value }
                                        data-testid={ `${ testId }-${ property.name }` }
                                        label={ fieldLabel ?? property?.displayName }
                                        validate={ [
                                            required
                                        ] }
                                        readOnly={ isReadOnly }
                                    />
                                ) : (
                                    <label>{ fieldLabel }</label>
                                ) }
                                {
                                    (property.description) !== ""
                                        && <Hint>{ fieldHint }</Hint>
                                }
                            </Grid.Column>
                            <Grid.Column
                                mobile={ 4 }
                                tablet={ 4 }
                                computer={ 6 }
                                className={ !serverConfigurationConfig.intendSettings && "pl-0" }
                            >
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
                                                ? t("governanceConnectors:enabled")
                                                : t("governanceConnectors:disabled")
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
                                        readOnly={ isReadOnly }
                                    />
                                ) }
                            </Grid.Column>
                            <Divider hidden />
                        </Grid.Row>
                    );
                }) }
                <Grid.Row columns={ 1 } className={ serverConfigurationConfig.intendSettings && "pl-3" }>
                    <Grid.Column
                        mobile={ 16 }
                        tablet={ 16 }
                        computer={ 14 }
                        className={ !serverConfigurationConfig.intendSettings && "pl-0" }
                    >
                        { !isReadOnly && (
                            <PrimaryButton
                                data-testid={ `${ testId }-update-button` }
                                type="submit"
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
                            >
                                { t("common:update") }
                            </PrimaryButton>)
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            }
        </Form>
    );
};

const validate = (values: Record<string, string>) => {
    const errors: Record<string, string> = {};

    const allowedIdleTimeSpanName: string = GovernanceConnectorUtils.encodeConnectorPropertyName(
        ServerConfigurationsConstants.ALLOWED_IDLE_TIME_SPAN_IN_DAYS
    );

    const allowedIdleTimeSpan: number = parseInt(values[ allowedIdleTimeSpanName ]);

    if (allowedIdleTimeSpan < 0) {
        errors[ allowedIdleTimeSpanName ]
            = I18n.instance.t("governanceConnectors:form.errors.positiveIntegers");
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
        ] = I18n.instance.t("governanceConnectors:form.errors.format");

    }

    if (
        !(ServerConfigurationsConstants.MULTI_ATTRIBUTE_CLAIM_LIST_REGEX_PATTERN.test(
            values[
                GovernanceConnectorUtils.encodeConnectorPropertyName(
                    ServerConfigurationsConstants.MULTI_ATTRIBUTE_CLAIM_LIST
                )
            ]
        ))
    ) {
        errors[
            GovernanceConnectorUtils.encodeConnectorPropertyName(
                ServerConfigurationsConstants.MULTI_ATTRIBUTE_CLAIM_LIST
            )
        ] = I18n.instance.t("governanceConnectors:form.errors.format");
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
