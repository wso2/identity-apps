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
    AuthenticateSessionUtil,
    AuthenticateTokenKeys,
    AuthenticateUserKeys,
    OPConfigurationUtil,
    SignInUtil,
    SignOutUtil
} from "@wso2is/authenticate";
import * as React from "react";
import { ServiceResourcesEndpoint } from "../configs";
import { AuthContextInterface, AuthProviderInterface, createEmptyAuthContext } from "../models/auth";

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
        if (AuthenticateSessionUtil.getSessionParameter(AuthenticateTokenKeys.ACCESS_TOKEN)) {
            this.setState({
                displayName: AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.DISPLAY_NAME),
                emails: AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.EMAIL),
                isAuth: true,
                loginInit: true,
                logoutInit: false,
                username: AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.USERNAME),
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
        if (AuthenticateSessionUtil.getSessionParameter(AuthenticateTokenKeys.ACCESS_TOKEN)) {
            this.loginSuccessRedirect(location);
        } else {
            OPConfigurationUtil.initOPConfiguration(ServiceResourcesEndpoint.wellKnown, false)
                .then(() => {
                    this.doSignIn(location);
                }).catch(() => {
                    OPConfigurationUtil.setAuthorizeEndpoint(ServiceResourcesEndpoint.authorize);
                    OPConfigurationUtil.setTokenEndpoint(ServiceResourcesEndpoint.token);
                    OPConfigurationUtil.setRevokeTokenEndpoint(ServiceResourcesEndpoint.revoke);
                    OPConfigurationUtil.setEndSessionEndpoint(ServiceResourcesEndpoint.logout);
                    OPConfigurationUtil.setJwksUri(ServiceResourcesEndpoint.jwks);
                    OPConfigurationUtil.setOPConfigInitiated();
                    this.doSignIn(location);
                });
        }
    }

    private doSignIn(location) {
        const requestParams = {
            clientHost: CLIENT_HOST,
            clientId: CLIENT_ID,
            clientSecret: null,
            enablePKCE: true,
            redirectUri: LOGIN_CALLBACK_URL,
            scope: null,
        };
        if (SignInUtil.hasAuthorizationCode()) {
            SignInUtil.sendTokenRequest(requestParams)
                .then((response) => {
                    AuthenticateSessionUtil.initUserSession(response,
                        SignInUtil.getAuthenticatedUser(response.idToken));
                    this.updateState();
                    this.loginSuccessRedirect(location);
                }).catch((error) => {
                    throw error;
                });
        } else {
            SignInUtil.sendAuthorizationRequest(requestParams);
        }
    }

    private logout() {
        if (!this.state.logoutInit) {
            SignOutUtil.sendSignOutRequest(LOGIN_CALLBACK_URL).then(() => {
                this.setState({
                    logoutInit: true
                });
                AuthenticateSessionUtil.endAuthenticatedSession();
                OPConfigurationUtil.resetOPConfiguration();
            }).catch(
                // TODO show error page.
            );
        } else {
            this.props.history.push(APP_LOGIN_PATH);
        }
    }
}

const AuthConsumer = AuthContext.Consumer;

export {AuthProvider, AuthConsumer};
