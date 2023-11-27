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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface, ProfileSchemaInterface } from "@wso2is/core/models";
import { Field, Form, FormFieldMessage } from "@wso2is/form";
import { ConfirmationModal, Hint, Text } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { AppState } from "apps/console/src/features/core";
import { getUsernameConfiguration } from "apps/console/src/features/users/utils/user-management-utils";
import { useValidationConfigData } from "apps/console/src/features/validation/api";
import camelCase from "lodash-es/camelCase";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import { FeatureConfigInterface } from "modules/common/src/models/config";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, Label } from "semantic-ui-react";
import { serverConfigurationConfig } from "../../../extensions/configs";
import { GovernanceConnectorConstants } from "../constants/governance-connector-constants";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface } from "../models/governance-connectors";
import { GovernanceConnectorUtils } from "../utils";

/**
 * Interface for organization self service form props.
 */
interface OrganizationSelfServiceFormPropsInterface extends IdentifiableComponentInterface {
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

const FORM_ID: string = "governance-connectors-organization-self-service-form";

/**
 * Organization Self Service Form.
 *
 * @param props - Props injected to the component.
 * @returns Organization Self Service Form component.
 */
export const OrganizationSelfServiceForm: FunctionComponent<OrganizationSelfServiceFormPropsInterface> = (
    props: OrganizationSelfServiceFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        onSubmit,
        readOnly,
        isConnectorEnabled,
        isSubmitting,
        ["data-componentid"]: componentId
    } = props;

    console.log("isConnectorEnabled", isConnectorEnabled);

    const { t } = useTranslation();

    const [ initialConnectorValues, setInitialConnectorValues ]
        = useState<Map<string, ConnectorPropertyInterface>>(undefined);
    const [ initialFormValues, setInitialFormValues ]
        = useState<any>(undefined);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const isReadOnly: boolean = useMemo(() => (
        !hasRequiredScopes(
            featureConfig?.governanceConnectors, featureConfig?.governanceConnectors?.scopes?.update, allowedScopes)
    ), [ featureConfig, allowedScopes ]);


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
            if (Object.prototype.hasOwnProperty.call(values, key)
            && key !== ServerConfigurationsConstants.ORGANIZATION_SELF_SERVICE_ENABLE) {
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
                ariaLabel="Organization.SelfService.AdminEmailVerification"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "Organization.SelfService.AdminEmailVerification") }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "Organization.SelfService.AdminEmailVerification",
                    "Onboard admin to root organization") }
                defaultValue={ initialFormValues?.[
                    "Organization.SelfService.AdminEmailVerification" ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ componentId }-enable-auto-login` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    "Organization.SelfService.AdminEmailVerification",
                    "User gets onboard as an admin in suborganization")
                }
            />
            <Field.Checkbox
                ariaLabel="Organization.SelfService.OnboardAdminToSubOrg"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "Organization.SelfService.OnboardAdminToSubOrg") }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "Organization.SelfService.OnboardAdminToSubOrg",
                    "Onboard admin to root organization") }
                defaultValue={ initialFormValues?.[
                    "Organization.SelfService.OnboardAdminToSubOrg" ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ componentId }-enable-auto-login` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    "Organization.SelfService.OnboardAdminToSubOrg",
                    "User gets onboard as admin in suborganization.")
                }
            />
            <Field.Checkbox
                ariaLabel="Organization.SelfService.EnableAutoLogin"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "Organization.SelfService.EnableAutoLogin") }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "Organization.SelfService.EnableAutoLogin",
                    "Auto login after self service") }
                defaultValue={ initialFormValues?.[
                    "Organization.SelfService.EnableAutoLogin" ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ componentId }-enable-auto-login` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    "Organization.SelfService.EnableAutoLogin",
                    "After self service admin auto login to organization")
                }
            />
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="Self registration update button"
                name="update-button"
                data-testid={ `${ componentId }-submit-button` }
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
OrganizationSelfServiceForm.defaultProps = {
    "data-componentid": "organization-self-service-edit-form"
};
