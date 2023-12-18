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

import Alert from "@oxygen-ui/react/Alert";
import useUIConfig from "@wso2is/common/src/hooks/use-ui-configs";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    TestableComponentInterface
} from "@wso2is/core/models";
import { Field, Form, FormPropsInterface } from "@wso2is/form";
import { GenericIcon, Heading } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { applicationConfig } from "../../../../extensions";
import { AppState, FeatureConfigInterface, getTechnologyLogos } from "../../../core";
import { ApplicationManagementConstants } from "../../constants";
import SAMLWebApplicationTemplate from
    "../../data/application-templates/templates/saml-web-application/saml-web-application.json";
import {
    AdvancedConfigurationsInterface,
    ApplicationTemplateListItemInterface
} from "../../models";
import "./advanced-configurations-form.scss";

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
        template,
        isSubmitting,
        onAlertFired,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const { UIConfig } = useUIConfig();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const isApplicationNativeAuthenticationEnabled: boolean = isFeatureEnabled(featureConfig?.applications,
        ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_NATIVE_AUTHENTICATION"));

    const formRef: MutableRefObject<FormPropsInterface> = useRef<FormPropsInterface>(null);

    const [ isEnableAPIBasedAuthentication, setIsEnableAPIBasedAuthentication ] = useState<boolean>(
        config?.enableAPIBasedAuthentication
    );
    const [ isEnableClientAttestation, setIsEnableClientAttestation ] = useState<boolean>(
        config?.attestationMetaData?.enableClientAttestation
    );
    const [ isUserClickedClientAttestationWhenDisabled, setIsUserClickedClientAttestationWhenDisabled ] =
        useState<boolean>(false);

    /**
     * Update configuration.
     *
     * @param values - Form values.
     */
    const updateConfiguration = (values: AdvancedConfigurationsInterface): void => {
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

        // if apiBasedAuthentication is disabled, then disable clientAttestation as well.
        const enableClientAttestation: boolean = values.enableAPIBasedAuthentication
            ? values.enableClientAttestation
            : false;

        const data:any = {
            advancedConfigurations: {
                attestationMetaData: {
                    androidAttestationServiceCredentials: androidAttestationServiceCredentialsObject,
                    androidPackageName: values.androidPackageName,
                    appleAppId: values.appleAppId,
                    enableClientAttestation: enableClientAttestation
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

    /**
     * To check if the client attestation UI checkbox should be disabled.
     */
    const isClientAttestationUIDisabled: boolean = !isEnableAPIBasedAuthentication;

    /**
     * To check if the client attestation methods UIs should be disabled.
     */
    const isClientAttestationMethodsUiDisabled: boolean = !isEnableClientAttestation || isClientAttestationUIDisabled;

    /**
     * To handle the enableAPIBasedAuthentication checkbox.
     *
     * @param value - Value of the enableAPIBasedAuthentication checkbox.
     */
    const handleEnableAPIBasedAuthentication = (value: boolean) => {
        setIsEnableAPIBasedAuthentication(value);
        setIsUserClickedClientAttestationWhenDisabled(!value && isEnableClientAttestation);
    };

    /**
     * To handle the client attestation checkbox and related UIs when the client attestation checkbox is disabled.
     */
    const handleWhenClientAttestationClickedWhenDisabled = () =>
        setIsUserClickedClientAttestationWhenDisabled(isClientAttestationUIDisabled);

    /**
     * Validate the form values.
     */
    const validateForm = (values: AdvancedConfigurationsInterface): AdvancedConfigurationsInterface => {

        const errors: AdvancedConfigurationsInterface = {
            androidAttestationServiceCredentials: undefined,
            androidPackageName: undefined
        };

        // Validate the android package name and the android attestation service credentials if one of them is empty for
        // the client attestation to be enabled for Android.
        if (!values.androidPackageName?.toString().trim()
            && values.androidAttestationServiceCredentials?.toString().trim()) {

            errors.androidPackageName = t("console:develop.features.applications.forms.advancedConfig." +
                "sections.applicationNativeAuthentication.fields." +
                "android.fields.androidPackageName.validations.empty");
        } else if (values.androidPackageName?.toString().trim()
            && !values.androidAttestationServiceCredentials?.toString().trim()) {

            errors.androidAttestationServiceCredentials = t("console:develop.features.applications.forms." +
                "advancedConfig.sections.applicationNativeAuthentication.fields." +
                "android.fields.androidAttestationServiceCredentials.validations.empty");
        }

        return errors;
    };

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ true }
            ref={ formRef }
            validate={ validateForm }
            validateOnBlur={ false }
            onSubmit={ (values: AdvancedConfigurationsInterface) => {
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
                data-testid={ `${ testId }-sass-checkbox` }
                data-componentid={ `${ testId }-sass-checkbox` }
                hint={ t("console:develop.features.applications.forms.advancedConfig.fields.saas.hint") }
                hidden={ !UIConfig?.legacyMode?.saasApplications || !applicationConfig.advancedConfigurations.showSaaS }
            />
            <Field.CheckboxLegacy
                ariaLabel="Skip consent login"
                name="skipConsentLogin"
                label={ t("console:develop.features.applications.forms.advancedConfig.fields.skipConsentLogin" +
                    ".label") }
                required={ false }
                value={ config?.skipLoginConsent ? [ "skipLoginConsent" ] : [] }
                readOnly={ readOnly }
                data-testid={ `${ testId }-skip-login-consent-checkbox` }
                data-componentid={ `${ testId }-skip-login-consent-checkbox` }
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
                        data-testid={ `${ testId }-skip-logout-consent-checkbox` }
                        data-componentid={ `${ testId }-skip-logout-consent-checkbox` }
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
                data-testid={ `${ testId }-return-authenticated-idp-list-checkbox` }
                data-componentid={ `${ testId }-return-authenticated-idp-list-checkbox` }
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
                data-testid={ `${ testId }-enable-authorization-checkbox` }
                data-componentid={ `${ testId }-enable-authorization-checkbox` }
                hidden={
                    !applicationConfig.advancedConfigurations.showEnableAuthorization
                    || !UIConfig?.isXacmlConnectorEnabled }
                hint={ t("console:develop.features.applications.forms.advancedConfig.fields.enableAuthorization.hint") }
            />
            {
                (
                    isApplicationNativeAuthenticationEnabled &&
                    template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION ||
                    template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC ||
                    template?.id === ApplicationManagementConstants.MOBILE
                ) && (
                    <>
                        <Grid>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Divider />
                                    <Divider hidden />
                                </Grid.Column>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Heading as="h4">
                                        { "Application native authentication" }
                                    </Heading>

                                    {
                                        (
                                            isClientAttestationUIDisabled &&
                                            isUserClickedClientAttestationWhenDisabled
                                        ) && (
                                            <Alert severity="info" className="client-attestation-info-alert">
                                                { t("console:develop.features.applications.forms.advancedConfig." +
                                                 "sections.applicationNativeAuthentication.alerts.clientAttestation") }
                                            </Alert>
                                        )
                                    }
                                    <Field.CheckboxLegacy
                                        ariaLabel="Enable apiBasedAuthentication"
                                        name="enableAPIBasedAuthentication"
                                        label={ t("console:develop.features.applications.forms.advancedConfig." +
                                            "sections.applicationNativeAuthentication.fields." +
                                            "enableAPIBasedAuthentication.label") }
                                        required={ false }
                                        readOnly={ readOnly }
                                        value={
                                            isEnableAPIBasedAuthentication
                                                ? [ "enableAPIBasedAuthentication" ]
                                                : []
                                        }
                                        listen={ handleEnableAPIBasedAuthentication }
                                        data-testid={ `${ testId }-enable-api-based-authentication` }
                                        data-componentid={ `${ testId }-enable-api-based-authentication` }
                                        hidden={ !applicationConfig.advancedConfigurations.showEnableAuthorization }
                                        hint={ t("console:develop.features.applications.forms.advancedConfig." +
                                            "sections.applicationNativeAuthentication.fields." +
                                            "enableAPIBasedAuthentication.hint") }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 } onClick={ handleWhenClientAttestationClickedWhenDisabled }>
                                <Grid.Column>
                                    <Field.CheckboxLegacy
                                        ariaLabel="Enable attestation"
                                        name="enableClientAttestation"
                                        label={ t("console:develop.features.applications.forms.advancedConfig." +
                                            "sections.applicationNativeAuthentication.fields." +
                                            "enableClientAttestation.label") }
                                        required={ false }
                                        readOnly={ readOnly }
                                        value={
                                            config?.attestationMetaData?.enableClientAttestation
                                                ? [ "enableClientAttestation" ]
                                                : []
                                        }
                                        listen={ setIsEnableClientAttestation }
                                        data-testid={ `${ testId }-enable-client-attestation` }
                                        data-componentid={ `${ testId }-enable-api-based-authentication` }
                                        disabled={ isClientAttestationUIDisabled }
                                        hint={ t("console:develop.features.applications.forms.advancedConfig." +
                                            "sections.applicationNativeAuthentication.fields." +
                                            "enableClientAttestation.hint") }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 } onClick={ handleWhenClientAttestationClickedWhenDisabled }>
                                <Grid.Column >
                                    <Heading as="h5" bold="500">
                                        <GenericIcon
                                            size="micro"
                                            icon={ getTechnologyLogos().android }
                                            verticalAlign="middle"
                                            floated="left"
                                        />
                                        { t("console:develop.features.applications.forms.advancedConfig." +
                                            "sections.applicationNativeAuthentication.fields." +
                                            "android.heading") }
                                    </Heading>
                                    <Field.Input
                                        ariaLabel="Android package name"
                                        inputType="default"
                                        name="androidPackageName"
                                        label={ t("console:develop.features.applications.forms.advancedConfig." +
                                            "sections.applicationNativeAuthentication.fields." +
                                            "android.fields.androidPackageName.label") }
                                        required={ false }
                                        readOnly={ readOnly }
                                        value={ config?.attestationMetaData?.androidPackageName ?
                                            config?.attestationMetaData?.androidPackageName : "" }
                                        placeholder={ t("console:develop.features.applications.forms.advancedConfig." +
                                            "sections.applicationNativeAuthentication.fields." +
                                            "android.fields.androidPackageName.placeholder") }
                                        hint={ t("console:develop.features.applications.forms.advancedConfig." +
                                            "sections.applicationNativeAuthentication.fields." +
                                            "android.fields.androidPackageName.hint") }
                                        maxLength={ 200 }
                                        minLength={ 3 }
                                        width={ 16 }
                                        data-testid={ `${ testId }-client-attestation-android-package-name` }
                                        data-componentid={ `${ testId }-client-attestation-android-package-name` }
                                        disabled={ isClientAttestationMethodsUiDisabled }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 } onClick={ handleWhenClientAttestationClickedWhenDisabled }>
                                <Grid.Column>
                                    <Field.Textarea
                                        ariaLabel="Android service account credentials"
                                        inputType="description"
                                        name="androidAttestationServiceCredentials"
                                        label={ t("console:develop.features.applications.forms.advancedConfig." +
                                            "sections.applicationNativeAuthentication.fields." +
                                            "android.fields.androidAttestationServiceCredentials.label") }
                                        placeholder={ t("console:develop.features.applications.forms.advancedConfig." +
                                            "sections.applicationNativeAuthentication.fields." +
                                            "android.fields.androidAttestationServiceCredentials.placeholder") }
                                        value={ config?.attestationMetaData?.androidAttestationServiceCredentials ?
                                            [ JSON.stringify(
                                                config?.attestationMetaData?.androidAttestationServiceCredentials,
                                                null, 4)
                                            ] : []
                                        }
                                        hint={ t("console:develop.features.applications.forms.advancedConfig." +
                                            "sections.applicationNativeAuthentication.fields." +
                                            "android.fields.androidAttestationServiceCredentials.hint") }
                                        type="text"
                                        maxLength={ 5000 }
                                        minLength={ 30 }
                                        width={ 16 }
                                        data-testid={ `${ testId }-client-attestation-android-account-credentials` }
                                        data-componentid={
                                            `${ testId }-client-attestation-android-account-credentials`
                                        }
                                        disabled={ isClientAttestationMethodsUiDisabled }
                                        readOnly={ readOnly }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 } onClick={ handleWhenClientAttestationClickedWhenDisabled }>
                                <Grid.Column>
                                    <Heading as="h5" bold="500">
                                        <GenericIcon
                                            size="micro"
                                            icon={ getTechnologyLogos().apple }
                                            floated="left"
                                            verticalAlign="middle"
                                        />
                                        { t("console:develop.features.applications.forms.advancedConfig." +
                                            "sections.applicationNativeAuthentication.fields." +
                                            "apple.heading") }
                                    </Heading>
                                    <Field.Input
                                        ariaLabel="Apple App Id"
                                        inputType="default"
                                        name="appleAppId"
                                        label={ t("console:develop.features.applications.forms.advancedConfig." +
                                            "sections.applicationNativeAuthentication.fields." +
                                            "apple.fields.appleAppId.label") }
                                        required={ false }
                                        placeholder={ t("console:develop.features.applications.forms.advancedConfig." +
                                            "sections.applicationNativeAuthentication.fields." +
                                            "apple.fields.appleAppId.placeholder") }
                                        value={ config?.attestationMetaData?.appleAppId ?
                                            config?.attestationMetaData?.appleAppId  : "" }
                                        hint={ t("console:develop.features.applications.forms.advancedConfig." +
                                            "sections.applicationNativeAuthentication.fields." +
                                            "apple.fields.appleAppId.hint") }
                                        maxLength={ 200 }
                                        minLength={ 3 }
                                        width={ 16 }
                                        data-testid={ `${ testId }-client-attestation-apple=app=id` }
                                        data-componentid={ `${ testId }-client-attestation-apple=app=id` }
                                        disabled={ isClientAttestationMethodsUiDisabled }
                                        readOnly={ readOnly }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </>
                ) }
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="Update button"
                name="update-button"
                data-testid={ `${ testId }-submit-button` }
                data-componentid={ `${ testId }-submit-button` }
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
