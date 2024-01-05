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
import useDeploymentConfig from "@wso2is/common/src/hooks/use-deployment-configs";
import useResourceEndpoints from "@wso2is/common/src/hooks/use-resource-endpoints";
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
import useAuthorization from "../../authorization/hooks/use-authorization";
import { Config } from "../../core/configs/app";
import { AppConstants, CommonConstants } from "../../core/constants";
import { DeploymentConfigInterface } from "../../core/models/config";
import { AppState } from "../../core/store";
import {
    getServerConfigurations,
    setCurrentOrganization,
    setGetOrganizationLoading,
    setIsFirstLevelOrganization,
    setOrganization,
    setOrganizationType,
    setUserOrganizationId
} from "../../core/store/actions/organization";
import { OrganizationType } from "../../organizations/constants";
import useOrganizationSwitch from "../../organizations/hooks/use-organization-switch";
import useOrganizations from "../../organizations/hooks/use-organizations";
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

    const setCustomServerHost = (orgType: string, wellKnownEndpoint: string) => {
        const disabledFeatures: string[] = window["AppUtils"]?.getConfig()?.ui?.features?.branding?.disabledFeatures;

        if (legacyAuthzRuntime && !disabledFeatures?.includes("branding.hostnameUrlBranding")) {
            // Set configurations related to hostname branding.
            axios
                .get(wellKnownEndpoint)
                .then((response: AxiosResponse) => {
                    // Use token endpoint to extract the host url.
                    const splitted: string[] = response?.data?.token_endpoint?.split("/") ?? [];

                    let serverHost: string = splitted?.slice(0, -2)?.join("/");

                    if (orgType === OrganizationType.SUBORGANIZATION) {
                        serverHost = `${Config?.getDeploymentConfig()?.serverOrigin}/${
                            window["AppUtils"]?.getConfig()?.organizationPrefix
                        }/${window["AppUtils"]?.getConfig()?.organizationName}`;
                    }

                    window["AppUtils"]?.updateCustomServerHost(serverHost);
                })
                .catch((error: any) => {
                    // In case of failure customServerHost is set to the serverHost.
                    window["AppUtils"]?.updateCustomServerHost(Config?.getDeploymentConfig()?.serverHost);

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
        } else {
            // In case of failure customServerHost is set to the serverHost.
            let customServerHost: string = Config?.getDeploymentConfig()?.serverHost;

            const isSuperTenant: boolean = window["AppUtils"]?.isSuperTenant();
            const isSubOrganization: boolean = orgType === OrganizationType.SUBORGANIZATION &&
                window["AppUtils"]?.getConfig()?.organizationName.length > 0;

            if (!window["AppUtils"]?.getConfig()?.requireSuperTenantInUrls && isSuperTenant) {
                // Removing super tenant from the server host.
                const customServerHostSplit: string[] = customServerHost?.split("/t/");

                if (customServerHostSplit?.length > 0) {
                    customServerHost = customServerHostSplit[0];
                }
            }

            if (isSubOrganization) {
                customServerHost = `${Config?.getDeploymentConfig()?.serverOrigin}/${
                    window["AppUtils"]?.getConfig()?.organizationPrefix}/${
                    window["AppUtils"]?.getConfig()?.organizationName}`;
            }

            window["AppUtils"]?.updateCustomServerHost(customServerHost);

            // Update store with custom server host.
            dispatch(setDeploymentConfigs<DeploymentConfigInterface>(Config?.getDeploymentConfig()));

            // Set the deployment configs in the context.
            setDeploymentConfig(Config?.getDeploymentConfig());

            // Update runtime configurations.
            ContextUtils.setRuntimeConfig(Config?.getDeploymentConfig());
        }
    };

    const onSignIn = async (
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

        if (legacyAuthzRuntime) {
            tenantDomain = tenantDomainFromSubject;
        }

        onTenantResolve(tenantDomain);

        let orgType: OrganizationType;

        // Update the organization name with the newly resolved org.
        if (!isFirstLevelOrg) {
            window["AppUtils"].updateOrganizationName(orgIdIdToken);
        } else {
            // Update the app base name with the newly resolved tenant.
            window[ "AppUtils" ].updateTenantQualifiedBaseName(tenantDomain);
        }

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

        if (window["AppUtils"].getConfig().organizationName || isFirstLevelOrg) {
            // We are actually getting the orgId here rather than orgName
            const orgId: string = isFirstLevelOrg ? orgIdIdToken : window["AppUtils"].getConfig().organizationName;

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

        // TODO: Test This properly.
        logoutUrl = window[ "AppUtils" ].getConfig().idpConfigs?.logoutEndpointURL;

        if (legacyAuthzRuntime) {
            // Update post_logout_redirect_uri of logout_url with tenant qualified url
            if (sessionStorage.getItem(LOGOUT_URL)) {
                logoutUrl = sessionStorage.getItem(LOGOUT_URL);

                if (
                    !window[ "AppUtils" ].getConfig().accountApp
                        .commonPostLogoutUrl
                ) {
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
                            window[ "AppUtils" ].getConfig().clientOrigin +
                            window[ "AppUtils" ].getConfig().routes.login
                        );
                        logoutRedirectUrl =
                            window[ "AppUtils" ].getConfig().clientOrigin +
                            window[ "AppUtils" ].getConfig().routes.login;
                    }
                }

                // If an override URL is defined in config, use that instead.
                if (
                    window[ "AppUtils" ].getConfig().idpConfigs?.logoutEndpointURL
                ) {
                    logoutUrl = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                        logoutUrl,
                        window[ "AppUtils" ].getConfig().idpConfigs
                            .logoutEndpointURL
                    );
                }

                sessionStorage.setItem(LOGOUT_URL, logoutUrl);
            }
        }

        let wellKnownEndpoint: string = Config.getServiceResourceEndpoints().wellKnown;

        if (!legacyAuthzRuntime) {
            // FIXME: Skipping /o/ appending from the `getServiceResourceEndpoints` level seems to be not working.
            wellKnownEndpoint = wellKnownEndpoint.replace("/o/", "/");
        }

        dispatch(setIsFirstLevelOrganization(isFirstLevelOrg));

        onAppReady();

        sessionStorage.setItem(CommonConstants.SESSION_STATE, response?.sessionState);

        getOIDCServiceEndpoints()
            .then((response: OIDCEndpoints) => {
                let authorizationEndpoint: string = response.authorizationEndpoint;
                let oidcSessionIframeEndpoint: string = response.checkSessionIframe;
                let tokenEndpoint: string = response.tokenEndpoint;

                // If `authorize` endpoint is overridden, save that in the session.
                if (window["AppUtils"].getConfig().idpConfigs?.authorizeEndpointURL) {
                    authorizationEndpoint = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                        authorizationEndpoint,
                        window["AppUtils"].getConfig().idpConfigs.authorizeEndpointURL
                    );
                }

                // If `oidc session iframe` endpoint is overridden, save that in the session.
                if (window["AppUtils"].getConfig().idpConfigs?.oidcSessionIFrameEndpointURL) {
                    oidcSessionIframeEndpoint = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                        oidcSessionIframeEndpoint,
                        window["AppUtils"].getConfig().idpConfigs.oidcSessionIFrameEndpointURL
                    );
                }

                // If `token` endpoint is overridden, save that in the session.
                if (window["AppUtils"].getConfig().idpConfigs?.tokenEndpointURL) {
                    tokenEndpoint = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                        tokenEndpoint,
                        window["AppUtils"].getConfig().idpConfigs.tokenEndpointURL
                    );
                }

                if (isPrivilegedUser) {
                    logoutRedirectUrl =
                        window["AppUtils"].getConfig().clientOrigin + window["AppUtils"].getConfig().routes.login;
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
                    signOutRedirectURL: deriveLogoutRedirectForSubOrgLogins(
                        logoutRedirectUrl,
                        userOrganizationId,
                        orgIdIdToken
                    )
                });
            })
            .catch((error: any) => {
                throw error;
            });

        await dispatch(
            getProfileInformation(
                Config.getServiceResourceEndpoints().me,
                window["AppUtils"].getConfig().clientOriginWithTenant
            )
        );

        if (isFirstLevelOrg) {
            await dispatch(getServerConfigurations());
        }

        onSignInSuccessRedirect(idToken);
        setCustomServerHost(orgType, wellKnownEndpoint);
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
        if (legacyAuthzRuntime) {
            return currentLogoutRedirect;
        }

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
