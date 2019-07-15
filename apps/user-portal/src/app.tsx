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
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { isLoggedIn } from "./actions/login";
import { AuthConsumer, AuthProvider, } from "./components/auth-context";
import ProtectedRoute from "./components/protected-route";
import history from "./helpers/history";
import {
    HomePage,
    LoginPage,
    PageNotFound
} from "./pages";

const LogoutPage = (props) => {
    props.logoutFuntion();
    return null;
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: false
        };
    }

    public componentWillMount() {
        if (isLoggedIn()) {
            this.setState({ isAuth: true });

            const loginInfo = {
                password: sessionStorage.getItem("loginPassword") || "",
                username: sessionStorage.getItem("loginUsername") || ""
            };
            // TODO: Stop login redirection by checking the session
            // const value = this.context;
            // console.log(value);
            // AuthProvider.login(loginInfo, history.location.pathname);
        }
    }

    public render() {
        return (
            <Router history={history}>
                <div className="container-fluid">
                    <AuthProvider history={history}>
                        <AuthConsumer>
                            {({ logout }) => (
                                <Switch>
                                    <Redirect exact path="/" to="/login" />
                                    <Route path="/login" component={LoginPage} />
                                    <Route path="/logout" render={(props) => (
                                        <LogoutPage logoutFuntion={logout} {...props}/>
                                    )} />
                                    <ProtectedRoute path="/home" component={HomePage} />
                                    <ProtectedRoute component={PageNotFound} />
                                </Switch>
                            )}
                        </AuthConsumer>
                    </AuthProvider>
                </div>
            </Router>
        );
    }
}

export default App;
