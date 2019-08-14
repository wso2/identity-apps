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

import * as React from "react";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { Dimmer, Loader } from "semantic-ui-react";
import { AuthConsumer, AuthProvider } from "./components/auth-context";
import ProtectedRoute from "./components/protected-route";
import { i18n } from "./helpers";
import history from "./helpers/history";
import {
    AccountRecoveryPage,
    ConsentsPage,
    HomePage,
    PageNotFound,
    UserProfilePage
} from "./pages";
import configureStore from "./redux/store";

const store = configureStore();

const LoginPage = (props) => {
    props.loginFunction(history.location.pathname);
    return null;
};

const LogoutPage = (props) => {
    props.logoutFunction();
    return null;
};

class App extends React.Component<any, any> {
    public render() {
        return (
            <Router history={history}>
                <div className="container-fluid">
                    <I18nextProvider i18n={i18n}>
                        <Provider store={store}>
                            <AuthProvider history={history}>
                                <AuthConsumer>
                                    {({ login, logout, isAuth }) => (
                                        <>
                                            {(!isAuth) &&
                                                <Dimmer active inverted>
                                                    <Loader>Loading</Loader>
                                                </Dimmer>
                                            }
                                            <Switch>
                                                <Redirect exact path="/" to="/login" />
                                                <Route path="/login" render={(props) => (
                                                    <LoginPage loginFunction={login} {...props} />
                                                )} />
                                                <Route path="/logout" render={(props) => (
                                                    <LogoutPage logoutFunction={logout} {...props} />
                                                )} />
                                                <ProtectedRoute path="/home" component={HomePage} />
                                                <ProtectedRoute component={UserProfilePage} path="/profile"/>
                                                <ProtectedRoute
                                                    component={AccountRecoveryPage}
                                                    path="/account-security"
                                                />
                                                <ProtectedRoute component={ConsentsPage} path="/consent" />
                                                <ProtectedRoute component={PageNotFound} />
                                            </Switch>
                                        </>
                                    )}
                                </AuthConsumer>
                            </AuthProvider>
                        </Provider>
                    </I18nextProvider>
                </div>
            </Router>
        );
    }
}

export default App;
