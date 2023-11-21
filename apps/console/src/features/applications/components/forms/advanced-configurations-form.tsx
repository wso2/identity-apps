/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import { AlertInterface,
    AlertLevels,
    TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form, FormValue } from "@wso2is/form";
import { Heading } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import useUIConfig from "modules/common/src/hooks/use-ui-configs";
import React, { FunctionComponent,
    ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { applicationConfig } from "../../../../extensions";
import { ApplicationManagementConstants } from "../../constants";
import SAMLWebApplicationTemplate
    from "../../data/application-templates/templates/saml-web-application/saml-web-application.json";
import { AdvancedConfigurationsInterface,
    ApplicationTemplateListItemInterface } from "../../models";

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
    /**
     * On alert fired callback.
     */
    onAlertFired: (alert: AlertInterface) => void;
}

const FORM_ID: string = "application-advanced-configuration-form";

/**
 * Advanced configurations form component.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const AdvancedConfigurationsForm: FunctionComponent<AdvancedConfigurationsFormPropsInterface> = (
    props: AdvancedConfigurationsFormPropsInterface
): ReactElement => {

    const {
        config,
        onSubmit,
        readOnly,
        featureConfig,
        template,
        isSubmitting,
        onAlertFired,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const { UIConfig } = useUIConfig();

    /**
     * Update configuration.
     *
     * @param values - Form values.
     */
    const updateConfiguration = (values: any): void => {

        let androidAttestationServiceCredentialsObject : JSON;

        try {
            if(!isEmpty(values.androidAttestationServiceCredentials)) {
                androidAttestationServiceCredentialsObject = JSON.parse(values.androidAttestationServiceCredentials);
            }
        } catch (ex: any) {
            onAlertFired({
                description: "Unable to update the application configuration",
                level: AlertLevels.ERROR,
                message: t("Improper JSON format for Android Attestation Service Credentials")
            });

            return;
        }

        const data:any = {
            advancedConfigurations: {
                attestationMetaData: {
                    androidAttestationServiceCredentials: androidAttestationServiceCredentialsObject,
                    androidPackageName: values.androidPackageName,
                    appleAppId: values.appleAppId,
                    enableClientAttestation: !!values.enableClientAttestation
                },
                enableAPIBasedAuthentication: !!values.enableAPIBasedAuthentication,
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
            id={ FORM_ID }
            uncontrolledForm={ true }
            onSubmit={ (values: Map<string,FormValue>) => {
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
                hidden={
                    !applicationConfig.advancedConfigurations.showEnableAuthorization
                    || !UIConfig?.classicFeatures?.isXacmlAuthorizationEnabled }
                hint={ t("console:develop.features.applications.forms.advancedConfig.fields.enableAuthorization.hint") }
            />
            {
                (template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION
                    || template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC ) &&
                (
                    <div>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <Divider />
                            <Divider hidden />
                        </Grid.Column>
                        <Heading as="h4">
                            { "API Based Authentication" }
                        </Heading>
                        <Field.CheckboxLegacy
                            ariaLabel="Enable apiBasedAuthentication"
                            name="enableAPIBasedAuthentication"
                            label={ "Enable API Based Authentication" }
                            required={ false }
                            value={ config?.enableAPIBasedAuthentication ? [ "enableAPIBasedAuthentication" ] : [] }
                            data-testid={ `${testId}-enable-api-based-authentication` }
                            hidden={ !applicationConfig.advancedConfigurations.showEnableAuthorization }
                        />
                        <Field.CheckboxLegacy
                            ariaLabel="Enable attestation"
                            name="enableClientAttestation"
                            label={ "Enable Client Attesstation" }
                            required={ false }
                            value={ config?.attestationMetaData?.enableClientAttestation ? 
                                [ "enableClientAttestation" ] : [] }
                            data-testid={ `${testId}-enable-client-attestation` }
                            hidden={ !applicationConfig.advancedConfigurations.showEnableAuthorization }
                        />
                        <Field.Input
                            ariaLabel="Android package name"
                            inputType="default"
                            name="androidPackageName"
                            label={ "Android application package name" }
                            required={ false }
                            value={ config?.attestationMetaData?.androidPackageName ? 
                                config?.attestationMetaData?.androidPackageName : "" }
                            placeholder={ "Android application package name" }
                            hint={
                                "Enter the Android Package Name, a unique identifier for your Android app," +
                                "typically in reverse domain format (e.g., com.example.myapp)."
                            }
                            maxLength={ 200 }
                            minLength={ 3 }
                            width={ 16 }
                            data-testid={ `${testId}-client-attestation-android-package-name` }
                        />
                        <Field.Textarea
                            ariaLabel="Android service account credentials"
                            inputType="description"
                            name="androidAttestationServiceCredentials"
                            label={
                                "Enter Service Account Credential"
                            }
                            placeholder={
                                "Enter Service Account Credential"
                            }
                            value={ config?.attestationMetaData?.androidAttestationServiceCredentials ? 
                                [ JSON.stringify(config?.attestationMetaData?.androidAttestationServiceCredentials,
                                    null, 4) ] : [] }
                            hint={
                                "Provide the JSON key content for the Android service account " +
                                " credentials to access the Google Play Integrity Service."
                            }
                            type="text"
                            maxLength={ 5000 }
                            minLength={ 30 }
                            width={ 30 }
                            data-testid={ `${testId}-client-attestation-android-account-credentials` }
                        />
                        <Field.Input
                            ariaLabel="Apple App Id"
                            inputType="default"
                            name="appleAppId"
                            label={
                                "Apple applicaiton App Id"
                            }
                            required={ false }
                            placeholder={
                                "Apple applicaiton App Id"
                            }
                            value={ config?.attestationMetaData?.appleAppId ? 
                                config?.attestationMetaData?.appleAppId  : "" }
                            hint={
                                "Enter the Apple App ID, a unique identifier assigned " +
                                " by Apple to your app, usually starting with 'com.' or 'bundle.'"
                            }
                            maxLength={ 200 }
                            minLength={ 3 }
                            width={ 16 }
                            data-testid={ `${testId}-client-attestation-apple=app=id` }
                        />
                    </div>
                ) }
            <Field.Button
                form={ FORM_ID }
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
