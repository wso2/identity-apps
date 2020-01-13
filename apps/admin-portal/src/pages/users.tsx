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

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid } from "semantic-ui-react";
import { UserSearch, UsersList } from "../components/users";
import { InnerPageLayout } from "../layouts";

/**
 * Users info page.
 *
 * @return {JSX.Element}
 */
export const UsersPage = (): JSX.Element => {
    const { t } = useTranslation();
    const [ searchQuery, setSearchQuery ] = useState("");

    /**
     * Handles the `onFilter` callback action from the
     * application search component.
     *
     * @param {string} query - Search query.
     */
    const handleApplicationFilter = (query: string): void => {
        setSearchQuery(query);
    };

    return (
        <InnerPageLayout
            pageTitle={ t("views:components.users.all.heading") }
            pageDescription={ t("views:components.users.all.subHeading") }
        >
            <Grid>
                <Grid.Row width={ 16 } columns={ 2 }>
                    <Grid.Column>
                        <UserSearch onFilter={ handleApplicationFilter }/>
                    </Grid.Column>
                    <Grid.Column>
                        <Button icon="ellipsis horizontal" size="medium" floated="right"/>
                        <Button primary floated="right" size="medium">+ ADD USER</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row width={ 16 }>
                    <UsersList/>
                </Grid.Row>
            </Grid>
        </InnerPageLayout>
    );
};
