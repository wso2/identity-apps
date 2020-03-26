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

import React, { useEffect, useState, Suspense, ReactElement } from "react";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { ProtectedRoute } from "./components";
import { baseRoutes, GlobalConfig } from "./configs";
import { AppConfig, history } from "./helpers";
import { AppConfigInterface } from "./models";
import { store } from "./store";
import { ContentLoader } from "@wso2is/react-components";
import { I18n } from "@wso2is/i18n";
import { getAppConfig } from "@wso2is/core/api";
import { ApplicationConstants } from "./constants";

/**
 * Main App component.
 *
 * @return {JSX.Element}
 */
export const App = (): ReactElement => {

    const [ appConfig, setAppConfig ] = useState<AppConfigInterface>(null);

    /**
     * Obtain app.config.json from the server root when the app mounts.
     */
    useEffect(() => {
        // Since the portals are not deployed per tenant, looking for static resources in tenant qualified URLs
        // will fail. Using `appBaseNameWithoutTenant` will create a path without the tenant. Therefore,
        // `getAppConfig()` will look for the app config file in `https://localhost:9443/admin-portal` rather than
        // looking it in `https://localhost:9443/t/wso2.com/admin-portal`.
        getAppConfig<AppConfigInterface>(ApplicationConstants.APP_CONFIG_FILE_NAME,
            GlobalConfig.appBaseNameWithoutTenant)
            .then((response) => {
                setAppConfig(response);
            })
            .catch(() => {
                // TODO: Log the error here.
            });
    }, []);

    return (
        <Router history={ history }>
            <div className="container-fluid">
                <I18nextProvider i18n={ I18n.instance }>
                    <Provider store={ store }>
                        <AppConfig.Provider value={ appConfig }>
                            <Suspense fallback={ <ContentLoader dimmer /> }>
                                <Switch>
                                    <Redirect exact={ true } path="/" to={ GlobalConfig.appLoginPath }/>
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
                    </Provider>
                </I18nextProvider>
            </div>
        </Router>
    );
};
