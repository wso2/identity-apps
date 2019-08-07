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
import {
    dispatchLogin,
    dispatchLogout,
    getSessionParameter,
    isValidSession,
    resetAuthenticatedSession
} from "../actions";
import {AuthContextInterface, AuthProviderInterface, createEmptyAuthContext} from "../models/auth";
import {DISPLAY_NAME, EMAIL, USERNAME} from "../helpers/constants";

const AuthContext = React.createContext<AuthContextInterface | null>(null);

class AuthProvider extends React.Component<AuthProviderInterface, any> {
    constructor(props) {
        super(props);
        this.state = createEmptyAuthContext();
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    public componentWillMount() {
        if (!this.state.isAuth) {
            this.updateState();
        }
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
                    logoutInit: this.state.logoutInit,
                    username: this.state.username,
                }}
            >
                {this.props.children}
            </AuthContext.Provider>
        );
    }

    private updateState() {
        if (isValidSession()) {
            this.setState({
                displayName: getSessionParameter(DISPLAY_NAME),
                emails: getSessionParameter(EMAIL),
                isAuth: true,
                loginInit: true,
                logoutInit: false,
                username: getSessionParameter(USERNAME),
            });
        } else {
            this.setState({...createEmptyAuthContext()});
        }
    }

    private loginSuccessRedirect(location) {
        location = (location === APP_LOGIN_PATH) ? APP_HOME_PATH : location;
        this.props.history.push(location);
    }

    private login(location) {
        if (isValidSession()) {
            this.loginSuccessRedirect(location);
        } else {
            if (!this.state.loginInit) {
                dispatchLogin()
                    .then(() => {
                        if (isValidSession()) {
                            this.updateState();
                            this.loginSuccessRedirect(location);
                        }
                    })
                    .catch(
                        //TODO show error page.
                    );
            }
        }
    }

    private logout() {
        if (!this.state.logoutInit) {
            dispatchLogout()
                .then(() => {
                    this.setState({
                        logoutInit: true
                    });
                    resetAuthenticatedSession();
                })
                .catch(
                    //TODO show error page.
                );
        } else {
            this.props.history.push(APP_LOGIN_PATH);
        }
    }
}

const AuthConsumer = AuthContext.Consumer;

export {AuthProvider, AuthConsumer};
