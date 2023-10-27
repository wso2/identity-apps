/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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
    Hooks,
    OIDCEndpoints,
    SecureApp,
    useAuthContext
} from "@asgardeo/auth-react";
import { GearIcon } from "@oxygen-ui/react-icons";
import { AccessControlUtils } from "@wso2is/access-control";
import useDeploymentConfig from "@wso2is/common/src/hooks/use-deployment-configs";
import useResourceEndpoints from "@wso2is/common/src/hooks/use-resource-endpoints";
import useUIConfig from "@wso2is/common/src/hooks/use-ui-configs";
import {
    AppConstants as CommonAppConstants,
    CommonConstants as CommonConstantsCore,
    TokenConstants
} from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import {
    ChildRouteInterface,
    IdentifiableComponentInterface,
    RouteInterface,
    TenantListInterface
} from "@wso2is/core/models";
import {
    setDeploymentConfigs,
    setServiceResourceEndpoints,
    setSignIn,
    setSupportedI18nLanguages,
    setUIConfigs
} from "@wso2is/core/store";
import {
    AuthenticateUtils as CommonAuthenticateUtils,
    RouteUtils as CommonRouteUtils,
    ContextUtils,
    StringUtils
} from "@wso2is/core/utils";
import {
    I18n,
    I18nInstanceInitException,
    I18nModuleConstants,
    LanguageChangeException,
    isLanguageSupported
} from "@wso2is/i18n";
import { GovernanceConnectorProvider } from "@wso2is/react-components";
import axios, { AxiosResponse } from "axios";
import has from "lodash-es/has";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    LazyExoticComponent,
    ReactElement,
    lazy,
    useCallback,
    useEffect,
    useState
} from "react";
import { I18nextProvider } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { commonConfig, serverConfigurationConfig } from "./extensions";
import {
    AuthenticateUtils,
    getProfileInformation
} from "./features/authentication";
import {
    AppState,
    AppUtils,
    Config,
    DeploymentConfigInterface,
    FeatureConfigInterface,
    HttpUtils,
    PreLoader,
    UIConfigInterface,
    getAppViewRoutes,
    getServerConfigurations,
    getSidePanelIcons,
    setCurrentOrganization,
    setDeveloperVisibility,
    setFilteredDevelopRoutes,
    setGetOrganizationLoading,
    setIsFirstLevelOrganization,
    setOrganization,
    setOrganizationType,
    setSanitizedDevelopRoutes,
    store
} from "./features/core";
import { AppConstants, CommonConstants } from "./features/core/constants";
import { history } from "./features/core/helpers";
import { OrganizationManagementConstants, OrganizationType } from "./features/organizations/constants";
import { OrganizationUtils } from "./features/organizations/utils";
import {
    GovernanceCategoryForOrgsInterface,
    GovernanceConnectorForOrgsInterface,
    useGovernanceConnectorCategories
} from "./features/server-configurations";

const AUTHORIZATION_ENDPOINT: string = "authorization_endpoint";
const TOKEN_ENDPOINT: string = "token_endpoint";
const OIDC_SESSION_IFRAME_ENDPOINT: string = "oidc_session_iframe_endpoint";
const LOGOUT_URL: string = "sign_out_url";

const App: LazyExoticComponent<FunctionComponent> = lazy(() => import("./app"));

type AppPropsInterface = IdentifiableComponentInterface;

/**
 * This component warps the `App` component with the `SecureApp` component to provide automatic authentication.
 *
 * @returns ProtectedApp component (React Element)
 */
export const ProtectedApp: FunctionComponent<AppPropsInterface> = (): ReactElement => {
    const {
        on,
        getDecodedIDToken,
        getOIDCServiceEndpoints,
        updateConfig,
        signIn,
        requestCustomGrant,
        state: { isAuthenticated }
    } = useAuthContext();

    const dispatch: Dispatch<any> = useDispatch();
    const { setResourceEndpoints } = useResourceEndpoints();
    const { setDeploymentConfig } = useDeploymentConfig();
    const { setUIConfig } = useUIConfig();
    const [ governanceConnectors, setGovernanceConnectors ] =
        useState<GovernanceCategoryForOrgsInterface[]>([]);

    const [ renderApp, setRenderApp ] = useState<boolean>(false);
    const [ routesFiltered, setRoutesFiltered ] = useState<boolean>(false);

    const allowedScopes: string = useSelector(
        (state: AppState) => state?.auth?.allowedScopes
    );
    const featureConfig: FeatureConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features
    );
    const isFirstLevelOrg: boolean = useSelector(
        (state: AppState) => state.organization.isFirstLevelOrganization
    );
    const isPrivilegedUser: boolean = useSelector(
        (state: AppState) => state?.auth?.isPrivilegedUser
    );
    const isSuperAdmin: string = useSelector(
        (state: AppState) => state.organization.superAdmin
    );
    const loggedUserName: string = store.getState().profile.profileInfo.userName;

    const [ tenant, setTenant ] = useState<string>("");
    const {
        data: originalConnectorCategories,
        error: connectorCategoriesFetchRequestError
    } = useGovernanceConnectorCategories(
        featureConfig?.residentIdp?.enabled && isFirstLevelOrg);

    useEffect(() => {
        dispatch(
            setDeploymentConfigs<DeploymentConfigInterface>(
                Config.getDeploymentConfig()
            )
        );
        dispatch(setUIConfigs<UIConfigInterface>(Config.getUIConfig()));
        setUIConfig(Config.getUIConfig());
    }, []);

    useEffect(() => {        
        dispatch(setFilteredDevelopRoutes(getAppViewRoutes(commonConfig.useExtendedRoutes)));
        dispatch(setSanitizedDevelopRoutes(getAppViewRoutes(commonConfig.useExtendedRoutes)));
    }, [ dispatch ]);

    useEffect(() => {
        on(Hooks.HttpRequestError, HttpUtils.onHttpRequestError);
        on(Hooks.HttpRequestFinish, HttpUtils.onHttpRequestFinish);
        on(Hooks.HttpRequestStart, HttpUtils.onHttpRequestStart);
        on(Hooks.HttpRequestSuccess, HttpUtils.onHttpRequestSuccess);

        on(Hooks.SignIn, async (signInResponse: BasicUserInfo) => {
            let response: BasicUserInfo = { ...signInResponse };
            let logoutUrl: string;
            let logoutRedirectUrl: string;
            let subOrgIdToken: string;

            const idToken: DecodedIDTokenPayload = await getDecodedIDToken();
            const isPrivilegedUser: boolean =
                idToken?.amr?.length > 0
                    ? idToken?.amr[ 0 ] === "EnterpriseIDPAuthenticator"
                    : false;
            const event: Event = new Event(
                CommonConstantsCore.AUTHENTICATION_SUCCESSFUL_EVENT
            );

            dispatchEvent(event);

            const orgIdIdToken: string = idToken.org_id;
            const orgName: string = idToken.org_name;

            const tenantDomain: string = CommonAuthenticateUtils.deriveTenantDomainFromSubject(
                response.sub
            );

            setTenant(tenantDomain);

            let orgType: OrganizationType;

            if (window[ "AppUtils" ].getConfig().organizationName) {
                orgType = OrganizationType.SUBORGANIZATION;
            } else if (tenantDomain === AppConstants.getSuperTenant()) {
                orgType = OrganizationType.SUPER_ORGANIZATION;
            } else if (orgIdIdToken) {
                orgType = OrganizationType.FIRST_LEVEL_ORGANIZATION;
            } else {
                orgType = OrganizationType.TENANT;
            }

            dispatch(setOrganizationType(orgType));

            const isFirstLevelOrg: boolean =
                !window[ "AppUtils" ].getConfig().organizationName &&
                !!orgIdIdToken;

            dispatch(setIsFirstLevelOrganization(isFirstLevelOrg));

            if (window[ "AppUtils" ].getConfig().organizationName || isFirstLevelOrg) {
                // We are actually getting the orgId here rather than orgName
                const orgId: string = isFirstLevelOrg
                    ? orgIdIdToken
                    : window[ "AppUtils" ].getConfig().organizationName;

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
                    await dispatch(
                        setServiceResourceEndpoints(
                            Config.getServiceResourceEndpoints()
                        )
                    );

                    // Sets the resource endpoints in the context.
                    setResourceEndpoints(Config.getServiceResourceEndpoints() as any);

                    await requestCustomGrant(
                        {
                            attachToken: false,
                            data: {
                                client_id: "{{clientID}}",
                                grant_type: "organization_switch",
                                scope:
                                    window[ "AppUtils" ]
                                        .getConfig()
                                        .idpConfigs?.scope.join(" ") ??
                                    TokenConstants.SYSTEM_SCOPE,
                                switching_organization: orgId,
                                token: "{{token}}"
                            },
                            id: "orgSwitch",
                            returnsSession: true,
                            signInRequired: true
                        },
                        async (grantResponse: BasicUserInfo) => {
                            response = { ...grantResponse };
                        }
                    );
                    
                    setTenant(response.orgId);
                    subOrgIdToken = response.orgId;
                    dispatch(setCurrentOrganization(response.orgName));
                }
            }

            dispatch(setGetOrganizationLoading(false));

            // Update the app base name with the newly resolved tenant.
            window[ "AppUtils" ].updateTenantQualifiedBaseName(tenantDomain);
            // Update the endpoints with tenant path.
            await dispatch(
                setServiceResourceEndpoints(
                    Config.getServiceResourceEndpoints()
                )
            );

            // Sets the resource endpoints in the context.
            setResourceEndpoints(Config.getServiceResourceEndpoints() as any);

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
                    CommonAuthenticateUtils.removeAuthenticationCallbackUrl(
                        CommonAppConstants.CONSOLE_APP
                    );
                }
            }

            // Update runtime configurations.
            ContextUtils.setRuntimeConfig(Config.getDeploymentConfig());

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

            // Set configurations related to hostname branding.
            axios
                .get(Config.getServiceResourceEndpoints().wellKnown)
                .then((response: AxiosResponse) => {

                    // Use token endpoint to extract the host url.
                    const splitted: string[] =
                        response?.data?.token_endpoint?.split("/") ?? [];

                    let serverHost: string = splitted.slice(0, -2).join("/");

                    if (orgType === OrganizationType.SUBORGANIZATION) {
                        serverHost = `${ Config.getDeploymentConfig().serverOrigin
                        }/${ window[ "AppUtils" ].getConfig().organizationPrefix
                        }/${ window[ "AppUtils" ].getConfig().organizationName }`;
                    }

                    window[ "AppUtils" ].updateCustomServerHost(serverHost);
                })
                .catch((error: any) => {
                    // In case of failure customServerHost is set to the serverHost.
                    window[ "AppUtils" ].updateCustomServerHost(
                        Config.getDeploymentConfig().serverHost
                    );

                    throw error;
                })
                .finally(() => {
                    // Update store with custom server host.
                    dispatch(
                        setDeploymentConfigs<DeploymentConfigInterface>(
                            Config.getDeploymentConfig()
                        )
                    );

                    // Set the deployment configs in the context.
                    setDeploymentConfig(Config.getDeploymentConfig());

                    // Update runtime configurations.
                    ContextUtils.setRuntimeConfig(Config.getDeploymentConfig());
                });

            const firstName: string = idToken?.given_name;
            const lastName: string = idToken?.family_name;
            const fullName: string = firstName
                ? firstName + (lastName ? " " + lastName : "")
                : response.email;

            dispatch(
                setSignIn<AuthenticatedUserInfo & TenantListInterface>(
                    Object.assign(
                        CommonAuthenticateUtils.getSignInState(response, subOrgIdToken),
                        {
                            associatedTenants: isPrivilegedUser
                                ? tenantDomain
                                : idToken?.associated_tenants,
                            defaultTenant: isPrivilegedUser
                                ? tenantDomain
                                : idToken?.default_tenant,
                            fullName: fullName,
                            isPrivilegedUser: isPrivilegedUser
                        }
                    )
                )
            );

            setRenderApp(true);

            sessionStorage.setItem(
                CommonConstants.SESSION_STATE,
                response?.sessionState
            );

            getOIDCServiceEndpoints()
                .then((response: OIDCEndpoints) => {
                    let authorizationEndpoint: string =
                        response.authorizationEndpoint;
                    let oidcSessionIframeEndpoint: string =
                        response.checkSessionIframe;
                    let tokenEndpoint: string = response.tokenEndpoint;

                    // If `authorize` endpoint is overridden, save that in the session.
                    if (
                        window[ "AppUtils" ].getConfig().idpConfigs
                            ?.authorizeEndpointURL
                    ) {
                        authorizationEndpoint = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                            authorizationEndpoint,
                            window[ "AppUtils" ].getConfig().idpConfigs
                                .authorizeEndpointURL
                        );
                    }

                    // If `oidc session iframe` endpoint is overridden, save that in the session.
                    if (
                        window[ "AppUtils" ].getConfig().idpConfigs
                            ?.oidcSessionIFrameEndpointURL
                    ) {
                        oidcSessionIframeEndpoint = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                            oidcSessionIframeEndpoint,
                            window[ "AppUtils" ].getConfig().idpConfigs
                                .oidcSessionIFrameEndpointURL
                        );
                    }

                    // If `token` endpoint is overridden, save that in the session.
                    if (
                        window[ "AppUtils" ].getConfig().idpConfigs
                            ?.tokenEndpointURL
                    ) {
                        tokenEndpoint = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                            tokenEndpoint,
                            window[ "AppUtils" ].getConfig().idpConfigs
                                .tokenEndpointURL
                        );
                    }

                    if (isPrivilegedUser) {
                        logoutRedirectUrl =
                            window[ "AppUtils" ].getConfig().clientOrigin +
                            window[ "AppUtils" ].getConfig().routes.login;
                    }

                    sessionStorage.setItem(
                        AUTHORIZATION_ENDPOINT,
                        authorizationEndpoint
                    );
                    sessionStorage.setItem(
                        OIDC_SESSION_IFRAME_ENDPOINT,
                        oidcSessionIframeEndpoint
                    );
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
                .catch((error: any) => {
                    throw error;
                });

            await dispatch(
                getProfileInformation(
                    Config.getServiceResourceEndpoints().me,
                    window[ "AppUtils" ].getConfig().clientOriginWithTenant
                )
            );

            if (isFirstLevelOrg) {
                await dispatch(getServerConfigurations());
            }

            loginSuccessRedirect(idToken);
        });
    }, []);

    useEffect(() => {
        if (!originalConnectorCategories ||
            originalConnectorCategories instanceof IdentityAppsApiException ||
            connectorCategoriesFetchRequestError) {
            return;
        }

        setGovernanceConnectors(originalConnectorCategories);        
    }, [ originalConnectorCategories ]);

    const loginSuccessRedirect = (idToken: DecodedIDTokenPayload): void => {
        const AuthenticationCallbackUrl: string = CommonAuthenticateUtils.getAuthenticationCallbackUrl(
            CommonAppConstants.CONSOLE_APP
        );

        /**
         * Prevent redirect to landing page when there is no association.
         */
        if (commonConfig?.enableOrganizationAssociations) {

            const isPrivilegedUser: boolean =
                idToken?.amr?.length > 0
                    ? idToken?.amr[ 0 ] === "EnterpriseIDPAuthenticator"
                    : false;

            if (has(idToken, "associated_tenants") || isPrivilegedUser) {
                // If there is an association, the user should be redirected to console landing page.
                const location: string =
                    !AuthenticationCallbackUrl ||
                    (AuthenticationCallbackUrl ===
                        AppConstants.getAppLoginPath() ||
                            AuthenticationCallbackUrl ===
                            `${AppConstants.getAppLoginPath()}/`) ||
                            AuthenticationCallbackUrl ===
                            `${ window[ "AppUtils" ].getConfig()
                                .appBaseWithTenant
                            }/` ||
                        AppUtils.isAuthCallbackURLFromAnotherTenant(
                            AuthenticationCallbackUrl, CommonAuthenticateUtils.deriveTenantDomainFromSubject(
                                idToken.sub))
                        ? AppConstants.getAppHomePath()
                        : AuthenticationCallbackUrl;

                history.push(location);
            } else {
                // If there is no assocation, the user should be redirected to creation flow.
                history.push({
                    pathname: AppConstants.getPaths().get(
                        "CREATE_TENANT"
                    )
                });
            }
        } else {
            const location: string =
                !AuthenticationCallbackUrl ||
                    (AuthenticationCallbackUrl ===
                        AppConstants.getAppLoginPath() ||
                            AuthenticationCallbackUrl ===
                            `${AppConstants.getAppLoginPath()}/`) ||
                        AuthenticationCallbackUrl ===
                        `${ window[ "AppUtils" ].getConfig().appBaseWithTenant }/` ||
                    AppUtils.isAuthCallbackURLFromAnotherTenant(
                        AuthenticationCallbackUrl,
                        CommonAuthenticateUtils.deriveTenantDomainFromSubject(idToken.sub)
                    )
                    ? AppConstants.getAppHomePath()
                    : AuthenticationCallbackUrl;

            history.push(location);
        }
    };

    const filterRoutes: () => void = useCallback((): void => {
        if (
            isEmpty(allowedScopes) ||
            !featureConfig.applications ||
            !featureConfig.users
        ) {
            return;
        }
        
        const resolveHiddenRoutes = (): string[] => {
            const commonHiddenRoutes: string[] = [
                ...AppUtils.getHiddenRoutes(),
                ...AppConstants.ORGANIZATION_ONLY_ROUTES
            ];
            
            function getAdditionalRoutes() {
                if (!isOrganizationManagementEnabled) {
                    return [ ...AppUtils.getHiddenRoutes(), ...AppConstants.ORGANIZATION_ROUTES ];
                }

                const isCurrentOrgRootAndSuperTenant: boolean =
                    OrganizationUtils.isCurrentOrganizationRoot() && AppConstants.getSuperTenant() === tenant;

                if (isCurrentOrgRootAndSuperTenant || isFirstLevelOrg) {
                    if (isPrivilegedUser) {
                        if (loggedUserName === isSuperAdmin) {
                            return [ ...commonHiddenRoutes, ...AppConstants.ORGANIZATION_ROUTES ];
                        } else {
                            return [
                                ...commonHiddenRoutes,
                                ...AppConstants.ORGANIZATION_ROUTES,
                                ...AppConstants.SUPER_ADMIN_ONLY_ROUTES
                            ];
                        }
                    } else {
                        if (loggedUserName === isSuperAdmin) {
                            return commonHiddenRoutes;
                        } else {
                            return [ ...commonHiddenRoutes, ...AppConstants.SUPER_ADMIN_ONLY_ROUTES ];
                        }
                    }
                } else {
                    if (window["AppUtils"].getConfig().organizationName) {
                        return [ 
                            ...AppUtils.getHiddenRoutes(), 
                            ...OrganizationManagementConstants.ORGANIZATION_ROUTES 
                        ];
                    } else {
                        return [ ...AppUtils.getHiddenRoutes(), ...AppConstants.ORGANIZATION_ROUTES ];
                    }
                }
            }
            
            const additionalRoutes: string[] = getAdditionalRoutes();

            return [ ...additionalRoutes ];
        };

        const [
            appRoutes,
            sanitizedAppRoutes
        ] = CommonRouteUtils.filterEnabledRoutes<FeatureConfigInterface>(
            getAppViewRoutes(commonConfig.useExtendedRoutes),
            featureConfig,
            allowedScopes,
            window[ "AppUtils" ].getConfig().organizationName ? false : commonConfig.checkForUIResourceScopes,
            resolveHiddenRoutes(),
            !OrganizationUtils.isCurrentOrganizationRoot() &&
            !isFirstLevelOrg &&
            AppConstants.ORGANIZATION_ENABLED_ROUTES
        );

        // TODO : Remove this logic once getting started pages are removed.
        if (
            appRoutes.length === 2 &&
            appRoutes.filter(
                (route: RouteInterface) =>
                    route.id ===
                    AccessControlUtils.DEVELOP_GETTING_STARTED_ID ||
                    route.id === "404"
            ).length === 2
        ) {
            appRoutes[ 0 ] = appRoutes[ 0 ].filter((route: RouteInterface) => route.id === "404");
        }

        if (governanceConnectors?.length > 0) {
            const customGovernanceConnectorRoutes: RouteInterface[] = [];

            governanceConnectors.forEach((category: GovernanceCategoryForOrgsInterface) => {                
                if (!serverConfigurationConfig.connectorCategoriesToShow.includes(category.id)) {
                    const governanceConnectorChildren: ChildRouteInterface[] = [];

                    category?.connectors?.forEach((connector: GovernanceConnectorForOrgsInterface) => {
                        governanceConnectorChildren.push({
                            component: lazy(() =>
                                import(
                                    "./features/server-configurations/pages/connector-edit-page"
                                )
                            ),
                            exact: true,
                            icon: {
                                icon: getSidePanelIcons().childIcon
                            },
                            id: connector.id,
                            name: connector.name,
                            path: AppConstants.getPaths().get("GOVERNANCE_CONNECTOR_EDIT")
                                .replace(
                                    ":categoryId",
                                    category.id
                                )
                                .replace(
                                    ":connectorId",
                                    connector.id
                                ),
                            protected: true,
                            showOnSidePanel: false
                        });
                    });

                    customGovernanceConnectorRoutes.push(
                        {
                            category: category.id,
                            children: governanceConnectorChildren,
                            component: lazy(() =>
                                import(
                                    "./features/server-configurations/pages/connector-listing-page"
                                )
                            ),
                            exact: true,
                            icon: {
                                icon: <GearIcon />
                            },
                            id: category.id,
                            name: category.name,
                            path: AppConstants.getPaths().get("GOVERNANCE_CONNECTOR")
                                .replace(":id", category.id),
                            protected: true,
                            showOnSidePanel: true
                        }
                    );
                }
            });

            appRoutes.push(...customGovernanceConnectorRoutes);
            sanitizedAppRoutes.push(...customGovernanceConnectorRoutes);            
        }
        
        dispatch(setFilteredDevelopRoutes(appRoutes));        
        dispatch(setSanitizedDevelopRoutes(sanitizedAppRoutes));

        setRoutesFiltered(true);

        if (sanitizedAppRoutes.length < 1) {
            dispatch(setDeveloperVisibility(false));
        }

        if (sanitizedAppRoutes.length < 1) {
            history.push({
                pathname: AppConstants.getPaths().get("UNAUTHORIZED"),
                search:
                    "?error=" + AppConstants.LOGIN_ERRORS.get("ACCESS_DENIED")
            });
        }
    }, [ allowedScopes, dispatch, featureConfig, governanceConnectors, isFirstLevelOrg, isSuperAdmin ]);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        filterRoutes();
    }, [ filterRoutes, governanceConnectors, isAuthenticated ]);

    useEffect(() => {
        const error: string = new URLSearchParams(location.search).get(
            "error_description"
        );

        if (error === AppConstants.USER_DENIED_CONSENT_SERVER_ERROR) {
            history.push({
                pathname: AppConstants.getPaths().get("UNAUTHORIZED"),
                search:
                    "?error=" +
                    AppConstants.LOGIN_ERRORS.get("USER_DENIED_CONSENT")
            });

            return;
        }
    }, []);

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
            ? `/${ StringUtils.removeSlashesFromPath(
                Config.getDeploymentConfig().appBaseNameWithoutTenant
            ) }`
            : "";

        const metaFileNames: string[] = I18nModuleConstants.META_FILENAME.split(".");
        const metaFileName: string = `${ metaFileNames[ 0 ] }.${ process.env.metaHash }.${ metaFileNames[ 1 ] }`;

        // Since the portals are not deployed per tenant, looking for static resources in tenant qualified URLs
        // will fail. This constructs the path without the tenant, therefore it'll look for the file in
        // `https://localhost:9443/<PORTAL>/resources/i18n/meta.json` rather than looking for the file in
        // `https://localhost:9443/t/wso2.com/<PORTAL>/resources/i18n/meta.json`.
        const metaPath: string = `${ resolvedAppBaseNameWithoutTenant }/${ StringUtils.removeSlashesFromPath(
            Config.getI18nConfig().resourcePath
        ) }/${ metaFileName }`;

        // Fetch the meta file to get the supported languages and paths.
        axios
            .get(metaPath)
            .then((response: AxiosResponse) => {
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

                    const isSupported: boolean = isLanguageSupported(
                        I18n.instance.language,
                        null,
                        response?.data
                    );

                    if (!isSupported) {
                        I18n.instance
                            .changeLanguage(
                                I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE
                            )
                            .catch((error: any) => {
                                throw new LanguageChangeException(
                                    I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE,
                                    error
                                );
                            });
                    }
                });
            })
            .catch((error: any) => {
                throw new I18nInstanceInitException(error);
            });
    }, [ isAuthenticated ]);

    return (
        <SecureApp
            fallback={ <PreLoader /> }
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
            <GovernanceConnectorProvider connectorCategories={ governanceConnectors }>
                <I18nextProvider i18n={ I18n.instance }>
                    { renderApp && routesFiltered ? <App /> : <PreLoader /> }
                </I18nextProvider>
            </GovernanceConnectorProvider>
        </SecureApp>
    );
};
