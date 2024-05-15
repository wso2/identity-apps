/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
    AuthenticatedUserInfo,
    BasicUserInfo,
    DecodedIDTokenPayload,
    OIDCEndpoints,
    useAuthContext
} from "@asgardeo/auth-react";
import {
    AppConstants as CommonAppConstants,
    CommonConstants as CommonConstantsCore
} from "@wso2is/core/constants";
import { TenantListInterface } from "@wso2is/core/models";
import { setDeploymentConfigs, setServiceResourceEndpoints, setSignIn } from "@wso2is/core/store";
import {
    AuthenticateUtils as CommonAuthenticateUtils,
    ContextUtils
} from "@wso2is/core/utils";
import axios, { AxiosResponse } from "axios";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import useAuthorization from "../../admin.authorization.v1/hooks/use-authorization";
import { Config } from "../../admin.core.v1/configs/app";
import { AppConfigs } from "../../admin.core.v1/configs/app-configs";
import { AppConstants, CommonConstants } from "../../admin.core.v1/constants";
import useDeploymentConfig from "../../admin.core.v1/hooks/use-deployment-configs";
import useResourceEndpoints from "../../admin.core.v1/hooks/use-resource-endpoints";
import { DeploymentConfigInterface } from "../../admin.core.v1/models/config";
import { AppState } from "../../admin.core.v1/store";
import {
    getServerConfigurations,
    setCurrentOrganization,
    setGetOrganizationLoading,
    setIsFirstLevelOrganization,
    setOrganization,
    setOrganizationType,
    setUserOrganizationId
} from "../../admin.core.v1/store/actions/organization";
import { CONSUMER_USERSTORE } from "../../admin.extensions.v1/components/administrators/constants/users";
import { OrganizationType } from "../../admin.organizations.v1/constants";
import useOrganizationSwitch from "../../admin.organizations.v1/hooks/use-organization-switch";
import useOrganizations from "../../admin.organizations.v1/hooks/use-organizations";
import { getProfileInformation } from "../store/actions";
import { AuthenticateUtils } from "../utils/authenticate-utils";

const AUTHORIZATION_ENDPOINT: string = "authorization_endpoint";
const TOKEN_ENDPOINT: string = "token_endpoint";
const OIDC_SESSION_IFRAME_ENDPOINT: string = "oidc_session_iframe_endpoint";
const LOGOUT_URL: string = "sign_out_url";

/**
 * Props interface of {@link useSignIn}
 */
export type UseSignInInterface = {
    /**
     * Handles the sign-in process.
     *
     * @example
     * ```
     * const { onSignIn } = useSignIn();
     * ```
     *
     * @param response - The basic user information returned from the sign-in process.
     * @param onTenantResolve - Callback to be triggered when tenant is resolved.
     * @param onSignInSuccessRedirect - Callback to be triggered when sign in is successful.
     * @param onAppReady - Callback to be triggered when the app is ready.
     *
     * @returns A promise.
     */
    onSignIn: (
        response: BasicUserInfo,
        onTenantResolve: (tenantDomain: string) => void,
        onSignInSuccessRedirect: (idToken: DecodedIDTokenPayload) => void,
        onAppReady: () => void,
    ) => Promise<void>;
};

/**
 * Hook that provides access to the Organizations context.
 *
 * @returns An object containing the current Organizations context.
 */
const useSignIn = (): UseSignInInterface => {
    const dispatch: ThunkDispatch<AppState, any, AnyAction> = useDispatch();

    const { getDecodedIDToken, getOIDCServiceEndpoints, updateConfig } = useAuthContext();

    const { setResourceEndpoints } = useResourceEndpoints();

    const { switchOrganization } = useOrganizationSwitch();

    const { setDeploymentConfig } = useDeploymentConfig();

    const { legacyAuthzRuntime }  = useAuthorization();

    const {
        transformTenantDomain,
        setUserOrgInLocalStorage,
        setOrgIdInLocalStorage,
        getUserOrgInLocalStorage,
        removeOrgIdInLocalStorage,
        removeUserOrgInLocalStorage
    } = useOrganizations();

    /**
     * Resolves and sets the custom server host.
     *
     * @param orgType - Type of the organization. Ex: sub organization, etc.
     */
    const setCustomServerHost = (orgType: string): void => {
        // In case of failure customServerHost is set to the serverHost.
        let customServerHost: string = Config?.getDeploymentConfig()?.serverHost;

        const isSuperTenant: boolean =AppConfigs.getAppUtils().isSuperTenant();
        const isSubOrganization: boolean = orgType === OrganizationType.SUBORGANIZATION &&
       AppConfigs.getAppUtils().getConfig()?.organizationName.length > 0;

        if (!AppConfigs.getInstance().AppUtils.getConfig()?.tenantContext?.requireSuperTenantInUrls && isSuperTenant) {
            // Removing super tenant from the server host.
            const customServerHostSplit: string[] = customServerHost?.split("/t/");

            if (customServerHostSplit?.length > 0) {
                customServerHost = customServerHostSplit[0];
            }
        }

        if (isSubOrganization) {
            customServerHost = `${Config?.getDeploymentConfig()?.serverOrigin}/${
                AppConfigs.getAppUtils()?.getConfig()?.organizationPrefix}/${
                AppConfigs.getAppUtils()?.getConfig()?.organizationName}`;
        }

        AppConfigs.getAppUtils()?.updateCustomServerHost(customServerHost);

        // Update store with custom server host.
        dispatch(setDeploymentConfigs<DeploymentConfigInterface>(Config?.getDeploymentConfig()));

        // Set the deployment configs in the context.
        setDeploymentConfig(Config?.getDeploymentConfig());

        // Update runtime configurations.
        ContextUtils.setRuntimeConfig(Config?.getDeploymentConfig());
    };

    /**
     * Resolves and sets the custom server host.
     *
     * @deprecated Use `setCustomServerHost()` instead.
     * @param orgType - Type of the organization. Ex: sub organization, etc.
     * @param wellKnownEndpoint - Wellknown discovery endpoint.
     */
    const setLegacyCustomServerHost = (orgType: string, wellKnownEndpoint: string): void => {
        const disabledFeatures: string[] =
           AppConfigs.getAppUtils()?.getConfig()?.ui?.features?.branding?.disabledFeatures;

        if (disabledFeatures?.includes("branding.hostnameUrlBranding")) {
            return;
        }

        // Set configurations related to hostname branding.
        axios
            .get(wellKnownEndpoint)
            .then((response: AxiosResponse) => {
                // Use token endpoint to extract the host url.
                const splitted: string[] = response?.data?.token_endpoint?.split("/") ?? [];

                let serverHost: string = splitted?.slice(0, -2)?.join("/");

                if (orgType === OrganizationType.SUBORGANIZATION) {
                    serverHost = `${Config?.getDeploymentConfig()?.serverOrigin}/${
                        AppConfigs.getAppUtils()?.getConfig()?.organizationPrefix
                    }/${AppConfigs.getAppUtils()?.getConfig()?.organizationName}`;
                }

                AppConfigs.getAppUtils()?.updateCustomServerHost(serverHost);
            })
            .catch((error: any) => {
                // In case of failure customServerHost is set to the serverHost.
                AppConfigs.getAppUtils()?.updateCustomServerHost(Config?.getDeploymentConfig()?.serverHost);

                throw error;
            })
            .finally(() => {
                // Update store with custom server host.
                dispatch(setDeploymentConfigs<DeploymentConfigInterface>(Config?.getDeploymentConfig()));

                // Set the deployment configs in the context.
                setDeploymentConfig(Config?.getDeploymentConfig());

                // Update runtime configurations.
                ContextUtils.setRuntimeConfig(Config?.getDeploymentConfig());
            });
    };

    /**
     * Handles the sign-in process.
     *
     * @example
     * ```
     * const { onSignIn } = useSignIn();
     * ```
     *
     * @param response - The basic user information returned from the sign-in process.
     * @param onTenantResolve - Callback to be triggered when tenant is resolved.
     * @param onSignInSuccessRedirect - Callback to be triggered when sign in is successful.
     * @param onAppReady - Callback to be triggered when the app is ready.
     *
     * @returns A promise.
     */
    const onSignIn = async (
        response: BasicUserInfo,
        onTenantResolve: (tenantDomain: string) => void,
        onSignInSuccessRedirect: (idToken: DecodedIDTokenPayload) => void,
        onAppReady: () => void
    ): Promise<void> => {
        if (legacyAuthzRuntime) {
            await legacyOnSignIn(
                response,
                onTenantResolve,
                onSignInSuccessRedirect,
                onAppReady
            );

            return;
        }

        await _onSignIn(
            response,
            onTenantResolve,
            onSignInSuccessRedirect,
            onAppReady
        );
    };

    /**
     * Handles the sign-in process for the new authorization server.
     *
     * @param response - The basic user information returned from the sign-in process.
     * @param onTenantResolve - Callback to be triggered when tenant is resolved.
     * @param onSignInSuccessRedirect - Callback to be triggered when sign in is successful.
     * @param onAppReady - Callback to be triggered when the app is ready.
     *
     * @returns A promise.
     */
    const _onSignIn = async (
        response: BasicUserInfo,
        onTenantResolve: (tenantDomain: string) => void,
        onSignInSuccessRedirect: (idToken: DecodedIDTokenPayload) => void,
        onAppReady: () => void
    ): Promise<void> => {
        let logoutRedirectUrl: string;

        const idToken: DecodedIDTokenPayload = await getDecodedIDToken();
        let isPrivilegedUser: boolean =
            idToken?.amr?.length > 0
                ? idToken?.amr[0] === "EnterpriseIDPAuthenticator"
                : false;
        const event: Event = new Event(CommonConstantsCore.AUTHENTICATION_SUCCESSFUL_EVENT);

        dispatchEvent(event);

        const orgIdIdToken: string = idToken.org_id;
        const orgName: string = idToken.org_name;
        const userOrganizationId: string = idToken.user_org;
        const tenantDomainFromSubject: string = CommonAuthenticateUtils.deriveTenantDomainFromSubject(
            response.sub
        );
        const isFirstLevelOrg: boolean = !idToken.user_org
            || idToken.org_name === tenantDomainFromSubject
            || ((idToken.user_org === idToken.org_id) && idToken.org_name === tenantDomainFromSubject);

        const tenantDomain: string = isFirstLevelOrg ? transformTenantDomain(orgName) : orgIdIdToken;

        const firstName: string = idToken?.given_name;
        const lastName: string = idToken?.family_name;
        const fullName: string = firstName ? firstName + (lastName ? " " + lastName : "") : response.email;

        const __experimental__platformIdP: {
            enabled: boolean;
            homeRealmId: string;
        } = AppConfigs.getAppUtils().getConfig()?.__experimental__platformIdP;

        if (__experimental__platformIdP?.enabled) {
            isPrivilegedUser = idToken?.sub?.startsWith(`${ CONSUMER_USERSTORE }/`);

            if (idToken?.default_tenant && idToken.default_tenant !== "carbon.super") {
                const redirectUrl: URL = new URL(
                    AppConfigs.getAppUtils().getConfig().clientOriginWithTenant.replace(
                        AppConfigs.getAppUtils().getConfig().tenant,
                        idToken.default_tenant
                    )
                );

                redirectUrl.searchParams.set("fidp", __experimental__platformIdP.homeRealmId);

                window.location.href = redirectUrl.href;
            }
        }

        await dispatch(
            setSignIn<AuthenticatedUserInfo & TenantListInterface>(
                Object.assign(
                    CommonAuthenticateUtils.getSignInState(
                        response,
                        tenantDomain
                    ), {
                        associatedTenants: isPrivilegedUser ? tenantDomain : idToken?.associated_tenants,
                        defaultTenant: isPrivilegedUser ? tenantDomain : idToken?.default_tenant,
                        fullName: fullName,
                        isPrivilegedUser: isPrivilegedUser
                    })
            )
        );

        onTenantResolve(tenantDomain);

        let orgType: OrganizationType;

        // Update the organization name with the newly resolved org.
        if (!isFirstLevelOrg) {
            AppConfigs.getAppUtils().updateOrganizationName(orgIdIdToken);
        } else {
            // Update the app base name with the newly resolved tenant.
            AppConfigs.getAppUtils().updateTenantQualifiedBaseName(tenantDomain);
        }

        if (isFirstLevelOrg && tenantDomain === AppConstants.getSuperTenant()) {
            orgType = OrganizationType.SUPER_ORGANIZATION;
        } else if (isFirstLevelOrg) {
            orgType = OrganizationType.FIRST_LEVEL_ORGANIZATION;
        } else {
            orgType = OrganizationType.SUBORGANIZATION;
        }

        dispatch(setOrganizationType(orgType));
        AppConfigs.getAppUtils().updateOrganizationType(orgType);
        dispatch(setUserOrganizationId(userOrganizationId));

        if (AppConfigs.getAppUtils().getConfig().organizationName || isFirstLevelOrg) {
            // We are actually getting the orgId here rather than orgName
            const orgId: string = isFirstLevelOrg ? orgIdIdToken :
                AppConfigs.getAppUtils().getConfig().organizationName;

            // Setting a dummy object until real data comes from the API
            dispatch(
                setOrganization({
                    attributes: [],
                    created: new Date().toString(),
                    description: "",
                    domain: "",
                    id: orgId,
                    lastModified: new Date().toString(),
                    name: orgName,
                    parent: {
                        id: "",
                        ref: ""
                    },
                    status: "",
                    type: ""
                })
            );

            if (!isPrivilegedUser && orgIdIdToken != orgId) {
                dispatch(setCurrentOrganization(orgName));

                // This is to make sure the endpoints are generated with the organization path.
                await dispatch(setServiceResourceEndpoints(Config.getServiceResourceEndpoints()));

                // Sets the resource endpoints in the context.
                setResourceEndpoints(Config.getServiceResourceEndpoints() as any);

                try {
                    response = await switchOrganization(orgId);
                } catch (e) {
                    // TODO: Handle error
                }

                onTenantResolve(response.orgId);
                dispatch(setCurrentOrganization(response.orgName));
            }
        }

        dispatch(setGetOrganizationLoading(false));

        const endpoints: Record<string, any> = Config.getServiceResourceEndpoints();

        // Update the endpoints with tenant path.
        await dispatch(setServiceResourceEndpoints(endpoints));

        // Sets the resource endpoints in the context.
        setResourceEndpoints(endpoints);

        // When the tenant domain changes, we have to reset the auth callback in session storage.
        // If not, it will hang and the app will be unresponsive with in the tab.
        // We can skip clearing the callback for super tenant since we do not put it in the path.
        if (tenantDomain !== AppConstants.getSuperTenant()) {
            // If the auth callback already has the logged in tenant's path, we can skip the reset.
            if (
                !CommonAuthenticateUtils.isValidAuthenticationCallbackUrl(
                    CommonAppConstants.CONSOLE_APP,
                    AppConstants.getTenantPath()
                )
            ) {
                CommonAuthenticateUtils.removeAuthenticationCallbackUrl(CommonAppConstants.CONSOLE_APP);
            }
        }

        // Update runtime configurations.
        ContextUtils.setRuntimeConfig(Config.getDeploymentConfig());

        const logoutUrl: string = AppConfigs.getAppUtils().getConfig().idpConfigs?.logoutEndpointURL;

        dispatch(setIsFirstLevelOrganization(isFirstLevelOrg));

        onAppReady();

        sessionStorage.setItem(CommonConstants.SESSION_STATE, response?.sessionState);

        getOIDCServiceEndpoints()
            .then((response: OIDCEndpoints) => {
                let authorizationEndpoint: string = response.authorizationEndpoint;
                let oidcSessionIframeEndpoint: string = response.checkSessionIframe;
                let tokenEndpoint: string = response.tokenEndpoint;

                // If `authorize` endpoint is overridden, save that in the session.
                if (AppConfigs.getAppUtils().getConfig().idpConfigs?.authorizeEndpointURL) {
                    authorizationEndpoint = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                        authorizationEndpoint,
                        AppConfigs.getAppUtils().getConfig().idpConfigs.authorizeEndpointURL
                    );
                }

                // If `oidc session iframe` endpoint is overridden, save that in the session.
                if (AppConfigs.getAppUtils().getConfig().idpConfigs?.oidcSessionIFrameEndpointURL) {
                    oidcSessionIframeEndpoint = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                        oidcSessionIframeEndpoint,
                        AppConfigs.getAppUtils().getConfig().idpConfigs.oidcSessionIFrameEndpointURL
                    );
                }

                // If `token` endpoint is overridden, save that in the session.
                if (AppConfigs.getAppUtils().getConfig().idpConfigs?.tokenEndpointURL) {
                    tokenEndpoint = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                        tokenEndpoint,
                        AppConfigs.getAppUtils().getConfig().idpConfigs.tokenEndpointURL
                    );
                }

                if (isPrivilegedUser) {
                    logoutRedirectUrl =
                       AppConfigs.getAppUtils().getConfig().clientOrigin +
                           AppConfigs.getAppUtils().getConfig().routes.login;
                }

                sessionStorage.setItem(AUTHORIZATION_ENDPOINT, authorizationEndpoint);
                sessionStorage.setItem(OIDC_SESSION_IFRAME_ENDPOINT, oidcSessionIframeEndpoint);
                sessionStorage.setItem(TOKEN_ENDPOINT, tokenEndpoint);

                let signOutRedirectURL: URL = null;

                try {
                    signOutRedirectURL = new URL(deriveLogoutRedirectForSubOrgLogins(
                        logoutRedirectUrl,
                        userOrganizationId,
                        orgIdIdToken
                    ));
                } catch(e) {
                    signOutRedirectURL = null;
                }

                // If the experimental Platform IdP is enabled and the user is not a privileged user,
                // We need to append the `homeRealmId` of the platform IdP as a `fidp` query
                // param to the post logout redirect URL.
                if (__experimental__platformIdP?.enabled && !isPrivilegedUser) {
                    if (!signOutRedirectURL) {
                        signOutRedirectURL =
                            new URL(AppConfigs.getAppUtils()?.getConfig()?.logoutCallbackURL);
                    }

                    signOutRedirectURL.searchParams.set("fidp", __experimental__platformIdP.homeRealmId);

                    // `updateConfig` doesn't seem to be updating the SDK config after initializing.
                    // Hence the updated `signOutRedirectURL` is not taken for logout.
                    // Tracker: https://github.com/asgardeo/asgardeo-auth-react-sdk/issues/222
                    // TODO: Remove this workaround once the above issue is fixed.
                    Object.entries(sessionStorage).forEach(([ key, value ]: [ key: string, value: string ]) => {
                        if (key.startsWith(LOGOUT_URL) &&
                            key.includes(AppConfigs.getAppUtils()?.getConfig()?.clientID)) {
                            const _signOutRedirectURL: URL = new URL(value);

                            const postLogoutRedirectUri: URL = new URL(
                                _signOutRedirectURL.searchParams.get("post_logout_redirect_uri")
                            );

                            postLogoutRedirectUri.searchParams.set("fidp", __experimental__platformIdP.homeRealmId);

                            _signOutRedirectURL.searchParams.set(
                                "post_logout_redirect_uri",
                                postLogoutRedirectUri?.href
                            );

                            sessionStorage.setItem(key, _signOutRedirectURL.href);
                        }
                    });
                }

                updateConfig({
                    endpoints: {
                        authorizationEndpoint: authorizationEndpoint,
                        checkSessionIframe: oidcSessionIframeEndpoint,
                        endSessionEndpoint: logoutUrl.split("?")[0],
                        tokenEndpoint: tokenEndpoint
                    },
                    signOutRedirectURL: signOutRedirectURL?.href
                });
            })
            .catch((error: any) => {
                throw error;
            });

        await dispatch(
            getProfileInformation(
                Config.getServiceResourceEndpoints().me,
                AppConfigs.getAppUtils().getConfig().clientOriginWithTenant,
                true
            )
        );

        if (isFirstLevelOrg) {
            await dispatch(getServerConfigurations());
        }

        onSignInSuccessRedirect(idToken);
        setCustomServerHost(orgType);
    };

    /**
     * Handles the sign-in process for legacy authorization server.
     *
     * @deprecated This is deprecated and will be removed in the next major release.
     * @param response - The basic user information returned from the sign-in process.
     * @param onTenantResolve - Callback to be triggered when tenant is resolved.
     * @param onSignInSuccessRedirect - Callback to be triggered when sign in is successful.
     * @param onAppReady - Callback to be triggered when the app is ready.
     *
     * @returns A promise.
     */
    const legacyOnSignIn = async (
        response: BasicUserInfo,
        onTenantResolve: (tenantDomain: string) => void,
        onSignInSuccessRedirect: (idToken: DecodedIDTokenPayload) => void,
        onAppReady: () => void
    ): Promise<void> => {
        let logoutUrl: string;
        let logoutRedirectUrl: string;

        const idToken: DecodedIDTokenPayload = await getDecodedIDToken();
        const isPrivilegedUser: boolean =
            idToken?.amr?.length > 0
                ? idToken?.amr[0] === "EnterpriseIDPAuthenticator"
                : false;
        const event: Event = new Event(CommonConstantsCore.AUTHENTICATION_SUCCESSFUL_EVENT);

        dispatchEvent(event);

        const orgIdIdToken: string = idToken.org_id;
        const orgName: string = idToken.org_name;
        const userOrganizationId: string = idToken.user_org;
        const tenantDomainFromSubject: string = CommonAuthenticateUtils.deriveTenantDomainFromSubject(
            response.sub
        );
        const isFirstLevelOrg: boolean = !idToken.user_org
            || idToken.org_name === tenantDomainFromSubject
            || ((idToken.user_org === idToken.org_id) && idToken.org_name === tenantDomainFromSubject);

        let tenantDomain: string = transformTenantDomain(orgName);

        const firstName: string = idToken?.given_name;
        const lastName: string = idToken?.family_name;
        const fullName: string = firstName ? firstName + (lastName ? " " + lastName : "") : response.email;

        await dispatch(
            setSignIn<AuthenticatedUserInfo & TenantListInterface>(
                Object.assign(
                    CommonAuthenticateUtils.getSignInState(
                        response,
                        transformTenantDomain(response.orgName)
                    ), {
                        associatedTenants: isPrivilegedUser ? tenantDomain : idToken?.associated_tenants,
                        defaultTenant: isPrivilegedUser ? tenantDomain : idToken?.default_tenant,
                        fullName: fullName,
                        isPrivilegedUser: isPrivilegedUser
                    })
            )
        );

        tenantDomain = tenantDomainFromSubject;

        onTenantResolve(tenantDomain);

        let orgType: OrganizationType;

        // Update the organization name with the newly resolved org.
        if (!isFirstLevelOrg) {
            AppConfigs.getAppUtils().updateOrganizationName(orgIdIdToken);
        } else {
            // Update the app base name with the newly resolved tenant.
            AppConfigs.getAppUtils().updateTenantQualifiedBaseName(tenantDomain);
        }

        if (isFirstLevelOrg && tenantDomain === AppConstants.getSuperTenant()) {
            orgType = OrganizationType.SUPER_ORGANIZATION;
        } else if (isFirstLevelOrg) {
            orgType = OrganizationType.FIRST_LEVEL_ORGANIZATION;
        } else {
            orgType = OrganizationType.SUBORGANIZATION;
        }

        dispatch(setOrganizationType(orgType));
        AppConfigs.getAppUtils().updateOrganizationType(orgType);
        dispatch(setUserOrganizationId(userOrganizationId));
        dispatch(setIsFirstLevelOrganization(isFirstLevelOrg));

        if (AppConfigs.getAppUtils().getConfig().organizationName || isFirstLevelOrg) {
            // We are actually getting the orgId here rather than orgName
            const orgId: string = isFirstLevelOrg ? orgIdIdToken :
                AppConfigs.getAppUtils().getConfig().organizationName;

            // Setting a dummy object until real data comes from the API
            dispatch(
                setOrganization({
                    attributes: [],
                    created: new Date().toString(),
                    description: "",
                    domain: "",
                    id: orgId,
                    lastModified: new Date().toString(),
                    name: orgName,
                    parent: {
                        id: "",
                        ref: ""
                    },
                    status: "",
                    type: ""
                })
            );

            if (!isPrivilegedUser && orgIdIdToken != orgId) {
                dispatch(setCurrentOrganization(orgName));

                // This is to make sure the endpoints are generated with the organization path.
                await dispatch(setServiceResourceEndpoints(Config.getServiceResourceEndpoints()));

                // Sets the resource endpoints in the context.
                setResourceEndpoints(Config.getServiceResourceEndpoints() as any);

                try {
                    response = await switchOrganization(orgId);
                } catch (e) {
                    // TODO: Handle error
                }

                onTenantResolve(response.orgId);
                dispatch(setCurrentOrganization(response.orgName));
            }
        }

        dispatch(setGetOrganizationLoading(false));

        const endpoints: Record<string, any> = Config.getServiceResourceEndpoints();

        // Update the endpoints with tenant path.
        await dispatch(setServiceResourceEndpoints(endpoints));

        // Sets the resource endpoints in the context.
        setResourceEndpoints(endpoints);

        // When the tenant domain changes, we have to reset the auth callback in session storage.
        // If not, it will hang and the app will be unresponsive with in the tab.
        // We can skip clearing the callback for super tenant since we do not put it in the path.
        if (tenantDomain !== AppConstants.getSuperTenant()) {
            // If the auth callback already has the logged in tenant's path, we can skip the reset.
            if (
                !CommonAuthenticateUtils.isValidAuthenticationCallbackUrl(
                    CommonAppConstants.CONSOLE_APP,
                    AppConstants.getTenantPath()
                )
            ) {
                CommonAuthenticateUtils.removeAuthenticationCallbackUrl(CommonAppConstants.CONSOLE_APP);
            }
        }

        // Update runtime configurations.
        ContextUtils.setRuntimeConfig(Config.getDeploymentConfig());

        logoutUrl = AppConfigs.getAppUtils().getConfig().idpConfigs?.logoutEndpointURL;

        // Update post_logout_redirect_uri of logout_url with tenant qualified url
        if (sessionStorage.getItem(LOGOUT_URL)) {
            logoutUrl = sessionStorage.getItem(LOGOUT_URL);

            if (
                !AppConfigs.getAppUtils().getConfig().accountApp
                    .commonPostLogoutUrl
            ) {
                // If there is a base name, replace the `post_logout_redirect_uri` with the tenanted base name.
                if (AppConfigs.getAppUtils().getConfig().appBase) {
                    logoutUrl = logoutUrl.replace(
                        AppConfigs.getAppUtils().getAppBase(),
                        AppConfigs.getAppUtils().getAppBaseWithTenant()
                    );
                    logoutRedirectUrl = AppConfigs.getAppUtils()
                        .getConfig()
                        .logoutCallbackURL.replace(
                            AppConfigs.getAppUtils().getAppBase(),
                            AppConfigs.getAppUtils().getAppBaseWithTenant()
                        );
                } else {
                    logoutUrl = logoutUrl.replace(
                        AppConfigs.getAppUtils().getConfig().logoutCallbackURL,
                        AppConfigs.getAppUtils().getConfig().clientOrigin +
                        AppConfigs.getAppUtils().getConfig().routes.login
                    );
                    logoutRedirectUrl =
                        AppConfigs.getAppUtils().getConfig().clientOrigin +
                        AppConfigs.getAppUtils().getConfig().routes.login;
                }
            }

            // If an override URL is defined in config, use that instead.
            if (
                AppConfigs.getAppUtils().getConfig().idpConfigs?.logoutEndpointURL
            ) {
                logoutUrl = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                    logoutUrl,
                    AppConfigs.getAppUtils().getConfig().idpConfigs
                        .logoutEndpointURL
                );
            }

            sessionStorage.setItem(LOGOUT_URL, logoutUrl);
        }

        onAppReady();

        sessionStorage.setItem(CommonConstants.SESSION_STATE, response?.sessionState);

        getOIDCServiceEndpoints()
            .then((response: OIDCEndpoints) => {
                let authorizationEndpoint: string = response.authorizationEndpoint;
                let oidcSessionIframeEndpoint: string = response.checkSessionIframe;
                let tokenEndpoint: string = response.tokenEndpoint;

                // If `authorize` endpoint is overridden, save that in the session.
                if (AppConfigs.getAppUtils().getConfig().idpConfigs?.authorizeEndpointURL) {
                    authorizationEndpoint = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                        authorizationEndpoint,
                        AppConfigs.getAppUtils().getConfig().idpConfigs.authorizeEndpointURL
                    );
                }

                // If `oidc session iframe` endpoint is overridden, save that in the session.
                if (AppConfigs.getAppUtils().getConfig().idpConfigs?.oidcSessionIFrameEndpointURL) {
                    oidcSessionIframeEndpoint = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                        oidcSessionIframeEndpoint,
                        AppConfigs.getAppUtils().getConfig().idpConfigs.oidcSessionIFrameEndpointURL
                    );
                }

                // If `token` endpoint is overridden, save that in the session.
                if (AppConfigs.getAppUtils().getConfig().idpConfigs?.tokenEndpointURL) {
                    tokenEndpoint = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                        tokenEndpoint,
                        AppConfigs.getAppUtils().getConfig().idpConfigs.tokenEndpointURL
                    );
                }

                if (isPrivilegedUser) {
                    logoutRedirectUrl =
                        AppConfigs.getAppUtils().getConfig().clientOrigin +
                            AppConfigs.getAppUtils().getConfig().routes.login;
                }

                sessionStorage.setItem(AUTHORIZATION_ENDPOINT, authorizationEndpoint);
                sessionStorage.setItem(OIDC_SESSION_IFRAME_ENDPOINT, oidcSessionIframeEndpoint);
                sessionStorage.setItem(TOKEN_ENDPOINT, tokenEndpoint);

                updateConfig({
                    endpoints: {
                        authorizationEndpoint: authorizationEndpoint,
                        checkSessionIframe: oidcSessionIframeEndpoint,
                        endSessionEndpoint: logoutUrl.split("?")[0],
                        tokenEndpoint: tokenEndpoint
                    },
                    signOutRedirectURL: logoutRedirectUrl
                });
            })
            .catch((error: any) => {
                throw error;
            });

        await dispatch(
            getProfileInformation(
                Config.getServiceResourceEndpoints().me,
                AppConfigs.getAppUtils().getConfig().clientOriginWithTenant,
                true
            )
        );

        if (isFirstLevelOrg) {
            await dispatch(getServerConfigurations());
        }

        onSignInSuccessRedirect(idToken);
        setLegacyCustomServerHost(orgType, Config.getServiceResourceEndpoints().wellKnown);
    };

    /**
     * Derives the logout redirect URL for sub-org logins.
     *
     * @remarks This only applies to the new authz runtime.
     *
     * @param currentLogoutRedirect - Current logout redirect URL.
     * @param userOrg - User's org.
     * @param orgId - User's org ID.
     *
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
                logoutRedirectUrl = AppConfigs.getAppUtils()?.getConfig()?.clientOriginWithTenant?.replace(
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
