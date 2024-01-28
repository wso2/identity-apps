/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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
    Hooks,
    SecureApp,
    useAuthContext
} from "@asgardeo/auth-react";
import { AppConstants as AppConstantsCore } from "@wso2is/core/constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { setSupportedI18nLanguages } from "@wso2is/core/store";
import { AuthenticateUtils, StringUtils } from "@wso2is/core/utils";
import {
    I18n,
    I18nInstanceInitException,
    I18nModuleConstants,
    LanguageChangeException,
    isLanguageSupported
} from "@wso2is/i18n";
import axios, { AxiosResponse } from "axios";
import React, { FunctionComponent, LazyExoticComponent, ReactElement, lazy, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { useSelector } from "react-redux";
import { PreLoader } from "./components";
import { Config } from "./configs";
import { AppConstants } from "./constants";
import { history } from "./helpers";
import useSignIn from "./hooks/use-sign-in";
import { BrandingPreferenceProvider } from "./providers";
import { AppState, store } from "./store";
import { onHttpRequestError, onHttpRequestFinish, onHttpRequestStart, onHttpRequestSuccess } from "./utils";

const App: LazyExoticComponent<() => ReactElement> = lazy(() => import("./app"));

type AppPropsInterface = IdentifiableComponentInterface;

/**
 * This component warps the `App` component with the `SecureApp` component to provide automatic authentication.
 *
 * @returns ProtectedApp component
 */
export const ProtectedApp: FunctionComponent<AppPropsInterface> = (): ReactElement => {
    const {
        on,
        signIn,
        state: { isAuthenticated }
    } = useAuthContext();

    const { onSignIn } = useSignIn();

    const tenantDomain: string = useSelector((state: AppState) => state.authenticationInformation.tenantDomain);

    useEffect(() => {
        on(Hooks.HttpRequestError, onHttpRequestError);
        on(Hooks.HttpRequestFinish, onHttpRequestFinish);
        on(Hooks.HttpRequestStart, onHttpRequestStart);
        on(Hooks.HttpRequestSuccess, onHttpRequestSuccess);

        on(Hooks.SignIn, async (response: BasicUserInfo) => {
            await onSignIn(response);
        });
    }, []);

    const loginSuccessRedirect = (): void => {
        const AuthenticationCallbackUrl: string = AuthenticateUtils.getAuthenticationCallbackUrl(
            AppConstantsCore.MY_ACCOUNT_APP
        );

        const location: string =
            !AuthenticationCallbackUrl || AuthenticationCallbackUrl === AppConstants.getAppLoginPath()
                ? AppConstants.getAppHomePath()
                : AuthenticationCallbackUrl;

        history.push(location);
    };

    /**
     * Get the organization name from the URL.
     * @returns Organization name.
     */
    const getOrganizationName = (): string => {
        const path: string = window.location.pathname;
        const pathChunks: string[] = path.split("/");

        const orgPrefixIndex: number = pathChunks.indexOf("o");

        if (orgPrefixIndex !== -1) {
            return pathChunks[ orgPrefixIndex + 1 ];
        }

        return "";
    };

    useEffect(() => {
        const error: string = new URLSearchParams(location.search).get("error_description");

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

        const metaFileNames: string[] = I18nModuleConstants.META_FILENAME.split(".");
        const metaFileName: string = `${ metaFileNames[ 0 ] }.${ process.env.metaHash }.${ metaFileNames[ 1 ] }`;

        // Since the portals are not deployed per tenant, looking for static resources in tenant qualified URLs
        // will fail. This constructs the path without the tenant, therefore it'll look for the file in
        // `https://localhost:9443/<PORTAL>/resources/i18n/meta.json` rather than looking for the file in
        // `https://localhost:9443/t/wso2.com/<PORTAL>/resources/i18n/meta.json`.
        const metaPath: string = `${ resolvedAppBaseNameWithoutTenant }/${ StringUtils.removeSlashesFromPath(
            Config.getI18nConfig().resourcePath
        ) }/${ metaFileName }`;

        // Fetch the meta file to get the supported languages.
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

                    const isSupported: boolean = isLanguageSupported(I18n.instance.language, null, response?.data);

                    if (!isSupported) {
                        I18n.instance.changeLanguage(I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE)
                            .catch((error: string) => {
                                throw new LanguageChangeException(I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE, error);
                            });
                    }
                });
            })
            .catch((error: string) => {
                throw new I18nInstanceInitException(error);
            });
    }, [ isAuthenticated ]);

    return (
        <BrandingPreferenceProvider
            tenantDomain={ getOrganizationName() !== "" ? getOrganizationName() : tenantDomain }
        >
            <SecureApp
                fallback={ <PreLoader /> }
                onSignIn={ loginSuccessRedirect }
                overrideSignIn={ async () => {
                    // This is to prompt the SSO page if a user tries to sign in
                    // through a federated IdP using an existing email address.
                    if (new URL(location.href).searchParams.get("prompt")) {
                        await signIn({ prompt: "login" });
                    } else {
                        const authParams: {
                            fidp?: string;
                            orgId?: string;
                        } = {};

                        if (getOrganizationName()) {
                            const initialUserOrgInLocalStorage: string = localStorage.getItem("user-org");
                            const orgIdInLocalStorage: string = localStorage.getItem("org-id");

                            if (orgIdInLocalStorage) {
                                if (orgIdInLocalStorage === getOrganizationName()
                                    && initialUserOrgInLocalStorage !== "undefined") {
                                    authParams["fidp"] = "OrganizationSSO";
                                    authParams["orgId"] = getOrganizationName();
                                }
                            } else {
                                authParams["fidp"] = "OrganizationSSO";
                                authParams["orgId"] = getOrganizationName();
                            }
                        }

                        await signIn(authParams);
                    }
                } }
            >
                <I18nextProvider i18n={ I18n.instance }>

                    <App />
                </I18nextProvider>
            </SecureApp>
        </BrandingPreferenceProvider>

    );
};
