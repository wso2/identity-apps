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

import { HelpPanelModal } from "@wso2is/common/src/components/modals/help-panel-modal";
import { ModalWithSidePanel } from "@wso2is/common/src/components/modals/modal-with-side-panel";
import { TierLimitReachErrorModal } from "@wso2is/common/src/components/modals/tier-limit-error-modal";
import useDeploymentConfig from "@wso2is/common/src/hooks/use-app-configs";
import useUIConfig from "@wso2is/common/src/hooks/use-ui-configs";
import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, IdentifiableComponentInterface, LoadableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { URLUtils } from "@wso2is/core/utils";
import { DynamicWizard, DynamicWizardPage, renderFormFields } from "@wso2is/dynamic-forms";
import {
    ContentLoader,
    DocumentationLink,
    GenericIcon,
    Heading,
    LinkButton,
    PrimaryButton,
    useDocumentation,
    useWizardAlert
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import React, { FC, ReactElement, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid } from "semantic-ui-react";
import CreateConnectionWizardHelp from "./create-wizard-help";
import { EventPublisher } from "../../../core";
import { createConnection, useGetConnectionMetaData } from "../../api/connections";
import { ConnectionManagementConstants } from "../../constants/connection-constants";
import {
    ConnectionInterface,
    GenericConnectionCreateWizardPropsInterface,
    OutboundProvisioningConnectorInterface
} from "../../models/connection";
import { ConnectionsManagementUtils, handleGetConnectionsMetaDataError } from "../../utils/connection-utils";

/**
 * Proptypes for the connection creation wizard component.
 */
interface CreateConnectionWizardPropsInterface extends LoadableComponentInterface,
    GenericConnectionCreateWizardPropsInterface, IdentifiableComponentInterface {
}

export const CreateConnectionWizard: FC<CreateConnectionWizardPropsInterface> = (
    props: CreateConnectionWizardPropsInterface): ReactElement => {

    const {
        currentStep,
        isLoading,
        onIDPCreate,
        onWizardClose,
        title,
        subTitle,
        template,
        [ "data-componentid" ]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const [ alert, setAlert, alertComponent ] = useWizardAlert();
    const { deploymentConfig } = useDeploymentConfig();
    const { UIConfig } = useUIConfig();

    const connectionResourcesUrl: string = UIConfig?.connectionResourcesUrl;

    const [ openLimitReachedModal, setOpenLimitReachedModal ] = useState<boolean>(false);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ wizStep, setWizStep ] = useState<number>(0);
    const [ totalStep, setTotalStep ] = useState<number>(0);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ connectionMetaDetails, setConnectionMetaDetails ] = useState<any>(undefined);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const {
        data: connectionMetaData,
        isLoading: isConnectionMetaDataFetchRequestLoading,
        error: connectionMetaDataFetchRequestError
    } = useGetConnectionMetaData(template?.id);

    let submitAdvanceForm: () => void;
    let triggerPreviousForm: () => void;

    /**
     * Handles the connection meta data fetch request errors.
     */
    useEffect(() => {
        if (!connectionMetaDataFetchRequestError) {
            return;
        }

        handleGetConnectionsMetaDataError(connectionMetaDataFetchRequestError);
        setConnectionMetaDetails({});
    }, [ connectionMetaDataFetchRequestError ]);

    /**
     * Track wizard steps from wizard component.
     */
    useEffect(() => {

        if (!connectionMetaData) {
            return;
        }

        setConnectionMetaDetails(connectionMetaData);
    }, [ connectionMetaData ]);

    /**
     * Track wizard steps from wizard component.
     */
    useEffect(() => {
        setConnectionMetaDetails(wizStep + 1);
    }, [ wizStep ]);

    /**
     * Track wizard steps from wizard component.
     */
    useEffect(() => {
        setCurrentWizardStep(wizStep + 1);
    }, [ wizStep ]);

    /**
    * Track wizard steps from wizard component.
    */
    useEffect(() => {
        setCurrentWizardStep(wizStep + 1);
    }, [ wizStep ]);

    /**
     * The following function handle the connection create API call.
     */
    const createNewConnection = (connection: ConnectionInterface): void => {

        setIsSubmitting(true);

        createConnection(connection)
            .then((response: AxiosResponse) => {
                eventPublisher.publish("connections-finish-adding-connection", {
                    type: componentId
                });

                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider.notifications.addIDP." +
                    "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.authenticationProvider.notifications.addIDP." +
                    "success.message")
                }));

                // The created resource's id is sent as a location header.
                // If that's available, navigate to the edit page.
                if (!isEmpty(response.headers.location)) {
                    const location: string = response.headers.location;
                    const createdIdpID: string = location.substring(location.lastIndexOf("/") + 1);

                    onIDPCreate(createdIdpID);

                    return;
                }

                // Since the location header is not present, trigger callback without the id.
                onIDPCreate();
            })
            .catch((error: AxiosError) => {

                const identityAppsError: IdentityAppsError = ConnectionManagementConstants.ERROR_CREATE_LIMIT_REACHED;

                if (error?.response?.status === 403 &&
                error?.response?.data?.code ===
                identityAppsError.getErrorCode()) {
                    setOpenLimitReachedModal(true);

                    return;
                }

                if (error.response && error.response.data && error.response.data.description) {
                    setAlert({
                        description: t("console:develop.features.authenticationProvider.notifications." +
                        "addIDP.error.description",
                        { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.authenticationProvider.notifications." +
                        "addIDP.error.message")
                    });

                    return;
                }

                setAlert({
                    description: t("console:develop.features.authenticationProvider.notifications.addIDP." +
                    "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.authenticationProvider.notifications.addIDP." +
                    "genericError.message")
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Called when modal close event is triggered.
     */
    const handleWizardClose = (): void => {
        // Trigger the close method from props.
        onWizardClose();
    };

    /**
     * Close the limit reached modal.
     */
    const handleLimitReachedModalClose = (): void => {
        setOpenLimitReachedModal(false);
        handleWizardClose();
    };

    /**
     * Check whether IDP name is already exist or not.
     *
     * @param value - IDP name - IDP Name.
     * @returns error msg if name is already taken.
     */
    const connectionNameValidation = (value: string): Promise<string> => {

        return ConnectionsManagementUtils.searchIdentityProviderName(value)
            .then((idpExist: boolean) => {
                if (idpExist) {
                    return Promise.resolve(
                        t(
                            "console:develop.features." +
                            "authenticationProvider.forms.generalDetails.name." +
                            "validations.duplicate"
                        )
                    );
                } else {
                    return Promise.resolve(null);
                }
            })
            .catch(() => {
                /**
                 * Ignore the error, as a failed identity provider search
                 * should not result in user blocking. However, if the
                 * identity provider name already exists, it will undergo
                 * validation from the backend, and any resulting errors
                 * will be displayed in the user interface.
                 */
                return Promise.resolve(null);
            });
    };

    /**
        * Handles the final wizard submission.
        *
        * @param identityProvider - Identity provider data.
        */
    const handleWizardFormFinish = (identityProvider: ConnectionInterface): void => {

        const connector: OutboundProvisioningConnectorInterface =
        identityProvider?.provisioning?.outboundConnectors?.connectors[ 0 ];

        const isGoogleConnector: boolean = get(connector,
            ConnectionManagementConstants.PROVISIONING_CONNECTOR_DISPLAY_NAME) ===
            ConnectionManagementConstants.PROVISIONING_CONNECTOR_GOOGLE;

        // If the outbound connector is Google, remove the displayName from the connector.
        if (connector && isGoogleConnector) {
            delete connector[
                ConnectionManagementConstants.PROVISIONING_CONNECTOR_DISPLAY_NAME
            ];
        }

        // Use description from template.
        identityProvider.description = template.description;

        createNewConnection(identityProvider);
    };

    const onSubmitWizard = (values: any): void => {

        // Update the template properties with the values from the wizard.
        const updatedProperties: { key: string; value: string }[] = connectionMetaDetails?.create?.properties?.map(
            (property: { key: string; value: string }) => {

                const CALLBACK_URL_KEY: string = "callbackUrl";

                const convertedKey: string = property?.key?.charAt(0)
                    .toLowerCase() + property?.key?.slice(1);

                if (!isEmpty(values[convertedKey])) {
                    return { ...property, value: values[convertedKey] };
                }

                if (convertedKey.toString().toLowerCase() === CALLBACK_URL_KEY.toString().toLowerCase()) {
                    return { ...property, value: deploymentConfig.customServerHost + property.value };
                }

                return property;
            });

        const connection: ConnectionInterface = template.idp;

        connection.name = values?.name.toString();
        connection.templateId = template.templateId;

        if(connection?.templateId === "swe-idp") {
            connection.federatedAuthenticators.authenticators[ 0 ].properties = connection.federatedAuthenticators
                .authenticators[ 0 ].properties.concat(updatedProperties);
        } else {
            connection.federatedAuthenticators.authenticators[ 0 ].properties = updatedProperties;
        }

        // Allow to set empty client ID and client secret but make the authenticator disabled.
        if (values?.clientId) {
            connection.federatedAuthenticators.authenticators[ 0 ]
                .isEnabled = !(isEmpty(values?.clientId?.toString()));
        }

        if (values?.clientSecret) {
            connection.federatedAuthenticators.authenticators[ 0 ]
                .isEnabled = !(isEmpty(values?.clientSecret?.toString()));
        }

        if (URLUtils.isHttpsUrl(connectionMetaData?.create?.image) ||
            URLUtils.isHttpUrl(connectionMetaData?.create?.image)) {
            connection.image = connectionMetaData?.create?.image;
        } else {
            if (!isEmpty(connectionResourcesUrl)) {

                // If the connection resource url is set, append the logo path to it.
                connection.image = connectionResourcesUrl + connectionMetaData?.create?.image;

                return;
            }

            connection.image = ConnectionsManagementUtils.resolveConnectionResourcePath(
                "", connectionMetaData?.create?.image
            );
        }

        handleWizardFormFinish(connection);
    };


    const resolveStepActions = (): ReactElement => {

        return (
            <Grid>
                <Grid.Row column={ 1 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                        <LinkButton
                            floated="left"
                            onClick={ handleWizardClose }
                            data-testid="add-connection-modal-cancel-button"
                            data-componentid="add-connection-modal-cancel-button"
                        >
                            { t("common:cancel") }
                        </LinkButton>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                        {
                            (currentWizardStep !== totalStep)
                                ? (
                                    <PrimaryButton
                                        floated="right"
                                        onClick={ () => {
                                            submitAdvanceForm();
                                        } }
                                        data-testid="add-connection-modal-next-button"
                                        data-componentid="add-connection-modal-next-button"
                                        loading={ isSubmitting }
                                        disabled={ isSubmitting }
                                    >
                                        { t("console:develop.features.authenticationProvider." +
                                            "wizards.buttons.next") }
                                    </PrimaryButton>
                                )
                                : (
                                    <PrimaryButton
                                        floated="right"
                                        onClick={ () => {
                                            submitAdvanceForm();
                                        } }
                                        data-testid="add-connection-modal-finish-button"
                                        data-componentid="add-connection-modal-finish-button"
                                        loading={ isSubmitting }
                                        disabled={ isSubmitting }
                                    >
                                        { t("console:develop.features.authenticationProvider." +
                                            "wizards.buttons.finish") }
                                    </PrimaryButton>
                                )
                        }
                        {
                            currentWizardStep > 1 && (
                                <LinkButton
                                    floated="right"
                                    onClick={ () => {
                                        triggerPreviousForm();
                                    } }
                                    data-testid="add-connection-modal-previous-button"
                                    data-componentid="add-connection-modal-previous-button"
                                >
                                    { t("console:develop.features.authenticationProvider." +
                                        "wizards.buttons.previous") }
                                </LinkButton>
                            )
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    };

    /**
    * Renders the help panel containing wizard help.
    *
    * @returns Help panel component.
    */
    const renderHelpPanel = (): ReactElement => {

        // Return null when `showHelpPanel` is false or `wizardHelp` is not defined in `selectedTemplate` object.
        if (!connectionMetaData?.create?.modal?.wizardHelp?.fields || currentWizardStep === 0) {
            return null;
        }

        return (
            <ModalWithSidePanel.SidePanel>
                <ModalWithSidePanel.Header className="wizard-header help-panel-header muted">
                    <div className="help-panel-header-text">
                        { t("console:develop.features.applications.wizards.minimalAppCreationWizard.help.heading") }
                    </div>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    <Suspense fallback={ <ContentLoader/> }>
                        {
                            isConnectionMetaDataFetchRequestLoading
                                ? <ContentLoader/>
                                : (
                                    <CreateConnectionWizardHelp
                                        wizardHelp={ connectionMetaData?.create?.modal?.wizardHelp }
                                        data-testid={ `${ componentId }-modal-wizard-help-panel` }
                                    />
                                )
                        }
                    </Suspense>
                </ModalWithSidePanel.Content>
            </ModalWithSidePanel.SidePanel>
        );
    };

    const modifyFormFields = (fields: any) => {
        return fields?.map((field: any) => {
            if (field?.name === "name") {
                field.validation = connectionNameValidation;
            }

            if (field?.autoComplete) {
                field.autoComplete = "" + Math.random();
            }

            return field;
        });
    };

    return (
        <>
            { openLimitReachedModal &&
                (
                    <TierLimitReachErrorModal
                        actionLabel={ t(
                            "console:develop.features.idp.notifications." +
                        "tierLimitReachedError.emptyPlaceholder.action"
                        ) }
                        handleModalClose={ handleLimitReachedModalClose }
                        header={ t(
                            "console:develop.features.idp.notifications.tierLimitReachedError.heading"
                        ) }
                        description={ t(
                            "console:develop.features.idp.notifications." +
                        "tierLimitReachedError.emptyPlaceholder.subtitles"
                        ) }
                        message={ t(
                            "console:develop.features.idp.notifications." +
                        "tierLimitReachedError.emptyPlaceholder.title"
                        ) }
                        openModal={ openLimitReachedModal }
                    />
                )
            }
            <HelpPanelModal
                isLoading={ isLoading || isConnectionMetaDataFetchRequestLoading }
                open={ !openLimitReachedModal }
                className="wizard identity-provider-create-wizard"
                dimmer="blurring"
                onClose={ handleWizardClose }
                closeOnDimmerClick={ false }
                closeOnEscape
                data-componentid={ `${ componentId }-modal` }
            >
                <HelpPanelModal.MainPanel>
                    <HelpPanelModal.Header
                        className="wizard-header"
                        data-componentid={ `${ componentId }-modal-header` }
                        isLoading={ isConnectionMetaDataFetchRequestLoading }
                    >
                        <div className="display-flex">
                            <GenericIcon
                                icon={
                                    ConnectionsManagementUtils.resolveConnectionResourcePath(
                                        "", connectionMetaData?.create?.image
                                    )
                                }
                                size="mini"
                                transparent
                                spaced="right"
                                data-componentid={ `${ componentId }-image` }
                            />
                            <div className="ml-1">
                                { title }
                                { subTitle &&
                            (<Heading as="h6">
                                { subTitle }
                                <DocumentationLink
                                    link={ getLink("develop.connections.newConnection.google.learnMore") }
                                >
                                    { t("common:learnMore") }
                                </DocumentationLink>
                            </Heading>)
                                }
                            </div>
                        </div>
                    </HelpPanelModal.Header>
                    <HelpPanelModal.Content
                        className="content-container"
                        data-componentid={ `${ componentId }-modal-content-2` }>
                        { alert && alertComponent }
                        <DynamicWizard
                            id={ template?.idp?.name }
                            initialValues={ { name: template?.idp?.name } }
                            onSubmit={
                                (values: any) => onSubmitWizard(values)
                            }
                            triggerSubmit={ (submitFunction: () => void) => {
                                submitAdvanceForm = submitFunction;
                            } }
                            triggerPrevious={ (previousFunction: () => void) => {
                                triggerPreviousForm = previousFunction;
                            } }
                            changePage={ (step: number) => setWizStep(step) }
                            setTotalPages={ (pageNumber: number) => setTotalStep(pageNumber) }
                            data-componentid={ componentId }
                            validateOnBlur
                        >
                            <DynamicWizardPage>
                                { renderFormFields(modifyFormFields(connectionMetaData?.create?.modal?.form?.fields)) }
                            </DynamicWizardPage>
                        </DynamicWizard>
                    </HelpPanelModal.Content>
                    <HelpPanelModal.Actions data-componentid={ `${ componentId }-modal-actions` }>
                        { resolveStepActions() }
                    </HelpPanelModal.Actions>
                </HelpPanelModal.MainPanel>
                { renderHelpPanel() }
            </HelpPanelModal>
        </>
    );
};
