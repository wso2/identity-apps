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
import { clearLoginSession, dispatchLogin, getUserInfo } from "../actions";
import { AuthContextInterface, AuthProviderInterface, createEmptyAuthContext } from "../models/auth";

const AuthContext = React.createContext<AuthContextInterface | null>(null);

class AuthProvider extends React.Component<AuthProviderInterface, any> {
    constructor(props) {
        super(props);
        this.state = createEmptyAuthContext();
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    public render() {
        return (
            <AuthContext.Provider
                value={{
                    displayName: this.state.displayName,
                    emails: this.state.emails,
                    isAuth: this.state.isAuth,
                    login: this.login,
                    loginInit: this.state.loginInit,
                    logout: this.logout,
                    username: this.state.username,
                }}
            >
                {this.props.children}
            </AuthContext.Provider>
        );
    }

    private setLoginDetails(response, location) {
        if (!this.state.loginInit) {
            this.setState({
                displayName: response.displayName,
                emails: response.emails,
                isAuth: true,
                loginInit: true,
                username: response.username,
            });
        }

        location = (location === APP_LOGIN_PATH) ? APP_HOME_PATH : location;
        this.props.history.push(location);
    }

    private login(location) {
        dispatchLogin()
            .then(() => {
                getUserInfo()
                    .then((response) => {
                        this.setLoginDetails(response, location);
                    });
            });
    }

    private logout() {
        this.setState(createEmptyAuthContext());
        clearLoginSession();
        this.props.history.push(APP_LOGIN_PATH);
    }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };
