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
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { applicationConfig } from "@wso2is/admin.extensions.v1";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    IdentifiableComponentInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { Field, Form, FormPropsInterface } from "@wso2is/form";
import { ConfirmationModal, DocumentationLink, GenericIcon, Heading, Hint, URLInput, useDocumentation  }
    from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, {
    Fragment,
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useCallback,
    useRef,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { ApplicationManagementConstants } from "../../constants/application-management";
import SAMLWebApplicationTemplate from
    "../../data/application-templates/templates/saml-web-application/saml-web-application.json";
import {
    AdvancedConfigurationsInterface,
    ApplicationTemplateListItemInterface
} from "../../models/application";
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
        [ "data-testid" ]: testId,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const { UIConfig } = useUIConfig();
    const { getLink } = useDocumentation();

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
        config?.trustedAppConfiguration?.isFIDOTrustedApp
    );
    const [ isConsentGranted, setIsConsentGranted ] = useState<boolean>(
        config?.trustedAppConfiguration?.isConsentGranted
    );
    const [ showFIDOConfirmationModal, setShowFIDOConfirmationModal ] = useState<boolean>(false);
    const [ showThumbprintsError, setShowThumbprinstError ] = useState(false);
    const [ clearThumbprintsError, setClearThumbprinstError ] = useState(false);
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
                description: t("applications:forms." +
                    "advancedConfig.sections.clientAttestation.fields." +
                    "androidAttestationServiceCredentials.errors.invalid.description"),
                level: AlertLevels.ERROR,
                message: t("applications:forms." +
                    "advancedConfig.sections.clientAttestation.fields." +
                    "androidAttestationServiceCredentials.errors.invalid.message")
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
                trustedAppConfiguration: {
                    // androidPackageName and appleAppId is same as clientAttestation.
                    androidPackageName: values.enableFIDOTrustedApps ? values.androidPackageName : "",
                    androidThumbprints: values.enableFIDOTrustedApps ?
                        (isEmpty(thumbprints) ? [] : thumbprints.split(",")) : [],
                    appleAppId: values.enableFIDOTrustedApps ? values.appleAppId : "",
                    isConsentGranted: isConsentGranted,
                    isFIDOTrustedApp: values.enableFIDOTrustedApps
                }
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

    const isTrustedAppConsentRequired: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.isTrustedAppConsentRequired);

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
    const validateForm: (values: AdvancedConfigurationsInterface) => AdvancedConfigurationsInterface =
    useCallback((values: AdvancedConfigurationsInterface): AdvancedConfigurationsInterface => {

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
                        "sections.platformSettings.field." +
                        "android.fields.androidPackageName.validations.emptyForAttestation");
                } else if (values.androidPackageName?.toString().trim()
                    && !Object.keys(androidAttestationServiceCredentialsObject).length) {

                    errors.androidAttestationServiceCredentials = t("applications:forms." +
                            "advancedConfig.sections.clientAttestation.fields." +
                            "androidAttestationServiceCredentials.validations.empty");
                }
            } catch (error) {
                errors.androidAttestationServiceCredentials = t("applications:forms." +
                "advancedConfig.sections.clientAttestation.fields." +
                "androidAttestationServiceCredentials.validations.invalid");
            }
        }
        if (values.enableFIDOTrustedApps) {
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
            } else {
                setClearThumbprinstError(true);
            }
        } else {
            setClearThumbprinstError(true);
        }

        return errors;
    }, [ thumbprints ]);

    /**
     * Handle FIDO activation value with confirmation. Deactivation is not confirmed
     */
    const handleFIDOActivation = (shouldActivate: boolean) => {
        shouldActivate ?
            (isTrustedAppConsentRequired ? setShowFIDOConfirmationModal(true) : setIsFIDOTrustedAppsEnabled(true))
            : setIsFIDOTrustedAppsEnabled(false);
    };

    return (
        <>
            <Form
                id={ FORM_ID }
                uncontrolledForm={ true }
                ref={ formRef }
                validate={ validateForm }
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
                        isApplicationNativeAuthenticationEnabled &&
                        (template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION ||
                        template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC ||
                        template?.id === ApplicationManagementConstants.MOBILE ||
                        template?.id === ApplicationManagementConstants.TEMPLATE_IDS.get("oidcWeb"))
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
                        </Grid>
                    )
                }
                {
                    (
                        isApplicationNativeAuthenticationEnabled &&
                        (template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION ||
                        template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC ||
                        template?.id === ApplicationManagementConstants.MOBILE)
                    ) && (
                        <Grid>
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
                                        hint={ (
                                            <Trans
                                                i18nKey={
                                                    "applications:forms.advancedConfig.sections.clientAttestation." +
                                                    "fields.enableClientAttestation.hint"
                                                }
                                            >
                                                Select to verify the integrity of the application by calling the
                                                 attestation service of the hosting platform. To enable this you will
                                                 be required to setup <strong>Platform Settings</strong>.
                                            </Trans>
                                        ) }
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
                        isTrustedAppsFeatureEnabled &&
                        (template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION ||
                        template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC ||
                        template?.id === ApplicationManagementConstants.MOBILE)
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
                                        data-componentid={ `${ componentId }-enable-fido-trusted-apps` }
                                        hint={ (
                                            <Trans
                                                i18nKey={
                                                    "applications:forms.advancedConfig.sections." +
                                                    "trustedApps.fields.enableFIDOTrustedApps.hint"
                                                }
                                            >
                                                Select to trust the app for user login with passkey.
                                                 Provide the details of the application under
                                                <strong> Platform Settings</strong>.
                                            </Trans>
                                        ) }
                                    />
                                    {
                                        (applicationConfig.advancedConfigurations.showTrustedAppConsentWarning) && (
                                            <Alert severity="warning" className="fido-enabled-warn-alert">
                                                <>
                                                    {
                                                        <Trans
                                                            i18nKey={
                                                                "applications:forms.advancedConfig." +
                                                                "sections.trustedApps.alerts.trustedAppSettingsAlert"
                                                            }
                                                        >
                                                            Enabling this feature will publish details under
                                                            <strong> Platform Settings</strong> to a public endpoint
                                                             accessible to all Asgardeo organizations. Consequently,
                                                             other organizations can view information about your
                                                             application and its associated organization. This option
                                                             is not applicable if you are using custom domains.
                                                        </Trans>
                                                    }
                                                    <DocumentationLink
                                                        link={ getLink("develop.applications.editApplication." +
                                                    "common.advanced.trustedApps.learnMore") }
                                                    >
                                                        { t("common:learnMore") }
                                                    </DocumentationLink>
                                                </>
                                            </Alert>
                                        )
                                    }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    )
                }
                {
                    (
                        template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION ||
                        template?.id === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC ||
                        template?.id === ApplicationManagementConstants.MOBILE
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
                                        maxLength={ 200 }
                                        minLength={ 3 }
                                        width={ 16 }
                                        data-componentid={
                                            `${ componentId }-platform-settings-android-package-name`
                                        }
                                        disabled={ isPlatformSettingsUiDisabled }
                                    />
                                    <Hint disabled={ isPlatformSettingsUiDisabled }>
                                        { t("applications:forms.advancedConfig." +
                                            "sections.platformSettings.fields." +
                                            "android.fields.androidPackageName.hint") }
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
                                                    "android.fields.keyHashes.validations.invalidOrEmpty")
                                            }
                                            showError={ showThumbprintsError }
                                            setShowError={ setShowThumbprinstError }
                                            clearError={ clearThumbprintsError }
                                            setClearError={ setClearThumbprinstError }
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
                                            data-componentid={
                                                `${ componentId }-platform-settings-android-thumbprints`
                                            }
                                            disabled={ isPlatformSettingsUiDisabled || !isFIDOTrustedAppsEnabled }
                                            skipInternalValidation
                                        />
                                        <Hint disabled={ isPlatformSettingsUiDisabled || !isFIDOTrustedAppsEnabled }>
                                            { t("applications:forms." +
                                                "advancedConfig.sections.platformSettings.fields." +
                                                "android.fields.keyHashes.hint") }
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
                                        maxLength={ 200 }
                                        minLength={ 3 }
                                        width={ 16 }
                                        data-componentid={ `${ componentId }-platform-settings-apple-app-id` }
                                        disabled={ isPlatformSettingsUiDisabled }
                                        readOnly={ readOnly }
                                    />
                                    <Hint disabled={ isPlatformSettingsUiDisabled }>
                                        { t("applications:forms.advancedConfig.sections.platformSettings.fields." +
                                            "apple.fields.appleAppId.hint") }
                                    </Hint>
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
                data-componentid={ `${ componentId }-trusted-apps-confirmation-modal` }
            >
                <ConfirmationModal.Header data-testid={ `${ testId }-trusted-apps-confirmation-modal-header` }>
                    { t("applications:forms.advancedConfig.sections.trustedApps.modal.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning
                    data-componentid={ `${ componentId }-trusted-apps-confirmation-modal-message` }
                >
                    { t("applications:forms.advancedConfig.sections.trustedApps.modal.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-componentid={ `${ componentId }-trusted-apps-confirmation-modal-content` }
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
AdvancedConfigurationsForm.defaultProps = {
    "data-componentid": "application-advanced-configurations-form",
    "data-testid": "application-advanced-configurations-form"
};
