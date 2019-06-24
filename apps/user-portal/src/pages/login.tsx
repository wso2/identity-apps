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
import { RouteComponentProps } from "react-router-dom";
import { Button, Form, Grid, Header, Message, Segment } from "semantic-ui-react";
import { AuthConsumer, NotificationComponent, Title, User } from "../components";
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

    const location = (locationHistory.state !== undefined) ? locationHistory.state.details : "/app-listing";

    return (
      <div className="login-form">
            <style>
                {`
                    body > div,
                    body > div > div,
                    body > div > div > div.login-form {
                        height: 100%;
                    }
                `}
            </style>
            <Grid textAlign="center" style={{ height: "100%" }} verticalAlign="middle">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <AuthConsumer>
                        {({ isAuth, login, logout, error }) => (
                            !isAuth ? (
                                <>
                                    <Form size="large">
                                        <Segment>
                                            <Title />
                                            <Header as="h3" textAlign="center">
                                                Sign In
                                            </Header>
                                            <User size="small" />
                                            {error && (
                                                <NotificationComponent
                                                    message="Invalid login or password, please type again"
                                                    type="error"
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

                                            <Button
                                                color="orange"
                                                fluid
                                                size="large"
                                                onClick={() => login(loginInfo, location)}
                                            >
                                                Login
                                            </Button>
                                        </Segment>
                                    </Form>
                                    <Message>
                                        New to us? <a href="#">Sign Up</a>
                                    </Message>
                                </>
                            ) : (
                                <>
                                    <Form size="large">
                                        <Segment>
                                            <Button
                                                color="orange"
                                                fluid
                                                size="large"
                                                onClick={logout}
                                            >
                                                Logout
                                            </Button>
                                        </Segment>
                                    </Form>
                                </>
                            )
                        )}
                    </AuthConsumer>
                </Grid.Column>
            </Grid>
        </div>
    );
};

export const LoginPage = (LoginPageInner);
