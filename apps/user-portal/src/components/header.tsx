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
import { Link } from "react-router-dom";
import { Button, Container, Divider, Dropdown, Item, Menu } from "semantic-ui-react";
import { Title } from "../components";
import { AuthConsumer } from "./auth-context";
import { UserImageDummy } from "./ui";

export const Header = () => (
    <Menu fixed="top" borderless>
        <Container>
            <Menu.Item as={Link} to={APP_HOME_PATH} header>
                <Title style={{marginTop: 0}} />
            </Menu.Item>
            <AuthConsumer>
                {({ displayName, emails, username }) => (
                    <Menu.Menu position="right">
                        <Dropdown
                            item
                            floating
                            text={(displayName !== "undefined") ? displayName : username}
                            className="user-dropdown">
                            <Dropdown.Menu>
                                <Item.Group>
                                    <Item className="header">
                                        <Item.Image size="tiny" circular src={UserImageDummy} />

                                        <Item.Content verticalAlign="middle">
                                            <Item.Description>
                                                <div>{username}</div>
                                                {(emails !== "undefined") &&
                                                    <div>{emails}</div>
                                                }
                                                <Divider hidden />
                                                <Button as={Link} to="/profile" size="tiny" primary>Profile</Button>
                                            </Item.Description>
                                        </Item.Content>
                                    </Item>
                                </Item.Group>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                    icon="lock"
                                    as={Link}
                                    to="/account-security"
                                    text="Account Security" />
                                <Dropdown.Item
                                    icon="handshake outline"
                                    as={Link}
                                    to="/consent"
                                    text="Consent Management" />
                                <Dropdown.Divider />
                                <Dropdown.Item as={Link} to="/logout" text="Logout" />
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Menu>
                )}
            </AuthConsumer>
        </Container>
    </Menu>
);
