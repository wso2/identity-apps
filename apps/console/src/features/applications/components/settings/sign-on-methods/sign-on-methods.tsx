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
import { LocalStorageUtils } from "@wso2is/core/utils";
import { Code, ConfirmationModal, ContentLoader, EmphasizedSegment, LabeledCard, Text } from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Divider } from "semantic-ui-react";
import { SignInMethodCustomization } from "./sign-in-method-customization";
import { SignInMethodLanding } from "./sign-in-method-landing";
import DefaultFlowConfigurationSequenceTemplate from "./templates/default-sequence.json";
import FacebookLoginSequenceTemplate from "./templates/facebook-login-sequence.json";
import GitHubLoginSequenceTemplate from "./templates/github-login-sequence.json";
import GoogleLoginSequenceTemplate from "./templates/google-login-sequence.json";
import MagicLinkSequenceTemplate from "./templates/magic-link-sequence.json";
import SecondFactorEMAILOTPSequenceTemplate from "./templates/second-factor-email-otp-sequence.json";
import SecondFactorTOTPSequenceTemplate from "./templates/second-factor-totp-sequence.json";
import UsernamelessSequenceTemplate from "./templates/usernameless-login-sequence.json";
import { AppConstants, EventPublisher, FeatureConfigInterface, history } from "../../../../core";
import {
    AuthenticatorCreateWizardFactory,
    AuthenticatorMeta,
    GenericAuthenticatorInterface,
    IdentityProviderManagementConstants,
    IdentityProviderManagementUtils,
    IdentityProviderTemplateInterface
} from "../../../../identity-providers";
import { ApplicationManagementConstants } from "../../../constants";
import {
    ApplicationInterface,
    AuthenticationSequenceInterface,
    AuthenticationSequenceType,
    LoginFlowTypes
} from "../../../models";
import { AdaptiveScriptUtils } from "../../../utils";

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
    * ClientID of the application.
    */
    clientId?: string;
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
        clientId,
        isLoading,
        onUpdate,
        readOnly,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const [ loginFlow, setLoginFlow ] = useState<LoginFlowTypes>(undefined);
    const [ socialDisclaimerModalType, setSocialDisclaimerModalType ] = useState<LoginFlowTypes>(undefined);
    const [ authenticators, setAuthenticators ] = useState<GenericAuthenticatorInterface[][]>(undefined);
    const [ googleAuthenticators, setGoogleAuthenticators ] = useState<GenericAuthenticatorInterface[]>(undefined);
    const [ gitHubAuthenticators, setGitHubAuthenticators ] = useState<GenericAuthenticatorInterface[]>(undefined);
    const [ facebookAuthenticators, setFacebookAuthenticators ] = useState<GenericAuthenticatorInterface[]>(undefined);
    const [ showMissingSocialAuthenticatorModal, setShowMissingSocialAuthenticatorModal ] = useState<boolean>(false);
    const [ isAuthenticatorsFetchRequestLoading, setIsAuthenticatorsFetchRequestLoading ] = useState<boolean>(true);
    const [
        showDuplicateSocialAuthenticatorSelectionModal,
        setShowDuplicateSocialAuthenticatorSelectionModal
    ] = useState<boolean>(false);
    const [
        selectedSocialAuthenticator,
        setSelectedSocialAuthenticator
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
    ] = useState<"INTERNAL" | "EXTERNAL">(undefined);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Loads federated authenticators and local authenticators on component load.
     */
    useEffect(() => {

        fetchAndCategorizeAuthenticators().finally();

        // Reset the IDs in local storage on mount.
        LocalStorageUtils.setValueInLocalStorage(
            ApplicationManagementConstants.AUTHENTICATORS_LOCAL_STORAGE_KEY,
            JSON.stringify([])
        );

    }, []);

    /**
     * If the original `authenticationSequence` changes, the moderated one should also change.
     *
     * @remarks This had to be added to fix the state issues came after the loading spinner
     * conditional rendering. Components are getting unmounted when the spinner is shown causing it to
     * re-render the component.
     */
    useEffect(() => {

        if (authenticationSequence === undefined) {
            return;
        }

        setModeratedAuthenticationSequence(authenticationSequence);
    }, [ authenticationSequence ]);

    const refreshAuthenticators = (): Promise<void> => {
        return fetchAndCategorizeAuthenticators();
    };

    /**
     * Fetches the list of Authenticators and categorize them.
     *
     * @param {(all: GenericAuthenticatorInterface[][],
     *     google: GenericAuthenticatorInterface[]) => void} onSuccess - On Success callback.
     */
    const fetchAndCategorizeAuthenticators = (onSuccess?: (all: GenericAuthenticatorInterface[][],
        google: GenericAuthenticatorInterface[],
        github: GenericAuthenticatorInterface[],
        facebook: GenericAuthenticatorInterface[]
    ) => void): Promise<void> => {

        setIsAuthenticatorsFetchRequestLoading(true);

        return IdentityProviderManagementUtils.getAllAuthenticators()
            .then((response: GenericAuthenticatorInterface[][]) => {

                const google: GenericAuthenticatorInterface[] = [];
                const gitHub: GenericAuthenticatorInterface[] = [];
                const facebook: GenericAuthenticatorInterface[] = [];

                response[1].filter((authenticator: GenericAuthenticatorInterface) => {
                    if (authenticator.defaultAuthenticator.authenticatorId
                        === IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID) {

                        google.push(authenticator);
                    } else if (authenticator.defaultAuthenticator.authenticatorId
                        === IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_ID) {

                        gitHub.push(authenticator);
                    } else if (authenticator.defaultAuthenticator.authenticatorId
                        === IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_ID) {

                        facebook.push(authenticator);
                    }
                });

                setGoogleAuthenticators(google);
                setGitHubAuthenticators(gitHub);
                setFacebookAuthenticators(facebook);
                setAuthenticators(response);

                // Trigger the onsuccess callback and send the responses to the calller.
                // Reason for this is that the invoker needs the responses ASAP,
                // but the state update takes time.
                onSuccess && onSuccess(response, google, gitHub, facebook);
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

        if (authenticationSequence?.steps?.length !== 1 || authenticationSequence.steps[0].options?.length !== 1) {
            return false;
        }

        const isBasicStep: boolean = authenticationSequence.steps[0].options[0].authenticator
            === IdentityProviderManagementConstants.BASIC_AUTHENTICATOR;
        const isBasicScript: boolean = !authenticationSequence.script
            || AdaptiveScriptUtils.isDefaultScript(authenticationSequence.script, authenticationSequence.steps?.length);

        return isBasicStep && isBasicScript && authenticationSequence.type === AuthenticationSequenceType.DEFAULT;
    };

    /**
     * Handles the login flow select action.
     *
     * @param {LoginFlowTypes} loginFlow - Selected login flow.
     * @param {GenericAuthenticatorInterface[]} googleAuthenticators -  Set of configured Google Authenticators.
     * @param {GenericAuthenticatorInterface[]} gitHubAuthenticators -  Set of configured GutHub Authenticators.
     * @param {GenericAuthenticatorInterface[]} facebookAuthenticators -  Set of configured Facebook Authenticators.
     */
    const handleLoginFlowSelect = (loginFlow: LoginFlowTypes,
        googleAuthenticators: GenericAuthenticatorInterface[],
        gitHubAuthenticators: GenericAuthenticatorInterface[],
        facebookAuthenticators: GenericAuthenticatorInterface[]): void => {

        if (!loginFlow) {
            setModeratedAuthenticationSequence(authenticationSequence);
        } else if (loginFlow === LoginFlowTypes.DEFAULT) {
            eventPublisher.publish("application-sign-in-method-click-add", {
                type: "default"
            });
            setModeratedAuthenticationSequence({
                ...authenticationSequence,
                ...cloneDeep(DefaultFlowConfigurationSequenceTemplate)
            });
        } else if (loginFlow === LoginFlowTypes.SECOND_FACTOR_TOTP) {
            eventPublisher.publish("application-sign-in-method-click-add", {
                type: "second-factor-totp"
            });
            setModeratedAuthenticationSequence({
                ...authenticationSequence,
                ...cloneDeep(SecondFactorTOTPSequenceTemplate)
            });
        } else if(loginFlow === LoginFlowTypes.SECOND_FACTOR_EMAIL_OTP){
            eventPublisher.publish("application-sign-in-method-click-add", {
                type: "second-factor-email-otp"
            });
            setModeratedAuthenticationSequence({
                ...authenticationSequence,
                ...cloneDeep(SecondFactorEMAILOTPSequenceTemplate)
            });
        }else if (loginFlow === LoginFlowTypes.FIDO_LOGIN) {
            eventPublisher.publish("application-sign-in-method-click-add", {
                type: "first-factor-fido"
            });
            setModeratedAuthenticationSequence({
                ...authenticationSequence,
                ...cloneDeep(UsernamelessSequenceTemplate)
            });
        } else if (loginFlow === LoginFlowTypes.GOOGLE_LOGIN) {
            eventPublisher.publish("application-sign-in-method-click-add", {
                type: "google-login"
            });
            setSocialDisclaimerModalType(LoginFlowTypes.GOOGLE_LOGIN);

            // If there are no IDP's with google authenticator, show missing authenticator modal.
            if (isEmpty(googleAuthenticators)) {
                setShowMissingSocialAuthenticatorModal(true);

                return;
            }

            // If there are more than 1 IDP's with google authenticator, show authenticator select modal.
            if (googleAuthenticators.length > 1) {
                // Set the first element as the selected google authenticator.
                setSelectedSocialAuthenticator(googleAuthenticators[0]);
                setShowDuplicateSocialAuthenticatorSelectionModal(true);

                return;
            }

            // If there are only 1 IDP's with google authenticator, move on.
            if (googleAuthenticators.length === 1) {
                setModeratedAuthenticationSequence({
                    ...authenticationSequence,
                    ...updateSocialLoginSequenceWithIDPName(googleAuthenticators[0].idp,
                        LoginFlowTypes.GOOGLE_LOGIN)
                });
            }
        } else if (loginFlow === LoginFlowTypes.GITHUB_LOGIN) {
            eventPublisher.publish("application-sign-in-method-click-add", {
                type: "github-login"
            });

            setSocialDisclaimerModalType(LoginFlowTypes.GITHUB_LOGIN);

            // If there are no IDP's with GitHub authenticator, show missing authenticator modal.
            if (isEmpty(gitHubAuthenticators)) {
                setShowMissingSocialAuthenticatorModal(true);

                return;
            }

            // If there are more than 1 IDP's with GitHub authenticator, show authenticator select modal.
            if (gitHubAuthenticators.length > 1) {
                // Set the first element as the selected GitHub authenticator.
                setSelectedSocialAuthenticator(gitHubAuthenticators[0]);
                setShowDuplicateSocialAuthenticatorSelectionModal(true);

                return;
            }

            // If there are only 1 IDP's with GitHub authenticator, move on.
            if (gitHubAuthenticators.length === 1) {
                setModeratedAuthenticationSequence({
                    ...authenticationSequence,
                    ...updateSocialLoginSequenceWithIDPName(gitHubAuthenticators[0].idp,
                        LoginFlowTypes.GITHUB_LOGIN)
                });
            }
        } else if (loginFlow === LoginFlowTypes.FACEBOOK_LOGIN) {
            eventPublisher.publish("application-sign-in-method-click-add", {
                type: "facebook-login"
            });

            setSocialDisclaimerModalType(LoginFlowTypes.FACEBOOK_LOGIN);

            // If there are no IDP's with Facebook authenticator, show missing authenticator modal.
            if (isEmpty(facebookAuthenticators)) {
                setShowMissingSocialAuthenticatorModal(true);

                return;
            }

            // If there are more than 1 IDP's with Facebook authenticator, show authenticator select modal.
            if (facebookAuthenticators.length > 1) {
                // Set the first element as the selected GitHub authenticator.
                setSelectedSocialAuthenticator(facebookAuthenticators[0]);
                setShowDuplicateSocialAuthenticatorSelectionModal(true);

                return;
            }

            // If there are only 1 IDP's with Facebook authenticator, move on.
            if (facebookAuthenticators.length === 1) {
                setModeratedAuthenticationSequence({
                    ...authenticationSequence,
                    ...updateSocialLoginSequenceWithIDPName(facebookAuthenticators[0].idp,
                        LoginFlowTypes.FACEBOOK_LOGIN)
                });
            }
        } else if (loginFlow === LoginFlowTypes.MAGIC_LINK) {
            eventPublisher.publish("application-sign-in-method-click-add", {
                type: "magic-link-login"
            });

            setModeratedAuthenticationSequence({
                ...authenticationSequence,
                ...cloneDeep(MagicLinkSequenceTemplate)
            });
        }

        setLoginFlow(loginFlow);
    };

    /**
     * Updates the predefined google login sequence with the desired IDP name.
     * i.e. Replaces the `<GOOGLE_IDP>`, `<FACEBOOK_IDP>` etc. in the JSON with a properly configured IDP.
     *
     * @return {AuthenticationSequenceInterface}
     */
    const updateSocialLoginSequenceWithIDPName = (idp: string,
        loginType: LoginFlowTypes): AuthenticationSequenceInterface => {

        let modifiedSequenceTemplate: AuthenticationSequenceInterface = {};
        let authenticatorType: string = null;

        if (loginType === LoginFlowTypes.GOOGLE_LOGIN) {
            modifiedSequenceTemplate = cloneDeep(GoogleLoginSequenceTemplate);
            authenticatorType = IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_NAME;
        } else if (loginType === LoginFlowTypes.GITHUB_LOGIN) {
            modifiedSequenceTemplate = cloneDeep(GitHubLoginSequenceTemplate);
            authenticatorType = IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_NAME;
        } else if (loginType === LoginFlowTypes.FACEBOOK_LOGIN) {
            modifiedSequenceTemplate = cloneDeep(FacebookLoginSequenceTemplate);
            authenticatorType = IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_NAME;
        }

        modifiedSequenceTemplate.steps[0].options.forEach((option) => {
            if (option.authenticator === authenticatorType) {
                option.idp = idp;
            }
        });

        return modifiedSequenceTemplate;
    };

    /**
     * Shows the missing google authenticator modal.
     *
     * @return {ReactElement}
     */
    const renderMissingSocialAuthenticatorModal = (): ReactElement => {

        let idpTemplateTypeToTrigger: string = null; // Which template wizard to trigger? i.e Google wizard etc.
        let authenticatorName: string = null; // Which flow triggered the flow? i.e Google, Facebook etc.

        if (socialDisclaimerModalType === LoginFlowTypes.GOOGLE_LOGIN) {
            idpTemplateTypeToTrigger = IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE;
            authenticatorName = IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_DISPLAY_NAME;
        } else if (socialDisclaimerModalType === LoginFlowTypes.GITHUB_LOGIN) {
            idpTemplateTypeToTrigger = IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GITHUB;
            authenticatorName = IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_DISPLAY_NAME;
        } else if (socialDisclaimerModalType === LoginFlowTypes.FACEBOOK_LOGIN) {
            idpTemplateTypeToTrigger = IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.FACEBOOK;
            authenticatorName = IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_DISPLAY_NAME;
        } else {
            return null;
        }

        return (
            <ConfirmationModal
                type="info"
                onClose={ () => setShowMissingSocialAuthenticatorModal(false) }
                open={ showMissingSocialAuthenticatorModal }
                primaryAction={
                    t("console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                        "flowBuilder.addMissingSocialAuthenticatorModal.primaryButton")
                }
                secondaryAction={
                    t("console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                        "flowBuilder.addMissingSocialAuthenticatorModal.secondaryButton")
                }
                onSecondaryActionClick={ () => setShowMissingSocialAuthenticatorModal(false) }
                onPrimaryActionClick={ (): void => {

                    // Trigger the IDP create wizard based on the type.
                    setIDPTemplateTypeToTrigger(idpTemplateTypeToTrigger);
                    setShowMissingSocialAuthenticatorModal(false);
                    setShowIDPCreateWizard(true);
                    // Since the wizard was triggered from landing page, set the origin as `INTERNAL`.
                    setIDPCreateWizardTriggerOrigin("INTERNAL");
                } }
                data-testid={ `${testId}-add-missing-authenticator-modal` }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header>
                    {
                        t("console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                            "flowBuilder.addMissingSocialAuthenticatorModal.heading",
                        { authenticator: authenticatorName })
                    }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message attached info>
                    {
                        t("console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                            "flowBuilder.addMissingSocialAuthenticatorModal.content.message",
                        { authenticator: authenticatorName })
                    }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    <Trans
                        i18nKey={
                            "console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                            "flowBuilder.addMissingSocialAuthenticatorModal.content.body"
                        }
                        tOptions={ { authenticator: authenticatorName } }
                    >
                        You do not have an active Social Connection configured with <Code> { authenticatorName }
                            Authenticator</Code>. Click on the <strong>Configure</strong> button to register a new
                        <Code>{ authenticatorName } Social Connection</Code> or navigate to the <a
                            onClick={ () => {
                                history.push(AppConstants.getPaths().get("IDP"));
                            } }
                            className="external-link link pointing primary"
                        >Connections</a> section manually.
                    </Trans>
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };

    /**
     * Shows a modal to select the IDP when multiple IDP's have the selected
     * social authenticator configured as default.
     *
     * @return {ReactElement}
     */
    const renderDuplicateSocialAuthenticatorSelectionModal = (): ReactElement => {

        let authenticatorName: string = null; // Which flow triggered the flow? i.e Google, Facebook etc.
        let authenticators: GenericAuthenticatorInterface[] = []; // Existing authenticators based on the selected type.

        if (socialDisclaimerModalType === LoginFlowTypes.GOOGLE_LOGIN) {
            authenticators = [ ...googleAuthenticators ];
            authenticatorName = IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_DISPLAY_NAME;
        } else if (socialDisclaimerModalType === LoginFlowTypes.GITHUB_LOGIN) {
            authenticators = [ ...gitHubAuthenticators ];
            authenticatorName = IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_DISPLAY_NAME;
        } else if (socialDisclaimerModalType === LoginFlowTypes.FACEBOOK_LOGIN) {
            authenticators = [ ...facebookAuthenticators ];
            authenticatorName = IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_DISPLAY_NAME;
        } else {
            return null;
        }

        return (
            <ConfirmationModal
                type="warning"
                className="duplicate-social-authenticator-selection-modal"
                onClose={ () => setShowDuplicateSocialAuthenticatorSelectionModal(false) }
                open={ showDuplicateSocialAuthenticatorSelectionModal }
                primaryAction={
                    t("console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                        "flowBuilder.duplicateSocialAuthenticatorSelectionModal.primaryButton")
                }
                secondaryAction={
                    t("console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                        "flowBuilder.duplicateSocialAuthenticatorSelectionModal.secondaryButton")
                }
                onSecondaryActionClick={ () => setShowDuplicateSocialAuthenticatorSelectionModal(false) }
                onPrimaryActionClick={ (): void => {
                    // Update the sequence wuth the selected IDP.
                    setModeratedAuthenticationSequence({
                        ...authenticationSequence,
                        ...updateSocialLoginSequenceWithIDPName(selectedSocialAuthenticator.idp,
                            socialDisclaimerModalType)
                    });

                    // Set the login flow so that we can show the customization page to the user.
                    setLoginFlow(socialDisclaimerModalType);
                    setShowDuplicateSocialAuthenticatorSelectionModal(false);
                } }
                data-testid={ `${testId}-duplicate-authenticator-selection-modal` }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header>
                    {
                        t("console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                            "flowBuilder.duplicateSocialAuthenticatorSelectionModal.heading",
                        { authenticator: authenticatorName })
                    }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message attached warning>
                    {
                        t("console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                            "flowBuilder.duplicateSocialAuthenticatorSelectionModal.content.message",
                        { authenticator: authenticatorName })
                    }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content scrolling>
                    <Text>
                        <Trans
                            i18nKey={
                                "console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                                "flowBuilder.duplicateSocialAuthenticatorSelectionModal.content.body"
                            }
                            tOptions={ { authenticator: authenticatorName } }
                        >
                            You have multiple Social Connections configured with <Code>{ authenticatorName }
                                Authenticator</Code>. Select the desired one from the selection below to proceed.
                        </Trans>
                    </Text>
                    <Divider hidden />
                    <div className="authenticator-grid">
                        {
                            authenticators
                                .filter((authenticator) => {
                                    authenticator.name !== IdentityProviderManagementConstants
                                        .BACKUP_CODE_AUTHENTICATOR;
                                })
                                .map((authenticator, index) => (
                                    <LabeledCard
                                        key={ index }
                                        multilineLabel
                                        className="authenticator-card"
                                        size="tiny"
                                        selected={ selectedSocialAuthenticator?.id === authenticator.id }
                                        image={ authenticator.image }
                                        label={
                                            AuthenticatorMeta.getAuthenticatorDisplayName(authenticator.name)
                                            || authenticator.displayName
                                        }
                                        labelEllipsis={ true }
                                        data-testid={
                                            `${testId}-authenticator-${authenticator.name}`
                                        }
                                        onClick={ () => setSelectedSocialAuthenticator(authenticator) }
                                    />
                                ))
                        }
                    </div>
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };

    /**
     * Resets the internal state back to default on reset.
     */
    const handleLoginFlowReset = (): void => {
        setLoginFlow(undefined);
        setSocialDisclaimerModalType(undefined);
        setShowMissingSocialAuthenticatorModal(false);
        setShowDuplicateSocialAuthenticatorSelectionModal(false);
        setSelectedSocialAuthenticator(undefined);
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
                selectedTemplate={ selectedIDPTemplate }
                onIDPCreate={ () => {
                    // When the IDP is created, we need to fetch the authenticators list again to get
                    // the new updates. On successful fetch, we need to broadcast
                    fetchAndCategorizeAuthenticators((all: GenericAuthenticatorInterface[][],
                        google: GenericAuthenticatorInterface[],
                        github: GenericAuthenticatorInterface[],
                        facebook: GenericAuthenticatorInterface[]) => {

                        // Housekeeping...Reset IDP wizard related states.
                        setIDPTemplateTypeToTrigger(undefined);
                        setShowIDPCreateWizard(false);

                        // Trigger IDP creation success message broadcasting closure.
                        broadcastIDPCreateSuccessMessage && broadcastIDPCreateSuccessMessage();

                        // If the IDP creation is triggered from the landing page, handle the relevant
                        // login flow changes so that we can navigate the user to the customizing page.
                        if (idpCreateWizardTriggerOrigin === "INTERNAL") {
                            handleLoginFlowSelect(socialDisclaimerModalType, google, github, facebook);
                        }
                    }).finally();
                } }
                onWizardClose={ () => {
                    // Housekeeping...Reset IDP wizard related states.
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
                !(isLoading || isAuthenticatorsFetchRequestLoading) ?
                    ((!readOnly && !loginFlow && isDefaultFlowConfiguration())
                        ? (
                            <SignInMethodLanding
                                readOnly={ readOnly }
                                clientId={ clientId }
                                onLoginFlowSelect={ (type: LoginFlowTypes) => {
                                    handleLoginFlowSelect(type,
                                        googleAuthenticators,
                                        gitHubAuthenticators,
                                        facebookAuthenticators);
                                } }
                                data-testid={ `${testId}-landing` }
                            />
                        ) : (
                            <>
                                <SignInMethodCustomization
                                    refreshAuthenticators={ refreshAuthenticators }
                                    appId={ appId }
                                    authenticators={ authenticators }
                                    clientId={ clientId }
                                    authenticationSequence={ moderatedAuthenticationSequence }
                                    onIDPCreateWizardTrigger={ (type: string, cb: () => void, template: any) => {
                                        setSelectedIDPTemplate(template);
                                        setIDPCreateWizardTriggerOrigin("EXTERNAL");
                                        setIDPTemplateTypeToTrigger(type);
                                        setShowMissingSocialAuthenticatorModal(false);
                                        setShowIDPCreateWizard(true);
                                        broadcastIDPCreateSuccessMessage = cb;
                                    } }
                                    onUpdate={ onUpdate }
                                    onReset={ handleLoginFlowReset }
                                    data-testid={ testId }
                                    isLoading={ isAuthenticatorsFetchRequestLoading }
                                    setIsLoading={ setIsAuthenticatorsFetchRequestLoading }
                                    readOnly={ readOnly }
                                />
                            </>
                        )
                    ) : <ContentLoader inline="centered" active />
            }
            { showIDPCreateWizard && renderIDPCreateWizard() }
            { showMissingSocialAuthenticatorModal && renderMissingSocialAuthenticatorModal() }
            { showDuplicateSocialAuthenticatorSelectionModal && renderDuplicateSocialAuthenticatorSelectionModal() }
        </EmphasizedSegment>
    );
};

/**
 * Default props for the application sign-on-methods component.
 */
SignOnMethods.defaultProps = {
    "data-testid": "sign-on-methods"
};
