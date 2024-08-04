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

import {
    EventPublisher,
    ModalWithSidePanel,
    TierLimitReachErrorModal
} from "@wso2is/admin.core.v1";
import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon, Heading, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import { ContentLoader } from "@wso2is/react-components/src/components/loader/content-loader";
import { AxiosError, AxiosResponse } from "axios";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid } from "semantic-ui-react";
import {
    OrganizationEnterpriseConnectionCreateWizardContent
} from "./organization-enterprise-connection-create-wizard-content";
import { createConnection } from "../../../api/connections";
import { getConnectionIcons } from "../../../configs/ui";
import { ConnectionManagementConstants } from "../../../constants/connection-constants";
import {
    ConnectionInterface,
    GenericConnectionCreateWizardPropsInterface,
    OutboundProvisioningConnectorInterface
} from "../../../models/connection";

/**
 * Proptypes for the Organization Enterprise Authentication Provider Create Wizard.
 */
interface OrganizationEnterpriseConnectionCreateWizardPropsInterface extends IdentifiableComponentInterface,
    GenericConnectionCreateWizardPropsInterface {
}

/**
 * Proptypes for the Authentication Wizard Form values.
 */
export interface OrganizationEnterpriseConnectionCreateWizardFormValuesInterface {
    /**
     * Name for the Idp
     */
    name: string;
    /**
     * Description of the Idp
     */
    description?: string;
}

/**
 * Proptypes for the Authentication Wizard Form error messages.
 */
export interface OrganizationEnterpriseConnectionCreateWizardFormErrorValidationsInterface {
    /**
     * Error message for the Authenticator name.
     */
    name: string;
    /**
     * Error message for the description.
     */
    description?: string;
}

/**
 * Organization Enterprise Connection Create Wizard Component.
 *
 * @param props - Props injected to the component.
 *
 * @returns OrganizationEnterpriseConnectionCreateWizard component.
 */
export const OrganizationEnterpriseConnectionCreateWizard: FunctionComponent<
    OrganizationEnterpriseConnectionCreateWizardPropsInterface
> = (
    props: OrganizationEnterpriseConnectionCreateWizardPropsInterface
): ReactElement => {

    const {
        onWizardClose,
        onIDPCreate,
        currentStep,
        title,
        subTitle,
        template,
        ["data-componentid"]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ wizStep, setWizStep ] = useState<number>(0);
    const [ totalStep, setTotalStep ] = useState<number>(0);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ openLimitReachedModal, setOpenLimitReachedModal ] = useState<boolean>(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Track wizard steps from wizard component.
     */
    useEffect(() => {
        setCurrentWizardStep(wizStep + 1);
    }, [ wizStep ]);

    /**
     * Creates a new identity provider.
     *
     * @param identityProvider - Identity provider object.
     */
    const createNewIdentityProvider = (identityProvider: ConnectionInterface): void => {

        setIsSubmitting(true);

        createConnection(identityProvider)
            .then((response: AxiosResponse) => {
                eventPublisher.publish("connections-finish-adding-connection", {
                    type: componentId
                });

                dispatch(addAlert({
                    description: t("authenticationProvider:notifications.addIDP." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications.addIDP." +
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

                if (error.response.status === 403 &&
                    error?.response?.data?.code ===
                    identityAppsError.getErrorCode()) {
                    setOpenLimitReachedModal(true);

                    return;
                }

                if (error.response && error.response.data && error.response.data.description) {
                    setAlert({
                        description: t("authenticationProvider:notifications." +
                            "addIDP.error.description",
                        { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("authenticationProvider:notifications." +
                            "addIDP.error.message")
                    });

                    return;
                }

                setAlert({
                    description: t("authenticationProvider:notifications.addIDP." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:notifications.addIDP." +
                        "genericError.message")
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            })
        ;
    };

    /**
     * Handles the final wizard submission.
     *
     * @param identityProvider - Identity provider data.
     */
    const handleWizardFormFinish = (identityProvider: ConnectionInterface): void => {

        const connector: OutboundProvisioningConnectorInterface =
            identityProvider?.provisioning?.outboundConnectors?.connectors[0];

        const isGoogleConnector: boolean = get(connector,
            ConnectionManagementConstants.PROVISIONING_CONNECTOR_DISPLAY_NAME) ===
            ConnectionManagementConstants.PROVISIONING_CONNECTOR_GOOGLE;

        // If the outbound connector is Google, remove the displayName from the connector.
        if (connector && isGoogleConnector) {
            delete connector[
                ConnectionManagementConstants.PROVISIONING_CONNECTOR_DISPLAY_NAME
            ];
        }

        delete (identityProvider.certificate);
        delete (identityProvider.claims);
        delete (identityProvider.provisioning);

        // Use description from template if the user description is not given.
        identityProvider.description = identityProvider.description || template.description;

        createNewIdentityProvider(identityProvider);
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
     * Callback triggered when the form is submitted.
     *
     * @param values - Form values.
     */
    const onSubmitWizard = (
        values: OrganizationEnterpriseConnectionCreateWizardFormValuesInterface
    ): void => {

        const identityProvider: ConnectionInterface = { ...template.idp };

        identityProvider.name = values.name.toString();
        identityProvider.description = values.description?.toString();
        identityProvider.templateId = template.templateId;

        identityProvider.image = "assets/images/logos/organization-sso.svg";

        handleWizardFormFinish(identityProvider);
    };

    /**
     * Resolve the step wizard actions.
     *
     * @returns Resolved step wizard actions.
     */
    const resolveStepActions = (): ReactElement => {

        return (
            <Grid>
                <Grid.Row column={ 1 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                        <LinkButton
                            floated="left"
                            onClick={ handleWizardClose }
                            data-testid={ `${componentId}-modal-cancel-button` }
                        >
                            { t("common:cancel") }
                        </LinkButton>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                        { currentWizardStep !== totalStep ? (
                            <PrimaryButton
                                floated="right"
                                onClick={ () => {
                                    submitForm();
                                } }
                                data-testid={ `${componentId}-modal-finish-button` }
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
                            >
                                { t("authenticationProvider:wizards.buttons.next") }
                            </PrimaryButton>
                        ) : (
                            <>
                                <PrimaryButton
                                    floated="right"
                                    onClick={ () => {
                                        submitForm();
                                    } }
                                    data-testid={ `${componentId}-modal-finish-button` }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                >
                                    { t("authenticationProvider:wizards.buttons.finish") }
                                </PrimaryButton>
                            </>
                        ) }
                        {
                            currentWizardStep > 1 &&
                            (<LinkButton
                                floated="right"
                                onClick={ () => {
                                    triggerPreviousForm();
                                } }
                                data-testid={ `${componentId}-modal-previous-button` }
                            >
                                { t("authenticationProvider:wizards.buttons.previous") }
                            </LinkButton>)
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
        if (!template?.content?.wizardHelp || currentWizardStep === 0) {
            return null;
        }

        const {
            wizardHelp: WizardHelp
        } = template?.content;

        return (
            <ModalWithSidePanel.SidePanel>
                <ModalWithSidePanel.Header className="wizard-header help-panel-header muted">
                    <div className="help-panel-header-text">
                        {
                            t("authenticationProvider:templates" +
                                ".facebook.wizardHelp.heading")
                        }
                    </div>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    <Suspense fallback={ <ContentLoader/> }>
                        <WizardHelp/>
                    </Suspense>
                </ModalWithSidePanel.Content>
            </ModalWithSidePanel.SidePanel>
        );
    };

    /**
     * Closure to submit form.
     */
    let submitForm: () => void;

    /**
     * Closure to trigger previous form.
     */
    let triggerPreviousForm: () => void;

    return (
        <>
            { openLimitReachedModal &&
                (<TierLimitReachErrorModal
                    actionLabel={ t(
                        "idp:notifications." +
                        "tierLimitReachedError.emptyPlaceholder.action"
                    ) }
                    handleModalClose={ handleLimitReachedModalClose }
                    header={ t(
                        "idp:notifications.tierLimitReachedError.heading"
                    ) }
                    description={ t(
                        "idp:notifications." +
                        "tierLimitReachedError.emptyPlaceholder.subtitles"
                    ) }
                    message={ t(
                        "idp:notifications." +
                        "tierLimitReachedError.emptyPlaceholder.title"
                    ) }
                    openModal={ openLimitReachedModal }
                />) }
            <ModalWithSidePanel
                open={ !openLimitReachedModal }
                className="wizard identity-provider-create-wizard"
                dimmer="blurring"
                onClose={ handleWizardClose }
                closeOnDimmerClick={ false }
                closeOnEscape
                data-testid={ `${componentId}-modal` }
            >
                <ModalWithSidePanel.MainPanel>
                    <ModalWithSidePanel.Header
                        className="wizard-header"
                        data-testid={ `${componentId}-modal-header` }
                    >
                        <div className="display-flex">
                            <GenericIcon
                                icon={ getConnectionIcons().organizationSSO }
                                size="mini"
                                transparent
                                spaced="right"
                                data-testid={ `${componentId}-image` }
                            />
                            <div className="ml-1">
                                { title }
                                { subTitle &&
                                    (<Heading as="h6">
                                        { subTitle }
                                    </Heading>)
                                }
                            </div>
                        </div>
                    </ModalWithSidePanel.Header>
                    <ModalWithSidePanel.Content
                        className="content-container"
                        data-testid={ `${componentId}-modal-content` }
                    >
                        { alert && alertComponent }
                        <OrganizationEnterpriseConnectionCreateWizardContent
                            onSubmit={ onSubmitWizard }
                            triggerSubmission={ (submitFunctionCb: () => void) => {
                                submitForm = submitFunctionCb;
                            } }
                            triggerPrevious={ (previousFunctionCb: () => void) => {
                                triggerPreviousForm = previousFunctionCb;
                            } }
                            changePageNumber={ (step: number) => setWizStep(step) }
                            setTotalPage={ (pageNumber: number) => setTotalStep(pageNumber) }
                            template={ template }
                        />
                    </ModalWithSidePanel.Content>
                    <ModalWithSidePanel.Actions data-testid={ `${componentId}-modal-actions` }>
                        { resolveStepActions() }
                    </ModalWithSidePanel.Actions>
                </ModalWithSidePanel.MainPanel>
                { renderHelpPanel() }
            </ModalWithSidePanel>
        </>
    );
};

/**
 * Default props for the Organization Enterprise Connection Create Wizard.
 */
OrganizationEnterpriseConnectionCreateWizard.defaultProps = {
    currentStep: 1,
    "data-componentid": "organization-enterprise-idp"
};
