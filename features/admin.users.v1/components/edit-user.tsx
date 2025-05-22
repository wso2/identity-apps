/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { SCIMConfigs } from "@wso2is/admin.extensions.v1/configs/scim";
import { AlertInterface, IdentifiableComponentInterface, ProfileInfoInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Message, ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, TabProps } from "semantic-ui-react";
import { UserProfile } from "./user-profile";
import { AdminAccountTypes } from "../constants";
import useUserManagement from "../hooks/use-user-management";

interface EditUserPropsInterface extends IdentifiableComponentInterface {
    /**
     * User profile
     */
    user: ProfileInfoInterface;
    /**
     * Handle user update callback.
     */
    handleUserUpdate: (userId: string) => void;
    /**
     * Is the page loading
     */
    isLoading: boolean;
    /**
     * Whether the UI should be in read-only mode.
     */
    isReadOnly?: boolean;
    /**
     * Whether the user store is read-only.
     */
    isReadOnlyUserStore?: boolean;
}

/**
 * User edit component.
 *
 * @returns User edit component.
 */
export const EditUser: FunctionComponent<EditUserPropsInterface> = (
    props: EditUserPropsInterface
): JSX.Element => {

    const {
        user,
        handleUserUpdate,
        isReadOnly = false,
        isReadOnlyUserStore = false
    } = props;

    const { t } = useTranslation();
    const { activeTab, updateActiveTab } = useUserManagement();
    const dispatch: Dispatch = useDispatch();

    const [ isUserManagedByParentOrg, setIsUserManagedByParentOrg ] = useState<boolean>(false);

    useEffect(() => {
        if (user[ SCIMConfigs.scim.systemSchema ]?.managedOrg) {
            setIsUserManagedByParentOrg(true);
        }
    }, [ user ]);

    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert<AlertInterface>(alert));
    };

    const panes = () => ([
        {
            menuItem: t("users:editUser.tab.menuItems.0"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <UserProfile
                        adminUsername={ null }
                        onAlertFired={ handleAlerts }
                        user={ user }
                        handleUserUpdate={ handleUserUpdate }
                        isReadOnly={ isReadOnly }
                        connectorProperties={ null }
                        isReadOnlyUserStoresLoading={ false }
                        isReadOnlyUserStore={ isReadOnlyUserStore }
                        isUserManagedByParentOrg={ isUserManagedByParentOrg }
                        adminUserType={ AdminAccountTypes.INTERNAL }
                        allowDeleteOnly={
                            user[ SCIMConfigs.scim.systemSchema ]?.isReadOnlyUser === "true"
                        }
                        editUserDisclaimerMessage={ (
                            <Grid>
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 6 }>
                                        <Message
                                            type="info"
                                            content={ t("extensions:manage.users.editUserProfile.disclaimerMessage") }
                                        />
                                        <Divider hidden />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        ) }
                    />
                </ResourceTab.Pane>
            )
        }
    ]);

    return (
        <ResourceTab
            activeIndex={ activeTab }
            isLoading={ false }
            onTabChange={ (event: React.MouseEvent<HTMLDivElement>, data: TabProps) => {
                updateActiveTab(data.activeIndex as number);
            } }
            panes={ panes() }
        />
    );
};
