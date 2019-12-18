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

import React from "react";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { ProtectedRoute } from "./components";
import { SignIn, SignOut } from "./components/authentication";
import { i18n, routes } from "./configs";
import { history } from "./helpers";
import { store } from "./store";

/**
 * Main App component.
 *
 * @return {JSX.Element}
 */
export const App = (): JSX.Element => {

    return (
        <Router history={ history }>
            <div className="container-fluid">
                <I18nextProvider i18n={ i18n }>
                    <Provider store={ store }>
                        <Switch>
                            <Redirect exact={ true } path="/" to={ APP_LOGIN_PATH } />
                            <Route
                                path={ APP_LOGIN_PATH }
                                render={ (props) => {
                                    return <SignIn { ...props }/>;
                                } }
                            />
                            <Route
                                path="/logout"
                                render={ () => {
                                    return <SignOut />;
                                } }
                            />
                            {
                                routes.map((route, index) => {
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
                            }
                        </Switch>
                    </Provider>
                </I18nextProvider>
            </div>
        </Router>
    );
};
