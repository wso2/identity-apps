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

import { CommonHelpers, isPortalAccessGranted } from "@wso2is/core/helpers";
import { RouteInterface, emptyIdentityAppsSettings } from "@wso2is/core/models";
import {
    setDeploymentConfigs,
    setI18nConfigs,
    setServiceResourceEndpoints,
    setUIConfigs
} from "@wso2is/core/store";
import { LocalStorageUtils } from "@wso2is/core/utils";
import { I18n, I18nModuleOptionsInterface } from "@wso2is/i18n";
import { ContentLoader, SessionManagementProvider, ThemeContext } from "@wso2is/react-components";
import _ from "lodash";
import React, { ReactElement, Suspense, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { I18nextProvider } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { ProtectedRoute } from "./components";
import { Config, getAppRoutes } from "./configs";
import { AppConstants } from "./constants";
import { history } from "./helpers";
import {
    ConfigReducerStateInterface,
    DeploymentConfigInterface,
    FeatureConfigInterface,
    ServiceResourceEndpointsInterface,
    UIConfigInterface
} from "./models";
import { AppState } from "./store";
import { initializeAuthentication } from "./store/actions";
import { filterRoutes } from "./utils";

/**
 * Main App component.
 *
 * @return {React.Element}
 */
export const App = (): ReactElement => {

    const { state } = useContext(ThemeContext);

    const dispatch = useDispatch();

    const userName: string = useSelector((state: AppState) => state.authenticationInformation.username);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const loginInit: boolean = useSelector((state: AppState) => state.authenticationInformation.loginInit);
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);

    const [ appRoutes, setAppRoutes ] = useState<RouteInterface[]>(getAppRoutes());

    /**
     * Set the deployment configs in redux state.
     */
    useEffect(() => {
        dispatch(initializeAuthentication());
        sessionStorageDisabled();
    }, []);

    /**
     * Set the deployment configs in redux state.
     */
    useEffect(() => {
        dispatch(setDeploymentConfigs<DeploymentConfigInterface>(Config.getDeploymentConfig()));
        dispatch(setServiceResourceEndpoints<ServiceResourceEndpointsInterface>(Config.getServiceResourceEndpoints()));
        dispatch(setI18nConfigs<I18nModuleOptionsInterface>(Config.getI18nConfig()));
        dispatch(setUIConfigs<UIConfigInterface>(Config.getUIConfig()));
    }, [ AppConstants.getTenantQualifiedAppBasename() ]);

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

    return (
        <>
            {
                (!_.isEmpty(config?.deployment) && !_.isEmpty(config?.endpoints))
                    ? (
                        <Router history={ history }>
                            <div className="container-fluid">
                                <I18nextProvider i18n={ I18n.instance }>
                                    <Suspense fallback={ <ContentLoader dimmer/> }>
                                        <SessionManagementProvider
                                            onSessionTimeoutAbort={ handleSessionTimeoutAbort }
                                            onSessionLogout={ handleSessionLogout }
                                            modalOptions={ {
                                                description: I18n.instance.t("myAccount:modals" +
                                                    ".sessionTimeoutModal.description"),
                                                headingI18nKey: "myAccount:modals.sessionTimeoutModal.heading",
                                                primaryButtonText: I18n.instance.t("myAccount:modals" +
                                                    ".sessionTimeoutModal.primaryButton"),
                                                secondaryButtonText: I18n.instance.t("myAccount:modals" +
                                                    ".sessionTimeoutModal.secondaryButton")
                                            } }
                                        >
                                            <>
                                                <Helmet>
                                                    <link
                                                        rel="shortcut icon"
                                                        href={ `${ window[ "AppUtils" ].getConfig().clientOrigin }/` +
                                                        `${ window[ "AppUtils" ].getConfig().appBase }/libs/themes/` +
                                                        `${ state.theme }/assets/images/favicon.ico` }
                                                    />
                                                    <link
                                                        href={ `${ window[ "AppUtils" ].getConfig().clientOrigin }/` +
                                                        `${ window[ "AppUtils" ].getConfig().appBase }/libs/themes/` +
                                                        `${ state.theme }/theme.min.css` }
                                                        rel="stylesheet"
                                                        type="text/css"
                                                    />
                                                    <style type="text/css">
                                                        { state.css }
                                                    </style>
                                                </Helmet>
                                                <Switch>
                                                    <Redirect
                                                        exact={ true }
                                                        path={ AppConstants.getPaths().get("ROOT") }
                                                        to={ AppConstants.getAppLoginPath() }
                                                    />
                                                    <Redirect
                                                        exact={ true }
                                                        path={ AppConstants.getAppBasePath() }
                                                        to={ AppConstants.getAppLoginPath() }
                                                    />
                                                    <Redirect
                                                        exact={ true }
                                                        path={ AppConstants.getTenantQualifiedAppBasePath() }
                                                        to={ AppConstants.getAppLoginPath() }
                                                    />
                                                    {
                                                        config
                                                            ? filterRoutes(appRoutes, config)
                                                                .map((route, index) => {
                                                                    return (
                                                                        route.protected ?
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
                    : <ContentLoader dimmer/>
            }
        </>
    );
};
