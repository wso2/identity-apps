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
import { getProfileInfo, getProfileSchemas } from "@wso2is/core/api";
import { AppConstants, TokenConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertInterface, AlertLevels, ProfileInfoInterface, ProfileSchemaInterface } from "@wso2is/core/models";
import {
    addAlert,
    setInitialized,
    setProfileInfo,
    setProfileInfoRequestLoadingStatus,
    setProfileSchemaRequestLoadingStatus,
    setSCIMSchemas,
    setSignIn,
    setSignOut
} from "@wso2is/core/store";
import { AuthenticateUtils, ContextUtils } from "@wso2is/core/utils";
import { I18n } from "@wso2is/i18n";
import axios from "axios";
import _ from "lodash";
import { UAParser } from "ua-parser-js";
import { Config } from "../../../core/configs";
import { CommonConstants } from "../../../core/constants";
import { store } from "../../../core/store";
import { HttpUtils } from "../../../core/utils";

/**
 *  Gets profile information by making an API call
 */
export const getProfileInformation = (
    meEndpoint: string = Config.getServiceResourceEndpoints().me,
    clientOrigin: string = window["AppUtils"].getConfig().clientOriginWithTenant
) => (dispatch): void => {

    dispatch(setProfileInfoRequestLoadingStatus(true));

    // Get the profile info.
    // TODO: Add the function to handle SCIM disabled error.
    getProfileInfo(meEndpoint, clientOrigin, null)
        .then((infoResponse: ProfileInfoInterface) => {
            if (infoResponse.responseStatus !== 200) {
                dispatch(
                    addAlert({
                        description: I18n.instance.t(
                            "console:manage.notifications.getProfileInfo.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("console:manage.notifications.getProfileInfo.genericError.message")
                    })
                );

                return;
            }

            dispatch(setProfileInfo<ProfileInfoInterface>(infoResponse));

            // If the schemas in the redux store is empty, fetch the SCIM schemas from the API.
            if (_.isEmpty(store.getState().profile.profileSchemas)) {
                dispatch(setProfileSchemaRequestLoadingStatus(true));

                getProfileSchemas()
                    .then((response: ProfileSchemaInterface[]) => {
                        dispatch(setSCIMSchemas<ProfileSchemaInterface[]>(response));
                    })
                    .catch((error: IdentityAppsApiException) => {
                        if (error?.response?.data?.description) {
                            dispatch(
                                addAlert<AlertInterface>({
                                    description: error.response.data.description,
                                    level: AlertLevels.ERROR,
                                    message: I18n.instance.t("console:manage.notifications.getProfileSchema." + 
                                        "error.message")
                                })
                            );
                        }

                        dispatch(
                            addAlert<AlertInterface>({
                                description: I18n.instance.t(
                                    "console:manage.notifications.getProfileSchema.genericError.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: I18n.instance.t(
                                    "console:manage.notifications.getProfileSchema.genericError.message"
                                )
                            })
                        );
                    })
                    .finally(() => {
                        dispatch(setProfileSchemaRequestLoadingStatus(false));
                    });
            }

            return;
        })
        .catch((error: IdentityAppsApiException) => {
            if (error.response && error.response.data && error.response.data.detail) {
                dispatch(
                    addAlert({
                        description: I18n.instance.t("console:manage.notifications.getProfileInfo.error.description", {
                            description: error.response.data.detail
                        }),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("console:manage.notifications.getProfileInfo.error.message")
                    })
                );

                return;
            }

            dispatch(
                addAlert({
                    description: I18n.instance.t("console:manage.notifications.getProfileInfo.genericError." + 
                        "description"),
                    level: AlertLevels.ERROR,
                    message: I18n.instance.t("console:manage.notifications.getProfileInfo.genericError.message")
                })
            );
        })
        .finally(() => {
            dispatch(setProfileInfoRequestLoadingStatus(false));
        });
};

export const initializeAuthentication = () => (dispatch) => {

    const auth = IdentityClient.getInstance();

    const responseModeFallback: ResponseMode = process.env.NODE_ENV === "production"
        ? ResponseMode.formPost
        : ResponseMode.query;

    const storageFallback: Storage = new UAParser().getBrowser().name === "IE"
        ? Storage.SessionStorage
        : Storage.WebWorker;

    const resolveStorage = (): Storage => {
        if (window[ "AppUtils" ].getConfig().idpConfigs?.storage) {
            if (window[ "AppUtils" ].getConfig().idpConfigs?.storage === Storage.WebWorker
                && new UAParser().getBrowser().name === "IE") {
                return Storage.SessionStorage;
            }

            return window[ "AppUtils" ].getConfig().idpConfigs?.storage;
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
        auth.on(Hooks.HttpRequestError, HttpUtils.onHttpRequestError);
        auth.on(Hooks.HttpRequestFinish, HttpUtils.onHttpRequestFinish);
        auth.on(Hooks.HttpRequestStart, HttpUtils.onHttpRequestStart);
        auth.on(Hooks.HttpRequestSuccess, HttpUtils.onHttpRequestSuccess);

        dispatch(setInitialized(true));
    };

    if (process.env.NODE_ENV === "production") {
        axios.get(window["AppUtils"].getAppBase() + "/auth").then((response) => {
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
            setSignIn<AuthenticatedUserInterface>({
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

        auth.getServiceEndpoints()
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

        dispatch(getProfileInformation(Config.getServiceResourceEndpoints().me,
            window[ "AppUtils" ].getConfig().clientOriginWithTenant));
    });
};

/**
 * Handle user sign-in
 */
export const handleSignIn = () => {
    const auth = IdentityClient.getInstance();
    auth.signIn();
};

/**
 * Handle user sign-out
 */
export const handleSignOut = () => (dispatch) => {
    const auth = IdentityClient.getInstance();
    auth.signOut()
        .then(() => {
            AuthenticateUtils.removeAuthenticationCallbackUrl(AppConstants.CONSOLE_APP);
            dispatch(setSignOut());
        });
};
