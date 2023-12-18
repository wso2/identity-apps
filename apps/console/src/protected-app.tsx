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
import useRoutes from "./features/core/hooks/use-routes";
import useOrganizationSwitch from "./features/organizations/hooks/use-organization-switch";
import {
    GovernanceCategoryForOrgsInterface,
    useGovernanceConnectorCategories
} from "./features/server-configurations";

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
        state: { isAuthenticated }
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

    const {
        data: originalConnectorCategories,
        error: connectorCategoriesFetchRequestError
    } = useGovernanceConnectorCategories(
        featureConfig?.server?.enabled && isFirstLevelOrg);

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
            let response: BasicUserInfo = null;

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

            try {
                if (getOrganizationName()) {
                    response = await switchOrganization(getOrganizationName());
                } else {
                    response = { ...signInResponse };
                }

                await onSignIn(
                    response,
                    () => null,
                    (idToken: DecodedIDTokenPayload) => loginSuccessRedirect(idToken),
                    () => setRenderApp(true)
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

            let isOrgSwitch: boolean = false;

            if (has(idToken, "org_id") && has(idToken, "user_org")) {
                isOrgSwitch = (idToken?.org_id !== idToken?.user_org);
            }
            if (has(idToken, "associated_tenants") || isPrivilegedUser || isOrgSwitch) {
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
