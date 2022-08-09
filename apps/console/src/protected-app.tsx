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
    DecodedIDTokenPayload,
    Hooks,
    OIDCEndpoints,
    SecureApp,
    useAuthContext
} from "@asgardeo/auth-react";
import { AccessControlUtils } from "@wso2is/access-control";
import {
    AppConstants as CommonAppConstants,
    CommonConstants as CommonConstantsCore,
    TokenConstants
} from "@wso2is/core/constants";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface, RouteInterface, TenantListInterface } from "@wso2is/core/models";
import {
    addAlert,
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
import axios, { AxiosResponse } from "axios";
import has from "lodash-es/has";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, lazy, useCallback, useEffect, useRef, useState } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { commonConfig, serverConfigurationConfig } from "./extensions";
import { AuthenticateUtils, getProfileInformation } from "./features/authentication";
import {
    AppState,
    AppUtils,
    Config,
    DeploymentConfigInterface,
    FeatureConfigInterface,
    HttpUtils,
    PreLoader,
    UIConfigInterface,
    getAdminViewRoutes,
    getDeveloperViewRoutes,
    getSidePanelIcons,
    setDeveloperVisibility,
    setFilteredDevelopRoutes,
    setFilteredManageRoutes,
    setGetOrganizationLoading,
    setManageVisibility,
    setOrganization,
    setSanitizedDevelopRoutes,
    setSanitizedManageRoutes,
    store
} from "./features/core";
import { AppConstants, CommonConstants } from "./features/core/constants";
import { history } from "./features/core/helpers";
import { getOrganization } from "./features/organizations/api";
import { OrganizationResponseInterface } from "./features/organizations/models";
import { OrganizationUtils } from "./features/organizations/utils";
import {
    GovernanceConnectorCategoryInterface,
    GovernanceConnectorUtils,
    ServerConfigurationsConstants
} from "./features/server-configurations";

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
        getDecodedIDToken,
        getOIDCServiceEndpoints,
        updateConfig,
        signIn,
        requestCustomGrant,
        state: { isAuthenticated }
    } = useAuthContext();

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [ renderApp, setRenderApp ] = useState<boolean>(false);
    const [ routesFiltered, setRoutesFiltered ] = useState<boolean>(false);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const governanceConnectorCategories: GovernanceConnectorCategoryInterface[] = useSelector(
        (state: AppState) => state.governanceConnector.categories);
    const filteredManageRoutes: RouteInterface[] = useSelector(
        (state: AppState) => state.routes.manageRoutes.filteredRoutes
    );
    const sanitizedManageRoutes: RouteInterface[] = useSelector(
        (state: AppState) => state.routes.manageRoutes.sanitizedRoutes
    );

    const governanceConnectorsLoaded = useRef(false);

    useEffect(() => {
        dispatch(setDeploymentConfigs<DeploymentConfigInterface>(Config.getDeploymentConfig()));
        dispatch(setUIConfigs<UIConfigInterface>(Config.getUIConfig()));
    }, []);

    useEffect(() => {
        dispatch(setFilteredDevelopRoutes(getDeveloperViewRoutes()));
        dispatch(setFilteredManageRoutes(getAdminViewRoutes()));
        dispatch(setSanitizedDevelopRoutes(getDeveloperViewRoutes()));
        dispatch(setSanitizedManageRoutes(getAdminViewRoutes()));
    }, [ dispatch ]);

    useEffect(() => {
        on(Hooks.HttpRequestError, HttpUtils.onHttpRequestError);
        on(Hooks.HttpRequestFinish, HttpUtils.onHttpRequestFinish);
        on(Hooks.HttpRequestStart, HttpUtils.onHttpRequestStart);
        on(Hooks.HttpRequestSuccess, HttpUtils.onHttpRequestSuccess);

        on(Hooks.SignIn, async (signInResponse: BasicUserInfo) => {
            let response: BasicUserInfo = { ...signInResponse };
            let logoutUrl;
            let logoutRedirectUrl;
            let isPrivilegedUser: boolean = false;

            const event = new Event(CommonConstantsCore.AUTHENTICATION_SUCCESSFUL_EVENT);

            dispatchEvent(event);

            let tenantDomain: string = "";

            if (window[ "AppUtils" ].getConfig().organizationName) {
                // We are actually getting the orgId here rather than orgName
                const orgId = window["AppUtils"].getConfig().organizationName;

                // Setting a dummy object until real data comes from the API
                dispatch(setOrganization({
                    attributes: [],
                    created: new Date().toString(),
                    description: "",
                    domain: "",
                    id: orgId,
                    lastModified: new Date().toString(),
                    name: orgId,
                    parent: {
                        id: "",
                        ref: ""
                    },
                    status: "",
                    type: ""
                }));

                // This is to make sure the endpoints are generated with the organization path.
                await dispatch(setServiceResourceEndpoints(Config.getServiceResourceEndpoints()));

                await requestCustomGrant({
                    attachToken: false,
                    data: {
                        client_id: "{{clientID}}",
                        grant_type: "organization_switch",
                        scope: window["AppUtils"].getConfig().idpConfigs?.scope.join(" ")
                            ?? TokenConstants.SYSTEM_SCOPE,
                        switching_organization: orgId,
                        token: "{{token}}"
                    },
                    id: "orgSwitch",
                    returnsSession: true,
                    signInRequired: true
                }, async (grantResponse: BasicUserInfo) => {
                    response = { ...grantResponse };
                });

                dispatch(setGetOrganizationLoading(true));
                await getOrganization(orgId)
                    .then(async (orgResponse: OrganizationResponseInterface) => {
                        dispatch(setOrganization(orgResponse));
                    }).catch((error) => {
                        if (error?.description) {
                            dispatch(
                                addAlert({
                                    description: error.description,
                                    level: AlertLevels.ERROR,
                                    message: t(
                                        "console:manage.features.organizations.notifications." +
                                "fetchOrganization.error.message"
                                    )
                                })
                            );

                            return;
                        }

                        dispatch(
                            addAlert({
                                description: t(
                                    "console:manage.features.organizations.notifications.fetchOrganization" +
                            ".genericError.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:manage.features.organizations.notifications." +
                            "fetchOrganization.genericError.message"
                                )
                            })
                        );
                    }).finally(() => {
                        dispatch(setGetOrganizationLoading(false));
                    });
            } else {
                dispatch(setGetOrganizationLoading(false));
                tenantDomain = CommonAuthenticateUtils.deriveTenantDomainFromSubject(response.sub);
            }

            // Update the app base name with the newly resolved tenant.
            window[ "AppUtils" ].updateTenantQualifiedBaseName(tenantDomain);
            // Update the endpoints with tenant path.
            await dispatch(setServiceResourceEndpoints(Config.getServiceResourceEndpoints()));

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

            // Update post_logout_redirect_uri of logout_url with tenant qualified url
            if (sessionStorage.getItem(LOGOUT_URL)) {
                logoutUrl = sessionStorage.getItem(LOGOUT_URL);

                if (!window[ "AppUtils" ].getConfig().accountApp.commonPostLogoutUrl) {
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
                            window[ "AppUtils" ].getConfig().clientOrigin
                            + window[ "AppUtils" ].getConfig().routes.login
                        );
                        logoutRedirectUrl = window[ "AppUtils" ].getConfig().clientOrigin
                            + window[ "AppUtils" ].getConfig().routes.login;
                    }
                }

                // If an override URL is defined in config, use that instead.
                if (window[ "AppUtils" ].getConfig().idpConfigs?.logoutEndpointURL) {
                    logoutUrl = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                        logoutUrl,
                        window[ "AppUtils" ].getConfig().idpConfigs.logoutEndpointURL
                    );
                }

                sessionStorage.setItem(LOGOUT_URL, logoutUrl);
            }

            // Set configurations related to hostname branding.
            axios
                .get(Config.getServiceResourceEndpoints().wellKnown)
                .then((response: AxiosResponse) => {
                    // Use token endpoint to extract the host url.
                    const splitted: string[] = response?.data?.token_endpoint?.split("/") ?? [];
                    const serverHost: string = splitted.slice(0, -2).join("/");

                    window[ "AppUtils" ].updateCustomServerHost(serverHost);
                })
                .catch((error) => {
                    // In case of failure customServerHost is set to the serverHost
                    window[ "AppUtils" ].updateCustomServerHost(Config.getDeploymentConfig().serverHost);

                    throw error;
                })
                .finally(() => {
                    // Update store with custom server host.
                    dispatch(setDeploymentConfigs<DeploymentConfigInterface>(Config.getDeploymentConfig()));

                    // Update runtime configurations.
                    ContextUtils.setRuntimeConfig(Config.getDeploymentConfig());
                });

            await getDecodedIDToken()
                .then(async (idToken) => {
                    const tenantDomain: string = CommonAuthenticateUtils.deriveTenantDomainFromSubject(idToken?.sub);

                    isPrivilegedUser = idToken?.amr?.length > 0
                        ? idToken?.amr[0] === "EnterpriseIDPAuthenticator"
                        : false;
                    const firstName = idToken?.given_name;
                    const lastName = idToken?.family_name;
                    const fullName = firstName ? (firstName + (lastName ? (" " + lastName) : "")) : response.email;

                    await dispatch(
                        setSignIn<AuthenticatedUserInfo & TenantListInterface>(
                            Object.assign(CommonAuthenticateUtils.getSignInState(response), {
                                associatedTenants:  isPrivilegedUser ? tenantDomain : idToken?.associated_tenants,
                                defaultTenant: isPrivilegedUser ? tenantDomain : idToken?.default_tenant,
                                fullName: fullName,
                                isPrivilegedUser: isPrivilegedUser
                            })
                        )
                    );

                    setRenderApp(true);
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
                        authorizationEndpoint = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                            authorizationEndpoint,
                            window[ "AppUtils" ].getConfig().idpConfigs.authorizeEndpointURL
                        );
                    }

                    // If `oidc session iframe` endpoint is overridden, save that in the session.
                    if (window[ "AppUtils" ].getConfig().idpConfigs?.oidcSessionIFrameEndpointURL) {
                        oidcSessionIframeEndpoint = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                            oidcSessionIframeEndpoint,
                            window[ "AppUtils" ].getConfig().idpConfigs.oidcSessionIFrameEndpointURL
                        );
                    }

                    // If `token` endpoint is overridden, save that in the session.
                    if (window[ "AppUtils" ].getConfig().idpConfigs?.tokenEndpointURL) {
                        tokenEndpoint = AuthenticateUtils.resolveIdpURLSAfterTenantResolves(
                            tokenEndpoint,
                            window[ "AppUtils" ].getConfig().idpConfigs.tokenEndpointURL
                        );
                    }

                    if (isPrivilegedUser) {
                        logoutRedirectUrl = window[ "AppUtils" ].getConfig().clientOrigin
                            + window[ "AppUtils" ].getConfig().routes.login;
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

            await dispatch(
                getProfileInformation(
                    Config.getServiceResourceEndpoints().me,
                    window[ "AppUtils" ].getConfig().clientOriginWithTenant
                )
            );

        });
    }, []);

    const loginSuccessRedirect = (): void => {
        const AuthenticationCallbackUrl = CommonAuthenticateUtils.getAuthenticationCallbackUrl(
            CommonAppConstants.CONSOLE_APP
        );

        if(commonConfig?.enableOrganizationAssociations) {
            /**
             * Prevent redirect to landing page when there is no association.
             */
            getDecodedIDToken()
                .then((idToken: DecodedIDTokenPayload) => {
                    const isPrivilegedUser = idToken?.amr?.length > 0
                        ? idToken?.amr[0] === "EnterpriseIDPAuthenticator"
                        : false;

                    if(has(idToken, "associated_tenants") || isPrivilegedUser) {
                        // If there is an association, the user should be redirected to console landing page.
                        const location =
                            !AuthenticationCallbackUrl || AuthenticationCallbackUrl === AppConstants.getAppLoginPath()
                                ? AppConstants.getAppHomePath()
                                : AuthenticationCallbackUrl;

                        history.push(location);
                    } else {
                        // If there is no assocation, the user should be redirected to creation flow.
                        history.push({
                            pathname: AppConstants.getPaths().get("CREATE_TENANT")
                        });
                    }
                })
                .catch(() => {
                    // No need to show UI errors here.
                    // Add debug logs here one a logger is added.
                    // Tracked here https://github.com/wso2/product-is/issues/11650.
                });
        } else {
            const location =
                        !AuthenticationCallbackUrl || AuthenticationCallbackUrl === AppConstants.getAppLoginPath()
                            ? AppConstants.getAppHomePath()
                            : AuthenticationCallbackUrl;

            history.push(location);
        }
    };

    const filterRoutes = useCallback((): void => {
        if (isEmpty(allowedScopes) || !featureConfig.applications || !featureConfig.users) {
            return;
        }

        const [ devRoutes, sanitizedDevRoutes ] = CommonRouteUtils.filterEnabledRoutes<FeatureConfigInterface>(
            getDeveloperViewRoutes(),
            featureConfig,
            allowedScopes,
            commonConfig.checkForUIResourceScopes,
            AppUtils.getHiddenRoutes(),
            !OrganizationUtils.isCurrentOrganizationRoot() && AppConstants.ORGANIZATION_ENABLED_ROUTES);

        const [ manageRoutes, sanitizedManageRoutes ] = CommonRouteUtils.filterEnabledRoutes<FeatureConfigInterface>(
            getAdminViewRoutes(),
            featureConfig,
            allowedScopes,
            commonConfig.checkForUIResourceScopes,
            OrganizationUtils.isCurrentOrganizationRoot()
                ? [ ...AppUtils.getHiddenRoutes(), ...AppConstants.ORGANIZATION_ONLY_ROUTES ]
                : AppUtils.getHiddenRoutes(),
            !OrganizationUtils.isCurrentOrganizationRoot() && AppConstants.ORGANIZATION_ENABLED_ROUTES,
            (route: RouteInterface) => {
                if (route.id === "organization-roles") {
                    route.name = "Roles";
                }
            });

        // TODO : Remove this logic once getting started pages are removed.
        if (devRoutes.length === 2
            && devRoutes.filter(route => route.id === AccessControlUtils.DEVELOP_GETTING_STARTED_ID
                || route.id === "404").length === 2) {
            devRoutes[0] = devRoutes[0].filter(route => route.id === "404");
        }

        dispatch(setFilteredDevelopRoutes(devRoutes));
        dispatch(setFilteredManageRoutes(manageRoutes));
        dispatch(setSanitizedDevelopRoutes(sanitizedDevRoutes));
        dispatch(setSanitizedManageRoutes(sanitizedManageRoutes));

        setRoutesFiltered(true);

        if (sanitizedManageRoutes.length < 1) {
            dispatch(setManageVisibility(false));
        }

        if (sanitizedDevRoutes.length < 1) {
            dispatch(setDeveloperVisibility(false));
        }
    }, [ allowedScopes, dispatch, featureConfig ]);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        filterRoutes();
    }, [ filterRoutes, isAuthenticated ]);

    useEffect(() => {
        if (!governanceConnectorCategories ||
            governanceConnectorCategories.length === 0 ||
            governanceConnectorsLoaded.current) {
            return;
        }

        const manageRoutes = [ ...filteredManageRoutes ];
        const sanitizedRoutes = [ ...sanitizedManageRoutes ];

        serverConfigurationConfig.showConnectorsOnTheSidePanel &&
                governanceConnectorCategories?.map((category: GovernanceConnectorCategoryInterface, index: number) => {
                    let subCategoryExists = false;

                    category.connectors?.map((connector) => {
                        if (connector.subCategory !== "DEFAULT") {
                            subCategoryExists = true;

                            return;
                        }
                    });
                    if (subCategoryExists) {
                        // TODO: Implement sub category handling logic here.
                    }

                    const route = {
                        category: "console:manage.features.sidePanel.categories.configurations",
                        component: lazy(() => import("./features/server-configurations/pages/governance-connectors")),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().connectors[ category.id ]
                                ?? getSidePanelIcons().connectors.default
                        },
                        id: category.id,
                        name: category.name,
                        order:
                            category.id === ServerConfigurationsConstants.OTHER_SETTINGS_CONNECTOR_CATEGORY_ID
                                ? manageRoutes.length + governanceConnectorCategories.length
                                : manageRoutes.length + index,
                        path: AppConstants.getPaths()
                            .get("GOVERNANCE_CONNECTORS")
                            .replace(":id", category.id),
                        protected: true,
                        showOnSidePanel: true
                    };

                    manageRoutes.unshift(route);
                    sanitizedRoutes.unshift(route);
                });

        dispatch(setFilteredManageRoutes(manageRoutes));
        dispatch(setSanitizedManageRoutes(sanitizedRoutes));
        governanceConnectorsLoaded.current = true;

    }, [ governanceConnectorCategories, filteredManageRoutes, sanitizedManageRoutes ]);

    useEffect(() => {
        if (!allowedScopes) {
            return;
        }

        if (!(governanceConnectorCategories !== undefined && governanceConnectorCategories.length > 0)) {
            if (
                (
                    featureConfig?.governanceConnectors?.enabled  &&
                    serverConfigurationConfig.showConnectorsOnTheSidePanel &&
                    hasRequiredScopes(
                        featureConfig.governanceConnectors,
                        featureConfig.governanceConnectors.scopes.read,
                        allowedScopes
                    ) &&
                    OrganizationUtils.isCurrentOrganizationRoot()
                )
            ) {
                GovernanceConnectorUtils.getGovernanceConnectors();
            }
        }
    }, [ governanceConnectorCategories, featureConfig, allowedScopes ]);

    useEffect(() => {
        const error = new URLSearchParams(location.search).get("error_description");

        if (error === AppConstants.USER_DENIED_CONSENT_SERVER_ERROR) {
            history.push({
                pathname: AppConstants.getPaths().get("UNAUTHORIZED"),
                search: "?error=" + AppConstants.LOGIN_ERRORS.get("USER_DENIED_CONSENT")
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

        // Fetch the meta file to get the supported languages and paths.
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
                { renderApp && routesFiltered ? <App /> : <PreLoader /> }
            </I18nextProvider>
        </SecureApp>
    );
};
