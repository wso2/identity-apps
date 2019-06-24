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
import { isValidLogin } from "../actions/login";

interface AuthProviderInterface {
    history: any;
}

interface AppContextInterface {
    children?: any;
    isAuth: boolean;
    error: boolean;
    login: (loginInfo: object, location: string) => void;
    logout: () => void;
}

const AuthContext = React.createContext<AppContextInterface | null>(null);

class AuthProvider extends React.Component<AuthProviderInterface, any> {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            isAuth: false
        };
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    public render() {
        return (
            <AuthContext.Provider
                value={{
                    error: this.state.error,
                    isAuth: this.state.isAuth,
                    login: this.login,
                    logout: this.logout
                }}
            >
                {this.props.children}
            </AuthContext.Provider>
        );
    }

    private login(loginInfo, location) {
        isValidLogin(loginInfo)
            .then((response: boolean) => {
                if (response) {
                    this.setState({
                        error: false,
                        isAuth: true
                    });
                    this.props.history.push(location);
                } else {
                    this.setState({
                        error: true,
                        isAuth: false
                    });
                }
            });
    }

    private logout() {
        this.setState({
            error: false,
            isAuth: false
        });
        this.props.history.push("/login");
    }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };
