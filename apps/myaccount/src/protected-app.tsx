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
    AuthenticatedComponent,
    BasicUserInfo,
    Hooks,
    OIDCEndpoints,
    useAuthContext
} from "@asgardeo/auth-react";
import { AppConstants as AppConstantsCore } from "@wso2is/core/constants";
import { setSignIn } from "@wso2is/core/store";
import { AuthenticateUtils, ContextUtils } from "@wso2is/core/utils";
import { ContentLoader } from "@wso2is/react-components";
import axios from "axios";
import React, { FunctionComponent, ReactElement, Suspense, lazy, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Loader } from "semantic-ui-react";
import { Config } from "./configs";
import { AppConstants, CommonConstants } from "./constants";
import { history } from "./helpers";
import { getProfileInformation, resolveIdpURLSAfterTenantResolves } from "./store/actions";
import { onHttpRequestError, onHttpRequestFinish, onHttpRequestStart, onHttpRequestSuccess } from "./utils";

const AUTHORIZATION_ENDPOINT = "authorization_endpoint";
const TOKEN_ENDPOINT = "token_endpoint";
const OIDC_SESSION_IFRAME_ENDPOINT = "oidc_session_iframe_endpoint";
const LOGOUT_URL = "sign_out_url";

const App = lazy(() => import("./app"));
export const ProtectedApp: FunctionComponent<Record<string, never>> = (): ReactElement => {
    const {
        signIn,
        trySignInSilently,
        on,
        getOIDCServiceEndpoints,
        state: { isAuthenticated, isSigningOut }
    } = useAuthContext();

    const dispatch = useDispatch();

    useEffect(() => {
        on(Hooks.HttpRequestError, onHttpRequestError);
        on(Hooks.HttpRequestFinish, onHttpRequestFinish);
        on(Hooks.HttpRequestStart, onHttpRequestStart);
        on(Hooks.HttpRequestSuccess, onHttpRequestSuccess);

        on(Hooks.SignIn, (response: BasicUserInfo) => {
            // Update the app base name with the newly resolved tenant.
            window[ "AppUtils" ].updateTenantQualifiedBaseName(response.tenantDomain);

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
                let logoutUrl = sessionStorage.getItem(LOGOUT_URL);

                // If there is a base name, replace the `post_logout_redirect_uri` with the tenanted base name.
                if (window[ "AppUtils" ].getConfig().appBase) {
                    logoutUrl = logoutUrl.replace(
                        window[ "AppUtils" ].getAppBase(),
                        window[ "AppUtils" ].getAppBaseWithTenant()
                    );
                } else {
                    logoutUrl = logoutUrl.replace(
                        window[ "AppUtils" ].getConfig().logoutCallbackURL,
                        window[ "AppUtils" ].getConfig().clientOrigin + window[ "AppUtils" ].getConfig().routes.login
                    );
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

            dispatch(
                setSignIn({
                    displayName: response.displayName,
                    display_name: response.displayName,
                    email: response.email,
                    scope: response.allowedScopes,
                    tenantDomain: response.tenantDomain,
                    username: response.username
                })
            );

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

                })
                .catch((error) => {
                    throw error;
                });

            dispatch(getProfileInformation());
        });
    }, []);

    const loginSuccessRedirect = () => {
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

        if (!isAuthenticated && !isSigningOut) {
            (async () => {
                const response = await trySignInSilently();
                if (response === false) {
                    if (process.env.NODE_ENV === "production") {
                        const contextPath: string = window[ "AppUtils" ].getConfig().appBase
                            ? `/${ window[ "AppUtils" ].getConfig().appBase }`
                            : "";

                        await axios.get(contextPath + "/auth").then((response) => {
                            signIn(null, response?.data?.authCode, response?.data?.sessionState);
                        });
                    } else {
                        await signIn();
                    }
                }
                await signIn({ callOnlyOnRedirect: true });
            })();
        }

        if (isAuthenticated) {
            if (sessionStorage.getItem("request_params") &&
                JSON.parse(sessionStorage.getItem("request_params")).clientId &&
                JSON.parse(sessionStorage.getItem("request_params")).clientId !== AppConstants.getClientID()) {

                sessionStorage.clear();
                window.location.reload();
            } else {
                loginSuccessRedirect();
            }
        }
    }, [ isAuthenticated ]);

    return (
        <AuthenticatedComponent fallback={ <ContentLoader dimmer /> }>
            <Suspense fallback={ <Loader /> }>
                <App />
            </Suspense>
        </AuthenticatedComponent>
    );
};
