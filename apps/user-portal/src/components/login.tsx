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
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

/**
 *
 * @extends React.Component
 */
class LoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username:'',
            password:''
        }
    }

    handleClick(event) {
        var apiBaseUrl = "http://localhost:4000/api/";
        var self = this;
        var payload = {
            "email": this.state.username,
            "password": this.state.password
        }
        axios.post(apiBaseUrl + 'login', payload)
            .then(function (response) {
                console.log(response);
                if (response.data.code == 200) {
                    console.log("Login successfull");
                    var uploadScreen = [];
                    uploadScreen.push(<UploadScreen appContext={self.props.appContext} />)
                    self.props.appContext.setState({ loginPage: [], uploadScreen: uploadScreen })
                }
                else if (response.data.code == 204) {
                    console.log("Username password do not match");
                    alert("username password do not match")
                }
                else {
                    console.log("Username does not exists");
                    alert("Username does not exist");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    /**
     * @inheritdoc
     */
    public render() {
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
                        <Header as='h2' color='orange' textAlign='center'>
                            <Image src='/logo.png' /> Log-in to your account
                        </Header>
                        <Form size='large'>
                            <Segment stacked>
                                <Form.Input
                                    fluid
                                    icon='user'
                                    iconPosition='left'
                                    placeholder='E-mail address'
                                    onChange = {(event, newValue) => this.setState({username:newValue})}
                                />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    onChange = {(event, newValue) => this.setState({password:newValue})}
                                />

                                <Button
                                    color='orange'
                                    fluid
                                    size='large'
                                    onClick={(event) => this.handleClick(event)}
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
    }
}

export default LoginForm;
