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
import { EmphasizedSegment } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { SignInMethodCustomization } from "./sign-in-method-customization";
import { SignInMethodLanding } from "./sign-in-method-landing";
import DefaultFlowConfigurationSequenceTemplate from "./templates/default-sequence.json";
import GoogleLoginSequenceTemplate from "./templates/google-login-sequence.json";
import SecondFactorTOTPSequenceTemplate from "./templates/second-factor-totp-sequence.json";
import { AppState, ConfigReducerStateInterface, FeatureConfigInterface } from "../../../../core";
import { GenericAuthenticatorInterface, IdentityProviderManagementUtils } from "../../../../identity-providers";
import { IdentityProviderManagementConstants } from "../../../../identity-providers/constants";
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

    /**
     * Loads federated authenticators and local authenticators on component load.
     */
    useEffect(() => {
        IdentityProviderManagementUtils.getAllAuthenticators()
            .then((response: GenericAuthenticatorInterface[][]) => {
                    setAuthenticators(response);
                }
            );
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
     * Resolve the authentication sequence based on the login flow.
     *
     * @param {LoginFlowTypes} loginFlow - Selected login flow.
     * @param {AuthenticationSequenceInterface} defaultSequence - Default sequence.
     *
     * @return {AuthenticationSequenceInterface}
     */
    const resolveAuthenticationSequence = (loginFlow: LoginFlowTypes,
        defaultSequence: AuthenticationSequenceInterface): AuthenticationSequenceInterface => {

        if (!loginFlow) {
            return defaultSequence;
        }
        
        if (loginFlow === LoginFlowTypes.DEFAULT) {
            return {
                ...defaultSequence,
                ...DefaultFlowConfigurationSequenceTemplate
            } as AuthenticationSequenceInterface;
        }
        
        if (loginFlow === LoginFlowTypes.GOOGLE_LOGIN) {
            return {
                ...defaultSequence,
                ...GoogleLoginSequenceTemplate
            } as AuthenticationSequenceInterface;
        }
        
        if (loginFlow === LoginFlowTypes.SECOND_FACTOR_TOTP) {
            return {
                ...defaultSequence,
                ...SecondFactorTOTPSequenceTemplate
            } as AuthenticationSequenceInterface;
        }
        
        return defaultSequence;
    };

    return (
        <EmphasizedSegment className="sign-on-methods-tab-content" padded="very">
            {
                !loginFlow && isDefaultFlowConfiguration()
                    ? (
                        <SignInMethodLanding
                            isLoading={ isLoading }
                            readOnly={ readOnly }
                            onLoginFlowSelect={ (type: LoginFlowTypes) => setLoginFlow(type) }
                        />
                    )
                    : (
                        <>
                            <SignInMethodCustomization
                                appId={ appId }
                                authenticators={ authenticators }
                                authenticationSequence={
                                    resolveAuthenticationSequence(loginFlow, authenticationSequence)
                                }
                                onUpdate={ onUpdate }
                            />
                        </>
                    )
            }
        </EmphasizedSegment>
    );
};

/**
 * Default props for the application sign-on-methods component.
 */
SignOnMethods.defaultProps = {
    "data-testid": "sign-on-methods"
};
