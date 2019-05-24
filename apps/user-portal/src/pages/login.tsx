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

import * as React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { createEmptyLogin, LoginEntity } from "../models/login";
import { isValidLogin } from "../api/login";
import { TitleComponent, NotificationComponent } from "../components";

interface Props extends RouteComponentProps {}

const LoginPageInner = (props: Props) => {
  const [loginInfo, setLoginInfo] = React.useState<LoginEntity>(
    createEmptyLogin()
  );
  const [showLoginFailedMsg, setShowLoginFailedMsg] = React.useState(false);
  //const { classes } = props;

  const onLogin = () => {
    isValidLogin(loginInfo)
        .then((res:boolean) => {
            if(res == true) {
                props.history.push("/app-listing");
            } else {
                setShowLoginFailedMsg(true);
            }
            
        });
  };

  const onUpdateLoginField = (name, value) => {
    setLoginInfo({
      ...loginInfo,
      [name]: value
    });
  };

  return (
    <>
        {/* <NotificationComponent
            message="Invalid login or password, please type again"
            show={showLoginFailedMsg}
            onClose={() => setShowLoginFailedMsg(false)}
        /> */}
        <LoginForm
            onLogin={onLogin}
            onUpdateField={onUpdateLoginField}
            loginInfo={loginInfo}
        />
    </>
  );
};

export const LoginPage = (withRouter<Props>(LoginPageInner));

interface PropsForm {
  onLogin: () => void;
  onUpdateField: (name: string, value: any) => void;
  loginInfo: LoginEntity;
}

const LoginForm = (props: PropsForm) => {
    const { onLogin, onUpdateField, loginInfo } = props;

    // TODO: Enhacement move this outside the stateless component discuss why is a good idea
    const onTexFieldChange = fieldId => e => {
        onUpdateField(fieldId, e.target.value);
    };

    return (
      <div className='login-form'>
            <style>
                {`
                    body > div,
                    body > div > div,
                    body > div > div > div.login-form {
                        height: 100%;
                    }
                `}
            </style>
            <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Form size='large'>
                        <Segment>
                            <TitleComponent />
                            <Header as='h2' color='orange' textAlign='center'>
                                Sign In
                        </Header>
                        </Segment>
                        <Segment stacked>
                            <Form.Input
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder='E-mail address'
                                value={loginInfo.username}
                                onChange={onTexFieldChange("username")}
                            />
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                value={loginInfo.password}
                                onChange={onTexFieldChange("password")}
                            />

                            <Button
                                color='orange'
                                fluid
                                size='large'
                                onClick={onLogin}
                            >
                                Login
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        New to us? <a href='#'>Sign Up</a>
                    </Message>
                </Grid.Column>
            </Grid>
        </div>
    );
};
