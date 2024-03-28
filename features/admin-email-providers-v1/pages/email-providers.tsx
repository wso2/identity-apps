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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
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
    PageLayout,
    PrimaryButton,
    SecondaryButton,
    useDocumentation
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useEffect,
    useMemo,
    useRef ,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Placeholder, Ref } from "semantic-ui-react";
import {
    AppConstants,
    AppState,
    FeatureConfigInterface
} from "../../core";
import { history } from "../../core/helpers";
import { deleteEmailProviderConfigurations, updateEmailProviderConfigurations, useEmailProviderConfig } from "../api";
import { EmailProviderConstants } from "../constants";
import {
    EmailProviderConfigAPIResponseInterface,
    EmailProviderConfigFormErrorValidationsInterface,
    EmailProviderConfigFormValuesInterface,
    EmailProviderConfigPropertiesInterface,
    EmailProvidersPageInterface
} from "../models";

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
    const allowedScopes : string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const pageContextRef : MutableRefObject<HTMLElement> = useRef(null);
    const formRef: MutableRefObject<FormPropsInterface> = useRef<FormPropsInterface>(null);

    const isReadOnly : boolean = useMemo(() => !hasRequiredScopes(
        featureConfig?.emailProviders,
        featureConfig?.emailProviders?.scopes?.update,
        allowedScopes
    ), [ featureConfig, allowedScopes ]);

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
    const [ emailProviderConfig , setEmailProviderConfig ] =
        useState<EmailProviderConfigFormValuesInterface>(undefined);
    const [ isOpenRevertConfigModal, setOpenRevertConfigModal ] = useState<boolean>(false);

    const {
        data: originalEmailProviderConfig,
        isLoading: isEmailProviderConfigFetchRequestLoading,
        mutate: mutateEmailProviderConfig,
        error: emailProviderConfigFetchRequestError
    } = useEmailProviderConfig();

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
                displayName: displayNameProperty?.value,
                fromAddress: originalEmailProviderConfig[0].fromAddress,
                password: originalEmailProviderConfig[0].password,
                replyToAddress: replyToProperty?.value,
                smtpPort: originalEmailProviderConfig[0].smtpPort,
                smtpServerHost: originalEmailProviderConfig[0].smtpServerHost,
                userName: originalEmailProviderConfig[0].userName
            });
        }
    }, [ originalEmailProviderConfig ]);

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
            fromAddress: values?.fromAddress,
            name: EmailProviderConstants.EMAIL_PROVIDER_CONFIG_NAME,
            properties: [],
            smtpPort: values?.smtpPort,
            smtpServerHost: values?.smtpServerHost
        };

        if (values.userName) {
            updateValues.userName = values.userName;
        }

        if (values.password) {
            updateValues.password = values.password;
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

        handleConfigurationDelete(true)
            .then((isDeleted: boolean) => {
                if (isDeleted) {
                    updateEmailProviderConfigurations(updateValues)
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

        return deleteEmailProviderConfigurations()
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
            displayName: undefined,
            fromAddress: undefined,
            password: undefined,
            replyToAddress: undefined,
            smtpPort: undefined,
            smtpServerHost: undefined,
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
                        { t("extensions:common.learnMore") }
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
        history.push(`${AppConstants.getPaths().get("EMAIL_AND_SMS")}`);
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
                text: t("extensions:develop.emailProviders.goBack")
            } }
            action={
                featureConfig.emailProviders?.enabled &&
                hasRequiredScopes(featureConfig?.emailTemplates, featureConfig?.emailTemplates?.scopes?.read,
                    allowedScopes) &&
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
                                            >
                                                <Grid>
                                                    { /* To be added with email template feature
                                                    <Grid.Row columns={ 1 }>
                                                        <Grid.Column>
                                                            <p>
                                                                { t("extensions:develop.emailProviders.description") }
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
                                                                            "extensions:develop.emailProviders.form" +
                                                                            ".smtpServerHost.hint"
                                                                        }
                                                                    >
                                                                        The Server Host usually begins with
                                                                        <Code>smtp</Code>, followed by the domain
                                                                        name of the email service provider.
                                                                    </Trans>
                                                                ) }
                                                                required={ true }
                                                                value={ emailProviderConfig?.smtpServerHost }
                                                                readOnly={ isReadOnly }
                                                                maxLength={ EmailProviderConstants
                                                                    .EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                                                                minLength={ EmailProviderConstants
                                                                    .EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                                                                width={ 16 }
                                                                data-componentid={ `${componentId}-smtp-server-host` }
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
                                                                            "extensions:develop.emailProviders.form" +
                                                                            ".smtpPort.hint"
                                                                        }
                                                                    >
                                                                        For security reasons, we currently support port
                                                                        <Code>587</Code> only.
                                                                    </Trans>
                                                                ) }
                                                                required={ true }
                                                                value={ emailProviderConfig?.smtpPort }
                                                                readOnly={ isReadOnly }
                                                                maxLength={ EmailProviderConstants
                                                                    .EMAIL_PROVIDER_SERVER_PORT_MAX_LENGTH }
                                                                minLength={ EmailProviderConstants
                                                                    .EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                                                                width={ 16 }
                                                                data-componentid={ `${componentId}-smtp-server-port` }
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
                                                                label={ t("extensions:develop.emailProviders.form." +
                                                                    "fromAddress.label") }
                                                                placeholder={
                                                                    t("extensions:develop.emailProviders.form" +
                                                                    ".fromAddress.placeholder")
                                                                }
                                                                hint={ t("extensions:develop.emailProviders.form" +
                                                                    ".fromAddress.hint") }
                                                                required={ true }
                                                                value={ emailProviderConfig?.fromAddress }
                                                                readOnly={ isReadOnly }
                                                                maxLength={ EmailProviderConstants
                                                                    .EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                                                                minLength={ EmailProviderConstants
                                                                    .EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                                                                width={ 16 }
                                                                data-componentid={ `${componentId}-smtp-from-address` }
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
                                                                readOnly={ isReadOnly }
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
                                                    <Grid.Row columns={ 2 } key={ 3 }>
                                                        <Grid.Column key="userName">
                                                            <Field.Input
                                                                ariaLabel="Username Field"
                                                                inputType="default"
                                                                name="userName"
                                                                label={ t("extensions:develop.emailProviders.form" +
                                                                    ".userName.label") }
                                                                placeholder={
                                                                    t("extensions:develop.emailProviders.form" +
                                                                    ".userName.placeholder")
                                                                }
                                                                hint={ t("extensions:develop.emailProviders.form" +
                                                                    ".userName.hint") }
                                                                required={ true }
                                                                value={ emailProviderConfig?.userName }
                                                                readOnly={ isReadOnly }
                                                                maxLength={ EmailProviderConstants
                                                                    .EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                                                                minLength={ EmailProviderConstants
                                                                    .EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                                                                width={ 16 }
                                                                data-componentid={ `${componentId}-smtp-username` }
                                                                autoComplete="new-password"
                                                            />
                                                        </Grid.Column>
                                                        <Grid.Column key="password">
                                                            <Field.Input
                                                                ariaLabel="Password Field"
                                                                inputType="password"
                                                                type="password"
                                                                name="password"
                                                                label={ t("extensions:develop.emailProviders.form" +
                                                                    ".password.label") }
                                                                placeholder={
                                                                    t("extensions:develop.emailProviders.form" +
                                                                    ".password.placeholder")
                                                                }
                                                                hint={ t("extensions:develop.emailProviders.form" +
                                                                    ".password.hint") }
                                                                required={ true }
                                                                value={ emailProviderConfig?.password }
                                                                readOnly={ isReadOnly }
                                                                maxLength={ EmailProviderConstants
                                                                    .EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                                                                minLength={ EmailProviderConstants
                                                                    .EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                                                                width={ 16 }
                                                                data-componentid={ `${componentId}-smtp-password` }
                                                                autoComplete="new-password"
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 2 } key={ 3 }>
                                                        <Grid.Column key="displayName">
                                                            <Field.Input
                                                                ariaLabel="Display Name Field"
                                                                inputType="default"
                                                                name="displayName"
                                                                label={ t("extensions:develop.emailProviders.form." +
                                                                    "displayName.label") }
                                                                placeholder={
                                                                    t("extensions:develop.emailProviders.form" +
                                                                    ".displayName.placeholder")
                                                                }
                                                                hint={ t("extensions:develop.emailProviders.form" +
                                                                ".displayName.hint") }
                                                                required={ true }
                                                                value={ emailProviderConfig?.displayName }
                                                                readOnly={ isReadOnly }
                                                                maxLength={ EmailProviderConstants
                                                                    .EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                                                                minLength={ EmailProviderConstants
                                                                    .EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                                                                width={ 16 }
                                                                data-componentid={ `${componentId}-smtp-displayName` }
                                                                autoComplete="new-password"
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </Form>
                                            {
                                                !isReadOnly && (
                                                    <>
                                                        <Divider hidden />
                                                        <Grid.Row columns={ 1 } className="mt-6">
                                                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
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
                                !isReadOnly && !isEmailProviderConfigFetchRequestLoading && (
                                    <>
                                        <Divider hidden />
                                        <DangerZoneGroup
                                            sectionHeader={ t("extensions:develop.emailProviders.dangerZoneGroup"+
                                                ".header") }
                                        >
                                            <DangerZone
                                                data-componentid={ `${ componentId }-revert-email-provider-config` }
                                                actionTitle={ t("extensions:develop.emailProviders.dangerZoneGroup" +
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
                                            assertionHint={ t("extensions:develop.emailProviders.confirmationModal" +
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
                                            } }
                                            closeOnDimmerClick={ false }
                                        >
                                            <ConfirmationModal.Header
                                                data-componentid={ `${ componentId }-revert-confirmation-modal-header` }
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
