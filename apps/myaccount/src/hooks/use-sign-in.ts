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

import {
    AsgardeoAuthException,
    AuthenticatedUserInfo,
    BasicUserInfo,
    DecodedIDTokenPayload,
    OIDCEndpoints,
    useAuthContext
} from "@asgardeo/auth-react";
import { OrganizationType } from "@wso2is/common";
import { AppConstants as AppConstantsCore, CommonConstants as CommonConstantsCore } from "@wso2is/core/constants";
import {
    setDeploymentConfigs,
    setI18nConfigs,
    setServiceResourceEndpoints,
    setSignIn,
    setUIConfigs
} from "@wso2is/core/store";
import { AuthenticateUtils, ContextUtils } from "@wso2is/core/utils";
import { I18nModuleOptionsInterface } from "@wso2is/i18n";
import { useDispatch } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import useAuthorization from "./use-authorization";
import useOrganizations from "./use-organizations";
import { Config } from "../configs/app";
import { AppConstants } from "../constants/app-constants";
import { CommonConstants } from "../constants/common-constants";
import { DeploymentConfigInterface, ServiceResourceEndpointsInterface, UIConfigInterface } from "../models/app-config";
import { getProfileInformation, resolveIdpURLSAfterTenantResolves } from "../store/actions/authenticate";
import { setOrganizationType, setUserOrganizationId } from "../store/actions/organization";

const AUTHORIZATION_ENDPOINT: string = "authorization_endpoint";
const TOKEN_ENDPOINT: string = "token_endpoint";
const OIDC_SESSION_IFRAME_ENDPOINT: string = "oidc_session_iframe_endpoint";
const LOGOUT_URL: string = "sign_out_url";

/**
 * Props interface of {@link useSignIn}
 */
export interface UseSignInInterface {
    /**
     * Handles the sign-in process.
     * @param response - The basic user information returned from the sign-in process.
     * @returns A promise.
     */
    onSignIn: (response: BasicUserInfo) => Promise<void>;
}

/**
 * Hook that provides access to the Organizations context.
 *
 * @returns An object containing the current Organizations context.
 */
const useSignIn = (): UseSignInInterface => {
    const dispatch: Dispatch = useDispatch();

    const { getDecodedIDToken, getOIDCServiceEndpoints, updateConfig } = useAuthContext();

    const { legacyAuthzRuntime } = useAuthorization();

    const {
        transformTenantDomain,
        setUserOrgInLocalStorage,
        setOrgIdInLocalStorage,
        getUserOrgInLocalStorage,
        removeOrgIdInLocalStorage,
        removeUserOrgInLocalStorage
    } = useOrganizations();

    /**
     * Handles the sign-in process.
     *
     * @example
     * ```
     * const { onSignIn } = useSignIn();
     * ```
     * @param response - The basic user information returned from the sign-in process.
     * @throws Will throw an error if the new onSignIn method is not implemented.
     */
    const onSignIn = async (response: BasicUserInfo): Promise<void> => {
        if (legacyAuthzRuntime) {
            legacyOnSignIn(response);

            return;
        }

        _onSignIn(response);
    };

    /**
     * Handles the sign-in process for the new authorization server.
     * @param response - The basic user information returned from the sign-in process.
     */
    const _onSignIn = async (response: BasicUserInfo): Promise<void> => {
        const idToken: DecodedIDTokenPayload = await getDecodedIDToken();
        const event: Event = new Event(CommonConstantsCore.AUTHENTICATION_SUCCESSFUL_EVENT);

        dispatchEvent(event);

        const tenantDomain: string = transformTenantDomain(
            AuthenticateUtils.deriveTenantDomainFromSubject(response.sub)
        );
        const isFirstLevelOrg: boolean = !idToken.user_org
                || idToken.org_name === tenantDomain
                || ((idToken.user_org === idToken.org_id) && idToken.org_name === tenantDomain);
        const userOrganizationId: string = idToken.user_org;

        // Update the organization name with the newly resolved org.
        if (!isFirstLevelOrg) {
            window["AppUtils"].updateOrganizationName(idToken.org_id);
        } else {
            // Update the app base name with the newly resolved tenant.
            window[ "AppUtils" ].updateTenantQualifiedBaseName(tenantDomain);
        }

        let orgType: OrganizationType;

        if (isFirstLevelOrg && tenantDomain === AppConstants.getSuperTenant()) {
            orgType = OrganizationType.SUPER_ORGANIZATION;
        } else if (isFirstLevelOrg) {
            orgType = OrganizationType.FIRST_LEVEL_ORGANIZATION;
        } else {
            orgType = OrganizationType.SUBORGANIZATION;
        }
        dispatch(setOrganizationType(orgType));
        window["AppUtils"].updateOrganizationType(orgType);
        dispatch(setUserOrganizationId(userOrganizationId));

        // Update the app base name with the newly resolved tenant.
        window["AppUtils"].updateTenantQualifiedBaseName(tenantDomain);

        dispatch(setDeploymentConfigs<DeploymentConfigInterface>(Config.getDeploymentConfig()));
        dispatch(setServiceResourceEndpoints<ServiceResourceEndpointsInterface>(Config.getServiceResourceEndpoints()));
        dispatch(setI18nConfigs<I18nModuleOptionsInterface>(Config.getI18nConfig()));
        dispatch(setUIConfigs<UIConfigInterface>(Config.getUIConfig()));

        // When the tenant domain changes, we have to reset the auth callback in session storage.
        // If not, it will hang and the app will be unresponsive with in the tab.
        // We can skip clearing the callback for super tenant since we do not put it in the path.
        if (tenantDomain !== AppConstants.getSuperTenant()) {
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

        getDecodedIDToken()
            .then(() => {
                dispatch(setSignIn<AuthenticatedUserInfo>(AuthenticateUtils.getSignInState(response)));
            })
            .catch((error: AsgardeoAuthException) => {
                throw error;
            });

        sessionStorage.setItem(CommonConstants.SESSION_STATE, response?.sessionState);

        getOIDCServiceEndpoints()
            .then((response: OIDCEndpoints) => {
                let authorizationEndpoint: string = response.authorizationEndpoint;
                let oidcSessionIframeEndpoint: string = response.checkSessionIframe;
                let tokenEndpoint: string = response.tokenEndpoint;

                // If `authorize` endpoint is overridden, save that in the session.
                if (window["AppUtils"].getConfig().idpConfigs?.authorizeEndpointURL) {
                    authorizationEndpoint = resolveIdpURLSAfterTenantResolves(
                        authorizationEndpoint,
                        window["AppUtils"].getConfig().idpConfigs.authorizeEndpointURL
                    );
                }

                // If super tenant proxy is configured, `authorize` endpoint is updated with the configured
                // super tenant proxy.
                if (window["AppUtils"].getConfig().superTenantProxy) {
                    authorizationEndpoint = authorizationEndpoint.replace(
                        window["AppUtils"].getConfig().superTenant,
                        window["AppUtils"].getConfig().superTenantProxy
                    );
                }

                // If `oidc session iframe` endpoint is overridden, save that in the session.
                if (window["AppUtils"].getConfig().idpConfigs?.oidcSessionIFrameEndpointURL) {
                    oidcSessionIframeEndpoint = resolveIdpURLSAfterTenantResolves(
                        oidcSessionIframeEndpoint,
                        window["AppUtils"].getConfig().idpConfigs.oidcSessionIFrameEndpointURL
                    );
                }

                // If `token` endpoint is overridden, save that in the session.
                if (window["AppUtils"].getConfig().idpConfigs?.tokenEndpointURL) {
                    tokenEndpoint = resolveIdpURLSAfterTenantResolves(
                        tokenEndpoint,
                        window["AppUtils"].getConfig().idpConfigs.tokenEndpointURL
                    );
                }

                sessionStorage.setItem(AUTHORIZATION_ENDPOINT, authorizationEndpoint);
                sessionStorage.setItem(OIDC_SESSION_IFRAME_ENDPOINT, oidcSessionIframeEndpoint);
                sessionStorage.setItem(TOKEN_ENDPOINT, tokenEndpoint);

                // Update post_logout_redirect_uri of logout_url with tenant qualified url
                const logoutUrl: string = window["AppUtils"].getConfig().idpConfigs?.logoutEndpointURL;
                let logoutRedirectUrl: string;

                updateConfig({
                    endpoints: {
                        authorizationEndpoint: authorizationEndpoint,
                        checkSessionIframe: oidcSessionIframeEndpoint,
                        endSessionEndpoint: logoutUrl.split("?")[0],
                        tokenEndpoint: tokenEndpoint
                    },
                    signOutRedirectURL: deriveLogoutRedirectForSubOrgLogins(
                        logoutRedirectUrl,
                        idToken.user_org,
                        idToken.org_id
                    )
                });
            })
            .catch((error: AsgardeoAuthException) => {
                throw error;
            });

        dispatch(getProfileInformation() as unknown as AnyAction);
    };

    /**
     * Handles the sign-in process for legacy authorization server.
     * @deprecated This is deprecated and will be removed in the next major release.
     * @param response - The basic user information returned from the sign-in process.
     */
    const legacyOnSignIn = async (response: BasicUserInfo): Promise<void> => {
        let logoutUrl: string;
        let logoutRedirectUrl: string;

        const event: Event = new Event(CommonConstantsCore.AUTHENTICATION_SUCCESSFUL_EVENT);
        const idToken: DecodedIDTokenPayload = await getDecodedIDToken();

        dispatchEvent(event);

        let tenantDomain: string = AuthenticateUtils.deriveTenantDomainFromSubject(response.sub);

        tenantDomain = transformTenantDomain(tenantDomain);

        // Update the app base name with the newly resolved tenant.
        window["AppUtils"].updateTenantQualifiedBaseName(tenantDomain);

        const isFirstLevelOrg: boolean = !idToken.user_org
            || idToken.org_name === tenantDomain
            || ((idToken.user_org === idToken.org_id) && idToken.org_name === tenantDomain);
        const userOrganizationId: string = idToken.user_org;
        let orgType: OrganizationType;

        if (isFirstLevelOrg && tenantDomain === AppConstants.getSuperTenant()) {
            orgType = OrganizationType.SUPER_ORGANIZATION;
        } else if (isFirstLevelOrg) {
            orgType = OrganizationType.FIRST_LEVEL_ORGANIZATION;
        } else {
            orgType = OrganizationType.SUBORGANIZATION;
        }
        dispatch(setOrganizationType(orgType));
        window["AppUtils"].updateOrganizationType(orgType);
        dispatch(setUserOrganizationId(userOrganizationId));

        dispatch(setDeploymentConfigs<DeploymentConfigInterface>(Config.getDeploymentConfig()));
        dispatch(setServiceResourceEndpoints<ServiceResourceEndpointsInterface>(Config.getServiceResourceEndpoints()));
        dispatch(setI18nConfigs<I18nModuleOptionsInterface>(Config.getI18nConfig()));
        dispatch(setUIConfigs<UIConfigInterface>(Config.getUIConfig()));

        // When the tenant domain changes, we have to reset the auth callback in session storage.
        // If not, it will hang and the app will be unresponsive with in the tab.
        // We can skip clearing the callback for super tenant since we do not put it in the path.
        if (tenantDomain !== AppConstants.getSuperTenant()) {
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
            if (window["AppUtils"].getConfig().appBase) {
                logoutUrl = logoutUrl.replace(
                    window["AppUtils"].getAppBase(),
                    window["AppUtils"].getAppBaseWithTenant()
                );
                logoutRedirectUrl = window["AppUtils"]
                    .getConfig()
                    .logoutCallbackURL.replace(
                        window["AppUtils"].getAppBase(),
                        window["AppUtils"].getAppBaseWithTenant()
                    );
            } else {
                logoutUrl = logoutUrl.replace(
                    window["AppUtils"].getConfig().logoutCallbackURL,
                    window["AppUtils"].getConfig().clientOrigin + window["AppUtils"].getConfig().routes.login
                );
                logoutRedirectUrl =
                    window["AppUtils"].getConfig().clientOrigin + window["AppUtils"].getConfig().routes.login;
            }

            // If an override URL is defined in config, use that instead.
            if (window["AppUtils"].getConfig().idpConfigs?.logoutEndpointURL) {
                logoutUrl = resolveIdpURLSAfterTenantResolves(
                    logoutUrl,
                    window["AppUtils"].getConfig().idpConfigs.logoutEndpointURL
                );
            }

            // If super tenant proxy is configured, logout url is updated with the
            // configured super tenant proxy.
            if (window["AppUtils"].getConfig().superTenantProxy) {
                logoutUrl = logoutUrl.replace(
                    window["AppUtils"].getConfig().superTenant,
                    window["AppUtils"].getConfig().superTenantProxy
                );
            }
        }
        sessionStorage.setItem(LOGOUT_URL, logoutUrl);

        getDecodedIDToken()
            .then(() => {
                dispatch(setSignIn<AuthenticatedUserInfo>(AuthenticateUtils.getSignInState(response)));
            })
            .catch((error: AsgardeoAuthException) => {
                throw error;
            });

        sessionStorage.setItem(CommonConstants.SESSION_STATE, response?.sessionState);

        getOIDCServiceEndpoints()
            .then((response: OIDCEndpoints) => {
                let authorizationEndpoint: string = response.authorizationEndpoint;
                let oidcSessionIframeEndpoint: string = response.checkSessionIframe;
                let tokenEndpoint: string = response.tokenEndpoint;

                // If `authorize` endpoint is overridden, save that in the session.
                if (window["AppUtils"].getConfig().idpConfigs?.authorizeEndpointURL) {
                    authorizationEndpoint = resolveIdpURLSAfterTenantResolves(
                        authorizationEndpoint,
                        window["AppUtils"].getConfig().idpConfigs.authorizeEndpointURL
                    );
                }

                // If super tenant proxy is configured, `authorize` endpoint is updated with the configured
                // super tenant proxy.
                if (window["AppUtils"].getConfig().superTenantProxy) {
                    authorizationEndpoint = authorizationEndpoint.replace(
                        window["AppUtils"].getConfig().superTenant,
                        window["AppUtils"].getConfig().superTenantProxy
                    );
                }

                // If `oidc session iframe` endpoint is overridden, save that in the session.
                if (window["AppUtils"].getConfig().idpConfigs?.oidcSessionIFrameEndpointURL) {
                    oidcSessionIframeEndpoint = resolveIdpURLSAfterTenantResolves(
                        oidcSessionIframeEndpoint,
                        window["AppUtils"].getConfig().idpConfigs.oidcSessionIFrameEndpointURL
                    );
                }

                // If `token` endpoint is overridden, save that in the session.
                if (window["AppUtils"].getConfig().idpConfigs?.tokenEndpointURL) {
                    tokenEndpoint = resolveIdpURLSAfterTenantResolves(
                        tokenEndpoint,
                        window["AppUtils"].getConfig().idpConfigs.tokenEndpointURL
                    );
                }

                sessionStorage.setItem(AUTHORIZATION_ENDPOINT, authorizationEndpoint);
                sessionStorage.setItem(OIDC_SESSION_IFRAME_ENDPOINT, oidcSessionIframeEndpoint);
                sessionStorage.setItem(TOKEN_ENDPOINT, tokenEndpoint);

                updateConfig({
                    endpoints: {
                        authorizationEndpoint: authorizationEndpoint,
                        checkSessionIframe: oidcSessionIframeEndpoint,
                        endSessionEndpoint: logoutUrl?.split("?")[0],
                        tokenEndpoint: tokenEndpoint
                    },
                    signOutRedirectURL: logoutRedirectUrl
                });
            })
            .catch((error: AsgardeoAuthException) => {
                throw error;
            });

        dispatch(getProfileInformation() as unknown as AnyAction);
    };

    /**
     * Derives the logout redirect URL for sub-org logins.
     *
     * @remarks This only applies to the new authz runtime.
     *
     * @param currentLogoutRedirect - Current logout redirect URL.
     * @param userOrg - User's org.
     * @param orgId - User's org ID.
     * @returns Derived logout redirect URL.
     */
    const deriveLogoutRedirectForSubOrgLogins = (currentLogoutRedirect: string, userOrg: string, orgId: string) => {
        let logoutRedirectUrl: string = currentLogoutRedirect;

        // When a first level tenant login happens, `user_org` is undefined.
        // We need to save that in the local storage to handle the login/logout if they switch.
        if (userOrg === undefined && orgId) {
            removeUserOrgInLocalStorage();
            removeOrgIdInLocalStorage();

            setUserOrgInLocalStorage(userOrg);
            setOrgIdInLocalStorage(orgId);
        }

        if (userOrg) {
            const isSwitchedFromRootOrg: boolean = getUserOrgInLocalStorage() === "undefined";

            if (!isSwitchedFromRootOrg) {
                logoutRedirectUrl = window["AppUtils"]?.getConfig()?.clientOriginWithTenant?.replace(
                    orgId, userOrg
                );
            }
        }

        return logoutRedirectUrl;
    };

    return {
        onSignIn
    };
};

export default useSignIn;
