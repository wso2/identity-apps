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

import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface } from "../models/governance-connectors";
import { GovernanceConnectorUtils } from "../utils";

/**
 * Interface for admin forced password reset form props.
 */
interface AdminForcedPasswordResetFormPropsInterface extends IdentifiableComponentInterface {
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

const FORM_ID: string = "governance-connectors-ask-password-form";

/**
 * Admin Forced Password Reset Form.
 *
 * @param props - Props injected to the component.
 * @returns Admin Forced Password Form component.
 */
export const AdminForcedPasswordResetForm: FunctionComponent<AdminForcedPasswordResetFormPropsInterface> = (
    props: AdminForcedPasswordResetFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        onSubmit,
        readOnly,
        isConnectorEnabled,
        isSubmitting,
        ["data-componentid"]: testId
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
        let data = {};

        for (const key in values) {
            if (Object.prototype.hasOwnProperty.call(values, key)) {
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
            <Field.Checkbox
                ariaLabel="Recovery.AdminPasswordReset.RecoveryLink"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "Recovery.AdminPasswordReset.RecoveryLink") }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "Account Management",
                    "Recovery.AdminPasswordReset.RecoveryLink", 
                    "Enable password reset via recovery e-mail") }
                defaultValue={ initialFormValues?.[ 
                    "Recovery.AdminPasswordReset.RecoveryLink" ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ testId }-enable-auto-login` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "Account Management",
                    "Recovery.AdminPasswordReset.RecoveryLink", 
                    "User gets notified with a link to reset password.")
                }
            />
            <Field.Checkbox
                ariaLabel="Recovery.AdminPasswordReset.OTP"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "Recovery.AdminPasswordReset.OTP") 
                }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "Account Management",
                    "Recovery.AdminPasswordReset.OTP", 
                    "Enable password reset via OTP") }
                defaultValue={ initialFormValues?.[ 
                    "Recovery.AdminPasswordReset.OTP" ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ testId }-enable-auto-login` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "Account Management",
                    "Recovery.AdminPasswordReset.OTP", 
                    "An OTP generated and stored in users claims.")
                }
            />
            <Field.Checkbox
                ariaLabel="Recovery.AdminPasswordReset.Offline"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "Recovery.AdminPasswordReset.Offline") 
                }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "Account Management",
                    "Recovery.AdminPasswordReset.Offline", 
                    "Enable password reset offline") }
                defaultValue={ initialFormValues?.[ 
                    "Recovery.AdminPasswordReset.Offline" ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ testId }-enable-auto-login` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "Account Management",
                    "Recovery.AdminPasswordReset.Offline", 
                    "An OTP generated and stored in users claims.")
                }
            />
            <Field.Input
                ariaLabel="Recovery.AdminPasswordReset.ExpiryTime"
                inputType="number"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "Recovery.AdminPasswordReset.ExpiryTime") 
                }
                type="number"
                width={ 16 }
                required={ true }
                placeholder={ "Enter password reset code expiry time" }
                labelPosition="top"
                minLength={ 3 }
                maxLength={ 100 }
                readOnly={ readOnly }
                initialValue={ initialFormValues?.[ 
                    "Recovery.AdminPasswordReset.ExpiryTime" ] }
                data-testid={ `${ testId }-otp-length` }
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "Account Management",
                    "Recovery.AdminPasswordReset.ExpiryTime", 
                    "Admin forced password reset code expiry time") }
                disabled={ !isConnectorEnabled }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "Account Management",
                    "Recovery.AdminPasswordReset.ExpiryTime", 
                    "Validity time of the admin forced password reset code in minutes.")
                }
            />
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="Self registration update button"
                name="update-button"
                data-testid={ `${testId}-submit-button` }
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
AdminForcedPasswordResetForm.defaultProps = {
    "data-componentid": "ask-password-edit-form"
};
