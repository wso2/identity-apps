/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import {
    AUTHORIZATION_ENDPOINT,
    AuthenticatedUserInterface,
    Hooks,
    IdentityClient,
    OIDC_SESSION_IFRAME_ENDPOINT,
    ResponseMode,
    ServiceResourcesType,
    Storage,
    TOKEN_ENDPOINT,
    UserInfo,
    LOGOUT_URL
} from "@asgardio/oidc-js";
import { getProfileSchemas } from "@wso2is/core/api";
import { AppConstants, TokenConstants } from "@wso2is/core/constants";
import { AuthenticateUtils, ContextUtils } from "@wso2is/core/utils";
import { I18n } from "@wso2is/i18n";
import axios from "axios";
import _ from "lodash";
import { UAParser } from "ua-parser-js";
import { getProfileLinkedAccounts } from ".";
import { addAlert } from "./global";
import { setProfileInfoLoader, setProfileSchemaLoader } from "./loaders";
import { AuthAction, authenticateActionTypes } from "./types";
import { getProfileInfo, getUserReadOnlyStatus, switchAccount } from "../../api";
import { Config } from "../../configs";
import { CommonConstants } from "../../constants";
import {
    AlertLevels,
    BasicProfileInterface,
    LinkedAccountInterface,
    ProfileSchema,
    ReadOnlyUserStatus
} from "../../models";
import {
    getProfileCompletion,
    onHttpRequestError,
    onHttpRequestFinish,
    onHttpRequestStart,
    onHttpRequestSuccess
} from "../../utils";
import { store } from "../index";

/**
 * Dispatches an action of type `SET_SIGN_IN`.
 */
export const setSignIn = (userInfo: AuthenticatedUserInterface): AuthAction => ({
    payload: userInfo,
    type: authenticateActionTypes.SET_SIGN_IN
});

/**
 * Dispatches an action of type `SET_SIGN_OUT`.
 */
export const setSignOut = (): AuthAction => ({
    type: authenticateActionTypes.SET_SIGN_OUT
});

/**
 * Dispatches an action of type `RESET_AUTHENTICATION`.
 */
export const resetAuthentication = (): AuthAction => ({
    type: authenticateActionTypes.RESET_AUTHENTICATION
});

/**
 * Dispatches an action of type `SET_PROFILE_INFO`.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const setProfileInfo = (details: any): AuthAction => ({
    payload: details,
    type: authenticateActionTypes.SET_PROFILE_INFO
});

/**
 * Dispatches an action of type `SET_SCHEMAS`
 * @param schemas
 */
export const setScimSchemas = (schemas: ProfileSchema[]): AuthAction => ({
    payload: schemas,
    type: authenticateActionTypes.SET_SCHEMAS
});

/**
 * Dispatches an action of type `SET_INITIALIZED`
 * @param flag
 */
export const setInitialized = (flag: boolean): AuthAction => ({
    payload: flag,
    type: authenticateActionTypes.SET_INITIALIZED
});


/**
 * Get SCIM2 schemas
 */
export const getScimSchemas = (profileInfo: BasicProfileInterface = null) => (dispatch): void => {
    dispatch(setProfileSchemaLoader(true));

    getProfileSchemas()
        .then((response: ProfileSchema[]) => {
            dispatch(setProfileSchemaLoader(false));
            dispatch(setScimSchemas(response));

            if (profileInfo) {
                dispatch(getProfileCompletion(profileInfo, response));
            }
        })
        .catch(() => {
            // TODO: show error page
        });
};

/**
 *  Gets profile information by making an API call
 */
export const getProfileInformation = (updateProfileCompletion = false) => (dispatch): void => {
    let isCompletionCalculated = false;

    dispatch(setProfileInfoLoader(true));

    getUserReadOnlyStatus()
        .then((response: ReadOnlyUserStatus) => {
            // Get the profile info
            getProfileInfo()
                .then((infoResponse) => {
                    if (infoResponse.responseStatus === 200) {
                        dispatch(
                            setProfileInfo({
                                ...infoResponse,
                                isReadOnly:
                                    response["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"]
                                        ?.isReadOnlyUser
                            })
                        );

                        // If the schemas in the redux store is empty, fetch the SCIM schemas from the API.
                        if (_.isEmpty(store.getState().authenticationInformation.profileSchemas)) {
                            isCompletionCalculated = true;
                            dispatch(getScimSchemas(infoResponse));
                        }

                        // If `updateProfileCompletion` flag is enabled, update the profile completion.
                        if (updateProfileCompletion && !isCompletionCalculated) {
                            try {
                                getProfileCompletion(
                                    infoResponse,
                                    store.getState().authenticationInformation.profileSchemas
                                );
                            } catch (e) {
                                dispatch(
                                    addAlert({
                                        description: I18n.instance.t("myAccount:components.profile.notifications" +
                                            ".getProfileCompletion.genericError.description"),
                                        level: AlertLevels.ERROR,
                                        message: I18n.instance.t("myAccount:components.profile.notifications" +
                                            ".getProfileCompletion.genericError.message")
                                    })
                                );
                            }
                        }

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: I18n.instance.t(
                                "myAccount:components.profile.notifications.getProfileInfo.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: I18n.instance.t(
                                "myAccount:components.profile.notifications.getProfileInfo.genericError.message"
                            )
                        })
                    );
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.detail) {
                        dispatch(
                            addAlert({
                                description: I18n.instance.t(
                                    "myAccount:components.profile.notifications.getProfileInfo.error.description",
                                    { description: error.response.data.detail }
                                ),
                                level: AlertLevels.ERROR,
                                message: I18n.instance.t(
                                    "myAccount:components.profile.notifications.getProfileInfo.error.message"
                                )
                            })
                        );

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: I18n.instance.t(
                                "myAccount:components.profile.notifications.getProfileInfo.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: I18n.instance.t(
                                "myAccount:components.profile.notifications.getProfileInfo.genericError.message"
                            )
                        })
                    );
                })
                .finally(() => {
                    dispatch(setProfileInfoLoader(false));
                });
        })
        .catch((error) => {
            dispatch(
                addAlert({
                    description:
                        error?.description ??
                        I18n.instance.t(
                            "myAccount:components.profile.notifications.getUserReadOnlyStatus.genericError.description"
                        ),
                    level: AlertLevels.ERROR,
                    message:
                        error?.message ??
                        I18n.instance.t(
                            "myAccount:components.profile.notifications.getUserReadOnlyStatus.genericError.message"
                        )
                })
            );
        });
};

export const initializeAuthentication = () =>(dispatch)=> {

    const auth = IdentityClient.getInstance();

    const responseModeFallback: ResponseMode = process.env.NODE_ENV === "production"
        ? ResponseMode.formPost
        : ResponseMode.query;

    const storageFallback: Storage = new UAParser().getBrowser().name === "IE"
        ? Storage.SessionStorage
        : Storage.WebWorker;

    const resolveStorage = (): Storage => {
        if (window["AppUtils"].getConfig().idpConfigs?.storage) {
            if (
                window["AppUtils"].getConfig().idpConfigs?.storage === Storage.WebWorker &&
                new UAParser().getBrowser().name === "IE"
            ) {
                return Storage.SessionStorage;
            }

            return window["AppUtils"].getConfig().idpConfigs?.storage;
        }

        return storageFallback;
    };

    /**
     * By specifying the base URL, we are restricting the endpoints to which the requests could be sent.
     * So, an attacker can't obtain the token by sending a request to their endpoint. This is mandatory
     * when the storage is set to Web Worker.
     *
     * @return {string[]}
     */
    const resolveBaseUrls = (): string[] => {

        let baseUrls = window["AppUtils"].getConfig().idpConfigs?.baseUrls;
        const serverOrigin = window["AppUtils"].getConfig().serverOrigin;

        if (baseUrls) {
            // If the server origin is not specified in the overridden config, append it.
            if (!baseUrls.includes(serverOrigin)) {
                baseUrls = [ ...baseUrls, serverOrigin ];
            }

            return baseUrls;
        }

        return [ serverOrigin ];
    };

    const initialize = (response?: any): void => {
        auth.initialize({
            authorizationCode: response?.data?.authCode,
            baseUrls: resolveBaseUrls(),
            clientHost: window["AppUtils"].getConfig().clientOriginWithTenant,
            clientID: window["AppUtils"].getConfig().clientID,
            clockTolerance: window["AppUtils"].getConfig().clockTolerance,
            customParams :  {
                t : window["AppUtils"].getTenantName(true)
            },
            enablePKCE: window["AppUtils"].getConfig().idpConfigs?.enablePKCE
                ?? true,
            endpoints: {
                authorize: window["AppUtils"].getConfig().idpConfigs?.authorizeEndpointURL,
                jwks: window["AppUtils"].getConfig().idpConfigs?.jwksEndpointURL,
                logout: window["AppUtils"].getConfig().idpConfigs?.logoutEndpointURL,
                oidcSessionIFrame: window["AppUtils"].getConfig().idpConfigs?.oidcSessionIFrameEndpointURL,
                revoke: window["AppUtils"].getConfig().idpConfigs?.tokenRevocationEndpointURL,
                token: window["AppUtils"].getConfig().idpConfigs?.tokenEndpointURL,
                wellKnown: window["AppUtils"].getConfig().idpConfigs?.wellKnownEndpointURL
            },
            responseMode: window["AppUtils"].getConfig().idpConfigs?.responseMode
                ?? responseModeFallback,
            scope: window["AppUtils"].getConfig().idpConfigs?.scope
                ?? [ TokenConstants.SYSTEM_SCOPE ],
            serverOrigin: window["AppUtils"].getConfig().idpConfigs?.serverOrigin
                ?? window["AppUtils"].getConfig().idpConfigs.serverOrigin,
            sessionState: response?.data?.sessionState,
            signInRedirectURL: window["AppUtils"].getConfig().loginCallbackURL,
            signOutRedirectURL: window["AppUtils"].getConfig().loginCallbackURL,
            storage: resolveStorage()
        });

        // Register HTTP interceptor callbacks.
        auth.on(Hooks.HttpRequestError, onHttpRequestError);
        auth.on(Hooks.HttpRequestFinish, onHttpRequestFinish);
        auth.on(Hooks.HttpRequestStart, onHttpRequestStart);
        auth.on(Hooks.HttpRequestSuccess, onHttpRequestSuccess);

        dispatch(setInitialized(true));
    };

    if (process.env.NODE_ENV === "production") {
        axios.get(window[ "AppUtils" ].getAppBase() + "/auth").then((response) => {
            initialize(response);
        });
    } else {
        initialize();
    }

    auth.on(Hooks.SignIn, (response: UserInfo) => {

        // Update the app base name with the newly resolved tenant.
        window["AppUtils"].updateTenantQualifiedBaseName(response.tenantDomain);

        // Update the context with new config once the basename is changed.
        ContextUtils.setRuntimeConfig(Config.getDeploymentConfig());

        // Update post_logout_redirect_uri of logout_url with tenant qualified url
        if (sessionStorage.getItem(LOGOUT_URL)) {
            let logoutUrl = sessionStorage.getItem(LOGOUT_URL);
            logoutUrl = logoutUrl.replace(window["AppUtils"].getAppBase() , window["AppUtils"].getAppBaseWithTenant());
            sessionStorage.setItem(LOGOUT_URL, logoutUrl);
        }

        dispatch(
            setSignIn({
                displayName: response.displayName,
                // eslint-disable-next-line @typescript-eslint/camelcase
                display_name: response.displayName,
                email: response.email,
                scope: response.allowedScopes,
                tenantDomain: response.tenantDomain,
                username: response.username
            })
        );

        sessionStorage.setItem(CommonConstants.SESSION_STATE, response?.sessionState);

        auth
            .getServiceEndpoints()
            .then((response: ServiceResourcesType) => {
                sessionStorage.setItem(AUTHORIZATION_ENDPOINT, response.authorize);
                sessionStorage.setItem(OIDC_SESSION_IFRAME_ENDPOINT, response.oidcSessionIFrame);
                sessionStorage.setItem(TOKEN_ENDPOINT, response.token);

                const rpIFrame: HTMLIFrameElement = document.getElementById("rpIFrame") as HTMLIFrameElement;
                rpIFrame?.contentWindow.postMessage("loadTimer", location.origin);
            })
            .catch((error) => {
                throw error;
            });

        dispatch(getProfileInformation());
    });
};

/**
 * Handle user sign-in
 */
export const handleSignIn = () =>{
    const auth = IdentityClient.getInstance();
    auth.signIn();
};

/**
 * Handle user sign-out
 */
export const handleSignOut = () => (dispatch) => {
    const auth = IdentityClient.getInstance();
    auth
        .signOut()
        .then(() => {
            AuthenticateUtils.removeAuthenticationCallbackUrl(AppConstants.MY_ACCOUNT_APP);
            dispatch(setSignOut());
        });
};

/**
 * Handles account switching.
 *
 * @param {LinkedAccountInterface} account Info about the the account to switch to.
 *
 * @returns {(dispatch)=>void} A function that accepts dispatch as an argument.
 */
export const handleAccountSwitching = (account: LinkedAccountInterface) => (dispatch) => {
    switchAccount(account)
        .then((response) => {
            dispatch(
                setSignIn({
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    display_name: response.displayName,
                    email: response.email,
                    scope: response.allowedScopes,
                    username: response.username
                })
            );

            dispatch(getProfileInformation());
            dispatch(getProfileLinkedAccounts());
        })
        .catch((error) => {
            throw error;
        });
};
