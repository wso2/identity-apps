/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormRenderProps } from "@wso2is/form";
import {
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    DocumentationLink,
    InfoCard,
    PageLayout,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Placeholder } from "semantic-ui-react";
import CustomSMSProvider from "./custom-sms-provider";
import TwilioSMSProvider from "./twilio-sms-provider";
import VonageSMSProvider from "./vonage-sms-provider";
import { AccessControlConstants } from "../../admin.access-control.v1/constants/access-control";
import { AuthenticatorManagementConstants } from "../../admin-connections-v1/constants/autheticator-constants";
import {
    AppConstants,
    AppState,
    FeatureConfigInterface
} from "../../admin-core-v1";
import { history } from "../../admin-core-v1/helpers";
import smsProviderConfig from "../../admin-extensions-v1/configs/sms-provider";
import { createSMSProvider, deleteSMSProviders, updateSMSProvider, useSMSProviders } from "../api";
import { providerCards } from "../configs/provider-cards";
import { SMSProviderConstants } from "../constants";
import {
    ContentType,
    SMSProviderAPIInterface,
    SMSProviderAPIResponseInterface,
    SMSProviderCardInterface,
    SMSProviderConfigFormErrorValidationsInterface,
    SMSProviderInterface,
    SMSProviderPropertiesInterface,
    SMSProviderSettingsState
} from "../models";
import "./sms-providers.scss";

type SMSProviderPageInterface = IdentifiableComponentInterface;

const SMSProviders: FunctionComponent<SMSProviderPageInterface> = (
    props: SMSProviderPageInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId
    } = props;
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ isOpenRevertConfigModal, setOpenRevertConfigModal ] = useState<boolean>(false);
    const { getLink } = useDocumentation();
    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const defaultProviderParams: {
        [key: string]: SMSProviderInterface;
    } = {
        CustomSMSProvider: {
            key: "",
            name: SMSProviderConstants.SMS_PROVIDER_CONFIG_NAME,
            provider: "",
            providerURL: "",
            secret: "",
            sender: ""
        },
        TwilioSMSProvider: {
            name: SMSProviderConstants.SMS_PROVIDER_CONFIG_NAME,
            provider: SMSProviderConstants.TWILIO,
            twilioKey: "",
            twilioSecret: "",
            twilioSender: ""
        },
        VonageSMSProvider: {
            name: SMSProviderConstants.SMS_PROVIDER_CONFIG_NAME,
            provider: SMSProviderConstants.VONAGE,
            vonageKey: "",
            vonageSecret: "",
            vonageSender: ""
        }

    };
    const [ smsProviderSettings, setSmsProviderSettings ] = useState<SMSProviderSettingsState>({
        providerParams: defaultProviderParams,
        selectedProvider: null
    });
    const isReadOnly: boolean = useMemo(() => !hasRequiredScopes(
        featureConfig?.smsProviders,
        featureConfig?.smsProviders?.scopes?.update,
        allowedScopes
    ), [ featureConfig, allowedScopes ]);

    const {
        data: originalSMSProviderConfig,
        isLoading: isSMSProviderConfigFetchRequestLoading,
        mutate: mutateSMSProviderConfig,
        error: smsProviderConfigFetchRequestError
    } = useSMSProviders();
    const [ isLoading, setIsLoading ] = useState(true);
    const [ isChoreoSMSOTPProvider, setChoreoSMSOTPProvider ] = useState<boolean>(false);
    const [ existingSMSProviders, setExistingSMSProviders ] = useState<string[]>([]);

    useEffect(() => {
        if (!isSMSProviderConfigFetchRequestLoading && originalSMSProviderConfig?.length > 0) {
            const existingSMSProviderNames: string[] = [];

            originalSMSProviderConfig?.forEach((smsProvider: SMSProviderAPIResponseInterface) => {
                existingSMSProviderNames.push(smsProvider.provider + "SMSProvider");

                smsProvider.properties?.forEach((prop: { key: string, value: string }) => {
                    if (prop.key === "channel.type" && prop.value === "choreo") {
                        setChoreoSMSOTPProvider(true);
                    }
                });
            });

            setExistingSMSProviders(existingSMSProviderNames);
        }
    },[ isSMSProviderConfigFetchRequestLoading, originalSMSProviderConfig ]);

    useEffect(() => {
        if (!originalSMSProviderConfig) {
            return;
        }
        if (originalSMSProviderConfig instanceof IdentityAppsApiException || smsProviderConfigFetchRequestError) {
            handleRetrieveError();

            return;
        }
        let configuredProvider: string = SMSProviderConstants.TWILIO_SMS_PROVIDER;
        const providersObject: { [key: string]: SMSProviderInterface } =
            originalSMSProviderConfig.reduce(
                (acc: { [key: string]: SMSProviderInterface }, provider: SMSProviderAPIInterface) => {
                    if (provider.provider === SMSProviderConstants.TWILIO) {
                        configuredProvider = SMSProviderConstants.TWILIO_SMS_PROVIDER;
                    } else if (provider.provider === SMSProviderConstants.VONAGE) {
                        configuredProvider = SMSProviderConstants.VONAGE_SMS_PROVIDER;
                    } else {
                        configuredProvider = SMSProviderConstants.CUSTOM_SMS_PROVIDER;
                    }
                    const configuredSMSProvider: SMSProviderInterface = {
                        contentType: provider.contentType as ContentType,
                        headers: provider.properties.find(
                            (property: SMSProviderPropertiesInterface) => property.key === "http.headers")?.value,
                        httpMethod: provider.properties.find(
                            (property: SMSProviderPropertiesInterface) => property.key === "http.method")?.value,

                        name: provider.name,
                        payload: provider.properties.find(
                            (property: SMSProviderPropertiesInterface) => property.key === "body")?.value,
                        provider: provider.provider,
                        providerURL: provider?.providerURL
                    };

                    if (configuredProvider === SMSProviderConstants.TWILIO_SMS_PROVIDER) {
                        configuredSMSProvider.twilioKey = provider.key;
                        configuredSMSProvider.twilioSecret = provider.secret;
                        configuredSMSProvider.twilioSender = provider.sender;
                    } else if (configuredProvider === SMSProviderConstants.VONAGE_SMS_PROVIDER) {
                        configuredSMSProvider.vonageKey = provider.key;
                        configuredSMSProvider.vonageSecret = provider.secret;
                        configuredSMSProvider.vonageSender = provider.sender;
                    } else {
                        configuredSMSProvider.key = provider.key;
                        configuredSMSProvider.secret = provider.secret;
                        configuredSMSProvider.sender = provider.sender;
                    }
                    acc[configuredProvider] = configuredSMSProvider;

                    return acc;
                }, {});

        setSmsProviderSettings({
            providerParams: {
                ...smsProviderSettings.providerParams,
                ...providersObject
            },
            selectedProvider: configuredProvider
        });
        setIsLoading(false);

    }, [ originalSMSProviderConfig ]);

    /**
     * Displays the error banner when unable to fetch sms provider configuration.
     */
    const handleRetrieveError = (): void => {
        dispatch(
            addAlert({
                description: t("smsProviders:" +
                    "notifications.getConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("smsProviders:" +
                    "notifications.getConfiguration.error.message")
            })
        );
    };

    /**
     * Displays the sucess banner when sms provider configurations are deleted.
     */
    const handleDeleteSuccess = () => {
        dispatch(
            addAlert({
                description: t("smsProviders:" +
                    "notifications.deleteConfiguration.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("smsProviders:" +
                    "notifications.deleteConfiguration.success.message")
            })
        );
    };

    const handleProviderChange = (selectedProvider: string) => {
        setSmsProviderSettings({ ...smsProviderSettings, selectedProvider });
    };

    const handleSubmit = async (values: SMSProviderInterface) => {
        setIsSubmitting(true);
        const { selectedProvider } = smsProviderSettings;

        const properties: SMSProviderPropertiesInterface[] = buildProperties(values);

        let provider: string;

        // If the selected provider is Twilio or Vonage, set the provider to the respective provider.
        // Else, set the provider to "Custom".
        switch (selectedProvider) {
            case SMSProviderConstants.TWILIO_SMS_PROVIDER:
                provider = SMSProviderConstants.TWILIO;

                break;
            case SMSProviderConstants.VONAGE_SMS_PROVIDER:
                provider = SMSProviderConstants.VONAGE;

                break;
            default:
                provider = SMSProviderConstants.CUSTOM;
        }
        const contentType: ContentType = values.contentType ?? ContentType.JSON;
        const submittingValues: SMSProviderAPIInterface = {
            contentType: contentType,
            key: selectedProvider === SMSProviderConstants.TWILIO_SMS_PROVIDER ?
                values?.twilioKey : selectedProvider === SMSProviderConstants.VONAGE_SMS_PROVIDER ?
                    values.vonageKey : values.key,
            properties: properties,
            provider: provider,
            secret: selectedProvider === SMSProviderConstants.TWILIO_SMS_PROVIDER ?
                values?.twilioSecret : selectedProvider === SMSProviderConstants.VONAGE_SMS_PROVIDER ?
                    values.vonageSecret : values.secret,
            sender: selectedProvider === SMSProviderConstants.TWILIO_SMS_PROVIDER ?
                values?.twilioSender : selectedProvider === SMSProviderConstants.VONAGE_SMS_PROVIDER ?
                    values.vonageSender : values.sender
        };

        if (values.providerURL) {
            submittingValues.providerURL = values.providerURL;
        }

        let handleSMSConfigValues: Promise<SMSProviderAPIResponseInterface>;

        if (isChoreoSMSOTPProvider) {
            try {
                await deleteSMSProviders();
            } catch (error: any) {
                const errorType : string = error.code === AuthenticatorManagementConstants.ErrorMessages
                    .SMS_NOTIFICATION_SENDER_DELETION_ERROR_ACTIVE_SUBS.getErrorCode() ? "activeSubs" :
                    ( error.code === AuthenticatorManagementConstants.ErrorMessages
                        .SMS_NOTIFICATION_SENDER_DELETION_ERROR_CONNECTED_APPS.getErrorCode() ? "connectedApps"
                        : "generic" );

                dispatch(addAlert({
                    description: t("extensions:develop.identityProviders.smsOTP.settings." +
                            `errorNotifications.smsPublisherDeletionError.${errorType}.description`),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.identityProviders.smsOTP.settings." +
                            `errorNotifications.smsPublisherDeletionError.${errorType}.message`)
                }));

                return;
            }
            handleSMSConfigValues = createSMSProvider(submittingValues);
        } else {
            handleSMSConfigValues = existingSMSProviders.length >= 1
                ? updateSMSProvider(submittingValues)
                : createSMSProvider(submittingValues);
        }

        handleSMSConfigValues.then((updatedData: SMSProviderAPIInterface) => {
            const updatedSMSProvider: SMSProviderInterface = {
                contentType: updatedData.contentType as ContentType,
                headers: updatedData.properties.find(
                    (property: SMSProviderPropertiesInterface) => property.key === "http.headers")?.value,
                httpMethod: updatedData.properties.find(
                    (property: SMSProviderPropertiesInterface) => property.key === "http.method")?.value,
                key: updatedData.key,
                name: updatedData.name,
                payload: updatedData.properties.find(
                    (property: SMSProviderPropertiesInterface) => property.key === "body")?.value,
                provider: updatedData.provider,
                providerURL: updatedData.providerURL,
                secret: updatedData.secret,
                sender: updatedData.sender
            };
            const updatedParams: { [key: string]: SMSProviderInterface } =
                        { ...defaultProviderParams, [selectedProvider as string]: updatedSMSProvider };

            setSmsProviderSettings({ ...smsProviderSettings, providerParams: updatedParams });
            dispatch(
                addAlert({
                    description: t("smsProviders:" +
                        "notifications.updateConfiguration.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("smsProviders:" +
                        "notifications.updateConfiguration.success.message")
                })
            );
            setIsSubmitting(false);
            setExistingSMSProviders([ provider + "SMSProvider" ]);
        })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t("smsProviders:" +
                            "notifications.updateConfiguration.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("smsProviders:" +
                            "notifications.updateConfiguration.error.message")
                    })
                );
            }).finally(() => {
                setIsSubmitting(false);
                mutateSMSProviderConfig();
            });
    };

    const buildProperties = (values: SMSProviderInterface) => {
        const properties: SMSProviderPropertiesInterface[] = [];

        if (values.payload) {
            properties.push({ key: "body", value: values.payload });
        }
        if (values.headers) {
            properties.push({ key: "http.headers", value: values.headers });
        }
        if (values.httpMethod) {
            properties.push({ key: "http.method", value: values.httpMethod });
        }

        return properties;
    };

    const validateForm = (
        values: SMSProviderInterface
    ): SMSProviderConfigFormErrorValidationsInterface => {
        const error: SMSProviderConfigFormErrorValidationsInterface = {
            contentType: undefined,
            key: undefined,
            payload: undefined,
            provider: undefined,
            providerURL: undefined,
            secret: undefined,
            sender: undefined,
            twilioKey: undefined,
            twilioSecret: undefined,
            twilioSender: undefined,
            vonageKey: undefined,
            vonageSecret: undefined,
            vonageSender: undefined
        };

        if (smsProviderSettings.selectedProvider === "TwilioSMSProvider") {
            if (!values?.twilioKey) {
                error.twilioKey = t(
                    "smsProviders:form.twilio.validations.required"
                );
            }
            if (!values?.twilioSecret) {
                error.twilioSecret = t(
                    "smsProviders:form.twilio.validations.required"
                );
            }
            if (!values?.twilioSender) {
                error.twilioSender = t(
                    "smsProviders:form.twilio.validations.required"
                );
            }
        } else if (smsProviderSettings.selectedProvider === "VonageSMSProvider") {
            if (!values?.vonageKey) {
                error.vonageKey = t(
                    "smsProviders:form.vonage.validations.required"
                );
            }
            if (!values?.vonageSecret) {
                error.vonageSecret = t(
                    "smsProviders:form.vonage.validations.required"
                );
            }
            if (!values?.vonageSender) {
                error.vonageSender = t(
                    "smsProviders:form.vonage.validations.required"
                );
            }
        } else {
            if (!values?.providerURL) {
                error.providerURL = t(
                    "smsProviders:form.custom.validations.required"
                );
            }
            if (!values?.contentType) {
                error.contentType = t(
                    "smsProviders:form.custom.validations.required"
                );
            }
            if (!values?.payload) {
                error.payload = t(
                    "smsProviders:form.custom.validations.required"
                );
            }
        }

        return error;
    };

    const handleConfigurationDelete = async (): Promise<boolean> => {
        setIsDeleting(true);

        return deleteSMSProviders()
            .then(() => {
                handleDeleteSuccess();
                setSmsProviderSettings({ providerParams: {},
                    selectedProvider: SMSProviderConstants.TWILIO_SMS_PROVIDER });
                mutateSMSProviderConfig();

                return true;
            })
            .catch((e: IdentityAppsApiException) => {
                handleDeleteError(e);

                return false;
            }).finally(() => {
                setIsDeleting(false);
            });
    };


    const handleDeleteError = (error?: IdentityAppsApiException) => {
        let errorMessage: string = t("smsProviders:" +
        "notifications.deleteConfiguration.error.message");

        let errorDescription: string = t("smsProviders:" +
        "notifications.deleteConfiguration.error.description");

        // If the SMS provider is being used by SMS OTP connection and it is
        // configured for one or more applications
        if (error?.response?.data?.code === SMSProviderConstants.SMS_PROVIDER_CONFIG_UNABLE_TO_DISABLE_ERROR_CODE) {
            errorMessage = error?.response?.data?.message;
            errorDescription = error?.response?.data?.description;
        }

        dispatch(
            addAlert({
                description: errorDescription,
                level: AlertLevels.ERROR,
                message: errorMessage
            })
        );
    };

    const handleBackButtonClick = () => {
        history.push(`${AppConstants.getPaths().get("EMAIL_AND_SMS")}`);
    };

    return (
        <PageLayout
            title={ t("smsProviders:heading") }
            pageTitle={ t("smsProviders:heading") }
            description={ (
                <div style={ { whiteSpace: "pre-line" } }>
                    {
                        t("smsProviders:subHeading")
                    }
                    <DocumentationLink
                        link={ getLink("develop.smsProviders.learnMore") }
                    >
                        { t("extensions:common.learnMore") }
                    </DocumentationLink>
                </div>
            ) }
            bottomMargin={ false }
            contentTopMargin={ false }
            pageHeaderMaxWidth={ true }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("smsProviders:goBack")
            } }
            data-componentid={ `${componentId}-form-layout` }
        >
            { isSMSProviderConfigFetchRequestLoading || isDeleting || isLoading ? (
                <div data-componentid={ `${componentId}-form-loading` }>
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
            ) : (
                <Grid className={ "mt-2" } >
                    <Grid.Row columns={ 1 }>
                        <Grid.Column>
                            <FinalForm
                                onSubmit={ handleSubmit }
                                validate={ validateForm }
                                initialValues={
                                    smsProviderSettings?.selectedProvider && !isChoreoSMSOTPProvider
                                        ? smsProviderSettings
                                            ?.providerParams[smsProviderSettings?.selectedProvider]
                                        :  {}
                                }
                                render={ ({ handleSubmit }: FormRenderProps) => (
                                    <form className="sms-provider-config-form" onSubmit={ handleSubmit } noValidate>
                                        <div className="card-list">
                                            <Grid>
                                                <Grid.Row columns={ 3 }>
                                                    { providerCards.map(
                                                        (provider: SMSProviderCardInterface) => (
                                                            <Grid.Column key={ provider.id }>
                                                                <InfoCard
                                                                    fluid
                                                                    data-componentid=
                                                                        { `${componentId}
                                                                                -sms-provider-info-card` }
                                                                    image={ provider.icon }
                                                                    imageSize="x30"
                                                                    header={
                                                                        provider.name
                                                                    }
                                                                    className=
                                                                        {  smsProviderSettings?.selectedProvider ===
                                                                                provider?.key
                                                                            ? "sms-provider-info-card selected"
                                                                            : "sms-provider-info-card"
                                                                        }
                                                                    key={ provider.id }
                                                                    onClick={ () =>
                                                                        handleProviderChange(provider?.key)
                                                                    }
                                                                    showSetupGuideButton={ false }
                                                                    showCardAction={ false }
                                                                />
                                                            </Grid.Column>
                                                        )) }
                                                </Grid.Row>
                                            </Grid>
                                        </div>

                                        { smsProviderSettings?.selectedProvider ===
                                                        SMSProviderConstants.CUSTOM_SMS_PROVIDER && (
                                            <>
                                                <CustomSMSProvider
                                                    isReadOnly={ isReadOnly }
                                                    onSubmit={ handleSubmit }
                                                />
                                                { smsProviderConfig.renderAlternativeSmsProviderOptions() }
                                            </>
                                        ) }
                                        { smsProviderSettings?.selectedProvider ===
                                                        SMSProviderConstants.TWILIO_SMS_PROVIDER && (
                                            <TwilioSMSProvider
                                                isReadOnly={ isReadOnly }
                                                onSubmit={ handleSubmit }
                                            />
                                        ) }
                                        { smsProviderSettings?.selectedProvider ===
                                                        SMSProviderConstants.VONAGE_SMS_PROVIDER && (
                                            <VonageSMSProvider
                                                isReadOnly={ isReadOnly }
                                                onSubmit={ handleSubmit }
                                            />
                                        ) }


                                    </form>
                                ) }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            ) }
            {
                !isLoading && !isSMSProviderConfigFetchRequestLoading && (
                    <Show
                        when={ AccessControlConstants.NOTIFICATION_SENDERS_DELETE }
                    >
                        <Divider hidden />
                        <DangerZoneGroup
                            sectionHeader={ t("smsProviders:dangerZoneGroup" +
                                ".header") }
                        >
                            <DangerZone
                                data-componentid={ `${componentId}-revert-sms-provider-config` }
                                actionTitle={ t("smsProviders:dangerZoneGroup" +
                                    ".revertConfig.actionTitle") }
                                header={ t("smsProviders:dangerZoneGroup" +
                                    ".revertConfig.heading") }
                                subheader={ t("smsProviders:dangerZoneGroup" +
                                    ".revertConfig.subHeading") }
                                onActionClick={ (): void => {
                                    setOpenRevertConfigModal(true);
                                } }
                            />
                        </DangerZoneGroup>
                        <ConfirmationModal
                            primaryActionLoading={ isSubmitting }
                            data-componentid={ `${ componentId}-revert-confirmation-modal` }
                            onClose={ (): void => setOpenRevertConfigModal(false) }
                            type="negative"
                            open={ isOpenRevertConfigModal }
                            assertionHint={ t("smsProviders:confirmationModal" +
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
                                    setExistingSMSProviders([]);
                                });

                            } }
                            closeOnDimmerClick={ false }
                        >
                            <ConfirmationModal.Header
                                data-componentid={ `${componentId}-revert-confirmation-modal-header` }
                            >
                                { t("smsProviders:confirmationModal.header") }
                            </ConfirmationModal.Header>
                            <ConfirmationModal.Message
                                data-componentid={
                                    `${componentId}revert-confirmation-modal-message`
                                }
                                attached
                                negative
                            >
                                { t("smsProviders:confirmationModal.message") }
                            </ConfirmationModal.Message>
                            <ConfirmationModal.Content>
                                { t("smsProviders:confirmationModal.content") }
                            </ConfirmationModal.Content>
                        </ConfirmationModal>
                    </Show>
                ) }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
SMSProviders.defaultProps = {
    "data-componentid": "sms-provider-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SMSProviders;
