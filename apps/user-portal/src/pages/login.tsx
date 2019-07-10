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
import { Link, RouteComponentProps } from "react-router-dom";
import { Button, Form } from "semantic-ui-react";
import { AuthConsumer, NotificationComponent, User } from "../components";
import { LoginPageLayout } from "../layouts";
import { createEmptyLogin, LoginEntity } from "../models/login";

interface Props extends RouteComponentProps<any, any> {}

const LoginPageInner = (props: Props) => {
    const [loginInfo, setLoginInfo] = React.useState<LoginEntity>(
        createEmptyLogin()
    );

    const { location } = props;

    const onUpdateLoginField = (name, value) => {
        setLoginInfo({
            ...loginInfo,
            [name]: value
        });
    };

    return (
        <>
            <LoginForm
                locationHistory={location}
                onUpdateField={onUpdateLoginField}
                loginInfo={loginInfo}
            />
        </>
    );
};

interface PropsForm {
    locationHistory: {
        state: {
            details: string;
        };
    };
    onUpdateField: (name: string, value: any) => void;
    loginInfo: LoginEntity;
}

const LoginForm = (props: PropsForm) => {
    const { locationHistory, onUpdateField, loginInfo } = props;

    const onTexFieldChange = (fieldId: string) => (e) => {
        onUpdateField(fieldId, e.target.value);
    };

    const location = (locationHistory.state !== undefined) ? locationHistory.state.details : APP_HOME_PATH;

    return (
        <LoginPageLayout pageTitle="Sign In">
            <AuthConsumer>
                {({ isAuth, login, logout, error, errorMessage, errorDiscription }) => (
                    !isAuth ? (
                        <>
                            <User size="small" />
                            {error && (
                                <NotificationComponent
                                    message={errorMessage}
                                    description={errorDiscription}
                                    negative
                                />
                            )}
                            <Form.Input
                                fluid
                                icon="user"
                                iconPosition="left"
                                placeholder="E-mail address"
                                value={loginInfo.username}
                                onChange={onTexFieldChange("username")}
                            />
                            <Form.Input
                                fluid
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                type="password"
                                value={loginInfo.password}
                                onChange={onTexFieldChange("password")}
                            />

                            <div className="login-buttons">
                                <Button
                                    size="large"
                                    color="orange"
                                    onClick={() => login(loginInfo, location)}
                                >
                                    Continue
                                </Button>
                            </div>
                        </>
                    ) : (
                        <Button
                            color="orange"
                            fluid
                            size="large"
                            onClick={logout}
                        >
                            Logout
                        </Button>
                    )
                )}
            </AuthConsumer>
        </LoginPageLayout>
    );
};

export const LoginPage = (LoginPageInner);
