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

import {
    AppConfigInterface,
    ConfigReducerStateInterface,
    RuntimeConfigInterface,
    ServiceResourceEndpointsInterface
} from "./models";
import { ProtectedRoute } from "./components";
/**
 * @remarks
 * Always keep the `Config` & `history` import at the top of the order, to avoid
 * potential circular dependencies.
 */
// eslint-disable-next-line sort-imports
import { baseRoutes, Config } from "./configs";
// eslint-disable-next-line sort-imports
import { AppConfig, history } from "./helpers";
import React, { ReactElement, Suspense, useContext, useEffect, useState } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { setDeploymentConfigs, setServiceResourceEndpoints } from "@wso2is/core/store";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { ApplicationConstants } from "./constants";
import { AppState } from "./store";
import { ContentLoader } from "@wso2is/react-components";
import { getAppConfig } from "@wso2is/core/api";
import { Helmet } from "react-helmet";
import { helpPanelMetadata } from "./meta";
import { I18n } from "@wso2is/i18n";
import { I18nextProvider } from "react-i18next";
import { setHelpPanelMetadata } from "./store/actions";
import { ThemeContext } from "@wso2is/react-components";
import { emptyIdentityAppsSettings } from "@wso2is/core/models";
import { LocalStorageUtils } from "@wso2is/core/utils";
import { CommonHelpers } from "@wso2is/core/helpers";

/**
 * Main App component.
 *
 * @return {React.ReactElement}
 */
export const App = (): ReactElement => {

    const { state } = useContext(ThemeContext);

    const dispatch = useDispatch();

    const [ appConfig, setAppConfig ] = useState<AppConfigInterface>(null);
    const [ isAppLoading, setAppLoadingStatus ] = useState<boolean>(false);
    const userName: string = useSelector((state: AppState) => state.authenticationInformation.username);

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    /**
     * Set the deployment configs in redux state.
     */
    useEffect(() => {
        // Replace `RuntimeConfigInterface` with the proper deployment config interface,
        // once runtime config is refactored.
        dispatch(setDeploymentConfigs<RuntimeConfigInterface>(Config.getRuntimeConfig()));
        dispatch(setServiceResourceEndpoints<ServiceResourceEndpointsInterface>(Config.getServiceResourceEndpoints()));
    }, []);

    /**
     * Set the help panel metadata in redux state.
     */
    useEffect(() => {
        dispatch(setHelpPanelMetadata(helpPanelMetadata));
    }, []);

    /**
     * Set the app loading status based on the availability of configs.
     */
    useEffect(() => {
        if (config?.deployment && !_.isEmpty(config.deployment) && config?.endpoints && !_.isEmpty(config.endpoints)) {
            setAppLoadingStatus(false);
        }

        setAppLoadingStatus(true);
    }, [ config ]);

    /**
     * Obtain app.config.json from the server root when the app mounts.
     */
    useEffect(() => {
        if (!config?.deployment || _.isEmpty(config.deployment)) {
            return;
        }

        // Since the portals are not deployed per tenant, looking for static resources in tenant qualified URLs
        // will fail. Using `appBaseNameWithoutTenant` will create a path without the tenant. Therefore,
        // `getAppConfig()` will look for the app config file in `https://localhost:9443/admin-portal` rather than
        // looking it in `https://localhost:9443/t/wso2.com/admin-portal`.
        getAppConfig<AppConfigInterface>(ApplicationConstants.APP_CONFIG_FILE_NAME,
            config.deployment.appBaseNameWithoutTenant)
            .then((response) => {
                setAppConfig(response);
            })
            .catch(() => {
                // TODO: Log the error here.
            });
    }, [ config ]);

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

    return (
        <>
            {
                isAppLoading
                    ? (
                        <Router history={ history }>
                            <div className="container-fluid">
                                <I18nextProvider i18n={ I18n.instance }>
                                    <AppConfig.Provider value={ appConfig }>
                                        <Suspense fallback={ <ContentLoader dimmer/> }>
                                            <Helmet>
                                                <link
                                                    href={ `/libs/themes/${ state.theme }/theme.min.css` }
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
                                                    path="/"
                                                    to={ config.deployment.appLoginPath }
                                                />
                                                {
                                                    baseRoutes.map((route, index) => {
                                                        return (
                                                            route.protected ?
                                                                (
                                                                    <ProtectedRoute
                                                                        component={ route.component }
                                                                        path={ route.path }
                                                                        key={ index }
                                                                        exact={ route.exact }
                                                                    />
                                                                )
                                                                :
                                                                (
                                                                    <Route
                                                                        path={ route.path }
                                                                        render={ (props) =>
                                                                            (<route.component { ...props } />)
                                                                        }
                                                                        key={ index }
                                                                        exact={ route.exact }
                                                                    />
                                                                )
                                                        );
                                                    })
                                                }
                                            </Switch>
                                        </Suspense>
                                    </AppConfig.Provider>
                                </I18nextProvider>
                            </div>
                        </Router>
                    )
                    : <ContentLoader dimmer/>
            }
        </>
    );
};
