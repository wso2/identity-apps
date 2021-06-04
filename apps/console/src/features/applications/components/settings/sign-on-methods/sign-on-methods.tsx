/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Code, ConfirmationModal, EmphasizedSegment, LabeledCard, Text } from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Divider } from "semantic-ui-react";
import { SignInMethodCustomization } from "./sign-in-method-customization";
import { SignInMethodLanding } from "./sign-in-method-landing";
import DefaultFlowConfigurationSequenceTemplate from "./templates/default-sequence.json";
import GoogleLoginSequenceTemplate from "./templates/google-login-sequence.json";
import SecondFactorTOTPSequenceTemplate from "./templates/second-factor-totp-sequence.json";
import {
    AppConstants,
    FeatureConfigInterface,
    history
} from "../../../../core";
import {
    AuthenticatorMeta,
    GenericAuthenticatorInterface,
    IdentityProviderManagementUtils,
    IdentityProviderTemplateInterface
} from "../../../../identity-providers";
import { IdentityProviderManagementConstants } from "../../../../identity-providers/constants";
import { ApplicationInterface, AuthenticationSequenceInterface, LoginFlowTypes } from "../../../models";
import { AdaptiveScriptUtils } from "../../../utils";
import { AuthenticatorCreateWizardFactory } from "../../../../identity-providers/components/wizards";
/**
 * Proptypes for the sign on methods component.
 */
interface SignOnMethodsPropsInterface extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {

    /**
     * Editing application.
     */
    application: ApplicationInterface;
    /**
     * ID of the application.
     */
    appId?: string;
    /**
     * Currently configured authentication sequence for the application.
     */
    authenticationSequence: AuthenticationSequenceInterface;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Closure to broadcast the IDP create success to the child component.
 * If this is placed inside the component, it will not initialize properly.
 * @type {null}
 */
let broadcastIDPCreateSuccessMessage: () => void = null;

/**
 * Configure the different sign on strategies for an application.
 *
 * @param {SignOnMethodsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SignOnMethods: FunctionComponent<SignOnMethodsPropsInterface> = (
    props: SignOnMethodsPropsInterface
): ReactElement => {

    const {
        appId,
        authenticationSequence,
        isLoading,
        onUpdate,
        readOnly,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ loginFlow, setLoginFlow ] = useState<LoginFlowTypes>(undefined);
    const [ authenticators, setAuthenticators ] = useState<GenericAuthenticatorInterface[][]>(undefined);
    const [ googleAuthenticators, setGoogleAuthenticators ] = useState<GenericAuthenticatorInterface[]>(undefined);
    const [ showMissingGoogleAuthenticatorModal, setShowMissingGoogleAuthenticatorModal ] = useState<boolean>(false);
    const [ isAuthenticatorsFetchRequestLoading, setIsAuthenticatorsFetchRequestLoading ] = useState<boolean>(false);
    const [
        showDuplicateGoogleAuthenticatorSelectionModal,
        setShowDuplicateGoogleAuthenticatorSelectionModal
    ] = useState<boolean>(false);
    const [
        selectedGoogleAuthenticator,
        setSelectedGoogleAuthenticator
    ] = useState<GenericAuthenticatorInterface>(undefined);
    const [
        moderatedAuthenticationSequence,
        setModeratedAuthenticationSequence
    ] = useState<AuthenticationSequenceInterface>(authenticationSequence);
    const [ selectedIDPTemplate, setSelectedIDPTemplate ] = useState<IdentityProviderTemplateInterface>(undefined);
    const [ idpTemplateTypeToTrigger, setIDPTemplateTypeToTrigger ] = useState<string>(undefined);
    const [ showIDPCreateWizard, setShowIDPCreateWizard ] = useState<boolean>(false);
    const [
        idpCreateWizardTriggerOrigin,
        setIDPCreateWizardTriggerOrigin
    ] = useState<"INTERNAL"|"EXTERNAL">(undefined);

    /**
     * Loads federated authenticators and local authenticators on component load.
     */
    useEffect(() => {
        
        fetchAndCategorizeAuthenticators();
    }, []);

    /**
     * Fetches the list of Authenticators and categorize them.
     *
     * @param {(all: GenericAuthenticatorInterface[][],
     *     google: GenericAuthenticatorInterface[]) => void} onSuccess - On Success callback.
     */
    const fetchAndCategorizeAuthenticators = (onSuccess?: (all: GenericAuthenticatorInterface[][],
                                                           google: GenericAuthenticatorInterface[]) => void): void => {

        setIsAuthenticatorsFetchRequestLoading(true);

        IdentityProviderManagementUtils.getAllAuthenticators()
            .then((response: GenericAuthenticatorInterface[][]) => {

                const google: GenericAuthenticatorInterface[] = [];

                response[ 1 ].filter((authenticator: GenericAuthenticatorInterface) => {
                    if (authenticator.defaultAuthenticator.authenticatorId
                        ===  IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID) {

                        google.push(authenticator);
                    }
                });

                setGoogleAuthenticators(google);
                setAuthenticators(response);
                onSuccess && onSuccess(response, google);
            })
            .finally(() => {
                setIsAuthenticatorsFetchRequestLoading(false);
            });
    };

    /**
     * Check if the sequence is default.
     * If only on step is configured with BasicAuthenticator and the script is default,
     * this function will identify the sequence as a default flow.
     *
     * @return {boolean}
     */
    const isDefaultFlowConfiguration = (): boolean => {

        if (authenticationSequence?.steps?.length !== 1 || authenticationSequence.steps[ 0 ].options?.length !== 1) {
            return false;
        }

        const isBasicStep: boolean = authenticationSequence.steps[ 0 ].options[ 0 ].authenticator
            === IdentityProviderManagementConstants.BASIC_AUTHENTICATOR;
        const isBasicScript: boolean = !authenticationSequence.script
            || AdaptiveScriptUtils.isDefaultScript(authenticationSequence.script, authenticationSequence.steps?.length);

        return isBasicStep && isBasicScript;
    };

    /**
     * Handles the login flow select action.
     *
     * @param {LoginFlowTypes} loginFlow - Selected login flow.
     * @param {GenericAuthenticatorInterface[]} googleAuthenticators -  Set of Google Authenticators.
     */
    const handleLoginFlowSelect = (loginFlow: LoginFlowTypes,
                                   googleAuthenticators: GenericAuthenticatorInterface[]): void => {

        if (!loginFlow) {
            setModeratedAuthenticationSequence(authenticationSequence);
        } else if (loginFlow === LoginFlowTypes.DEFAULT) {
            setModeratedAuthenticationSequence({
                ...authenticationSequence,
                ...cloneDeep(DefaultFlowConfigurationSequenceTemplate)
            });
        } else if (loginFlow === LoginFlowTypes.SECOND_FACTOR_TOTP) {
            setModeratedAuthenticationSequence({
                ...authenticationSequence,
                ...cloneDeep(SecondFactorTOTPSequenceTemplate)
            });
        } else if (loginFlow === LoginFlowTypes.GOOGLE_LOGIN) {
            // If there are no IDP's with google authenticator, show missing authenticator modal.
           if (isEmpty(googleAuthenticators)) {
               setShowMissingGoogleAuthenticatorModal(true);
               
               return;
           }

            // If there are more than 1 IDP's with google authenticator, show authenticator select modal.
           if (googleAuthenticators.length > 1) {
               // Set the first element as the selected google authenticator.
               setSelectedGoogleAuthenticator(googleAuthenticators[0]);
               setShowDuplicateGoogleAuthenticatorSelectionModal(true);
               
               return;
           }

            // If there are only 1 IDP's with google authenticator, move on.
           if (googleAuthenticators.length === 1) {
               setModeratedAuthenticationSequence({
                   ...authenticationSequence,
                   ...updateGoogleLoginSequenceWithIDPName(googleAuthenticators[0].idp)
               });
           }
        }

        setLoginFlow(loginFlow);
    };

    /**
     * Updates the predefined google login sequence with the desired IDP name.
     * i.e. Replaces the `<GOOGLE_IDP>` in the JSON with a properly configured IDP.
     *
     * @return {AuthenticationSequenceInterface}
     */
    const updateGoogleLoginSequenceWithIDPName = (idp: string): AuthenticationSequenceInterface => {

        const modifiedGoogleLoginSequenceTemplate = cloneDeep(GoogleLoginSequenceTemplate);
        modifiedGoogleLoginSequenceTemplate.steps[0].options.forEach((option) => {
            if (option.authenticator === IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_NAME) {
                option.idp = idp;
            }
        });

        return modifiedGoogleLoginSequenceTemplate;
    };

    /**
     * Shows the missing google authenticator modal.
     *
     * @return {ReactElement}
     */
    const renderMissingGoogleAuthenticatorModal = (): ReactElement => (

        <ConfirmationModal
            type="info"
            onClose={ () => setShowMissingGoogleAuthenticatorModal(false) }
            open={ showMissingGoogleAuthenticatorModal }
            primaryAction={
                t("console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                    "flowBuilder.addMissingGoogleAuthenticatorModal.primaryButton")
            }
            secondaryAction={
                t("console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                    "flowBuilder.addMissingGoogleAuthenticatorModal.secondaryButton")
            }
            onSecondaryActionClick={ () => setShowMissingGoogleAuthenticatorModal(false) }
            onPrimaryActionClick={ (): void => {
                setIDPTemplateTypeToTrigger(IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE);
                setShowMissingGoogleAuthenticatorModal(false);
                setShowIDPCreateWizard(true);
                setIDPCreateWizardTriggerOrigin("INTERNAL");
            } }
            data-testid={ `${ testId }-add-missing-authenticator-modal` }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header>
                {
                    t("console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                        "flowBuilder.addMissingGoogleAuthenticatorModal.heading")
                }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message attached info>
                {
                    t("console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                        "flowBuilder.addMissingGoogleAuthenticatorModal.content.message")
                }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content>
                <Trans
                    i18nKey={
                        "console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                        "flowBuilder.addMissingGoogleAuthenticatorModal.content.body"
                    }
                >
                    You do not have an active Identity Provider configured with <Code> Google Authenticator</Code>.
                    Click on the <strong>Configure</strong> button to register a new <Code>Google Identity 
                    Provider</Code> or navigate to the <a
                        onClick={ () => {
                            history.push(AppConstants.getPaths().get("IDP"));
                        } }
                        className="external-link link pointing primary"
                    >Identity Providers</a> section manually.
                </Trans>
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    /**
     * Shows a modal to select the IDP when multiple IDP's have google authenticator configured as default.
     *
     * @return {ReactElement}
     */
    const renderDuplicateGoogleAuthenticatorSelectionModal = (): ReactElement => (

        <ConfirmationModal
            type="warning"
            onClose={ () => setShowDuplicateGoogleAuthenticatorSelectionModal(false) }
            open={ showDuplicateGoogleAuthenticatorSelectionModal }
            primaryAction={
                t("console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                    "flowBuilder.duplicateGoogleAuthenticatorSelectionModal.primaryButton")
            }
            secondaryAction={
                t("console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                    "flowBuilder.duplicateGoogleAuthenticatorSelectionModal.secondaryButton")
            }
            onSecondaryActionClick={ () => setShowDuplicateGoogleAuthenticatorSelectionModal(false) }
            onPrimaryActionClick={ (): void => {
                setModeratedAuthenticationSequence({
                    ...authenticationSequence,
                    ...updateGoogleLoginSequenceWithIDPName(selectedGoogleAuthenticator.idp)
                });

                setLoginFlow(LoginFlowTypes.GOOGLE_LOGIN);
                setShowDuplicateGoogleAuthenticatorSelectionModal(false);
            } }
            data-testid={ `${ testId }-duplicate-authenticator-selection-modal` }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header>
                {
                    t("console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                        "flowBuilder.duplicateGoogleAuthenticatorSelectionModal.heading")
                }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message attached warning>
                {
                    t("console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                        "flowBuilder.duplicateGoogleAuthenticatorSelectionModal.content.message")
                }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content>
                <Text>
                    <Trans
                        i18nKey={
                            "console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                            "flowBuilder.duplicateGoogleAuthenticatorSelectionModal.content.body"
                        }
                    >
                        You have multiple Identity Providers configured with <Code>Google Authenticator</Code>. 
                        Select the desired one from the selection bellow to proceed
                    </Trans>
                </Text>
                <Divider hidden />
                <div>
                    {
                        googleAuthenticators.map((authenticator, index) => (
                            <LabeledCard
                                key={ index }
                                multilineLabel
                                className="authenticator-card"
                                size="tiny"
                                selected={ selectedGoogleAuthenticator?.id === authenticator.id }
                                image={ authenticator.image }
                                label={
                                    AuthenticatorMeta.getAuthenticatorDisplayName(authenticator.name)
                                    || authenticator.displayName
                                }
                                labelEllipsis={ true }
                                data-testid={
                                    `${ testId }-authenticator-${ authenticator.name }`
                                }
                                onClick={ () => setSelectedGoogleAuthenticator(authenticator) }
                            />
                        ))
                    }
                </div>
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    /**
     * Resets the internal state back to default on reset.
     */
    const handleLoginFlowReset = (): void => {
        setLoginFlow(undefined);
        setShowMissingGoogleAuthenticatorModal(false);
        setShowDuplicateGoogleAuthenticatorSelectionModal(false);
        setSelectedGoogleAuthenticator(undefined);
        setModeratedAuthenticationSequence(authenticationSequence);
        setIDPTemplateTypeToTrigger(undefined);
        setIDPCreateWizardTriggerOrigin(undefined);
        setShowIDPCreateWizard(false);
    };

    /**
     * Renders the IDP create wizard.
     *
     * @return {React.ReactElement}
     */
    const renderIDPCreateWizard = (): ReactElement => {

        if (!idpTemplateTypeToTrigger) {
            return;
        }

        return (
            <AuthenticatorCreateWizardFactory
                open={ showIDPCreateWizard }
                type={ idpTemplateTypeToTrigger }
                showAsStandaloneIdentityProvider={ true }
                selectedTemplate={ selectedIDPTemplate }
                onIDPCreate={ () => {
                    fetchAndCategorizeAuthenticators((all, google) => {
                        setIDPTemplateTypeToTrigger(undefined);
                        setShowIDPCreateWizard(false);
                        broadcastIDPCreateSuccessMessage && broadcastIDPCreateSuccessMessage();

                        if (idpCreateWizardTriggerOrigin === "INTERNAL") {
                            handleLoginFlowSelect(LoginFlowTypes.GOOGLE_LOGIN, google);
                        }
                    });
                } }
                onWizardClose={ () => {
                    setIDPTemplateTypeToTrigger(undefined);
                    setIDPCreateWizardTriggerOrigin(undefined);
                    setShowIDPCreateWizard(false);
                } }
            />
        );
    };

    return (
        <EmphasizedSegment className="sign-on-methods-tab-content" padded="very">
            {
                (!readOnly && !loginFlow && isDefaultFlowConfiguration())
                    ? (
                        <SignInMethodLanding
                            isLoading={ isLoading || isAuthenticatorsFetchRequestLoading }
                            readOnly={ readOnly }
                            onLoginFlowSelect={ (type: LoginFlowTypes) => {
                                handleLoginFlowSelect(type, googleAuthenticators);
                            } }
                            data-testid={ `${ testId }-landing` }
                        />
                    )
                    : (
                        <>
                            <SignInMethodCustomization
                                appId={ appId }
                                isLoading={ isLoading || isAuthenticatorsFetchRequestLoading }
                                authenticators={ authenticators }
                                authenticationSequence={ moderatedAuthenticationSequence }
                                onIDPCreateWizardTrigger={ (type: string, cb: () => void, template: any) => {
                                    setSelectedIDPTemplate(template);
                                    setIDPCreateWizardTriggerOrigin("EXTERNAL");
                                    setIDPTemplateTypeToTrigger(type);
                                    setShowMissingGoogleAuthenticatorModal(false);
                                    setShowIDPCreateWizard(true);
                                    broadcastIDPCreateSuccessMessage = cb;
                                } }
                                onUpdate={ onUpdate }
                                onReset={ handleLoginFlowReset }
                                data-testid={ testId }
                                readOnly={ readOnly }
                            />
                        </>
                    )
            }
            { showIDPCreateWizard && renderIDPCreateWizard() }
            { showMissingGoogleAuthenticatorModal && renderMissingGoogleAuthenticatorModal() }
            { showDuplicateGoogleAuthenticatorSelectionModal && renderDuplicateGoogleAuthenticatorSelectionModal() }
        </EmphasizedSegment>
    );
};

/**
 * Default props for the application sign-on-methods component.
 */
SignOnMethods.defaultProps = {
    "data-testid": "sign-on-methods"
};
