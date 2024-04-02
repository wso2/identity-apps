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
    AlertLevels,
    IdentifiableComponentInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import { ContentLoader } from "@wso2is/react-components/src/components/loader/content-loader";
import { AxiosError, AxiosResponse } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Header } from "semantic-ui-react";
import { OidcAuthenticationWizardFrom } from "./oidc-authentication-wizard-page";
import {
    AppState,
    EventPublisher,
    ModalWithSidePanel,
    store
} from "../../../admin.core.v1";
import {
    createIdentityProvider,
    getFederatedAuthenticatorMetadata
} from "../../api";
import { getIdPIcons } from "../../configs/ui";
import {
    FederatedAuthenticatorListItemInterface,
    FederatedAuthenticatorMetaInterface, GenericIdentityProviderCreateWizardPropsInterface,
    IdentityProviderInterface,
    OutboundProvisioningConnectorMetaInterface
} from "../../models";
import {
    handleGetFederatedAuthenticatorMetadataAPICallError
} from "../utils";

/**
 * Proptypes for the identity provider creation wizard component.
 */
interface MinimalAuthenticationProviderCreateWizardPropsInterface extends TestableComponentInterface,
    GenericIdentityProviderCreateWizardPropsInterface, IdentifiableComponentInterface { }

/**
 * Identity provider creation wizard component.
 *
 * @param props - Props injected to the component.
 * @returns OIDC Authentication Provider creation wizard component.
 */
export const OidcAuthenticationProviderCreateWizard:
    FunctionComponent<MinimalAuthenticationProviderCreateWizardPropsInterface> = (
        props: MinimalAuthenticationProviderCreateWizardPropsInterface
    ): ReactElement => {

        const {
            onWizardClose,
            currentStep,
            onIDPCreate,
            title,
            subTitle,
            template,
            [ "data-testid" ]: testId,
            [ "data-componentid" ]: componentId
        } = props;

        const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
        //TODO: Verify the usage of these states and remove if not needed.
        const [ , setDefaultAuthenticatorMetadata ] = useState<FederatedAuthenticatorMetaInterface>(undefined);
        const [ , setDefaultOutboundProvisioningConnectorMetadata ] =
            useState<OutboundProvisioningConnectorMetaInterface>(undefined);
        const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

        const dispatch: Dispatch = useDispatch();
        const { t } = useTranslation();

        const availableAuthenticators: FederatedAuthenticatorListItemInterface[] = useSelector(
            (state: AppState) => state.identityProvider.meta.authenticators);

        const [ alert, setAlert, alertComponent ] = useWizardAlert();

        const [ wizStep, setWizStep ] = useState<number>(0);
        const [ totalStep, setTotalStep ] = useState<number>(0);

        const eventPublisher: EventPublisher = EventPublisher.getInstance();

        /**
     * Creates a new identity provider.
     *
     * @param identityProvider - Identity provider object.
     */
        const createNewIdentityProvider = (identityProvider: IdentityProviderInterface): void => {
        // TODO Uncomment below once BE support is available for templateId
        // identityProvider.templateId = template.id
            setIsSubmitting(true);

            createIdentityProvider(identityProvider)
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

                    onIDPCreate();
                })
                .catch((error: AxiosError) => {
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
                });
        };

        /**
     * Handles the final wizard submission.
     *
     * @param identityProvider - Identity provider data.
     */
        const handleWizardFormFinish = (identityProvider: IdentityProviderInterface): void => {
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
            onWizardClose();
        };

        /**
         * Gets the authenticator meta data.
         *
         * @param authenticatorId - Authenticator ID.
         */
        const setAuthenticatorMetadata = (authenticatorId: string) => {
            getFederatedAuthenticatorMetadata(authenticatorId)
                .then((response: FederatedAuthenticatorMetaInterface) => {
                    setDefaultAuthenticatorMetadata(response);
                })
                .catch((error: AxiosError) => {
                    handleGetFederatedAuthenticatorMetadataAPICallError(error);
                });
        };

        /**
     * Called when `availableAuthenticators` are changed.
     */
        useEffect(() => {
            if (availableAuthenticators?.find(
                (eachAuthenticator: FederatedAuthenticatorListItemInterface) => eachAuthenticator.authenticatorId ===
            template?.idp?.federatedAuthenticators?.defaultAuthenticatorId)) {
                setAuthenticatorMetadata(template?.idp?.federatedAuthenticators?.defaultAuthenticatorId);
            }
        }, [ availableAuthenticators ]);

        /**
     * Track wizard steps from wizard component.
     */
        useEffect(() => {
            setCurrentWizardStep(wizStep + 1);
        }, [ wizStep ]);

        let submitAdvanceForm: () => void;

        let triggerPreviousForm: () => void;


        const onSubmitWizard = (values: any): void => {
            const identityProvider: IdentityProviderInterface = template.idp;

            identityProvider.name = values?.name?.toString();
            identityProvider.federatedAuthenticators.authenticators[ 0 ].properties = [
                {
                    "key": "ClientId",
                    "value": values?.clientId?.toString()
                },
                {
                    "key": "ClientSecret",
                    "value": values?.clientSecret?.toString()
                },
                {
                    "key": "OAuth2AuthzEPUrl",
                    "value": values?.authorizationEndpointUrl?.toString()
                },
                {
                    "key": "OAuth2TokenEPUrl",
                    "value": values?.tokenEndpointUrl?.toString()
                },
                {
                    "key": "callbackUrl",
                    "value": store.getState().config.deployment.serverHost + "/commonauth"
                }
            ];

            identityProvider.image = "assets/images/logos/enterprise.svg";

            handleWizardFormFinish(identityProvider);
        };


        const resolveStepActions = (): ReactElement => {

            return (
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ handleWizardClose }
                                data-testid={ `${ testId }-modal-cancel-button` }>
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep !== totalStep ? (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ () => {
                                        submitAdvanceForm();
                                    } }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                    data-testid={ `${ testId }-modal-finish-button` }>
                                    { t("authenticationProvider:wizards.buttons.next") }
                                </PrimaryButton>
                            ) : (
                                <>
                                    <PrimaryButton
                                        floated="right"
                                        onClick={ () => {
                                            // setCurrentWizardStep(1);
                                            submitAdvanceForm();
                                        } }
                                        loading={ isSubmitting }
                                        disabled={ isSubmitting }
                                        data-testid={ `${ testId }-modal-finish-button` }>
                                        { t("authenticationProvider:wizards.buttons.finish") }
                                    </PrimaryButton>
                                </>
                            ) }
                            {
                                currentWizardStep > 1 &&
                            (<LinkButton
                                floated="right"
                                onClick={ ()=> {
                                    triggerPreviousForm();
                                } }
                                data-testid={ `${ testId }-modal-previous-button` }>
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
                            { t("applications:wizards.minimalAppCreationWizard.help.heading") }
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
                    <ModalWithSidePanel.Header
                        className="page-header-inner with-image"
                        data-testid={ `${ testId }-modal-header` }>
                        <div className="display-flex">
                            <GenericIcon
                                icon={ getIdPIcons().enterprise }
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
                    <ModalWithSidePanel.Content
                        className="content-container"
                        data-testid={ `${ testId }-modal-content-2` }
                    >
                        { alert && alertComponent }
                        <OidcAuthenticationWizardFrom
                            onSubmit={ onSubmitWizard }
                            triggerSubmission={ (submitFunction: () => void) => {
                                submitAdvanceForm = submitFunction; } }
                            triggerPrevious={ (previousFunction: () => void) => {
                                triggerPreviousForm = previousFunction; } }
                            changePageNumber= { (step:number)=> setWizStep(step) }
                            setTotalPage= { (pageNumber:number)=> setTotalStep(pageNumber) }
                            template={ template }
                        />
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
OidcAuthenticationProviderCreateWizard.defaultProps = {
    currentStep: 1,
    "data-componentid": "oidc-idp",
    "data-testid": "idp-edit-idp-create-wizard"
};
