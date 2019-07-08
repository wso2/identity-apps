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
import { Container, Dropdown, Menu } from "semantic-ui-react";
import { Title } from "../components";
import { AuthConsumer } from "./auth-context";

export const Header = () => (
    <Menu fixed="top">
        <Container>
            <Menu.Item as="a" header>
                <Title style={{marginTop: 0}} />
            </Menu.Item>
            <Menu.Item><Link to="/app-listing">Apps</Link></Menu.Item>
            <Menu.Item><Link to="/user-listing">Users</Link></Menu.Item>
            <AuthConsumer>
                {({ displayName, emails, username }) => (
                    <Menu.Menu position="right">
                        <Dropdown item floating text={displayName}>
                            <Dropdown.Menu>
                                <Dropdown.Header>{username} ({emails[0]})</Dropdown.Header>
                                <Dropdown.Divider />
                                <Dropdown.Item icon="setting" text="Settings" as={Link} to="/settings" />
                                <Dropdown.Item icon="theme" text="Change Theme" as={Link} to="/theme" />
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
