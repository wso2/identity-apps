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

import {
    AuthenticatedUserInfo,
    BasicUserInfo,
    Hooks,
    OIDCEndpoints,
    SecureApp,
    useAuthContext
} from "@asgardeo/auth-react";
import { AppConstants as AppConstantsCore, CommonConstants as CommonConstantsCore } from "@wso2is/core/constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    setDeploymentConfigs,
    setI18nConfigs,
    setServiceResourceEndpoints,
    setSignIn,
    setSupportedI18nLanguages,
    setUIConfigs
} from "@wso2is/core/store";
import { AuthenticateUtils, ContextUtils, StringUtils } from "@wso2is/core/utils";
import {
    I18n,
    I18nInstanceInitException,
    I18nModuleConstants,
    I18nModuleOptionsInterface,
    LanguageChangeException,
    isLanguageSupported
} from "@wso2is/i18n";
import axios from "axios";
import React, { FunctionComponent, ReactElement, lazy, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { useDispatch } from "react-redux";
import { PreLoader } from "./components";
import { Config } from "./configs";
import { AppConstants, CommonConstants } from "./constants";
import { history } from "./helpers";
import { DeploymentConfigInterface, ServiceResourceEndpointsInterface, UIConfigInterface } from "./models";
import { store } from "./store";
import { getProfileInformation, resolveIdpURLSAfterTenantResolves } from "./store/actions";
import { onHttpRequestError, onHttpRequestFinish, onHttpRequestStart, onHttpRequestSuccess } from "./utils";

const AUTHORIZATION_ENDPOINT = "authorization_endpoint";
const TOKEN_ENDPOINT = "token_endpoint";
const OIDC_SESSION_IFRAME_ENDPOINT = "oidc_session_iframe_endpoint";
const LOGOUT_URL = "sign_out_url";

const App = lazy(() => import("./app"));

type AppPropsInterface = IdentifiableComponentInterface;

/**
 * This component warps the `App` component with the `SecureApp` component to provide automatic authentication.
 *
 * @returns {ReactElement} ProtectedApp component
 */
export const ProtectedApp: FunctionComponent<AppPropsInterface> = (): ReactElement => {
    const {
        on,
        getOIDCServiceEndpoints,
        getDecodedIDToken,
        updateConfig,
        signIn,
        state: { isAuthenticated }
    } = useAuthContext();

    const dispatch = useDispatch();

    useEffect(() => {
        on(Hooks.HttpRequestError, onHttpRequestError);
        on(Hooks.HttpRequestFinish, onHttpRequestFinish);
        on(Hooks.HttpRequestStart, onHttpRequestStart);
        on(Hooks.HttpRequestSuccess, onHttpRequestSuccess);

        on(Hooks.SignIn, (response: BasicUserInfo) => {
            let logoutUrl;
            let logoutRedirectUrl;

            const event = new Event(CommonConstantsCore.AUTHENTICATION_SUCCESSFUL_EVENT);

            dispatchEvent(event);

            const tenantDomain = AuthenticateUtils.deriveTenantDomainFromSubject(response.sub);

            // Update the app base name with the newly resolved tenant.
            window[ "AppUtils" ].updateTenantQualifiedBaseName(tenantDomain);

            dispatch(setDeploymentConfigs<DeploymentConfigInterface>(Config.getDeploymentConfig()));
            dispatch(
                setServiceResourceEndpoints<ServiceResourceEndpointsInterface>(Config.getServiceResourceEndpoints())
            );
            dispatch(setI18nConfigs<I18nModuleOptionsInterface>(Config.getI18nConfig()));
            dispatch(setUIConfigs<UIConfigInterface>(Config.getUIConfig()));

            // When the tenant domain changes, we have to reset the auth callback in session storage.
            // If not, it will hang and the app will be unresponsive with in the tab.
            // We can skip clearing the callback for super tenant since we do not put it in the path.
            if (response.tenantDomain !== AppConstants.getSuperTenant()) {
                // If the auth callback already has the logged in tenant's path, we can skip the reset.
                if (
                    !AuthenticateUtils.isValidAuthenticationCallbackUrl(
                        AppConstantsCore.CONSOLE_APP,
                        AppConstants.getTenantPath()
                    )
                ) {
                    AuthenticateUtils.removeAuthenticationCallbackUrl(AppConstantsCore.CONSOLE_APP);
                }
            }

            // Update the context with new config once the basename is changed.
            ContextUtils.setRuntimeConfig(Config.getDeploymentConfig());

            // Update post_logout_redirect_uri of logout_url with tenant qualified url
            if (sessionStorage.getItem(LOGOUT_URL)) {
                logoutUrl = sessionStorage.getItem(LOGOUT_URL);

                // If there is a base name, replace the `post_logout_redirect_uri` with the tenanted base name.
                if (window[ "AppUtils" ].getConfig().appBase) {
                    logoutUrl = logoutUrl.replace(
                        window[ "AppUtils" ].getAppBase(),
                        window[ "AppUtils" ].getAppBaseWithTenant()
                    );
                    logoutRedirectUrl = window[ "AppUtils" ]
                        .getConfig()
                        .logoutCallbackURL.replace(
                            window[ "AppUtils" ].getAppBase(),
                            window[ "AppUtils" ].getAppBaseWithTenant()
                        );
                } else {
                    logoutUrl = logoutUrl.replace(
                        window[ "AppUtils" ].getConfig().logoutCallbackURL,
                        window[ "AppUtils" ].getConfig().clientOrigin + window[ "AppUtils" ].getConfig().routes.login
                    );
                    logoutRedirectUrl =
                        window[ "AppUtils" ].getConfig().clientOrigin + window[ "AppUtils" ].getConfig().routes.login;
                }

                // If an override URL is defined in config, use that instead.
                if (window[ "AppUtils" ].getConfig().idpConfigs?.logoutEndpointURL) {
                    logoutUrl = resolveIdpURLSAfterTenantResolves(
                        logoutUrl,
                        window[ "AppUtils" ].getConfig().idpConfigs.logoutEndpointURL
                    );
                }

                // If super tenant proxy is configured, logout url is updated with the configured super tenant proxy.
                if (window[ "AppUtils" ].getConfig().superTenantProxy) {
                    logoutUrl = logoutUrl.replace(
                        window[ "AppUtils" ].getConfig().superTenant,
                        window[ "AppUtils" ].getConfig().superTenantProxy
                    );
                }

                sessionStorage.setItem(LOGOUT_URL, logoutUrl);
            }

            getDecodedIDToken()
                .then((idToken) => {
                    const subParts = idToken.sub.split("@");
                    const tenantDomain = subParts[ subParts.length - 1 ];
                    const username = idToken.sub;

                    dispatch(
                        setSignIn<AuthenticatedUserInfo>({
                            displayName: response.displayName,
                            display_name: response.displayName,
                            email: response.email,
                            scope: response.allowedScopes,
                            tenantDomain: response.tenantDomain ?? tenantDomain,
                            username: username
                        })
                    );
                })
                .catch((error) => {
                    throw error;
                });

            sessionStorage.setItem(CommonConstants.SESSION_STATE, response?.sessionState);

            getOIDCServiceEndpoints()
                .then((response: OIDCEndpoints) => {
                    let authorizationEndpoint: string = response.authorizationEndpoint;
                    let oidcSessionIframeEndpoint: string = response.checkSessionIframe;
                    let tokenEndpoint: string = response.tokenEndpoint;

                    // If `authorize` endpoint is overridden, save that in the session.
                    if (window[ "AppUtils" ].getConfig().idpConfigs?.authorizeEndpointURL) {
                        authorizationEndpoint = resolveIdpURLSAfterTenantResolves(
                            authorizationEndpoint,
                            window[ "AppUtils" ].getConfig().idpConfigs.authorizeEndpointURL
                        );
                    }

                    // If super tenant proxy is configured, `authorize` endpoint is updated with the configured
                    // super tenant proxy.
                    if (window[ "AppUtils" ].getConfig().superTenantProxy) {
                        authorizationEndpoint = authorizationEndpoint.replace(
                            window[ "AppUtils" ].getConfig().superTenant,
                            window[ "AppUtils" ].getConfig().superTenantProxy
                        );
                    }

                    // If `oidc session iframe` endpoint is overridden, save that in the session.
                    if (window[ "AppUtils" ].getConfig().idpConfigs?.oidcSessionIFrameEndpointURL) {
                        oidcSessionIframeEndpoint = resolveIdpURLSAfterTenantResolves(
                            oidcSessionIframeEndpoint,
                            window[ "AppUtils" ].getConfig().idpConfigs.oidcSessionIFrameEndpointURL
                        );
                    }

                    // If `token` endpoint is overridden, save that in the session.
                    if (window[ "AppUtils" ].getConfig().idpConfigs?.tokenEndpointURL) {
                        tokenEndpoint = resolveIdpURLSAfterTenantResolves(
                            tokenEndpoint,
                            window[ "AppUtils" ].getConfig().idpConfigs.tokenEndpointURL
                        );
                    }

                    sessionStorage.setItem(AUTHORIZATION_ENDPOINT, authorizationEndpoint);
                    sessionStorage.setItem(OIDC_SESSION_IFRAME_ENDPOINT, oidcSessionIframeEndpoint);
                    sessionStorage.setItem(TOKEN_ENDPOINT, tokenEndpoint);

                    updateConfig({
                        endpoints: {
                            authorizationEndpoint: authorizationEndpoint,
                            checkSessionIframe: oidcSessionIframeEndpoint,
                            endSessionEndpoint: logoutUrl.split("?")[ 0 ],
                            tokenEndpoint: tokenEndpoint
                        },
                        signOutRedirectURL: logoutRedirectUrl
                    });
                })
                .catch((error) => {
                    throw error;
                });

            dispatch(getProfileInformation());
        });
    }, []);

    const loginSuccessRedirect = (): void => {
        const AuthenticationCallbackUrl = AuthenticateUtils.getAuthenticationCallbackUrl(
            AppConstantsCore.MY_ACCOUNT_APP
        );

        const location =
            !AuthenticationCallbackUrl || AuthenticationCallbackUrl === AppConstants.getAppLoginPath()
                ? AppConstants.getAppHomePath()
                : AuthenticationCallbackUrl;

        history.push(location);
    };

    useEffect(() => {
        const error = new URLSearchParams(location.search).get("error_description");
        if (error === AppConstants.USER_DENIED_CONSENT) {
            // TODO: Send it to an error page

            return;
        }

        if (isAuthenticated) {
            if (
                sessionStorage.getItem("request_params") &&
                JSON.parse(sessionStorage.getItem("request_params")).clientId &&
                JSON.parse(sessionStorage.getItem("request_params")).clientId !== AppConstants.getClientID()
            ) {
                sessionStorage.clear();
                window.location.reload();
            }
        }
    }, [ isAuthenticated ]);

    /**
     * Load localization files.
     */
    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        // If `appBaseNameWithoutTenant` is "", avoids adding a forward slash.
        const resolvedAppBaseNameWithoutTenant: string = StringUtils.removeSlashesFromPath(
            Config.getDeploymentConfig().appBaseNameWithoutTenant
        )
            ? `/${ StringUtils.removeSlashesFromPath(Config.getDeploymentConfig().appBaseNameWithoutTenant) }`
            : "";

        const metaFileNames = I18nModuleConstants.META_FILENAME.split(".");
        const metaFileName = `${ metaFileNames[ 0 ] }.${ process.env.metaHash }.${ metaFileNames[ 1 ] }`;

        // Since the portals are not deployed per tenant, looking for static resources in tenant qualified URLs
        // will fail. This constructs the path without the tenant, therefore it'll look for the file in
        // `https://localhost:9443/<PORTAL>/resources/i18n/meta.json` rather than looking for the file in
        // `https://localhost:9443/t/wso2.com/<PORTAL>/resources/i18n/meta.json`.
        const metaPath = `${ resolvedAppBaseNameWithoutTenant }/${ StringUtils.removeSlashesFromPath(
            Config.getI18nConfig().resourcePath
        ) }/${ metaFileName }`;

        // Fetch the meta file to get the supported languages.
        axios
            .get(metaPath)
            .then((response) => {
                // Set up the i18n module.
                I18n.init(
                    {
                        ...Config.getI18nConfig(response?.data)?.initOptions,
                        debug: window[ "AppUtils" ].getConfig().debug
                    },
                    Config.getI18nConfig()?.overrideOptions,
                    Config.getI18nConfig()?.langAutoDetectEnabled,
                    Config.getI18nConfig()?.xhrBackendPluginEnabled
                ).then(() => {
                    // Set the supported languages in redux store.
                    store.dispatch(setSupportedI18nLanguages(response?.data));

                    const isSupported = isLanguageSupported(I18n.instance.language, null, response?.data);

                    if (!isSupported) {
                        I18n.instance.changeLanguage(I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE).catch((error) => {
                            throw new LanguageChangeException(I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE, error);
                        });
                    }
                });
            })
            .catch((error) => {
                throw new I18nInstanceInitException(error);
            });
    }, [ isAuthenticated ]);

    return (
        <SecureApp
            fallback={ <PreLoader /> }
            onSignIn={ loginSuccessRedirect }
            overrideSignIn={ async () => {
                // This is to prompt the SSO page if a user tries to sign in
                // through a federated IdP using an existing email address.
                if (new URL(location.href).searchParams.get("prompt")) {
                    await signIn({ prompt: "login" });
                } else {
                    await signIn();
                }
            } }
        >
            <I18nextProvider i18n={ I18n.instance }>
                <App />
            </I18nextProvider>
        </SecureApp>
    );
};
