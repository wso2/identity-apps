/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Divider, Dropdown, Grid } from "semantic-ui-react";
import { getUsersList } from "../api";
import { AddUser, UserSearch, UsersList } from "../components/users";
import { AlertInterface, AlertLevels } from "../models";
import { addAlert } from "../store/actions";

/**
 * Users info page.
 *
 * @return {JSX.Element}
 */
export const UsersPage: React.FunctionComponent<any> = (): JSX.Element => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ searchQuery, setSearchQuery ] = useState("");
    const [ isBasicModalOpen, setModalOpen ] = useState(false);
    const [ isRoleModalOpen, setRoleModalOpen] = useState(false);
    const [ usersList, setUsersList ] = useState([]);

    useEffect(() => {
        getList();
    }, []);

    const getList = () => {
        getUsersList()
            .then((response) => {
                handleAlerts({
                    description: t(
                        "views:components.users.notifications.fetchUsers.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "views:components.users.notifications.fetchUsers.success.message"
                    )
                });
                setUsersList(response.data.Resources);
            });
    };

    /**
     * Dispatches the alert object to the redux store.
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Handles the `onFilter` callback action from the
     * users search component.
     *
     * @param {string} query - Search query.
     */
    const handleApplicationFilter = (query: string): void => {
        setSearchQuery(query);
    };

    const handleModalOpen = (): void => {
        setModalOpen(true);
    };

    const handleModalClose = (): void => {
        setModalOpen(false);
    };

    const handleRoleModalOpen = (): void => {
        setRoleModalOpen(true);
        setModalOpen(false);
    };

    const handleRoleModalClose = (): void => {
        setRoleModalOpen(false);
    };

    const options = [
        { key: "import", icon: "download", text: "Import users", value: "import" },
        { key: "export", icon: "upload", text: "Export users", value: "export" },
    ];

    return (
            <Grid>
                <Grid.Row width={ 16 } columns={ 2 }>
                    <Grid.Column>
                        <UserSearch onFilter={ handleApplicationFilter }/>
                    </Grid.Column>
                    <Grid.Column>
                        <Button
                            trigger={ <React.Fragment /> }
                            icon="ellipsis horizontal"
                            size="medium"
                            floated="right"
                        />
                        <Button
                            primary
                            floated="right"
                            size="medium"
                            onClick={ handleModalOpen }
                        >
                            + ADD USER
                        </Button>
                        <AddUser
                            getUserList={ getList }
                            isBasicModalOpen={ isBasicModalOpen }
                            handleModalClose={ handleModalClose }
                            isRoleModalOpen={ isRoleModalOpen }
                            handleRoleModalOpen={ handleRoleModalOpen }
                            handleRoleModalClose={ handleRoleModalClose }
                            onAlertFired={ handleAlerts }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Divider/>
                <Grid.Row width={ 16 }>
                    <UsersList usersList={ usersList }/>
                </Grid.Row>
            </Grid>
    );
};
