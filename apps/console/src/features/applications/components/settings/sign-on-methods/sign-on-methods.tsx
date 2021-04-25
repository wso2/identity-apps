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
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "semantic-ui-react";
import { SignInMethodCustomization } from "./sign-in-method-customization";
import { SignInMethodLanding } from "./sign-in-method-landing";
import DefaultFlowConfigurationSequenceTemplate from "./templates/default-sequence.json";
import GoogleLoginSequenceTemplate from "./templates/google-login-sequence.json";
import SecondFactorTOTPSequenceTemplate from "./templates/second-factor-totp-sequence.json";
import {
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    FeatureConfigInterface,
    history
} from "../../../../core";
import { GenericAuthenticatorInterface, IdentityProviderManagementUtils } from "../../../../identity-providers";
import { IdentityProviderManagementConstants } from "../../../../identity-providers/constants";
import { ApplicationManagementConstants } from "../../../constants";
import { AuthenticationSequenceInterface, LoginFlowTypes } from "../../../models";
import { AdaptiveScriptUtils } from "../../../utils";

/**
 * Proptypes for the sign on methods component.
 */
interface SignOnMethodsPropsInterface extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
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
        featureConfig,
        isLoading,
        onUpdate,
        readOnly,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    const [ loginFlow, setLoginFlow ] = useState<LoginFlowTypes>(undefined);
    const [ authenticators, setAuthenticators ] = useState<GenericAuthenticatorInterface[][]>(undefined);
    const [ googleAuthenticators, setGoogleAuthenticators ] = useState<GenericAuthenticatorInterface[]>(undefined);
    const [ showMissingGoogleAuthenticatorModal, setShowMissingGoogleAuthenticatorModal ] = useState<boolean>(false);
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

    /**
     * Loads federated authenticators and local authenticators on component load.
     */
    useEffect(() => {
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
            });
    }, []);

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
     */
    const handleLoginFlowSelect = (loginFlow: LoginFlowTypes): void => {

        if (!loginFlow) {
            setModeratedAuthenticationSequence(authenticationSequence);
        } else if (loginFlow === LoginFlowTypes.DEFAULT) {
            setModeratedAuthenticationSequence({
                ...authenticationSequence,
                ...DefaultFlowConfigurationSequenceTemplate
            });
        } else if (loginFlow === LoginFlowTypes.SECOND_FACTOR_TOTP) {
            setModeratedAuthenticationSequence({
                ...authenticationSequence,
                ...SecondFactorTOTPSequenceTemplate
            });
        } else if (loginFlow === LoginFlowTypes.GOOGLE_LOGIN) {
            // If there are no IDP's with google authenticator, show missing authenticator modal.
           if (isEmpty(googleAuthenticators)) {
               setShowMissingGoogleAuthenticatorModal(true);
               
               return;
           }

            // If there are more than 1 IDP's with google authenticator, show authenticator select modal.
           if (googleAuthenticators.length > 1) {
               setShowDuplicateGoogleAuthenticatorSelectionModal(true);
               
               return;
           }

            // If there are only 1 IDP's with google authenticator, move on.
           if (googleAuthenticators.length === 1) {
               const modifiedGoogleLoginSequenceTemplate = { ...GoogleLoginSequenceTemplate };
               modifiedGoogleLoginSequenceTemplate.steps[0].options[0].idp = googleAuthenticators[0].idp;

               setModeratedAuthenticationSequence({
                   ...authenticationSequence,
                   ...modifiedGoogleLoginSequenceTemplate
               });
           }
        }

        setLoginFlow(loginFlow);
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
                history.push({
                    pathname: AppConstants.getPaths().get("IDP_TEMPLATES"),
                    search: `?${
                        IdentityProviderManagementConstants.IDP_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY }=${
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE
                        }`
                });
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
                    You do not have an Identity Provider configured with <Code>Google Authenticator</Code>. 
                    Click on the <strong>Configure</strong> button to initiate the configuration process or 
                    navigate to the <Code>Identity Providers</Code> section to manually configure.
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
                
                const modifiedGoogleLoginSequenceTemplate = { ...GoogleLoginSequenceTemplate };
                modifiedGoogleLoginSequenceTemplate.steps[0].options[0].idp = selectedGoogleAuthenticator.idp;

                setModeratedAuthenticationSequence({
                    ...authenticationSequence,
                    ...modifiedGoogleLoginSequenceTemplate
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
            <ConfirmationModal.Message attached info>
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
                                    ApplicationManagementConstants
                                        .AUTHENTICATOR_DISPLAY_NAMES.get(authenticator.name)
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

    return (
        <EmphasizedSegment className="sign-on-methods-tab-content" padded="very">
            {
                !loginFlow && isDefaultFlowConfiguration()
                    ? (
                        <SignInMethodLanding
                            isLoading={ isLoading }
                            readOnly={ readOnly }
                            onLoginFlowSelect={ handleLoginFlowSelect }
                        />
                    )
                    : (
                        <>
                            <SignInMethodCustomization
                                appId={ appId }
                                authenticators={ authenticators }
                                authenticationSequence={ moderatedAuthenticationSequence }
                                onUpdate={ onUpdate }
                            />
                        </>
                    )
            }
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
