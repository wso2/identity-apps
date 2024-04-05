/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { v4 as uuidv4 } from "uuid";
import { AuthenticationSequenceInterface } from "../../admin.applications.v1/models/application";
import useAuthenticationFlow from "../../admin.authentication-flow-builder.v1/hooks/use-authentication-flow";
import fetchUserClaims from "../api/fetch-user-claims";
import generateAILoginFlow from "../api/generate-ai-loginflow";
import LoginFLowBanner from "../components/login-flow-banners";
import LoadingScreen from "../components/login-flow-loading-screen";
import AILoginFlowContext from "../context/login-flow-context";
import getLoginFLow from "../hooks/get-login-flow";
import { BannerState } from "../models/banner-state";
import { ClaimURIs } from "../models/claim-uris";

export type AILoginFlowProviderProps = unknown;

/**
 * Provider for the sign on methods context.
 *
 * @param props - Props for the client.
 * @returns Sign On Mehtods provider.
 */

const AILoginFlowProvider =(props: React.PropsWithChildren<AILoginFlowProviderProps>): React.ReactElement=>{

    const { children } = props;

    const { t } = useTranslation();
    /**
     * Get the disbles features for application.
     */
    const disabledFeatures: string[] = window["AppUtils"]?.getConfig()?.ui?.features?.applications?.disabledFeatures;

    /**
     * State to hold the login flow banner state.
     */
    const [ bannerState, setBannerState ] = useState<BannerState>(BannerState.Full);
    /**
     * State to hold the generated login flow.
     */
    const [ aiGeneratedAiLoginFlow, setAiGeneratedAiLoginFlow ] = useState<AuthenticationSequenceInterface>(undefined);
    /**
     * State to hold whether the AI login flow generation is requested.
     */
    const [ isAiLoginFlowGenerationRequested, setIsAiLoginFlowGenerationRequested ] = useState<boolean>(false);
    /**
     * State to hold the trace id.
     */
    const [ traceId, setTraceId ] = useState<string>("");

    /**
     * Dispatch to add an alert.
      */
    const dispatch: Dispatch = useDispatch();

    /**
    * Hook to fetch the recent application status.
    */
    const { refetchApplication } = useAuthenticationFlow();

    /**
     * Callback fucntion to handle the 'Generate' button click in login-flow-banner component.
     */
    const handleGenerateButtonClick = (userInput:string) => {
        /**
        * Trigger the callback function passed from the parent component.
        * Initialize the traceId.
        * Triger loading screen component rendering.
        */
        setIsAiLoginFlowGenerationRequested(true);
        setTraceId(uuidv4());

        //temporary authenticator details
        // Need to add authenitcator details fetching logic to fetch-user-authenticators.ts
        const available_authenticators: { authenticator: string; idp: string }[] = [
            { "authenticator": "BasicAuthenticator", "idp": "LOCAL" },
            { "authenticator" : "GoogleAuthenticator", "idp": "google123" },
            { "authenticator":"email-otp-authenticator", "idp" : "LOCAL" },
            { "authenticator": "totp", "idp": "LOCAL" },
            { "authenticator" : "FIDOAuthenticator","idp" : "abcxyz" },
            { "authenticator" : "MagicLinkAuthenticator","idp" : "LOCAL" }
        ];

        /**
        * Fetching user claims
        */
        fetchUserClaims()
            .then((response:{claimURIs: ClaimURIs[]; error: IdentityAppsApiException;}) => {
                if (response.error) {
                    dispatch(addAlert(
                        {
                            description: response.error?.response?.data?.description ||
                            t("console:manage.features.claims.local.notifications.getClaims.genericError.description"),
                            level: AlertLevels.ERROR,
                            message: response.error?.response?.data?.message ||
                            t("console:manage.features.claims.local.notifications.getClaims.genericError.message")
                        }
                    ));

                    return ({ error: response.error, isError: true, loginFlow: null });
                } else {
                    /**
                    * API call to generate AI login flow.
                    */
                    return generateAILoginFlow(userInput, response.claimURIs, available_authenticators, traceId);
                }
            })
            .then((response:{loginFlow:any; isError:boolean; error:any}) => {
                if (response.isError) {
                    dispatch(
                        addAlert({
                            description: response.error.data.detail,
                            level: AlertLevels.ERROR,
                            message: "Error"
                        })
                    );
                    () => refetchApplication();
                }else{
                    setAiGeneratedAiLoginFlow(getLoginFLow(response.loginFlow));
                }
            })
            .catch((error:any) => {
                dispatch(
                    addAlert({
                        description: error?.response?.data?.detail,
                        level: AlertLevels.ERROR,
                        message: "Error"
                    })
                );
                () => refetchApplication();
            })
            .finally(() => {
                setBannerState(BannerState.Collapsed);
                setIsAiLoginFlowGenerationRequested(false);
            });




    };

    return (
        <AILoginFlowContext.Provider
            value={ {
                aiGeneratedAiLoginFlow: aiGeneratedAiLoginFlow,
                bannerState: bannerState,
                setBannerState: setBannerState
            } }>
            { !isAiLoginFlowGenerationRequested &&
            (<>
                { !disabledFeatures?.includes("loginFlowAI") &&
                    <LoginFLowBanner onGenerateClick={ handleGenerateButtonClick } />
                }
                { children }
            </>)

            }
            { isAiLoginFlowGenerationRequested &&
            <LoadingScreen traceId={ traceId } /> }

        </AILoginFlowContext.Provider>
    );
};

export default AILoginFlowProvider;
