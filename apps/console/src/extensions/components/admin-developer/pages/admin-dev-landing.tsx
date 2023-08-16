/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Card, Divider, Grid, Icon, Radio } from "semantic-ui-react";
import AdminDevPage from "./admin-dev";
import UsersPage from "./users";
import { getInvitedUserList } from "../api";
import { UserInviteInterface } from "../models";
import { AddAdminDeveloperWizard } from "../wizard";

/**
 * Enum for Invite Validation Status.
 *
 * @readonly
 * @enum {string}
 */
export enum UserListOptions {
    ONBOARD = "ONBOARD",
    INVITE = "INVITE",
}

/**
 * Props for the Users page.
 */
type UsersPageInterface = TestableComponentInterface;

const AdminDevLandingPage: FunctionComponent<UsersPageInterface> = (
    props: UsersPageInterface
): ReactElement => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ selectedUserList, setSelectedUserList ] = useState<UserListOptions | string>(UserListOptions.ONBOARD);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ updateInviteList, setUpdateInviteList ] = useState<boolean>(false);
    const [ totalAdminDevList, setTotalAdminDevList ] = useState<UserInviteInterface[]>([]);
    const [ isUserListRequestLoading, setUserListRequestLoading ] = useState<boolean>(false);
    const [ hideAddWizardButton, setHideAddWizardButton ] = useState<boolean>(false);

    const getList = () => {
        setUserListRequestLoading(true);

        getInvitedUserList()
            .then((response) => {
                const data = [ ...response.data ];
                const invitations = data as UserInviteInterface[];
                const finalInvitations: UserInviteInterface[] = [];

                invitations.map((ele) => {
                    const invite: UserInviteInterface = {
                        id: ele.id,
                        email: ele.email,
                        roles: ele.roles,
                        status: ele.status
                    };
                    finalInvitations.push(invite);
                });
                if (finalInvitations.length < 1) {
                    setHideAddWizardButton(true);
                } else {
                    setHideAddWizardButton(false);
                }

                setTotalAdminDevList(finalInvitations);
            }).catch((error) => {
            if (error?.response?.data?.description) {
                dispatch(addAlert({
                    description: error?.response?.data?.description ?? error?.response?.data?.detail
                        ?? t("console:manage.features.users.notifications.fetchUsers.error.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        ?? t("console:manage.features.users.notifications.fetchUsers.error.message")
                }));

                return;
            }

            dispatch(addAlert({
                description: t("console:manage.features.users.notifications.fetchUsers.genericError." +
                    "description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.users.notifications.fetchUsers.genericError.message")
            }));

        })
            .finally(() => {
                setUserListRequestLoading(false);
            });
    };

    useEffect(() => {
        if (updateInviteList) {
            getList();
            setUpdateInviteList(false);
        }
    }, [ updateInviteList ]);

    useEffect(() => {
        getList();
    }, []);

    /**
     * Handles the click event of the invite new user button.
     */
    const handleAddNewUserWizardClick = (): void => {
        setShowWizard(true);
    };

    /**
     * Handles the click event of the invite new user button.
     */
    const getRadioButtonClass = (selected: string): string => {
        if (selectedUserList === selected) {
            return "mr-2 invite-selection selected";
        } else {
            return "mr-2 invite-selection";
        }

    };

    return (
        <PageLayout
            title={ t("console:manage.pages.invite.title") }
            description={ t("console:manage.pages.invite.subTitle") }
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 14 } computer={ 14 }>
                        <Card.Group>
                            <Card
                                link={ false }
                                as={ "div" }
                                className={ "basic-card" }
                                onClick={ () => setSelectedUserList(UserListOptions.ONBOARD) }
                            >
                                <Card.Content>
                                    <Radio
                                        className={ getRadioButtonClass(UserListOptions.ONBOARD) }
                                        checked={ selectedUserList === UserListOptions.ONBOARD }
                                    />
                                    { t("console:manage.features.invite.subSelection.onBoard") }
                                </Card.Content>
                            </Card>
                            <Card
                                link={ false }
                                as={ "div" }
                                className={ "basic-card" }
                                onClick={ () => setSelectedUserList(UserListOptions.INVITE) }
                            >
                                <Card.Content>
                                    <Radio
                                        className={ getRadioButtonClass(UserListOptions.INVITE) }
                                        checked={ selectedUserList === UserListOptions.INVITE }
                                    />
                                    { t("console:manage.features.invite.subSelection.invitees") }
                                </Card.Content>
                            </Card>
                        </Card.Group>

                    </Grid.Column>
                    { !hideAddWizardButton && (
                        <Grid.Column
                            mobile={ 16 }
                            tablet={ 3 }
                            computer={ 2 }
                            className={ "invite-button" }
                            floated="right"
                        >
                            <PrimaryButton
                                data-testid="user-mgt-user-list-add-user-button"
                                onClick={ handleAddNewUserWizardClick }
                                floated="right"
                            >
                                <Icon name="add"/>
                                { t("console:manage.features.invite.inviteButton") }
                            </PrimaryButton>
                        </Grid.Column>
                    )
                    }
                </Grid.Row>

            </Grid>
            <Divider hidden/>
            {
                (selectedUserList === UserListOptions.INVITE) &&
                <AdminDevPage
                    updateInviteList={ updateInviteList }
                    setUpdateInviteList={ setUpdateInviteList }
                    setHideAddWizardButton={ setHideAddWizardButton }
                    setShowWizard={ setShowWizard }
                    setTotalAdminDevList={ setTotalAdminDevList }
                    totalAdminDevList={ totalAdminDevList }
                    isUserListRequestLoading={ isUserListRequestLoading }
                />
            }
            {
                (selectedUserList === UserListOptions.ONBOARD) && <UsersPage/>
            }
            {
                showWizard && (
                    <AddAdminDeveloperWizard
                        setUserListRequestLoading={ setUserListRequestLoading }
                        data-testid="user-mgt-add-user-wizard-modal"
                        closeWizard={ () => {
                            setShowWizard(false);
                        } }
                        updateInviteListWizard={ () => {
                            setUserListRequestLoading(true);
                            setUpdateInviteList(true);
                            setSelectedUserList(UserListOptions.INVITE);
                        } }
                    />
                )
            }
        </PageLayout>
    );
};

export default AdminDevLandingPage;
