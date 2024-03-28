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
    BasicUserInfo,
    DecodedIDTokenPayload,
    Hooks,
    SecureApp,
    useAuthContext
} from "@asgardeo/auth-react";
import useUIConfig from "@wso2is/common/src/hooks/use-ui-configs";
import {
    AppConstants as CommonAppConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    setDeploymentConfigs,
    setSupportedI18nLanguages,
    setUIConfigs
} from "@wso2is/core/store";
import {
    AuthenticateUtils as CommonAuthenticateUtils,
    SessionStorageUtils,
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
import React, {
    FunctionComponent,
    LazyExoticComponent,
    ReactElement,
    lazy,
    useEffect,
    useState
} from "react";
import { I18nextProvider } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { commonConfig } from "./extensions";
import useTenantTier from "./extensions/components/subscription/api/subscription";
import { TenantTier } from "./extensions/components/subscription/models/subscription";
import { SubscriptionProvider } from "./extensions/components/subscription/providers/subscription-provider";
import useSignIn from "./features/authentication/hooks/use-sign-in";
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
    setFilteredDevelopRoutes,
    setSanitizedDevelopRoutes,
    store
} from "./features/core";
import { AppConstants } from "./features/core/constants";
import { history } from "./features/core/helpers";
import { setCurrentEnvironment, setLoggedInUserId } from "./features/core/store/actions/environment";
import useRoutes from "./features/core/hooks/use-routes";
import useOrganizationSwitch from "./features/organizations/hooks/use-organization-switch";
import {
    GovernanceCategoryForOrgsInterface,
    useGovernanceConnectorCategories
} from "./features/server-configurations";
import {
    TokenConstants
} from "@wso2is/core/constants";
const LOGOUT_URL: string = "sign_out_url-instance_0-CONSOLE";

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
        signIn,
        state: { isAuthenticated },
        updateConfig,
        getDecodedIDToken,
        getIDToken,
        requestCustomGrant,
    } = useAuthContext();

    const dispatch: Dispatch<any> = useDispatch();

    const { onSignIn } = useSignIn();

    const { switchOrganization } = useOrganizationSwitch();

    const { filterRoutes } = useRoutes();

    const { setUIConfig } = useUIConfig();

    const { data: tenantTier } = useTenantTier();

    const featureConfig: FeatureConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features
    );
    const isFirstLevelOrg: boolean = useSelector(
        (state: AppState) => state.organization.isFirstLevelOrganization
    );
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const [ tenant, setTenant ] = useState<string>("");
    const {
        data: originalConnectorCategories,
        error: connectorCategoriesFetchRequestError
    } = useGovernanceConnectorCategories(
        featureConfig?.server?.enabled && isFirstLevelOrg &&
        hasRequiredScopes(featureConfig?.governanceConnectors, featureConfig?.governanceConnectors?.scopes?.read,
            allowedScopes));

    const [ renderApp, setRenderApp ] = useState<boolean>(false);
    const [ routesFiltered, setRoutesFiltered ] = useState<boolean>(false);
    const [ governanceConnectors, setGovernanceConnectors ] = useState<GovernanceCategoryForOrgsInterface[]>([]);

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

            const idToken: DecodedIDTokenPayload = await getDecodedIDToken();
            const isPrivilegedUser: boolean =
                idToken?.amr?.length > 0
                    ? idToken?.amr[ 0 ] === "EnterpriseIDPAuthenticator"
                    : false;
            const getOrganizationName = () => {
                const path: string = SessionStorageUtils.getItemFromSessionStorage("auth_callback_url_console")
                    ?? window.location.pathname;
                const pathChunks: string[] = path.split("/");

                const orgPrefixIndex: number = pathChunks.indexOf(window["AppUtils"].getConfig().organizationPrefix);

                if (orgPrefixIndex !== -1) {
                    return pathChunks[ orgPrefixIndex + 1 ];
                }

                return "";
            };
            let associatedTenants = []
            if (response?.orgUserAssociations) {
                associatedTenants = JSON.parse(response?.orgUserAssociations)?.map((association) => association?.orgName);
            }
            try {
                response = { ...signInResponse };
                dispatch(setLoggedInUserId(idToken?.userid));
                console.log("logged in user id...", idToken?.userid)
                let switchingTenant: string = ""
                if (Config.getDeploymentConfig().isRegionalConsole) {
                    console.log("regional switch")
                    response = await switchRegionalConsole(response?.orgUserAssociations);
                    switchingTenant  = CommonAuthenticateUtils.deriveTenantDomainFromSubject(response.sub);
                    console.log("regional response", response)
                }
                console.log("switching tenant", switchingTenant)
                if (getOrganizationName()) {
                    await updateConfig(
                        {
                            endpoints: {
                                authorizationEndpoint: Config.getDeploymentConfig().serverOrigin + "/t/" + switchingTenant + "/oauth2/authorize",
                                checkSessionIframe: Config.getDeploymentConfig().serverOrigin + "/t/" + switchingTenant + "/oidc/checksession",
                                tokenEndpoint: Config.getDeploymentConfig().serverOrigin + "/t/" + switchingTenant + "/oauth2/token",
                                jwksUri: Config.getDeploymentConfig().serverOrigin + "/t/" + switchingTenant + "/oauth2/jwks",
                                issuer: Config.getDeploymentConfig().serverOrigin + "/t/" + switchingTenant + "/oauth2/token",
                                // issuer: "https://api.eu.asg.io/o/ee9bf9e5-f446-4d5b-b9c0-41d9fcb8d890/oauth2/token",
                                endSessionEndpoint: Config.getDeploymentConfig().centralServerOrigin + "/t/a" + "/oidc/logout"
                            },
                            resourceServerURLs: [Config.getDeploymentConfig().serverOrigin]
                        }
                    );
                    response = await switchOrganization(getOrganizationName());
                    console.log("switching org response...", response)
                }
                console.log("found the response after the switch", response)
                await onSignIn(
                    response,
                    () => null,
                    (idToken: DecodedIDTokenPayload) => loginSuccessRedirect(idToken, isPrivilegedUser),
                    () => setRenderApp(true),
                    isPrivilegedUser,
                    associatedTenants
                );
            } catch(e) {
                // TODO: Handle error
            }
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

    const loginSuccessRedirect = (idToken: DecodedIDTokenPayload, isPrivilegedUser: boolean): void => {
        const AuthenticationCallbackUrl: string = CommonAuthenticateUtils.getAuthenticationCallbackUrl(
            CommonAppConstants.CONSOLE_APP
        );

        /**
         * Prevent redirect to landing page when there is no association.
         */
        if (commonConfig?.enableOrganizationAssociations) {

            let isOrgSwitch: boolean = false;

            if (has(idToken, "org_id") && has(idToken, "user_org")) {
                isOrgSwitch = (idToken?.org_id !== idToken?.user_org);
            }
            let isRegionalSwitch: boolean = false;
            isRegionalSwitch = idToken?.amr?.length > 0
                ? idToken?.amr[0] === "region_switch"
                : false;

            if (has(idToken, "associated_tenants") || isPrivilegedUser || isOrgSwitch || isRegionalSwitch) {
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
            } // else {
            //     // If there is no assocation, the user should be redirected to creation flow.
            //     history.push({
            //         pathname: AppConstants.getPaths().get(
            //             "CREATE_TENANT"
            //         )
            //     });
            // }
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

    const switchRegionalConsole = async (orgUserAssociations: string):  Promise<BasicUserInfo> => {
        const idTokenTemp: DecodedIDTokenPayload = await getDecodedIDToken();
        const unDecodedIdToken: string = await getIDToken();
        const isPrivilegedUser: boolean =
            idTokenTemp?.amr?.length > 0
                ? idTokenTemp?.amr[0] === "EnterpriseIDPAuthenticator"
                : false;



        let envid: string;
        if (isPrivilegedUser) {
            envid = JSON.parse(idTokenTemp?.login_environment)?.envUUID
            dispatch(setCurrentEnvironment(JSON.parse(idTokenTemp?.login_environment)));
        } else {
            envid = JSON.parse(idTokenTemp?.org_user_associations)[0]?.environments?.[0]?.envUUID;
        }
        let tenantDomainName: string = "";
        let b2bOrgId : string = "";
        // Ge th the tenant domain name from the session storage.
        if (sessionStorage.getItem("user_tenant")) {
            tenantDomainName = sessionStorage.getItem("user_tenant");
        }
        if (!isPrivilegedUser) {
            const associations: string = orgUserAssociations;
            const orgData = JSON.parse(associations);
            if (tenantDomainName != null && tenantDomainName !== "") {
                for (const org of orgData) {
                    const orgName: string = org.orgName;

                    if (orgName == tenantDomainName) {
                        for (const env of org.environments) {
                            // ATM we only need to consider the prod env switch.
                            // we need to improve this with env switcher.
                            if (env.envName === "prod") {
                                envid = env.envUUID;
                                b2bOrgId = env.b2bOrgUUID;
                                dispatch(setCurrentEnvironment(env));
                            }
                        }
                    }
                }
            } else {
                for (const org of orgData) {
                    for (const env of org.environments) {
                        if (env.isDefault) {
                            envid = env.envUUID;
                            dispatch(setCurrentEnvironment(env));
                            tenantDomainName = org.orgName;
                            b2bOrgId = env.b2bOrgUUID;
                            break;
                        }
                    }
                }

            }
            sessionStorage.setItem("associations", associations);
        } else {
            sessionStorage.setItem("associations", "[]");
        }
        let response: BasicUserInfo = null;
        await updateConfig(
            {
                endpoints: {
                    authorizationEndpoint: Config.getDeploymentConfig().serverOrigin + "/t/" + tenantDomainName + "/oauth2/authorize",
                    checkSessionIframe: Config.getDeploymentConfig().serverOrigin + "/t/" + tenantDomainName + "/oidc/checksession",
                    tokenEndpoint: Config.getDeploymentConfig().serverOrigin + "/t/" + tenantDomainName + "/oauth2/token",
                    jwksUri: Config.getDeploymentConfig().serverOrigin + "/t/" + tenantDomainName + "/oauth2/jwks",
                    issuer: Config.getDeploymentConfig().serverOrigin + "/o/" + b2bOrgId + "/oauth2/token",
                    // issuer: "https://api.eu.asg.io/o/ee9bf9e5-f446-4d5b-b9c0-41d9fcb8d890/oauth2/token",
                    endSessionEndpoint: Config.getDeploymentConfig().centralServerOrigin + "/t/a" + "/oidc/logout"
                },
                resourceServerURLs: [Config.getDeploymentConfig().serverOrigin]
            }
        );
        await requestCustomGrant(
            {
                attachToken: false,
                data: {
                    client_id: "CONSOLE",
                    grant_type: "region_switch",
                    scope:
                        window["AppUtils"]
                            .getConfig()
                            .idpConfigs?.scope.join(" ") ??
                        TokenConstants.SYSTEM_SCOPE,
                    environment_id: envid,
                    token: "{{token}}",
                    idToken: unDecodedIdToken
                },
                id: "regionalSwitch",
                returnsSession: true,
                signInRequired: true
            },
            async (grantResponse: BasicUserInfo) => {

                response = { ...grantResponse };
                const tenantDomain1: string =
                    CommonAuthenticateUtils.deriveTenantDomainFromSubject(grantResponse.sub);
                console.log("setting the tenant..", tenantDomain1)
                setTenant(tenantDomain1);

                console.log("dispatched tenant domain..", tenant)
            }
        );
        return response;
    };

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        filterRoutes(() => setRoutesFiltered(true), isFirstLevelOrg);
    }, [ filterRoutes, governanceConnectors, isAuthenticated, isFirstLevelOrg ]);

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
                    <SubscriptionProvider tierName={ tenantTier?.tierName ?? TenantTier.FREE }>
                        { renderApp && routesFiltered ? <App /> : <PreLoader /> }
                    </SubscriptionProvider>
                </I18nextProvider>
            </GovernanceConnectorProvider>
        </SecureApp>
    );
};
