/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { useAuthContext } from "@asgardeo/auth-react";
import { CommonHelpers, isPortalAccessGranted } from "@wso2is/core/helpers";
import { RouteInterface, emptyIdentityAppsSettings } from "@wso2is/core/models";
import { LocalStorageUtils, StringUtils } from "@wso2is/core/utils";
import {
    I18n,
    I18nInstanceInitException,
    I18nModuleConstants,
    LanguageChangeException,
    isLanguageSupported
} from "@wso2is/i18n";
import {
    ChunkErrorModal,
    Code,
    NetworkErrorModal,
    SessionManagementProvider,
    SessionTimeoutModalTypes
} from "@wso2is/react-components";
import axios from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { ReactElement, Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { I18nextProvider, Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { PreLoader, ProtectedRoute } from "./components";
import { Config, getAppRoutes } from "./configs";
import { AppConstants } from "./constants";
import { history } from "./helpers";
import {
    ConfigReducerStateInterface,
    FeatureConfigInterface
} from "./models";
import { AppState, store } from "./store";
import { setSupportedI18nLanguages } from "./store/actions";
import { EventPublisher, filterRoutes } from "./utils";

/**
 * Main App component.
 *
 * @return {React.Element}
 */
export const App = (): ReactElement => {

    const userName: string = useSelector((state: AppState) => state.authenticationInformation.username);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const loginInit: boolean = useSelector((state: AppState) => state.authenticationInformation.loginInit);
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    const appTitle: string = useSelector((state: AppState) => state?.config?.ui?.appTitle);
    const UUID: string = useSelector((state: AppState) => state.authenticationInformation.profileInfo.id);

    const [ appRoutes, setAppRoutes ] = useState<RouteInterface[]>(getAppRoutes());

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const { trySignInSilently } = useAuthContext();

    /**
     * Load localization files.
     */
    useEffect(() => {
        // If `appBaseNameWithoutTenant` is "", avoids adding a forward slash.
        const resolvedAppBaseNameWithoutTenant: string = StringUtils.removeSlashesFromPath(
            Config.getDeploymentConfig().appBaseNameWithoutTenant
        )
            ? `/${StringUtils.removeSlashesFromPath(Config.getDeploymentConfig().appBaseNameWithoutTenant)}`
            : "";

        const metaFileNames = I18nModuleConstants.META_FILENAME.split(".");
        const metaFileName = `${metaFileNames[0]}.${process.env.metaHash}.${metaFileNames[1]}`;

        // Since the portals are not deployed per tenant, looking for static resources in tenant qualified URLs
        // will fail. This constructs the path without the tenant, therefore it'll look for the file in
        // `https://localhost:9443/<PORTAL>/resources/i18n/meta.json` rather than looking for the file in
        // `https://localhost:9443/t/wso2.com/<PORTAL>/resources/i18n/meta.json`.
        const metaPath = `${resolvedAppBaseNameWithoutTenant}/${StringUtils.removeSlashesFromPath(
            Config.getI18nConfig().resourcePath
        )}/${metaFileName}`;

        // Fetch the meta file to get the supported languages.
        axios
            .get(metaPath)
            .then((response) => {
                // Set up the i18n module.
                I18n.init(
                    {
                        ...Config.getI18nConfig(response?.data)?.initOptions,
                        debug: window["AppUtils"].getConfig().debug
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
    }, []);

    /**
     * Set the deployment configs in redux state.
     */
    useEffect(() => {
        sessionStorageDisabled();
    }, []);

    /**
     * Listen for base name changes and updated the routes.
     */
    useEffect(() => {
        setAppRoutes(getAppRoutes());
    }, [ AppConstants.getTenantQualifiedAppBasename() ]);

    /**
     * Checks if the portal access should be granted based on the feature config.
     */
    useEffect(() => {
        if (!config?.ui?.features || !loginInit) {
            return;
        }

        if (isPortalAccessGranted<FeatureConfigInterface>(config?.ui?.features, allowedScopes)) {
            return;
        }

        history.push(AppConstants.getPaths().get("UNAUTHORIZED"));
    }, [ loginInit, allowedScopes, config ]);

    /**
     * Set the application settings of the user to the local storage.
     */
    useEffect(() => {
        if (!userName && userName === "") {
            return;
        }

        const tenant = config?.deployment?.tenant;
        const tenantAppSettings = JSON.parse(LocalStorageUtils.getValueFromLocalStorage(tenant));
        const appSettings = {};

        appSettings[userName] = emptyIdentityAppsSettings();

        if (!tenantAppSettings) {
            LocalStorageUtils.setValueInLocalStorage(tenant, JSON.stringify(appSettings));
        } else {
            if (CommonHelpers.lookupKey(tenantAppSettings, userName) === null) {
                const newUserSettings = {
                    ...tenantAppSettings,
                    [ userName ]: emptyIdentityAppsSettings()
                };
                LocalStorageUtils.setValueInLocalStorage(tenant, JSON.stringify(newUserSettings));
            }
        }

    }, [ config?.deployment?.tenant, userName ]);

    /**
    * Publish page visit when the UUID is set.
    */
    useEffect(() => {
        if(!UUID) {
            return;
        }

        eventPublisher.publish("page-visit-myaccount-landing-page");
    }, [UUID]);

    /**
     * Handles session timeout abort.
     *
     * @param {URL} url - Current URL.
     */
    const handleSessionTimeoutAbort = (url: URL): void => {
        history.push({
            pathname: url.pathname,
            search: url.search
        });
    };

    /**
     * Handles session logout.
     */
    const handleSessionLogout = (): void => {
        history.push(AppConstants.getAppLogoutPath());
    };

    const sessionStorageDisabled = () => {
        try {
            const storage = sessionStorage;
            if (!storage && location.pathname !== AppConstants.getPaths().get("STORING_DATA_DISABLED")) {
                history.push(AppConstants.getPaths().get("STORING_DATA_DISABLED"));
            }
        } catch {
            if (true && location.pathname !== AppConstants.getPaths().get("STORING_DATA_DISABLED")) {
                history.push(AppConstants.getPaths().get("STORING_DATA_DISABLED"));
            }
        }
    };

    /**
     * Handles the `stay logged in` option of the session management modal.
     * Sets a URL search param to notify the session management iframe to
     * do the necessary actions.
     */
    const handleStayLoggedIn = (): void => {
        trySignInSilently()
            .then((response) => {
                if (response === false) {
                    history.push(AppConstants.getAppLogoutPath());
                } else {
                    window.history.replaceState(null, null, window.location.pathname);
                }
            })
            .catch(() => {
                history.push(AppConstants.getAppLogoutPath());
            });
    };

    return (
        <>
            {
                (!isEmpty(config?.deployment) && !isEmpty(config?.endpoints))
                    ? (
                        <Router history={ history }>
                            <div className="container-fluid">
                                <I18nextProvider i18n={ I18n.instance }>
                                    <Suspense fallback={ <PreLoader /> }>
                                        <SessionManagementProvider
                                            onSessionTimeoutAbort={ handleSessionTimeoutAbort }
                                            onSessionLogout={ handleSessionLogout }
                                            onLoginAgain={ handleStayLoggedIn }
                                            modalOptions={ {
                                                description: (
                                                    <Trans
                                                        i18nKey={
                                                            "myAccount:common.modals.sessionTimeoutModal.description"
                                                        }
                                                    >
                                                        When you click on the <Code>Go back</Code> button, we will
                                                        try to recover the session if it exists. If you don&apos;t
                                                        have an active session, you will be redirected to the login
                                                        page
                                                    </Trans>
                                                ),
                                                headingI18nKey: "myAccount:common.modals.sessionTimeoutModal.heading",
                                                loginAgainButtonText: I18n.instance.t("myAccount:common:modals" +
                                                    ".sessionTimeoutModal.loginAgainButton"),
                                                primaryButtonText: I18n.instance.t("myAccount:modals." +
                                                    "sessionTimeoutModal.primaryButton"),
                                                secondaryButtonText: I18n.instance.t("myAccount:common.modals" +
                                                    ".sessionTimeoutModal.secondaryButton"),
                                                sessionTimedOutDescription: I18n.instance.t("myAccount:common:" +
                                                    "modals.sessionTimeoutModal.sessionTimedOutDescription"),
                                                sessionTimedOutHeadingI18nKey: "myAccount:common:modals" +
                                                    ".sessionTimeoutModal.sessionTimedOutHeading"
                                            } }
                                            type={ SessionTimeoutModalTypes.DEFAULT }
                                        >
                                            <>
                                                <Helmet>
                                                    <title>{ appTitle }</title>
                                                </Helmet>
                                                <NetworkErrorModal
                                                    heading={ I18n.instance.t("common:networkErrorMessage.heading") }
                                                    description={ I18n.instance.t("common:networkErrorMessage" +
                                                        ".description") }
                                                    primaryActionText={ I18n.instance.t("common:networkErrorMessage" +
                                                        ".primaryActionText") }
                                                />
                                                <ChunkErrorModal
                                                    heading={ I18n.instance.t("common:chunkLoadErrorMessage.heading") }
                                                    description={ I18n.instance.t("common:chunkLoadErrorMessage" +
                                                        ".description") }
                                                    primaryActionText={ I18n.instance.t("common:chunkLoadErrorMessage" +
                                                        ".primaryActionText") }
                                                />
                                                <Switch>
                                                    <Redirect exact from="/" to={ AppConstants.getAppHomePath() } />
                                                    {
                                                        config
                                                            ? filterRoutes(appRoutes, config)
                                                                .map((route, index) => {
                                                                    return (
                                                                        route.redirectTo
                                                                            ? <Redirect
                                                                                to={ route.redirectTo }
                                                                                path={ route.path }
                                                                            />
                                                                            : route.protected ?
                                                                                (
                                                                                    <ProtectedRoute
                                                                                        component={ route.component }
                                                                                        path={ route.path }
                                                                                        key={ index }
                                                                                        route={ route }
                                                                                        exact={ route.exact }
                                                                                    />
                                                                                )
                                                                                :
                                                                                (
                                                                                    <Route
                                                                                        path={ route.path }
                                                                                        render={ (props) => (
                                                                                            <route.component
                                                                                                { ...props }
                                                                                            />
                                                                                        ) }
                                                                                        key={ index }
                                                                                        exact={ route.exact }
                                                                                    />
                                                                                )
                                                                    );
                                                                })
                                                            : null
                                                    }
                                                </Switch>
                                            </>
                                        </SessionManagementProvider>
                                    </Suspense>
                                </I18nextProvider>
                            </div>
                        </Router>
                    )
                    : <PreLoader />
            }
        </>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default App;
