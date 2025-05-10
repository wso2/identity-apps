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
import { getTechnologyLogos } from "@wso2is/admin.core.v1/configs/ui";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { applicationConfig } from "@wso2is/admin.extensions.v1";
import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import {
    CheckboxFieldAdapter,
    FinalForm,
    FinalFormField,
    FormRenderProps,
    TextFieldAdapter
} from "@wso2is/form";
import {
    ConfirmationModal,
    DocumentationLink,
    GenericIcon,
    Heading,
    Hint,
    PrimaryButton,
    URLInput,
    useDocumentation
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useCallback, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import useAdvancedApplicationConfiguration from "./use-advanced-application-configuration";
import { ApplicationManagementConstants } from "../../constants/application-management";
import SAMLWebApplicationTemplate from
    "../../data/application-templates/templates/saml-web-application/saml-web-application.json";
import { AdvancedConfigurationsInterface, ApplicationTemplateListItemInterface } from "../../models/application";
import "./advanced-configurations-form.scss";

/**
 *  Advanced Configurations for the Application.
 */
interface AdvancedConfigurationsFormPropsInterface extends TestableComponentInterface, IdentifiableComponentInterface {
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
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const AdvancedConfigurationsFinalForm: FunctionComponent<AdvancedConfigurationsFormPropsInterface> = (
    props: AdvancedConfigurationsFormPropsInterface
): ReactElement => {
    const {
        config,
        onSubmit,
        readOnly,
        template,
        isSubmitting,
        ["data-testid"]: testId,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const { UIConfig } = useUIConfig();
    const { getLink } = useDocumentation();

    const {
        handleFIDOActivation,
        isFIDOTrustedAppsEnabled,
        setIsFIDOTrustedAppsEnabled,
        setShowFIDOConfirmationModal,
        showFIDOConfirmationModal,
        updateConfiguration,
        thumbprints,
        setThumbprints,
        setIsConsentGranted,
        isApplicationNativeAuthenticationEnabled,
        isTrustedAppsFeatureEnabled
    } = useAdvancedApplicationConfiguration(config, onSubmit);

    const [ isEnableAPIBasedAuthentication, setIsEnableAPIBasedAuthentication ] = useState<boolean>(
        config?.enableAPIBasedAuthentication
    );
    const [ isEnableClientAttestation, setIsEnableClientAttestation ] = useState<boolean>(
        config?.attestationMetaData?.enableClientAttestation
    );
    const [ isUserClickedClientAttestationWhenDisabled, setIsUserClickedClientAttestationWhenDisabled ] = useState<
        boolean
    >(false);

    const [ showThumbprintsError, setShowThumbprinstError ] = useState(false);
    const [ clearThumbprintsError, setClearThumbprinstError ] = useState(false);

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
    const validateForm: (values: AdvancedConfigurationsInterface) => AdvancedConfigurationsInterface = useCallback(
        (values: AdvancedConfigurationsInterface): AdvancedConfigurationsInterface => {
            const errors: AdvancedConfigurationsInterface = {
                androidAttestationServiceCredentials: undefined,
                androidPackageName: undefined,
                androidThumbprints: undefined
            };

            let androidAttestationServiceCredentialsObject: JSON;

            if (values.enableClientAttestation) {
                try {
                    if (!isEmpty(values.androidAttestationServiceCredentials)) {
                        androidAttestationServiceCredentialsObject = JSON.parse(
                            values.androidAttestationServiceCredentials
                        );
                    }
                    // Validate the android package name and android attestation service credentials
                    // for client attestation. If one of them is empty throw an error.
                    if (
                        !values.androidPackageName?.toString().trim() &&
                        Object.keys(androidAttestationServiceCredentialsObject).length
                    ) {
                        errors.androidPackageName = t(
                            "applications:forms.advancedConfig." +
                                "sections.platformSettings.fields." +
                                "android.fields.androidPackageName.validations.emptyForAttestation"
                        );
                    } else if (
                        values.androidPackageName?.toString().trim() &&
                        !Object.keys(androidAttestationServiceCredentialsObject).length
                    ) {
                        errors.androidAttestationServiceCredentials = t(
                            "applications:forms." +
                                "advancedConfig.sections.clientAttestation.fields." +
                                "androidAttestationServiceCredentials.validations.empty"
                        );
                    }
                } catch (error) {
                    errors.androidAttestationServiceCredentials = t(
                        "applications:forms." +
                            "advancedConfig.sections.clientAttestation.fields." +
                            "androidAttestationServiceCredentials.validations.invalid"
                    );
                }
            }
            if (values.enableFIDOTrustedApps) {
                // Validate the android package name and android thumbprints for FIDO trusted apps.
                // If one of them is empty throw an error.
                if (!values.androidPackageName?.toString().trim() && thumbprints?.toString().trim()) {
                    errors.androidPackageName = t(
                        "applications:forms.advancedConfig." +
                            "sections.platformSettings.fields." +
                            "android.fields.androidPackageName.validations.emptyForFIDO"
                    );
                } else if (values.androidPackageName?.toString().trim() && !thumbprints?.toString().trim()) {
                    setShowThumbprinstError(true);
                } else {
                    setClearThumbprinstError(true);
                }
            } else {
                setClearThumbprinstError(true);
            }

            return errors;
        },
        [ thumbprints ]
    );

    return (
        <>
            <FinalForm
                validate={ validateForm }
                onSubmit={ (values: AdvancedConfigurationsInterface) => {
                    updateConfiguration(values);
                } }
                initialValues={ {
                    androidAttestationServiceCredentials: JSON.stringify(
                        config?.attestationMetaData?.androidAttestationServiceCredentials || ""
                    ),
                    androidPackageName:
                        config?.attestationMetaData?.androidPackageName ||
                        config?.trustedAppConfiguration?.androidPackageName,
                    appleAppId: config?.trustedAppConfiguration?.appleAppId || config?.attestationMetaData?.appleAppId
                } }
                render={ ({ handleSubmit }: FormRenderProps) => {
                    return (
                        <form
                            id="advancedConfigurationsForm"
                            onSubmit={ handleSubmit }
                            style={ { display: "flex", flexDirection: "column" } }
                        >
                            <FinalFormField
                                ariaLabel="Skip consent login"
                                name="skipConsentLogin"
                                component={ CheckboxFieldAdapter }
                                label={ t("applications:forms.advancedConfig.fields.skipConsentLogin" + ".label") }
                                required={ false }
                                value={ config?.skipLoginConsent ? [ "skipLoginConsent" ] : [] }
                                readOnly={ readOnly }
                                data-testid={ `${testId}-skip-login-consent-checkbox` }
                                data-componentid={ `${testId}-skip-login-consent-checkbox` }
                                hint={ (
                                    <Hint className="hint" compact>
                                        { t("applications:forms.advancedConfig.fields.skipConsentLogin.hint") }
                                    </Hint>
                                ) }
                            />

                            { SAMLWebApplicationTemplate?.id !== template?.id && (
                                <FinalFormField
                                    ariaLabel="Skip consent logout"
                                    name="skipConsentLogout"
                                    label={ t("applications:forms.advancedConfig.fields" + ".skipConsentLogout.label") }
                                    component={ CheckboxFieldAdapter }
                                    required={ false }
                                    value={ config?.skipLogoutConsent ? [ "skipLogoutConsent" ] : [] }
                                    readOnly={ readOnly }
                                    data-testid={ `${testId}-skip-logout-consent-checkbox` }
                                    data-componentid={ `${testId}-skip-logout-consent-checkbox` }
                                    hint={ (
                                        <Hint className="hint" compact>
                                            {
                                                t("applications:forms.advancedConfig.fields." +
                                                "skipConsentLogout.hint")
                                            }
                                        </Hint>)
                                    }
                                />
                            ) }

                            <FinalFormField
                                ariaLabel="Return authenticated IDP list"
                                name="returnAuthenticatedIdpList"
                                label={
                                    t("applications:forms.advancedConfig.fields.returnAuthenticatedIdpList.label")
                                }
                                required={ false }
                                component={ CheckboxFieldAdapter }
                                value={ config?.returnAuthenticatedIdpList ? [ "returnAuthenticatedIdpList" ] : [] }
                                readOnly={ readOnly }
                                data-testid={ `${testId}-return-authenticated-idp-list-checkbox` }
                                data-componentid={ `${testId}-return-authenticated-idp-list-checkbox` }
                                hidden={ !applicationConfig.advancedConfigurations.showReturnAuthenticatedIdPs }
                                hint={
                                    (<Hint className="hint" compact>
                                        {
                                            t(
                                                "applications:forms.advancedConfig.fields" +
                                                ".returnAuthenticatedIdpList.hint"
                                            )
                                        }
                                    </Hint>)
                                }
                            />
                            <FinalFormField
                                ariaLabel="Enable authorization"
                                name="enableAuthorization"
                                label={ t("applications:forms.advancedConfig.fields.enableAuthorization.label") }
                                component={ CheckboxFieldAdapter }
                                required={ false }
                                value={ config?.enableAuthorization }
                                readOnly={ readOnly }
                                data-testid={ `${testId}-enable-authorization-checkbox` }
                                data-componentid={ `${testId}-enable-authorization-checkbox` }
                                hidden={
                                    !applicationConfig.advancedConfigurations.showEnableAuthorization ||
                                    !UIConfig?.isXacmlConnectorEnabled
                                }
                                hint={ (
                                    <Hint className="hint" compact>
                                        { t("applications:forms.advancedConfig.fields.enableAuthorization.hint") }
                                    </Hint>
                                ) }
                            />

                            { isApplicationNativeAuthenticationEnabled &&
                                (template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION ||
                                    template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC ||
                                    template?.id === ApplicationManagementConstants.MOBILE ||
                                    template?.id === ApplicationManagementConstants.TEMPLATE_IDS.get("oidcWeb")) && (
                                <Grid data-componentid={ `${testId}-application-native-authentication` }>
                                    <Grid.Row columns={ 2 }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                            <Divider />
                                            <Divider hidden />
                                        </Grid.Column>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                            <Heading as="h4">
                                                { t(
                                                    "applications:forms.advancedConfig." +
                                                            "sections.applicationNativeAuthentication.heading"
                                                ) }
                                            </Heading>
                                            <FinalFormField
                                                ariaLabel="Enable apiBasedAuthentication"
                                                name="enableAPIBasedAuthentication"
                                                component={ CheckboxFieldAdapter }
                                                label={ t(
                                                    "applications:forms.advancedConfig." +
                                                            "sections.applicationNativeAuthentication.fields." +
                                                            "enableAPIBasedAuthentication.label"
                                                ) }
                                                required={ false }
                                                readOnly={ readOnly }
                                                value={
                                                    isEnableAPIBasedAuthentication
                                                        ? [ "enableAPIBasedAuthentication" ]
                                                        : []
                                                }
                                                listen={ handleEnableAPIBasedAuthentication }
                                                data-testid={ `${testId}-enable-api-based-authentication` }
                                                data-componentid={ `${testId}-enable-api-based-authentication` }
                                                hidden={
                                                    !applicationConfig.advancedConfigurations
                                                        .showEnableAuthorization
                                                }
                                                hint={
                                                    t(
                                                        "applications:forms.advancedConfig." +
                                                            "sections.applicationNativeAuthentication.fields." +
                                                            "enableAPIBasedAuthentication.hint"
                                                    )
                                                }
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            ) }
                            { isApplicationNativeAuthenticationEnabled &&
                                (template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION ||
                                    template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC ||
                                    template?.id === ApplicationManagementConstants.MOBILE) && (
                                <Grid data-componentid={ `${testId}-client-attestation` }>
                                    <Grid.Row columns={ 1 } onClick={ handleWhenClientAttestationClickedWhenDisabled }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                            <Divider />
                                            <Heading as="h4">
                                                { t(
                                                    "applications:forms.advancedConfig." +
                                                            "sections.clientAttestation.heading"
                                                ) }
                                            </Heading>
                                            { isClientAttestationUIDisabled &&
                                                    isUserClickedClientAttestationWhenDisabled && (
                                                <Alert
                                                    severity="info"
                                                    className="client-attestation-info-alert"
                                                >
                                                    { t(
                                                        "applications:forms.advancedConfig." +
                                                        "sections.clientAttestation.alerts.clientAttestationAlert"
                                                    ) }
                                                </Alert>
                                            ) }
                                            <FinalFormField
                                                ariaLabel="Enable attestation"
                                                name="enableClientAttestation"
                                                component={ CheckboxFieldAdapter }
                                                label={ t(
                                                    "applications:forms." +
                                                            "advancedConfig.sections.clientAttestation." +
                                                            "fields.enableClientAttestation.label"
                                                ) }
                                                required={ false }
                                                readOnly={ readOnly }
                                                value={
                                                    config?.attestationMetaData?.enableClientAttestation
                                                        ? [ "enableClientAttestation" ]
                                                        : []
                                                }
                                                listen={ setIsEnableClientAttestation }
                                                data-testid={ `${testId}-enable-client-attestation` }
                                                data-componentid={ `${testId}-enable-api-based-authentication` }
                                                disabled={ isClientAttestationUIDisabled }
                                                hint={
                                                    (
                                                        <Hint className="hint" compact>
                                                            <Trans
                                                                i18nKey={
                                                                    "applications:forms.advancedConfig.sections." +
                                                            "clientAttestation.fields.enableClientAttestation.hint"
                                                                }
                                                            >
                                                            Select to verify the integrity of the application by calling
                                                            the attestation service of the hosting platform. To enable
                                                            this you will be required to setup{ " " }
                                                                <strong>Platform Settings</strong>.
                                                            </Trans>
                                                        </Hint>
                                                    )
                                                }
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={ 1 } onClick={ handleWhenClientAttestationClickedWhenDisabled }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                            <FinalFormField
                                                ariaLabel="Android service account credentials"
                                                inputType="description"
                                                name="androidAttestationServiceCredentials"
                                                label={
                                                    (<>
                                                        <GenericIcon
                                                            size="micro"
                                                            icon={ getTechnologyLogos().android }
                                                            floated="left"
                                                            verticalAlign="middle"
                                                            spaced="right"
                                                        />
                                                        { t(
                                                            "applications:forms." +
                                                                    "advancedConfig." +
                                                                    "sections.clientAttestation.fields." +
                                                                    "androidAttestationServiceCredentials.label"
                                                        ) }
                                                    </>)
                                                }
                                                placeholder={ t(
                                                    "applications:forms." +
                                                            "advancedConfig.sections." +
                                                            "clientAttestation.fields." +
                                                            "androidAttestationServiceCredentials.placeholder"
                                                ) }
                                                value={
                                                    config?.attestationMetaData
                                                        ?.androidAttestationServiceCredentials
                                                        ? [
                                                            JSON.stringify(
                                                                config?.attestationMetaData
                                                                    ?.androidAttestationServiceCredentials,
                                                                null,
                                                                4
                                                            )
                                                        ]
                                                        : []
                                                }
                                                hint={ t(
                                                    "applications:forms." +
                                                            "advancedConfig." +
                                                            "sections.clientAttestation.fields." +
                                                            "androidAttestationServiceCredentials.hint"
                                                ) }
                                                component={ TextFieldAdapter }
                                                type="text"
                                                multiline
                                                maxLength={ 5000 }
                                                minLength={ 30 }
                                                width={ 16 }
                                                minRows={ 5 }
                                                rows={ 5 }
                                                data-testid={
                                                    `${testId}-client-attestation-android-account-credentials`
                                                }
                                                data-componentid={
                                                    `${testId}-client-attestation-android-account-credentials`
                                                }
                                                disabled={ isClientAttestationMethodsUiDisabled }
                                                readOnly={ readOnly }
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            ) }
                            { isTrustedAppsFeatureEnabled &&
                                (template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION ||
                                    template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC ||
                                    template?.id === ApplicationManagementConstants.MOBILE) && (
                                <Grid data-componentid={ `${testId}-trusted-apps` }>
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                            <Divider />
                                            <Heading as="h4">
                                                { t(
                                                    "applications:forms.advancedConfig.sections." +
                                                            "trustedApps.heading"
                                                ) }
                                            </Heading>
                                            <FinalFormField
                                                ariaLabel="Enable FIDO Trusted Apps"
                                                name="enableFIDOTrustedApps"
                                                label={ t(
                                                    "applications:forms.advancedConfig.sections.trustedApps." +
                                                            "fields.enableFIDOTrustedApps.label"
                                                ) }
                                                required={ false }
                                                readOnly={ readOnly }
                                                checked={ isFIDOTrustedAppsEnabled }
                                                component={ CheckboxFieldAdapter }
                                                value={ isFIDOTrustedAppsEnabled ? [ "isFIDOTrustedApp" ] : [] }
                                                listen={ handleFIDOActivation }
                                                data-componentid={ `${componentId}-enable-fido-trusted-apps` }
                                                hint={
                                                    (
                                                        <Hint className="hint" compact>
                                                            <Trans
                                                                i18nKey={
                                                                    "applications:forms.advancedConfig.sections." +
                                                                "trustedApps.fields.enableFIDOTrustedApps.hint"
                                                                }
                                                            >
                                                            Select to trust the app for user login with passkey. Provide
                                                            the details of the application under
                                                                <strong> Platform Settings</strong>.
                                                            </Trans>
                                                        </Hint>
                                                    )
                                                }
                                            />
                                            { applicationConfig.advancedConfigurations
                                                .showTrustedAppConsentWarning && (
                                                <Alert severity="warning" className="fido-enabled-warn-alert">
                                                    <>
                                                        {
                                                            <Trans
                                                                i18nKey={
                                                                    "applications:forms.advancedConfig." +
                                                                    "sections.trustedApps.alerts." +
                                                                    "trustedAppSettingsAlert"
                                                                }
                                                            >
                                                                    Enabling this feature will publish details under
                                                                <strong> Platform Settings</strong> to a public
                                                                    endpoint accessible to all Asgardeo organizations.
                                                                    Consequently, other organizations can view
                                                                    information about your application and its
                                                                    associated organization. This option is not
                                                                    applicable if you are using custom domains.
                                                            </Trans>
                                                        }
                                                        <DocumentationLink
                                                            link={ getLink(
                                                                "develop.applications.editApplication." +
                                                                        "common.advanced.trustedApps.learnMore"
                                                            ) }
                                                        >
                                                            { t("common:learnMore") }
                                                        </DocumentationLink>
                                                    </>
                                                </Alert>
                                            ) }
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            ) }
                            { (template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION ||
                                template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC ||
                                template?.id === ApplicationManagementConstants.MOBILE) && (
                                <Grid data-componentid={ `${testId}-platform-settings` }>
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                            <Divider />
                                            <Heading as="h4">
                                                { t(
                                                    "applications:forms.advancedConfig." +
                                                        "sections.platformSettings.heading"
                                                ) }
                                            </Heading>
                                            <Heading subHeading as="h6">
                                                { t(
                                                    "applications:forms.advancedConfig." +
                                                        "sections.platformSettings.subTitle"
                                                ) }
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
                                                { t(
                                                    "applications:forms.advancedConfig." +
                                                        "sections.platformSettings.fields." +
                                                        "android.heading"
                                                ) }
                                            </Heading>
                                            <FinalFormField
                                                ariaLabel="Android package name"
                                                inputType="default"
                                                component={ TextFieldAdapter }
                                                name="androidPackageName"
                                                label={ t(
                                                    "applications:forms." +
                                                        "advancedConfig." +
                                                        "sections.platformSettings.fields." +
                                                        "android.fields.androidPackageName.label"
                                                ) }
                                                required={ false }
                                                readOnly={ readOnly }
                                                value={
                                                    (config?.attestationMetaData?.androidPackageName ||
                                                        config?.trustedAppConfiguration?.androidPackageName) ??
                                                    ""
                                                }
                                                placeholder={ t(
                                                    "applications:forms." +
                                                        "advancedConfig." +
                                                        "sections.platformSettings.fields." +
                                                        "android.fields.androidPackageName.placeholder"
                                                ) }
                                                maxLength={ 200 }
                                                minLength={ 3 }
                                                width={ 16 }
                                                data-componentid={
                                                    `${componentId}-platform-settings-android-package-name`
                                                }
                                                disabled={ isPlatformSettingsUiDisabled }
                                            />
                                            <Hint disabled={ isPlatformSettingsUiDisabled }>
                                                { t(
                                                    "applications:forms.advancedConfig." +
                                                        "sections.platformSettings.fields." +
                                                        "android.fields.androidPackageName.hint"
                                                ) }
                                            </Hint>
                                        </Grid.Column>
                                    </Grid.Row>
                                    { isTrustedAppsFeatureEnabled && (
                                        <Grid.Row columns={ 1 }>
                                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                                <URLInput
                                                    isAllowEnabled={ false }
                                                    onlyOrigin={ false }
                                                    labelEnabled={ false }
                                                    urlState={ thumbprints }
                                                    setURLState={ (url: string) => setThumbprints(url) }
                                                    labelName={ t(
                                                        "applications:forms." +
                                                            "advancedConfig.sections.platformSettings.fields." +
                                                            "android.fields.keyHashes.label"
                                                    ) }
                                                    required={ false }
                                                    value={ thumbprints }
                                                    validation={ (value: string) => !value?.includes(",") }
                                                    placeholder={ t(
                                                        "applications:forms." +
                                                            "advancedConfig.sections.platformSettings.fields." +
                                                            "android.fields.keyHashes.placeholder"
                                                    ) }
                                                    validationErrorMsg={ t(
                                                        "applications:forms." +
                                                            "advancedConfig.sections.platformSettings.fields." +
                                                            "android.fields.keyHashes.validations.invalidOrEmpty"
                                                    ) }
                                                    showError={ showThumbprintsError }
                                                    setShowError={ setShowThumbprinstError }
                                                    clearError={ clearThumbprintsError }
                                                    setClearError={ setClearThumbprinstError }
                                                    readOnly={ readOnly }
                                                    addURLTooltip={ t(
                                                        "applications:forms." +
                                                            "advancedConfig.sections.platformSettings.fields." +
                                                            "android.fields.keyHashes.tooltip"
                                                    ) }
                                                    duplicateURLErrorMessage={ t(
                                                        "applications:forms." +
                                                            "advancedConfig.sections.platformSettings.fields." +
                                                            "android.fields.keyHashes.validations.duplicate"
                                                    ) }
                                                    showPredictions={ false }
                                                    showLessContent={ t("common:showLess") }
                                                    showMoreContent={ t("common:showMore") }
                                                    data-componentid={
                                                        `${componentId}-platform-settings-android-thumbprints`
                                                    }
                                                    disabled={
                                                        isPlatformSettingsUiDisabled || !isFIDOTrustedAppsEnabled
                                                    }
                                                    skipInternalValidation
                                                />
                                                <Hint
                                                    disabled={
                                                        isPlatformSettingsUiDisabled || !isFIDOTrustedAppsEnabled
                                                    }
                                                >
                                                    { t(
                                                        "applications:forms." +
                                                            "advancedConfig.sections.platformSettings.fields." +
                                                            "android.fields.keyHashes.hint"
                                                    ) }
                                                </Hint>
                                            </Grid.Column>
                                        </Grid.Row>
                                    ) }
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column>
                                            <Heading as="h5" bold="500">
                                                <GenericIcon
                                                    size="micro"
                                                    icon={ getTechnologyLogos().apple }
                                                    floated="left"
                                                    verticalAlign="middle"
                                                />
                                                { t(
                                                    "applications:forms.advancedConfig.sections.platformSettings." +
                                                    "fields.apple.heading"
                                                ) }
                                            </Heading>
                                            <FinalFormField
                                                component={ TextFieldAdapter }
                                                ariaLabel="Apple App Id"
                                                inputType="default"
                                                name="appleAppId"
                                                label={ t(
                                                    "applications:forms.advancedConfig.sections.platformSettings." +
                                                        "fields.apple.fields.appleAppId.label"
                                                ) }
                                                required={ false }
                                                placeholder={ t(
                                                    "applications:forms.advancedConfig.sections.platformSettings." +
                                                        "fields.apple.fields.appleAppId.placeholder"
                                                ) }
                                                value={
                                                    (config?.attestationMetaData?.appleAppId ||
                                                        config?.trustedAppConfiguration?.appleAppId) ??
                                                    ""
                                                }
                                                maxLength={ 200 }
                                                minLength={ 3 }
                                                width={ 16 }
                                                data-componentid={ `${componentId}-platform-settings-apple-app-id` }
                                                disabled={ isPlatformSettingsUiDisabled }
                                                readOnly={ readOnly }
                                            />
                                            <Hint disabled={ isPlatformSettingsUiDisabled }>
                                                { t(
                                                    "applications:forms.advancedConfig.sections.platformSettings." +
                                                    "fields.apple.fields.appleAppId.hint"
                                                ) }
                                            </Hint>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            ) }

                            <PrimaryButton
                                // size="small"
                                ariaLabel="Update button"
                                //name="update-button"
                                data-testid={ `${testId}-submit-button` }
                                data-componentid={ `${testId}-submit-button` }
                                disabled={ isSubmitting }
                                loading={ isSubmitting }
                                hidden={ readOnly }
                                label={ t("common:update") }
                            />
                        </form>
                    );
                } }
            />
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
                data-componentid={ `${componentId}-trusted-apps-confirmation-modal` }
            >
                <ConfirmationModal.Header data-testid={ `${testId}-trusted-apps-confirmation-modal-header` }>
                    { t("applications:forms.advancedConfig.sections.trustedApps.modal.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning
                    data-componentid={ `${componentId}-trusted-apps-confirmation-modal-message` }
                >
                    { t("applications:forms.advancedConfig.sections.trustedApps.modal.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-componentid={ `${componentId}-trusted-apps-confirmation-modal-content` }
                >
                    { t("applications:forms.advancedConfig.sections.trustedApps.modal.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

/**
 * Default props for the application advanced configurations form component.
 */
AdvancedConfigurationsFinalForm.defaultProps = {
    "data-componentid": "application-advanced-configurations-form",
    "data-testid": "application-advanced-configurations-form"
};
