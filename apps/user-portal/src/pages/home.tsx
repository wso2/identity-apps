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
import { Card, Divider } from "semantic-ui-react";
import { HomeTileIcon } from "../components";
import { InnerPageLayout } from "../layouts";

export const HomePage = () => (
    <InnerPageLayout pageTitle="Manage your Identity Account" pageTitleTextAlign="center">
        <Card.Group centered>
            <Card as={Link} to="/profile" className="margin-x1">
                <Card.Content textAlign="center" className="padding-x2">
                    <HomeTileIcon icon="Profile" />
                    <Divider hidden />
                    <Card.Header>Profile</Card.Header>
                    <Divider hidden />
                    <Card.Description>
                        Manage basic infomations, like your name and photo, that you use on. And account
                        associations etc ...
                    </Card.Description>
                </Card.Content>
            </Card>
            <Card as={Link} to="/account-security" className="margin-x1">
                <Card.Content textAlign="center" className="padding-x2">
                    <HomeTileIcon icon="Security" />
                    <Divider hidden />
                    <Card.Header>Account Security</Card.Header>
                    <Divider hidden />
                    <Card.Description>
                        Configure account secuirty measures, like Password, Account Recovery Options, 
                        Multi-factor Authentication etc ...
                    </Card.Description>
                </Card.Content>
            </Card>
            <Card as={Link} to="/consent" className="margin-x1">
                <Card.Content textAlign="center" className="padding-x2">
                    <HomeTileIcon icon="Consent" />
                    <Divider hidden />
                    <Card.Header>Apps & Websites</Card.Header>
                    <Divider hidden />
                    <Card.Description>
                        Monitor & manage account activities, Both active and inactive, Manage 
                        given consents etc ...
                    </Card.Description>
                </Card.Content>
            </Card>
        </Card.Group>
    </InnerPageLayout>
);
