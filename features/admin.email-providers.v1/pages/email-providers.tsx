/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form, FormPropsInterface } from "@wso2is/form";
import {
    Code,
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    DocumentationLink,
    EmphasizedSegment,
    Heading,
    Hint,
    PageLayout,
    PrimaryButton,
    SecondaryButton,
    useDocumentation
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { FormApi } from "final-form";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useEffect,
    useRef ,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Icon, Placeholder, Ref } from "semantic-ui-react";
import { deleteEmailProviderConfigurations,
    updateEmailProviderConfigurations,
    useEmailProviderConfig } from "../api";
import {
    AuthenticationType,
    DropdownChild,
    EmailProviderConstants
} from "../constants";
import {
    EmailProviderConfigAPIResponseInterface,
    EmailProviderConfigFormErrorValidationsInterface,
    EmailProviderConfigFormValuesInterface,
    EmailProviderConfigPropertiesInterface,
    EmailProvidersPageInterface
} from "../models";
import "./email-providers.scss";

const FORM_ID: string = "email-provider-config-form";

/**
 * Email Providers page.
 *
 * @param props - Props injected to the component.
 * @returns Email Providers config page component.
 */
const EmailProvidersPage: FunctionComponent<EmailProvidersPageInterface> = (
    props: EmailProvidersPageInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId
    } = props;

    const dispatch : Dispatch<any> = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const isPushProviderFeatureEnabled: boolean = featureConfig?.pushProviders?.enabled;

    const pageContextRef : MutableRefObject<HTMLElement> = useRef(null);
    const formRef: MutableRefObject<FormPropsInterface> = useRef<FormPropsInterface>(null);
    const formState: MutableRefObject<FormApi> = useRef<FormApi>(null);

    const hasEmailTemplatesReadPermissions: boolean =  useRequiredScopes(featureConfig?.emailTemplates?.scopes?.read);
    const hasEmailProviderUpdatePermissions: boolean = useRequiredScopes(featureConfig?.emailProviders?.scopes?.update);

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
    const [ emailProviderConfig , setEmailProviderConfig ] =
        useState<EmailProviderConfigFormValuesInterface>(undefined);
    const [ isOpenRevertConfigModal, setOpenRevertConfigModal ] = useState<boolean>(false);
    const [ isAuthenticationUpdateFormState, setIsAuthenticationUpdateFormState ] = useState<boolean>(false);

    const enableOldUIForEmailProvider: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.enableOldUIForEmailProvider);

    const {
        data: originalEmailProviderConfig,
        isLoading: isEmailProviderConfigFetchRequestLoading,
        mutate: mutateEmailProviderConfig,
        error: emailProviderConfigFetchRequestError
    } = useEmailProviderConfig();

    const [ endpointAuthType, setEndpointAuthType ] = useState<AuthenticationType>(null);
    const [ showPrimarySecret, setShowPrimarySecret ] = useState<boolean>(false);
    const [ showSecondarySecret, setShowSecondarySecret ] = useState<boolean>(false);

    useEffect(() => {

        if (originalEmailProviderConfig instanceof IdentityAppsApiException || emailProviderConfigFetchRequestError) {
            handleRetrieveError();

            return;
        }

        if (!originalEmailProviderConfig) {
            return;
        }

        // Validate if the email provider config exists.
        if (originalEmailProviderConfig[0] &&
                originalEmailProviderConfig[0].name === EmailProviderConstants.EMAIL_PROVIDER_CONFIG_NAME) {

            const displayNameProperty: EmailProviderConfigPropertiesInterface =
                originalEmailProviderConfig[0].properties.find((property: EmailProviderConfigPropertiesInterface) =>
                    property.key === EmailProviderConstants.SIGNATURE_KEY
                );

            const replyToProperty: EmailProviderConfigPropertiesInterface =
                originalEmailProviderConfig[0].properties.find((property: EmailProviderConfigPropertiesInterface) =>
                    property.key === EmailProviderConstants.REPLY_TO_ADDRESS_KEY
                );

            setEmailProviderConfig({
                authType: originalEmailProviderConfig[0].authType,
                displayName: displayNameProperty?.value,
                fromAddress: originalEmailProviderConfig[0].fromAddress,
                password: enableOldUIForEmailProvider
                    ? originalEmailProviderConfig[0].password
                    : null,
                replyToAddress: replyToProperty?.value,
                smtpPort: originalEmailProviderConfig[0].smtpPort,
                smtpServerHost: originalEmailProviderConfig[0].smtpServerHost,
                userName: enableOldUIForEmailProvider
                    ? originalEmailProviderConfig[0].userName
                    : null
            });
        }
    }, [ originalEmailProviderConfig ]);

    const renderInputAdornmentOfSecret = (showSecret: boolean, onClick: () => void): ReactElement => (
        <InputAdornment position="end">
            <Icon
                link={ true }
                className="list-icon reset-field-to-default-adornment"
                size="small"
                color="grey"
                name={ !showSecret ? "eye" : "eye slash" }
                data-componentid={ `${componentId}-endpoint-authentication-property-secret-view-button` }
                onClick={ onClick }
            />
        </InputAdornment>
    );

    const handleAuthenticationChangeCancel = (): void => {
        setIsAuthenticationUpdateFormState(false);
        if (formState.current) {
            formState.current.change("userName", "");
            formState.current.change("password", "");
            formState.current.change("clientId", "");
            formState.current.change("clientSecret", "");
            formState.current.change("tokenEndpoint", "");
            formState.current.change("scopes", "");
        }
    };

    const renderAuthenticationSectionInfoBox = (): ReactElement => {
        const resolveAuthTypeDisplayName = (): string => {
            if (originalEmailProviderConfig[0]) {
                switch (originalEmailProviderConfig[0].authType) {
                    case AuthenticationType.BASIC:
                        return t("emailProviders:fields.authentication.types.basic.name");
                    case AuthenticationType.CLIENT_CREDENTIAL:
                        return t("emailProviders:fields.authentication.types.clientCredential.name");
                    default:
                        return;
                }
            }
        };

        return (
            <Alert className="alert-nutral" icon={ false }>
                <AlertTitle
                    className="alert-title"
                    data-componentid={ `${componentId}-authentication-info-box-title` }
                >
                    <Trans
                        i18nKey={
                            t("actions:fields.authentication.info.title.otherAuthType",
                                { authType: resolveAuthTypeDisplayName() } )
                        }
                        components={ { strong: <strong/> } }
                    />
                </AlertTitle>
                <Trans
                    i18nKey={ t("actions:fields.authentication.info.message") }
                >
                    If you are changing the authentication, be aware that the authentication secrets of
                    the external endpoint need to be updated.
                </Trans>
                <div>
                    <Button
                        onClick={ handleAuthenticationChange }
                        variant="outlined"
                        size="small"
                        className={ "secondary-button" }
                        data-componentid={ `${ componentId }-change-authentication-button` }
                    >
                        { t("actions:buttons.changeAuthentication") }
                    </Button>
                </div>
            </Alert>
        );
    };

    const showAuthSecretsHint = (): ReactElement => {
        if (originalEmailProviderConfig[0]) {
            return (
                <Hint className="hint-text" compact>
                    { t("emailProviders:fields.authenticationTypeDropdown.hint.update") }
                </Hint>
            );
        } else {
            return (
                <Hint className="hint-text" compact>
                    { t("emailProviders:fields.authenticationTypeDropdown.hint.create") }
                </Hint>
            );
        }
    };

    const renderEndpointAuthPropertyFields = (): ReactElement => {
        switch (endpointAuthType) {
            case AuthenticationType.BASIC:
                return (
                    <>
                        <Field.Input
                            ariaLabel="username"
                            className="addon-field-wrapper"
                            name="userName"
                            label={ t(
                                "emailProviders:fields.authenticationTypeDropdown.authProperties.username.label"
                            ) }
                            placeholder={ t(
                                "emailProviders:fields.authenticationTypeDropdown.authProperties.username.placeholder"
                            ) }
                            inputType="password"
                            type={ showPrimarySecret ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret(showPrimarySecret, () =>
                                    setShowPrimarySecret(!showPrimarySecret)
                                )
                            } }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${componentId}-endpoint-authentication-property-username` }
                            width={ 16 }
                        />
                        <Field.Input
                            ariaLabel="password"
                            className="addon-field-wrapper"
                            label={ t(
                                "emailProviders:fields.authenticationTypeDropdown.authProperties.password.label"
                            ) }
                            placeholder={ t(
                                "emailProviders:fields.authenticationTypeDropdown.authProperties.password.placeholder"
                            ) }
                            name="password"
                            inputType="password"
                            type={ showSecondarySecret ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret(showSecondarySecret, () =>
                                    setShowSecondarySecret(!showSecondarySecret)
                                )
                            } }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${componentId}-endpoint-authentication-property-password` }
                            width={ 16 }
                        />
                    </>
                );
            case AuthenticationType.CLIENT_CREDENTIAL:
                return (
                    <>
                        <Field.Input
                            ariaLabel="clientId"
                            className="addon-field-wrapper"
                            name="clientId"
                            inputType="password"
                            type={ showPrimarySecret ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret(showPrimarySecret, () =>
                                    setShowSecondarySecret(!showPrimarySecret)
                                )
                            } }
                            label={ t(
                                "emailProviders:fields.authenticationTypeDropdown.authProperties.clientID.label"
                            ) }
                            placeholder={ t(
                                "emailProviders:fields.authenticationTypeDropdown.authProperties.clientID.placeholder"
                            ) }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${componentId}-endpoint-authentication-property-value` }
                            width={ 16 }
                        />
                        <Field.Input
                            ariaLabel="clientSecret"
                            className="addon-field-wrapper"
                            name="clientSecret"
                            inputType="password"
                            type={ showSecondarySecret ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret(showSecondarySecret, () =>
                                    setShowSecondarySecret(!showSecondarySecret)
                                )
                            } }
                            label={ t(
                                "emailProviders:fields.authenticationTypeDropdown.authProperties.clientSecret.label"
                            ) }
                            placeholder={ t(
                                "emailProviders:fields.authenticationTypeDropdown.authProperties." +
                                "clientSecret.placeholder"
                            ) }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${componentId}-endpoint-authentication-property-value` }
                            width={ 16 }
                        />
                        <Field.Input
                            ariaLabel="tokenEndpoint"
                            name="tokenEndpoint"
                            inputType="text"
                            type={ "text" }
                            label={ t(
                                "emailProviders:fields.authenticationTypeDropdown.authProperties.tokenEndpoint.label"
                            ) }
                            placeholder={ t(
                                "emailProviders:fields.authenticationTypeDropdown.authProperties." +
                                "tokenEndpoint.placeholder"
                            ) }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${componentId}-endpoint-authentication-property-value` }
                            width={ 16 }
                        />
                        <Field.Input
                            ariaLabel="scopes"
                            name="scopes"
                            inputType="text"
                            type={ "text" }
                            label={ t(
                                "emailProviders:fields.authenticationTypeDropdown.authProperties.scopes.label"
                            ) }
                            placeholder={ t(
                                "emailProviders:fields.authenticationTypeDropdown.authProperties.scopes.placeholder"
                            ) }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${componentId}-endpoint-authentication-property-value` }
                            width={ 16 }
                        />
                    </>
                );
            default:
                break;
        }
    };

    /**
     * This method handles authentication type dropdown changes.
     *
     * @param value - The selected value.
     */
    const handleDropdownChange = (value: string) => {
        setEndpointAuthType(value as AuthenticationType);
    };

    const handleAuthenticationChange = (): void => {
        setIsAuthenticationUpdateFormState(true);
        handleDropdownChange(originalEmailProviderConfig[0]?.authType);
        if (originalEmailProviderConfig[0]?.authType === AuthenticationType.BASIC) {
            formState.current.change("userName", originalEmailProviderConfig[0]?.properties
                .find((property: EmailProviderConfigPropertiesInterface) =>
                    property.key === EmailProviderConstants.USERNAME)?.value);
        } else if (originalEmailProviderConfig[0]?.authType === AuthenticationType.CLIENT_CREDENTIAL) {
            formState.current.change("clientId", originalEmailProviderConfig[0]?.properties
                .find((property: EmailProviderConfigPropertiesInterface) =>
                    property.key === EmailProviderConstants.CLIENT_ID)?.value);
            formState.current.change("tokenEndpoint", originalEmailProviderConfig[0].properties
                .find((property: EmailProviderConfigPropertiesInterface) =>
                    property.key === EmailProviderConstants.TOKEN_ENDPOINT)?.value);
            formState.current.change("scopes", originalEmailProviderConfig[0].properties
                .find((property: EmailProviderConfigPropertiesInterface) =>
                    property.key === EmailProviderConstants.SCOPES)?.value);
            formState.current.change("clientSecret", null);
        }
    };

    /**
     * Displays the error banner when unable to fetch email provider configuration.
     */
    const handleRetrieveError = (): void => {
        dispatch(
            addAlert({
                description: t("extensions:develop.emailProviders." +
                "notifications.getConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:develop.emailProviders." +
                "notifications.getConfiguration.error.message")
            })
        );
    };

    /**
     * Displays the sucess banner when email provider configurations are updated.
     */
    const handleUpdateSuccess = () => {
        dispatch(
            addAlert({
                description: t("extensions:develop.emailProviders." +
                "notifications.updateConfiguration.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("extensions:develop.emailProviders." +
                "notifications.updateConfiguration.success.message")
            })
        );
        setIsAuthenticationUpdateFormState(false);
    };

    /**
     * Displays the error banner when unable to update email provider configurations.
     */
    const handleUpdateError = () => {
        dispatch(
            addAlert({
                description: t("extensions:develop.emailProviders." +
                "notifications.updateConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:develop.emailProviders." +
                "notifications.updateConfiguration.error.message")
            })
        );
    };

    /**
     * Displays the sucess banner when email provider configurations are deleted.
     */
    const handleDeleteSuccess = () => {
        dispatch(
            addAlert({
                description: t("extensions:develop.emailProviders." +
                "notifications.deleteConfiguration.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("extensions:develop.emailProviders." +
                "notifications.deleteConfiguration.success.message")
            })
        );
    };

    /**
     * Displays the error banner when unable to delete email provider configurations.
     */
    const handleDeleteError = () => {
        dispatch(
            addAlert({
                description: t("extensions:develop.emailProviders." +
                "notifications.deleteConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:develop.emailProviders." +
                "notifications.deleteConfiguration.error.message")
            })
        );
    };

    /**
     * Handles updating the email provider configurations.
     */
    const handleSubmit = (values: EmailProviderConfigFormValuesInterface) => {
        setIsSubmitting(true);
        const updateValues: EmailProviderConfigAPIResponseInterface = {
            authType: values?.authType,
            fromAddress: values?.fromAddress,
            name: EmailProviderConstants.EMAIL_PROVIDER_CONFIG_NAME,
            properties: [],
            smtpPort: values?.smtpPort,
            smtpServerHost: values?.smtpServerHost
        };

        if (enableOldUIForEmailProvider) {
            if (values.userName) {
                updateValues.userName = values.userName;
            }

            if (values.password) {
                updateValues.password = values.password;
            }
        }

        if (values.replyToAddress) {
            updateValues?.properties?.push({
                key: EmailProviderConstants.REPLY_TO_ADDRESS_KEY,
                value: values.replyToAddress
            });
        }

        if (values.displayName) {
            updateValues?.properties?.push({
                key: EmailProviderConstants.SIGNATURE_KEY,
                value: values.displayName
            });
        }

        if (!enableOldUIForEmailProvider) {
            if (values.authType === AuthenticationType.BASIC) {
                updateValues?.properties?.push({
                    key: EmailProviderConstants.USERNAME,
                    value: values.userName
                });
                updateValues?.properties?.push({
                    key: EmailProviderConstants.PASSWORD,
                    value: values.password
                });
            }

            if (values.authType === AuthenticationType.CLIENT_CREDENTIAL) {
                updateValues?.properties?.push({
                    key: EmailProviderConstants.CLIENT_ID,
                    value: values.clientId
                });
                updateValues?.properties?.push({
                    key: EmailProviderConstants.CLIENT_SECRET,
                    value: values.clientSecret
                });
                updateValues?.properties?.push({
                    key: EmailProviderConstants.TOKEN_ENDPOINT,
                    value: values.tokenEndpoint
                });
                updateValues?.properties?.push({
                    key: EmailProviderConstants.SCOPES,
                    value: values.scopes
                });
            }
        }
        handleConfigurationDelete(true)
            .then((isDeleted: boolean) => {
                if (isDeleted) {
                    updateEmailProviderConfigurations(updateValues, enableOldUIForEmailProvider)
                        .then(() => {
                            handleUpdateSuccess();
                        })
                        .catch(() => {
                            handleUpdateError();
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                            mutateEmailProviderConfig();
                        });
                } else {
                    handleDeleteError();
                    setIsSubmitting(false);
                }
            })
            .catch(() => {
                handleDeleteError();
                setIsSubmitting(false);
            });
    };

    /**
     * Handles deleting the email provider configurations.
     */
    const handleConfigurationDelete = async (deleteBeforeUpdate?: boolean): Promise<boolean> => {
        !deleteBeforeUpdate && setIsDeleting(true);

        return deleteEmailProviderConfigurations(enableOldUIForEmailProvider)
            .then(() => {
                !deleteBeforeUpdate && handleDeleteSuccess();
                !deleteBeforeUpdate && setEmailProviderConfig(undefined);
                !deleteBeforeUpdate && mutateEmailProviderConfig();

                return true;
            })
            .catch(() => {
                !deleteBeforeUpdate && handleDeleteError();

                return false;
            }).finally(() => {
                setIsDeleting(false);
            });
    };

    /**
     * Validate input data.
     *
     * @param values - Form Values.
     * @returns Form validation.
     */
    const validateForm = (
        values: EmailProviderConfigFormValuesInterface
    ): EmailProviderConfigFormErrorValidationsInterface => {
        const error: EmailProviderConfigFormErrorValidationsInterface = {
            authType: undefined,
            clientId: undefined,
            clientSecret: undefined,
            displayName: undefined,
            fromAddress: undefined,
            password: undefined,
            replyToAddress: undefined,
            scopes: undefined,
            smtpPort: undefined,
            smtpServerHost: undefined,
            tokenEndpoint: undefined,
            userName: undefined
        };

        if (!values?.fromAddress) {
            error.fromAddress = t(
                "extensions:develop.emailProviders.form.validations.required"
            );
        }

        if (!values?.smtpPort) {
            error.smtpPort = t(
                "extensions:develop.emailProviders.form.validations.required"
            );
        }

        if (!values?.smtpServerHost) {
            error.smtpServerHost = t(
                "extensions:develop.emailProviders.form.validations.required"
            );
        }

        if (!values?.replyToAddress) {
            error.replyToAddress = t(
                "extensions:develop.emailProviders.form.validations.required"
            );
        }

        if (!values?.displayName) {
            error.displayName = t(
                "extensions:develop.emailProviders.form.validations.required"
            );
        }

        if (values?.smtpPort && (!FormValidation.isInteger(values.smtpPort as number)
            || values.smtpPort as number < 0)) {
            error.smtpPort = t(
                "extensions:develop.emailProviders.form.validations.portInvalid"
            );
        }

        if (values?.fromAddress && !EmailProviderConstants?.EMAIL_REGEX?.test(values.fromAddress)) {
            error.fromAddress = t(
                "extensions:develop.emailProviders.form.validations.emailInvalid"
            );
        }

        if (values?.replyToAddress && !EmailProviderConstants?.EMAIL_REGEX?.test(values.replyToAddress)) {
            error.replyToAddress = t(
                "extensions:develop.emailProviders.form.validations.emailInvalid"
            );
        }

        if (!enableOldUIForEmailProvider) {
            if (!values?.authType && !(values?.authType === AuthenticationType.BASIC ||
                values?.authType === AuthenticationType.CLIENT_CREDENTIAL)) {
                error.authType = t(
                    "extensions:develop.emailProviders.form.validations.required"
                );
            }

            if (values?.authType === AuthenticationType.BASIC) {
                if (!values?.userName) {
                    error.userName = t(
                        "extensions:develop.emailProviders.form.validations.required"
                    );
                }

                if (!values?.password) {
                    error.password = t(
                        "extensions:develop.emailProviders.form.validations.required"
                    );
                }
            }

            if (values?.authType === AuthenticationType.CLIENT_CREDENTIAL) {
                if (!values?.clientId) {
                    error.clientId = t(
                        "extensions:develop.emailProviders.form.validations.required"
                    );
                }

                if (!values?.clientSecret) {
                    error.clientSecret = t(
                        "extensions:develop.emailProviders.form.validations.required"
                    );
                }

                if (!values?.tokenEndpoint) {
                    error.tokenEndpoint = t(
                        "extensions:develop.emailProviders.form.validations.required"
                    );
                }

                if (!values?.scopes) {
                    error.scopes = t(
                        "extensions:develop.emailProviders.form.validations.required"
                    );
                }
            }
        }

        return error;
    };

    /**
     * Resolves the page description.
     */
    const resolvePageDescription = () : ReactElement => {
        return (
            <div>
                <div style={ { whiteSpace: "pre-line" } }>
                    {
                        t("extensions:develop.emailProviders.subHeading")
                    }
                    <DocumentationLink
                        link={ getLink("develop.emailProviders.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </div>
            </div>
        );
    };

    /**
     * Renders the loading placeholder.
     */
    const renderLoadingPlaceholder = () => {
        return (
            <div data-componentid={ `${ componentId }-form-loading` }>
                {
                    [ ...Array(3) ].map((key: number) => {
                        return (
                            <Placeholder key={ key }>
                                <Placeholder.Line length="very short" />
                                <div>
                                    <Placeholder.Line length="long" />
                                    <Placeholder.Line length="medium" />
                                </div>
                            </Placeholder>
                        );
                    })
                }
            </div>
        );
    };

    const handleBackButtonClick = () => {
        history.push(isPushProviderFeatureEnabled
            ? `${AppConstants.getPaths().get("NOTIFICATION_CHANNELS")}`
            : `${AppConstants.getPaths().get("EMAIL_AND_SMS")}`);
    };

    const goToEmailTemplates = () => {
        history.push(`${AppConstants.getPaths().get("EMAIL_MANAGEMENT")}`);
    };

    return (
        <PageLayout
            title={ t("extensions:develop.emailProviders.heading") }
            pageTitle={ t("extensions:develop.emailProviders.heading") }
            description={ resolvePageDescription() }
            bottomMargin={ false }
            contentTopMargin={ false }
            pageHeaderMaxWidth={ true }
            backButton={ {
                onClick: handleBackButtonClick,
                text: isPushProviderFeatureEnabled
                    ? t("extensions:develop.emailProviders.goBack")
                    : t("extensions:develop.emailAndSms.goBack")
            } }
            action={
                featureConfig.emailProviders?.enabled &&
                hasEmailTemplatesReadPermissions &&
                (
                    <SecondaryButton
                        onClick={ goToEmailTemplates }
                        data-componentId="email-templates-configure-button"
                    >
                        { t("extensions:develop.emailProviders.configureEmailTemplates") }
                    </SecondaryButton>
                )
            }
            data-componentid={ `${ componentId }-form-layout` }
        >
            <div className="email-provider-config-page">
                <Ref innerRef={ pageContextRef }>
                    <Grid className={ "mt-2" } >
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 }>
                                <EmphasizedSegment className="form-wrapper" padded={ "very" }>
                                    { isEmailProviderConfigFetchRequestLoading || isDeleting
                                        ? renderLoadingPlaceholder()
                                        : (
                                            <>
                                                <Form
                                                    id={ FORM_ID }
                                                    uncontrolledForm={ true }
                                                    onSubmit={ handleSubmit }
                                                    initialValues={ emailProviderConfig }
                                                    enableReinitialize={ true }
                                                    ref={ formRef }
                                                    noValidate={ true }
                                                    validate={ validateForm }
                                                    autoComplete="new-password"
                                                    formState={ formState }
                                                >
                                                    <Grid>
                                                        { /* To be added with email template feature
                                                        <Grid.Row columns={ 1 }>
                                                            <Grid.Column>
                                                                <p>
                                                                    { t("extensions:develop.emailProviders
                                                                     .description") }
                                                                </p>
                                                                <Message
                                                                    info
                                                                    floating
                                                                    attached="top"
                                                                    content={ (
                                                                        <Trans
                                                                            i18nKey={
                                                                                "extensions:develop.emailProviders.info"
                                                                            }
                                                                        >
                                                                            You can customize the email content using
                                                                            <a
                                                                                className="link pointing"
                                                                                onClick={ navigateToEmailTemplate }
                                                                            >
                                                                                Email Templates
                                                                            </a>.
                                                                        </Trans>
                                                                    ) }
                                                                    data-componentid={ `${ componentId }-info-box` }
                                                                />
                                                            </Grid.Column>
                                                        </Grid.Row> */ }
                                                        <Grid.Row columns={ 2 } key={ 1 }>
                                                            <Grid.Column key="smtpServerHost">
                                                                <Field.Input
                                                                    ariaLabel="SMTP Server Host Field"
                                                                    inputType="default"
                                                                    name="smtpServerHost"
                                                                    label={ t("extensions:develop.emailProviders.form" +
                                                                        ".smtpServerHost.label") }
                                                                    placeholder={
                                                                        t("extensions:develop.emailProviders.form" +
                                                                        ".smtpServerHost.placeholder")
                                                                    }
                                                                    hint={ (
                                                                        <Trans
                                                                            i18nKey={
                                                                                "extensions:develop.emailProviders" +
                                                                                ".form.smtpServerHost.hint"
                                                                            }
                                                                        >
                                                                            The Server Host usually begins with
                                                                            <Code>smtp</Code>, followed by the domain
                                                                            name of the email service provider.
                                                                        </Trans>
                                                                    ) }
                                                                    required={ true }
                                                                    value={ emailProviderConfig?.smtpServerHost }
                                                                    readOnly={ !hasEmailProviderUpdatePermissions }
                                                                    maxLength={ EmailProviderConstants
                                                                        .EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                                                                    minLength={ EmailProviderConstants
                                                                        .EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                                                                    width={ 16 }
                                                                    data-componentid={
                                                                        `${componentId}-smtp-server-host`
                                                                    }
                                                                    autoComplete="new-password"
                                                                />
                                                            </Grid.Column>
                                                            <Grid.Column key="smtpPort">
                                                                <Field.Input
                                                                    ariaLabel="SMTP Server Port Field"
                                                                    inputType="number"
                                                                    name="smtpPort"
                                                                    label={ t("extensions:develop.emailProviders.form" +
                                                                        ".smtpPort.label") }
                                                                    placeholder={
                                                                        t("extensions:develop.emailProviders.form" +
                                                                        ".smtpPort.placeholder")
                                                                    }
                                                                    hint={ (
                                                                        <Trans
                                                                            i18nKey={
                                                                                "extensions:develop.emailProviders" +
                                                                                ".form.smtpPort.hint"
                                                                            }
                                                                        >
                                                                            For security reasons, we currently support
                                                                            port <Code>587</Code> only.
                                                                        </Trans>
                                                                    ) }
                                                                    required={ true }
                                                                    value={ emailProviderConfig?.smtpPort }
                                                                    readOnly={ !hasEmailProviderUpdatePermissions }
                                                                    maxLength={ EmailProviderConstants
                                                                        .EMAIL_PROVIDER_SERVER_PORT_MAX_LENGTH }
                                                                    minLength={ EmailProviderConstants
                                                                        .EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                                                                    width={ 16 }
                                                                    data-componentid={
                                                                        `${componentId}-smtp-server-port`
                                                                    }
                                                                    autoComplete="new-password"
                                                                />
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                        <Grid.Row columns={ 2 } key={ 2 }>
                                                            <Grid.Column key="fromAddress">
                                                                <Field.Input
                                                                    ariaLabel="From Address Field"
                                                                    inputType="email"
                                                                    name="fromAddress"
                                                                    label={
                                                                        t("extensions:develop.emailProviders.form." +
                                                                        "fromAddress.label") }
                                                                    placeholder={
                                                                        t("extensions:develop.emailProviders.form" +
                                                                        ".fromAddress.placeholder")
                                                                    }
                                                                    hint={ t("extensions:develop.emailProviders.form" +
                                                                        ".fromAddress.hint") }
                                                                    required={ true }
                                                                    value={ emailProviderConfig?.fromAddress }
                                                                    readOnly={ !hasEmailProviderUpdatePermissions }
                                                                    maxLength={ EmailProviderConstants
                                                                        .EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                                                                    minLength={ EmailProviderConstants
                                                                        .EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                                                                    width={ 16 }
                                                                    data-componentid={
                                                                        `${componentId}-smtp-from-address` }
                                                                    autoComplete="new-password"
                                                                />
                                                            </Grid.Column>
                                                            <Grid.Column key="replyToAddress">
                                                                <Field.Input
                                                                    ariaLabel="Reply-To Field"
                                                                    inputType="email"
                                                                    name="replyToAddress"
                                                                    label={ t("extensions:develop.emailProviders.form" +
                                                                        ".replyToAddress.label") }
                                                                    placeholder={
                                                                        t("extensions:develop.emailProviders.form" +
                                                                        ".replyToAddress.placeholder")
                                                                    }
                                                                    hint={ t("extensions:develop.emailProviders.form" +
                                                                    ".replyToAddress.hint") }
                                                                    required={ true }
                                                                    value={ emailProviderConfig?.replyToAddress }
                                                                    readOnly={ !hasEmailProviderUpdatePermissions }
                                                                    maxLength={ EmailProviderConstants
                                                                        .EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                                                                    minLength={ EmailProviderConstants
                                                                        .EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                                                                    width={ 16 }
                                                                    data-componentid={
                                                                        `${componentId}-smtp-reply-to-address`
                                                                    }
                                                                    autoComplete="new-password"
                                                                />
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                        { (enableOldUIForEmailProvider) && (
                                                            <Grid.Row columns={ 2 } key={ 3 }>
                                                                <Grid.Column key="userName">
                                                                    <Field.Input
                                                                        ariaLabel="Username Field"
                                                                        inputType="default"
                                                                        name="userName"
                                                                        label={
                                                                            t("extensions:develop.emailProviders.form" +
                                                                            ".userName.label") }
                                                                        placeholder={
                                                                            t("extensions:develop.emailProviders.form" +
                                                                            ".userName.placeholder")
                                                                        }
                                                                        hint={
                                                                            t("extensions:develop.emailProviders.form" +
                                                                            ".userName.hint") }
                                                                        required={ true }
                                                                        value={ emailProviderConfig?.userName }
                                                                        readOnly={ !hasEmailProviderUpdatePermissions }
                                                                        maxLength={ EmailProviderConstants
                                                                            .EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                                                                        minLength={ EmailProviderConstants
                                                                            .EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                                                                        width={ 16 }
                                                                        data-componentid={
                                                                            `${componentId}-smtp-username` }
                                                                        autoComplete="new-password"
                                                                    />
                                                                </Grid.Column>
                                                                <Grid.Column key="password">
                                                                    <Field.Input
                                                                        ariaLabel="Password Field"
                                                                        inputType="password"
                                                                        type="password"
                                                                        name="password"
                                                                        label={ t(
                                                                            "extensions:develop.emailProviders.form" +
                                                                            ".password.label") }
                                                                        placeholder={
                                                                            t("extensions:develop.emailProviders.form" +
                                                                            ".password.placeholder")
                                                                        }
                                                                        hint={ t(
                                                                            "extensions:develop.emailProviders.form" +
                                                                            ".password.hint") }
                                                                        required={ true }
                                                                        value={ emailProviderConfig?.password }
                                                                        readOnly={ !hasEmailProviderUpdatePermissions }
                                                                        maxLength={ EmailProviderConstants
                                                                            .EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                                                                        minLength={ EmailProviderConstants
                                                                            .EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                                                                        width={ 16 }
                                                                        data-componentid={
                                                                            `${componentId}-smtp-password`
                                                                        }
                                                                        autoComplete="new-password"
                                                                    />
                                                                </Grid.Column>
                                                            </Grid.Row>
                                                        ) }
                                                        <Grid.Row columns={ 2 } key={ 3 }>
                                                            <Grid.Column key="displayName">
                                                                <Field.Input
                                                                    ariaLabel="Display Name Field"
                                                                    inputType="default"
                                                                    name="displayName"
                                                                    label={ t("extensions:develop.emailProviders." +
                                                                        "form.displayName.label") }
                                                                    placeholder={
                                                                        t("extensions:develop.emailProviders.form" +
                                                                        ".displayName.placeholder")
                                                                    }
                                                                    hint={ t("extensions:develop.emailProviders.form" +
                                                                    ".displayName.hint") }
                                                                    required={ true }
                                                                    value={ emailProviderConfig?.displayName }
                                                                    readOnly={ !hasEmailProviderUpdatePermissions }
                                                                    maxLength={ EmailProviderConstants
                                                                        .EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                                                                    minLength={ EmailProviderConstants
                                                                        .EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                                                                    width={ 16 }
                                                                    data-componentid={
                                                                        `${componentId}-smtp-displayName` }
                                                                    autoComplete="new-password"
                                                                />
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    </Grid>
                                                    { (!enableOldUIForEmailProvider) && (<div>
                                                        <Divider className="divider-container" />
                                                        <Heading className="heading-container" as="h5">
                                                            {
                                                                t("emailProviders:fields.authenticationTypeDropdown" +
                                                                ".title")
                                                            }
                                                        </Heading>

                                                        { (
                                                            (!originalEmailProviderConfig[0] ||
                                                            isAuthenticationUpdateFormState)
                                                        ) && (
                                                            <Box className="box-container">
                                                                <div className="box-field">
                                                                    <Field.Dropdown
                                                                        ariaLabel="authType"
                                                                        name="authType"
                                                                        label={ t(
                                                                            "emailProviders:fields." +
                                                                            "authenticationTypeDropdown.label"
                                                                        ) }
                                                                        placeholder={ t(
                                                                            "emailProviders:fields." +
                                                                            "authenticationTypeDropdown.placeholder"
                                                                        ) }
                                                                        displayEmpty={ true }
                                                                        required={ true }
                                                                        value={ endpointAuthType }
                                                                        options={ [
                                                                            ...EmailProviderConstants.AUTH_TYPES.map((
                                                                                option: DropdownChild) =>
                                                                                ({ text: t(option.text),
                                                                                    value: option.value.toString()
                                                                                }))
                                                                        ] }
                                                                        listen={ handleDropdownChange }
                                                                        enableReinitialize={ true }
                                                                        data-componentid={
                                                                            `${ componentId }-authentication-dropdown`
                                                                        }
                                                                        width={ 16 }
                                                                    />
                                                                    { showAuthSecretsHint() }

                                                                    { renderEndpointAuthPropertyFields() }

                                                                    { isAuthenticationUpdateFormState && (
                                                                        <Button
                                                                            onClick={ handleAuthenticationChangeCancel }
                                                                            variant="outlined"
                                                                            size="small"
                                                                            className="secondary-button"
                                                                            data-componentid={ `${componentId}
                                                                            -cancel-edit-authentication-button` }
                                                                        >
                                                                            { t("actions:buttons.cancel") }
                                                                        </Button>
                                                                    ) }
                                                                </div>
                                                            </Box>
                                                        ) }

                                                        {
                                                            (originalEmailProviderConfig[0] &&
                                                            !isAuthenticationUpdateFormState) &&
                                                            renderAuthenticationSectionInfoBox()
                                                        }
                                                    </div>
                                                    ) }
                                                </Form>
                                                {
                                                    hasEmailProviderUpdatePermissions && (
                                                        <>
                                                            <Grid.Row columns={ 1 } className="mt-6">
                                                                <Grid.Column
                                                                    mobile={ 16 }
                                                                    tablet={ 16 }
                                                                    computer={ 16 }>
                                                                    <PrimaryButton
                                                                        size="small"
                                                                        loading={ isSubmitting }
                                                                        onClick={ () => {
                                                                            formRef?.current?.triggerSubmit();
                                                                        } }
                                                                        ariaLabel="Email provider form update button"
                                                                        data-componentid={
                                                                            `${ componentId }-update-button`
                                                                        }
                                                                    >
                                                                        { t("extensions:develop.emailProviders" +
                                                                                ".updateButton") }
                                                                    </PrimaryButton>
                                                                </Grid.Column>
                                                            </Grid.Row>
                                                        </>
                                                    )
                                                }
                                            </>
                                        )
                                    }
                                </EmphasizedSegment>
                                {
                                    hasEmailProviderUpdatePermissions && !isEmailProviderConfigFetchRequestLoading && (
                                        <>
                                            <Divider hidden />
                                            <DangerZoneGroup
                                                sectionHeader={ t("extensions:develop.emailProviders.dangerZoneGroup"+
                                                    ".header") }
                                            >
                                                <DangerZone
                                                    data-componentid={ `${ componentId }-revert-email-provider-config` }
                                                    actionTitle={ t("extensions:develop" +
                                                        ".emailProviders.dangerZoneGroup" +
                                                    ".revertConfig.actionTitle") }
                                                    header={ t("extensions:develop.emailProviders.dangerZoneGroup" +
                                                    ".revertConfig.heading") }
                                                    subheader={ t("extensions:develop.emailProviders.dangerZoneGroup" +
                                                    ".revertConfig.subHeading") }
                                                    onActionClick={ (): void => {
                                                        setOpenRevertConfigModal(true);
                                                    } }
                                                />
                                            </DangerZoneGroup>
                                            <ConfirmationModal
                                                primaryActionLoading={ isSubmitting }
                                                data-componentid={ `${ componentId }-revert-confirmation-modal` }
                                                onClose={ (): void => setOpenRevertConfigModal(false) }
                                                type="negative"
                                                open={ isOpenRevertConfigModal }
                                                assertionHint={
                                                    t("extensions:develop.emailProviders.confirmationModal" +
                                                    ".assertionHint") }
                                                assertionType="checkbox"
                                                primaryAction={ t("common:confirm") }
                                                secondaryAction={ t("common:cancel") }
                                                onSecondaryActionClick={ (): void => setOpenRevertConfigModal(false) }
                                                onPrimaryActionClick={ (): void => {
                                                    setIsSubmitting(true);
                                                    handleConfigurationDelete().finally(() => {
                                                        setIsSubmitting(false);
                                                        setOpenRevertConfigModal(false);
                                                    });
                                                    setIsAuthenticationUpdateFormState(false);
                                                } }
                                                closeOnDimmerClick={ false }
                                            >
                                                <ConfirmationModal.Header
                                                    data-componentid={
                                                        `${ componentId }-revert-confirmation-modal-header` }
                                                >
                                                    { t("extensions:develop.emailProviders.confirmationModal.header") }
                                                </ConfirmationModal.Header>
                                                <ConfirmationModal.Message
                                                    data-componentid={
                                                        `${ componentId }-revert-confirmation-modal-message`
                                                    }
                                                    attached
                                                    negative
                                                >
                                                    { t("extensions:develop.emailProviders.confirmationModal.message") }
                                                </ConfirmationModal.Message>
                                                <ConfirmationModal.Content>
                                                    { t("extensions:develop.emailProviders.confirmationModal.content") }
                                                </ConfirmationModal.Content>
                                            </ConfirmationModal>
                                        </>
                                    )
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Ref>
            </div>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
EmailProvidersPage.defaultProps = {
    "data-componentid": "email-providers-page"
};

export default EmailProvidersPage;
