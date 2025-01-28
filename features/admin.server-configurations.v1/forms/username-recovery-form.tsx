/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import Alert from "@oxygen-ui/react/Alert";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import {
    UsernameRecoveryFormConstants
} from "@wso2is/admin.server-configurations.v1/constants/username-recovery-constants";
import {
    UsernamePasswordRecoveryFormUpdatableConfigsInterface,
    UsernameRecoveryConfigurationFormPropsInterface,
    UsernameRecoveryFormValuesInterface
} from "@wso2is/admin.server-configurations.v1/models/username-recovery";
import { CommonUtils } from "@wso2is/core/utils";
import { Field, Form } from "@wso2is/form";
import { Heading, Link } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";
import {
    ConnectorPropertyInterface
} from "../models/governance-connectors";

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

    const { t } = useTranslation();

    const {
        initialValues,
        onSubmit,
        readOnly,
        isSubmitting,
        ["data-componentid"]: testId
    } = props;

    const [ initialConnectorValues, setInitialConnectorValues ]
        = useState<UsernameRecoveryFormValuesInterface>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(initialValues?.properties)) {
            return;
        }

        let resolvedInitialValues: UsernameRecoveryFormValuesInterface = null;

        initialValues.properties.map((property: ConnectorPropertyInterface) => {
            if (UsernameRecoveryFormConstants.allowedConnectorFields.includes(property?.name)) {
                switch(property.name) {
                    case ServerConfigurationsConstants.USERNAME_RECOVERY_EMAIL_ENABLE:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableEmailBasedRecovery: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.USERNAME_RECOVERY_SMS_ENABLE:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableSMSBasedRecovery: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    default:
                        // Invalid type is not handled since the form is generated based on the allowed fields.
                        break;
                }
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
    const getUpdatedConfigurations = (values: Record<string, boolean>) => {

        const data: UsernamePasswordRecoveryFormUpdatableConfigsInterface = {
            "Recovery.Notification.Username.Email.Enable":
                values.enableEmailBasedRecovery ?? initialConnectorValues?.enableEmailBasedRecovery,

            "Recovery.Notification.Username.SMS.Enable":
                values.enableSMSBasedRecovery ?? initialConnectorValues?.enableSMSBasedRecovery
        };

        return data;
    };

    if (!initialConnectorValues) {
        return null;
    }

    return (
        <div className={ "connector-form" }>
            <Form
                id={ FORM_ID }
                onSubmit={ (values: Record<string, boolean>) => onSubmit(getUpdatedConfigurations(values)) }
                uncontrolledForm={ false }
                initialValues={ initialConnectorValues }
            >
                <Heading as="h4" className="mb-5">
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.recoveryOptionHeading") }
                </Heading>

                <Field.Checkbox
                    className="mb-5"
                    ariaLabel="enableEmailBasedRecovery"
                    name="enableEmailBasedRecovery"
                    label={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "usernameRecovery.form.fields.enableEmailBasedRecovery.label") }
                    required={ false }
                    readOnly={ readOnly }
                    width={ 10 }
                    data-componentid={ `${ testId }-email-based-recovery` }
                />

                {
                    <Alert severity="info">
                        <Trans
                            i18nKey={
                                "extensions:manage.serverConfigurations.accountRecovery." +
                                "usernameRecovery.form.smsProviderWarning"
                            }>
                          Ensure that an
                            <Link
                                external={ false }
                                onClick={ () => {
                                    history.push(
                                        AppConstants.getPaths().get("SMS_PROVIDER")
                                    );
                                } }
                            >SMS Provider
                            </Link>
                                &nbsp;is configured for the SMS feature to work properly.
                        </Trans>
                    </Alert>
                }

                <Field.Checkbox
                    className="mt-3 mb-5"
                    ariaLabel="enableSMSBasedRecovery"
                    name="enableSMSBasedRecovery"
                    label={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "usernameRecovery.form.fields.enableSMSBasedRecovery.label") }
                    required={ false }
                    readOnly={ readOnly }
                    width={ 10 }
                    data-componentid={ `${ testId }-sms-based-recovery` }
                />

                <Field.Button
                    form={ FORM_ID }
                    size="small"
                    buttonType="primary_btn"
                    ariaLabel="Username Recovery update button"
                    name="update-button"
                    data-componentid={ `${ testId }-submit-button` }
                    disabled={ isSubmitting }
                    loading={ isSubmitting }
                    label={ t("common:update") }
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
