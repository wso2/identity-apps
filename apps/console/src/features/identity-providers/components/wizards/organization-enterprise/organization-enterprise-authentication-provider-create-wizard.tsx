/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
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

import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import { ContentLoader } from "@wso2is/react-components/src/components/loader/content-loader";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import {
    OrganizationEnterpriseAuthenticationProviderCreateWizardContent
} from "./organization-enterprise-authentication-provider-create-wizard-content";
import { identityProviderConfig } from "../../../../../extensions/configs";
import {
    AppState,
    ConfigReducerStateInterface,
    EventPublisher,
    ModalWithSidePanel,
    TierLimitReachErrorModal
} from "../../../../core";
import { createIdentityProvider } from "../../../api";
import { getIdPIcons } from "../../../configs";
import { IdentityProviderManagementConstants } from "../../../constants";
import {
    GenericIdentityProviderCreateWizardPropsInterface,
    IdentityProviderInterface,
    OutboundProvisioningConnectorInterface
} from "../../../models";

/**
 * Proptypes for the Organization Enterprise Authentication Provider Create Wizard.
 */
interface OrganizationEnterpriseAuthenticationProviderCreateWizardPropsInterface extends IdentifiableComponentInterface,
    GenericIdentityProviderCreateWizardPropsInterface {
}

/**
 * Proptypes for the Authentication Wizard Form values.
 */
export interface OrganizationEnterpriseAuthenticationProviderCreateWizardFormValuesInterface {
    /**
     * Name for the Idp
     */
    name: string;
    /**
     * Description of the Idp
     */
    description: string;
}

/**
 * Proptypes for the Authentication Wizard Form error messages.
 */
export interface OrganizationEnterpriseAuthenticationProviderCreateWizardFormErrorValidationsInterface {
    /**
     * Error message for the Authenticator name.
     */
    name: string;
    /**
     * Error message for the description.
     */
    description: string;
}

/**
 * Facebook Authentication Provider Create Wizard Component.
 *
 * @param { OrganizationEnterpriseAuthenticationProviderCreateWizardPropsInterface } props - Props injected to
 * the component.
 *
 * @return { React.ReactElement }
 */
export const OrganizationEnterpriseAuthenticationProviderCreateWizard: FunctionComponent<OrganizationEnterpriseAuthenticationProviderCreateWizardPropsInterface> = (
    props: OrganizationEnterpriseAuthenticationProviderCreateWizardPropsInterface
): ReactElement => {

    const {
        onWizardClose,
        onIDPCreate,
        currentStep,
        title,
        template,
        ["data-componentid"]: componentId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

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
     * @param identityProvider Identity provider object.
     */
    const createNewIdentityProvider = (identityProvider: IdentityProviderInterface): void => {

        // TODO Uncomment below once template id is supported from IDP REST API
        // Tracked Here - https://github.com/wso2/product-is/issues/11023
        // identityProvider.templateId = template.id;

        setIsSubmitting(true);

        createIdentityProvider(identityProvider)
            .then((response) => {
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
                    const location = response.headers.location;
                    const createdIdpID = location.substring(location.lastIndexOf("/") + 1);

                    onIDPCreate(createdIdpID);

                    return;
                }

                // Since the location header is not present, trigger callback without the id.
                onIDPCreate();
            })
            .catch((error) => {
                const identityAppsError: IdentityAppsError = identityProviderConfig.useNewConnectionsView
                    ? IdentityProviderManagementConstants.ERROR_CREATE_LIMIT_REACHED
                    : IdentityProviderManagementConstants.ERROR_CREATE_LIMIT_REACHED_IDP;

                if (error.response.status === 403 &&
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
            })
        ;
    };

    /**
     * Handles the final wizard submission.
     *
     * @param identityProvider - Identity provider data.
     */
    const handleWizardFormFinish = (identityProvider: IdentityProviderInterface): void => {

        const connector: OutboundProvisioningConnectorInterface =
            identityProvider?.provisioning?.outboundConnectors?.connectors[0];

        const isGoogleConnector: boolean = get(connector,
            IdentityProviderManagementConstants.PROVISIONING_CONNECTOR_DISPLAY_NAME) ===
            IdentityProviderManagementConstants.PROVISIONING_CONNECTOR_GOOGLE;

        // If the outbound connector is Google, remove the displayName from the connector.
        if (connector && isGoogleConnector) {
            delete connector[
                IdentityProviderManagementConstants.PROVISIONING_CONNECTOR_DISPLAY_NAME
            ];
        }

        delete (identityProvider.image);
        delete (identityProvider.certificate);
        delete (identityProvider.claims);
        delete (identityProvider.provisioning);

        // Use description from template.
        identityProvider.description = template.description;

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
     * @param {OrganizationEnterpriseAuthenticationProviderCreateWizardFormValuesInterface} values - Form values.
     */
    const onSubmitWizard = async (
        values: OrganizationEnterpriseAuthenticationProviderCreateWizardFormValuesInterface
    ): Promise<void> => {

        await identityProviderConfig.overrideTemplate(template);

        const identityProvider: IdentityProviderInterface = { ...template.idp };

        identityProvider.name = values.name.toString();
        identityProvider.description = values.name.toString();

        // // TODO: Refactor the usage of absolute image paths once Media Service is available.
        // // Tracked here - https://github.com/wso2/product-is/issues/12396
        // if (AppConstants.getClientOrigin()) {
        //     if (AppConstants.getAppBasename()) {
        //         identityProvider.image = AppConstants.getClientOrigin() +
        //         "/" + AppConstants.getAppBasename() +
        //         "/libs/themes/default/assets/images/identity-providers/enterprise-idp-illustration.svg";
        //     } else {
        //         identityProvider.image = AppConstants.getClientOrigin() +
        //         "/libs/themes/default/assets/images/identity-providers/enterprise-idp-illustration.svg";
        //     }
        // }

        handleWizardFormFinish(identityProvider);
    };

    /**
     * Resolve the step wizard actions.
     *
     * @return {React.ReactElement}
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
                                { t("console:develop.features.authenticationProvider.wizards.buttons.next") }
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
                                    { t("console:develop.features.authenticationProvider.wizards.buttons.finish") }
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
                                { t("console:develop.features.authenticationProvider.wizards.buttons.previous") }
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
     * @return {React.ReactElement}
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
                            t("console:develop.features.authenticationProvider.templates" +
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
                                icon={ getIdPIcons().default }
                                size="mini"
                                transparent
                                spaced="right"
                                data-testid={ `${componentId}-image` }
                            />
                            <div className="ml-1">
                                { title }
                            </div>
                        </div>
                    </ModalWithSidePanel.Header>
                    <ModalWithSidePanel.Content
                        className="content-container"
                        data-testid={ `${componentId}-modal-content` }
                    >
                        { alert && alertComponent }
                        <OrganizationEnterpriseAuthenticationProviderCreateWizardContent
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
 * Default props for the Facebook Authentication Provider Create Wizard.
 */
OrganizationEnterpriseAuthenticationProviderCreateWizard.defaultProps = {
    currentStep: 1,
    "data-componentid": "organization-enterprise-idp"
};
