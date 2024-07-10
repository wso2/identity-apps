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
import { AppState, FeatureConfigInterface, getTechnologyLogos } from "@wso2is/admin.core.v1";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { applicationConfig } from "@wso2is/admin.extensions.v1";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    TestableComponentInterface
} from "@wso2is/core/models";
import { Field, Form, FormPropsInterface } from "@wso2is/form";
import { ConfirmationModal, GenericIcon, Heading, URLInput  } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, {
    Fragment,
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
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
    const isTrustedAppsFeatureEnabled: boolean = isFeatureEnabled(featureConfig?.applications,
        ApplicationManagementConstants.FEATURE_DICTIONARY.get("TRUSTED_APPS"));

    const formRef: MutableRefObject<FormPropsInterface> = useRef<FormPropsInterface>(null);

    const [ isEnableAPIBasedAuthentication, setIsEnableAPIBasedAuthentication ] = useState<boolean>(
        config?.enableAPIBasedAuthentication
    );
    const [ isEnableClientAttestation, setIsEnableClientAttestation ] = useState<boolean>(
        config?.attestationMetaData?.enableClientAttestation
    );
    const [ isUserClickedClientAttestationWhenDisabled, setIsUserClickedClientAttestationWhenDisabled ] =
        useState<boolean>(false);
    const [ isFIDOTrustedAppsEnabled, setIsFIDOTrustedAppsEnabled ] = useState<boolean>(
        config?.trustedAppConfiguration?.isFIDOTrustedApp);
    const [ isConsentGranted, setIsConsentGranted ] = useState<boolean>(
        config?.trustedAppConfiguration?.isConsentGranted);
    const [ showFIDOConfirmationModal, setShowFIDOConfirmationModal ] = useState<boolean>(false);
    const [ showThumbprintsError, setShowThumbprinstError ] = useState(false);
    const [ thumbprints, setThumbprints ] = useState(config?.trustedAppConfiguration?.androidThumbprints?.join(","));

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
                    androidPackageName: enableClientAttestation ? values.androidPackageName : "",
                    appleAppId: enableClientAttestation ? values.appleAppId : "",
                    enableClientAttestation: enableClientAttestation
                },
                enableAPIBasedAuthentication: !!values.enableAPIBasedAuthentication,
                enableAuthorization: !!values.enableAuthorization,
                returnAuthenticatedIdpList: !!values.returnAuthenticatedIdpList,
                saas: !!values.saas,
                skipLoginConsent: !!values.skipConsentLogin,
                skipLogoutConsent: !!values.skipConsentLogout,
                trustedAppConfiguration: values.enableFIDOTrustedApps ?
                    {
                        // androidPackageName and appleAppId is same as clientAttestation.
                        androidPackageName: values.androidPackageName,
                        androidThumbprints: isEmpty(thumbprints) ? [] : thumbprints.split(","),
                        appleAppId: values.appleAppId,
                        isConsentGranted: isConsentGranted,
                        isFIDOTrustedApp: values.enableFIDOTrustedApps
                    } : undefined
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
     * To check if the platform settings UIs should be disabled.
     */
    const isPlatformSettingsUiDisabled: boolean = !isEnableClientAttestation && !isFIDOTrustedAppsEnabled;

    /**
     * To check if the feature is supported in the app template.
     */
    const isSupportedInAppTemplate: boolean = template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION ||
    template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC ||
    template?.id === ApplicationManagementConstants.MOBILE ||
    template?.id === ApplicationManagementConstants.TEMPLATE_IDS.get("oidcWeb");

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
            androidPackageName: undefined,
            androidThumbprints: undefined
        };

        let androidAttestationServiceCredentialsObject : JSON;

        if (values.enableClientAttestation) {
            try {
                if(!isEmpty(values.androidAttestationServiceCredentials)) {
                    androidAttestationServiceCredentialsObject =
                    JSON.parse(values.androidAttestationServiceCredentials);
                }
                // Validate the android package name and android attestation service credentials for client attestation.
                // If one of them is empty throw an error.
                if (!values.androidPackageName?.toString().trim()
                    && Object.keys(androidAttestationServiceCredentialsObject).length) {

                    errors.androidPackageName = t("applications:forms.advancedConfig." +
                        "sections.platformSettings.fields." +
                        "android.fields.androidPackageName.validations.emptyForAttestation");
                } else if (values.androidPackageName?.toString().trim()
                    && !Object.keys(androidAttestationServiceCredentialsObject).length) {

                    errors.androidAttestationServiceCredentials = t("applications:forms." +
                            "advancedConfig.sections.clientAttestation.fields." +
                            "androidAttestationServiceCredentials.validations.empty");
                }
            } catch (ex: any) {
                errors.androidAttestationServiceCredentials = t("applications:forms." +
                "advancedConfig.sections.clientAttestation.fields." +
                "androidAttestationServiceCredentials.validations.invalid");
            }
        } else if (values.enableFIDOTrustedApps) {
            // Validate the android package name and android thumbprints for FIDO trusted apps.
            // If one of them is empty throw an error.
            if (!values.androidPackageName?.toString().trim()
                && thumbprints?.toString().trim()) {

                errors.androidPackageName = t("applications:forms.advancedConfig." +
                    "sections.platformSettings.fields." +
                    "android.fields.androidPackageName.validations.emptyForFIDO");
            } else if (values.androidPackageName?.toString().trim()
                && !thumbprints?.toString().trim()) {

                setShowThumbprinstError(true);
                errors.androidThumbprints = t("applications:forms." +
                    "advancedConfig.sections.platformSettings.fields.android.fields." +
                    "keyHashes.validations.empty");
            }
        }

        return errors;
    };

    /**
     * Handle FIDO activation value with confirmation. Deactivation is not confirmed
     */
    const handleFIDOActivation = (shouldActivate: boolean) => {
        shouldActivate ?
            setShowFIDOConfirmationModal(true)
            : setIsFIDOTrustedAppsEnabled(false);
    };

    return (
        <>
            <Form
                id={ FORM_ID }
                uncontrolledForm={ true }
                ref={ formRef }
                validate={ (anything: AdvancedConfigurationsInterface) => validateForm (anything) }
                validateOnBlur={ false }
                onSubmit={ (values: AdvancedConfigurationsInterface) => {
                    updateConfiguration(values);
                } }
                initialValues={ {
                    androidAttestationServiceCredentials:
                    JSON.stringify(config?.attestationMetaData?.androidAttestationServiceCredentials || ""),
                    androidPackageName: config?.attestationMetaData?.androidPackageName ||
                        config?.trustedAppConfiguration?.androidPackageName,
                    appleAppId: config?.trustedAppConfiguration?.appleAppId || config?.attestationMetaData?.appleAppId
                } }
            >
                <Field.CheckboxLegacy
                    ariaLabel="Saas application"
                    name="saas"
                    label={ t("applications:forms.advancedConfig.fields.saas.label") }
                    required={ false }
                    value={ config?.saas ? [ "saas" ] : [] }
                    readOnly={ readOnly }
                    data-testid={ `${ testId }-sass-checkbox` }
                    data-componentid={ `${ testId }-sass-checkbox` }
                    hint={ t("applications:forms.advancedConfig.fields.saas.hint") }
                    hidden={ !UIConfig?.legacyMode?.saasApplications ||
                        !applicationConfig.advancedConfigurations.showSaaS }
                />
                <Field.CheckboxLegacy
                    ariaLabel="Skip consent login"
                    name="skipConsentLogin"
                    label={ t("applications:forms.advancedConfig.fields.skipConsentLogin" +
                        ".label") }
                    required={ false }
                    value={ config?.skipLoginConsent ? [ "skipLoginConsent" ] : [] }
                    readOnly={ readOnly }
                    data-testid={ `${ testId }-skip-login-consent-checkbox` }
                    data-componentid={ `${ testId }-skip-login-consent-checkbox` }
                    hint={ t("applications:forms.advancedConfig.fields.skipConsentLogin.hint") }
                />
                {
                    SAMLWebApplicationTemplate?.id !== template?.id &&
                    (
                        <Field.CheckboxLegacy
                            ariaLabel="Skip consent logout"
                            name="skipConsentLogout"
                            label={
                                t("applications:forms.advancedConfig.fields" +
                                    ".skipConsentLogout.label")
                            }
                            required={ false }
                            value={ config?.skipLogoutConsent ? [ "skipLogoutConsent" ] : [] }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-skip-logout-consent-checkbox` }
                            data-componentid={ `${ testId }-skip-logout-consent-checkbox` }
                            hint={ t("applications:forms.advancedConfig.fields.skipConsentLogout" +
                                ".hint"
                            ) }
                        />
                    )
                }
                <Field.CheckboxLegacy
                    ariaLabel="Return authenticated IDP list"
                    name="returnAuthenticatedIdpList"
                    label={ t("applications:forms.advancedConfig.fields." +
                        "returnAuthenticatedIdpList.label"
                    ) }
                    required={ false }
                    value={ config?.returnAuthenticatedIdpList ? [ "returnAuthenticatedIdpList" ] : [] }
                    readOnly={ readOnly }
                    data-testid={ `${ testId }-return-authenticated-idp-list-checkbox` }
                    data-componentid={ `${ testId }-return-authenticated-idp-list-checkbox` }
                    hidden={ !applicationConfig.advancedConfigurations.showReturnAuthenticatedIdPs }
                    hint={ t("applications:forms.advancedConfig.fields" +
                        ".returnAuthenticatedIdpList.hint"
                    ) }
                />
                <Field.CheckboxLegacy
                    ariaLabel="Enable authorization"
                    name="enableAuthorization"
                    label={ t("applications:forms.advancedConfig.fields." +
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
                    hint={ t("applications:forms.advancedConfig.fields.enableAuthorization.hint") }
                />
                {
                    (
                        isApplicationNativeAuthenticationEnabled && isSupportedInAppTemplate
                    ) && (
                        <Grid>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Divider />
                                    <Divider hidden />
                                </Grid.Column>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Heading as="h4">
                                        { t("applications:forms.advancedConfig." +
                                        "sections.applicationNativeAuthentication.heading") }
                                    </Heading>
                                    <Field.CheckboxLegacy
                                        ariaLabel="Enable apiBasedAuthentication"
                                        name="enableAPIBasedAuthentication"
                                        label={ t("applications:forms.advancedConfig." +
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
                                        hint={ t("applications:forms.advancedConfig." +
                                            "sections.applicationNativeAuthentication.fields." +
                                            "enableAPIBasedAuthentication.hint") }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row
                                columns={ 1 }
                                onClick={ handleWhenClientAttestationClickedWhenDisabled }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Divider />
                                    <Heading as="h4">
                                        { t("applications:forms.advancedConfig." +
                                            "sections.clientAttestation.heading") }
                                    </Heading>
                                    {
                                        (
                                            isClientAttestationUIDisabled &&
                                            isUserClickedClientAttestationWhenDisabled
                                        ) && (
                                            <Alert severity="info" className="client-attestation-info-alert">
                                                { t("applications:forms.advancedConfig." +
                                                    "sections.clientAttestation.alerts.clientAttestationAlert") }
                                            </Alert>
                                        )
                                    }
                                    <Field.CheckboxLegacy
                                        ariaLabel="Enable attestation"
                                        name="enableClientAttestation"
                                        label={ t("applications:forms." +
                                            "advancedConfig.sections.clientAttestation." +
                                            "fields.enableClientAttestation.label") }
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
                                        hint={ t("applications:forms.advancedConfig." +
                                            "sections.clientAttestation.fields." +
                                            "enableClientAttestation.hint") }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row
                                columns={ 1 }
                                onClick={ handleWhenClientAttestationClickedWhenDisabled }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Field.Textarea
                                        ariaLabel="Android service account credentials"
                                        inputType="description"
                                        name="androidAttestationServiceCredentials"
                                        label={ (
                                            <>
                                                <GenericIcon
                                                    size="micro"
                                                    icon={ getTechnologyLogos().android }
                                                    floated="left"
                                                    verticalAlign="middle"
                                                    spaced="right"
                                                />
                                                { t("applications:forms." +
                                                "advancedConfig." +
                                                "sections.clientAttestation.fields." +
                                                "androidAttestationServiceCredentials.label") }
                                            </>
                                        ) }
                                        placeholder={ t("applications:forms." +
                                            "advancedConfig.sections." +
                                            "clientAttestation.fields." +
                                            "androidAttestationServiceCredentials.placeholder") }
                                        value={
                                            config?.
                                                attestationMetaData?.androidAttestationServiceCredentials ?
                                                [ JSON.stringify(
                                                    config?.
                                                        attestationMetaData?.
                                                        androidAttestationServiceCredentials,
                                                    null, 4)
                                                ] : []
                                        }
                                        hint={ t("applications:forms." +
                                            "advancedConfig." +
                                            "sections.clientAttestation.fields." +
                                            "androidAttestationServiceCredentials.hint") }
                                        type="text"
                                        maxLength={ 5000 }
                                        minLength={ 30 }
                                        width={ 16 }
                                        data-testid={
                                            `${ testId }-client-attestation-android-account-credentials`
                                        }
                                        data-componentid={
                                            `${ testId }-client-attestation-android-account-credentials`
                                        }
                                        disabled={ isClientAttestationMethodsUiDisabled }
                                        readOnly={ readOnly }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    )
                }
                {
                    (
                        isTrustedAppsFeatureEnabled && isSupportedInAppTemplate
                    ) && (
                        <Grid>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Divider />
                                    <Heading as="h4">
                                        { t("applications:forms.advancedConfig.sections.trustedApps.heading") }
                                    </Heading>
                                    <Field.CheckboxLegacy
                                        ariaLabel="Enable FIDO Trusted Apps"
                                        name="enableFIDOTrustedApps"
                                        label={ t("applications:forms.advancedConfig.sections.trustedApps." +
                                            "fields.enableFIDOTrustedApps.label") }
                                        required={ false }
                                        readOnly={ readOnly }
                                        checked={ isFIDOTrustedAppsEnabled }
                                        value={
                                            isFIDOTrustedAppsEnabled ? [ "isFIDOTrustedApp" ] : []

                                        }
                                        listen={ handleFIDOActivation }
                                        data-testid={ `${ testId }-enable-fido-trusted-apps` }
                                        data-componentid={ `${ testId }-enable-fido-trusted-apps` }
                                        hint={ t("applications:forms.advancedConfig.sections." +
                                            "trustedApps.fields.enableFIDOTrustedApps.hint") }
                                    />
                                    {
                                        <Alert severity="warning" className="fido-enabled-warn-alert">
                                            { t("applications:forms.advancedConfig." +
                                                "sections.trustedApps.alerts.trustedAppSettingsAlert") }
                                        </Alert>
                                    }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    )
                }
                {
                    (
                        !isPlatformSettingsUiDisabled && isSupportedInAppTemplate
                    ) && (
                        <Grid>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Divider />
                                    <Heading as="h4">
                                        { t("applications:forms.advancedConfig." +
                                            "sections.platformSettings.heading") }
                                    </Heading>
                                    <Heading subHeading as="h6">
                                        { t("applications:forms.advancedConfig." +
                                            "sections.platformSettings.subTitle") }
                                    </Heading>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column>
                                    <Heading as="h5" bold="500">
                                        <GenericIcon
                                            size="micro"
                                            icon={ getTechnologyLogos().android }
                                            verticalAlign="middle"
                                            floated="left"
                                        />
                                        { t("applications:forms.advancedConfig." +
                                            "sections.platformSettings.fields." +
                                            "android.heading") }
                                    </Heading>
                                    <Field.Input
                                        ariaLabel="Android package name"
                                        inputType="default"
                                        name="androidPackageName"
                                        label={ t("applications:forms." +
                                            "advancedConfig." +
                                            "sections.platformSettings.fields." +
                                            "android.fields.androidPackageName.label") }
                                        required={ false }
                                        readOnly={ readOnly }
                                        value={ (config?.attestationMetaData?.androidPackageName ||
                                            config?.trustedAppConfiguration?.androidPackageName) ?? "" }
                                        placeholder={ t("applications:forms." +
                                            "advancedConfig." +
                                            "sections.platformSettings.fields." +
                                            "android.fields.androidPackageName.placeholder") }
                                        hint={ t("applications:forms." +
                                            "advancedConfig." +
                                            "sections.platformSettings.fields." +
                                            "android.fields.androidPackageName.hint") }
                                        maxLength={ 200 }
                                        minLength={ 3 }
                                        width={ 16 }
                                        data-testid={
                                            `${ testId }-platform-settings-android-package-name`
                                        }
                                        data-componentid={
                                            `${ testId }-platform-settings-android-package-name`
                                        }
                                        disabled={ isPlatformSettingsUiDisabled }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    { isFIDOTrustedAppsEnabled && (
                                        <URLInput
                                            isAllowEnabled={ false }
                                            onlyOrigin={ false }
                                            labelEnabled={ false }
                                            urlState={ thumbprints }
                                            setURLState={ (url: string) => setThumbprints(url) }
                                            labelName={
                                                t("applications:forms." +
                                                    "advancedConfig.sections.platformSettings.fields." +
                                                    "android.fields.keyHashes.label")
                                            }
                                            required={ false }
                                            value={ thumbprints }
                                            validation={ (value: string) => !value?.includes(",") }
                                            placeholder={
                                                t("applications:forms." +
                                                    "advancedConfig.sections.platformSettings.fields." +
                                                    "android.fields.keyHashes.placeholder")
                                            }
                                            validationErrorMsg={
                                                t("applications:forms." +
                                                    "advancedConfig.sections.platformSettings.fields." +
                                                    "android.fields.keyHashes.validations.invalid")
                                            }
                                            showError={ showThumbprintsError }
                                            setShowError={ setShowThumbprinstError }
                                            hint={ t("applications:forms." +
                                                "advancedConfig.sections.platformSettings.fields." +
                                                "android.fields.keyHashes.hint") }
                                            readOnly={ readOnly }
                                            addURLTooltip={ t("applications:forms." +
                                                "advancedConfig.sections.platformSettings.fields." +
                                                "android.fields.keyHashes.tooltip") }
                                            duplicateURLErrorMessage={ t("applications:forms." +
                                                "advancedConfig.sections.platformSettings.fields." +
                                                "android.fields.keyHashes.validations.duplicate") }
                                            showPredictions={ false }
                                            showLessContent={ t("common:showLess") }
                                            showMoreContent={ t("common:showMore") }
                                            disabled={ isPlatformSettingsUiDisabled }
                                            skipInternalValidation
                                        />) }
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column>
                                    <Heading as="h5" bold="500">
                                        <GenericIcon
                                            size="micro"
                                            icon={ getTechnologyLogos().apple }
                                            floated="left"
                                            verticalAlign="middle"
                                        />
                                        { t("applications:forms.advancedConfig.sections.platformSettings.fields." +
                                            "apple.heading") }
                                    </Heading>
                                    <Field.Input
                                        ariaLabel="Apple App Id"
                                        inputType="default"
                                        name="appleAppId"
                                        label={ t("applications:forms.advancedConfig.sections.platformSettings." +
                                            "fields.apple.fields.appleAppId.label") }
                                        required={ false }
                                        placeholder={ t("applications:forms.advancedConfig.sections.platformSettings." +
                                            "fields.apple.fields.appleAppId.placeholder") }
                                        value={ (config?.attestationMetaData?.appleAppId ||
                                            config?.trustedAppConfiguration?.appleAppId) ?? "" }
                                        hint={ t("applications:forms.advancedConfig.sections.platformSettings.fields." +
                                            "apple.fields.appleAppId.hint") }
                                        maxLength={ 200 }
                                        minLength={ 3 }
                                        width={ 16 }
                                        data-testid={ `${ testId }-platform-settings-apple-app-id` }
                                        data-componentid={ `${ testId }-platform-settings-apple-app-id` }
                                        disabled={ isPlatformSettingsUiDisabled }
                                        readOnly={ readOnly }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    )
                }
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
            <ConfirmationModal
                onClose={ (): void => setShowFIDOConfirmationModal(false) }
                type="warning"
                assertionHint={ t("applications:forms.advancedConfig.sections.trustedApps.modal.assertionHint") }
                assertionType="checkbox"
                open={ showFIDOConfirmationModal }
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onPrimaryActionClick={ (): void => {
                    setIsFIDOTrustedAppsEnabled(true);
                    setIsConsentGranted(true);
                    setShowFIDOConfirmationModal(false);
                } }
                onSecondaryActionClick={ (): void => {
                    setIsFIDOTrustedAppsEnabled(false);
                    setIsConsentGranted(false);
                    setShowFIDOConfirmationModal(false);
                } }
                closeOnDimmerClick={ false }
                data-testid={ `${ testId }-trusted-apps-confirmation-modal` }
            >
                <ConfirmationModal.Header data-testid={ `${ testId }-trusted-apps-confirmation-modal-header` }>
                    { t("applications:forms.advancedConfig.sections.trustedApps.modal.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning
                    data-testid={ `${ testId }-trusted-apps-confirmation-modal-message` }
                >
                    { t("applications:forms.advancedConfig.sections.trustedApps.modal.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content data-testid={ `${ testId }-trusted-apps-confirmation-modal-content` }>
                    { t("applications:forms.advancedConfig.sections.trustedApps.modal.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

/**
 * Default props for the application advanced configurations form component.
 */
AdvancedConfigurationsForm.defaultProps = {
    "data-testid": "application-advanced-configurations-form"
};
