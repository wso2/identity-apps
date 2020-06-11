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

import { CommonDeploymentConfigInterface } from "@wso2is/core//models";
import { getAppConfig } from "@wso2is/core/api";
import {
    setDeploymentConfigs,
    setFeatureConfigs,
    setI18nConfigs,
    setServiceResourceEndpoints,
    setUIConfigs
} from "@wso2is/core/store";
import { I18n, I18nModuleOptionsInterface } from "@wso2is/i18n";
import { ContentLoader } from "@wso2is/react-components";
import _ from "lodash";
import React, { ReactElement, Suspense, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { ProtectedRoute } from "./components";
import { SignIn, SignOut } from "./components/authentication";
import { Config } from "./configs";
import { ApplicationConstants } from "./constants";
import { AppConfig, history } from "./helpers";
import {
    ConfigInterface,
    ConfigReducerStateInterface,
    FeatureConfigInterface,
    ServiceResourceEndpointsInterface,
    UIConfigInterface
} from "./models";
import { AppState } from "./store";
import { filteredRoutes } from "./utils";

/**
 * Main App component.
 *
 * @return {React.Element}
 */
export const App = (): ReactElement => {

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const dispatch = useDispatch();
    const [ isAppLoading, setAppLoadingStatus ] = useState<boolean>(false);

    /**
     * Set the deployment configs in redux state.
     */
    useEffect(() => {
        // Replace `RuntimeConfigInterface` with the proper deployment config interface,
        // once runtime config is refactored.
        dispatch(setDeploymentConfigs<CommonDeploymentConfigInterface>(Config.getDeploymentConfig()));
        dispatch(setServiceResourceEndpoints<ServiceResourceEndpointsInterface>(Config.getServiceResourceEndpoints()));
        dispatch(setI18nConfigs<I18nModuleOptionsInterface>(Config.getI18nConfig()));
        dispatch(setUIConfigs<UIConfigInterface>(Config.getUIConfig()));
    }, []);

    /**
     * Obtain app.config.json from the server root when the app mounts.
     */
    useEffect(() => {
        if (!config?.deployment || _.isEmpty(config.deployment) || !config.deployment.appBaseNameWithoutTenant) {
            return;
        }

        // Since the portals are not deployed per tenant, looking for static resources in tenant qualified URLs
        // will fail. Using `appBaseNameWithoutTenant` will create a path without the tenant. Therefore,
        // `getAppConfig()` will look for the app config file in `https://localhost:9443/user-portal` rather than
        // looking it in `https://localhost:9443/t/wso2.com/user-portal`.
        getAppConfig<ConfigInterface>(ApplicationConstants.APP_CONFIG_FILE_NAME,
            config.deployment.appBaseNameWithoutTenant)
            .then((response) => {
                dispatch(setFeatureConfigs<FeatureConfigInterface>(response?.features));
            })
            .catch(() => {
                // TODO: Log the error here.
            });
    }, [ config?.deployment?.appBaseNameWithoutTenant ]);

    /**
     * Set the app loading status based on the availability of configs.
     */
    useEffect(() => {
        if (config?.deployment && !_.isEmpty(config.deployment) && config?.endpoints && !_.isEmpty(config.endpoints)) {
            setAppLoadingStatus(false);
        }

        setAppLoadingStatus(true);
    }, [ config ]);

    return (
        <Router history={ history }>
            <div className="container-fluid">
                <I18nextProvider i18n={ I18n.instance }>
                    <Suspense fallback={ <ContentLoader dimmer/> }>
                        <AppConfig.Provider value={ config }>
                            <Switch>
                                <Redirect exact={ true } path="/" to={ window["AppUtils"].getConfig().routes.login } />
                                <Route
                                    path={ window["AppUtils"].getConfig().routes.login }
                                    render={ (props) => {
                                        return <SignIn { ...props } />;
                                    } }
                                />
                                <Route
                                    path={ window["AppUtils"].getConfig().routes.logout }
                                    render={ () => {
                                        return <SignOut />;
                                    } }
                                />
                                {
                                    config
                                        ? filteredRoutes(config).map((route, index) => {
                                            return (
                                                route.protected ?
                                                    (
                                                        <ProtectedRoute
                                                            component={ route.component }
                                                            path={ route.path }
                                                            key={ index }
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
                                                        />
                                                    )
                                            );
                                        })
                                        : null
                                }
                            </Switch>
                        </AppConfig.Provider>
                    </Suspense>
                </I18nextProvider>
            </div>
        </Router>
    );
};
