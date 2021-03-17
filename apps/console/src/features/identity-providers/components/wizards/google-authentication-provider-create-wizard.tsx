/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms, Validation, useTrigger } from "@wso2is/forms";
import { GenericIcon, Heading, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import { ContentLoader } from "@wso2is/react-components/src/components/loader/content-loader";
import _ from "lodash";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React, { FunctionComponent, ReactElement, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Header } from "semantic-ui-react";
import { AppConstants, AppState, ModalWithSidePanel, history, store } from "../../../../features/core";
import {
    createIdentityProvider,
    getFederatedAuthenticatorMetadata,
    getIdentityProviderList
} from "../../api";
import { getAuthenticatorIcons } from "../../configs";
import { IdentityProviderManagementConstants } from "../../constants";
import {
    FederatedAuthenticatorMetaInterface,
    IdentityProviderInterface, IdentityProviderTemplateInterface,
    OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorMetaInterface
} from "../../models";
import {
    handleGetFederatedAuthenticatorMetadataAPICallError,
    handleGetIDPListCallError
} from "../utils";

/**
 * Proptypes for the identity provider creation wizard component.
 */
interface MinimalAuthenticationProviderCreateWizardPropsInterface extends TestableComponentInterface {
    currentStep?: number;
    title: string;
    closeWizard: () => void;
    template: IdentityProviderTemplateInterface;
    subTitle?: string;
}

const IDP_NAME_MAX_LENGTH: number = 50;
const CLIENT_ID_MAX_LENGTH: number = 100;
const CLIENT_SECRET_MAX_LENGTH: number = 100;

/**
 * Identity provider creation wizard component.
 *
 * @param { MinimalAuthenticationProviderCreateWizardPropsInterface } props - Props injected to the component.
 * @return { React.ReactElement }
 */
export const GoogleAuthenticationProviderCreateWizard: FunctionComponent<MinimalAuthenticationProviderCreateWizardPropsInterface> = (
    props: MinimalAuthenticationProviderCreateWizardPropsInterface
): ReactElement => {

    const {
        closeWizard,
        currentStep,
        title,
        subTitle,
        template,
        [ "data-testid" ]: testId
    } = props;

    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ defaultAuthenticatorMetadata, setDefaultAuthenticatorMetadata ] =
        useState<FederatedAuthenticatorMetaInterface>(undefined);
    const [ defaultOutboundProvisioningConnectorMetadata, setDefaultOutboundProvisioningConnectorMetadata ] =
        useState<OutboundProvisioningConnectorMetaInterface>(undefined);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const availableAuthenticators = useSelector((state: AppState) =>
        state.identityProvider.meta.authenticators);

    // Triggers for each wizard step.
    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    /**
     * Creates a new identity provider.
     *
     * @param identityProvider Identity provider object.
     */
    const createNewIdentityProvider = (identityProvider: IdentityProviderInterface): void => {
        // TODO Uncomment below once BE support is available for templateId
        // identityProvider.templateId = template.id
        createIdentityProvider(identityProvider)
            .then((response) => {
                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider.notifications.addIDP." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.authenticationProvider.notifications.addIDP." +
                        "success.message")
                }));

                // The created resource's id is sent as a location header.
                // If that's available, navigate to the edit page.
                if (!_.isEmpty(response.headers.location)) {
                    const location = response.headers.location;
                    const createdIdpID = location.substring(location.lastIndexOf("/") + 1);

                    history.push({
                        pathname: AppConstants.getPaths().get("IDP_EDIT").replace(":id", createdIdpID),
                        search: IdentityProviderManagementConstants.NEW_IDP_URL_SEARCH_PARAM
                    });

                    return;
                }

                // Fallback to identity providers page, if the location header is not present.
                history.push(AppConstants.getPaths().get("IDP"));
            })
            .catch((error) => {
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
            });
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

        createNewIdentityProvider(identityProvider);
    };

    /**
     * Called when modal close event is triggered.
     */
    const handleWizardClose = (): void => {

        // Clear data.
        setDefaultOutboundProvisioningConnectorMetadata(undefined);
        setDefaultAuthenticatorMetadata(undefined);

        // Trigger the close method from props.
        closeWizard();
    };

    /**
     * Enter button option.
     * @param e keypress event.
     */
    const keyPressed = (e): void => {
        const key = e.which || e.charCode || e.keyCode;
        if (key === 13) {
            setSubmitGeneralSettings();
        }
    };

    const resolveStepContent = (): ReactElement => {
        return (
            <Forms
                onSubmit={ (values): void => {
                    const identityProvider: IdentityProviderInterface = template.idp;
                    identityProvider.name = values.get("name").toString();
                    identityProvider.federatedAuthenticators.authenticators[0].properties = [
                        {
                            "key": "ClientId",
                            "value": values.get("ClientId").toString()
                        },
                        {
                            "key": "ClientSecret",
                            "value": values.get("ClientSecret").toString()
                        },
                        {
                            "key": "callbackUrl",
                            "value": store.getState().config.deployment.serverHost + "/commonauth"
                        },
                        {
                            "key": "AdditionalQueryParameters",
                            "value": "scope=email openid profile"
                        }
                    ];

                    // Allow to set empty client ID and client secret but make the authenticator disabled.
                    identityProvider.federatedAuthenticators.authenticators[0].isEnabled =
                        !(isEmpty(values.get("ClientId").toString())
                            || isEmpty(values.get("ClientSecret").toString()));

                    // TODO Need to make this dynamic
                    if (AppConstants.getClientOrigin()) {
                        if (AppConstants.getAppBasename()) {
                            identityProvider.image = AppConstants.getClientOrigin() +
                                "/" + AppConstants.getAppBasename() +
                                "/libs/themes/default/assets/images/identity-providers/google-idp-illustration.svg";
                        } else {
                            identityProvider.image = AppConstants.getClientOrigin() +
                                "/libs/themes/default/assets/images/identity-providers/google-idp-illustration.svg";
                        }
                    }
                    handleWizardFormFinish(identityProvider);
                } }
                submitState={ submitGeneralSettings }
                data-testid={ testId }
            >
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Field
                                name="name"
                                label={ t("console:develop.features.authenticationProvider.forms." +
                                    "generalDetails.name.label") }
                                required={ true }
                                requiredErrorMessage={ t("console:develop.features.authenticationProvider." +
                                    "forms.common.requiredErrorMessage") }
                                type="text"
                                validation={ async (value: string, validation: Validation) => {
                                    if (value.length > IDP_NAME_MAX_LENGTH) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(t("console:develop.features." +
                                            "authenticationProvider.forms.generalDetails.name.validations." +
                                            "maxLengthReached", { maxLength: IDP_NAME_MAX_LENGTH }));
                                    } else {
                                        try {
                                            const idpList = await getIdentityProviderList(
                                                null, null, "name eq " + value.toString());

                                            if (idpList?.totalResults === 0) {
                                                validation.isValid = true;
                                            } else {
                                                validation.isValid = false;
                                                validation.errorMessages.push(t("console:develop.features." +
                                                    "authenticationProvider.forms.generalDetails.name." +
                                                    "validations.duplicate"));
                                            }
                                        } catch (error) {
                                            handleGetIDPListCallError(error);
                                        }
                                    }
                                } }
                                displayErrorOn="blur"
                                value={ template?.idp?.name }
                                onKeyDown={ keyPressed }
                                data-testid={ `${ testId }-idp-name` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Field
                                name="ClientId"
                                label={ "Client ID" }
                                required={ true }
                                requiredErrorMessage={ t("console:develop.features.authenticationProvider." +
                                    "forms.common.requiredErrorMessage") }
                                type="text"
                                validation={ (value: string, validation: Validation) => {
                                    if (value.length > CLIENT_ID_MAX_LENGTH) {
                                        validation.isValid = false;
                                        validation.errorMessages.push("Client ID cannot exceed " +
                                        CLIENT_ID_MAX_LENGTH + " characters.");
                                    }
                                } }
                                autocomplete="off"
                                displayErrorOn="blur"
                                onKeyDown={ keyPressed }
                                data-testid={ `${ testId }-idp-client-id` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Field
                                name="ClientSecret"
                                label={ "Client secret" }
                                required={ true }
                                requiredErrorMessage={ t("console:develop.features.authenticationProvider." +
                                    "forms.common.requiredErrorMessage") }
                                type="password"
                                validation={ (value: string, validation: Validation) => {
                                    if (value.length > CLIENT_SECRET_MAX_LENGTH) {
                                        validation.isValid = false;
                                        validation.errorMessages.push("Client secret cannot exceed " +
                                            CLIENT_SECRET_MAX_LENGTH + " characters.");
                                    }
                                } }
                                hidePassword={ t("common:hide") }
                                showPassword={ t("common:show") }
                                autocomplete="off"
                                displayErrorOn="blur"
                                onKeyDown={ keyPressed }
                                data-testid={ `${ testId }-idp-client-secret` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Forms>
        );
    };

    /**
     * Gets the authenticator meta data.
     *
     * @param authenticatorId
     */
    const setAuthenticatorMetadata = (authenticatorId: string) => {
        getFederatedAuthenticatorMetadata(authenticatorId)
            .then((response) => {
                setDefaultAuthenticatorMetadata(response);
            })
            .catch((error) => {
                handleGetFederatedAuthenticatorMetadataAPICallError(error);
            });
    };

    /**
     * Called when `availableAuthenticators` are changed.
     */
    useEffect(() => {
        if (availableAuthenticators?.find(eachAuthenticator => eachAuthenticator.authenticatorId ===
            template?.idp?.federatedAuthenticators?.defaultAuthenticatorId)) {
            setAuthenticatorMetadata(template?.idp?.federatedAuthenticators?.defaultAuthenticatorId);
        }
    }, [ availableAuthenticators ]);

    const resolveStepActions = (): ReactElement => {

        return (
            <Grid>
                <Grid.Row column={ 1 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                        <LinkButton floated="left" onClick={ handleWizardClose }
                                    data-testid={ `${ testId }-modal-cancel-button` }>
                            { t("common:cancel") }
                        </LinkButton>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                        { currentWizardStep === 0 ? (
                            <PrimaryButton floated="right" onClick={ () => {
                                setCurrentWizardStep(1);
                            } }
                                           data-testid={ `${ testId }-modal-finish-button` }>
                                { t("console:develop.features.authenticationProvider.wizards.buttons.next") }
                            </PrimaryButton>
                        ) : (
                            <>
                                <PrimaryButton floated="right" onClick={ setSubmitGeneralSettings }
                                               data-testid={ `${ testId }-modal-finish-button` }>
                                    { t("console:develop.features.authenticationProvider.wizards.buttons.finish") }
                                </PrimaryButton>
                            </>
                        ) }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    };

    /**
     * Renders the help panel containing wizard help.
     *
     * @return { React.ReactElement }
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
                        { t("console:develop.features.applications.wizards.minimalAppCreationWizard.help.heading") }
                    </div>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    <Suspense fallback={ <ContentLoader /> }>
                        <WizardHelp />
                    </Suspense>
                </ModalWithSidePanel.Content>
            </ModalWithSidePanel.SidePanel>
        );
    };

    return (
        <ModalWithSidePanel
            open={ true }
            className="wizard identity-provider-create-wizard"
            dimmer="blurring"
            onClose={ handleWizardClose }
            closeOnDimmerClick={ false }
            closeOnEscape
            data-testid={ `${ testId }-modal` }
        >
            <ModalWithSidePanel.MainPanel>
                <ModalWithSidePanel.Header className="page-header-inner with-image"
                                           data-testid={ `${ testId }-modal-header` }>
                    <div className="display-flex">
                        <GenericIcon
                            icon={ getAuthenticatorIcons().google }
                            size="x50"
                            transparent
                            spaced={ "right" }
                            data-testid={ `${ testId }-image` }
                        />
                        <Header
                            size={ "small" }
                            textAlign={ "left" }
                            className={ "m-0" }
                            data-testid={ `${ testId }-text-wrapper` }
                        >
                            <span data-testid={ `${ testId }-title` }>
                                { title && title }
                            </span>
                            { subTitle && (
                                <Header.Subheader
                                    data-testid={ `${ testId }-sub-title` }
                                >
                                    { subTitle }
                                </Header.Subheader>
                            ) }
                        </Header>
                    </div>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content className="content-container" data-testid={ `${ testId }-modal-content-2` }>
                    { alert && alertComponent }
                    { resolveStepContent() }
                </ModalWithSidePanel.Content>
                <ModalWithSidePanel.Actions data-testid={ `${ testId }-modal-actions` }>
                    { resolveStepActions() }
                </ModalWithSidePanel.Actions>
            </ModalWithSidePanel.MainPanel>
            { renderHelpPanel() }
        </ModalWithSidePanel>
    );
};

/**
 * Default props for the identity provider creation wizard.
 */
GoogleAuthenticationProviderCreateWizard.defaultProps = {
    currentStep: 1,
    "data-testid": "idp-edit-idp-create-wizard"
};
