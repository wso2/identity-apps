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

import React from "react";
import { Button, Grid } from "semantic-ui-react";
import { RolesList } from "../components/roles";

/**
 * User Roles Listing Page
 *
 * @return {JSX.Element}
 */
export const UserRoles = (): JSX.Element => {
    return (
        <Grid>
            <Grid.Row width={ 16 } columns={ 2 }>
                <Grid.Column>
                    Roles Search
                </Grid.Column>
                <Grid.Column>
                    <Button icon="ellipsis horizontal" size="medium" floated="right"/>
                    <Button primary floated="right" size="medium">+ ADD ROLE</Button>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row width={ 16 }>
                <RolesList />
            </Grid.Row>
        </Grid>
    );
}