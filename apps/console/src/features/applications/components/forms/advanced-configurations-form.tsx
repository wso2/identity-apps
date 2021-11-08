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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { applicationConfig } from "../../../../extensions";
import SAMLWebApplicationTemplate
    from "../../data/application-templates/templates/saml-web-application/saml-web-application.json";
import { AdvancedConfigurationsInterface, ApplicationTemplateListItemInterface } from "../../models";

/**
 *  Advanced Configurations for the Application.
 */
interface AdvancedConfigurationsFormPropsInterface extends TestableComponentInterface {
    config: AdvancedConfigurationsInterface;
    onSubmit: (values: any) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Application template.
     */
    template?: ApplicationTemplateListItemInterface;
    /**
     * Specifies if the form is submitting
     */
    isSubmitting?: boolean;
}

/**
 * Advanced configurations form component.
 *
 * @param {AdvancedConfigurationsFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AdvancedConfigurationsForm: FunctionComponent<AdvancedConfigurationsFormPropsInterface> = (
    props: AdvancedConfigurationsFormPropsInterface
): ReactElement => {

    const {
        config,
        onSubmit,
        readOnly,
        template,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any): void => {
        const data = {
            advancedConfigurations: {
                enableAuthorization: !!values.enableAuthorization,
                returnAuthenticatedIdpList: !!values.returnAuthenticatedIdpList,
                saas: !!values.saas,
                skipLoginConsent: !!values.skipConsentLogin,
                skipLogoutConsent: !!values.skipConsentLogout
            }
        };

        !applicationConfig.advancedConfigurations.showSaaS && delete data.advancedConfigurations.saas;
        !applicationConfig.advancedConfigurations.showEnableAuthorization &&
            delete data.advancedConfigurations.enableAuthorization;
        !applicationConfig.advancedConfigurations.showReturnAuthenticatedIdPs &&
            delete data.advancedConfigurations.returnAuthenticatedIdpList;

        onSubmit(data);
    };

    return (
        <Form
            uncontrolledForm={ false }
            onSubmit={ (values) => {
                updateConfiguration(values);
            } }
        >
            <Field.CheckboxLegacy
                ariaLabel="Saas application"
                name="saas"
                label={ t("console:develop.features.applications.forms.advancedConfig.fields.saas.label") }
                required={ false }
                value={ config?.saas ? [ "saas" ] : [] }
                readOnly={ readOnly }
                data-testid={ `${testId}-sass-checkbox` }
                hint={ t("console:develop.features.applications.forms.advancedConfig.fields.saas.hint") }
                hidden={ !applicationConfig.advancedConfigurations.showSaaS }
            />
            <Field.CheckboxLegacy
                ariaLabel="Skip consent login"
                name="skipConsentLogin"
                label={ t("console:develop.features.applications.forms.advancedConfig.fields.skipConsentLogin" +
                    ".label") }
                required={ false }
                value={ config?.skipLoginConsent ? [ "skipLoginConsent" ] : [] }
                readOnly={ readOnly }
                data-testid={ `${testId}-skip-login-consent-checkbox` }
                hint={ t("console:develop.features.applications.forms.advancedConfig.fields.skipConsentLogin.hint") }
            />
            {
                SAMLWebApplicationTemplate?.id !== template?.id &&
                (
                    <Field.CheckboxLegacy
                        ariaLabel="Skip consent logout"
                        name="skipConsentLogout"
                        label={
                            t("console:develop.features.applications.forms.advancedConfig.fields" +
                                ".skipConsentLogout.label")
                        }
                        required={ false }
                        value={ config?.skipLogoutConsent ? [ "skipLogoutConsent" ] : [] }
                        readOnly={ readOnly }
                        data-testid={ `${testId}-skip-logout-consent-checkbox` }
                        hint={ t("console:develop.features.applications.forms.advancedConfig.fields.skipConsentLogout" +
                            ".hint"
                        ) }
                    />
                )
            }
            <Field.CheckboxLegacy
                ariaLabel="Return authenticated IDP list"
                name="returnAuthenticatedIdpList"
                label={ t("console:develop.features.applications.forms.advancedConfig.fields." +
                    "returnAuthenticatedIdpList.label"
                ) }
                required={ false }
                value={ config?.returnAuthenticatedIdpList ? [ "returnAuthenticatedIdpList" ] : [] }
                readOnly={ readOnly }
                data-testid={ `${testId}-return-authenticated-idp-list-checkbox` }
                hidden={ !applicationConfig.advancedConfigurations.showReturnAuthenticatedIdPs }
                hint={ t("console:develop.features.applications.forms.advancedConfig.fields" +
                    ".returnAuthenticatedIdpList.hint"
                ) }
            />
            <Field.CheckboxLegacy
                ariaLabel="Enable authorization"
                name="enableAuthorization"
                label={ t("console:develop.features.applications.forms.advancedConfig.fields." +
                    "enableAuthorization.label"
                ) }
                required={ false }
                value={ config?.enableAuthorization ? [ "enableAuthorization" ] : [] }
                readOnly={ readOnly }
                data-testid={ `${testId}-enable-authorization-checkbox` }
                hidden={ !applicationConfig.advancedConfigurations.showEnableAuthorization }
                hint={ t("console:develop.features.applications.forms.advancedConfig.fields.enableAuthorization.hint") }
            />
            <Field.Button
                size="small"
                buttonType="primary_btn"
                ariaLabel="Update button"
                name="update-button"
                data-testid={ `${ testId }-submit-button` }
                disabled={ isSubmitting }
                loading={ isSubmitting }
                hidden={ readOnly }
                label={ t("common:update") }
            />
        </Form>
    );
};

/**
 * Default props for the application advanced configurations form component.
 */
AdvancedConfigurationsForm.defaultProps = {
    "data-testid": "application-advanced-configurations-form"
};
